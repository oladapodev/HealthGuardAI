import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = String(process.env.DB_PASSWORD ?? '');
export const dbDebugConfig = {
  name: process.env.DB_NAME || 'healthguard',
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  passwordType: typeof dbPassword,
  passwordLength: dbPassword.length,
  hasPassword: dbPassword.length > 0,
};

if (process.env.NODE_ENV !== 'production') {
  console.log('[DB] config loaded', dbDebugConfig);
  if (!dbDebugConfig.hasPassword) {
    console.warn('[DB] DB_PASSWORD is empty. This only works if local Postgres allows empty-password auth for this user.');
  }
}

const sequelize = new Sequelize({
  database: dbDebugConfig.name,
  username: dbDebugConfig.user,
  password: dbPassword,
  host: dbDebugConfig.host,
  port: dbDebugConfig.port,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
