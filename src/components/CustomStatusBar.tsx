import React from "react";
import {
  StatusBar,
  View,
  Platform,
  StyleSheet,
  StatusBarStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CustomStatusBarProps {
  barStyle?: StatusBarStyle;
  gradientColors?: string[];
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({
  barStyle = "light-content",
  gradientColors = ["#f12711", "#f0a912ff"],
}) => {
  return (
    <View style={styles.statusBarContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={barStyle}
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </View>
  );
};

export default CustomStatusBar;

const styles = StyleSheet.create({
  statusBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gradient: {
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
    width: "100%",
  },
});
