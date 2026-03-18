import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarathonListItem from '../../components/marathons/MarathonListItem';
import MarathonWizardModal from '../../components/marathons/MarathonWizardModal';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import type { Marathon } from '../../store/AppContext';
import { useAppState } from '../../store/AppContext';

export default function MarathonsScreen() {
  const state = useAppState();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showWizard, setShowWizard] = useState(false);

  const sorted = [...state.marathons].sort((a, b) => b.date.localeCompare(a.date));

  const renderItem = useCallback(
    ({ item }: { item: Marathon }) => (
      <MarathonListItem
        marathon={item}
        onPress={() => router.push(`/marathon/${item.id}`)}
      />
    ),
    [router]
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>Marathons</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setShowWizard(true)}>
          <Ionicons name="add-circle" size={20} color={COLORS.primary} />
          <Text style={styles.newBtnLabel}>New</Text>
        </TouchableOpacity>
      </View>

      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No marathons yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "New" to log your first marathon
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: SPACING.sm,
            paddingBottom: insets.bottom + SPACING.xl,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <MarathonWizardModal visible={showWizard} onClose={() => setShowWizard(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md + SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.londrina.black,
    fontSize: 42,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  newBtnLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md * 2,
  },
  emptyTitle: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 24,
    color: COLORS.grey,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 14,
    color: COLORS.dimGrey,
    textAlign: 'center',
  },
});
