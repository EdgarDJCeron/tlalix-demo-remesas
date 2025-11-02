export interface CashoutPoint {
  id: string;
  name: string;
  city: string;
  address: string;
  feePct: number;
  hours: string;
  lat: number;
  lng: number;
}

export const mockCashoutPoints: CashoutPoint[] = [
  {
    id: "1",
    name: "Tienda Aurrera Centro",
    city: "CDMX",
    address: "Av. Juárez 112, Centro Histórico",
    feePct: 0.005,
    hours: "8:00 - 22:00",
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    id: "2",
    name: "OXXO Reforma",
    city: "CDMX",
    address: "Paseo de la Reforma 250, Juárez",
    feePct: 0.005,
    hours: "24 horas",
    lat: 19.4270,
    lng: -99.1677,
  },
  {
    id: "3",
    name: "Farmacia Guadalajara",
    city: "Veracruz",
    address: "Blvd. Adolfo Ruiz Cortines 3450",
    feePct: 0.005,
    hours: "7:00 - 23:00",
    lat: 19.1738,
    lng: -96.1342,
  },
  {
    id: "4",
    name: "7-Eleven Garza Sada",
    city: "Monterrey",
    address: "Av. Garza Sada 2411, Tecnológico",
    feePct: 0.005,
    hours: "24 horas",
    lat: 25.6488,
    lng: -100.2890,
  },
  {
    id: "5",
    name: "Soriana Express",
    city: "Monterrey",
    address: "Av. Constitución 1050, Centro",
    feePct: 0.005,
    hours: "8:00 - 21:00",
    lat: 25.6694,
    lng: -100.3099,
  },
];

export const generatePIN = (): { code: string; expiresAt: string } => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  return { code, expiresAt };
};
