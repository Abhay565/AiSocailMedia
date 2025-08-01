import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabse';
import CustomStatusBar from '../components/CustomStatusBar';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../store/index"
import { setUserData, clearUserData } from '../store/userSlice';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.user.userData);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        throw new Error(error?.message || 'No user found');
      }

      dispatch(setUserData(data.user));
    } catch (err: any) {
      console.log('Error fetching user data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    dispatch(clearUserData());
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{userData.email}</Text>

      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{userData.id}</Text>

      <TouchableOpacity onPress={handleSignOut}>
        <Text style={{ color: 'red', fontWeight: '700', fontSize: 18, marginTop: 24 }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});
