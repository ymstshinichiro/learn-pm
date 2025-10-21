import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// PostgreSQL client configuration with IPv4 preference
const client = postgres(connectionString, {
  prepare: false,
  // Force IPv4 resolution to avoid ENETUNREACH errors with IPv6
  connect_timeout: 10,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
});

export const db = drizzle(client, { schema });
