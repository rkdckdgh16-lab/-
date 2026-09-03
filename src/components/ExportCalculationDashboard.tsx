import React, { useState, useMemo } from 'react';
import { CalculationInput, CalculationResult, TradeItem, ExchangeRateData } from '../types';
import { EXPORT_TRADE_ITEMS } from '../data/exportTradeData';
import { getClipExportRequirements } from '../data/clipExportRequirements';
import { COUNTRIES, INITIAL_EXPORT_EXCHANGE_RATES, INITIAL_EXCHANGE_RATES, UNIPASS_PORTAL_URL } from '../data/exchangeRates';
import { 
  Calculator, 
  Search, 
  Layers, 
  Filter,
  ArrowRightLeft, 
  CheckCircle2, 
  Sparkles,
  Info,
  Tag,
  Check,
  ExternalLink,
  RefreshCw,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Award,
  DollarSign,
  Ship,
  Truck,
  FileCheck,
  HelpCircle,
  ArrowRight,
  Download,
  Building,
  CheckSquare
} from 'lucide-react';

interface ExportCalculationDashboardProps {
  currentRates?: Record<string, ExchangeRateData>;
  currentExportRates?: Record<string, ExchangeRateData>;
  appliedDateDisplay?: string;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
  onSaveToCloud?: () => void;
  isSaving?: boolean;
}

export const ExportCalculationDashboard: React.FC<ExportCalculationDashboardProps> = ({
  currentRates = INITIAL_EXPORT_EXCHANGE_RATES,
  currentExportRates = INITIAL_EXPORT_EXCHANGE_RATES,
  appliedDateDisplay = '2026년 8월 31일',
  onRefreshRates,
  isRefreshingRates = false,
  onSaveToCloud,
  isSaving = false
}) => {
  // Rates pool for export
  const exportRatesPool = currentExportRates || currentRates || INITIAL_EXPORT_EXCHANGE_RATES;

  // 4 Target items only
  const [selectedExportItem, setSelectedExportItem] = useState<TradeItem>(EXPORT_TRADE_ITEMS[2]); // Default to NCA
  const [selectedSubModel, setSelectedSubModel] = useState<string>(EXPORT_TRADE_ITEMS[2].subModels?.[0] || 'CA-NCA020');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체 (All)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showItemDropdown, setShowItemDropdown] = useState<boolean>(false);

  // Form input states
  const [exportCountry, setExportCountry] = useState<string>('KR'); // Korea (Fixed)
  const [importCountry, setImportCountry] = useState<string>('US'); // USA default buyer
  const [quantity, setQuantity] = useState<number>(10000); // 10,000 KG
  const [unitPrice, setUnitPrice] = useState<number>(32.0); // USD 32 / KG
  const [currency, setCurrency] = useState<string>('USD');
  const [incoterms, setIncoterms] = useState<'FOB' | 'CIF' | 'CFR' | 'DAP' | 'DDP' | 'FCA' | 'EXW'>('FOB');
  const [exchangeRate, setExchangeRate] = useState<number>(() => exportRatesPool['USD']?.rateToKrw || 1356.88);
  const [isEditingExchangeRate, setIsEditingExchangeRate] = useState<boolean>(false);

  // Restore to official UNIPASS export rate
  const handleResetToUnipassExportRate = () => {
    const unipassRate = exportRatesPool[currency]?.rateToKrw || INITIAL_EXPORT_EXCHANGE_RATES[currency]?.rateToKrw || 1356.88;
    setExchangeRate(unipassRate);
    setIsEditingExchangeRate(false);
  };

  // Export Additional Costs (수출 부대비용 항목)
  const [freightCost, setFreightCost] = useState<number>(1500); // 해상/항공 운임 (USD)
  const [insuranceCost, setInsuranceCost] = useState<number>(250); // 적하보험료 (USD)
  const [dangerousGoodsFee, setDangerousGoodsFee] = useState<number>(300000); // 위험물 포장 및 검사료 (KRW)
  const [inlandTruckingFee, setInlandTruckingFee] = useState<number>(450000); // 국내 내륙운송료 (KRW)
  const [customsBrokerFee, setCustomsBrokerFee] = useState<number>(150000); // 수출통관 및 C/O 발급수수료 (KRW)
  const [thcHandlingFee, setThcHandlingFee] = useState<number>(200000); // 터미널 화물조작료 THC (KRW)

  // Sub tab for bottom regulation inspection
  const [activeSubTab, setActiveSubTab] = useState<'essential_table' | 'export_regulations' | 'checklist'>('essential_table');

  // Helper to find matched sub models for search query
  const getMatchedSubModels = (item: TradeItem, query: string): string[] => {
    if (!query || !item.subModels) return [];
    const q = query.toLowerCase().trim();
    return item.subModels.filter(m => m.toLowerCase().includes(q));
  };

  // Filter 4 items based on query & category
  const filteredExportItems = useMemo(() => {
    return EXPORT_TRADE_ITEMS.filter(item => {
      // 1. Category check
      if (selectedCategory === '양극재' && item.category !== '양극재') {
        return false;
      }
      if (selectedCategory === '탄산리튬' && item.category !== '탄산리튬') {
        return false;
      }

      // 2. Query check
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      const matchBasic = 
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.hsCode.toLowerCase().includes(q) ||
        item.hsDescription.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchSub = item.subModels?.some(m => m.toLowerCase().includes(q));
      return matchBasic || matchSub;
    });
  }, [searchQuery, selectedCategory]);

  // Handle Category tab switch
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === '양극재') {
      // If currently on a non-양극재 item (like Lithium Carbonate), auto-switch to first 양극재
      if (selectedExportItem.category !== '양극재') {
        const firstYang = EXPORT_TRADE_ITEMS.find(it => it.category === '양극재');
        if (firstYang) handleSelectItem(firstYang);
      }
    } else if (cat === '탄산리튬') {
      // If currently on a non-탄산리튬 item, auto-switch to Lithium Carbonate
      if (selectedExportItem.category !== '탄산리튬') {
        const firstLi = EXPORT_TRADE_ITEMS.find(it => it.category === '탄산리튬');
        if (firstLi) handleSelectItem(firstLi);
      }
    }
  };

  // Handle Item selection
  const handleSelectItem = (item: TradeItem, model?: string) => {
    setSelectedExportItem(item);
    setSelectedSubModel(model || item.subModels?.[0] || '');
    if (item.defaultUnitPriceUsd && item.defaultUnitPriceUsd > 0) {
      setUnitPrice(item.defaultUnitPriceUsd);
    }
    setShowItemDropdown(false);
  };

  // Calculations: STRICTLY Fixed at 0 for Export Duty and VAT!
  const itemValueForeign = quantity * unitPrice;
  const itemValueKrw = Math.round(itemValueForeign * exchangeRate);

  // Additional costs in Foreign & KRW
  const freightKrw = Math.round(freightCost * exchangeRate);
  const insuranceKrw = Math.round(insuranceCost * exchangeRate);
  const additionalKrwCostsTotal = dangerousGoodsFee + inlandTruckingFee + customsBrokerFee + thcHandlingFee;
  const additionalForeignCostsTotal = freightCost + insuranceCost;

  // Total Export Costs
  const totalExportValueForeign = itemValueForeign + additionalForeignCostsTotal + (additionalKrwCostsTotal / exchangeRate);
  const totalExportValueKrw = itemValueKrw + freightKrw + insuranceKrw + additionalKrwCostsTotal;

  // Fixed 0% for Duty and VAT in Korea Export
  const exportTariffRate = 0.0;
  const exportTariffAmountKrw = 0;
  const exportVatRate = 0.0;
  const exportVatAmountKrw = 0;

  // Selected Country details
  const destCountryObj = COUNTRIES.find(c => c.code === importCountry) || {
    name: importCountry,
    flag: '🌐',
    currency: 'USD'
  };

  // UNIPASS CLIP Official Export Requirements Data
  const clipExportData = useMemo(() => {
    return getClipExportRequirements(selectedExportItem.hsCode, selectedExportItem.name);
  }, [selectedExportItem]);

  const [clipExportTab, setClipExportTab] = useState<'customs' | 'export_import' | 'integrated'>('customs');

  // Export Requirements String
  const exportRequirementsSummary = useMemo(() => {
    return clipExportData.summaryText;
  }, [clipExportData]);

  return (
    <div className="space-y-6">
      {/* 1. TOP METRIC CARDS (수출 부대비용 및 관·부가세 0원 명시) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 수출 물품가액 (Incoterms 연동) */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">수출 물품가액 ({incoterms})</span>
            <span className="p-1.5 bg-blue-50 text-blue-800 rounded-md">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-slate-900 tracking-tight">
              {currency} {itemValueForeign.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              ₩{itemValueKrw.toLocaleString()} 원 (환율: {exchangeRate.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Card 2: 수출 관세액 (0원 고정) */}
        <div className="bg-emerald-50/70 rounded-lg border border-emerald-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">수출 관세액 (Duty)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded">
              0.00% 면제
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-emerald-950 tracking-tight">
              ₩0 원
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              관세법상 대한민국 수출물품 관세 0원 (고정)
            </div>
          </div>
        </div>

        {/* Card 3: 수출 부가가치세 (0원 고정 영세율) */}
        <div className="bg-blue-50/70 rounded-lg border border-blue-200 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">수출 부가가치세 (VAT)</span>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded">
              영세율 0%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-blue-950 tracking-tight">
              ₩0 원
            </div>
            <div className="text-xs text-blue-700 font-semibold mt-1">
              부가가치세법 제21조 재화의 수출 영세율 적용
            </div>
          </div>
        </div>

        {/* Card 4: 총 수출 비용 및 부대비용 합계 */}
        <div className="bg-slate-900 text-white rounded-lg border border-slate-800 p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">총 수출금액 + 부대비용</span>
            <span className="p-1.5 bg-slate-800 text-amber-300 rounded-md">
              <Ship className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-white tracking-tight">
              ₩{totalExportValueKrw.toLocaleString()} 원
            </div>
            <div className="text-xs text-slate-300 mt-1">
              부대비용: ₩{(freightKrw + insuranceKrw + additionalKrwCostsTotal).toLocaleString()} 원 포함
            </div>
          </div>
        </div>
      </div>

      {/* 2. CALCULATION FORM & EXPORT ITEM SELECTION (4개 품목 한정) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>대한민국 수출 부대비용 산출 및 수출 요건 확인</span>
                <span className="text-[11px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">
                  양극재 3종 & 탄산리튬 4개 품목 전용
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                수출 관세 0% · 부가세 0%(영세율) 고정 적용 | HSK 2841.90 및 2836.91 수출 통관 시뮬레이션
              </p>
            </div>
          </div>

          {/* Quick Rates Refresh */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshRates}
              disabled={isRefreshingRates}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition"
              title="관세청 UNIPASS 환율 갱신"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span>UNIPASS 환율 ({appliedDateDisplay})</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* SECTION 1: 품목 선택 (오직 양극재 3종 + 탄산리튬만 노출 & 검색 지원) */}
          <div className="space-y-3.5 bg-slate-50/80 p-4 rounded-lg border border-slate-200">
            {/* Category Filter & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-600" />
                <span>[1. 수출 품목 선택 & 검색] (양극재 3종 · 탄산리튬 전용)</span>
                <span className="text-rose-500">*</span>
              </label>
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5">
                {[
                  { label: '전체 (All)', count: 4 },
                  { label: '양극재', count: 3 },
                  { label: '탄산리튬', count: 1 }
                ].map(cat => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleCategorySelect(cat.label)}
                    className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                      selectedCategory === cat.label
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      selectedCategory === cat.label
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 품명 검색 바 & 드롭다운 (수입 관/부가세 산출과 동일한 검색 UX) */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowItemDropdown(true);
                    }}
                    onFocus={() => setShowItemDropdown(true)}
                    placeholder="품명, 영문명, 세부 모델, HSK 검색 (예: NCA, NCM, NCA024-12B, CSG131-13AW, LNO, LI2CO3, 2841.90, 탄산리튬)"
                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 transition"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowItemDropdown(!showItemDropdown)}
                  className="px-3 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 flex items-center gap-1.5 transition shrink-0 shadow-xs"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  <span>품목 목록 드롭다운</span>
                </button>
              </div>

              {/* Autocomplete Dropdown List */}
              {showItemDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-300 shadow-2xl max-h-80 overflow-y-auto z-50 p-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 font-bold bg-slate-100 rounded mb-1">
                    <span>검색 결과 ({filteredExportItems.length}개 품목)</span>
                    <button 
                      onClick={() => setShowItemDropdown(false)}
                      className="text-slate-600 hover:text-slate-900 font-bold px-1.5 py-0.5 rounded hover:bg-slate-200"
                    >
                      닫기 ✕
                    </button>
                  </div>
                  {filteredExportItems.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      검색 조건에 맞는 수출 품목이 없습니다.
                    </div>
                  ) : (
                    filteredExportItems.map(item => {
                      const matchedModels = getMatchedSubModels(item, searchQuery);
                      const isSelected = selectedExportItem.hsCode === item.hsCode && selectedExportItem.name === item.name;
                      return (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded cursor-pointer transition flex flex-col gap-1.5 text-left ${
                            isSelected ? 'bg-blue-50/90 border border-blue-200' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div 
                            className="flex items-center justify-between gap-2"
                            onClick={() => handleSelectItem(item)}
                          >
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded font-mono">
                                {item.hsCode}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono text-slate-500">
                                기준단가: ${item.defaultUnitPriceUsd}/{item.unit}
                              </span>
                              {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                            </div>
                          </div>

                          {/* Sub-models pills in dropdown (Clicking model auto-selects both item and submodel) */}
                          {item.subModels && item.subModels.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-medium mr-1">세부 모델:</span>
                              {item.subModels.map(m => {
                                const isModelMatched = matchedModels.includes(m);
                                const isModelSelected = isSelected && selectedSubModel === m;
                                return (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectItem(item, m);
                                    }}
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold transition ${
                                      isModelSelected
                                        ? 'bg-blue-600 text-white'
                                        : isModelMatched
                                        ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 hover:bg-amber-200'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                  >
                                    {m}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Quick Item Cards for 1-Click Selection (Filtered by Category) */}
            <div className={`grid gap-2.5 ${
              filteredExportItems.length === 1 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : filteredExportItems.length === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {filteredExportItems.map((item) => {
                const isSelected = selectedExportItem.hsCode === item.hsCode && selectedExportItem.name === item.name;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 text-left rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.hsCode}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {item.category}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className={`text-xs font-bold mt-1.5 line-clamp-1 ${isSelected ? 'text-blue-950 font-black' : 'text-slate-800'}`}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono line-clamp-1">
                      규격: {item.subModels?.slice(0, 3).join(', ')}{item.subModels && item.subModels.length > 3 ? ` 외 ${item.subModels.length - 3}종` : ''}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Sub-Model Specific Specification Selector */}
            {selectedExportItem.subModels && selectedExportItem.subModels.length > 0 && (
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap">세부 모델 규격 선택:</span>
                  <select
                    value={selectedSubModel}
                    onChange={(e) => setSelectedSubModel(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  >
                    {selectedExportItem.subModels.map(model => (
                      <option key={model} value={model}>
                        {model} ({selectedExportItem.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>현재 선택된 품목 규격: <strong className="text-slate-900 font-mono">[{selectedExportItem.hsCode}] {selectedExportItem.name} — {selectedSubModel}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: 수출 기본 조건 (수출국, 수입국, 인코텀즈, 수량, 단가, 환율) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-200">
            {/* 1. 수출국 (한국 고정) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                [수출국] (Origin)
              </label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>🇰🇷 한국 (KR)</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">수출지</span>
              </div>
            </div>

            {/* 2. 수입국 (바이어 국가) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                [수입국] (Destination) <span className="text-rose-500">*</span>
              </label>
              <select
                value={importCountry}
                onChange={(e) => setImportCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COUNTRIES.filter(c => c.code !== 'KR').map(c => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Incoterms */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                [인코텀즈] (Incoterms 2020)
              </label>
              <select
                value={incoterms}
                onChange={(e) => setIncoterms(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FOB">FOB (본선인도조건)</option>
                <option value="CIF">CIF (운임보험료포함)</option>
                <option value="CFR">CFR (운임포함조건)</option>
                <option value="DAP">DAP (도착지인도조건)</option>
                <option value="DDP">DDP (관세지급반입인도조건)</option>
                <option value="FCA">FCA (운송인인도조건)</option>
                <option value="EXW">EXW (공장인도조건)</option>
              </select>
            </div>

            {/* 4. 수출 수량 */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                [수출수량] ({selectedExportItem.unit || 'KG'}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 5. 수출 단가 (USD) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                [수출단가] ({currency}) <span className="text-rose-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-l text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={currency}
                  onChange={(e) => {
                    const newCurr = e.target.value;
                    setCurrency(newCurr);
                    const newRate = exportRatesPool[newCurr]?.rateToKrw || INITIAL_EXPORT_EXCHANGE_RATES[newCurr]?.rateToKrw || 1356.88;
                    setExchangeRate(newRate);
                  }}
                  className="px-2 bg-slate-100 border border-l-0 border-slate-300 rounded-r text-xs font-bold text-slate-700"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="CNY">CNY (¥)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            {/* 6. 관세청 수출환율 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 block">
                  [수출적용환율] (KRW/{currency})
                </label>
                <div className="flex items-center gap-1.5">
                  <a
                    href={UNIPASS_PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="관세청 UNIPASS 메인화면 수출환율 공식 확인"
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 underline"
                  >
                    <span>UNIPASS</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {onRefreshRates && (
                    <button
                      type="button"
                      onClick={onRefreshRates}
                      disabled={isRefreshingRates}
                      title="유니패스 수출환율 갱신"
                      className="text-slate-400 hover:text-blue-600 p-0.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshingRates ? 'animate-spin text-blue-600' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {isEditingExchangeRate ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full border border-blue-400 rounded px-2.5 py-1.5 bg-white font-mono font-bold text-xs text-blue-900 outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleResetToUnipassExportRate}
                    className="px-2 py-1.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold whitespace-nowrap border border-slate-300"
                    title="유니패스 공시 수출환율로 복원"
                  >
                    UNIPASS 복원
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingExchangeRate(true)}
                  className="px-3 py-1.5 bg-emerald-50/80 border border-emerald-300 text-emerald-950 rounded font-mono font-bold flex justify-between items-center cursor-pointer hover:bg-emerald-100/70 transition"
                  title="클릭하여 직접 수출환율을 수정하거나 유니패스 수출환율을 확인할 수 있습니다."
                >
                  <span className="text-xs sm:text-sm font-bold">
                    ₩ {Number(exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans font-bold">
                      UNIPASS 수출환율
                    </span>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>{appliedDateDisplay} 관세청 수출환율 기준</span>
                <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setIsEditingExchangeRate(!isEditingExchangeRate)}>
                  {isEditingExchangeRate ? '완료' : '직접입력'}
                </span>
              </p>
            </div>
          </div>

          {/* DDP(관세지급반입인도조건) 특별 안내 배너 */}
          {incoterms === 'DDP' && (
            <div className="mt-3 p-3 bg-purple-50/90 border border-purple-300 rounded-lg text-xs text-purple-950 flex items-start gap-2.5">
              <span className="px-2 py-0.5 bg-purple-200 text-purple-900 rounded font-bold text-[10px] shrink-0 mt-0.5">
                DDP 조건 (매도인 최대의무)
              </span>
              <div className="space-y-0.5">
                <p className="font-bold">DDP (관세지급반입인도조건, Delivered Duty Paid)</p>
                <p className="text-purple-800 leading-relaxed text-[11px]">
                  매도인(한국 수출자)이 수입국 지정목적지까지 물품을 운송하여 <strong>수입통관을 수행하고 수입국 관세 및 제세공과금(부가가치세 등)을 완납한 상태</strong>로 인도하는 조건입니다. 
                  (국내 관세청 수출신고 기준 한국 관세·부가세는 0원 영세율이며, 국제운임, 적하보험료 및 수입국 관세가 매도인의 수출 견적 원가에 포함됩니다.)
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: 수출 부대비용 세부 산출 (운임, 보험료, 위험물 검사, 내륙운송, 통관수수료, THC) */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>[2. 수출 부대비용 산출] (Export Incidental Logistics & Inspection Costs)</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">
                부대비용 합계: <strong className="text-emerald-700">₩{(freightKrw + insuranceKrw + additionalKrwCostsTotal).toLocaleString()} 원</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. 해상/항공 운임 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">국제 운임 (Ocean/Air Freight)</span>
                  <span className="text-[10px] text-slate-500">USD</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={freightCost}
                  onChange={(e) => setFreightCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">환산: ₩{freightKrw.toLocaleString()} 원</p>
              </div>

              {/* 2. 적하보험료 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">해상 적하보험료 (Marine Insurance)</span>
                  <span className="text-[10px] text-slate-500">USD</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">환산: ₩{insuranceKrw.toLocaleString()} 원</p>
              </div>

              {/* 3. 위험물 포장 및 검사료 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">위험물용기 검사료 (KOMDI/KR)</span>
                  <span className="text-[10px] text-slate-500">KRW</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={dangerousGoodsFee}
                  onChange={(e) => setDangerousGoodsFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">한국해사위험물검사원 포장증명</p>
              </div>

              {/* 4. 국내 내륙운송료 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">공장 ➔ 부산/인천항 내륙운송료</span>
                  <span className="text-[10px] text-slate-500">KRW</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={inlandTruckingFee}
                  onChange={(e) => setInlandTruckingFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">트레일러/컨테이너 운송비</p>
              </div>

              {/* 5. 관세사 수출통관 & C/O 발급 수수료 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">수출통관 및 C/O 발급수수료</span>
                  <span className="text-[10px] text-slate-500">KRW</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={customsBrokerFee}
                  onChange={(e) => setCustomsBrokerFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">관세사 수출신고 대행료</p>
              </div>

              {/* 6. 터미널 THC & 포워더 핸들링 */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">항만 THC & 포워더 수수료</span>
                  <span className="text-[10px] text-slate-500">KRW</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={thcHandlingFee}
                  onChange={(e) => setThcHandlingFee(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 font-mono"
                />
                <p className="text-[10px] text-slate-500">Terminal Handling Charge</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MANDATORY 10-FIELD ESSENTIAL DATA TABLE & REGULATIONS (수출 전용) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <span>수출 필수 데이터 명세표 (Mandatory 10-Field Export Specification Table)</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              [품명][HS CODE][수출국][수입국][관세율: 0%][관세: 0원][부가가치세: 0원][총금액][환율][수출시 요건사항]
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('essential_table')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                activeSubTab === 'essential_table' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              10개 필수 필드 표
            </button>
            <button
              onClick={() => setActiveSubTab('export_regulations')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                activeSubTab === 'export_regulations' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              수출 요건 & 법령
            </button>
            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                activeSubTab === 'checklist' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              수출 체크리스트
            </button>
          </div>
        </div>

        {/* TAB 1: 10-Field Table */}
        {activeSubTab === 'essential_table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase">
                <tr>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[1. 품명]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[2. HS CODE]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[3. 수출국]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[4. 수입국]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap bg-emerald-50 text-emerald-900">[5. 관세율]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap bg-emerald-50 text-emerald-900">[6. 관세(원)]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap bg-blue-50 text-blue-900">[7. 부가가치세(원)]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap bg-slate-900 text-white">[8. 총금액(원)]</th>
                  <th className="p-3 border-r border-slate-200 text-center whitespace-nowrap">[9. 환율]</th>
                  <th className="p-3 text-left whitespace-nowrap">[10. 수출시 요건사항]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-blue-50/40 transition">
                  {/* 1. 품명 */}
                  <td className="p-3 border-r border-slate-200 font-bold">
                    <p className="text-blue-950 font-black">{selectedExportItem.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">규격: {selectedSubModel} · 조건: <span className="font-bold text-blue-700">{incoterms}</span></p>
                  </td>

                  {/* 2. HS CODE */}
                  <td className="p-3 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                    {selectedExportItem.hsCode}
                  </td>

                  {/* 3. 수출국 */}
                  <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap font-bold">
                    🇰🇷 한국 (KR)
                  </td>

                  {/* 4. 수입국 */}
                  <td className="p-3 border-r border-slate-200 text-center whitespace-nowrap font-bold">
                    {destCountryObj.flag} {destCountryObj.name}
                  </td>

                  {/* 5. 관세율 (0%) */}
                  <td className="p-3 border-r border-slate-200 text-center bg-emerald-50/50 font-bold text-emerald-800">
                    0.00%
                    <span className="block text-[9px] text-emerald-600 font-normal">수출관세 면제</span>
                  </td>

                  {/* 6. 관세 (0원) */}
                  <td className="p-3 border-r border-slate-200 text-right bg-emerald-50/50 font-mono font-bold text-emerald-900">
                    ₩0
                  </td>

                  {/* 7. 부가가치세 (0원) */}
                  <td className="p-3 border-r border-slate-200 text-right bg-blue-50/50 font-mono font-bold text-blue-900">
                    ₩0
                    <span className="block text-[9px] text-blue-600 font-normal">영세율 0%</span>
                  </td>

                  {/* 8. 총금액 (물품대 + 부대비용) */}
                  <td className="p-3 border-r border-slate-200 text-right font-mono font-black text-slate-950 bg-slate-50">
                    ₩{totalExportValueKrw.toLocaleString()}
                    <span className="block text-[10px] text-slate-500 font-normal font-sans">
                      ({currency} {totalExportValueForeign.toLocaleString('en-US', { maximumFractionDigits: 1 })})
                    </span>
                  </td>

                  {/* 9. 환율 */}
                  <td className="p-3 border-r border-slate-200 text-center font-mono">
                    <span className="font-bold text-slate-900 block">
                      ₩{Number(exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans font-semibold px-1 py-0.2 rounded mt-0.5">
                      UNIPASS 수출환율
                    </span>
                  </td>

                  {/* 10. 수출시 요건사항 */}
                  <td className="p-3 text-slate-700 text-xs leading-relaxed max-w-xs">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black inline-flex items-center gap-1 ${
                        clipExportData.hasExportRequirements 
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{clipExportData.summaryText}</span>
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-[11px]">
                      관세청 CLIP: 세관장확인 · 수출입공고 · 통합공고 요건 없음
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      대외무역법상 자유수출 품목 / 일반 수출신고 수리 후 30일 이내 적재
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* [10. 수출시 요건사항 - 관세청 CLIP 법령정보포털 실시간 조회 전용 패널] */}
            <div className="bg-white px-5 py-4 border-t border-slate-200 text-xs text-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>[10. 수출시 요건사항] — 관세청 법령정보포털 CLIP 조회결과</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
                    {clipExportData.summaryText}
                  </span>
                </div>
                
                <a
                  href={clipExportData.clipSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 transition shrink-0"
                >
                  <span>관세청 CLIP 원문 조회</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* UNIPASS CLIP Portal Exact Structure */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/40">
                <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-950 font-bold">· 수출</span>
                    <span className="text-slate-500 font-normal">| HSK {selectedExportItem.hsCode} ({selectedExportItem.name})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    출처: 관세청 법령정보포털 (https://unipass.customs.go.kr/clip/index.do)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* Left Column Vertical Tabs */}
                  <div className="bg-slate-50/80 p-2 space-y-1">
                    {[
                      { id: 'customs', label: '세관장확인', count: clipExportData.customsVerifications.length },
                      { id: 'export_import', label: '수출입공고', count: clipExportData.exportImportNotices.length },
                      { id: 'integrated', label: '통합공고', count: clipExportData.integratedNotices.length }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setClipExportTab(t.id as any)}
                        className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition flex items-center justify-between ${
                          clipExportTab === t.id
                            ? 'bg-blue-900 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{t.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          clipExportTab === t.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Right Content Panel (Matches CLIP's "조회결과가 존재하지 않습니다.") */}
                  <div className="md:col-span-3 p-6 bg-white min-h-[110px] flex flex-col items-center justify-center text-center">
                    {clipExportTab === 'customs' && (
                      clipExportData.customsVerifications.length === 0 ? (
                        <div>
                          <p className="text-sm font-bold text-slate-700">조회결과가 존재하지 않습니다.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            (관세법 제226조 세관장확인대상물품 및 확인방법 지정고시 상 수출 확인 대상 품목이 아닙니다 — <strong>수출요건 없음</strong>)
                          </p>
                        </div>
                      ) : (
                        <div className="w-full text-left space-y-2">
                          {clipExportData.customsVerifications.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                              <p className="font-bold text-slate-900">{item.lawName} ({item.authority})</p>
                              <p className="text-xs text-slate-600 mt-1">{item.requirementDetail}</p>
                            </div>
                          ))}
                        </div>
                      )
                    )}

                    {clipExportTab === 'export_import' && (
                      clipExportData.exportImportNotices.length === 0 ? (
                        <div>
                          <p className="text-sm font-bold text-slate-700">조회결과가 존재하지 않습니다.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            (대외무역법 제11조에 따른 수출제한 및 수출승인 대상이 아닙니다 — <strong>수출요건 없음</strong> / 자동승인)
                          </p>
                        </div>
                      ) : (
                        <div className="w-full text-left space-y-2">
                          {clipExportData.exportImportNotices.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                              <p className="font-bold text-slate-900">{item.authority}</p>
                              <p className="text-xs text-slate-600 mt-1">{item.content}</p>
                            </div>
                          ))}
                        </div>
                      )
                    )}

                    {clipExportTab === 'integrated' && (
                      clipExportData.integratedNotices.length === 0 ? (
                        <div>
                          <p className="text-sm font-bold text-slate-700">조회결과가 존재하지 않습니다.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            (대외무역법 제12조에 따른 통합공고 상 개별법령에 따른 수출 요건 대상이 아닙니다 — <strong>수출요건 없음</strong>)
                          </p>
                        </div>
                      ) : (
                        <div className="w-full text-left space-y-2">
                          {clipExportData.integratedNotices.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                              <p className="font-bold text-slate-900">{item.lawName} ({item.authority})</p>
                              <p className="text-xs text-slate-600 mt-1">{item.requirements}</p>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Clearance Note */}
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50/70 rounded-md border border-emerald-200 text-[11px] text-emerald-950 font-medium">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>수출 통관 결과:</strong> {clipExportData.clearanceNote}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 수출 요건 및 관련 법령 */}
        {activeSubTab === 'export_regulations' && (
          <div className="p-6 space-y-4">
            {/* UNIPASS CLIP Official Result Box */}
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950 text-sm">
                    관세청 CLIP 수출 요건 판정: <strong className="text-emerald-800">{clipExportData.summaryText}</strong>
                  </span>
                </div>
                <a
                  href={clipExportData.clipSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-900 underline flex items-center gap-1"
                >
                  CLIP 공식 확인 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                현재 품목 <strong>[{selectedExportItem.hsCode}] {selectedExportItem.name}</strong>은 관세청 법령정보포털 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 제한이나 별도의 사전 요건확인이 없는 <strong>수출요건 없음</strong> 품목입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>1. 전략물자 판정 및 통제 심사 (대외무역법 제19조)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  현재 품목 <strong>[{selectedExportItem.hsCode}] {selectedExportItem.name}</strong>은 일반 수출요건은 없으나, 전략물자관리원(KOSTI) YesTrade 시스템을 통한 사전 판정서(전문판정/자가판정) 구비를 권장하며 우려거래처 수출 시 상황허가가 필요합니다.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>2. FTA 원산지증명서(C/O) & 인증수출자 발급</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  원산지결정기준: <strong>{selectedExportItem.originCriteria.psrCode}</strong> ({selectedExportItem.originCriteria.psrDescription})<br />
                  발급방식: <strong>{selectedExportItem.originCriteria.originDocumentType}</strong><br />
                  원산지포괄확인서, 제조공정도, BOM(원자재내역서) 증빙자료를 5년간 보관해야 합니다.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
              <strong>⚠️ 선적 및 적재 이행 기간:</strong> 관세청 UNIPASS를 통해 수출신고가 수리된 날로부터 <strong>30일 이내</strong>에 운송수단(선박 또는 항공기)에 적재되어야 하며, 기한 내 미적재 시 관세법에 따라 과태료가 부과됩니다.
            </div>
          </div>
        )}

        {/* TAB 3: 수출 체크리스트 */}
        {activeSubTab === 'checklist' && (
          <div className="p-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">
              선택 품목 [{selectedExportItem.hsCode}] {selectedSubModel} 수출 실무 체크리스트
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { title: '1. 전략물자(YesTrade) 판정 유효 여부 확인', note: 'KOSTI 전문판정서(유효기간 2년) 구비 여부 점검' },
                { title: '2. 영문 GHS MSDS 및 시험성적서(COA) 동봉', note: '수입국 바이어 세관 제출용 위험물 분류 및 성분비 명시' },
                { title: '3. 위험물 용기검사증(KOMDI) 및 해상 선적 예약', note: '양극재/화학물질 적재용 공인 UN인증 용기 사용 확인' },
                { title: '4. FTA 원산지소명서 및 C/O 발급 번호 기재', note: '원산지인증수출자 번호 및 서명권자 등록 확인' },
                { title: '5. 관세청 UNIPASS 수출신고필증 교부 및 선적', note: '수리 후 30일 이내 선적 완료 및 B/L 수취' },
                { title: '6. 수출용 원재료 관세환급(Drawback) 신청', note: '수출신고 수리일로부터 2년 이내 환급 신청' }
              ].map((c, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-[11px] text-slate-500">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
