export class HttpError extends Error {
  constructor(status: number,  message: string) {
    super(message);
  }
}

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new HttpError(res.status, res.statusText);
  return res.json();
}
