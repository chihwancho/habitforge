import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { colors } from '../../src/theme'

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { Habits: '◆', Badges: '★', Rewards: '◎' }
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>{icons[label] ?? '●'}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.bg2, borderTopColor: colors.border, borderTopWidth: 1, height: 72, paddingBottom: 10 },
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon label="Habits" focused={focused} /> }} />
      <Tabs.Screen name="badges" options={{ tabBarIcon: ({ focused }) => <TabIcon label="Badges" focused={focused} /> }} />
      <Tabs.Screen name="rewards" options={{ tabBarIcon: ({ focused }) => <TabIcon label="Rewards" focused={focused} /> }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabIcon: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  icon: { fontSize: 18, color: colors.text3 },
  iconFocused: { color: colors.accent },
  label: { fontSize: 10, color: colors.text3 },
  labelFocused: { color: colors.accent },
})
