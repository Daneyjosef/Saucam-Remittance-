export const TRANSACTIONS_STORE_KEY = 'saucam_transactions_v1';

export interface StoredTransaction {
  id: string;
  timestamp: string;         // ISO string
  date: string;              // YYYY-MM-DD
  time: string;              // HH:MM
  type: 'Exchange' | 'Transfer Out' | 'Remittance In' | 'Remittance Out';
  fromCurrency: string;
  toCurrency: string;
  amountGiven: number;       // amount in fromCurrency
  amountReceived: number;    // amount in toCurrency
  rateUsed: number;
  customerName: string;
  customerId: string;
  tellerUsername: string;
  tellerName: string;
  branch: string;
  status: 'Completed' | 'Pending' | 'Flagged' | 'Cancelled';
  flagReason?: string;
  flagRisk?: 'High' | 'Medium' | 'Low';
  notes?: string;
}

export function getTransactions(): StoredTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORE_KEY);
    if (raw) return JSON.parse(raw) as StoredTransaction[];
  } catch {}
  return [];
}

export function persistTransactions(transactions: StoredTransaction[]): void {
  localStorage.setItem(TRANSACTIONS_STORE_KEY, JSON.stringify(transactions));
}

export function addTransaction(tx: StoredTransaction): void {
  const existing = getTransactions();
  persistTransactions([tx, ...existing]);
}

// Auto-flag rules: flag if amount > $10,000 equivalent or suspicious pattern
export function shouldFlag(tx: StoredTransaction): { flag: boolean; reason: string; risk: 'High' | 'Medium' | 'Low' } {
  // Rough USD equivalent
  const usdEquiv = tx.fromCurrency === 'NGN' ? tx.amountGiven / 1450 : tx.amountGiven;
  if (usdEquiv >= 10000) return { flag: true, reason: 'Above CBN threshold (>$10,000)', risk: 'High' };
  if (usdEquiv >= 5000) return { flag: true, reason: 'Large transaction (>$5,000)', risk: 'Medium' };
  return { flag: false, reason: '', risk: 'Low' };
}

export function generateTxId(): string {
  const count = getTransactions().length + 1;
  return `TXN-${String(count).padStart(3, '0')}`;
}
