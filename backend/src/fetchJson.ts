// WAS: <T extends Record<string, unknown>>
export async function fetchJson<T extends object>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as unknown as T;
}
