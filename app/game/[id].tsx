import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppState, useAppDispatch } from '../../store/AppContext';
import { GAMES } from '../../data/games';
import { PLAYERS } from '../../constants/players';
import { COLORS, FONTS, SPACING, RADII } from '../../constants/theme';
import ScoreEditor from '../../components/games/ScoreEditor';
import RatingEditor from '../../components/games/RatingEditor';
import type { PlayerId } from '../../constants/players';

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const state = useAppState();
  const dispatch = useAppDispatch();

  const game = GAMES.find((g) => g.id === id);
  if (!game) return null;

  const score = state.scores[game.id] ?? { baloo: 0, chiante: 0 };
  const rating = state.ratings[game.id] ?? { baloo: null, chiante: null };

  const balooMin = state.marathons.reduce(
    (acc, m) => acc + m.matches.filter((x) => x.gameId === game.id && x.winner === 'baloo').length,
    0
  );
  const chianteMin = state.marathons.reduce(
    (acc, m) => acc + m.matches.filter((x) => x.gameId === game.id && x.winner === 'chiante').length,
    0
  );

  const avgRating =
    rating.baloo !== null && rating.chiante !== null
      ? ((rating.baloo + rating.chiante) / 2).toFixed(1)
      : null;

  let leaderName = '';
  let leaderColor = COLORS.grey;
  const isPlayed = score.baloo > 0 || score.chiante > 0;
  if (isPlayed) {
    if (score.baloo > score.chiante) {
      leaderName = PLAYERS.baloo.name;
      leaderColor = COLORS.baloo;
    } else if (score.chiante > score.baloo) {
      leaderName = PLAYERS.chiante.name;
      leaderColor = COLORS.chiante;
    } else {
      leaderName = 'Tied';
      leaderColor = COLORS.grey;
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.navBar, { paddingTop: insets.top + SPACING.sm }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={COLORS.white} />
        </TouchableOpacity>
        {avgRating && (
          <View style={styles.avgPill}>
            <Text style={styles.avgText}>★ {avgRating}</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + SPACING.xl }]}
      >
        <View style={styles.coverContainer}>
          <Image source={game.cover} style={styles.cover} contentFit="contain" />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.gameName}>{game.name}</Text>
          {isPlayed && (
            <Text style={[styles.leader, { color: leaderColor }]}>{leaderName}</Text>
          )}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Score</Text>
          <ScoreEditor
            balooScore={score.baloo}
            chianteScore={score.chiante}
            balooMin={balooMin}
            chianteMin={chianteMin}
            onUpdate={(player: PlayerId, delta: number) =>
              dispatch({ type: 'UPDATE_SCORE', gameId: game.id, player, delta })
            }
          />
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>Ratings</Text>
          <RatingEditor
            balooRating={rating.baloo}
            chianteRating={rating.chiante}
            onRate={(player: PlayerId, value: number | null) =>
              dispatch({ type: 'SET_RATING', gameId: game.id, player, rating: value })
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avgPill: {
    backgroundColor: COLORS.card,
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  avgText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 13,
    color: COLORS.grey,
  },
  content: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.lg,
  },
  coverContainer: {
    width: '100%',
    height: 260,
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    gap: SPACING.xs,
  },
  gameName: {
    fontFamily: FONTS.londrina.black,
    fontSize: 36,
    color: COLORS.white,
    letterSpacing: 1,
    lineHeight: 40,
  },
  leader: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 14,
  },
  sectionBlock: {
    gap: SPACING.sm,
  },
  sectionLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
