// store/booking.ts
import { create } from "zustand";
import type { BookingRequest, BookingResponse } from "../types/Booking.js";
import { fetchApiKey, createBookingStrict } from "../api/client";

type Step = 0 | 1 | 2;

interface BookingState {
  step: Step;
  apiKey: string | null;

  date: string;
  time: string;
  lanes: number;
  people: number;
  shoes: number[];

  submitting: boolean;
  error: string | null;
  result: BookingResponse | null;

  isShoeCountValid: () => boolean;
  isCapacityValid: () => boolean;

  setStep: (s: Step) => void;
  setDate: (v: string) => void;
  setTime: (v: string) => void;
  setLanes: (n: number) => void;
  setPeople: (n: number) => void;
  setShoeAt: (i: number, size: number) => void;
  addShoe: () => void;
  removeShoe: (i: number) => void;
  reset: () => void;

  submit: () => Promise<BookingResponse>;
}

export const useBooking = create<BookingState>((set, get) => ({
  step: 0,
  apiKey: null,

  date: "",
  time: "",
  lanes: 1,
  people: 1,
  shoes: [44],

  submitting: false,
  error: null,
  result: null,

  isShoeCountValid: () => get().shoes.length === get().people,
  isCapacityValid:   () => get().people <= get().lanes * 4,

  setStep: (s) => set({ step: s }),
  setDate: (v) => set({ date: v }),
  setTime: (v) => set({ time: v }),
  setLanes: (n) => set({ lanes: n }),
  setPeople: (n) => {
    const shoes = get().shoes.slice(0, n);
    while (shoes.length < n) shoes.push(44);
    set({ people: n, shoes });
  },
  setShoeAt: (i, size) => {
    const shoes = get().shoes.slice();
    shoes[i] = size;
    set({ shoes });
  },
  addShoe: () => {
    const shoes = get().shoes.slice();
    shoes.push(44);
    set({ shoes, people: shoes.length });
  },
  removeShoe: (i) => {
    const shoes = get().shoes.slice();
    shoes.splice(i, 1);
    set({ shoes, people: shoes.length });
  },
  reset: () => set({
    step: 0, apiKey: null, date: "", time: "", lanes: 1, people: 1, shoes: [44],
    submitting: false, error: null, result: null
  }),

  submit: async () => {
    const { date, time, lanes, people, shoes } = get();

    if (!get().isShoeCountValid()) throw new Error("Antal skor måste matcha antal spelare.");
    if (!get().isCapacityValid())  throw new Error("Max 4 spelare per bana.");

    const when = `${date}T${time}`;
    const payload: BookingRequest = { when, lanes, people, shoes };
    set({ submitting: true, error: null, result: null });

    /*eslint-disable*/
    try {
      const key = get().apiKey ?? await fetchApiKey();
      const body: any = await createBookingStrict(payload, key);
      const base = body?.bookingDetails ?? body;
      const id =
      base?.id ??
      base?.bookingId ??
      body?.bookingDetails?.bookingId ??     // <- << important
      body?.bookingId ??
      body?.data?.bookingId ??
      body?.data?.bookingDetails?.bookingId ?? 
      body?.data?.id ??
      body?.id;

    const resultWithId = id ? { ...base, id } : base;
    set({ apiKey: key, result: resultWithId, step: 2 });
    return body;
    } catch (e: any) {
      console.warn("[store.submit] failed:", e);
      set({ error: e?.message ?? "Kunde inte boka. Försök igen." });
      throw e;
    } finally {
      set({ submitting: false });
    }
  }
}));
