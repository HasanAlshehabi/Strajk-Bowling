export interface BookingRequest {
  when: string;     // "2025-12-03T21:00"
  lanes: number;    // antal banor
  people: number;   // antal spelare
  shoes: number[];  // skostorlekar, exakt people st
}

export interface BookingResponse extends BookingRequest {
  price: number;    // server räknar: 120/pers + 100/bana
  id: string;       // t.ex. "str7283472"
  active: boolean;
}
