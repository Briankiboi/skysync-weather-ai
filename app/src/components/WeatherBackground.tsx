import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSky } from '@/theme/SkyContext';
import { useTheme } from '@/theme/useTheme';

type Props = {
  children?: ReactNode;
};

/**
 * Clean weather backdrop — a soft vertical gradient that reflects the current
 * condition and time of day when live weather is known, falling back to the
 * neutral theme sky. Minimal and professional (Apple-Weather style): a single
 * gradient wash, no heavy decorative blobs.
 */
export function WeatherBackground({ children }: Props) {
  const { colors } = useTheme();
  const { sky } = useSky();

  const gradient = sky?.gradient ?? colors.gradient;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
  },
});
