import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { scheduleMultiplePopupNotifications } from "@/constants/notifications";

import { useRouter } from "expo-router";
// Evita que se oculte el splash screen antes de tiempo
SplashScreen.preventAutoHideAsync();

// ✅ Manejador para mostrar notificaciones mientras la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // ✅ CONFIGURAR NOTIFICACIONES
  useEffect(() => {
    const setupNotifications = async () => {
      console.log("⏰ Configurando notificaciones...");
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Permisos de notificación no concedidos.");
          return;
        }

        // Canal para Android
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
        });

        await Notifications.cancelAllScheduledNotificationsAsync();
        await scheduleMultiplePopupNotifications();
      }
    };

    setupNotifications();
  }, []);

  // ✅ ESCUCHAR CLICK EN NOTIFICACIÓN
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const temaId = response.notification.request.content.data.temaId;
        if (temaId) {
          console.log("🔁 Redirigiendo a /guia/" + temaId);
          router.push(`/guia/${temaId}`);
        }
      }
    );

    return () => subscription.remove(); // Limpieza
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
