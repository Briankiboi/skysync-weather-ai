import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

type Props = {
  /** When true, the splash begins fading out. */
  ready: boolean;
  /** Called once the fade-out finishes and the overlay can unmount. */
  onFinish: () => void;
};

/**
 * Branded splash overlay that sits on top of the app and cross-fades away.
 * The logo gently scales + fades in, holds briefly, then the whole overlay
 * fades out once `ready` — giving a smooth, seamless launch on both Expo Go
 * and native builds.
 */
export function AnimatedSplash({ ready, onFinish }: Props) {
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;

  // Fade + scale the logo in on mount.
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoOpacity, logoScale]);

  // Once the app is ready, fade the whole overlay out, then unmount.
  useEffect(() => {
    if (!ready) return;
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 550,
      delay: 150,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [ready, overlayOpacity, onFinish]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.overlay, { opacity: overlayOpacity }]}
    >
      <Animated.View
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
      >
        <Image
          source={require('../../assets/skysync-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Match the logo image's own background so it sits seamlessly, then the
    // whole overlay fades out to reveal the light app.
    backgroundColor: '#250E52',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  logo: {
    width: 240,
    height: 240,
  },
});
