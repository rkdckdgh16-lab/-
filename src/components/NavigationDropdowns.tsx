import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  FileCheck2, 
  Globe2, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronDown, 
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export type MainTabType = 
  | 'calc_import'        // 1. 산출내역조회 > 수입 관/부가세 산출
  | 'calc_export_check'  // 1. 산출내역조회 > 수출 요건 확인
  | 'tariff_guide'       // 2. 관세율 가이드
  | 'req_export'         // 3. 수출입 요건 사항 > 수출 요건
  | 'req_import';        // 3. 수출입 요건 사항 > 수입 요건

interface NavigationDropdownsProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  unipassStatusText?: string;
}

export const NavigationDropdowns: React.FC<NavigationDropdownsProps> = ({
  activeTab,
  onSelectTab,
  unipassStatusText = '관세청 UNIPASS 수입환율 연동 가동 중'
}) => {
  const [openDropdown, setOpenDropdown] = useState<'calc' | 'reg' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCalcActive = activeTab === 'calc_import' || activeTab === 'calc_export_check';
  const isTariffActive = activeTab === 'tariff_guide';
  const isRegActive = activeTab === 'req_export' || activeTab === 'req_import';

  return (
    <nav 
      ref={dropdownRef} 
      className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-16 z-30 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Navigation Dropdown Menu Buttons */}
        <div className="flex items-center flex-wrap gap-1 py-1.5">
          
          {/* ========================================================
              MENU 1: 산출내역조회 (Dropdown)
             ======================================================== */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('calc')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => {
                if (openDropdown === 'calc') {
                  setOpenDropdown(null);
                } else {
                  setOpenDropdown('calc');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
                isCalcActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>1. 산출내역조회</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'calc' ? 'rotate-180 text-amber-300' : 'text-slate-400'}`} />
            </button>

            {/* Dropdown 1 Content */}
            {openDropdown === 'calc' && (
              <div 
                className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* 1-1. 수입 관/부가세 산출 */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('calc_import');
                    setOpenDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs text-left transition ${
                    activeTab === 'calc_import'
                      ? 'bg-blue-600/90 text-white font-bold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-bold">수입 관/부가세 산출</p>
                      <p className="text-[10px] text-slate-400">CIF 과세가격, 관세·부가세 산출</p>
                    </div>
                  </div>
                  {activeTab === 'calc_import' && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                </button>

                {/* 1-2. 수출 부대비용/요건 확인 */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('calc_export_check');
                    setOpenDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs text-left transition mt-0.5 ${
                    activeTab === 'calc_export_check'
                      ? 'bg-blue-600/90 text-white font-bold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <div>
                      <p className="font-bold">수출 부대비용/요건 확인</p>
                      <p className="text-[10px] text-slate-400">양극재 3종·탄산리튬 산출 (관세·부가세 0원)</p>
                    </div>
                  </div>
                  {activeTab === 'calc_export_check' && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              MENU 2: 관세율 가이드 (Single Action or Direct View)
             ======================================================== */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                onSelectTab('tariff_guide');
                setOpenDropdown(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
                isTariffActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>2. 관세율 가이드</span>
            </button>
          </div>

          {/* ========================================================
              MENU 3: 수출입 요건 사항 (Dropdown)
             ======================================================== */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('reg')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => {
                if (openDropdown === 'reg') {
                  setOpenDropdown(null);
                } else {
                  setOpenDropdown('reg');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold transition ${
                isRegActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>3. 수출입 요건 사항</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'reg' ? 'rotate-180 text-amber-300' : 'text-slate-400'}`} />
            </button>

            {/* Dropdown 3 Content */}
            {openDropdown === 'reg' && (
              <div 
                className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* 3-1. 수출 요건 */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('req_export');
                    setOpenDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs text-left transition ${
                    activeTab === 'req_export'
                      ? 'bg-blue-600/90 text-white font-bold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-bold">수출 요건</p>
                      <p className="text-[10px] text-slate-400">전략물자·원산지인증·수출통제</p>
                    </div>
                  </div>
                  {activeTab === 'req_export' && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                </button>

                {/* 3-2. 수입 요건 */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('req_import');
                    setOpenDropdown(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs text-left transition mt-0.5 ${
                    activeTab === 'req_import'
                      ? 'bg-blue-600/90 text-white font-bold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="font-bold">수입 요건</p>
                      <p className="text-[10px] text-slate-400">세관장확인·화관법·요건승인대장</p>
                    </div>
                  </div>
                  {activeTab === 'req_import' && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Current Path Indicator & Live Status */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 py-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/60 font-mono text-[11px]">
            <span className="text-slate-500">현재 위치:</span>
            <span className="text-amber-300 font-bold">
              {activeTab === 'calc_import' && '1. 산출내역조회 > 수입 관/부가세 산출'}
              {activeTab === 'calc_export_check' && '1. 산출내역조회 > 수출 부대비용/요건 확인'}
              {activeTab === 'tariff_guide' && '2. 관세율 가이드 (국가별·세율비교)'}
              {activeTab === 'req_export' && '3. 수출입 요건 사항 > 수출 요건'}
              {activeTab === 'req_import' && '3. 수출입 요건 사항 > 수입 요건'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{unipassStatusText}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
