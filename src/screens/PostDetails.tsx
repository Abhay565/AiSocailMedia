// src/screens/PostDetails.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function PostDetails({ route }) {
  const { postId } = route.params
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])

  const fetchPostDetails = async () => {
    const res = await fetch(`https://dummyjson.com/posts/${postId}`)
    const data = await res.json()
    setPost(data)
  }

  const fetchComments = async () => {
    const res = await fetch(`https://dummyjson.com/comments?postId=${postId}`)
    const data = await res.json()
    setComments(data.comments)
  }

  useEffect(() => {
    fetchPostDetails()
    fetchComments()
  }, [])

  if (!post) return <Text>Loading...</Text>

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>

      <Text style={styles.commentsHeader}>Comments:</Text>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.commentCard}>
          <Text style={{ fontWeight: 'bold' }}>{comment.name}</Text>
          <Text>{comment.body}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 32 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  body: { fontSize: 16, marginBottom: 20 },
  commentsHeader: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  commentCard: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
})
