import { useState } from 'preact/hooks';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const IVA_OPTIONS = [
  { label: 'Tipo normal (21%)', value: 0.21 },
  { label: 'Tipo reducido (10%)', value: 0.10 },
  { label: 'Tipo superreducido (4%)', value: 0.04 },
];

const RETENTION_OPTIONS = [
  { label: 'Retención general (15%)', value: 0.15 },
  { label: 'Nuevo autónomo (7%)', value: 0.07 },
];

export default function CalculadoraRetenciones() {
  const [base, setBase] = useState(0);
  const [ivaRate, setIvaRate] = useState(0.21);
  const [retentionRate, setRetentionRate] = useState(0.15);
  const [result, setResult] = useState<{
    base: number;
    iva: number;
    subtotal: number;
    retention: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    if (base < 0) {
      setResult(null);
      return;
    }

    const ivaAmount = base * ivaRate;
    const subtotal = base + ivaAmount;
    const retentionAmount = base * retentionRate;
    const totalToClaim = subtotal - retentionAmount;

    setResult({
      base,
      iva: ivaAmount,
      subtotal,
      retention: retentionAmount,
      total: totalToClaim,
    });
  };

  return (
    <div class="space-y-6">
      <div class="rounded-lg border border-line bg-surface p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-ink mb-3">
            Base imponible (€)
          </label>
          <input
            type="number"
            value={base}
            onInput={(e) =>
              setBase(Number((e.target as HTMLInputElement).value))
            }
            class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink placeholder-muted"
            placeholder="Ej: 1000"
            min="0"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-ink mb-3">
            Tipo de IVA
          </label>
          <select
            value={ivaRate}
            onChange={(e) =>
              setIvaRate(Number((e.target as HTMLSelectElement).value))
            }
            class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink"
          >
            {IVA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-ink mb-3">
            Tipo de retención IRPF
          </label>
          <select
            value={retentionRate}
            onChange={(e) =>
              setRetentionRate(Number((e.target as HTMLSelectElement).value))
            }
            class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink"
          >
            {RETENTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCalculate}
          class="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcular retención
        </button>
      </div>

      {result && (
        <div class="rounded-lg border border-accent bg-green-50 p-6 space-y-3">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted">Base imponible</span>
              <span class="text-ink font-medium">{formatCurrency(result.base)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted">
                + IVA ({(ivaRate * 100).toFixed(0)}%)
              </span>
              <span class="text-ink font-medium">{formatCurrency(result.iva)}</span>
            </div>
            <div class="flex justify-between text-sm py-2 border-y border-accent">
              <span class="font-medium text-ink">Subtotal</span>
              <span class="font-medium text-ink">{formatCurrency(result.subtotal)}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted">
                - Retención ({(retentionRate * 100).toFixed(0)}%)
              </span>
              <span class="text-red-600 font-medium">
                -{formatCurrency(result.retention)}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-accent">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-ink">Total a cobrar</span>
              <span class="text-2xl font-bold text-accent">
                {formatCurrency(result.total)}
              </span>
            </div>
          </div>

          <div class="pt-3 border-t border-accent">
            <p class="text-xs text-muted">
              ⓘ La retención de IRPF se descuenta de lo que cobras y se ingresa
              directamente en Hacienda. El IVA se declara en tu liquidación
              trimestral o anual.
            </p>
          </div>
        </div>
      )}

      {base === 0 && (
        <p class="text-sm text-muted text-center py-4">
          Introduce la base imponible para calcular la retención
        </p>
      )}
    </div>
  );
}
