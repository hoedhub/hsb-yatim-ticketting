import 'dotenv/config'; // Make sure this runs first to load .env
import { defineConfig } from 'drizzle-kit';

// 1. Retrieve the environment variables
const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// 2. Validate that the required variables are actually set
if (!dbUrl) {
  // Throw an error if the URL is missing. Drizzle Kit needs it.
  throw new Error(
    'Missing environment variable: TURSO_DATABASE_URL is required for drizzle-kit.'
  );
}

if (!authToken) {
  // Throw an error if the Auth Token is missing. Drizzle Kit needs it for Turso.
  // Note: If you are using a local Turso replica that doesn't require a token,
  // you might adjust this logic, but generally, it's needed for remote DBs.
  throw new Error(
    'Missing environment variable: TURSO_AUTH_TOKEN is required for drizzle-kit.'
  );
}

// 3. Define the configuration using the validated variables
export default defineConfig({
  out: './src/db', // Output directory for migrations
  schema: './src/db/schema.ts', // Path to your schema file
  dialect: 'turso', // Specify the dialect
  dbCredentials: {
    // Now TypeScript knows dbUrl and authToken are definitely strings
    // because the code would have thrown an error above otherwise.
    url: dbUrl,
    authToken: authToken,
  },
  // Optional: Enable verbose logging for drizzle-kit commands
  // verbose: true,
  // Optional: Enable strict mode for drizzle-kit commands
  // strict: true,
});