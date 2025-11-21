// src/api/client.ts
import type { BookingRequest, BookingResponse } from "../types/Booking.js";

const BASE = "https://731xy9c2ak.execute-api.eu-north-1.amazonaws.com";

/*eslint-disable*/
export async function fetchApiKey(): Promise<string> {
  const res = await fetch(`${BASE}/key`);
  console.log("[api] /key status:", res.status);
  if (!res.ok) throw new Error(`Key HTTP ${res.status}`);

  const raw = (await res.text()).trim();
  try {
    const { key } = JSON.parse(raw);
    console.log("[api] key(json):", key?.slice(0, 6) + "…" + key?.slice(-6), `(len ${key?.length})`);
    return key;
  } catch {
    console.log("[api] key(text):", raw.slice(0, 6) + "…" + raw.slice(-6), `(len ${raw.length})`);
    return raw;
  }
}

async function tryOnce(payload: BookingRequest, apiKey: string) {
  const res = await fetch(`${BASE}/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  console.log("[api] /booking status:", res.status);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err: any = new Error(text || res.statusText);
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  console.log("[api] booking OK:", json);
  return json;
}

export async function createBookingStrict(
  payload: BookingRequest,
  apiKey: string
): Promise<BookingResponse> {
  try {
    return await tryOnce(payload, apiKey);
  } catch (e: any) {
    if (e?.status === 401) {
      const fresh = await fetchApiKey();
      return await tryOnce(payload, fresh);
    }
    if (e?.status === 503) {
      throw new Error("Servern är upptagen (503). Försök igen.");
    }
    throw e;
  }
}
