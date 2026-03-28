import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CreateHabitInput, DifficultyTier, FrequencyType, BASE_XP } from '@habitforge/shared'
import { colors, radius, typography } from '../theme'

interface Props {
  onClose: () => void
  onCreate: (input: CreateHabitInput) => Promise<void>
}

const FREQUENCIES: { value: FrequencyType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
  { value: 'one-time', label: 'One-time' },
]

const DIFFICULTIES: { tier: DifficultyTier; label: string; color: string }[] = [
  { tier: 1, label: 'Easy',   color: colors.tier1 },
  { tier: 2, label: 'Medium', color: colors.tier2 },
  { tier: 3, label: 'Hard',   color: colors.tier3 },
]

export default function CreateHabitSheet({ onClose, onCreate }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState<FrequencyType>('daily')
  const [difficulty, setDifficulty] = useState<DifficultyTier>(1)
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await onCreate({
        name: name.trim(), description: description.trim(),
        frequencyType: frequency, frequencyValue: 1, scheduledDays: [],
        difficultyTier: difficulty, baseXP: BASE_XP[difficulty],
        isActive: true, startDate: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
          <Text style={styles.title}>New Habit</Text>
          <TouchableOpacity onPress={handleCreate} disabled={!name.trim() || loading}>
            <Text style={[styles.create, (!name.trim() || loading) && styles.disabled]}>
              {loading ? 'Saving...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Morning run" placeholderTextColor={colors.text3} value={name} onChangeText={setName} autoFocus />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput style={styles.input} placeholder="A short note about this habit" placeholderTextColor={colors.text3} value={description} onChangeText={setDescription} />

          <Text style={styles.label}>Frequency</Text>
          <View style={styles.optionRow}>
            {FREQUENCIES.map(f => (
              <TouchableOpacity key={f.value} style={[styles.optionBtn, frequency === f.value && styles.optionBtnSelected]} onPress={() => setFrequency(f.value)}>
                <Text style={[styles.optionText, frequency === f.value && styles.optionTextSelected]}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.diffRow}>
            {DIFFICULTIES.map(d => (
              <TouchableOpacity
                key={d.tier}
                style={[styles.diffBtn, difficulty === d.tier && { backgroundColor: `${d.color}22`, borderColor: d.color }]}
                onPress={() => setDifficulty(d.tier)}
              >
                <Text style={[styles.diffLabel, difficulty === d.tier && { color: d.color }]}>{d.label}</Text>
                <Text style={[styles.diffXP, { color: d.color }]}>+{BASE_XP[d.tier]} XP</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border },
  optionBtnSelected: { backgroundColor: `${colors.accent}22`, borderColor: colors.accent },
  optionText: { ...typography.small, color: colors.text2 },
  optionTextSelected: { color: colors.accent, fontWeight: '600' },
  diffRow: { flexDirection: 'row', gap: 10 },
  diffBtn: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  diffLabel: { ...typography.small, color: colors.text2, fontWeight: '600' },
  diffXP: { ...typography.tiny, fontWeight: '500' },
})
