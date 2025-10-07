// db/client.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const client = postgres(connectionString, { ssl: 'require' })

export const db = drizzle(client, { schema })

export * from './schema'
