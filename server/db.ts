import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Connection pool configuration
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/aheadoftrends',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Drizzle instance with schema
export const db = drizzle(pool, { schema, mode: 'default' });

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Run migrations (development only)
export async function runMigrations() {
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    const { migrate } = await import('drizzle-orm/mysql2/migrator');
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.warn('⚠️ Migrations skipped or failed (check if drizzle folder exists):', (error as Error).message);
  }
}
