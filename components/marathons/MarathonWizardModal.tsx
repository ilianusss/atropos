import { Ionicons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLAYERS } from '../../constants/players';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { GAMES } from '../../data/games';
import type { Marathon, MarathonMatch } from '../../store/AppContext';
import { useAppDispatch } from '../../store/AppContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
type WinnerValue = 'baloo' | 'chiante' | 'tie';
type Step = 1 | 2 | 3;

type Props = {
  visible: boolean;
  onClose: () => void;
  initial?: Marathon;
  /** When editing games only, pass 2 to skip the name/date step entirely. */
  startStep?: Step;
};

const STEP_TITLES: Record<Step, string> = {
  1: 'Name & Date',
  2: 'Select Games',
  3: 'Set Winners',
};

export default function MarathonWizardModal({
  visible,
  onClose,
  initial,
  startStep = 1,
}: Props) {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const isEditing = !!initial;

  const [step, setStep] = useState<Step>(startStep);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [winners, setWinners] = useState<Record<string, WinnerValue>>({});

  // Reset / pre-fill whenever the modal opens
  useEffect(() => {
    if (!visible) return;
    if (isEditing && initial) {
      setStep(startStep);
      setName(initial.name);
      setDate(new Date(initial.date));
      setSelectedIds(initial.matches.map((m) => m.gameId));
      setWinners(Object.fromEntries(initial.matches.map((m) => [m.gameId, m.winner])));
    } else {
      setStep(1);
      setName('');
      setDate(new Date());
      setSelectedIds([]);
      setWinners({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const toggleGame = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goToStep3 = () => {
    const next = { ...winners };
    for (const id of selectedIds) {
      if (!next[id]) next[id] = 'baloo';
    }
    setWinners(next);
    setStep(3);
  };

  const handleSave = () => {
    const matches: MarathonMatch[] = selectedIds.map((id) => ({
      gameId: id,
      winner: winners[id] ?? 'baloo',
    }));

    if (isEditing && initial) {
      dispatch({
        type: 'UPDATE_MARATHON',
        marathon: { ...initial, name: name.trim(), date: date.toISOString(), matches },
      });
    } else {
      dispatch({
        type: 'ADD_MARATHON',
        marathon: {
          id: `marathon-${Date.now()}`,
          name: name.trim(),
          date: date.toISOString(),
          matches,
        },
      });
    }
    onClose();
  };

  // Show Back only when there is a valid previous step to return to
  const showBack = step > startStep;

  const canAdvanceStep1 = name.trim().length > 0;
  const canAdvanceStep2 = selectedIds.length > 0;

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
        style={[
          styles.kavOverlay,
          {
            // Generous bottom gap that respects the home indicator
            paddingBottom: Math.max(SCREEN_HEIGHT * 0.11, insets.bottom + SPACING.xl + SPACING.lg),
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
      >
        <View style={styles.dialog}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.stepHint}>
                {isEditing ? 'Edit Marathon' : `Step ${step} of 3`}
              </Text>
              <Text style={styles.title}>{STEP_TITLES[step]}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={COLORS.grey} />
            </TouchableOpacity>
          </View>

          {/* ── Body ── */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1: name + date */}
            {step === 1 && (
              <>
                <TextInput
                  style={styles.nameInput}
                  placeholder="e.g. Iliane gagne encore"
                  placeholderTextColor={COLORS.dimGrey}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  returnKeyType="next"
                  selectTextOnFocus
                  onSubmitEditing={() => {
                    if (canAdvanceStep1) setStep(2);
                  }}
                />
                <Text style={styles.fieldLabel}>Date</Text>
                  <RNDateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'compact' : 'default'}
                    onChange={(_, selected) => {
                      if (selected) setDate(selected);
                    }}
                    themeVariant="dark"
                    style={styles.datePicker}
                  />
              </>
            )}

            {/* Step 2: multi-select game list */}
            {step === 2 &&
              GAMES.map((game) => {
                const selected = selectedIds.includes(game.id);
                return (
                  <TouchableOpacity
                    key={game.id}
                    style={[styles.gameRow, selected && styles.gameRowSelected]}
                    onPress={() => toggleGame(game.id)}
                    activeOpacity={0.7}
                  >
                    <Image source={game.cover} style={styles.gameCover} contentFit="cover" />
                    <Text style={styles.gameName} numberOfLines={1}>
                      {game.name}
                    </Text>
                    <View style={[styles.check, selected && styles.checkActive]}>
                      {selected && (
                        <Ionicons name="checkmark" size={12} color={COLORS.background} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

            {/* Step 3: winner picker per game */}
            {step === 3 &&
              selectedIds.map((id) => {
                const game = GAMES.find((g) => g.id === id)!;
                const current: WinnerValue = winners[id] ?? 'baloo';
                return (
                  <View key={id} style={styles.winnerRow}>
                    <Image source={game.cover} style={styles.gameCover} contentFit="cover" />
                    <View style={styles.winnerInfo}>
                      <Text style={styles.gameName} numberOfLines={1}>
                        {game.name}
                      </Text>
                      <View style={styles.picker}>
                        {(['baloo', 'tie', 'chiante'] as WinnerValue[]).map((opt) => {
                          const active = current === opt;
                          const label =
                            opt === 'baloo'
                              ? PLAYERS.baloo.name
                              : opt === 'chiante'
                              ? PLAYERS.chiante.name
                              : 'Tie';
                          const clr =
                            opt === 'baloo'
                              ? COLORS.baloo
                              : opt === 'chiante'
                              ? COLORS.chiante
                              : COLORS.grey;
                          return (
                            <TouchableOpacity
                              key={opt}
                              style={[
                                styles.pickerOpt,
                                active && { backgroundColor: clr + '26', borderColor: clr },
                              ]}
                              onPress={() =>
                                setWinners((prev) => ({ ...prev, [id]: opt }))
                              }
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.pickerLabel,
                                  { color: active ? clr : COLORS.dimGrey },
                                ]}
                              >
                                {label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            {showBack ? (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setStep((s) => (s - 1) as Step)}
              >
                <Text style={styles.backLabel}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}

            {step === 1 && (
              <TouchableOpacity
                style={[styles.nextBtn, !canAdvanceStep1 && styles.btnDisabled]}
                onPress={() => {
                  if (canAdvanceStep1) setStep(2);
                }}
                disabled={!canAdvanceStep1}
              >
                <Text style={styles.nextLabel}>Next</Text>
              </TouchableOpacity>
            )}
            {step === 2 && (
              <TouchableOpacity
                style={[styles.nextBtn, !canAdvanceStep2 && styles.btnDisabled]}
                onPress={goToStep3}
                disabled={!canAdvanceStep2}
              >
                <Text style={styles.nextLabel}>Next ({selectedIds.length})</Text>
              </TouchableOpacity>
            )}
            {step === 3 && (
              <TouchableOpacity style={styles.nextBtn} onPress={handleSave}>
                <Text style={styles.nextLabel}>{isEditing ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>
            )}
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
    paddingTop: SCREEN_HEIGHT * 0.11,
  },
  dialog: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepHint: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 11,
    color: COLORS.dimGrey,
    marginBottom: 2,
  },
  title: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: SPACING.md,
    gap: SPACING.xs,
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
  fieldLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: SPACING.sm,
  },
  datePicker: {
    alignSelf: 'flex-start',
    marginLeft: -6,
  },
  // Game row (step 2)
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  gameRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '12',
  },
  gameCover: {
    width: 32,
    height: 40,
    borderRadius: 6,
  },
  gameName: {
    flex: 1,
    fontFamily: FONTS.poppins.regular,
    fontSize: 13,
    color: COLORS.white,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.dimGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  // Winner row (step 3)
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  winnerInfo: {
    flex: 1,
    gap: 6,
  },
  picker: {
    flexDirection: 'row',
    gap: 4,
  },
  pickerOpt: {
    flex: 1,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.dimGrey + '55',
    alignItems: 'center',
  },
  pickerLabel: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 11,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  backLabel: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 14,
    color: COLORS.grey,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  nextLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 14,
    color: COLORS.white,
  },
});
