import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { PLAYERS } from '../../constants/players';
import type { Game } from '../../data/games';

type Props = {
  game: Game;
  balooScore: number;
  chianteScore: number;
  balooRating: number | null;
  chianteRating: number | null;
  onPress: () => void;
};

export default function GameListItem({
  game,
  balooScore,
  chianteScore,
  balooRating,
  chianteRating,
  onPress,
}: Props) {
  const totalPlayed = balooScore + chianteScore;

  const avgRating =
    balooRating !== null && chianteRating !== null
      ? ((balooRating + chianteRating) / 2).toFixed(1)
      : '-.-';

  let leaderName = '';
  let leaderColor = COLORS.grey;
  if (balooScore > chianteScore) {
    leaderName = PLAYERS.baloo.name;
    leaderColor = COLORS.baloo;
  } else if (chianteScore > balooScore) {
    leaderName = PLAYERS.chiante.name;
    leaderColor = COLORS.chiante;
  } else if (balooScore > 0) {
    leaderName = 'Tied';
    leaderColor = COLORS.grey;
  }

  const isPlayed = balooScore > 0 || chianteScore > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.coverContainer}>
        <Image source={game.cover} style={styles.cover} contentFit="cover" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {game.name}
        </Text>
        {isPlayed && (
          <Text style={styles.totalPlayed}>{totalPlayed} total played</Text>
        )}
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreVal, { color: COLORS.baloo }]}>{balooScore}</Text>
          <Text style={styles.scoreSep}>–</Text>
          <Text style={[styles.scoreVal, { color: COLORS.chiante }]}>{chianteScore}</Text>
        </View>
        <View style={styles.metaRow}>
          {isPlayed && leaderName ? (
            <Text style={[styles.leader, { color: leaderColor }]}>{leaderName}</Text>
          ) : (
            <Text style={styles.unplayed}>Not played</Text>
          )}
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>★ {avgRating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADII.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    overflow: 'hidden',
  },
  coverContainer: {
    width: 72,
    height: 100,
    overflow: 'hidden',
  },
  cover: {
    width: 72,
    height: 100,
  },
  info: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    justifyContent: 'center',
    gap: 3,
  },
  name: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  totalPlayed: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 11,
    color: COLORS.dimGrey,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  scoreVal: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 16,
  },
  scoreSep: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 14,
    color: COLORS.dimGrey,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  leader: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 12,
  },
  unplayed: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 12,
    color: COLORS.dimGrey,
  },
  ratingPill: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  ratingText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 11,
    color: COLORS.grey,
  },
});
