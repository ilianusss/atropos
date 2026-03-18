import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../../store/AppContext';
import { GAMES } from '../../data/games';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import GameListItem from '../../components/games/GameListItem';
import SegmentedControl from '../../components/ui/SegmentedControl';

type SortMode = 'most-played' | 'a-z';

const SORT_OPTIONS: [{ label: string; value: SortMode }, { label: string; value: SortMode }] = [
  { label: 'Most Played', value: 'most-played' },
  { label: 'A – Z', value: 'a-z' },
];

export default function GamesScreen() {
  const state = useAppState();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sortMode, setSortMode] = useState<SortMode>('most-played');

  const sortedGames = useMemo(() => {
    if (sortMode === 'a-z') {
      return [...GAMES].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...GAMES].sort((a, b) => {
      const totalA =
        (state.scores[a.id]?.baloo ?? 0) + (state.scores[a.id]?.chiante ?? 0);
      const totalB =
        (state.scores[b.id]?.baloo ?? 0) + (state.scores[b.id]?.chiante ?? 0);
      return totalB - totalA;
    });
  }, [sortMode, state.scores]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>Games</Text>
        <SegmentedControl
          options={SORT_OPTIONS}
          value={sortMode}
          onChange={setSortMode}
        />
      </View>
      <FlatList
        data={sortedGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const score = state.scores[item.id] ?? { baloo: 0, chiante: 0 };
          const rating = state.ratings[item.id] ?? { baloo: null, chiante: null };
          return (
            <GameListItem
              game={item}
              balooScore={score.baloo}
              chianteScore={score.chiante}
              balooRating={rating.baloo}
              chianteRating={rating.chiante}
              onPress={() => router.push(`/game/${item.id}`)}
            />
          );
        }}
        contentContainerStyle={{
          paddingVertical: SPACING.sm,
          paddingBottom: insets.bottom + SPACING.xl,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.md + SPACING.sm,
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
  },
  title: {
    fontFamily: FONTS.londrina.black,
    fontSize: 42,
    color: COLORS.primary,
    letterSpacing: 2,
  },
});
