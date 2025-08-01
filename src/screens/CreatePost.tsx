import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ButtonColored from "../components/ButtonColored";
import CustomStatusBar from "../components/CustomStatusBar";
import { supabase } from "../lib/supabse";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Validation", "Both title and body are required");
      return;
    }

    try {
      // ✅ Get the current Supabase user session (auth.uid())
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        Alert.alert("Auth Error", "User not authenticated.");
        return;
      }

      const { data, error } = await supabase.from("create-post").insert([
        {
          title: title.trim(),
          body: body.trim(),
          user_id: user.id,
          email: user.email,
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        Alert.alert("Error", error.message || "Failed to create post.");
        return;
      }

      setTitle("");
      setBody("");
      navigation.navigate('OurPost', {
  screen: 'HomeScreen', // ensure this matches your HomeStack
});
      Alert.alert("Success", "Post created successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar />
      <KeyboardAvoidingView
        style={styles.formCard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.header}>Create New Post</Text>
        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Body"
          style={[styles.input, styles.bodyInput]}
          value={body}
          onChangeText={setBody}
          multiline
          placeholderTextColor="#888"
        />
        <ButtonColored title="Create Post" onPress={handleSubmit} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafdff",
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 18,
    elevation: 6,
    shadowColor: "#4f8cff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222e3a",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "#f0f4fa",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#222e3a",
    borderWidth: 1,
    borderColor: "#e3e8f0",
  },
  bodyInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
