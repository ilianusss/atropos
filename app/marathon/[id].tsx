import { useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppState, useAppDispatch, getMarathonWinner } from '../../store/AppContext';
import { GAMES } from '../../data/games';
import { PLAYERS } from '../../constants/players';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import MarathonWizardModal from '../../components/marathons/MarathonWizardModal';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const DELETE_RED = '#E85555';

export default function MarathonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [showEditGames, setShowEditGames] = useState(false);

  const marathon = state.marathons.find((m) => m.id === id);

  if (!marathon) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Marathon not found</Text>
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Marathon',
      'Are you sure you want to delete this marathon?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_MARATHON', id: marathon.id });
            router.back();
          },
        },
      ]
    );
  };

  const overallWinner = getMarathonWinner(marathon.matches);
  const winnerLabel =
    overallWinner === 'baloo'
      ? PLAYERS.baloo.name
      : overallWinner === 'chiante'
      ? PLAYERS.chiante.name
      : 'Tie';
  const winnerColor =
    overallWinner === 'baloo'
      ? COLORS.baloo
      : overallWinner === 'chiante'
      ? COLORS.chiante
      : COLORS.grey;

  const balooWins = marathon.matches.filter((m) => m.winner === 'baloo').length;
  const chianteWins = marathon.matches.filter((m) => m.winner === 'chiante').length;
  const ties = marathon.matches.filter((m) => m.winner === 'tie').length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Nav row */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} hitSlop={8}>
          <Ionicons name="trash-outline" size={21} color={DELETE_RED} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.marathonName}>{marathon.name}</Text>

        {/* Date + Edit Marathon link */}
        <View style={styles.dateLine}>
          <Text style={styles.date}>{formatDate(marathon.date)}</Text>
          <TouchableOpacity onPress={() => setShowEditGames(true)} hitSlop={8}>
            <Text style={styles.editMarathonLink}>Edit Marathon</Text>
          </TouchableOpacity>
        </View>

        {/* Overall winner card */}
        <View style={[styles.winnerCard, { borderColor: winnerColor }]}>
          <Text style={styles.winnerCardLabel}>Overall Winner</Text>
          <Text style={[styles.winnerCardName, { color: winnerColor }]}>{winnerLabel}</Text>
          <Text style={styles.winnerCardScore}>
            {balooWins}–{chianteWins}
            {ties > 0 ? ` · ${ties} tie${ties !== 1 ? 's' : ''}` : ''}
          </Text>
        </View>

        {/* Match list */}
        <Text style={styles.sectionLabel}>Games Played</Text>
        {marathon.matches.map((match) => {
          const game = GAMES.find((g) => g.id === match.gameId);
          if (!game) return null;
          const mLabel =
            match.winner === 'baloo'
              ? PLAYERS.baloo.name
              : match.winner === 'chiante'
              ? PLAYERS.chiante.name
              : 'Tie';
          const mColor =
            match.winner === 'baloo'
              ? COLORS.baloo
              : match.winner === 'chiante'
              ? COLORS.chiante
              : COLORS.grey;
          return (
            <View key={match.gameId} style={styles.matchRow}>
              <Image source={game.cover} style={styles.matchCover} contentFit="cover" />
              <Text style={styles.matchName} numberOfLines={1}>
                {game.name}
              </Text>
              <Text style={[styles.matchWinner, { color: mColor }]}>{mLabel}</Text>
            </View>
          );
        })}
      </ScrollView>

      <MarathonWizardModal
        visible={showEditGames}
        onClose={() => setShowEditGames(false)}
        initial={marathon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 16,
    color: COLORS.grey,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  marathonName: {
    fontFamily: FONTS.londrina.black,
    fontSize: 36,
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  dateLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  date: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 13,
    color: COLORS.grey,
    flex: 1,
  },
  editMarathonLink: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 13,
    color: COLORS.primary,
  },
  winnerCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  winnerCardLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  winnerCardName: {
    fontFamily: FONTS.londrina.black,
    fontSize: 40,
    letterSpacing: 1,
  },
  winnerCardScore: {
    fontFamily: FONTS.poppins.regular,
    fontSize: 13,
    color: COLORS.grey,
  },
  sectionLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADII.md,
    marginBottom: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  matchCover: {
    width: 36,
    height: 44,
    borderRadius: 6,
  },
  matchName: {
    flex: 1,
    fontFamily: FONTS.poppins.medium,
    fontSize: 14,
    color: COLORS.white,
  },
  matchWinner: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 14,
  },
});
