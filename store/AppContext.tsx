import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMES } from '../data/games';
import type { PlayerId } from '../constants/players';

export type Scores = Record<string, { baloo: number; chiante: number }>;
export type Ratings = Record<string, { baloo: number | null; chiante: number | null }>;
export type Rankings = { baloo: string[]; chiante: string[] };

export type MarathonMatch = {
  gameId: string;
  winner: 'baloo' | 'chiante' | 'tie';
};

export type Marathon = {
  id: string;
  name: string;
  date: string; // ISO date string
  matches: MarathonMatch[];
};

export function getMarathonWinner(matches: MarathonMatch[]): 'baloo' | 'chiante' | 'tie' {
  let baloo = 0;
  let chiante = 0;
  for (const m of matches) {
    if (m.winner === 'baloo') baloo++;
    else if (m.winner === 'chiante') chiante++;
  }
  if (baloo > chiante) return 'baloo';
  if (chiante > baloo) return 'chiante';
  return 'tie';
}

export type AppState = {
  scores: Scores;
  ratings: Ratings;
  rankings: Rankings;
  marathons: Marathon[];
};

type Action =
  | { type: 'UPDATE_SCORE'; gameId: string; player: PlayerId; delta: number }
  | { type: 'SET_RATING'; gameId: string; player: PlayerId; rating: number | null }
  | { type: 'SET_RANKINGS'; player: PlayerId; rankings: string[] }
  | { type: 'ADD_MARATHON'; marathon: Marathon }
  | { type: 'UPDATE_MARATHON'; marathon: Marathon }
  | { type: 'DELETE_MARATHON'; id: string }
  | { type: 'HYDRATE'; state: Partial<AppState> };

const defaultScores: Scores = Object.fromEntries(
  GAMES.map((g) => [g.id, { baloo: 0, chiante: 0 }])
);

const defaultRatings: Ratings = Object.fromEntries(
  GAMES.map((g) => [g.id, { baloo: null, chiante: null }])
);

const defaultRankings: Rankings = {
  baloo: GAMES.map((g) => g.id),
  chiante: GAMES.map((g) => g.id),
};

const initialState: AppState = {
  scores: defaultScores,
  ratings: defaultRatings,
  rankings: defaultRankings,
  marathons: [],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SCORE': {
      const current = state.scores[action.gameId] ?? { baloo: 0, chiante: 0 };
      const marathonMin = state.marathons.reduce((acc, m) => {
        return acc + m.matches.filter((x) => x.gameId === action.gameId && x.winner === action.player).length;
      }, 0);
      const newValue = Math.max(marathonMin, current[action.player] + action.delta);
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.gameId]: { ...current, [action.player]: newValue },
        },
      };
    }
    case 'SET_RATING': {
      const current = state.ratings[action.gameId] ?? { baloo: null, chiante: null };
      return {
        ...state,
        ratings: {
          ...state.ratings,
          [action.gameId]: { ...current, [action.player]: action.rating },
        },
      };
    }
    case 'SET_RANKINGS': {
      return {
        ...state,
        rankings: {
          ...state.rankings,
          [action.player]: action.rankings,
        },
      };
    }
    case 'ADD_MARATHON': {
      // Atomically sync global scores: +1 per winner for each non-tie match
      const newScores = { ...state.scores };
      for (const match of action.marathon.matches) {
        if (match.winner === 'tie') continue;
        const cur = newScores[match.gameId] ?? { baloo: 0, chiante: 0 };
        newScores[match.gameId] = {
          ...cur,
          [match.winner]: cur[match.winner] + 1,
        };
      }
      return {
        ...state,
        scores: newScores,
        marathons: [action.marathon, ...state.marathons],
      };
    }
    case 'UPDATE_MARATHON': {
      const oldMarathon = state.marathons.find((m) => m.id === action.marathon.id);
      const newScores = { ...state.scores };
      // Undo old marathon contributions
      if (oldMarathon) {
        for (const match of oldMarathon.matches) {
          if (match.winner === 'tie') continue;
          const cur = newScores[match.gameId] ?? { baloo: 0, chiante: 0 };
          newScores[match.gameId] = { ...cur, [match.winner]: Math.max(0, cur[match.winner] - 1) };
        }
      }
      // Apply new marathon contributions
      for (const match of action.marathon.matches) {
        if (match.winner === 'tie') continue;
        const cur = newScores[match.gameId] ?? { baloo: 0, chiante: 0 };
        newScores[match.gameId] = { ...cur, [match.winner]: cur[match.winner] + 1 };
      }
      return {
        ...state,
        scores: newScores,
        marathons: state.marathons.map((m) =>
          m.id === action.marathon.id ? action.marathon : m
        ),
      };
    }
    case 'DELETE_MARATHON': {
      const deleted = state.marathons.find((m) => m.id === action.id);
      const newScores = { ...state.scores };
      if (deleted) {
        for (const match of deleted.matches) {
          if (match.winner === 'tie') continue;
          const cur = newScores[match.gameId] ?? { baloo: 0, chiante: 0 };
          newScores[match.gameId] = { ...cur, [match.winner]: Math.max(0, cur[match.winner] - 1) };
        }
      }
      return {
        ...state,
        scores: newScores,
        marathons: state.marathons.filter((m) => m.id !== action.id),
      };
    }
    case 'HYDRATE': {
      const allIds = GAMES.map((g) => g.id);
      const merge = (saved: string[]) => [
        ...saved,
        ...allIds.filter((id) => !saved.includes(id)),
      ];
      return {
        scores: { ...defaultScores, ...action.state.scores },
        ratings: { ...defaultRatings, ...action.state.ratings },
        rankings: {
          baloo: merge(action.state.rankings?.baloo ?? defaultRankings.baloo),
          chiante: merge(action.state.rankings?.chiante ?? defaultRankings.chiante),
        },
        marathons: action.state.marathons ?? [],
      };
    }
    default:
      return state;
  }
}

const StateContext = createContext<AppState>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => {});
export const HydratedContext = createContext(false);

const STORAGE_KEY = '@atropos/state_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          const saved = JSON.parse(json) as Partial<AppState>;
          dispatch({ type: 'HYDRATE', state: saved });
        } catch {}
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  return (
    <HydratedContext.Provider value={hydrated}>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    </HydratedContext.Provider>
  );
}

export const useAppState = () => useContext(StateContext);
export const useAppDispatch = () => useContext(DispatchContext);
export const useHydrated = () => useContext(HydratedContext);
