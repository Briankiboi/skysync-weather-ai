import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/skysync-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SkySync</Text>
      <Text style={styles.subtitle}>Your Weather Intelligence</Text>
      <Text style={styles.status}>✓ App is running</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A1A5E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#F4C430',
    fontSize: 16,
    marginTop: 4,
  },
  status: {
    color: '#7FD7FF',
    fontSize: 14,
    marginTop: 28,
  },
});
