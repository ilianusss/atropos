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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const INDICATOR_CONFIG = { duration: 280, easing: Easing.out(Easing.cubic) };
const SCALE_SPRING = { damping: 14, stiffness: 180, mass: 0.9 };

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const isInitial = useRef(true);

  useEffect(() => {
    if (tabWidth <= 0) return;
    if (isInitial.current) {
      indicatorX.value = state.index * tabWidth;
      isInitial.current = false;
      return;
    }
    indicatorX.value = withTiming(state.index * tabWidth, INDICATOR_CONFIG);
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setTabWidth(e.nativeEvent.layout.width / state.routes.length);
    },
    [state.routes.length]
  );

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || SPACING.md }]}
      onLayout={handleLayout}
    >
      {tabWidth > 0 && (
        <Animated.View style={[styles.indicator, { width: tabWidth }, indicatorStyle]} />
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.dispatch({
              ...CommonActions.navigate(route.name, route.params),
              target: state.key,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            label={label}
            icon={options.tabBarIcon}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

type IconFn = (props: { focused: boolean; color: string; size: number }) => React.ReactNode;

type TabItemProps = {
  isFocused: boolean;
  label: string;
  icon?: IconFn;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ isFocused, label, icon, onPress, onLongPress }: TabItemProps) {
  const scale = useSharedValue(isFocused ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.1 : 1, SCALE_SPRING);
  }, [isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isFocused ? COLORS.primary : COLORS.dimGrey;

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        {icon?.({ focused: isFocused, color, size: 22 })}
        <Text style={[styles.label, { color }]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2.5,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  tabContent: {
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontFamily: FONTS.londrina.regular,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
