import { StyleSheet } from 'react-native'

export const colors = {
  bg: '#0f0f11', bg2: '#18181c', bg3: '#222228', border: '#2e2e38',
  text: '#f0eeff', text2: '#9090a8', text3: '#5a5a70',
  accent: '#7c6dfa', accent2: '#5b4dd4',
  success: '#3ecf8e', warning: '#f5a623', danger: '#e53e3e',
  tier1: '#3ecf8e', tier2: '#f5a623', tier3: '#e53e3e',
} as const

export const radius = { sm: 6, md: 10, lg: 16, xl: 24, full: 999 } as const

export const typography = StyleSheet.create({
  h1:    { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  h2:    { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  h3:    { fontSize: 17, fontWeight: '600' },
  body:  { fontSize: 15, fontWeight: '400' },
  small: { fontSize: 13, fontWeight: '400' },
  tiny:  { fontSize: 11, fontWeight: '400' },
})

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const
