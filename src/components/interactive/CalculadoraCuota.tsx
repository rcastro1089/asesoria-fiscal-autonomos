import { useState } from 'preact/hooks';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const CONTRIBUTION_TABLE = [
  { min: 0, max: 600, base: 735.18, cuota: 230 },
  { min: 600, max: 900, base: 857.88, cuota: 269 },
  { min: 900, max: 1200, base: 950.10, cuota: 298 },
  { min: 1200, max: 1500, base: 1030.80, cuota: 324 },
  { min: 1500, max: 1800, base: 1112.40, cuota: 349 },
  { min: 1800, max: 2100, base: 1195.80, cuota: 375 },
  { min: 2100, max: 2400, base: 1279.20, cuota: 402 },
  { min: 2400, max: 2700, base: 1363.80, cuota: 428 },
  { min: 2700, max: 3000, base: 1448.40, cuota: 455 },
  { min: 3000, max: 3300, base: 1533.00, cuota: 482 },
  { min: 3300, max: 3600, base: 1618.20, cuota: 509 },
  { min: 3600, max: 3900, base: 1703.40, cuota: 536 },
  { min: 3900, max: 4100, base: 1789.20, cuota: 563 },
  { min: 4100, max: 4500, base: 1875.00, cuota: 590 },
  { min: 4500, max: 4900, base: 1960.80, cuota: 617 },
  { min: 4900, max: 5300, base: 2046.60, cuota: 644 },
  { min: 5300, max: 5700, base: 2133.00, cuota: 672 },
  { min: 5700, max: 6000, base: 2219.40, cuota: 699 },
  { min: 6000, max: Infinity, base: 2305.80, cuota: 726 },
];

export default function CalculadoraCuota() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [isNewfreelancer, setIsNewfreelancer] = useState(false);
  const [year, setYear] = useState<1 | 2>(1);
  const [result, setResult] = useState<{
    base: number;
    cuota: number;
    annual: number;
    type: string;
  } | null>(null);

  const handleCalculate = () => {
    if (monthlyIncome < 0) {
      setResult(null);
      return;
    }

    let cuota = 726;
    let base = 2305.80;
    let type = 'Régimen ordinario';

    if (isNewfreelancer) {
      cuota = year === 1 ? 80 : 160;
      base = year === 1 ? 400 : 800;
      type = 'Tarifa plana (nuevo autónomo)';
    } else {
      for (const row of CONTRIBUTION_TABLE) {
        if (monthlyIncome >= row.min && monthlyIncome < row.max) {
          base = row.base;
          cuota = row.cuota;
          break;
        }
      }
    }

    setResult({
      base,
      cuota,
      annual: cuota * 12,
      type,
    });
  };

  return (
    <div class="space-y-6">
      <div class="rounded-lg border border-line bg-surface p-6 space-y-4">
        <div>
          <label class="block text-sm font-semibold text-ink mb-3">
            Rendimiento neto mensual (€)
          </label>
          <input
            type="number"
            value={monthlyIncome}
            onInput={(e) =>
              setMonthlyIncome(Number((e.target as HTMLInputElement).value))
            }
            class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink placeholder-muted"
            placeholder="Ej: 2000"
            min="0"
          />
        </div>

        <div class="border-t border-line pt-4">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewfreelancer}
              onChange={(e) =>
                setIsNewfreelancer((e.target as HTMLInputElement).checked)
              }
              class="w-5 h-5 border border-line rounded cursor-pointer accent-brand"
            />
            <span class="text-sm font-medium text-ink">
              Soy nuevo autónomo (tarifa plana)
            </span>
          </label>

          {isNewfreelancer && (
            <div class="mt-4 space-y-2">
              <label class="block text-sm text-muted mb-2">
                Año de actividad
              </label>
              <div class="flex gap-2">
                <button
                  onClick={() => setYear(1)}
                  class={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    year === 1
                      ? 'bg-brand text-white'
                      : 'bg-line text-ink hover:bg-brand/10'
                  }`}
                >
                  Primer año
                </button>
                <button
                  onClick={() => setYear(2)}
                  class={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    year === 2
                      ? 'bg-brand text-white'
                      : 'bg-line text-ink hover:bg-brand/10'
                  }`}
                >
                  Segundo año
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleCalculate}
          class="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcular cuota
        </button>
      </div>

      {result && (
        <div class="rounded-lg border border-accent bg-green-50 p-6 space-y-4">
          <div class="bg-white rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs text-muted mb-1">Tipo de régimen</p>
                <p class="text-sm font-semibold text-ink">{result.type}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-muted mb-1">Base de cotización</p>
                <p class="text-sm font-semibold text-ink">
                  {formatCurrency(result.base)}
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted mb-1">Cuota mensual</p>
              <p class="text-2xl font-bold text-accent">
                {formatCurrency(result.cuota)}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted mb-1">Cuota anual</p>
              <p class="text-2xl font-bold text-accent">
                {formatCurrency(result.annual)}
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-accent">
            <p class="text-xs text-muted">
              ⓘ Esta es la cotización a la Seguridad Social. Recuerda que
              además deberás pagar IRPF e IVA si es obligatorio.
            </p>
          </div>
        </div>
      )}

      {monthlyIncome === 0 && (
        <p class="text-sm text-muted text-center py-4">
          Introduce tu rendimiento mensual para calcular la cuota
        </p>
      )}
    </div>
  );
}
