const API_BASE = '/api';

export interface HelloResponse {
  message: string;
  timestamp: string;
}

export async function getHello(): Promise<HelloResponse> {
  const res = await fetch(`${API_BASE}/hello`);
  if (!res.ok) throw new Error('Failed to fetch hello');
  return res.json();
}
