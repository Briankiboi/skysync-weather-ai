import { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import {
  Card,
  EmptyState,
  OfflineBanner,
  Screen,
  Skeleton,
  ThemedText,
} from '@/components';
import { useUsage } from '@/hooks/useWeather';
import { useOnline } from '@/hooks/useOnline';
import { radius, spacing } from '@/theme';
import { useTheme } from '@/theme/useTheme';

/** Usage — friendly view of your monthly allowance (from /v1/usage). */
export function UsageScreen() {
  const { data, isLoading, error, refetch } = useUsage();
  const online = useOnline();
  const { colors } = useTheme();

  // /v1/usage is free (no quota cost), so it can refresh on pull anytime.
  const [pulling, setPulling] = useState(false);
  const onRefresh = async () => {
    setPulling(true);
    await refetch();
    setPulling(false);
  };

  if (!isLoading && !data && !online) {
    return (
      <Screen>
        <EmptyState
          emoji="📡"
          title="You’re offline"
          message="Connect to see your usage."
        />
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl
          refreshing={pulling}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {!online && <OfflineBanner />}
      <ThemedText variant="title">Usage</ThemedText>
      <ThemedText variant="caption" muted style={styles.subtitle}>
        How much of your monthly weather allowance you’ve used.
      </ThemedText>

      {isLoading && !data ? (
        <Card style={styles.card}>
          <Skeleton width="50%" height={18} />
          <Skeleton width="100%" height={10} style={{ marginTop: spacing.md }} />
        </Card>
      ) : error && !data ? (
        <Card style={styles.card}>
          <ThemedText variant="body">Couldn’t load usage</ThemedText>
          <ThemedText variant="caption" muted>
            {error.message}
          </ThemedText>
        </Card>
      ) : data ? (
        <>
          <Card style={styles.card}>
            <View style={styles.row}>
              <ThemedText variant="body">Your plan</ThemedText>
              <ThemedText variant="heading" style={styles.cap}>
                {data.plan}
              </ThemedText>
            </View>
            {resetDate(data.period.end) && (
              <ThemedText variant="caption" muted>
                Resets on {resetDate(data.period.end)}
              </ThemedText>
            )}
          </Card>

          <Meter
            label="Weather updates"
            used={data.period.requestCount}
            limit={data.limits.requests}
            remaining={data.remaining.requests}
          />
          <Meter
            label="Smart summaries"
            used={data.period.aiRequestCount}
            limit={data.limits.aiRequests}
            remaining={data.remaining.aiRequests}
          />
        </>
      ) : null}
    </Screen>
  );
}

function Meter({
  label,
  used,
  limit,
  remaining,
}: {
  label: string;
  used: number;
  limit: number;
  remaining: number;
}) {
  const { colors } = useTheme();
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor =
    pct >= 90 ? colors.danger : pct >= 70 ? colors.warning : colors.primary;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <ThemedText variant="body">{label}</ThemedText>
        <ThemedText variant="caption" muted>
          {remaining} left
        </ThemedText>
      </View>

      <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
        <View
          style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]}
        />
      </View>

      <ThemedText variant="caption" muted>
        {used} of {limit} used this month
      </ThemedText>
    </Card>
  );
}

/** "5 Jul" style date from an ISO string. */
function resetDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.xs,
  },
  card: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cap: {
    textTransform: 'capitalize',
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
