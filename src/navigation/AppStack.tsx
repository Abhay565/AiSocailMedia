// src/navigation/AppStack.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../screens/Home'
import PostDetails from '../screens/PostDetails'
import CreatePost from '../screens/CreatePost'

const Stack = createNativeStackNavigator()

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PostDetails" component={PostDetails} />
      <Stack.Screen name="CreatePost" component={CreatePost} />
    </Stack.Navigator>
  )
}

export default AppStack
