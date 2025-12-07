import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import HapticTab from "./components/HapticTab";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff00c5",
        tabBarInactiveTintColor: "#727272",
        tabBarBadgeStyle: { backgroundColor: "#f0f0f0", color: "#fff" },
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: { elevation: 5 },
        }),
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: () => <Ionicons name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarLabel: "Settings",
          tabBarIcon: () => (
            <Ionicons name="settings" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="hidden"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
