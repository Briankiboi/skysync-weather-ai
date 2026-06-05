import { ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Stop, LinearGradient as SvgGradient, Defs } from 'react-native-svg';
import { ClockFormat } from '@/types/settings';
import { HourlyEntry, Units } from '@/types/weather';
import { spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';
import { conditionEmoji, shortHour, tempValue } from '@/utils/weather';
import { Card } from './Card';
import { ThemedText } from './ThemedText';

type Props = {
  hourly: HourlyEntry[];
  units: Units;
  clock?: ClockFormat;
  count?: number;
};

const COL_W = 64; // width per hour column
const GRAPH_H = 70; // height of the curve area
const TOP_PAD = 14;
const BOTTOM_PAD = 14;

/**
 * Hourly forecast as an elegant temperature curve (inspired by Pixel Weather):
 * weather icon on top, a smooth line connecting each hour's temperature with
 * the value above each point, and the time below. Horizontally scrollable.
 */
export function HourlyGraph({ hourly, units, clock = '12h', count = 16 }: Props) {
  const { colors } = useTheme();

  const now = Date.now();
  const data = hourly
    .filter((h) => new Date(h.time).getTime() >= now - 3600_000)
    .slice(0, count)
    .map((h, i) => ({
      entry: h,
      label: i === 0 ? 'Now' : shortHour(h.time, clock),
      temp: tempValue(h.temperature, units) ?? 0,
    }));

  if (data.length < 2) return null;

  const temps = data.map((d) => d.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = Math.max(1, max - min);

  // Map a temp to a Y coordinate within the graph band.
  const yFor = (t: number) =>
    TOP_PAD + (1 - (t - min) / range) * (GRAPH_H - TOP_PAD - BOTTOM_PAD);
  const xFor = (i: number) => i * COL_W + COL_W / 2;

  // Build a smooth path through the points (Catmull-Rom -> cubic bezier).
  const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d.temp) }));
  const linePath = smoothPath(points);

  const width = data.length * COL_W;

  return (
    <Card style={styles.card}>
      <ThemedText variant="label" style={styles.title}>
        Hourly forecast
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
      >
        <View style={{ width }}>
          {/* Icons row */}
          <View style={styles.iconsRow}>
            {data.map((d) => (
              <ThemedText key={`i-${d.entry.time}`} style={[styles.emoji, { width: COL_W }]}>
                {conditionEmoji(d.entry.condition_code)}
              </ThemedText>
            ))}
          </View>

          {/* Curve with temp labels */}
          <View style={{ height: GRAPH_H, width }}>
            <Svg width={width} height={GRAPH_H}>
              <Defs>
                <SvgGradient id="line" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={colors.primary} />
                  <Stop offset="1" stopColor={colors.highlight} />
                </SvgGradient>
              </Defs>
              <Path
                d={linePath}
                stroke="url(#line)"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => (
                <Circle
                  key={`c-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill={colors.primary}
                />
              ))}
            </Svg>
            {/* Temp labels positioned above each point */}
            {data.map((d, i) => (
              <ThemedText
                key={`t-${d.entry.time}`}
                variant="caption"
                style={[
                  styles.tempLabel,
                  { left: xFor(i) - COL_W / 2, top: yFor(d.temp) - 22, width: COL_W },
                ]}
              >
                {d.temp}°
              </ThemedText>
            ))}
          </View>

          {/* Time row */}
          <View style={styles.timesRow}>
            {data.map((d) => (
              <ThemedText
                key={`l-${d.entry.time}`}
                variant="caption"
                muted
                style={[styles.timeLabel, { width: COL_W }]}
              >
                {d.label}
              </ThemedText>
            ))}
          </View>
        </View>
      </ScrollView>
    </Card>
  );
}

/** Smooth cubic path through points using Catmull-Rom interpolation. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    paddingHorizontal: 0,
    paddingVertical: spacing.lg,
  },
  title: {
    paddingHorizontal: spacing.lg,
  },
  iconsRow: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
  },
  emoji: {
    fontSize: 22,
    textAlign: 'center',
  },
  tempLabel: {
    position: 'absolute',
    textAlign: 'center',
    marginLeft: spacing.lg,
    fontWeight: '700',
  },
  timesRow: {
    flexDirection: 'row',
    paddingLeft: spacing.lg,
    marginTop: spacing.xs,
  },
  timeLabel: {
    textAlign: 'center',
  },
});
