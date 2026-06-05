import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSky } from '@/theme/SkyContext';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children?: ReactNode;
};

type Tri = [string, string, string];

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * Weather backdrop that reflects the current condition + time of day.
 * - Cross-fades smoothly when the sky changes (clear → cloudy, day → night).
 * - Has a gentle, continuous ambient drift (a soft glow that slowly moves)
 *   so the background feels alive even when the weather is steady.
 */
export function WeatherBackground({ children }: Props) {
  const { colors, isDark } = useTheme();
  const { sky } = useSky();

  const target: Tri = sky?.gradient ?? colors.gradient;
  const key = target.join('|');

  // Cross-fade between the settled gradient (`base`) and the incoming one.
  const [base, setBase] = useState<Tri>(target);
  const [next, setNext] = useState<Tri | null>(null);
  const fade = useRef(new Animated.Value(0)).current;
  const lastKey = useRef(key);

  useEffect(() => {
    if (key === lastKey.current) return;
    lastKey.current = key;
    setNext(target);
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setBase(target);
        setNext(null);
      }
    });
  }, [key, target, fade]);

  // Gentle, endless ambient drift for the soft glow overlay.
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const glowTranslate = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });
  const glowOpacity = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 0.6, 0.35],
  });

  // A soft light glow that subtly drifts; brighter accent in dark mode so the
  // condition tint reads as an atmospheric aura.
  const glowColor = isDark
    ? 'rgba(120,170,255,0.10)'
    : 'rgba(255,255,255,0.45)';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={base}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {next && (
        <AnimatedGradient
          colors={next}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: fade }]}
        />
      )}

      {/* Gentle drifting ambient glow */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.glow,
          {
            backgroundColor: glowColor,
            opacity: glowOpacity,
            transform: [{ translateX: glowTranslate }],
          },
        ]}
      />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
});
