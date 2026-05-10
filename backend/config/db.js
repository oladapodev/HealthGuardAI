import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || '';
const dbPassword = String(process.env.DB_PASSWORD ?? '');
const dbSsl = process.env.DB_SSL === 'true' || process.env.DB_SSLMODE === 'require' || databaseUrl.includes('sslmode=require');
const dbSslRejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

function normalizeDatabaseUrl(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url);

    // pg parses sslmode from the connection string and can replace the
    // explicit ssl object below. Keep SSL policy centralized here so Aiven
    // self-signed chains can use rejectUnauthorized=false unless a CA is set.
    parsed.searchParams.delete('sslmode');
    parsed.searchParams.delete('ssl');
    parsed.searchParams.delete('sslcert');
    parsed.searchParams.delete('sslkey');
    parsed.searchParams.delete('sslrootcert');

    return parsed.toString();
  } catch {
    return url;
  }
}

const connectionUrl = normalizeDatabaseUrl(databaseUrl);
export const dbDebugConfig = {
  mode: connectionUrl ? 'DATABASE_URL' : 'DB_FIELDS',
  name: process.env.DB_NAME || 'healthguard',
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  ssl: dbSsl,
  sslRejectUnauthorized: dbSslRejectUnauthorized,
  passwordType: typeof dbPassword,
  passwordLength: dbPassword.length,
  hasPassword: connectionUrl ? connectionUrl.includes(':') : dbPassword.length > 0,
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
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: dbSslRejectUnauthorized } } }
    : {}),
};

const sequelize = connectionUrl
  ? new Sequelize(connectionUrl, sharedOptions)
  : new Sequelize({
      database: dbDebugConfig.name,
      username: dbDebugConfig.user,
      password: dbPassword,
      host: dbDebugConfig.host,
      port: dbDebugConfig.port,
      ...sharedOptions,
    });

export default sequelize;
