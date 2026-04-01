import { useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabits, useXP } from '@habitforge/shared'
import { useAuthContext } from '../../src/contexts/AuthContext'
import HabitCard from '../../src/components/HabitCard'
import XPBar from '../../src/components/XPBar'
import CreateHabitSheet from '../../src/components/CreateHabitSheet'
import { colors, radius, typography } from '../../src/theme'

export default function HabitsScreen() {
  const { profile, signOut, refreshProfile } = useAuthContext()
  const { levelInfo, refresh: refreshXP } = useXP(profile?.id ?? '')

  const handleXPChange = useCallback(() => {
    refreshProfile()
    refreshXP()
  }, [refreshProfile, refreshXP])

  const { habits, completedIds, loading, createHabit, completeHabit, archiveHabit } = useHabits(profile?.id ?? '', handleXPChange)
  const [showCreate, setShowCreate] = useState(false)

  if (!profile) return null

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, {profile.username}</Text>
          <Text style={styles.subtitle}>Keep the streak alive.</Text>
        </View>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {levelInfo && <XPBar levelInfo={levelInfo} badgePoints={profile.badgePoints ?? 0} />}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your habits</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)}>
            <Text style={styles.addBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {loading
          ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
          : habits.length === 0
            ? <View style={styles.empty}>
                <Text style={styles.emptyText}>No habits yet.</Text>
                <Text style={styles.emptySubtext}>Create your first one to start earning XP!</Text>
              </View>
            : habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={completedIds.has(habit.id)}
                  onComplete={(note) => completeHabit(habit.id, note)}
                  onArchive={() => archiveHabit(habit.id)}
                />
              ))
        }
      </ScrollView>

      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet">
        <CreateHabitSheet
          onClose={() => setShowCreate(false)}
          onCreate={async (input) => { await createHabit(input); setShowCreate(false) }}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  greeting: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.small, color: colors.text2, marginTop: 2 },
  signOut: { ...typography.small, color: colors.text3, paddingVertical: 6 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...typography.h3, color: colors.text },
  addBtn: { backgroundColor: colors.accent, paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.md },
  addBtnText: { color: '#fff', ...typography.small, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 40, backgroundColor: colors.bg2, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  emptyText: { ...typography.body, color: colors.text2, marginBottom: 4 },
  emptySubtext: { ...typography.small, color: colors.text3, textAlign: 'center' },
})