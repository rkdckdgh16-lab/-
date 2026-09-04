import React, { useState, useMemo } from 'react';
import { CalculationInput, TradeItem, ExchangeRateData, CalculationResult } from '../types';
import { TRADE_ITEMS_DATABASE } from '../data/tradeData';
import { COUNTRIES, INITIAL_EXCHANGE_RATES, UNIPASS_PORTAL_URL } from '../data/exchangeRates';
import { checkItemApprovalStatus } from '../data/registeredApprovalData';
import { ClipCommoditySearchModal } from './ClipCommoditySearchModal';
import { 
  searchClipCommodities, 
  convertClipCommodityToTradeItem, 
  ClipCommodity 
} from '../data/clipCommodities';
import { CLIP_PORTAL_URL } from '../data/clipTariffData';
import { 
  Calculator, 
  Search, 
  Layers, 
  ArrowRightLeft, 
  CheckCircle2, 
  Sparkles,
  Info,
  Tag,
  Check,
  Filter,
  ExternalLink,
  RefreshCw,
  XCircle,
  ShieldAlert,
  FileCheck,
  ArrowDownToLine,
  BookOpen
} from 'lucide-react';

interface CalculationFormProps {
  input: CalculationInput;
  onChangeInput: (newInput: CalculationInput, item?: TradeItem) => void;
  selectedItem?: TradeItem;
  result?: CalculationResult;
  onSaveToCloud: () => void;
  isSaving: boolean;
  currentRates?: Record<string, ExchangeRateData>;
  appliedDateDisplay?: string;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
}

export const CalculationForm: React.FC<CalculationFormProps> = ({
  input,
  onChangeInput,
  selectedItem,
  result,
  onSaveToCloud,
  isSaving,
  currentRates = INITIAL_EXCHANGE_RATES,
  appliedDateDisplay = '2026년 8월 31일',
  onRefreshRates,
  isRefreshingRates = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('양극재');
  const [customTariffEnabled, setCustomTariffEnabled] = useState(false);
  const [isEditingExchangeRate, setIsEditingExchangeRate] = useState(false);

  // 관세법령정보포털 CLIP 세번·상품검색 모달 및 퀵 검색 상태
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [clipModalInitialQuery, setClipModalInitialQuery] = useState('');
  const [clipQuickSearch, setClipQuickSearch] = useState('');
  const [pulledClipNotice, setPulledClipNotice] = useState<string | null>(null);

  // 2026년 수입 요건승인 등록 여부 실시간 확인
  const liveApproval = useMemo(() => {
    return checkItemApprovalStatus(input.itemName, input.hsCode);
  }, [input.itemName, input.hsCode]);

  const categories = [
    '전체 (All)',
    '양극재',
    '전구체',
    '첨가제',
    '리튬',
    '기타'
  ];

  const getMatchedSubModels = (item: TradeItem, query: string): string[] => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || !item.subModels) return [];
    const normalized = trimmed.replace(/[\s-_/]/g, '');
    return item.subModels.filter(m => {
      const mLower = m.toLowerCase();
      const mNorm = mLower.replace(/[\s-_/]/g, '');
      return mLower.includes(trimmed) || (normalized.length >= 2 && mNorm.includes(normalized));
    });
  };

  const filteredItems = TRADE_ITEMS_DATABASE.filter(item => {
    const query = searchQuery.trim().toLowerCase();
    const queryNormalized = query.replace(/[\s-_/]/g, '');

    if (!query) {
      if (selectedCategory === '전체 (All)') return true;
      return item.category === selectedCategory;
    }

    const matchCategory = selectedCategory === '전체 (All)' || item.category === selectedCategory;

    const matchBasic = 
      item.name.toLowerCase().includes(query) ||
      item.hsCode.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query) ||
      item.hsDescription.toLowerCase().includes(query);

    const matchedSubModels = getMatchedSubModels(item, searchQuery);
    const matchSubModel = matchedSubModels.length > 0;

    // 세부 모델 검색 시에는 카테고리 필터와 상관없이 즉시 검색되거나 현재 카테고리 내에서 우선 일치
    if (matchSubModel) {
      return true;
    }

    return matchCategory && matchBasic;
  });

  // CLIP 포털 데이터베이스 실시간 연계 검색 (필터에 없는 품목 탐색)
  const clipSearchResults = useMemo(() => {
    const query = searchQuery.trim();
    if (!query || query.length < 2) return [];
    return searchClipCommodities(query).slice(0, 6);
  }, [searchQuery]);

  const handleSelectItem = (item: TradeItem) => {
    const defaultCurrency = 'USD';
    const rate = currentRates[defaultCurrency]?.rateToKrw || 1382.44;

    onChangeInput({
      ...input,
      itemId: item.id,
      itemName: item.name,
      hsCode: item.hsCode,
      unitPrice: item.defaultUnitPriceUsd,
      currency: defaultCurrency,
      exchangeRate: rate,
      customTariffRate: undefined
    }, item);

    setCustomTariffEnabled(false);
    setShowItemDropdown(false);
    setSearchQuery('');
  };

  // CLIP 세번·상품검색에서 품목을 견적기로 끌고오기
  const handleSelectClipCommodity = (tradeItem: TradeItem, commodity: ClipCommodity) => {
    const defaultCurrency = input.currency || 'USD';
    const rate = currentRates[defaultCurrency]?.rateToKrw || 1382.44;

    onChangeInput({
      ...input,
      itemId: tradeItem.id,
      itemName: tradeItem.name,
      hsCode: tradeItem.hsCode,
      unitPrice: tradeItem.defaultUnitPriceUsd > 0 ? tradeItem.defaultUnitPriceUsd : (input.unitPrice || 100),
      currency: defaultCurrency,
      exchangeRate: rate,
      customTariffRate: undefined // 관세율은 관세청 법정 공식 우선순위(기본/WTO/FTA)로 자동 산출
    }, tradeItem);

    setCustomTariffEnabled(false);
    setShowItemDropdown(false);
    setSearchQuery('');
    setClipQuickSearch('');
    setPulledClipNotice(`관세법령정보포털(CLIP)에서 [HS ${commodity.hsCode}] '${commodity.nameKr}' 품목을 견적기에 끌고왔습니다. 법정 공시세율(기본 ${commodity.baseRate}%, WTO ${commodity.wtoRate}%, 한-중 FTA ${commodity.ftaRates.CN?.rate ?? 0}%)이 자동 적용되었습니다.`);
    setTimeout(() => setPulledClipNotice(null), 8000);
  };

  const handleOpenClipSearch = (query?: string) => {
    setClipModalInitialQuery(query || clipQuickSearch || searchQuery || input.itemName || input.hsCode || '');
    setIsClipModalOpen(true);
  };

  const handleCurrencyChange = (curr: string) => {
    const newRate = currentRates[curr]?.rateToKrw || 1382.44;
    onChangeInput({
      ...input,
      currency: curr,
      exchangeRate: newRate
    }, selectedItem);
  };

  const handleResetToUnipassRate = () => {
    const defaultRate = currentRates[input.currency]?.rateToKrw || 1382.44;
    onChangeInput({
      ...input,
      exchangeRate: defaultRate
    }, selectedItem);
    setIsEditingExchangeRate(false);
  };

  const handleSwapCountries = () => {
    onChangeInput({
      ...input,
      exportCountry: input.importCountry,
      importCountry: input.exportCountry
    }, selectedItem);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>수입 관/부가세 견적내기</span>
            </h2>
            <p className="text-xs text-slate-500">
              품명을 필터로 선택하거나 직접 기입하여 관세율, 관세, 부가세, 수입요건을 실시간 산출합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded transition shadow-xs disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSaving ? '저장 중...' : '계산내역 저장'}</span>
          </button>
        </div>
      </div>

      {/* 🔔 CLIP 세번/상품 끌고오기 성공 알림 배너 */}
      {pulledClipNotice && (
        <div className="mb-4 p-3.5 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-emerald-900">관세법령정보포털 CLIP 세번·상품 적용 완료</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">{pulledClipNotice}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setPulledClipNotice(null)}
            className="p-1 rounded hover:bg-emerald-100 text-emerald-700 hover:text-emerald-950 text-xs font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* 🏛️ 관세청 관세법령정보포털(CLIP) 공식 세번·상품검색 연동 배너 (이미지 디자인 구현) */}
      <div className="mb-5 bg-gradient-to-r from-[#14376c] via-[#1b4382] to-[#1e3a6c] text-white p-4 sm:p-4.5 rounded-xl shadow-sm border border-blue-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-200 border border-white/20 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">
                  관세청 관세법령정보포털 (CLIP) 연동
                </span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded font-bold">
                  실시간 세번·상품조회
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                필터에 미등록된 품목은 CLIP 세번/상품검색으로 조회하여 견적기에 즉시 끌고올 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenClipSearch(clipQuickSearch || searchQuery)}
              className="px-3.5 py-1.5 text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition shadow-xs active:scale-98"
            >
              <Search className="w-3.5 h-3.5" />
              <span>세번·상품검색 팝업</span>
            </button>
            <a
              href={CLIP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 flex items-center gap-1 transition"
              title="관세청 CLIP 포털 새창으로 열기"
            >
              <span>상세검색</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
          </div>
        </div>

        {/* Search Bar matching image: [세번·상품검색] [  입력창  ] [🔍 검색] */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-xs font-extrabold text-[#1b4382] bg-blue-100/90 px-2 py-0.5 rounded">
                세번·상품검색
              </span>
            </div>
            <input
              type="text"
              value={clipQuickSearch}
              onChange={(e) => setClipQuickSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOpenClipSearch(clipQuickSearch);
                }
              }}
              placeholder="HS CODE(예: 8542, 8507, 2204) 또는 품명(반도체, 스마트폰, 와인, 커피 등)"
              className="w-full pl-28 pr-9 py-2 text-xs sm:text-sm font-medium bg-white text-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-emerald-400 border border-blue-300"
            />
            {clipQuickSearch && (
              <button
                type="button"
                onClick={() => setClipQuickSearch('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleOpenClipSearch(clipQuickSearch)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shrink-0 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>조회 후 끌고오기</span>
          </button>
        </div>

        {/* Quick Service Links Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-[11px] text-blue-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold">품목분류 빠른 서비스:</span>
            <button 
              type="button" 
              onClick={() => handleOpenClipSearch('8542')}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/25 rounded text-white border border-white/10 transition"
            >
              반도체(8542)
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenClipSearch('8507')}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/25 rounded text-white border border-white/10 transition"
            >
              배터리(8507)
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenClipSearch('2204')}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/25 rounded text-white border border-white/10 transition"
            >
              와인(2204)
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenClipSearch('3304')}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/25 rounded text-white border border-white/10 transition"
            >
              화장품(3304)
            </button>
            <button 
              type="button" 
              onClick={() => handleOpenClipSearch('8479')}
              className="px-2 py-0.5 bg-white/10 hover:bg-white/25 rounded text-white border border-white/10 transition"
            >
              제조설비(8479)
            </button>
          </div>

          <span className="text-[10px] text-blue-300">
            * 관세청 공식 관세율표(기본/WTO/FTA) 및 통관요건 자동 연동
          </span>
        </div>
      </div>

      {/* 🎯 대표 품명 필터 & 빠른 선택 섹션 */}
      <div className="mb-6 bg-slate-50/90 p-4 rounded-lg border border-slate-200">
        {/* Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-blue-700" />
            <span>품목 필터 분류:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 대표 품명 칩 그리드 (빠른 원클릭 선택) */}
        <div className="mb-3.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-blue-600" />
              <span>대표 품명 바로가기 (클릭 시 자동 적용):</span>
            </span>
            <span className="text-[10px] text-blue-700 font-semibold">
              현재 표시: {filteredItems.length}개 품목
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-white rounded border border-slate-200">
            {filteredItems.map(item => {
              const isActive = input.itemId === item.id || input.itemName === item.name;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className={`text-left p-2 rounded transition flex flex-col justify-between border ${
                    isActive
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-blue-950' : 'text-slate-800'}`}>
                      {item.name}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />}
                  </div>
                  <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100/80 text-[10px]">
                    <span className="font-mono font-semibold text-blue-700">{item.hsCode}</span>
                    <span className="text-slate-500 font-medium">${item.defaultUnitPriceUsd.toLocaleString()}/{item.unit}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 품명 드롭다운 검색 & 직접 필터 바 */}
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
                placeholder="품명 또는 세부 모델 검색 (예: NCA024-12B, 반도체, 스마트폰, 와인, 8542, 2841.90)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="button"
              onClick={() => setShowItemDropdown(!showItemDropdown)}
              className="px-3 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 flex items-center gap-1 transition shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>전체 목록 드롭다운</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenClipSearch(searchQuery)}
              className="px-3 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded flex items-center gap-1.5 transition shrink-0 shadow-xs"
              title="관세청 CLIP 포털 세번/상품 검색창 열기"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>CLIP 세번조회</span>
            </button>
          </div>

          {/* Preset dropdown list */}
          {showItemDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-slate-300 shadow-2xl max-h-96 overflow-y-auto z-50 p-2 divide-y divide-slate-100">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-700 font-bold bg-slate-100 rounded mb-1">
                <span>필터 등록 품목 ({filteredItems.length}개)</span>
                <button 
                  onClick={() => setShowItemDropdown(false)}
                  className="text-slate-600 hover:text-slate-900 font-bold px-1.5 py-0.5 rounded hover:bg-slate-200"
                >
                  닫기 ✕
                </button>
              </div>

              {/* Local Database Items */}
              {filteredItems.map(item => {
                const matchedModels = getMatchedSubModels(item, searchQuery);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-2.5 rounded cursor-pointer transition flex items-center justify-between gap-3 text-left ${
                      input.itemId === item.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{item.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded">
                          {item.category}
                        </span>
                        {matchedModels.length > 0 && (
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded border border-emerald-200 flex items-center gap-1">
                            <span>🔍 모델 매칭: {matchedModels.slice(0, 3).join(', ')}{matchedModels.length > 3 ? ` 외 ${matchedModels.length - 3}건` : ''}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.hsDescription}</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.hsCode}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">단가: ${item.defaultUnitPriceUsd.toLocaleString()}/{item.unit}</p>
                    </div>
                  </div>
                );
              })}

              {/* CLIP 연동 실시간 검색 결과 (필터에 없거나 추가 매칭되는 CLIP 상품들) */}
              {clipSearchResults.length > 0 && (
                <div className="pt-2 pb-1 bg-blue-50/50 rounded-lg my-1.5 p-2 border border-blue-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>관세청 CLIP 포털 세번/상품 연동 결과 ({clipSearchResults.length}건)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenClipSearch(searchQuery)}
                      className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <span>모달에서 전체보기</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {clipSearchResults.map(c => (
                      <div
                        key={`clip-${c.hsCode}`}
                        onClick={() => handleSelectClipCommodity(convertClipCommodityToTradeItem(c), c)}
                        className="p-2 rounded bg-white hover:bg-blue-100/70 border border-blue-200 cursor-pointer transition flex items-center justify-between gap-2 text-left shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-extrabold text-blue-900 bg-blue-100 px-1.5 py-0.2 rounded">
                              {c.hsCode}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{c.nameKr}</span>
                            <span className="text-[10px] text-slate-500">({c.category})</span>
                          </div>
                          <p className="text-[10px] text-slate-600 truncate mt-0.5">{c.hsDescription}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="text-slate-600">기본: <strong className="text-slate-900 font-mono">{c.baseRate}%</strong></span>
                            <span className="text-emerald-700">WTO: <strong className="font-mono">{c.wtoRate}%</strong></span>
                            <span className="text-indigo-700">FTA: <strong className="font-mono">{c.ftaRates.CN?.rate ?? 0}%</strong></span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectClipCommodity(convertClipCommodityToTradeItem(c), c);
                          }}
                          className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-2xs"
                        >
                          <ArrowDownToLine className="w-3 h-3 text-blue-200" />
                          <span>끌고오기</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state & prompt to search in CLIP */}
              {filteredItems.length === 0 && clipSearchResults.length === 0 && (
                <div className="p-5 text-center space-y-2 bg-slate-50 rounded-lg my-1">
                  <p className="text-xs font-bold text-slate-800">
                    기본 필터에 등록되지 않은 품목입니다.
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-md mx-auto">
                    관세법령정보포털 CLIP(https://unipass.customs.go.kr/clip/index.do)의 세번/상품 검색을 통해 관세율표와 수입요건을 실시간 조회하여 견적기에 끌고올 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenClipSearch(searchQuery)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Search className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CLIP 세번·상품검색에서 '{searchQuery}' 찾아 끌고오기</span>
                  </button>
                </div>
              )}

              {/* Bottom CLIP shortcut link */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>원하는 품목이 목록에 없으면 CLIP 포털에서 즉시 검색 가능</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenClipSearch(searchQuery)}
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-blue-300 hover:bg-blue-50 transition shadow-2xs"
                >
                  <Search className="w-3 h-3 text-blue-700" />
                  <span>CLIP 세번·상품검색 열기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Fields Grid - Professional Polish Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. [품명] */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              [품명] (Product Description) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenClipSearch(input.itemName)}
                className="text-[10px] text-blue-800 hover:text-blue-950 font-bold bg-blue-50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200 flex items-center gap-0.5 transition"
                title="CLIP 세번·상품검색에서 품목 찾기"
              >
                <Search className="w-2.5 h-2.5 text-blue-700" />
                <span>CLIP 검색</span>
              </button>
              {input.itemName && (
                liveApproval.isRegistered ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>26년 요건등록됨</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    미등록
                  </span>
                )
              )}
            </div>
          </div>
          <input
            type="text"
            value={input.itemName}
            onChange={(e) => {
              const newName = e.target.value;
              const matchingItem = TRADE_ITEMS_DATABASE.find(t => t.name.toLowerCase() === newName.toLowerCase());
              onChangeInput({ ...input, itemName: newName }, matchingItem || selectedItem);
            }}
            placeholder="품목명 입력 또는 상단 필터/CLIP에서 검색"
            className="w-full border border-slate-300 rounded px-3.5 py-2 bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-xs sm:text-sm text-slate-900 transition"
          />
          {input.itemName && liveApproval.isRegistered && (
            <div className="mt-1 text-[11px] text-emerald-900 bg-emerald-50 p-2 rounded border border-emerald-200 space-y-1">
              {liveApproval.approvalData && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[10px] text-emerald-700">2026년 요건승인번호:</span>
                    <span className="font-mono font-bold text-emerald-950 text-[11px]">{liveApproval.approvalData.approvalNumber}</span>
                  </div>
                  <div className="pt-1 border-t border-emerald-200/60 text-[10px] text-emerald-800 space-y-0.5">
                    {liveApproval.approvalData.hazardousSubstance.split(',').map((sub, idx) => (
                      <div key={idx} className="font-medium">
                        • {sub.trim()}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {liveApproval.bmChemicalSpecData && (
                <div className={`text-[10px] text-indigo-900 bg-indigo-50/80 p-1.5 rounded border border-indigo-200 ${liveApproval.approvalData ? 'mt-1' : ''}`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-indigo-800">BM 화학물질명세:</span>
                    <span className="font-mono text-indigo-950">NO. {liveApproval.bmChemicalSpecData.no}</span>
                  </div>
                  <div className="text-[10px] text-indigo-800 mt-0.5">
                    <span>{liveApproval.bmChemicalSpecData.productName}</span>
                    {liveApproval.bmChemicalSpecData.modelSpec && (
                      <span className="text-slate-600 block text-[9px] font-mono">
                        규격: {liveApproval.bmChemicalSpecData.modelSpec}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. [HS CODE] */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              [HS CODE] <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => handleOpenClipSearch(input.hsCode || input.itemName)}
              className="text-[10px] text-blue-800 hover:text-blue-950 font-bold bg-blue-50 hover:bg-blue-100 px-1.5 py-0.2 rounded border border-blue-200 flex items-center gap-0.5 transition"
              title="CLIP 관세율표에서 세번 조회"
            >
              <Search className="w-2.5 h-2.5 text-blue-700" />
              <span>CLIP 세번조회</span>
            </button>
          </div>
          <input
            type="text"
            value={input.hsCode}
            onChange={(e) => {
              const newHs = e.target.value;
              const matchingItem = TRADE_ITEMS_DATABASE.find(t => t.hsCode === newHs);
              onChangeInput({ ...input, hsCode: newHs }, matchingItem || (selectedItem && selectedItem.hsCode === newHs ? selectedItem : undefined));
            }}
            placeholder="예: 8517.13-0000, 2842.31-1000, 8542.31-1000"
            className="w-full border border-slate-300 rounded px-3.5 py-2 font-mono text-blue-700 bg-blue-50 outline-none font-bold text-xs sm:text-sm transition focus:bg-white"
          />
        </div>

        {/* 3. [수출국] & [수입국] */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">
              [수출국] 및 [수입국] (Trade Route) <span className="text-rose-500">*</span>
            </span>
            <button
              type="button"
              onClick={handleSwapCountries}
              className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 font-bold"
            >
              <ArrowRightLeft className="w-3 h-3" /> 국가 교환
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* 수출국 */}
            <select
              value={input.exportCountry}
              onChange={(e) => onChangeInput({ ...input, exportCountry: e.target.value }, selectedItem)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-slate-50 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              {COUNTRIES.map(c => (
                <option key={`exp-${c.code}`} value={c.code}>
                  {c.flag} {c.name} ({c.code}) [수출]
                </option>
              ))}
            </select>

            {/* 수입국 */}
            <select
              value={input.importCountry}
              onChange={(e) => onChangeInput({ ...input, importCountry: e.target.value }, selectedItem)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-blue-50/50 font-bold text-xs sm:text-sm text-blue-950 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            >
              {COUNTRIES.map(c => (
                <option key={`imp-${c.code}`} value={c.code}>
                  {c.flag} {c.name} ({c.code}) [수입]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. 수량 & 단가 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            수량 (Quantity)
          </label>
          <input
            type="number"
            min="0"
            value={input.quantity === 0 ? '' : input.quantity}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : Number(e.target.value);
              onChangeInput({ ...input, quantity: isNaN(val) ? 0 : Math.max(0, val) }, selectedItem);
            }}
            placeholder="수량 입력"
            className="w-full border border-slate-300 rounded px-3.5 py-2 bg-slate-50 font-medium text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex justify-between">
            <span>단가 (Unit Price)</span>
            <span className="text-[10px] text-slate-400">{input.currency}</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={input.unitPrice === 0 ? '' : input.unitPrice}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : Number(e.target.value);
              onChangeInput({ ...input, unitPrice: isNaN(val) ? 0 : Math.max(0, val) }, selectedItem);
            }}
            placeholder="단가 입력"
            className="w-full border border-slate-300 rounded px-3.5 py-2 bg-slate-50 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          />
        </div>

        {/* 5. 결제통화 & 적용환율 */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            기준 결제통화
          </label>
          <select
            value={input.currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 bg-slate-50 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-slate-900"
          >
            {Object.values(currentRates).map(r => (
              <option key={r.currency} value={r.currency}>
                {r.currency} - {r.name} ({r.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              [환율] (KRW/{input.currency})
            </label>
            <div className="flex items-center gap-1.5">
              <a
                href={UNIPASS_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="관세청 UNIPASS 메인화면 수입환율 확인"
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
                  title="유니패스 수입환율 갱신"
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
                value={input.exchangeRate}
                onChange={(e) => onChangeInput({ ...input, exchangeRate: Math.max(0, Number(e.target.value) || 0) }, selectedItem)}
                className="w-full border border-blue-400 rounded px-2.5 py-1.5 bg-white font-mono font-bold text-xs sm:text-sm text-blue-900 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleResetToUnipassRate}
                className="px-2 py-1.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold whitespace-nowrap border border-slate-300"
                title="유니패스 수입환율로 복원"
              >
                UNIPASS 복원
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingExchangeRate(true)}
              className="px-3 py-1.5 bg-amber-50/80 border border-amber-200 text-amber-950 rounded font-mono font-bold flex justify-between items-center cursor-pointer hover:bg-amber-100/70 transition"
              title="클릭하여 직접 환율을 수정하거나 유니패스 수입환율을 확인할 수 있습니다."
            >
              <span className="text-xs sm:text-sm">
                ₩ {Number(input.exchangeRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-sans font-bold">
                  UNIPASS 수입환율
                </span>
              </div>
            </div>
          )}
          <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{appliedDateDisplay} 관세청 수입환율 기준</span>
            <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setIsEditingExchangeRate(!isEditingExchangeRate)}>
              {isEditingExchangeRate ? '완료' : '직접입력'}
            </span>
          </p>
        </div>

        {/* 6. 인코텀즈 (Incoterms 2020) */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            인코텀즈 (Incoterms 2020)
          </label>
          <select
            value={input.incoterms}
            onChange={(e) => onChangeInput({ ...input, incoterms: e.target.value as any }, selectedItem)}
            className="w-full border border-slate-300 rounded px-3 py-2 bg-slate-50 font-bold text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
          >
            <option value="CIF">CIF (운임·보험료 포함 과세가격)</option>
            <option value="FOB">FOB (본선인도가격 + 운임 가산)</option>
            <option value="CFR">CFR (운임포함 + 보험료 가산)</option>
            <option value="DAP">DAP (도착지인도조건)</option>
            <option value="DDP">DDP (관세지급반입인도조건)</option>
            <option value="FCA">FCA (운송인인도조건)</option>
            <option value="EXW">EXW (공장인도가격 + 내륙/해상 가산)</option>
          </select>
        </div>

        {/* 7. [관세율] (인코텀즈 옆) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              [관세율] (Tariff Rate)
            </label>
            <span className="text-[10px] text-blue-700 font-bold truncate max-w-[130px]" title={result?.ftaAppliedName}>
              {result?.ftaAppliedName || (input.applyFta ? 'FTA 협정세율' : 'WTO/기본세율')}
            </span>
          </div>
          <div className="px-3.5 py-1.5 bg-blue-50/90 border border-blue-200 text-blue-950 rounded flex justify-between items-center">
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-extrabold text-base sm:text-lg text-blue-900">
                {result !== undefined ? `${result.tariffRate.toFixed(1)}%` : (input.customTariffRate !== undefined ? `${input.customTariffRate}%` : '-')}
              </span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              result?.tariffRate === 0
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-blue-200 text-blue-900'
            }`}>
              {result?.tariffRateType || '적용세율'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{result?.tariffAmountKrw ? `예상관세: ₩${result.tariffAmountKrw.toLocaleString()}` : '관세 계산'}</span>
            <button
              type="button"
              onClick={() => setCustomTariffEnabled(!customTariffEnabled)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {customTariffEnabled ? '기본세율 복원' : '관세율 변경'}
            </button>
          </p>
        </div>

        {/* 8. [총 과세가격] 및 총 수입비용 (인코텀즈 & 관세율 옆 2칸 차지) */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-500 uppercase">
              [총 과세가격] (Taxable Value CIF)
            </label>
            <span className="text-[10px] text-blue-700 font-bold">
              관세·부가세 과세표준
            </span>
          </div>
          <div className="px-3.5 py-1.5 bg-blue-50/90 border border-blue-200 text-blue-950 rounded flex flex-wrap justify-between items-center gap-2">
            <div>
              <span className="text-[10px] text-blue-700 font-bold block uppercase">총 과세가격 (CIF 기준)</span>
              <span className="font-mono font-extrabold text-base sm:text-lg text-blue-950">
                ₩ {result ? result.cifValueKrw.toLocaleString() : '0'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">총 수입비용 (Landed Cost)</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                ₩ {result ? result.totalAmountKrw.toLocaleString() : '0'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
            <span>관세({result?.tariffRate}%): ₩{result ? result.tariffAmountKrw.toLocaleString() : '0'}</span>
            <span>부가세(10%): ₩{result ? result.vatAmountKrw.toLocaleString() : '0'}</span>
          </p>
        </div>

        {/* 비-CIF/DDP 조건일 때 국제운임 및 보험료 입력란 */}
        {input.incoterms !== 'CIF' && input.incoterms !== 'DDP' && (
          <div className="md:col-span-2 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/60 p-3 rounded border border-amber-200">
            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1">
                국제 운임 ({input.currency}) - {input.incoterms} 가산 항목
              </label>
              <input
                type="number"
                min="0"
                value={input.freightCost === 0 ? '' : input.freightCost}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  onChangeInput({ ...input, freightCost: isNaN(val) ? 0 : Math.max(0, val) }, selectedItem);
                }}
                className="w-full border border-amber-300 rounded px-3.5 py-2 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                placeholder="운임액 입력"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-900 uppercase mb-1">
                적하 보험료 ({input.currency}) - {input.incoterms} 가산 항목
              </label>
              <input
                type="number"
                min="0"
                value={input.insuranceCost === 0 ? '' : input.insuranceCost}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  onChangeInput({ ...input, insuranceCost: isNaN(val) ? 0 : Math.max(0, val) }, selectedItem);
                }}
                className="w-full border border-amber-300 rounded px-3.5 py-2 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                placeholder="보험료액 입력"
              />
            </div>
          </div>
        )}

        {/* DDP(관세지급반입인도조건) 안내 배너 */}
        {input.incoterms === 'DDP' && (
          <div className="md:col-span-2 lg:col-span-4 bg-emerald-50/90 border border-emerald-300 rounded-lg p-3 text-xs text-emerald-950 flex items-start gap-2.5">
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold text-[10px] shrink-0 mt-0.5">
              DDP 인도조건
            </span>
            <div className="space-y-0.5">
              <p className="font-bold">DDP (관세지급반입인도조건, Delivered Duty Paid)</p>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                매도인(수출자)이 지정목적지까지 운송하여 <strong>수입통관을 완료하고 관세·부가가치세를 포함한 제세공과금을 모두 납부한 상태</strong>로 매수인에게 인도하는 조건입니다. 계약단가에 국제운임, 적하보험료 및 수입세액이 이미 포함되어 있어 별도의 운임 가산이 발생하지 않습니다.
              </p>
            </div>
          </div>
        )}

        {/* 7. FTA 협정관세 및 관세율 수동 설정 바 (네모 박스로 명확히 구분) */}
        <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-blue-50/60 via-slate-50 to-blue-50/60 rounded-lg p-3.5 border-2 border-blue-300/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                원산지증명서(C/O) 구비 여부:
              </span>
            </div>

            {/* 1) 원산지증명서 O / 2) 원산지증명서 X Switcher */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setCustomTariffEnabled(false);
                  onChangeInput({ ...input, applyFta: true, customTariffRate: undefined }, selectedItem);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  input.applyFta 
                    ? 'bg-blue-900 text-white shadow-2xs ring-1 ring-blue-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>1) 원산지증명서 O</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${input.applyFta ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  FTA 협정세율
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomTariffEnabled(false);
                  onChangeInput({ ...input, applyFta: false, customTariffRate: undefined }, selectedItem);
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                  !input.applyFta 
                    ? 'bg-blue-900 text-white shadow-2xs ring-1 ring-blue-900' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>2) 원산지증명서 X</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${!input.applyFta ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  WTO협정 / 기본세율
                </span>
              </button>
            </div>

            {/* Custom Tariff toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-white px-2.5 py-1.5 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={customTariffEnabled}
                onChange={(e) => {
                  setCustomTariffEnabled(e.target.checked);
                  if (!e.target.checked) {
                    onChangeInput({ ...input, customTariffRate: undefined }, selectedItem);
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="font-bold text-slate-700">
                관세율 직접 지정
              </span>
            </label>
          </div>

          {customTariffEnabled && (
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-blue-300">
              <span className="text-xs font-bold text-slate-700">지정 관세율:</span>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={input.customTariffRate ?? 0}
                  onChange={(e) => onChangeInput({ ...input, customTariffRate: Number(e.target.value) || 0 }, selectedItem)}
                  className="w-20 px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded text-right font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="ml-1 text-xs text-slate-600 font-bold">%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🏛️ 관세법령정보포털 CLIP 세번·상품검색 모달 */}
      <ClipCommoditySearchModal
        isOpen={isClipModalOpen}
        onClose={() => setIsClipModalOpen(false)}
        onSelectCommodity={handleSelectClipCommodity}
        initialQuery={clipModalInitialQuery}
      />
    </div>
  );
};
