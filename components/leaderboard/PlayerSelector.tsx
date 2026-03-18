import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, RADII, SPACING } from '../../constants/theme';
import { PLAYERS } from '../../constants/players';
import type { PlayerId } from '../../constants/players';

type Props = {
  active: PlayerId;
  onChange: (player: PlayerId) => void;
};

const PLAYER_IDS: PlayerId[] = ['baloo', 'chiante'];
const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

export default function PlayerSelector({ active, onChange }: Props) {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isInitial = useRef(true);
  const activeIndex = active === 'baloo' ? 0 : 1;

  useEffect(() => {
    if (tabWidth <= 0) return;
    if (isInitial.current) {
      translateX.value = activeIndex * tabWidth;
      isInitial.current = false;
      return;
    }
    translateX.value = withTiming(activeIndex * tabWidth, TIMING);
  }, [activeIndex, tabWidth, translateX]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setTabWidth((e.nativeEvent.layout.width - 8) / 2);
  }, []);

  const pillColor = COLORS[active];

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.pill,
            { width: tabWidth, backgroundColor: pillColor + '22', borderColor: pillColor },
            pillStyle,
          ]}
        />
      )}
      {PLAYER_IDS.map((player) => {
        const isActive = player === active;
        return (
          <TouchableOpacity
            key={player}
            style={styles.tab}
            onPress={() => onChange(player)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.label, { color: isActive ? COLORS[player] : COLORS.dimGrey }]}
            >
              {PLAYERS[player].name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADII.xl,
    padding: 4,
  },
  pill: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: RADII.lg,
    borderWidth: 1.5,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 18,
    letterSpacing: 0.8,
  },
});
