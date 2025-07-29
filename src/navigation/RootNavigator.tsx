// src/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { supabase } from '../lib/supabse'
import AppStack from './AppStack'
import AuthStack from './AuthStack'
import { View, ActivityIndicator } from 'react-native'

const RootNavigator = () => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
     <NavigationContainer>
    {session ? (
      <>
        {console.log("In AppStack")}
        <AppStack />
      </>
    ) : (
      <>
        {console.log("In AuthStack")}
        <AuthStack />
      </>
    )}
  </NavigationContainer>
  )
}

export default RootNavigator
