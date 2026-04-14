import { DarkTheme, DefaultTheme, ThemeProvider } 
    from "@react-navigation/native"
import { Stack } from "expo-router"
// import { StatusBar } from "expo-status-bar";
import 'react-native-reanimated';

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout(){
    const theme = useColorScheme();

    return(
        <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
            {/* headerShown: oculta o cabeçalho padrão da Stack */}
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </ThemeProvider>
    )
}