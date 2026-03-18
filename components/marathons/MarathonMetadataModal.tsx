import { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../store/AppContext';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import type { Marathon } from '../../store/AppContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  marathon: Marathon;
};

export default function MarathonMetadataModal({ visible, onClose, marathon }: Props) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(marathon.name);
  const [date, setDate] = useState(new Date(marathon.date));

  useEffect(() => {
    if (visible) {
      setName(marathon.name);
      setDate(new Date(marathon.date));
    }
  }, [visible, marathon.name, marathon.date]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    dispatch({
      type: 'UPDATE_MARATHON',
      marathon: { ...marathon, name: trimmed, date: date.toISOString() },
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        style={[styles.kavOverlay, { paddingBottom: insets.bottom + SPACING.xl }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
      >
        <View style={styles.dialog}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Marathon</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={COLORS.grey} />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              autoFocus
              selectTextOnFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
              placeholderTextColor={COLORS.dimGrey}
            />
            <Text style={styles.fieldLabel}>Date</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={(_, selected) => {
                if (selected) setDate(selected);
              }}
              themeVariant="dark"
              style={styles.datePicker}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
            >
              <Text style={styles.saveLabel}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  kavOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  dialog: {
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  body: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.md,
  },
  fieldLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  nameInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontFamily: FONTS.poppins.regular,
    fontSize: 15,
    color: COLORS.white,
  },
  datePicker: {
    alignSelf: 'flex-start',
    marginLeft: -6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  cancelLabel: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 14,
    color: COLORS.grey,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 14,
    color: COLORS.white,
  },
});
