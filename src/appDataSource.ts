import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Report } from "./entity/report";
import { File } from "./entity/file";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT as string) || 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "report_db",
  synchronize: isDev,
  // logging: isDev,
  entities: [Report, File],
});
