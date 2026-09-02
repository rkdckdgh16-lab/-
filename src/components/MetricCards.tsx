import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { 
  DollarSign, 
  Receipt, 
  Percent, 
  TrendingDown, 
  Package, 
  ArrowRight,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface MetricCardsProps {
  result: CalculationResult;
  onOpenReport?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ result, onOpenReport }) => {
  const isZeroTariff = result.tariffRate === 0;
  const hasSavings = result.ftaSavingsKrw > 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-md p-2 sm:p-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* 1. 과세가격 (CIF) / 물품 기본정보 */}
        <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 flex flex-col justify-between transition-all hover:bg-slate-50">
          <div className="flex items-center justify-between text-slate-700 mb-1.5 pb-1 border-b border-slate-200">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">과세가격 (CIF 기준)</span>
            <div className="p-1 bg-white rounded-md border border-slate-200 shadow-xs">
              <Package className="w-3.5 h-3.5 text-slate-700" />
            </div>
          </div>
          <div className="my-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
              {formatCurrency(result.cifValueKrw, 'KRW')}
            </div>
            <p className="text-xs font-medium text-slate-500 font-mono mt-0.5">
              외화: {formatCurrency(result.quantity * result.unitPrice, result.currency)} ({result.incoterms})
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate max-w-[130px] font-semibold" title={result.itemName}>{result.itemName}</span>
            <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded font-bold text-[11px] border border-slate-300 shadow-2xs">{result.hsCode}</span>
          </div>
        </div>

        {/* 2. 관세율 & 관세액 */}
        <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 flex flex-col justify-between transition-all hover:bg-slate-50">
          <div className="flex items-center justify-between text-slate-700 mb-1.5 pb-1 border-b border-slate-200">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">관세 (Customs Duty)</span>
            <div className="p-1 bg-blue-50 rounded-md border border-blue-200 shadow-xs">
              <Percent className="w-3.5 h-3.5 text-blue-700" />
            </div>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
                {formatCurrency(result.tariffAmountKrw, 'KRW')}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-extrabold border ${
                isZeroTariff 
                  ? 'bg-blue-100/70 text-blue-800 border-blue-200' 
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {result.tariffRate}%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {result.tariffRateType} {result.ftaAppliedName ? `(${result.ftaAppliedName})` : ''}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            {hasSavings ? (
              <span className="text-blue-700 font-extrabold flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                FTA 절감: {formatCurrency(result.ftaSavingsKrw, 'KRW')}
              </span>
            ) : (
              <span className="text-slate-500 font-medium">기본세율(MFN) 기준</span>
            )}
            <span className="text-slate-500 font-mono font-semibold text-[11px]">
              {formatCurrency(result.tariffAmountForeign, result.currency)}
            </span>
          </div>
        </div>

        {/* 3. 부가가치세 (VAT) */}
        <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 flex flex-col justify-between transition-all hover:bg-slate-50">
          <div className="flex items-center justify-between text-slate-700 mb-1.5 pb-1 border-b border-slate-200">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">부가가치세 (VAT)</span>
            <div className="p-1 bg-white rounded-md border border-slate-200 shadow-xs">
              <Receipt className="w-3.5 h-3.5 text-slate-700" />
            </div>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-950 tracking-tight">
                {formatCurrency(result.vatAmountKrw, 'KRW')}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md font-extrabold bg-white text-slate-800 border border-slate-300 shadow-2xs">
                {result.vatRate}%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              과세표준: {formatCurrency(result.cifValueKrw + result.tariffAmountKrw, 'KRW')}
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{result.importCountry} 수입 과세</span>
            <span className="font-mono font-semibold text-[11px] text-slate-500">
              {formatCurrency(result.vatAmountForeign, result.currency)}
            </span>
          </div>
        </div>

        {/* 4. 관/부가세 TOTAL (관세 + 부가가치세 합산) */}
        <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-xs flex flex-col justify-between border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-200 mb-1.5 pb-1 border-b border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wide text-amber-300">관/부가세 TOTAL</span>
            <div className="p-1 bg-slate-800 rounded-md border border-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
          <div className="my-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 tracking-tight">
              {formatCurrency(result.tariffAmountKrw + result.vatAmountKrw, 'KRW')}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <span>외화 환산:</span>
              <span className="font-bold font-mono text-slate-100">
                {formatCurrency(result.tariffAmountForeign + result.vatAmountForeign, result.currency)}
              </span>
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="text-[11px] font-medium text-slate-300">총 수입원가 (CIF+세금)</span>
            <span className="font-extrabold font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {formatCurrency(result.totalAmountKrw, 'KRW')}
            </span>
          </div>
        </div>
      </div>

      {/* 관/부가세 TOTAL 바로 아래 산출내역서 버튼 */}
      {onOpenReport && (
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 active:scale-98 text-white rounded-lg shadow-sm hover:shadow transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-200" />
            <span>산출내역서</span>
          </button>
        </div>
      )}
    </div>
  );
};
