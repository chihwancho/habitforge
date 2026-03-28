import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRewards } from '@habitforge/shared'
import { useAuthContext } from '../../src/contexts/AuthContext'
import CreateRewardSheet from '../../src/components/CreateRewardSheet'
import { colors, radius, typography } from '../../src/theme'

export default function RewardsScreen() {
  const { profile } = useAuthContext()
  const { rewards, loading, createReward, redeemReward } = useRewards(profile!.id)
  const [showCreate, setShowCreate] = useState(false)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  const handleRedeem = (rewardId: string, name: string, cost: number) => {
    Alert.alert('Redeem reward', `Spend ${cost} badge points on "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem', onPress: async () => {
        setRedeeming(rewardId)
        try {
          await redeemReward(rewardId)
          Alert.alert('Redeemed!', `Enjoy your "${name}"`)
        } catch (e: any) {
          Alert.alert('Error', e.message)
        } finally {
          setRedeeming(null)
        }
      }},
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Rewards</Text>
          <Text style={styles.subtitle}>{profile?.badgePoints ?? 0} badge points to spend</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(true)}>
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {loading
        ? <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        : (
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {rewards.length === 0
              ? <View style={styles.empty}>
                  <Text style={styles.emptyText}>No rewards yet.</Text>
                  <Text style={styles.emptySubtext}>Create one to give yourself something to work toward!</Text>
                </View>
              : rewards.map(reward => {
                  const canAfford = (profile?.badgePoints ?? 0) >= reward.badgePointCost
                  const isRedeeming = redeeming === reward.id
                  return (
                    <View key={reward.id} style={[styles.card, !canAfford && styles.cardDim]}>
                      <View style={styles.info}>
                        <Text style={styles.rewardName}>{reward.name}</Text>
                        {reward.description ? <Text style={styles.rewardDesc}>{reward.description}</Text> : null}
                        <Text style={styles.rewardCost}>{reward.badgePointCost} pts</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.redeemBtn, (!canAfford || isRedeeming) && styles.redeemBtnDisabled]}
                        disabled={!canAfford || isRedeeming}
                        onPress={() => handleRedeem(reward.id, reward.name, reward.badgePointCost)}
                      >
                        {isRedeeming
                          ? <ActivityIndicator color={colors.text2} size="small" />
                          : <Text style={styles.redeemText}>Redeem</Text>
                        }
                      </TouchableOpacity>
                    </View>
                  )
                })
            }
          </ScrollView>
        )
      }

      <Modal visible={showCreate} animationType="slide" presentationStyle="pageSheet">
        <CreateRewardSheet
          onClose={() => setShowCreate(false)}
          onCreate={async (input) => { await createReward(input); setShowCreate(false) }}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.small, color: colors.text2, marginTop: 2 },
  addBtn: { backgroundColor: colors.accent, paddingVertical: 6, paddingHorizontal: 14, borderRadius: radius.md },
  addBtnText: { color: '#fff', ...typography.small, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 10 },
  card: { backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardDim: { opacity: 0.5 },
  info: { flex: 1 },
  rewardName: { ...typography.body, color: colors.text, fontWeight: '600' },
  rewardDesc: { ...typography.small, color: colors.text2, marginTop: 2 },
  rewardCost: { ...typography.small, color: colors.warning, fontWeight: '500', marginTop: 4 },
  redeemBtn: { backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: 8, paddingHorizontal: 14, minWidth: 80, alignItems: 'center' },
  redeemBtnDisabled: { opacity: 0.4 },
  redeemText: { ...typography.small, color: colors.text, fontWeight: '500' },
  empty: { alignItems: 'center', padding: 40, backgroundColor: colors.bg2, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  emptyText: { ...typography.body, color: colors.text2, marginBottom: 4 },
  emptySubtext: { ...typography.small, color: colors.text3, textAlign: 'center' },
})
