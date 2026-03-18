import { View, Text, StyleSheet } from 'react-native';
import CrownIcon from '../ui/CrownIcon';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';

export type CrownType = 'gold' | 'blue' | 'red';

const CROWN_COLORS: Record<CrownType, string> = {
  gold: '#FFD700',
  blue: '#4A9EF5',
  red: '#E85555',
};

type Props = {
  name: string;
  color: string;
  crowns?: CrownType[];
};

export default function PlayerHeader({ name, color, crowns = [] }: Props) {
  return (
    <View style={[styles.container, { borderColor: color }]}>
      <View style={styles.crownSpace}>
        {crowns.map((type) => (
          <CrownIcon key={type} size={16} color={CROWN_COLORS[type]} />
        ))}
      </View>
      <Text style={[styles.name, { color }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  crownSpace: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  name: {
    fontFamily: FONTS.londrina.black,
    fontSize: 32,
    letterSpacing: 1,
  },
});
