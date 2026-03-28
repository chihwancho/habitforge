import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBadges } from '@habitforge/shared'
import { useAuthContext } from '../../src/contexts/AuthContext'
import { colors, radius, typography } from '../../src/theme'

export default function BadgesScreen() {
  const { profile } = useAuthContext()
  const { badges, allBadges, earnedIds, loading } = useBadges(profile!.id)

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>{badges.length} earned · {profile?.badgePoints ?? 0} badge points</Text>
      </View>

      {loading
        ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        : (
          <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
            {allBadges.map(badge => {
              const earned = earnedIds.has(badge.id)
              return (
                <View key={badge.id} style={[styles.card, earned && styles.cardEarned, !earned && styles.cardLocked]}>
                  <View style={styles.iconWrap}>
                    <Text style={styles.iconText}>{badge.name[0]}</Text>
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeDesc} numberOfLines={2}>{badge.description}</Text>
                  <Text style={styles.badgePts}>{badge.badgePointValue} pts</Text>
                  {!earned && (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedText}>Locked</Text>
                    </View>
                  )}
                </View>
              )
            })}
          </ScrollView>
        )
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.small, color: colors.text2, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingBottom: 100, gap: 12 },
  card: { width: '46%', backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, alignItems: 'center', gap: 6, position: 'relative', overflow: 'hidden' },
  cardEarned: { borderColor: colors.warning },
  cardLocked: { opacity: 0.5 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.bg3, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22, color: colors.accent, fontWeight: '700' },
  badgeName: { ...typography.body, color: colors.text, fontWeight: '600', textAlign: 'center' },
  badgeDesc: { ...typography.small, color: colors.text2, textAlign: 'center' },
  badgePts: { ...typography.small, color: colors.warning, fontWeight: '500' },
  lockedBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 3, alignItems: 'center' },
  lockedText: { ...typography.small, color: colors.text3 },
})
