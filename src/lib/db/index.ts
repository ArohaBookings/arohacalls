import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let dbInstance: Db | null = null;

export function getDb(): Db {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString && process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production");
  }

  if (!dbInstance) {
    const sql = neon(connectionString ?? "postgresql://placeholder@localhost/placeholder");
    dbInstance = drizzle(sql, { schema, casing: "snake_case" });
  }

  return dbInstance;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
export * from "./schema";
