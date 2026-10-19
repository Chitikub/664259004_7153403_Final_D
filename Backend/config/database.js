import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const dbUser = process.env.DB_USER || process.env.POSTGRES_USER || "postgres";
const dbPassword =
  process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || "postgres";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || process.env.POSTGRES_PORT || "5432";
const dbName = process.env.DB_NAME || process.env.POSTGRES_DB || "postgres";

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgres://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}`;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions:
    process.env.DB_SSL === "true"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
