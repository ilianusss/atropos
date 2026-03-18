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

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: [Option<T>, Option<T>];
  value: T;
  onChange: (value: T) => void;
};

const TIMING = { duration: 220, easing: Easing.out(Easing.cubic) };

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isInitial = useRef(true);
  const activeIndex = options[0].value === value ? 0 : 1;

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

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {tabWidth > 0 && (
        <Animated.View style={[styles.pill, { width: tabWidth }, pillStyle]} />
      )}
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={styles.tab}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.85}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {opt.label}
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
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADII.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: FONTS.poppins.medium,
    fontSize: 13,
    color: COLORS.dimGrey,
  },
  labelActive: {
    color: COLORS.white,
  },
});
