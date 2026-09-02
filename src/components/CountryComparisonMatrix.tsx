import React, { useState } from 'react';
import { TradeItem, CalculationInput, CalculationResult } from '../types';
import { COUNTRIES } from '../data/exchangeRates';
import { calculateTradeDuties } from '../utils/calculator';
import { 
  getClipTariffSchedule, 
  getKoreaBilateralFta, 
  CLIP_PORTAL_URL,
  KOREA_TARIFF_PRIORITY_RULES,
  determinePriorityTariffRate
} from '../data/clipTariffData';
import { 
  Building2, 
  ExternalLink, 
  TableProperties, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Scale, 
  ArrowRight, 
  HelpCircle, 
  Layers, 
  Award,
  FileCheck,
  FileX,
  Check,
  Zap,
  Globe2,
  Sparkles
} from 'lucide-react';

interface CountryComparisonMatrixProps {
  input: CalculationInput;
  selectedItem?: TradeItem;
  result?: CalculationResult;
  onSelectCountryAsDestination?: (countryCode: string) => void;
  onToggleFta?: (applyFta: boolean) => void;
}

export const CountryComparisonMatrix: React.FC<CountryComparisonMatrixProps> = ({
  input,
  selectedItem,
  result,
  onSelectCountryAsDestination,
  onToggleFta
}) => {
  const [isTariffSectionExpanded, setIsTariffSectionExpanded] = useState<boolean>(true);
  const [isDesignatedCountryExpanded, setIsDesignatedCountryExpanded] = useState<boolean>(true);
  const [showClipTable, setShowClipTable] = useState<boolean>(false);
  const [showPriorityTable, setShowPriorityTable] = useState<boolean>(true);
  const [showOtherCountries, setShowOtherCountries] = useState<boolean>(false);

  // Retrieve official CLIP tariff schedule for current HS Code
  const currentHsCode = input.hsCode || selectedItem?.hsCode || '2825.90-2050';
  const clipSchedule = getClipTariffSchedule(
    currentHsCode,
    input.itemName || selectedItem?.name
  );

  // Get metadata for export & import countries
  const exportCountryMeta = COUNTRIES.find(c => c.code === input.exportCountry) || {
    code: input.exportCountry,
    name: input.exportCountry,
    nameEn: input.exportCountry,
    flag: '🌐',
    defaultCurrency: input.currency
  };

  const importCountryMeta = COUNTRIES.find(c => c.code === input.importCountry) || {
    code: input.importCountry,
    name: input.importCountry,
    nameEn: input.importCountry,
    flag: '🌐',
    defaultCurrency: 'KRW'
  };

  // Determine bilateral FTA for Korea import
  const isImportKorea = input.importCountry === 'KR';
  const koreaBilateral = getKoreaBilateralFta(input.exportCountry);

  // Calculate duties for the current import country
  const currentCalc = result || calculateTradeDuties(input, selectedItem);

  // Applicable rates for display
  const baseRate = isImportKorea ? 8.0 : clipSchedule.baseRate;
  const wtoRate = isImportKorea ? 5.5 : clipSchedule.wtoRate;
  const quotaRate = clipSchedule.quotaRate;
  const ftaName = isImportKorea 
    ? koreaBilateral.fullLabel 
    : (currentCalc.ftaAppliedName || `${exportCountryMeta.name}-${importCountryMeta.name} FTA`);
  const ftaRate = isImportKorea ? (koreaBilateral.isFta ? koreaBilateral.rate : baseRate) : currentCalc.tariffRate;

  // 법정 7단계 세율 적용 우선순위 판정 결과
  const priorityResult = determinePriorityTariffRate({
    baseRate,
    wtoRate,
    quotaRate,
    ftaRate,
    applyFta: input.applyFta,
    ftaName: koreaBilateral.fullLabel,
    ftaCode: koreaBilateral.code
  });

  // 대한민국 주요 협정별 FTA 관세율 목록 (원산지증명서 O 시 끌고오는 각 협정별 데이터)
  const ftaList = [
    { code: 'FCN1', name: '한-중 FTA', countryCode: 'CN', flag: '🇨🇳', rate: clipSchedule.ftaRates['CN']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FUS1', name: '한-미 FTA', countryCode: 'US', flag: '🇺🇸', rate: clipSchedule.ftaRates['US']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FEU1', name: '한-EU FTA', countryCode: 'DE', flag: '🇪🇺', rate: clipSchedule.ftaRates['DE']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FAU1', name: '한-호주 FTA', countryCode: 'AU', flag: '🇦🇺', rate: clipSchedule.ftaRates['AU']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FVK1', name: '한-베트남 FTA', countryCode: 'VN', flag: '🇻🇳', rate: clipSchedule.ftaRates['VN']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FRC1', name: 'RCEP (한-일 등)', countryCode: 'JP', flag: '🇯🇵', rate: clipSchedule.ftaRates['JP']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FIC1', name: '한-인도 CEPA', countryCode: 'IN', flag: '🇮🇳', rate: clipSchedule.ftaRates['IN']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FGB1', name: '한-영 FTA', countryCode: 'GB', flag: '🇬🇧', rate: clipSchedule.ftaRates['GB']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FID1', name: '한-인니 CEPA', countryCode: 'ID', flag: '🇮🇩', rate: clipSchedule.ftaRates['ID']?.rate ?? 0.0, status: '무세 0%' },
    { code: 'FCA1', name: '한-캐나다 FTA', countryCode: 'CA', flag: '🇨🇦', rate: 0.0, status: '무세 0%' },
    { code: 'FSG1', name: '한-싱가포르 FTA', countryCode: 'SG', flag: '🇸🇬', rate: 0.0, status: '무세 0%' },
    { code: 'FAS1', name: '한-아세안 FTA', countryCode: 'TH', flag: '🌏', rate: 0.0, status: '무세 0%' }
  ];

  return (
    <div id="import-country-tariff-inquiry" className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
      {/* 1. Header Section - 수입국의 관세율 조회 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-0.5 sm:mt-0 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                [관세율] 가이드
              </h3>
              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold border border-blue-200">
                수입국: {importCountryMeta.name} ({importCountryMeta.code})
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold border border-emerald-200">
                관세청 CLIP 법령포털 공식 데이터
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              관세청 법령정보포털(CLIP) <span className="text-blue-900 font-semibold">[세계 HS → 관세율표 → 국내관세율]</span> 상세목록 기반 HS Code별 세율 조회 및 법정 우선순위(1~7순위) 적용
            </p>
          </div>
        </div>

        {/* Actions: CLIP Portal Link & Toggles */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <a
            id="clip-portal-official-link"
            href={CLIP_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 text-xs font-semibold transition shadow-2xs"
            title="관세청 법령정보포털 CLIP [세계 HS > 관세율표 > 국내관세율] 공식 조회 (새 창)"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>관세청 CLIP 관세율표</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {isTariffSectionExpanded && (
            <>
              <button
                id="btn-toggle-priority-guide"
                type="button"
                onClick={() => setShowPriorityTable(!showPriorityTable)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold transition shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>우선순위 {showPriorityTable ? '접기' : '보기'}</span>
                {showPriorityTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                id="btn-toggle-clip-table"
                type="button"
                onClick={() => setShowClipTable(!showClipTable)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold transition shadow-xs"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>CLIP 세목 {showClipTable ? '접기' : '조회'}</span>
                {showClipTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          {/* Main Inquiry Collapse/Expand button */}
          <button
            type="button"
            onClick={() => setIsTariffSectionExpanded(!isTariffSectionExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition shadow-2xs"
            title="수입국의 관세율 조회 섹션 숨기기/펼치기"
          >
            <span>관세율 조회 {isTariffSectionExpanded ? '접기' : '펼치기'}</span>
            {isTariffSectionExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {isTariffSectionExpanded && (
        <>
          {/* 2. Official CLIP HS Schedule Summary Banner */}
          <div className="bg-slate-50 rounded-lg p-3.5 mb-5 border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-800">조회 대상 품목:</span>
                <span className="font-mono font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-2xs">
                  HS {clipSchedule.hsCode}
                </span>
                <span className="text-slate-800 font-semibold">{clipSchedule.nameKr}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">데이터 출처:</span>
                <span className="font-semibold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  세계 HS → 관세율표 → 국내관세율 상세목록
                </span>
              </div>
            </div>

            {/* Essential Rate Highlights for this HS Code & Route */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center">
              <div className="bg-white p-2.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-600 font-bold block">기본관세 (구분기호 A)</span>
                <span className="font-mono font-extrabold text-sm text-slate-900">{baseRate.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">7순위 법정 기본세율</span>
              </div>

              <div className="bg-blue-50/80 p-2.5 rounded border border-blue-200 shadow-2xs">
                <span className="text-[10px] text-blue-900 font-bold block">WTO양허세율 (구분기호 C)</span>
                <span className="font-mono font-extrabold text-sm text-blue-950">{wtoRate.toFixed(1)}%</span>
                <span className="text-[9px] text-blue-700 block mt-0.5">3순위 일반양허관세</span>
              </div>

              <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200 shadow-2xs">
                <span className="text-[10px] text-emerald-900 font-bold block truncate" title={ftaName}>
                  {isImportKorea ? koreaBilateral.fullLabel : ftaName}
                </span>
                <span className="font-mono font-extrabold text-sm text-emerald-700">
                  {koreaBilateral.isFta ? `${ftaRate.toFixed(1)}% (무세)` : `${baseRate.toFixed(1)}%`}
                </span>
                <span className="text-[9px] text-emerald-600 block mt-0.5">
                  {koreaBilateral.isFta ? '2순위 FTA 협정관세' : '협정 미체결'}
                </span>
              </div>

              <div className="bg-amber-50/80 p-2.5 rounded border border-amber-200 shadow-2xs">
                <span className="text-[10px] text-amber-900 font-bold block">할당관세 (구분기호 W)</span>
                <span className="font-mono font-extrabold text-sm text-amber-900">
                  {clipSchedule.quotaRate !== undefined ? `${clipSchedule.quotaRate.toFixed(1)}%` : '0.0%'}
                </span>
                <span className="text-[9px] text-amber-700 block mt-0.5">4순위 수급안정 탄력세율</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-700 font-bold block">부가가치세율 (VAT)</span>
                <span className="font-mono font-extrabold text-sm text-slate-900">{currentCalc.vatRate.toFixed(1)}%</span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{importCountryMeta.name} 부가가치세법</span>
              </div>
            </div>
          </div>

          {/* 3. 법정 세율 적용 우선순위 (1순위~7순위) 상세 규정 카드 (첨부 이미지 기준) */}
          {showPriorityTable && (
        <div id="customs-priority-rule-table" className="mb-6 bg-slate-50 rounded-lg border border-slate-300 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-900" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                대한민국 관세법상 세율 적용 우선순위 (관세청 고시 기준)
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-blue-950 bg-blue-100/80 px-2 py-0.5 rounded">
              관세법 제50조(세율 적용의 우선순위)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-white rounded border border-slate-200">
              <thead>
                <tr className="bg-blue-900 text-white font-semibold text-[11px]">
                  <th className="py-2.5 px-3 text-center w-16 border-r border-blue-800">순위</th>
                  <th className="py-2.5 px-3 border-r border-blue-800">세종 (구분부호)</th>
                  <th className="py-2.5 px-3 border-r border-blue-800">적용방법 및 우선순위 규정</th>
                  <th className="py-2.5 px-3 text-center w-28">현재 품목 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {/* 1순위 */}
                <tr className={priorityResult.rank === 1 ? 'bg-amber-100/70 font-semibold' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-900 border-r border-slate-200">1</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-900">탄력관세 (구제조치)</div>
                    <div className="text-[11px] text-slate-500">덤핑방지관세 (I), 보복관세, 긴급관세 (K), 특정국물품긴급관세, 특별긴급관세 (T), 상계관세, 조정관세 (L2)</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 border-r border-slate-200">
                    <span className="inline-block bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">가장 우선 적용</span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-[11px] text-slate-400">해당사항 없음</td>
                </tr>

                {/* 2순위 */}
                <tr className={priorityResult.rank === 2 ? 'bg-emerald-100/80 font-semibold ring-1 ring-emerald-400' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center font-mono font-extrabold text-emerald-800 border-r border-slate-200">2</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-emerald-950">자유무역협정(FTA) 협정관세</div>
                    <div className="text-[11px] text-emerald-800">
                      칠레, 싱가포르, EFTA, 아세안, 인도, EU, 페루, 미국, 터키, 호주, 캐나다, 콜롬비아, 중국(FCN1), 베트남, 뉴질랜드, 중미공화국, RCEP(FRC1) 등
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-900 border-r border-slate-200">
                    <span className="inline-block bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      3, 4, 5, 6, 7 보다 낮은 경우 우선 적용
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {priorityResult.rank === 2 ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> 최우선 확정
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">FTA 미적용</span>
                    )}
                  </td>
                </tr>

                {/* 3순위 */}
                <tr className={priorityResult.rank === 3 ? 'bg-blue-100 font-semibold ring-1 ring-blue-400' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center font-mono font-extrabold text-blue-900 border-r border-slate-200">3</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-blue-950">WTO 양허관세 / APTA / 개발도상국 협정관세</div>
                    <div className="text-[11px] text-slate-600">
                      • WTO일반양허관세 (공산품·수산물 및 단순양허 C, 정보기술 CIT)<br />
                      • WTO개도국간 양허 (D) / 아·태협정 APTA (E, E2, E3) / 개도국협정 (G) / 국제협력 (F) / 편익관세
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                    <span className="inline-block bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded text-[11px] font-bold">
                      4, 5, 6, 7 보다 낮은 경우 우선 적용
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">* 농림축산물 W1/W2 양허세율은 6, 7보다 우선 적용</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {priorityResult.rank === 3 ? (
                      <span className="inline-flex items-center gap-1 bg-blue-700 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> 적용 확정
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">5.5% (대기)</span>
                    )}
                  </td>
                </tr>

                {/* 4순위 */}
                <tr className={priorityResult.rank === 4 ? 'bg-amber-100 font-semibold ring-1 ring-amber-400' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-r border-slate-200">4</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-800">조정관세 (L) / 계절관세 / 할당관세 (P, W)</div>
                    <div className="text-[11px] text-slate-500">배터리 핵심 원자재 수급안정 및 물가안정용 할당관세 (0%)</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                    <span className="inline-block bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-medium">
                      5보다 낮은 경우 우선 / 6, 7 보다 우선 적용
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {priorityResult.rank === 4 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> 적용 확정
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">미적용</span>
                    )}
                  </td>
                </tr>

                {/* 5순위 */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-r border-slate-200">5</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-800">최빈개발도상국에 대한 특혜관세 (R)</div>
                    <div className="text-[11px] text-slate-500">UN 지정 최빈개도국 특혜 양허세율</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                    <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                      6, 7 보다 우선 적용
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-[11px] text-slate-400">해당사항 없음</td>
                </tr>

                {/* 6순위 */}
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-r border-slate-200">6</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-800">잠정관세 (B)</div>
                    <div className="text-[11px] text-slate-500">잠정적으로 기본세율을 대체 적용</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                    <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                      7 보다 우선 적용
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-[11px] text-slate-400">미지정</td>
                </tr>

                {/* 7순위 */}
                <tr className={priorityResult.rank === 7 ? 'bg-amber-100 font-semibold ring-1 ring-amber-400' : 'hover:bg-slate-50'}>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700 border-r border-slate-200">7</td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <div className="font-bold text-slate-800">기본관세 (A)</div>
                    <div className="text-[11px] text-slate-500">관세법 별표 관세율표 일반 법정세율 (8.0%)</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                    <span className="inline-block bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                      가장 기본 세율 (타 특혜 부적용 시)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {priorityResult.rank === 7 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-700 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> 적용 확정
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">8.0% (기본)</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Collapsible CLIP Full Legal Tariff Breakdown Table */}
      {showClipTable && (
        <div className="mb-6 bg-slate-900 text-white rounded-lg p-4 shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-bold text-white">
                관세청 법령정보포털(CLIP) [세계 HS → 관세율표 → 국내관세율] 목록 (HS {clipSchedule.hsCode})
              </h4>
            </div>
            <span className="text-[11px] text-slate-300">세계HS 및 한국 관세율표 공식 고시</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-300 bg-slate-800/80">
                  <th className="py-2 px-3 font-semibold">구분기호</th>
                  <th className="py-2 px-3 font-semibold">법정 세종 / 협정 명칭</th>
                  <th className="py-2 px-3 font-semibold text-center">공식 세율</th>
                  <th className="py-2 px-3 font-semibold">해당 수출국 매칭 및 양허 조건</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr className={priorityResult.rank === 7 ? 'bg-slate-800/80 font-semibold' : ''}>
                  <td className="py-2 px-3 font-mono font-bold text-amber-400">A</td>
                  <td className="py-2 px-3">기본관세 (General Tariff)</td>
                  <td className="py-2 px-3 font-mono font-bold text-center text-amber-300">8.0%</td>
                  <td className="py-2 px-3 text-slate-300">관세법 별표 관세율표 일반세율 (구분기호 A, 7순위)</td>
                </tr>
                <tr className={priorityResult.rank === 3 ? 'bg-blue-950 font-semibold' : 'bg-slate-800/40'}>
                  <td className="py-2 px-3 font-mono font-bold text-blue-400">C</td>
                  <td className="py-2 px-3 font-bold text-blue-200">WTO협정세율 (WTO Concession Rate)</td>
                  <td className="py-2 px-3 font-mono font-extrabold text-center text-blue-300">5.5%</td>
                  <td className="py-2 px-3 text-blue-200">세계무역기구(WTO) 회원국 상호 양허세율 (구분기호 C, 3순위)</td>
                </tr>
                <tr className={input.exportCountry === 'CN' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : ''}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FCN1</td>
                  <td className="py-2 px-3 font-bold text-emerald-200">한-중 FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-extrabold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-emerald-300">🇨🇳 수출국 중국 매칭 — 한-중 원산지증명서(C/O) 구비 시 무세(0%) 적용 (2순위)</td>
                </tr>
                <tr className={input.exportCountry === 'AU' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : 'bg-slate-800/40'}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FAU1</td>
                  <td className="py-2 px-3 font-bold text-emerald-200">한-호주 FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-extrabold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-emerald-300">🇦🇺 수출국 호주 매칭 — 한-호주 FTA 원산지증명서 발급 시 무세(0%) (2순위)</td>
                </tr>
                <tr className={input.exportCountry === 'JP' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : ''}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FRC1</td>
                  <td className="py-2 px-3 font-bold text-emerald-200">RCEP FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-extrabold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-emerald-300">🇯🇵 수출국 일본 매칭 — 역내포괄적경제동반자협정(RCEP) 적용 시 무세(0%) (2순위)</td>
                </tr>
                <tr className={input.exportCountry === 'US' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : 'bg-slate-800/40'}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FUS1</td>
                  <td className="py-2 px-3 font-medium">한-미 FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-bold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-slate-300">🇺🇸 수출국 미국 매칭 — KORUS 자율발급 원산지신고서 적용 (2순위)</td>
                </tr>
                <tr className={input.exportCountry === 'DE' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : ''}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FEU1</td>
                  <td className="py-2 px-3 font-medium">한-EU FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-bold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-slate-300">🇩🇪 수출국 독일/EU 매칭 — 원산지인증수출자 원산지신고서 적용 (2순위)</td>
                </tr>
                <tr className={input.exportCountry === 'VN' && input.applyFta ? 'bg-emerald-950/70 font-semibold' : 'bg-slate-800/40'}>
                  <td className="py-2 px-3 font-mono font-bold text-emerald-400">FVK1</td>
                  <td className="py-2 px-3 font-medium">한-베트남 FTA 협정세율</td>
                  <td className="py-2 px-3 font-mono font-bold text-center text-emerald-400">0.0%</td>
                  <td className="py-2 px-3 text-slate-300">🇻🇳 수출국 베트남 매칭 — VKFTA 원산지증명서 제출 (2순위)</td>
                </tr>
                <tr className="bg-slate-800/30">
                  <td className="py-2 px-3 font-mono font-bold text-amber-400">W</td>
                  <td className="py-2 px-3 font-medium text-amber-200">할당관세 (Quota Tariff)</td>
                  <td className="py-2 px-3 font-mono font-bold text-center text-amber-300">0.0%</td>
                  <td className="py-2 px-3 text-amber-200">이차전지 핵심소재 공급망 안정 지원을 위한 관세 감면 0% (구분기호 W, 4순위)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}

      {/* 5. Single Focused Destination Country Card (수입국 기준 단일 상세 패널) */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-xl border-2 border-blue-900/40 p-5 sm:p-6 shadow-sm">
        {/* Top Badges & Route Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">{importCountryMeta.flag}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900 uppercase bg-blue-100 px-2 py-0.5 rounded">
                  지정 수입국 (Import Destination)
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {importCountryMeta.code} / {importCountryMeta.defaultCurrency}
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                {importCountryMeta.name} ({importCountryMeta.nameEn})
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Trade Route Pill */}
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-slate-300 text-xs shadow-2xs">
              <span className="text-slate-500 font-medium">무역 경로:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <span>{exportCountryMeta.flag}</span> {exportCountryMeta.name}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
              <span className="font-bold text-blue-950 flex items-center gap-1">
                <span>{importCountryMeta.flag}</span> {importCountryMeta.name}
              </span>
            </div>

            {/* Toggle Designated Country Card */}
            <button
              type="button"
              onClick={() => setIsDesignatedCountryExpanded(!isDesignatedCountryExpanded)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 text-xs font-bold transition shadow-2xs"
              title="지정수입국 상세 분석 영역 숨기기/펼치기"
            >
              <span>지정수입국 {isDesignatedCountryExpanded ? '접기' : '펼치기'}</span>
              {isDesignatedCountryExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
        </div>

        {isDesignatedCountryExpanded ? (
          <>
            {/* Focused Tariff Structure Panel - 2대 관세율 구분 체계 (1. 원산지증명서 O vs 2. 원산지증명서 X) */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-5">
          {/* Dashboard Header & Current Active Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  관세율 2대 산정 체계 구분 분석 (C/O 구비 여부별)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded">
                  {priorityResult.rank}순위 법정 적용
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                원산지증명서(C/O) 구비 시 <strong className="text-emerald-800">1) 각 협정별 FTA 세율</strong>이 우선 적용되며, 미구비 시 <strong className="text-blue-900">2) WTO 협정세율(기본세율보다 낮은 경우)</strong>이 자동 적용됩니다.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] text-slate-500 font-medium">현재 산출 반영:</span>
              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border shadow-2xs ${
                input.applyFta 
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-2 ring-emerald-500/20' 
                  : 'bg-blue-50 text-blue-950 border-blue-300 ring-2 ring-blue-500/20'
              }`}>
                {input.applyFta ? <FileCheck className="w-4 h-4 text-emerald-700" /> : <FileX className="w-4 h-4 text-blue-700" />}
                <span>{input.applyFta ? '1) 원산지증명서 O' : '2) 원산지증명서 X'}</span>
                <span className="font-mono font-extrabold text-blue-900 ml-1">
                  {currentCalc.tariffRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* 2대 관세율 구분 체계 카드 그리드 (1. 원산지증명서 O  vs  2. 원산지증명서 X) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ---------------- 1) 원산지증명서 O (C/O 구비 시) ---------------- */}
            <div className={`p-4 sm:p-5 rounded-xl border-2 transition relative flex flex-col justify-between ${
              input.applyFta 
                ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/30' 
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}>
              <div>
                {/* Branch Header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-emerald-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs ${
                      input.applyFta ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-emerald-950 flex items-center gap-1.5">
                        <span>1) 원산지증명서 O</span>
                        <span className="text-xs font-normal text-emerald-800">(C/O 구비)</span>
                      </h5>
                      <p className="text-[11px] text-emerald-800 font-semibold">
                        자유무역협정(FTA) 협정관세율 적용 (관세법 2순위)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-200/90 text-emerald-950 font-bold px-2 py-0.5 rounded block">
                      2순위 최우선
                    </span>
                    <span className="text-[9px] text-emerald-700 mt-0.5 block">C/O 제출</span>
                  </div>
                </div>

                {/* 현재 교역국 FTA 적용 하이라이트 박스 */}
                <div className="bg-white p-3.5 rounded-lg border border-emerald-200 shadow-2xs mb-3.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-bold">
                      현재 수입경로({exportCountryMeta.flag} {exportCountryMeta.name} → {importCountryMeta.flag} {importCountryMeta.name}):
                    </span>
                    <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {koreaBilateral.code || 'FTA'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-800">
                        {koreaBilateral.isFta ? `${koreaBilateral.rate.toFixed(1)}% (무세)` : `${baseRate.toFixed(1)}%`}
                      </span>
                      <span className="text-xs text-emerald-900 ml-2 font-bold">
                        {koreaBilateral.isFta ? koreaBilateral.fullLabel : 'FTA 미체결 (기본세율 적용)'}
                      </span>
                    </div>
                    {koreaBilateral.isFta && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
                        관세 100% 면제
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">필요 서류: </span>
                    <span>체결국 세관/상공회의소 발급 FTA 원산지증명서(C/O) 또는 공인 자율원산지신고서</span>
                  </div>
                </div>

                {/* 하단 각 협정별 FTA 세율 끌어오기 리스트 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>각 협정별 FTA 양허세율 목록 (UNIPASS 관세율표 연동)</span>
                    <span className="text-[10px] text-slate-400 font-normal">C/O 구비 기준</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ftaList.map((fta) => {
                      const isCurrentExport = input.exportCountry === fta.countryCode;
                      return (
                        <div
                          key={fta.code}
                          className={`p-2 rounded-lg border text-xs flex flex-col justify-between transition ${
                            isCurrentExport && input.applyFta
                              ? 'bg-emerald-100 border-emerald-400 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-700">
                            <span className="truncate">{fta.flag} {fta.name}</span>
                            <span className="font-mono text-[9px] text-slate-400">{fta.code}</span>
                          </div>
                          <div className="flex items-baseline justify-between mt-1">
                            <span className="font-mono font-extrabold text-emerald-800 text-sm">
                              {fta.rate.toFixed(1)}%
                            </span>
                            <span className="text-[9px] text-emerald-700 font-semibold">{fta.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action / Switch Bar */}
              <div className="mt-4 pt-3 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-emerald-900 font-semibold flex items-center gap-1">
                  {input.applyFta ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700 font-bold" />
                      <span>현재 1) 원산지증명서 O가 계산에 적용 중입니다.</span>
                    </>
                  ) : (
                    <span>원산지증명서(C/O) 구비 시 클릭하여 적용</span>
                  )}
                </span>
                {onToggleFta && (
                  <button
                    type="button"
                    onClick={() => onToggleFta(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition shadow-2xs ${
                      input.applyFta 
                        ? 'bg-emerald-800 text-white cursor-default' 
                        : 'bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300'
                    }`}
                  >
                    {input.applyFta ? '적용 중 ✓' : '1) C/O O 적용하기'}
                  </button>
                )}
              </div>
            </div>

            {/* ---------------- 2) 원산지증명서 X (C/O 미구비 시) ---------------- */}
            <div className={`p-4 sm:p-5 rounded-xl border-2 transition relative flex flex-col justify-between ${
              !input.applyFta 
                ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/30' 
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}>
              <div>
                {/* Branch Header */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs ${
                      !input.applyFta ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      <FileX className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-blue-950 flex items-center gap-1.5">
                        <span>2) 원산지증명서 X</span>
                        <span className="text-xs font-normal text-blue-800">(C/O 미구비)</span>
                      </h5>
                      <p className="text-[11px] text-blue-800 font-semibold">
                        WTO 협정세율 / 기본세율 자동 우선순위 적용 (관세법 3순위 vs 7순위)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-blue-200/90 text-blue-950 font-bold px-2 py-0.5 rounded block">
                      3순위 vs 7순위
                    </span>
                    <span className="text-[9px] text-blue-700 mt-0.5 block">C/O 불필요</span>
                  </div>
                </div>

                {/* WTO vs 기본세율 판정 하이라이트 박스 */}
                <div className="bg-white p-3.5 rounded-lg border border-blue-200 shadow-2xs mb-3.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-bold">
                      원산지증명서 미구비 시 법정 확정 관세율:
                    </span>
                    <span className="font-mono text-[10px] text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      {wtoRate < baseRate ? 'WTO 양허세율 (3순위)' : '기본관세 (7순위)'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div>
                      <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-950">
                        {wtoRate < baseRate ? `${wtoRate.toFixed(1)}%` : `${baseRate.toFixed(1)}%`}
                      </span>
                      <span className="text-xs text-blue-800 ml-2 font-bold">
                        {wtoRate < baseRate ? 'WTO일반양허세율 (구분기호 C)' : '기본관세 (구분기호 A)'}
                      </span>
                    </div>
                    {wtoRate < baseRate && (
                      <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        기본세율 대비 {(baseRate - wtoRate).toFixed(1)}%p 인하
                      </span>
                    )}
                  </div>

                  {/* 법정 우선순위 규정 안내 */}
                  <div className="mt-2.5 p-2.5 bg-blue-50/80 rounded-lg border border-blue-100 text-[11px] text-blue-950 leading-relaxed">
                    <p className="font-bold flex items-center gap-1 mb-0.5">
                      <Scale className="w-3.5 h-3.5 text-blue-700" />
                      <span>관세법 제50조 제3호 규정 (할당관세 기본 미적용 기준):</span>
                    </p>
                    <p>
                      {wtoRate < baseRate ? (
                        <>
                          한시적 정책관세인 할당관세는 기본 미적용하며, 3순위 <strong>WTO 협정세율({wtoRate.toFixed(1)}%)</strong>이 7순위 <strong>기본세율({baseRate.toFixed(1)}%)</strong>보다 낮으므로, <u>별도의 원산지증명서(C/O) 제출 없이도</u> WTO 회원국 간에는 <strong>WTO 협정세율 {wtoRate.toFixed(1)}%</strong>가 자동 우선 적용됩니다. (예: HS 2841.90-9030 등)
                        </>
                      ) : (
                        <>
                          기본세율({baseRate.toFixed(1)}%)이 WTO 양허세율보다 낮거나 같으므로 기본세율이 적용됩니다.
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* 2대 세율 체계 상세 비교 카드 */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* WTO 협정세율 (C) */}
                  <div className={`p-3 rounded-lg border transition ${
                    wtoRate < baseRate ? 'bg-blue-50/80 border-blue-400' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                      <span className="font-bold text-blue-950">WTO협정세율 (C)</span>
                      <span className="font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded text-[9px]">3순위</span>
                    </div>
                    <div className="font-mono font-extrabold text-lg text-blue-950">
                      {wtoRate.toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-blue-700 mt-1">
                      {wtoRate < baseRate ? '기본세율보다 낮아 우선' : 'WTO 회원국 상호 양허'}
                    </p>
                  </div>

                  {/* 기본관세 (A) */}
                  <div className="p-3 rounded-lg border bg-white border-slate-200">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-700">기본관세 (A)</span>
                      <span className="font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded text-[9px]">7순위</span>
                    </div>
                    <div className="font-mono font-extrabold text-lg text-slate-800">
                      {baseRate.toFixed(1)}%
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      관세법 별표 법정 기본세율
                    </p>
                  </div>
                </div>
              </div>

              {/* Action / Switch Bar */}
              <div className="mt-4 pt-3 border-t border-blue-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-blue-900 font-semibold flex items-center gap-1">
                  {!input.applyFta ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-700 font-bold" />
                      <span>현재 2) 원산지증명서 X(WTO/기본)가 계산에 적용 중입니다.</span>
                    </>
                  ) : (
                    <span>원산지증명서 미구비 시 클릭하여 적용</span>
                  )}
                </span>
                {onToggleFta && (
                  <button
                    type="button"
                    onClick={() => onToggleFta(false)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition shadow-2xs ${
                      !input.applyFta 
                        ? 'bg-blue-950 text-white cursor-default' 
                        : 'bg-white hover:bg-blue-100 text-blue-950 border border-blue-300'
                    }`}
                  >
                    {!input.applyFta ? '적용 중 ✓' : '2) C/O X 적용하기'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 확정 세율 10대 항목 반영 설명 배너 */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-800">
            <div className="flex items-start sm:items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold">통상 필수 10대 항목 명세서 [관세율] 자동 확정 반영: </span>
                <span className="font-mono font-extrabold text-blue-900 underline ml-1">
                  {currentCalc.tariffRate.toFixed(1)}% ({currentCalc.ftaAppliedName || currentCalc.tariffRateType})
                </span>
                <span className="text-slate-500 ml-2">
                  (부가세율 {currentCalc.vatRate.toFixed(1)}% 병행 산출)
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-600 font-medium">
              * 관세법 제50조: {priorityResult.reason}
            </span>
          </div>
        </div>

        {/* Legal Regulatory Compliance Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isImportKorea 
                ? '한국 관세청(KCS) 전자통관시스템 UNIPASS 및 세계HS 관세율표 연동 완료' 
                : `${importCountryMeta.name} 공식 관세율표 규정 적용 완료`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowOtherCountries(!showOtherCountries)}
            className="text-blue-700 hover:text-blue-900 font-semibold underline self-start sm:self-auto"
          >
            {showOtherCountries ? '타 주요국 관세 비교 닫기 ▲' : '타 주요국(미국/EU/일본 등) 관세 비교 열기 ▼'}
          </button>
        </div>

        {/* Collapsible Other Countries Matrix */}
        {showOtherCountries && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <h5 className="text-xs font-bold text-slate-800 mb-2">
              동일 품목(HS {clipSchedule.hsCode}) 타 주요 수입국 기본세율 비교
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COUNTRIES.filter(c => c.code !== input.importCountry).slice(0, 8).map(c => {
                const otherBaseRate = selectedItem?.countryTariffs[c.code]?.baseTariffRate ?? (c.code === 'KR' ? 8.0 : clipSchedule.baseRate);

                return (
                  <div
                    key={c.code}
                    className="p-2.5 rounded border border-slate-200 bg-white text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{c.flag} {c.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{c.code}</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-500">
                        <span>기본세율:</span>
                        <span className="font-mono font-bold text-slate-700">{otherBaseRate}%</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span>FTA 협정:</span>
                        <span className="font-mono">0.0% (무세)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
          </>
        ) : (
          /* Compact Summary when Designated Country is collapsed */
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">적용 원산지상태:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  input.applyFta ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                }`}>
                  {input.applyFta ? '1) 원산지증명서 O (FTA)' : '2) 원산지증명서 X (WTO양허)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">적용 관세율:</span>
                <span className="font-mono font-extrabold text-blue-900 text-sm">
                  {currentCalc.tariffRate.toFixed(1)}%
                </span>
                <span className="text-slate-500 text-[11px]">({currentCalc.ftaAppliedName || currentCalc.tariffRateType})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">부가세율:</span>
                <span className="font-mono font-bold text-slate-700">{currentCalc.vatRate.toFixed(1)}%</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDesignatedCountryExpanded(true)}
              className="text-blue-700 hover:text-blue-900 font-bold text-xs underline self-start sm:self-auto"
            >
              상세 분석 및 C/O 전환 펼치기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
