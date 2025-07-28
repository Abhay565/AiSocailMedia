import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonColoredProps {
  onPress: (event: GestureResponderEvent) => void;
  title: String,
}

const ButtonColored: React.FC<ButtonColoredProps> = ({ onPress,title }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
        <LinearGradient
          colors={["#f12711", "#f5af19"]}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonColored;

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
