import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LeaderboardItem from '../../components/leaderboard/LeaderboardItem';
import PlayerSelector from '../../components/leaderboard/PlayerSelector';
import type { PlayerId } from '../../constants/players';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { GAMES, type Game } from '../../data/games';
import { useAppDispatch, useAppState } from '../../store/AppContext';

type RankedGame = Game & { rank: number };

export default function LeaderboardScreen() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [activePlayer, setActivePlayer] = useState<PlayerId>('baloo');
  const [isEditing, setIsEditing] = useState(false);

  const rankedGames: RankedGame[] = state.rankings[activePlayer]
    .filter((id) => {
      const s = state.scores[id];
      return s && (s.baloo > 0 || s.chiante > 0);
    })
    .map((id) => GAMES.find((g) => g.id === id)!)
    .filter(Boolean)
    .map((game, index) => ({ ...game, rank: index + 1 }));

  const handleDragEnd = useCallback(
    ({ data }: { data: RankedGame[] }) => {
      const playedIds = data.map((g) => g.id);
      const allIds = GAMES.map((g) => g.id);
      const unplayedIds = allIds.filter((id) => !playedIds.includes(id));
      dispatch({
        type: 'SET_RANKINGS',
        player: activePlayer,
        rankings: [...playedIds, ...unplayedIds],
      });
    },
    [dispatch, activePlayer]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<RankedGame>) => (
      <ScaleDecorator activeScale={1.02}>
        <LeaderboardItem
          game={item}
          rank={item.rank}
          isEditing={isEditing}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    ),
    [isEditing]
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>Ranking</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setIsEditing((v) => !v)}
        >
          <Text style={[styles.editLabel, isEditing && { color: COLORS.primary }]}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectorWrap}>
        <PlayerSelector
          active={activePlayer}
          onChange={(p) => {
            setActivePlayer(p);
            setIsEditing(false);
          }}
        />
      </View>

      {rankedGames.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No games played yet</Text>
          <Text style={styles.emptySubtitle}>
            Start tracking scores in the Games tab
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={rankedGames}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingTop: SPACING.sm,
              paddingBottom: tabBarHeight,
            }}
            showsVerticalScrollIndicator={false}
            activationDistance={isEditing ? 0 : 999}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md + SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.londrina.black,
    fontSize: 42,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  editBtn: {
    paddingBottom: SPACING.xs,
  },
  editLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 15,
    color: COLORS.grey,
  },
  selectorWrap: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md * 2,
  },
  emptyTitle: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 24,
    color: COLORS.grey,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 14,
    color: COLORS.dimGrey,
    textAlign: 'center',
  },
});
