import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
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
import { colors, fontSize, fontWeight } from '@/theme';

const Tab = createBottomTabNavigator();

const navTheme: NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.backgroundAlt,
    primary: colors.accent,
    text: colors.text,
    border: colors.border,
  },
};

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
  const insets = useSafeAreaInsets();
  // Respect the phone's bottom gesture/nav bar so the tab bar is never cramped.
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textFaint,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            marginBottom: Platform.OS === 'android' ? 4 : 0,
          },
          tabBarItemStyle: {
            paddingTop: 6,
          },
          tabBarStyle: {
            backgroundColor: colors.backgroundAlt,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 6,
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
