import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { CONNECTION_STRING } from "../config/config";

const sql = postgres(CONNECTION_STRING, { max: 10 });
export const db = drizzle(sql);

export const migrateDB = async () => {
  await migrate(db, { migrationsFolder: "src/db/drizzle" });
};
