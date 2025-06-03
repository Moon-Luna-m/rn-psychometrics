import { useColorScheme } from "@/hooks/useColorScheme";
import { Providers } from "@/store/provider";
import i18n from "@/utils/i18n";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { I18nContext } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nContext.Provider value={{ i18n }}>
          <Providers>
            <PaperProvider>
              <ThemeProvider
                value={Object.assign(DefaultTheme, {
                  colors: {
                    ...DefaultTheme.colors,
                    background: "white",
                  },
                })}
              >
                <Slot />
              </ThemeProvider>
            </PaperProvider>
          </Providers>
        </I18nContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
