import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatNumber, isSubjectToChemicalLaws } from '../utils/calculator';
import { 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';

interface EssentialDataTableProps {
  result: CalculationResult;
  onOpenRequirements: () => void;
}

export const EssentialDataTable: React.FC<EssentialDataTableProps> = ({
  result,
  onOpenRequirements
}) => {
  // 화평법/화관법 등 화학물질 관리법 적용 품목 여부 판별
  const isChemicalItem = result.approvalStatus?.isChemicalRegulation ?? isSubjectToChemicalLaws(
    result.hsCode,
    result.importRegulationsFull?.applicableLaws,
    result.approvalStatus,
    result.itemName
  );
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-6 flex flex-col">
      {/* Header bar */}
      <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-900 text-white rounded flex items-center justify-center font-bold text-xs">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span>세부 산출 내역서</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 italic hidden md:inline">
            *FTA 협정세율 및 관세청 과세가격(CIF) 기준 산출
          </span>
          <button
            onClick={onOpenRequirements}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-300 shadow-2xs hover:bg-slate-50 transition"
          >
            <span>수입요건 상세</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Responsive Table with border-collapse and vertical borders */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="sticky top-0 bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-xs whitespace-nowrap">
              <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[품명]</th>
              <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[HS CODE]</th>
              <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[수출국]</th>
              <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[수입국]</th>
              <th className="p-3 border-r border-slate-200 text-center bg-blue-50/70 text-blue-900 whitespace-nowrap">[총과세가격]</th>
              <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[관세율]</th>
              <th className="p-3 border-r border-slate-200 text-center bg-amber-50/40 text-amber-950 whitespace-nowrap">[관세]</th>
              <th className="p-3 border-r border-slate-200 text-center bg-slate-50 text-slate-900 whitespace-nowrap">[부가가치세]</th>
              <th className="p-3 text-center whitespace-nowrap">[환율]</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition">
              {/* 1. [품명] */}
              <td className="p-3 border-r border-slate-200 font-bold text-slate-900">
                <div className="break-words whitespace-normal leading-snug min-w-[160px] max-w-[280px]">
                  {result.itemName}
                </div>
              </td>

              {/* 2. [HS CODE] */}
              <td className="p-3 border-r border-slate-200 text-center font-mono whitespace-nowrap">
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 text-xs">
                  {result.hsCode}
                </span>
              </td>

              {/* 3. [수출국] */}
              <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap">
                <div className="font-bold text-slate-800">{result.exportCountry}</div>
              </td>

              {/* 4. [수입국] */}
              <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap">
                <div className="font-bold text-slate-950">{result.importCountry}</div>
              </td>

              {/* 5. [총과세가격] (CIF 과세표준 = 물품대금 + 운임 + 보험료) */}
              <td className="p-3 border-r border-slate-200 text-center font-bold bg-blue-50/40 text-blue-950 font-mono whitespace-nowrap">
                <div className="text-sm font-extrabold text-blue-900">
                  {formatCurrency(result.cifValueKrw, 'KRW')}
                </div>
              </td>

              {/* 6. [관세율] */}
              <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap">
                <span className={`font-mono font-bold text-sm ${
                  result.tariffRate === 0 
                    ? 'text-blue-700' 
                    : result.tariffRateType === 'WTO양허관세'
                      ? 'text-blue-800'
                      : 'text-amber-800'
                }`}>
                  {result.tariffRate.toFixed(1)}%
                </span>
              </td>

              {/* 7. [관세] (총 과세가격 X 관세율) */}
              <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap font-mono bg-amber-50/20">
                <div className={`font-bold text-sm ${result.tariffAmountKrw === 0 ? 'text-slate-400' : 'text-amber-950'}`}>
                  {formatCurrency(result.tariffAmountKrw, 'KRW')}
                </div>
              </td>

              {/* 8. [부가가치세] (총 과세가격 + 관세 X 10%) */}
              <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap font-mono bg-slate-50/50">
                <div className="font-bold text-sm text-slate-900">
                  {formatCurrency(result.vatAmountKrw, 'KRW')}
                </div>
              </td>

              {/* 9. [환율] */}
              <td className="p-3 text-center whitespace-nowrap font-mono">
                <div className="font-bold text-slate-900">
                  ₩ {formatNumber(result.exchangeRate)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* [수입시 요건사항] 하단 전용 섹션 */}
      <div className="bg-white px-4 py-3.5 border-t border-slate-200 text-xs text-slate-800 space-y-2">
        {/* 1. 타이틀 및 요건/통관 상태 뱃지 (화평법/화관법 등 화학물질 관리법일 때만 2026년 요건 승인 여부 표시) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            {isChemicalItem ? (
              result.approvalStatus?.isRegistered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              )
            ) : result.importRegulationsFull.isControlled ? (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            [수입시 요건사항]
          </span>

          {/* 🎯 화평법/화관법 등 화학물질 관리법일 때만 2026년 요건승인 등록 뱃지 표시 */}
          {isChemicalItem ? (
            result.approvalStatus?.isRegistered ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                <span>✅ 2026년 요건승인/명세 등록완료</span>
                {result.approvalStatus.bmMatches && result.approvalStatus.bmMatches.length > 0 && (
                  <span className="bg-emerald-200/80 px-1 rounded text-[9px] text-emerald-900 font-bold">BM</span>
                )}
                {result.approvalStatus.emMatches && result.approvalStatus.emMatches.length > 0 && (
                  <span className="bg-yellow-200 px-1 rounded text-[9px] text-slate-900 font-bold">EM</span>
                )}
                {result.approvalStatus.bmChemicalSpecMatches && result.approvalStatus.bmChemicalSpecMatches.length > 0 && (
                  <span className="bg-indigo-100 px-1 rounded text-[9px] text-indigo-900 font-bold">BM화학물질명세</span>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                <span>⚠️ 2026년 요건 미등록 품목 (화평법·화관법 대상)</span>
              </span>
            )
          ) : (
            // 비화학물질 품목(커피, 스마트폰, 의류 등)인 경우 통관 규제 상태 표시
            result.importRegulationsFull.isControlled ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                <span>🔍 세관장확인대상 (개별법령 요건확인)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span>일반통관 (요건비대상)</span>
              </span>
            )
          )}
        </div>

        {/* 2. [세관장확인대상]부터~ 문구 ([수입시 요건사항] 바로 아래 배치) */}
        {result.importRegulationsSummary && (
          <p className="font-bold text-slate-900 text-xs leading-relaxed">
            {result.importRegulationsSummary}
          </p>
        )}

        {/* 3. [수입시 요건사항] 항목들을 한 줄로 나열 (화평법/화관법 등록 품목일 때만 노출) */}
        {isChemicalItem && result.approvalStatus?.isRegistered && (
          <div className="flex flex-row overflow-x-auto gap-2 py-1 items-stretch scrollbar-thin">
            {/* BM 내역 */}
            {result.approvalStatus.bmMatches && result.approvalStatus.bmMatches.map((bm, bIdx) => (
              <div key={`bm-${bIdx}`} className="bg-emerald-50/70 p-2 rounded-md border border-emerald-200 space-y-1 min-w-[240px] max-w-[320px] shrink-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1 truncate">
                    <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-black shrink-0">BM</span>
                    <span className="truncate">{bm.productName}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-900 bg-white px-1.5 py-0.2 rounded border border-emerald-200 text-[10px] shrink-0">
                    {bm.approvalNumber}
                  </span>
                </div>
                <div className="text-slate-600 text-[10px] flex flex-wrap gap-x-2">
                  <span>함량: <strong className="text-rose-700">{bm.hazardousSubstance}</strong></span>
                  <span>CAS: <strong className="font-mono text-blue-900">{bm.casNo || '-'}</strong></span>
                </div>
              </div>
            ))}

            {/* EM 내역 */}
            {result.approvalStatus.emMatches && result.approvalStatus.emMatches.map((em, eIdx) => (
              <div key={`em-${eIdx}`} className="bg-amber-50/70 p-2 rounded-md border border-amber-200 space-y-1 min-w-[240px] max-w-[320px] shrink-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold text-slate-950 flex items-center gap-1 truncate">
                    <span className="px-1.5 py-0.2 bg-yellow-400 text-slate-950 rounded text-[9px] font-black shrink-0">EM</span>
                    <span className="truncate">{em.productName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.2 rounded border border-amber-200 text-[10px] shrink-0">
                    {em.approvalNumber}
                  </span>
                </div>
                <div className="text-slate-600 text-[10px] flex flex-wrap gap-x-2">
                  <span>함량: <strong className="text-rose-700">{em.hazardousSubstance}</strong></span>
                  <span>CAS: <strong className="font-mono text-blue-900">{em.casNo || '-'}</strong></span>
                </div>
              </div>
            ))}

            {/* BM-화학물질명세내역 */}
            {result.approvalStatus.bmChemicalSpecMatches && result.approvalStatus.bmChemicalSpecMatches.map((spec, sIdx) => (
              <div key={`spec-${sIdx}`} className="bg-indigo-50/80 p-2 rounded-md border border-indigo-200 space-y-1 min-w-[240px] max-w-[320px] shrink-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold text-indigo-950 flex items-center gap-1 truncate">
                    <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded text-[9px] font-black shrink-0">BM화학물질명세</span>
                    <span className="truncate">{spec.productName}</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-900 bg-white px-1.5 py-0.2 rounded border border-indigo-200 text-[10px] shrink-0">
                    NO. {spec.no}
                  </span>
                </div>
                <div className="text-slate-700 text-[10px] flex items-center gap-1 truncate">
                  <span className="shrink-0">모델·규격:</span>
                  <strong className="text-indigo-900 font-mono truncate">{spec.modelSpec || '(규격 미지정)'}</strong>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. 관련 법령 태그 */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">근거 법령:</span>
          {result.importRegulationsFull.applicableLaws.map((law, idx) => (
            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium border border-slate-200">
              {law}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
