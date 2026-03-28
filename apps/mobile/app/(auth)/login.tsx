import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native'
import { useAuthContext } from '../../src/contexts/AuthContext'
import { colors, radius, typography } from '../../src/theme'

export default function LoginScreen() {
  const { signIn, signUp } = useAuthContext()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (mode === 'signin') await signIn(email, password)
      else await signUp(email, password, username)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>HabitForge</Text>
        <Text style={styles.tagline}>Build habits. Earn rewards.</Text>

        <View style={styles.tabs}>
          {(['signin', 'signup'] as const).map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.tab, mode === m && styles.tabActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === 'signin' ? 'Sign in' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === 'signup' && (
          <TextInput
            style={styles.input} placeholder="Username"
            placeholderTextColor={colors.text3} value={username}
            onChangeText={setUsername} autoCapitalize="none"
          />
        )}
        <TextInput
          style={styles.input} placeholder="Email"
          placeholderTextColor={colors.text3} value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
        />
        <TextInput
          style={styles.input} placeholder="Password"
          placeholderTextColor={colors.text3} value={password}
          onChangeText={setPassword} secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabled]}
          onPress={handleSubmit} disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitBtnText}>
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 28, width: '100%', maxWidth: 400 },
  logo: { ...typography.h1, color: colors.accent, textAlign: 'center', marginBottom: 4 },
  tagline: { ...typography.body, color: colors.text2, textAlign: 'center', marginBottom: 24 },
  tabs: { flexDirection: 'row', backgroundColor: colors.bg3, borderRadius: radius.md, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabActive: { backgroundColor: colors.bg2 },
  tabText: { ...typography.small, color: colors.text2 },
  tabTextActive: { color: colors.text },
  input: { backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.text, ...typography.body, marginBottom: 12 },
  error: { color: colors.danger, ...typography.small, marginBottom: 8 },
  submitBtn: { backgroundColor: colors.accent, borderRadius: radius.md, padding: 14, alignItems: 'center', marginTop: 8 },
  disabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', ...typography.body, fontWeight: '600' },
})
