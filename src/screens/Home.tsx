import React, { useEffect, useState } from "react";
import { supabase } from '../lib/supabse';
import { Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ButtonColored from "../components/ButtonColored";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const navigation = useNavigation<any>();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dummyjson.com/posts?_limit=10");
      const data = await response.json();
      // Add an image field to each post using a free image service
      const postsWithImages = data.posts.map((post: any) => ({
        ...post,
        image: `https://picsum.photos/seed/${post.id}/300/200`,
      }));
      setPosts(postsWithImages);
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const [localReactions, setLocalReactions] = useState<{
    [key: number]: { likes: number; dislikes: number };
  }>({});

  const handleLike = (postId: number) => {
    setLocalReactions((prev) => ({
      ...prev,
      [postId]: {
        likes:
          (prev[postId]?.likes ??
            posts.find((p) => p.id === postId)?.reactions?.likes ??
            0) + 1,
        dislikes:
          prev[postId]?.dislikes ??
          posts.find((p) => p.id === postId)?.reactions?.dislikes ??
          0,
      },
    }));
  };

  const handleDislike = (postId: number) => {
    setLocalReactions((prev) => ({
      ...prev,
      [postId]: {
        likes:
          prev[postId]?.likes ??
          posts.find((p) => p.id === postId)?.reactions?.likes ??
          0,
        dislikes:
          (prev[postId]?.dislikes ??
            posts.find((p) => p.id === postId)?.reactions?.dislikes ??
            0) + 1,
      },
    }));
  };

  const openCommentModal = (postId: number) => {
    setCurrentPostId(postId);
    setCommentInput("");
    setCommentModalVisible(true);
  };

  const submitComment = () => {
    if (currentPostId !== null && commentInput.trim() !== "") {
      setComments((prev) => ({
        ...prev,
        [currentPostId]: [...(prev[currentPostId] || []), commentInput.trim()],
      }));
      setCommentInput("");
      setCommentModalVisible(false);
    }
  };

  const PostCard = ({ item }: any) => {
    const navigation = useNavigation<any>();
    const reactions = localReactions[item.id] ||
      item.reactions || { likes: 0, dislikes: 0 };

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PostDetails", { postId: item.id })
          }
          activeOpacity={0.4}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.body} numberOfLines={3}>
            {item?.body}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.user}>👤 User ID: {item?.userId}</Text>
          </View>

          <View style={styles.tagRow}>
            {item.tags.map((tag: string, index: number) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>

          <View style={styles.reactionRow}>
            <View style={styles.thumbCol}>
              <View style={styles.reactionButton}>
                <Text
                  style={[
                    styles.reactions,
                    localReactions[item.id]?.liked && styles.likedCount,
                  ]}
                >
                  {reactions.likes}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleLike(item.id)}
              >
                <Text
                  style={[
                    styles.thumbIcon,
                    localReactions[item.id]?.liked && styles.likedThumb,
                  ]}
                >
                  👍
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.thumbCol}>
              
              <View style={styles.reactionButton}>
                <Text style={styles.reactions}>{reactions.dislikes}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDislike(item.id)}
              >
                <Text style={styles.thumbIcon}>👎</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => openCommentModal(item.id)}
              style={styles.reactionButton}
            >
              <Text style={styles.commentButton}>💬 Comment</Text>
            </TouchableOpacity>
          </View>

          {comments[item.id] && comments[item.id].length > 0 && (
            <View style={styles.commentSection}>
              <Text style={styles.commentHeader}>Comments:</Text>
              {comments[item.id].map((c, idx) => (
                <Text key={idx} style={styles.commentText}>
                  • {c}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }: any) => <PostCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchPosts} />
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
          {posts.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No posts available
            </Text>
          )}
          
          <View style={styles.createButton}>
            <ButtonColored title={'+ New Post'}  onPress={()=>navigation.navigate("CreatePost")} />
          </View>
        </>
      )}

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.commentHeader}>Add a Comment</Text>
            <TextInput
              style={styles.commentInput}
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="Type your comment..."
              multiline
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setCommentModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={{ color: "#007bff", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitComment}
                style={styles.modalButton}
              >
                <Text style={{ color: "#007bff", fontWeight: "bold" }}>
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f8f9fa",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4, // Increased elevation for a stronger shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12.0,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#ccc",
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 18,
  },
  thumbCol: {
    alignItems: "center",
    marginRight: 10,
  },
  reactionButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    marginBottom: 4,
  },
  thumbIcon: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 2,
    color: "#888",
  },
  likedThumb: {
    color: "#fff",
    backgroundColor: "#2196f3",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  likedCount: {
    backgroundColor: "#2196f3",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    fontWeight: "bold",
    marginTop: 2,
  },
  commentButton: {
    fontSize: 12,
    color: "#007bff",
    fontWeight: "bold",
  },
  user: {
    fontSize: 12,
    color: "#666",
  },
  reactions: {
    fontSize: 12,
    color: "#e63946",
    fontWeight: "bold",
  },
  commentSection: {
    marginTop: 8,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    padding: 8,
  },
  commentHeader: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  commentText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  modalButton: {
    marginLeft: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    fontSize: 12,
    color: "#007bff",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  createButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: "34%",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
