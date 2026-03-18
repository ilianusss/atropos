import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { PLAYERS } from '../../constants/players';
import { getMarathonWinner } from '../../store/AppContext';
import type { Marathon } from '../../store/AppContext';

type Props = {
  marathon: Marathon;
  onPress: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MarathonListItem({ marathon, onPress }: Props) {
  const winner = getMarathonWinner(marathon.matches);
  const winnerLabel =
    winner === 'baloo'
      ? PLAYERS.baloo.name
      : winner === 'chiante'
      ? PLAYERS.chiante.name
      : 'Tie';
  const winnerColor =
    winner === 'baloo'
      ? COLORS.baloo
      : winner === 'chiante'
      ? COLORS.chiante
      : COLORS.grey;

  const count = marathon.matches.length;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {marathon.name}
        </Text>
        <Text style={styles.meta}>
          {formatDate(marathon.date)} · {count} game{count !== 1 ? 's' : ''}
        </Text>
      </View>
      <Text style={[styles.winner, { color: winnerColor }]}>{winnerLabel}</Text>
      <Ionicons name="chevron-forward" size={16} color={COLORS.dimGrey} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADII.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 15,
    color: COLORS.white,
  },
  meta: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 12,
    color: COLORS.grey,
  },
  winner: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 14,
  },
});
