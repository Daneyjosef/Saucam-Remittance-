export const RATES_STORE_KEY = 'saucam_rates_v1';

export interface ExchangeRate {
  id: string;
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  buyRate: number;
  sellRate: number;
  midMarketRate: number;
  spread: number;
  lastUpdated: string;
  status: 'Active' | 'Inactive';
}

const defaultRates: ExchangeRate[] = [
  { id: '1', currencyPair: 'USD/NGN', baseCurrency: 'USD', quoteCurrency: 'NGN', buyRate: 1445, sellRate: 1460, midMarketRate: 1452, spread: 1.03, lastUpdated: 'Not yet updated', status: 'Active' },
  { id: '2', currencyPair: 'GBP/NGN', baseCurrency: 'GBP', quoteCurrency: 'NGN', buyRate: 1820, sellRate: 1840, midMarketRate: 1830, spread: 1.09, lastUpdated: 'Not yet updated', status: 'Active' },
  { id: '3', currencyPair: 'EUR/NGN', baseCurrency: 'EUR', quoteCurrency: 'NGN', buyRate: 1580, sellRate: 1600, midMarketRate: 1590, spread: 1.26, lastUpdated: 'Not yet updated', status: 'Active' },
  { id: '4', currencyPair: 'USD/EUR', baseCurrency: 'USD', quoteCurrency: 'EUR', buyRate: 0.9150, sellRate: 0.9250, midMarketRate: 0.92, spread: 1.09, lastUpdated: 'Not yet updated', status: 'Active' },
  { id: '5', currencyPair: 'USD/GBP', baseCurrency: 'USD', quoteCurrency: 'GBP', buyRate: 0.7850, sellRate: 0.7950, midMarketRate: 0.79, spread: 1.27, lastUpdated: 'Not yet updated', status: 'Active' },
  { id: '6', currencyPair: 'USD/JPY', baseCurrency: 'USD', quoteCurrency: 'JPY', buyRate: 148.50, sellRate: 150.50, midMarketRate: 149.5, spread: 1.34, lastUpdated: 'Not yet updated', status: 'Active' },
];

export function getRates(): ExchangeRate[] {
  try {
    const raw = localStorage.getItem(RATES_STORE_KEY);
    if (raw) return JSON.parse(raw) as ExchangeRate[];
  } catch {}
  return [...defaultRates];
}

export function persistRates(rates: ExchangeRate[]): void {
  localStorage.setItem(RATES_STORE_KEY, JSON.stringify(rates));
}

// Get rate for a currency pair (returns sell rate for customer buying foreign currency)
export function getRate(from: string, to: string): number | null {
  const rates = getRates();
  const pair = rates.find(r => r.status === 'Active' && (
    (r.baseCurrency === from && r.quoteCurrency === to) ||
    (r.baseCurrency === to && r.quoteCurrency === from)
  ));
  if (!pair) return null;
  if (pair.baseCurrency === from) return pair.sellRate;
  // Inverse
  return 1 / pair.buyRate;
}

// Fetch live mid-market rates from free API (no key required)
export async function fetchLiveRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json() as { rates: Record<string, number> };
    return data.rates;
  } catch {
    return null;
  }
}
