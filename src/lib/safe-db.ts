export function hasUsableDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) return false;
  try {
    const url = new URL(value);
    return Boolean(url.hostname && url.hostname !== "HOST" && !value.includes("USER:PASS"));
  } catch {
    return false;
  }
}

export async function queryOrEmpty<T>(query: Promise<T[]>, label: string): Promise<T[]> {
  if (!hasUsableDatabaseUrl()) return [];

  try {
    return await query;
  } catch (error) {
    console.error(`[db:${label}]`, error);
    return [];
  }
}
