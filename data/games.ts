export type Game = {
  id: string;
  name: string;
  cover: number;
};

export const GAMES: Game[] = [
  {
    id: '7-wonders-duel',
    name: '7 Wonders Duel',
    cover: require('../assets/images/7-wonders-duel-cover.png'),
  },
  {
    id: '7-wonders-duel-agora',
    name: '7 Wonders Duel: Agora',
    cover: require('../assets/images/7-wonders-duel-agora-cover.png'),
  },
  {
    id: '7-wonders-duel-pantheon',
    name: '7 Wonders Duel: Pantheon',
    cover: require('../assets/images/7-wonders-duel-pantheon-cover.png'),
  },
  {
    id: 'chess',
    name: 'Chess',
    cover: require('../assets/images/chess-cover.png'),
  },
  {
    id: 'toy-battle',
    name: 'Toy Battle',
    cover: require('../assets/images/toy-battle-cover.png'),
  },
  {
    id: 'champ-dhonneur',
    name: "Champ d'Honneur",
    cover: require('../assets/images/champ-dhonneur-cover.png'),
  },
  {
    id: 'zenith',
    name: 'Zenith',
    cover: require('../assets/images/zenith-cover.png'),
  },
  {
    id: 'schotten-totten',
    name: 'Schotten Totten',
    cover: require('../assets/images/schotten-totten-cover.png'),
  },
  {
    id: 'chateau-combo',
    name: 'Chateau Combo',
    cover: require('../assets/images/chateau-combo-cover.png'),
  },
  {
    id: 'district-noir',
    name: 'District Noir',
    cover: require('../assets/images/district-noir-cover.png'),
  },
  {
    id: 'dracula-vs-van-helsing',
    name: 'Dracula vs Van Helsing',
    cover: require('../assets/images/dracula-vs-van-helsing-cover.png'),
  },
  {
    id: 'fliptoons',
    name: 'Fliptoons',
    cover: require('../assets/images/fliptoons-cover.png'),
  },
  {
    id: 'a-wild-venture',
    name: 'A Wild Venture',
    cover: require('../assets/images/a-wild-venture-cover.png'),
  },
  {
    id: 'innovation-4',
    name: 'Innovation 4th',
    cover: require('../assets/images/innovation-4-cover.png'),
  },
];
