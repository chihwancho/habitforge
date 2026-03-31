import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Supabase uses public schema by default
  schemaFilter: ['public'],
  // Don't touch Supabase's internal schemas
  tablesFilter: ['!auth.*', '!storage.*', '!realtime.*'],
})
