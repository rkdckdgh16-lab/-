import React, { useState } from 'react';
import { 
  Building2, 
  Globe2, 
  TrendingUp, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { User, signInWithGoogle, logOut } from '../firebase';
import { INITIAL_EXCHANGE_RATES, UNIPASS_PORTAL_URL } from '../data/exchangeRates';
import { ExchangeRateData } from '../types';

interface HeaderProps {
  user?: User | null;
  authLoading?: boolean;
  onOpenReport?: () => void;
  onSelectSampleItem?: (itemId: string) => void;
  currentRates?: Record<string, ExchangeRateData>;
  appliedDateDisplay?: string;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRates = INITIAL_EXCHANGE_RATES,
  appliedDateDisplay = '2026년 8월 31일',
  onRefreshRates,
  isRefreshingRates = false
}) => {
  const [showRatesPopup, setShowRatesPopup] = useState(false);

  const usdRate = currentRates.USD?.rateToKrw || 1382.44;

  return (
    <header className="h-16 bg-blue-900 text-white flex items-center justify-between px-4 sm:px-8 shadow-md shrink-0 sticky top-0 z-40">
      {/* Brand & System Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white shadow-sm shrink-0">
          G
        </div>
        <div className="flex items-baseline">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            통상지원팀 통합 대시보드
          </h1>
          <span className="text-blue-300 text-xs sm:text-sm font-normal ml-2 hidden md:inline whitespace-nowrap">
            Global Trade Support System
          </span>
        </div>
      </div>

      {/* Right System Info & Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5 text-sm">
        {/* UNIPASS Source Tag */}
        <div className="hidden xl:flex flex-col items-end text-right">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-blue-200 text-[10px] uppercase font-bold tracking-wider">UNIPASS 수입환율 연동</span>
          </div>
          <span className="font-mono text-xs text-white">{appliedDateDisplay} 기준</span>
        </div>

        <div className="hidden xl:block h-8 w-px bg-blue-800"></div>

        {/* Live UNIPASS Import FX Indicator Button */}
        <div className="relative">
          <button
            onClick={() => setShowRatesPopup(!showRatesPopup)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-blue-800/90 hover:bg-blue-800 text-blue-100 rounded border border-blue-700 transition shadow-xs"
            title="관세청 유니패스 수입환율 확인 및 동기화"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline text-blue-200 text-[11px]">관세청 수입환율</span>
            <span className="font-mono font-bold text-amber-300">USD {usdRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <ChevronDown className="w-3 h-3 text-blue-300" />
          </button>

          {/* Rates Dropdown Modal / Popup */}
          {showRatesPopup && (
            <div className="absolute right-0 mt-2 w-84 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>관세청 UNIPASS 수입환율</span>
                    <span className="text-[10px] bg-blue-900/80 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700 font-mono">
                      과세환율
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {appliedDateDisplay} 수입환율 기준
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {onRefreshRates && (
                    <button
                      onClick={onRefreshRates}
                      disabled={isRefreshingRates}
                      title="유니패스 수입환율 새로고침"
                      className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin text-blue-400' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Currency List */}
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {Object.values(currentRates).filter(r => r.currency !== 'KRW').map((rate) => (
                  <div key={rate.currency} className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-800/80 transition">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{rate.currency}</span>
                      <span className="text-[11px] text-slate-400">{rate.name.split('(')[0]}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-300">
                        ₩ {rate.rateToKrw.toLocaleString(undefined, { minimumFractionDigits: rate.currency === 'USD' || rate.currency === 'EUR' ? 2 : 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer link to official Unipass portal */}
              <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                <span>출처: 관세청 전자통관시스템</span>
                <a
                  href={UNIPASS_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 underline underline-offset-2"
                >
                  <span>UNIPASS 메인 바로가기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
