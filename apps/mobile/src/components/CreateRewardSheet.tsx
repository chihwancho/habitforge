import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CreateRewardInput } from '@habitforge/shared'
import { colors, radius, typography } from '../theme'

interface Props {
  onClose: () => void
  onCreate: (input: CreateRewardInput) => Promise<void>
}

export default function CreateRewardSheet({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('10')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await onCreate({ name: name.trim(), description: description.trim(), badgePointCost: parseInt(cost) || 10, rewardType: 'custom', isActive: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          <Text style={styles.title}>New Reward</Text>
          <TouchableOpacity onPress={handleCreate} disabled={!name.trim() || loading}>
            <Text style={[styles.create, (!name.trim() || loading) && styles.disabled]}>
              {loading ? 'Saving...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Reward name</Text>
          <TextInput style={styles.input} placeholder="e.g. Movie night" placeholderTextColor={colors.text3} value={name} onChangeText={setName} autoFocus />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput style={styles.input} placeholder="What is this reward?" placeholderTextColor={colors.text3} value={description} onChangeText={setDescription} />

          <Text style={styles.label}>Badge point cost</Text>
          <TextInput style={styles.input} placeholder="10" placeholderTextColor={colors.text3} value={cost} onChangeText={setCost} keyboardType="number-pad" />
          <Text style={styles.hint}>Earn badge points by collecting badges.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.body, color: colors.text, fontWeight: '600' },
  cancel: { ...typography.body, color: colors.text2 },
  create: { ...typography.body, color: colors.accent, fontWeight: '600' },
  disabled: { opacity: 0.4 },
  form: { padding: 20, gap: 6 },
  label: { ...typography.small, color: colors.text2, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.text, ...typography.body },
  hint: { ...typography.tiny, color: colors.text3, marginTop: 4 },
})
