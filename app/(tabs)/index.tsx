import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PlayerHeader from '../../components/dashboard/PlayerHeader';
import StatCard from '../../components/dashboard/StatCard';
import { PLAYERS } from '../../constants/players';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { GAMES } from '../../data/games';
import { useAppState, getMarathonWinner } from '../../store/AppContext';
import type { CrownType } from '../../components/dashboard/PlayerHeader';

export default function GlobalScreen() {
  const state = useAppState();
  const insets = useSafeAreaInsets();

  // ── Game stats ──────────────────────────────────────────────────────────────
  let balooTotal = 0;
  let chianteTotal = 0;
  let balooLeads = 0;
  let chianteLeads = 0;

  for (const game of GAMES) {
    const score = state.scores[game.id];
    if (!score) continue;
    balooTotal += score.baloo;
    chianteTotal += score.chiante;
    const isPlayed = score.baloo > 0 || score.chiante > 0;
    if (isPlayed) {
      if (score.baloo > score.chiante) balooLeads++;
      else if (score.chiante > score.baloo) chianteLeads++;
    }
  }

  const balooIsLeader =
    balooLeads > chianteLeads ||
    (balooLeads === chianteLeads && balooTotal > chianteTotal);
  const chianteIsLeader =
    chianteLeads > balooLeads ||
    (chianteLeads === balooLeads && chianteTotal > balooTotal);
  const isTie = !balooIsLeader && !chianteIsLeader;

  // ── Marathon stats ───────────────────────────────────────────────────────────
  let balooMarathonWins = 0;
  let chianteMarathonWins = 0;

  for (const m of state.marathons) {
    const w = getMarathonWinner(m.matches);
    if (w === 'baloo') balooMarathonWins++;
    else if (w === 'chiante') chianteMarathonWins++;
  }

  // Blue crown: most marathon wins, no crown if tied (including 0-0)
  const balooHasBlue =
    balooMarathonWins > 0 && balooMarathonWins > chianteMarathonWins;
  const chianteHasBlue =
    chianteMarathonWins > 0 && chianteMarathonWins > balooMarathonWins;

  // Red crown: winner of the most recent marathon; no crown if it was a tie
  const sortedByDate = [...state.marathons].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  const latestWinner =
    sortedByDate.length > 0 ? getMarathonWinner(sortedByDate[0].matches) : 'tie';
  const balooHasRed = latestWinner === 'baloo';
  const chianteHasRed = latestWinner === 'chiante';

  // ── Crown arrays ─────────────────────────────────────────────────────────────
  const balooCrowns: CrownType[] = [];
  const chianteCrowns: CrownType[] = [];
  if (balooIsLeader && !isTie) balooCrowns.push('gold');
  if (chianteIsLeader && !isTie) chianteCrowns.push('gold');
  if (balooHasBlue) balooCrowns.push('blue');
  if (chianteHasBlue) chianteCrowns.push('blue');
  if (balooHasRed) balooCrowns.push('red');
  if (chianteHasRed) chianteCrowns.push('red');

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.xl }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.appTitle}>Leaderboard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Overall</Text>
        <View style={styles.row}>
          <PlayerHeader
            name={PLAYERS.baloo.name}
            color={COLORS.baloo}
            crowns={balooCrowns}
          />
          <View style={styles.rowGap} />
          <PlayerHeader
            name={PLAYERS.chiante.name}
            color={COLORS.chiante}
            crowns={chianteCrowns}
          />
        </View>
        {isTie && balooLeads === 0 && (
          <View style={styles.tieCard}>
            <Text style={styles.tieText}>No games played yet</Text>
          </View>
        )}
        {isTie && balooLeads > 0 && (
          <View style={styles.tieCard}>
            <Text style={styles.tieText}>All tied up!</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Games Led</Text>
        <View style={styles.row}>
          <StatCard label={PLAYERS.baloo.name} value={balooLeads} accentColor={COLORS.baloo} />
          <View style={styles.rowGap} />
          <StatCard label={PLAYERS.chiante.name} value={chianteLeads} accentColor={COLORS.chiante} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Total Points</Text>
        <View style={styles.row}>
          <StatCard label={PLAYERS.baloo.name} value={balooTotal} accentColor={COLORS.baloo} />
          <View style={styles.rowGap} />
          <StatCard label={PLAYERS.chiante.name} value={chianteTotal} accentColor={COLORS.chiante} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Marathons Won</Text>
        <View style={styles.row}>
          <StatCard label={PLAYERS.baloo.name} value={balooMarathonWins} accentColor={COLORS.baloo} />
          <View style={styles.rowGap} />
          <StatCard label={PLAYERS.chiante.name} value={chianteMarathonWins} accentColor={COLORS.chiante} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  appTitle: {
    fontFamily: FONTS.londrina.black,
    fontSize: 42,
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: 11,
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
  },
  rowGap: {
    width: SPACING.sm,
  },
  tieCard: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADII.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  tieText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 14,
    color: COLORS.grey,
  },
});
