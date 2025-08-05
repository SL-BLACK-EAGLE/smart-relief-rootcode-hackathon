import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './globals.css';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Provider } from "react-redux";
import { store } from '@/src/store';
import AppNavigator from '@/src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider store={store}>
        <SafeAreaProvider>
          {/* We're using AppNavigator here instead of Expo Router's Stack component */}
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </Provider>
    </ThemeProvider>
  );
}
