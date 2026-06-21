import { useState } from 'preact/hooks';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const IVA_RATES = [
  { label: 'Tipo normal (21%)', value: 0.21 },
  { label: 'Tipo reducido (10%)', value: 0.10 },
  { label: 'Tipo superreducido (4%)', value: 0.04 },
];

export default function CalculadoraIVA() {
  const [mode, setMode] = useState<'liquidar' | 'calcular'>('liquidar');

  // Modo 1: Liquidar IVA
  const [repercutido, setRepercutido] = useState(0);
  const [soportado, setSoportado] = useState(0);
  const [liquidaResult, setLiquidaResult] = useState<number | null>(null);

  // Modo 2: Calcular desde base
  const [baseImponible, setBaseImponible] = useState(0);
  const [ivaRate, setIvaRate] = useState(0.21);
  const [calcResult, setCalcResult] = useState<{
    base: number;
    iva: number;
    total: number;
  } | null>(null);

  const handleLiquidar = () => {
    if (repercutido < 0 || soportado < 0) {
      setLiquidaResult(0);
      return;
    }
    const result = repercutido - soportado;
    setLiquidaResult(result);
  };

  const handleCalcular = () => {
    if (baseImponible < 0) {
      setCalcResult(null);
      return;
    }
    const ivaAmount = baseImponible * ivaRate;
    setCalcResult({
      base: baseImponible,
      iva: ivaAmount,
      total: baseImponible + ivaAmount,
    });
  };

  return (
    <div class="space-y-6">
      <div class="flex gap-2 border-b border-line">
        <button
          onClick={() => setMode('liquidar')}
          class={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            mode === 'liquidar'
              ? 'border-brand text-brand'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          IVA a liquidar
        </button>
        <button
          onClick={() => setMode('calcular')}
          class={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            mode === 'calcular'
              ? 'border-brand text-brand'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          IVA desde base
        </button>
      </div>

      {mode === 'liquidar' ? (
        <div class="space-y-6">
          <div class="rounded-lg border border-line bg-surface p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-ink mb-3">
                IVA repercutido (IVA cobrado a clientes) (€)
              </label>
              <input
                type="number"
                value={repercutido}
                onInput={(e) =>
                  setRepercutido(Number((e.target as HTMLInputElement).value))
                }
                class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink placeholder-muted"
                placeholder="Ej: 2100"
                min="0"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-ink mb-3">
                IVA soportado deducible (IVA pagado a proveedores) (€)
              </label>
              <input
                type="number"
                value={soportado}
                onInput={(e) =>
                  setSoportado(Number((e.target as HTMLInputElement).value))
                }
                class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink placeholder-muted"
                placeholder="Ej: 800"
                min="0"
              />
            </div>

            <button
              onClick={handleLiquidar}
              class="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calcular liquidación
            </button>
          </div>

          {liquidaResult !== null && (
            <div
              class={`rounded-lg border p-6 space-y-2 ${
                liquidaResult > 0
                  ? 'border-red-300 bg-red-50'
                  : 'border-green-300 bg-green-50'
              }`}
            >
              <p class="text-sm text-muted mb-2">
                {liquidaResult > 0
                  ? 'IVA a pagar a Hacienda'
                  : liquidaResult < 0
                    ? 'IVA a compensar/devolver'
                    : 'Sin movimiento de IVA'}
              </p>
              <p
                class={`text-3xl font-bold ${
                  liquidaResult > 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {liquidaResult > 0 ? '+' : ''}
                {formatCurrency(liquidaResult)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div class="space-y-6">
          <div class="rounded-lg border border-line bg-surface p-6 space-y-4">
            <div>
              <label class="block text-sm font-semibold text-ink mb-3">
                Base imponible (€)
              </label>
              <input
                type="number"
                value={baseImponible}
                onInput={(e) =>
                  setBaseImponible(Number((e.target as HTMLInputElement).value))
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
                {IVA_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalcular}
              class="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Calcular con IVA
            </button>
          </div>

          {calcResult && (
            <div class="rounded-lg border border-accent bg-green-50 p-6 space-y-3">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-muted mb-1">Base imponible</p>
                  <p class="text-xl font-bold text-ink">
                    {formatCurrency(calcResult.base)}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-muted mb-1">Cuota IVA</p>
                  <p class="text-xl font-bold text-accent">
                    {formatCurrency(calcResult.iva)}
                  </p>
                </div>
              </div>
              <div class="pt-3 border-t border-accent">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-ink">Total con IVA</span>
                  <span class="text-2xl font-bold text-accent">
                    {formatCurrency(calcResult.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
