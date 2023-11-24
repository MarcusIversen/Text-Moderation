import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { CONNECTION_STRING } from "../config/config";

const sql = postgres(CONNECTION_STRING, { max: 1 });
const db = drizzle(sql);

export const setupDatabase = async () => {
  await migrate(db, { migrationsFolder: "src/db/drizzle" });
};
