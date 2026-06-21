import { useState } from 'preact/hooks';

const BRACKETS = [
  { min: 0, max: 12450, rate: 0.19 },
  { min: 12450, max: 20200, rate: 0.24 },
  { min: 20200, max: 35200, rate: 0.30 },
  { min: 35200, max: 60000, rate: 0.37 },
  { min: 60000, max: 300000, rate: 0.45 },
  { min: 300000, max: Infinity, rate: 0.47 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

interface BracketBreakdown {
  min: number;
  max: number;
  rate: number;
  income: number;
  tax: number;
}

export default function CalculadoraIRPF() {
  const [income, setIncome] = useState(0);
  const [breakdown, setBreakdown] = useState<BracketBreakdown[]>([]);
  const [totalTax, setTotalTax] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(0);

  const handleCalculate = () => {
    if (income < 0) {
      setTotalTax(0);
      setEffectiveRate(0);
      setBreakdown([]);
      return;
    }

    let calculatedTax = 0;
    const breakdownDetails: BracketBreakdown[] = [];

    for (const bracket of BRACKETS) {
      if (income <= bracket.min) break;

      const incomeInBracket = Math.min(income, bracket.max) - bracket.min;
      const taxInBracket = incomeInBracket * bracket.rate;
      calculatedTax += taxInBracket;

      breakdownDetails.push({
        min: bracket.min,
        max: bracket.max,
        rate: bracket.rate,
        income: incomeInBracket,
        tax: taxInBracket,
      });
    }

    setTotalTax(calculatedTax);
    setEffectiveRate(income > 0 ? (calculatedTax / income) * 100 : 0);
    setBreakdown(breakdownDetails);
  };

  return (
    <div class="space-y-6">
      <div class="rounded-lg border border-line bg-surface p-6">
        <label class="block text-sm font-semibold text-ink mb-3">
          Rendimiento neto anual (€)
        </label>
        <input
          type="number"
          value={income}
          onInput={(e) => setIncome(Number((e.target as HTMLInputElement).value))}
          class="w-full px-4 py-3 border border-line rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-ink placeholder-muted"
          placeholder="Ej: 30000"
          min="0"
        />
        <button
          onClick={handleCalculate}
          class="mt-4 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Calcular IRPF
        </button>
      </div>

      {totalTax > 0 && (
        <div class="rounded-lg border border-accent bg-green-50 p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted mb-1">Cuota IRPF</p>
              <p class="text-2xl font-bold text-accent">
                {formatCurrency(totalTax)}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted mb-1">Tipo medio efectivo</p>
              <p class="text-2xl font-bold text-accent">
                {effectiveRate.toFixed(2)}%
              </p>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold text-ink mb-3">Desglose por tramo:</p>
            <div class="space-y-2">
              {breakdown.map((b, idx) => (
                b.income > 0 && (
                  <div key={idx} class="flex justify-between text-sm text-muted">
                    <span>
                      {formatCurrency(b.min)} - {formatCurrency(b.max)} ({(b.rate * 100).toFixed(0)}%)
                    </span>
                    <span class="font-medium text-ink">
                      {formatCurrency(b.tax)}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>

          <div class="pt-4 border-t border-line">
            <div class="flex justify-between text-base font-semibold text-ink">
              <span>Renta neta</span>
              <span>{formatCurrency(income - totalTax)}</span>
            </div>
          </div>
        </div>
      )}

      {income === 0 && (
        <p class="text-sm text-muted text-center py-4">
          Introduce tu rendimiento anual para ver el cálculo
        </p>
      )}
    </div>
  );
}
