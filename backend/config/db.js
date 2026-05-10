import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || '';
const dbPassword = String(process.env.DB_PASSWORD ?? '');
export const dbDebugConfig = {
  mode: databaseUrl ? 'DATABASE_URL' : 'DB_FIELDS',
  name: process.env.DB_NAME || 'healthguard',
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  ssl: process.env.DB_SSL === 'true' || process.env.DB_SSLMODE === 'require' || databaseUrl.includes('sslmode=require'),
  passwordType: typeof dbPassword,
  passwordLength: dbPassword.length,
  hasPassword: databaseUrl ? databaseUrl.includes(':') : dbPassword.length > 0,
};

if (process.env.NODE_ENV !== 'production') {
  console.log('[DB] config loaded', dbDebugConfig);
  if (!dbDebugConfig.hasPassword) {
    console.warn('[DB] DB_PASSWORD is empty. This only works if local Postgres allows empty-password auth for this user.');
  }
}

const sharedOptions = {
  dialect: 'postgres',
  logging: false,
  ...(dbDebugConfig.ssl
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {}),
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, sharedOptions)
  : new Sequelize({
      database: dbDebugConfig.name,
      username: dbDebugConfig.user,
      password: dbPassword,
      host: dbDebugConfig.host,
      port: dbDebugConfig.port,
      ...sharedOptions,
    });

export default sequelize;
