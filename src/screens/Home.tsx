import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Gradient behind status bar */}
      <LinearGradient
        colors={['#f12711', '#f0a912ff']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statusBarGradient}
      />
      <Text style={{color:"#000"}}>hero</Text>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  statusBarGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight, // height for iOS/Android
    zIndex: 10,
  },
});
