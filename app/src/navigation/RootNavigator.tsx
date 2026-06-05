import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme as NavTheme,
} from '@react-navigation/native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  DailyScreen,
  HomeScreen,
  HourlyScreen,
  SettingsScreen,
  UsageScreen,
} from '@/screens';
import { fontSize, fontWeight } from '@/theme';
import { useTheme } from '@/theme/useTheme';

const Tab = createBottomTabNavigator();

// Branded bottom tab bar: deep purple bar with a yellow active icon/label.
// Kept independent of the screen theme so it stays consistent in both modes.
const TAB_BAR = {
  background: '#250E52',
  border: 'rgba(255,255,255,0.10)',
  active: '#F4C430', // yellow
  inactive: '#9C8FC4',
} as const;

type IconName = keyof typeof Ionicons.glyphMap;

// Distinct outline/filled icons per tab for a friendlier look.
const ICONS: Record<string, { active: IconName; inactive: IconName }> = {
  Home: { active: 'partly-sunny', inactive: 'partly-sunny-outline' },
  Daily: { active: 'calendar', inactive: 'calendar-outline' },
  Hourly: { active: 'time', inactive: 'time-outline' },
  Usage: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

export function RootNavigator() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  // Always keep a comfortable gap above the system nav/gesture bar.
  const MIN_BOTTOM_GAP = Platform.OS === 'android' ? 18 : 0;
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_GAP);

  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme: NavTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      primary: colors.primary,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          // Tab bar is intentionally branded purple with a yellow active
          // icon, independent of the screen theme.
          tabBarActiveTintColor: TAB_BAR.active,
          tabBarInactiveTintColor: TAB_BAR.inactive,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            marginBottom: Platform.OS === 'android' ? 4 : 0,
          },
          tabBarItemStyle: {
            paddingTop: 6,
          },
          tabBarStyle: {
            backgroundColor: TAB_BAR.background,
            borderTopColor: TAB_BAR.border,
            borderTopWidth: 1,
            height: 64 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 8,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? ICONS[route.name].active : ICONS[route.name].inactive}
              color={color}
              size={size}
            />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Daily" component={DailyScreen} />
        <Tab.Screen name="Hourly" component={HourlyScreen} />
        <Tab.Screen name="Usage" component={UsageScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
