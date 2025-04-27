/// <reference types="../../../.svelte-kit/ambient.d.ts" />
import { dev } from '$app/environment';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '$db/schema';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private'; // Import variables directly

if (!TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL is not set');
if (!dev && !TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is not set');

const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN
});

export const db = drizzle(client, { schema });

// Re-export everything from the schema file
export * from '../../db/schema';