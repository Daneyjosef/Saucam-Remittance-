import { useState } from 'react';
import { Alert, Divider } from '@mui/material';
import { AccountBalance, Add, Remove, Warning, CheckCircle, Calculate } from '@mui/icons-material';
import AppShell from './AppShell';
import AppButton from './ui/AppButton';
import AppBadge from './ui/AppBadge';
import { toast, Toaster } from 'sonner';

interface CurrencyFloat {
  code: string; name: string; flag: string;
  openingFloat: number; currentFloat: number; lowThreshold: number; physicalCount: string;
}

interface CashFloatDashboardProps { onBack?: () => void; onLogout?: () => void; }

export default function CashFloatDashboard({ onBack, onLogout }: CashFloatDashboardProps) {
  const [floats, setFloats] = useState<CurrencyFloat[]>([
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', openingFloat: 500000, currentFloat: 387500, lowThreshold: 100000, physicalCount: '' },
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', openingFloat: 10000, currentFloat: 7650, lowThreshold: 2000, physicalCount: '' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', openingFloat: 5000, currentFloat: 1850, lowThreshold: 1000, physicalCount: '' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', openingFloat: 8000, currentFloat: 5420, lowThreshold: 1500, physicalCount: '' },
  ]);
  const [cashInAmount, setCashInAmount] = useState<Record<string, string>>({});
  const [cashOutAmount, setCashOutAmount] = useState<Record<string, string>>({});

  const handleCashIn = (code: string) => {
    const amount = parseFloat(cashInAmount[code] || '0');
    if (amount > 0) { setFloats(floats.map((f) => f.code === code ? { ...f, currentFloat: f.currentFloat + amount } : f)); setCashInAmount({ ...cashInAmount, [code]: '' }); toast.success(`Added ${amount.toLocaleString()} ${code} to float`); }
  };
  const handleCashOut = (code: string) => {
    const amount = parseFloat(cashOutAmount[code] || '0');
    if (amount > 0) { setFloats(floats.map((f) => f.code === code ? { ...f, currentFloat: f.currentFloat - amount } : f)); setCashOutAmount({ ...cashOutAmount, [code]: '' }); toast.success(`Removed ${amount.toLocaleString()} ${code} from float`); }
  };
  const calcDiff = (f: CurrencyFloat) => (parseFloat(f.physicalCount) || 0) - f.currentFloat;
  const isLow = (f: CurrencyFloat) => f.currentFloat < f.lowThreshold;

  const handleReconcile = () => {
    const ok = floats.every((f) => f.physicalCount && parseFloat(f.physicalCount) >= 0);
    if (!ok) { toast.error('Please enter physical count for all currencies'); return; }
    toast.success('End of day reconciliation completed', { description: 'Float report has been generated and submitted.' });
  };

  return (
    <AppShell title="Cash Float Dashboard" subtitle="Downtown Main Office" icon={<AccountBalance style={{ fontSize: 18 }} />} userLabel="Jessica Martinez" userRole="Teller" onBack={onBack} onLogout={onLogout}>
      <Toaster position="top-right" richColors />
      <div className="p-4 md:p-8">
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div className="mb-6">
            <h1 className="m-0 mb-1 font-extrabold leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-primary)' }}>
              Branch Cash Float Management
            </h1>
            <p className="m-0 text-sm" style={{ color: 'var(--color-text-3)' }}>Monitor and manage cash float levels across all currencies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {floats.map((currency) => (
              <div
                key={currency.code}
                className="bg-white rounded-[var(--radius-lg)] border p-5"
                style={{
                  borderColor: isLow(currency) ? 'var(--color-danger)' : 'var(--color-border)',
                  boxShadow: isLow(currency) ? 'var(--shadow-glow-danger)' : 'var(--shadow-sm)',
                  borderWidth: isLow(currency) ? 2 : 1,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currency.flag}</span>
                    <div>
                      <div className="font-bold text-base leading-none" style={{ color: 'var(--color-primary)' }}>{currency.code}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>{currency.name}</div>
                    </div>
                  </div>
                  {isLow(currency) && (
                    <AppBadge variant="danger" dot>
                      <Warning style={{ fontSize: 12 }} /> LOW FLOAT
                    </AppBadge>
                  )}
                </div>

                {/* Float stats */}
                <div
                  className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-[var(--radius-sm)]"
                  style={{ background: isLow(currency) ? 'var(--color-danger-bg)' : 'var(--color-info-subtle)' }}
                >
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>Opening Float</div>
                    <div className="text-base font-bold mt-0.5" style={{ color: 'var(--color-text-3)' }}>{currency.openingFloat.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>Current Float</div>
                    <div className="text-base font-bold mt-0.5" style={{ color: isLow(currency) ? 'var(--color-danger)' : 'var(--color-accent)' }}>{currency.currentFloat.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>Low Threshold</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-warning)' }}>{currency.lowThreshold.toLocaleString()} {currency.code}</div>
                  </div>
                </div>

                {isLow(currency) && <Alert severity="error" style={{ marginBottom: 12, borderRadius: 'var(--radius-sm)' }}>Current float is below threshold. Consider adding cash.</Alert>}

                {/* Cash operations */}
                <div className="mb-4">
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Cash Operations</div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Cash In Amount"
                      value={cashInAmount[currency.code] || ''}
                      onChange={(e) => setCashInAmount({ ...cashInAmount, [currency.code]: e.target.value })}
                      className="input-base flex-1 py-2"
                    />
                    <AppButton variant="accent" size="sm" leftIcon={<Add style={{ fontSize: 16 }} />} onClick={() => handleCashIn(currency.code)}>
                      Cash In
                    </AppButton>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Cash Out Amount"
                      value={cashOutAmount[currency.code] || ''}
                      onChange={(e) => setCashOutAmount({ ...cashOutAmount, [currency.code]: e.target.value })}
                      className="input-base flex-1 py-2"
                    />
                    <AppButton variant="danger" size="sm" leftIcon={<Remove style={{ fontSize: 16 }} />} onClick={() => handleCashOut(currency.code)}>
                      Cash Out
                    </AppButton>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                {/* EOD Reconciliation */}
                <div>
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--color-primary)' }}>End of Day Reconciliation</div>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-3)' }}>{currency.code}</span>
                      <input
                        type="number"
                        placeholder="Physical Cash Count"
                        value={currency.physicalCount}
                        onChange={(e) => setFloats(floats.map((f) => f.code === currency.code ? { ...f, physicalCount: e.target.value } : f))}
                        className="input-base py-2 pl-12"
                      />
                    </div>
                    <div
                      className="min-w-[130px] p-3 rounded-[var(--radius-sm)] border text-center"
                      style={{ background: 'var(--color-surface-subtle)', borderColor: 'var(--color-border)' }}
                    >
                      <div className="text-xs" style={{ color: 'var(--color-text-3)' }}>Difference</div>
                      <div
                        className="text-base font-bold mt-0.5"
                        style={{ color: currency.physicalCount && calcDiff(currency) !== 0 ? (calcDiff(currency) > 0 ? 'var(--color-accent)' : 'var(--color-danger)') : 'var(--color-text-3)' }}
                      >
                        {currency.physicalCount ? (calcDiff(currency) > 0 ? `+${calcDiff(currency).toLocaleString()}` : calcDiff(currency).toLocaleString()) : '—'}
                      </div>
                    </div>
                  </div>
                  {currency.physicalCount && calcDiff(currency) !== 0 && (
                    <Alert severity={calcDiff(currency) > 0 ? 'success' : 'error'} style={{ marginTop: 8, borderRadius: 'var(--radius-sm)' }}>
                      {calcDiff(currency) > 0 ? 'Surplus: ' : 'Shortage: '}{Math.abs(calcDiff(currency)).toLocaleString()} {currency.code}
                    </Alert>
                  )}
                  {currency.physicalCount && calcDiff(currency) === 0 && (
                    <Alert severity="success" icon={<CheckCircle />} style={{ marginTop: 8, borderRadius: 'var(--radius-sm)' }}>Balanced - No discrepancy</Alert>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit reconciliation */}
          <div
            className="mt-8 flex items-center justify-between flex-wrap gap-4 p-5 rounded-[var(--radius-lg)] text-white"
            style={{ background: 'var(--color-primary)' }}
          >
            <div>
              <div className="font-bold text-lg">Complete End of Day Reconciliation</div>
              <div className="text-white/90 text-sm mt-0.5">Ensure all physical counts are entered before submitting</div>
            </div>
            <AppButton variant="accent" size="lg" leftIcon={<Calculate style={{ fontSize: 20 }} />} onClick={handleReconcile}>
              Submit Reconciliation
            </AppButton>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
