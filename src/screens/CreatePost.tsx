// src/screens/CreatePost.tsx
import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const navigation = useNavigation()

  const handleSubmit = async () => {
    if (!title || !body) {
      Alert.alert('Validation', 'Both title and body are required')
      return
    }

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })

    const data = await response.json()
    console.log('Post created:', data)
    Alert.alert('Success', 'Post created successfully!')
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Body"
        style={[styles.input, { height: 120 }]}
        value={body}
        onChangeText={setBody}
        multiline
      />
      <Button title="Create Post" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
})
