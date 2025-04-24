import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            display: "none", // Oculta la barra inferior
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null, // Esto oculta la ruta completamente del sistema de navegación
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="medicacion"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
