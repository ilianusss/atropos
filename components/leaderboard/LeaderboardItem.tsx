import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import type { Game } from '../../data/games';

type Props = {
  game: Game;
  rank: number;
  isEditing: boolean;
  drag?: () => void;
  isActive?: boolean;
};

export default function LeaderboardItem({
  game,
  rank,
  isEditing,
  drag,
  isActive,
}: Props) {
  return (
    <View style={[styles.container, isActive && styles.containerActive]}>
      <Text style={styles.rank}>#{rank}</Text>
      <Image source={game.cover} style={styles.cover} contentFit="cover" />
      <Text style={styles.name} numberOfLines={1}>
        {game.name}
      </Text>
      {isEditing && (
        <TouchableOpacity onPressIn={drag} style={styles.handle} hitSlop={8}>
          <Ionicons name="reorder-three" size={22} color={COLORS.dimGrey} />
        </TouchableOpacity>
      )}
    </View>
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
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  containerActive: {
    backgroundColor: COLORS.cardElevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rank: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 20,
    color: COLORS.primary,
    width: 32,
  },
  cover: {
    width: 44,
    height: 56,
    borderRadius: RADII.sm,
  },
  name: {
    flex: 1,
    fontFamily: FONTS.poppins.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  handle: {
    padding: SPACING.xs,
  },
});
