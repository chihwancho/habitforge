import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Habit } from '@habitforge/shared'
import { colors, radius, typography } from '../theme'

interface Props {
  habit: Habit
  isCompleted: boolean
  onComplete: (note?: string) => Promise<any>
  onArchive: () => Promise<void>
}

const DIFFICULTY_LABELS = ['', 'Easy', 'Medium', 'Hard']
const DIFFICULTY_COLORS = ['', colors.tier1, colors.tier2, colors.tier3]

export default function HabitCard({ habit, isCompleted, onComplete, onArchive }: Props) {
  const [completing, setCompleting] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const done = isCompleted || justCompleted

  const handleComplete = async () => {
    setCompleting(true)
    try {
      const result = await onComplete()
      setJustCompleted(true)
      Alert.alert(
        'Habit completed!',
        `+${result.xpEarned} XP · ${result.newStreak} day streak` +
        (result.badgesEarned.length > 0 ? `\n\nNew badge: ${result.badgesEarned.join(', ')}` : '')
      )
      setTimeout(() => setJustCompleted(false), 2000)
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setCompleting(false)
    }
  }

  const handleArchive = () => {
    Alert.alert('Archive habit', `Archive "${habit.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', style: 'destructive', onPress: onArchive },
    ])
  }

  const tierColor = DIFFICULTY_COLORS[habit.difficultyTier]

  return (
    <View style={[styles.card, done && styles.cardCompleted]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.tierDot, { backgroundColor: tierColor }]} />
          <Text style={styles.name}>{habit.name}</Text>
        </View>
        <TouchableOpacity onPress={handleArchive}>
          <Text style={styles.archiveBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {habit.description ? <Text style={styles.description}>{habit.description}</Text> : null}

      <View style={styles.tags}>
        <View style={[styles.tag, { backgroundColor: `${tierColor}22` }]}>
          <Text style={[styles.tagText, { color: tierColor }]}>{DIFFICULTY_LABELS[habit.difficultyTier]}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{habit.frequencyType}</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: `${colors.accent}22` }]}>
          <Text style={[styles.tagText, { color: colors.accent }]}>+{habit.baseXP} XP</Text>
        </View>
      </View>

      <View style={styles.streakRow}>
        <Text style={styles.fire}>🔥</Text>
        <Text style={styles.streakCount}>{habit.currentStreak} day streak</Text>
        {habit.longestStreak > 0 && (
          <Text style={styles.streakBest}>Best: {habit.longestStreak}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.completeBtn, done && styles.completeBtnDone, (completing || done) && styles.completeBtnDisabled]}
        onPress={handleComplete}
        disabled={completing || done}
        activeOpacity={0.75}
      >
        <Text style={[styles.completeBtnText, done && styles.completeBtnTextDone]}>
          {done ? '✓ Done!' : completing ? 'Saving...' : 'Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, marginBottom: 10, gap: 10 },
  cardCompleted: { borderColor: colors.success },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  tierDot: { width: 8, height: 8, borderRadius: 4 },
  name: { ...typography.body, color: colors.text, fontWeight: '600', flex: 1 },
  description: { ...typography.small, color: colors.text2 },
  archiveBtn: { color: colors.text3, fontSize: 14, padding: 4 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: colors.bg3, borderRadius: radius.full, paddingVertical: 3, paddingHorizontal: 10 },
  tagText: { ...typography.tiny, color: colors.text2, fontWeight: '500' },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fire: { fontSize: 16 },
  streakCount: { ...typography.small, color: colors.text, fontWeight: '600' },
  streakBest: { ...typography.tiny, color: colors.text3, marginLeft: 'auto' },
  completeBtn: { backgroundColor: `${colors.accent}22`, borderWidth: 1, borderColor: `${colors.accent}44`, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center', marginTop: 2 },
  completeBtnDone: { backgroundColor: `${colors.success}22`, borderColor: `${colors.success}44` },
  completeBtnDisabled: { opacity: 0.6 },
  completeBtnText: { ...typography.body, color: colors.accent, fontWeight: '600' },
  completeBtnTextDone: { color: colors.success },
})