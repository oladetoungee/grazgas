export type GasTrendPoint = {
  time: string; // e.g. '00:00', '00:30', ...
  baseFee: number;
  low: number;
  medium: number;
  high: number;
};

export type GasTrendData = {
  '24h': GasTrendPoint[];
  '1h': GasTrendPoint[];
  '7d': GasTrendPoint[];
};

// Generate 48 points for 24h (every 30 minutes)
const data24h: GasTrendPoint[] = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const min = i % 2 === 0 ? '00' : '30';
  return {
    time: `${hour}:${min}`,
    baseFee: 10 + Math.round(Math.sin(i / 5) * 2),
    low: 12 + Math.round(Math.cos(i / 6) * 2),
    medium: 18 + Math.round(Math.sin(i / 7) * 2),
    high: 25 + Math.round(Math.cos(i / 8) * 2),
  };
});

// Generate 60 points for 1h (every minute)
const data1h: GasTrendPoint[] = Array.from({ length: 60 }, (_, i) => ({
  time: String(i).padStart(2, '0'),
  baseFee: 10 + Math.round(Math.sin(i / 10) * 2),
  low: 12 + Math.round(Math.cos(i / 12) * 2),
  medium: 18 + Math.round(Math.sin(i / 15) * 2),
  high: 25 + Math.round(Math.cos(i / 18) * 2),
}));

// Generate 14 points for 7d (every half day)
const data7d: GasTrendPoint[] = Array.from({ length: 14 }, (_, i) => {
  const day = Math.floor(i / 2) + 1;
  const half = i % 2 === 0 ? 'AM' : 'PM';
  return {
    time: `Day ${day} ${half}`,
    baseFee: 10 + Math.round(Math.sin(i / 2) * 2),
    low: 12 + Math.round(Math.cos(i / 3) * 2),
    medium: 18 + Math.round(Math.sin(i / 4) * 2),
    high: 25 + Math.round(Math.cos(i / 5) * 2),
  };
});

export const gasTrendData: GasTrendData = {
  '24h': data24h,
  '1h': data1h,
  '7d': data7d,
}; 