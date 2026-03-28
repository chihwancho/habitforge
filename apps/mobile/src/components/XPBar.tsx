import { View, Text, StyleSheet } from 'react-native'
import { LevelInfo } from '@habitforge/shared'
import { colors, radius, typography } from '../theme'

export default function XPBar({ levelInfo, badgePoints }: { levelInfo: LevelInfo; badgePoints: number }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Level {levelInfo.level}</Text>
        <Text style={styles.xp}>{levelInfo.currentXP} / {levelInfo.xpForNextLevel} XP</Text>
        <Text style={styles.pts}>{badgePoints} badge pts</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${levelInfo.progressPercent}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  level: { ...typography.small, color: colors.accent, fontWeight: '700' },
  xp: { ...typography.small, color: colors.text2 },
  pts: { ...typography.small, color: colors.warning, fontWeight: '500', marginLeft: 'auto' },
  track: { height: 6, backgroundColor: colors.bg3, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.accent, borderRadius: radius.full },
})
