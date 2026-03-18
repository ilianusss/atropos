import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';

type Props = {
  label: string;
  value: string | number;
  accentColor: string;
};

export default function StatCard({ label, value, accentColor }: Props) {
  return (
    <View style={[styles.card, { borderTopColor: accentColor }]}>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADII.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 3,
  },
  value: {
    fontFamily: FONTS.londrina.black,
    fontSize: 40,
    lineHeight: 44,
  },
  label: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 11,
    color: COLORS.grey,
    marginTop: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
