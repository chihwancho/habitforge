import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  (typeof process !== 'undefined' && process.env?.DATABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_DATABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_DATABASE_URL) ||
  ''

if (!connectionString) {
  console.warn('[HabitForge] DATABASE_URL not set. Check your .env file.')
}

// prepare: false is required for Supabase transaction pooler (PgBouncer)
const client = postgres(connectionString, {
  prepare: false,
  max: 1,
})

export const db = drizzle(client, { schema })

export type DB = typeof db
