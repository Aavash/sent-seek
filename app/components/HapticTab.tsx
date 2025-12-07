import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements"; // Fixed import path
import * as Haptics from "expo-haptics"; // Fixed quotes

export default function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Added proper enum
        }
        // Call original onPressIn if it exists
        if (props.onPressIn) {
          props.onPressIn(ev);
        }
      }}
    />
  );
}
