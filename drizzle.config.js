import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/main/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  introspection: {
    mode: 'schema',
    schemas: ['public'], 
  },
})
