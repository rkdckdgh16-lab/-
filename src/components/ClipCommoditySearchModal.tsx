import React, { useState, useMemo } from 'react';
import { 
  searchClipCommodities, 
  generateDynamicClipCommodity, 
  convertClipCommodityToTradeItem, 
  ClipCommodity,
  CLIP_COMMODITIES_DATABASE 
} from '../data/clipCommodities';
import { TradeItem } from '../types';
import { CLIP_PORTAL_URL } from '../data/clipTariffData';
import { 
  Search, 
  ExternalLink, 
  X, 
  ArrowDownToLine, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  Tag, 
  HelpCircle,
  Percent,
  SlidersHorizontal
} from 'lucide-react';

interface ClipCommoditySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommodity: (item: TradeItem, commodity: ClipCommodity) => void;
  initialQuery?: string;
}

export const ClipCommoditySearchModal: React.FC<ClipCommoditySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCommodity,
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  
  // 사용자 직접 입력 세번 & 품명 상태 (사용자가 자유롭게 직접 입력 및 수정 가능)
  const [userCustomHsCode, setUserCustomHsCode] = useState<string>('8517.13-0000');
  const [userCustomName, setUserCustomName] = useState<string>('');

  // Sync initial query when opened
  React.useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const categories = [
    '전체',
    '전기전자/반도체',
    '기계/자동화설비',
    '화학/배터리소재',
    '자동차/완성차',
    '철강/비철금속',
    '화장품/소비재',
    '주류/식품',
    '섬유/의류'
  ];

  const searchResults = useMemo(() => {
    const results = searchClipCommodities(searchQuery);
    if (activeCategory === '전체') return results;
    return results.filter(r => r.category.includes(activeCategory.split('/')[0]));
  }, [searchQuery, activeCategory]);

  // 검색어가 변경될 때 사용자 입력 세번/품명 지능형 초기 제안 (스마트폰 검색 시 8517.13-0000 자동 매칭)
  React.useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }

    const qLower = trimmed.toLowerCase();
    const digitsOnly = trimmed.replace(/[^0-9]/g, '');

    if (digitsOnly.length >= 4) {
      setUserCustomHsCode(trimmed);
      setUserCustomName(trimmed);
    } else if (qLower.includes('스마트폰') || qLower.includes('폰') || qLower.includes('phone') || qLower.includes('핸드폰') || qLower.includes('휴대폰')) {
      setUserCustomHsCode('8517.13-0000');
      setUserCustomName('스마트폰 (셀룰러망 전화기)');
    } else if (searchResults.length > 0) {
      setUserCustomHsCode(searchResults[0].hsCode);
      setUserCustomName(searchResults[0].nameKr);
    } else {
      setUserCustomName(trimmed);
    }
  }, [searchQuery, searchResults]);

  // 사용자 직접 입력 세번에 대한 실시간 관세율 스케줄 분석 계산
  const userCustomCandidate = useMemo(() => {
    const effectiveHs = userCustomHsCode.trim() || '8517.13-0000';
    const effectiveName = userCustomName.trim() || searchQuery.trim() || '사용자 직접 입력 품목';
    return generateDynamicClipCommodity(searchQuery, effectiveHs, effectiveName);
  }, [userCustomHsCode, userCustomName, searchQuery]);

  if (!isOpen) return null;

  const handlePullIn = (commodity: ClipCommodity) => {
    const tradeItem = convertClipCommodityToTradeItem(commodity);
    onSelectCommodity(tradeItem, commodity);
    onClose();
  };

  // 검색 결과에서 세번을 상단 사용자 입력란으로 불러와서 수정할 수 있도록 복사
  const handleLoadToCustomInputs = (item: ClipCommodity) => {
    setUserCustomHsCode(item.hsCode);
    setUserCustomName(item.nameKr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-xl border border-slate-300 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* CLIP Official Header Bar (관세법령정보포털 공식 테마 반영) */}
        {/* ======================================================== */}
        <div className="bg-[#1b4382] text-white px-5 py-3.5 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-2 py-1 rounded border border-white/20 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-black tracking-wider text-blue-100 uppercase">Customs Law Information Portal</span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <span>관세법령정보포털 (CLIP) 세번·상품검색</span>
              </h3>
              <p className="text-[11px] text-blue-200 hidden sm:block">
                관세청 공식 속견표·관세율표 연동 — 등록되지 않은 모든 수입 품목을 세번/상품으로 조회하여 견적기로 즉시 끌고옵니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={CLIP_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-blue-700/60 hover:bg-blue-600/80 rounded border border-blue-400/40 text-blue-100 transition"
              title="관세청 CLIP 포털 새창으로 열기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>포털 원문 바로가기</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CLIP Search Box (사용자 업로드 이미지 상단 검색창 형상화) */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-200">
                  세번·상품검색
                </span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="HS CODE(예: 8542, 8507, 2204, 3304) 또는 품명(반도체, 스마트폰, 와인, 커피, 티셔츠 등)"
                className="w-full pl-28 pr-10 py-2.5 text-xs sm:text-sm font-semibold bg-white border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500/20 text-slate-900 shadow-xs"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex gap-1.5 shrink-0">
              <a
                href={`${CLIP_PORTAL_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs"
              >
                <span>상세검색</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Quick Service Links (품목분류 빠른 서비스) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px]">
              <span className="text-blue-900">품목분류 빠른 서비스:</span>
              <button 
                type="button" 
                onClick={() => setSearchQuery('8542')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                반도체(8542)
              </button>
              <button 
                type="button" 
                onClick={() => setSearchQuery('8507')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                배터리(8507)
              </button>
              <button 
                type="button" 
                onClick={() => setSearchQuery('2204')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                와인(2204)
              </button>
              <button 
                type="button" 
                onClick={() => setSearchQuery('3304')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                화장품(3304)
              </button>
              <button 
                type="button" 
                onClick={() => setSearchQuery('8479')}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                제조기계(8479)
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              조회 결과 <strong className="text-blue-900">{searchResults.length}</strong>건
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Search Results List */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100">
          {/* 🎯 사용자 입력 세번 직접 입력 및 실시간 관세율 분석 섹션 */}
          <div className="p-4 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 border-2 border-blue-400/80 rounded-xl shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/70 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-900 text-white rounded-md text-xs font-black tracking-wide flex items-center gap-1 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-blue-200" />
                  <span>사용자 직접 세번(HS CODE) 입력</span>
                </span>
                <span className="text-[11px] font-bold text-blue-900">
                  원하는 세번을 직접 입력하거나 수정하여 관세율을 계산기에 바로 끌고올 수 있습니다.
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                * HS CODE 및 품명 자유 입력 가능
              </span>
            </div>

            {/* Direct Input Fields: [사용자 입력 세번] & [품명] */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-blue-950 mb-1">
                  사용자 입력 세번 (HS CODE) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={userCustomHsCode}
                  onChange={(e) => setUserCustomHsCode(e.target.value)}
                  placeholder="예: 8517.13-0000, 2842.31-1000"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-black text-blue-900 bg-white border-2 border-blue-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition shadow-2xs"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  사용자 입력 품명
                </label>
                <input
                  type="text"
                  value={userCustomName}
                  onChange={(e) => setUserCustomName(e.target.value)}
                  placeholder="품명 직접 입력 (예: 스마트폰, 화학물질, 부품 등)"
                  className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="sm:col-span-3 sm:self-end">
                <button
                  type="button"
                  onClick={() => handlePullIn(userCustomCandidate)}
                  className="w-full py-2.5 px-3 bg-blue-900 hover:bg-blue-800 active:scale-98 text-white text-xs font-extrabold rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <ArrowDownToLine className="w-4 h-4 text-emerald-300" />
                  <span>이 세번으로 끌고오기</span>
                </button>
              </div>
            </div>

            {/* Real-time Rate Schedule for User-Typed HS Code */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] bg-white/80 p-2.5 rounded-lg border border-blue-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-blue-950">
                  [HS {userCustomCandidate.hsCode}] 분석세율:
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold">
                  기본(A): <strong className="font-mono">{userCustomCandidate.baseRate.toFixed(1)}%</strong>
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
                  WTO양허(C): <strong className="font-mono">{userCustomCandidate.wtoRate.toFixed(1)}%</strong>
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded font-semibold">
                  FTA협정: <strong className="font-mono">{userCustomCandidate.ftaRates.CN?.rate ?? 0.0}%</strong>
                </span>
                <span className="text-[10px] text-slate-500">
                  ({userCustomCandidate.category})
                </span>
              </div>
              <span className="text-[10px] text-blue-700 font-semibold">
                * 세번 숫자를 변경하시면 관세율이 실시간 재계산됩니다.
              </span>
            </div>
          </div>

          {/* Regular Results */}
          {searchResults.map((item) => (
            <div
              key={item.hsCode}
              className="pt-3 first:pt-0 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/90 p-3 rounded-lg transition border border-transparent hover:border-slate-200"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {item.hsCode}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {item.nameKr}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5 bg-slate-100 rounded">
                    {item.category}
                  </span>
                </div>

                <p className="text-[11px] font-mono text-slate-500 truncate">
                  {item.nameEn}
                </p>

                <p className="text-[11px] text-slate-600 line-clamp-1">
                  {item.hsDescription}
                </p>

                {/* Tariff Rates & Requirements Preview */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-semibold flex items-center gap-1">
                    <span className="text-slate-400">기본(A):</span>
                    <strong className="text-slate-900 font-mono">{item.baseRate.toFixed(1)}%</strong>
                  </span>

                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold flex items-center gap-1">
                    <span className="text-emerald-600">WTO양허(C):</span>
                    <strong className="font-mono">{item.wtoRate.toFixed(1)}%</strong>
                  </span>

                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded font-semibold flex items-center gap-1">
                    <span className="text-indigo-600">한-중/한-EU FTA:</span>
                    <strong className="font-mono">{item.ftaRates.CN?.rate ?? 0.0}%</strong>
                  </span>

                  {item.regulations?.isControlled ? (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      <span>{item.regulations.applicableLaws[0]?.split(' ')[0] || '요건확인'}</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                      일반통관
                    </span>
                  )}

                  <span className="text-slate-400 text-[10px]">
                    표준단가: ${item.defaultUnitPriceUsd.toLocaleString()}/{item.unit}
                  </span>
                </div>
              </div>

              {/* Action Buttons: 바로 끌고오기 + 세번 복사하여 수정 */}
              <div className="shrink-0 flex flex-row sm:flex-col items-stretch sm:items-end justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePullIn(item)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs active:scale-98"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-blue-200" />
                  <span>바로 끌고오기</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadToCustomInputs(item)}
                  className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-300 flex items-center justify-center gap-1 transition"
                  title="세번을 상단 사용자 직접 입력란으로 복사하여 수정합니다"
                >
                  <span>✏️ 세번 복사하여 수정</span>
                </button>
              </div>
            </div>
          ))}

          {searchResults.length === 0 && (
            <div className="text-center py-8 space-y-3 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 p-6">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-800">일치하는 목록 품목이 없습니다.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                상단 <strong>[사용자 직접 세번(HS CODE) 입력]</strong> 란에 원하시는 세번 4~10자리를 직접 입력하시면 관세율표 규칙을 실시간 분석하여 계산기로 즉시 끌고오실 수 있습니다.
              </p>
              <a
                href={CLIP_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-blue-900 text-xs font-bold rounded-lg border border-blue-300 transition shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>관세법령정보포털 CLIP 원문 포털 검색하기</span>
              </a>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* Footer Guidance */}
        {/* ======================================================== */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              선택한 품목의 HS CODE 및 국·영문 명칭, 공식 관세율표(기본/WTO/FTA), 수입요건이 계산기에 즉시 반영됩니다.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
