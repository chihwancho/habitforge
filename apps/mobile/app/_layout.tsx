import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext'

function RouteGuard() {
  const { user, loading } = useAuthContext()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'
    if (!user && !inAuthGroup) router.replace('/(auth)/login')
    if (user && inAuthGroup) router.replace('/(tabs)')
  }, [user, loading, segments])

  return null
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RouteGuard />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
