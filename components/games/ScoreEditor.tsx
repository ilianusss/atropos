import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import type { PlayerId } from '../../constants/players';
import { PLAYERS } from '../../constants/players';

type Props = {
  balooScore: number;
  chianteScore: number;
  balooMin?: number;
  chianteMin?: number;
  onUpdate: (player: PlayerId, delta: number) => void;
};

export default function ScoreEditor({ balooScore, chianteScore, balooMin = 0, chianteMin = 0, onUpdate }: Props) {
  return (
    <View style={styles.row}>
      <PlayerScore
        player="baloo"
        score={balooScore}
        min={balooMin}
        color={COLORS.baloo}
        onUpdate={onUpdate}
      />
      <View style={styles.divider} />
      <PlayerScore
        player="chiante"
        score={chianteScore}
        min={chianteMin}
        color={COLORS.chiante}
        onUpdate={onUpdate}
      />
    </View>
  );
}

type PlayerScoreProps = {
  player: PlayerId;
  score: number;
  min: number;
  color: string;
  onUpdate: (player: PlayerId, delta: number) => void;
};

function PlayerScore({ player, score, min, color, onUpdate }: PlayerScoreProps) {
  const atMin = score <= min;
  return (
    <View style={styles.playerBlock}>
      <Text style={[styles.playerName, { color }]}>{PLAYERS[player].name}</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnMinus, { borderColor: color }]}
          onPress={() => onUpdate(player, -1)}
          disabled={atMin}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, { color: atMin ? COLORS.dimGrey : color }]}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnPlus, { backgroundColor: color }]}
          onPress={() => onUpdate(player, 1)}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnPlusText]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  playerBlock: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  playerName: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 20,
    letterSpacing: 1,
  },
  score: {
    fontFamily: FONTS.londrina.black,
    fontSize: 56,
    lineHeight: 60,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: RADII.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMinus: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  btnPlus: {
    borderWidth: 0,
  },
  btnText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 22,
    lineHeight: 26,
  },
  btnPlusText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 22,
    lineHeight: 26,
    color: COLORS.background,
  },
});
