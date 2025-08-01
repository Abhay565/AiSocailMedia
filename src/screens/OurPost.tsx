// src/screens/OurPost.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { supabase } from "../lib/supabse";
import CustomStatusBar from "../components/CustomStatusBar";

const OurPost = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from("create-post")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("Fetched posts:", data);
  if (error) {
    console.error("Fetch posts error:", error.message);
  } else {
    setPosts(data || []);
  }
  setLoading(false);
};


  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{item.email ? item.email[0].toUpperCase() : '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </View>
      <Text style={styles.body}>{item.body}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.email}>Posted by: {item.email}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
        <CustomStatusBar />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default OurPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f7fa',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    elevation: 6,
    shadowColor: '#1a2a3a',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#e3eaf2',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#007bff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1a2a3a',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  body: {
    fontSize: 16,
    color: '#3a4a5a',
    marginBottom: 10,
    lineHeight: 22,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  email: {
    fontSize: 13,
    color: '#007bff',
    fontStyle: 'italic',
    textAlign: 'right',
    fontWeight: '500',
  },
});
