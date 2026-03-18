import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { PLAYERS } from '../../constants/players';
import type { PlayerId } from '../../constants/players';

type Props = {
  balooRating: number | null;
  chianteRating: number | null;
  onRate: (player: PlayerId, rating: number | null) => void;
};

export default function RatingEditor({ balooRating, chianteRating, onRate }: Props) {
  const [editingPlayer, setEditingPlayer] = useState<PlayerId | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleEdit = (player: PlayerId, current: number | null) => {
    setInputValue(current !== null ? current.toString() : '');
    setEditingPlayer(player);
  };

  const handleSave = () => {
    if (!editingPlayer) return;
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      onRate(editingPlayer, null);
    } else {
      const val = parseFloat(trimmed);
      if (!isNaN(val) && val >= 0 && val <= 10) {
        onRate(editingPlayer, Math.round(val * 10) / 10);
      }
    }
    setEditingPlayer(null);
  };

  const handleCancel = () => setEditingPlayer(null);

  const activeColor = editingPlayer ? COLORS[editingPlayer] : COLORS.primary;

  return (
    <>
      <View style={styles.container}>
        <PlayerColumn
          player="baloo"
          rating={balooRating}
          color={COLORS.baloo}
          onEdit={() => handleEdit('baloo', balooRating)}
        />
        <View style={styles.divider} />
        <PlayerColumn
          player="chiante"
          rating={chianteRating}
          color={COLORS.chiante}
          onEdit={() => handleEdit('chiante', chianteRating)}
        />
      </View>

      <Modal
        visible={editingPlayer !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={handleCancel} />
        <KeyboardAvoidingView
          style={styles.kavOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents="box-none"
        >
          <View style={[styles.dialog, { borderColor: activeColor }]}>
            <Text style={[styles.dialogTitle, { color: activeColor }]}>
              {editingPlayer ? PLAYERS[editingPlayer].name : ''}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: activeColor }]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              placeholder="-.-"
              placeholderTextColor={COLORS.dimGrey}
              autoFocus
              maxLength={5}
              returnKeyType="done"
              onSubmitEditing={handleSave}
              selectTextOnFocus
            />
            <Text style={styles.hint}>0 – 10</Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: activeColor }]}
                onPress={handleSave}
                activeOpacity={0.85}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

type ColumnProps = {
  player: PlayerId;
  rating: number | null;
  color: string;
  onEdit: () => void;
};

function PlayerColumn({ player, rating, color, onEdit }: ColumnProps) {
  return (
    <View style={styles.column}>
      <Text style={[styles.playerName, { color }]}>{PLAYERS[player].name}</Text>
      <Text style={[styles.ratingValue, rating !== null && { color }]}>
        {rating !== null ? rating.toFixed(1) : '-.-'}
      </Text>
      <TouchableOpacity
        style={[styles.editBtn, { borderColor: color + '55' }]}
        onPress={onEdit}
        activeOpacity={0.75}
      >
        <Text style={[styles.editBtnText, { color }]}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    overflow: 'hidden',
  },
  column: {
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
  ratingValue: {
    fontFamily: FONTS.londrina.black,
    fontSize: 48,
    color: COLORS.dimGrey,
    lineHeight: 52,
  },
  editBtn: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
  },
  editBtnText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 13,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  kavOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '82%',
    backgroundColor: COLORS.card,
    borderRadius: RADII.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg + SPACING.sm,
    borderWidth: 1.5,
    gap: SPACING.md,
  },
  dialogTitle: {
    fontFamily: FONTS.londrina.black,
    fontSize: 28,
    letterSpacing: 1,
  },
  input: {
    height: 72,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADII.md,
    borderWidth: 2,
    paddingHorizontal: SPACING.md,
    fontFamily: FONTS.londrina.black,
    fontSize: 40,
    color: COLORS.white,
    textAlign: 'center',
  },
  hint: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 12,
    color: COLORS.dimGrey,
    textAlign: 'center',
    marginTop: -SPACING.xs,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 15,
    color: COLORS.grey,
  },
  saveBtn: {
    flex: 2,
    height: 50,
    borderRadius: RADII.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 15,
    color: COLORS.background,
  },
});
