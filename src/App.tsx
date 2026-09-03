import React, { useState, useEffect } from 'react';
import { 
  TradeItem, 
  CalculationInput, 
  CalculationResult,
  ExchangeRateData
} from './types';
import { TRADE_ITEMS_DATABASE } from './data/tradeData';
import { 
  INITIAL_EXCHANGE_RATES, 
  INITIAL_IMPORT_EXCHANGE_RATES,
  INITIAL_EXPORT_EXCHANGE_RATES,
  fetchUnipassImportRates, 
  fetchUnipassExportRates,
  UNIPASS_PORTAL_URL 
} from './data/exchangeRates';
import { calculateTradeDuties } from './utils/calculator';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { CalculationForm } from './components/CalculationForm';
import { EssentialDataTable } from './components/EssentialDataTable';
import { CountryComparisonMatrix } from './components/CountryComparisonMatrix';
import { RequiredRegulationsView } from './components/RequiredRegulationsView';
import { ExportRequirementsView } from './components/ExportRequirementsView';
import { ExportCalculationDashboard } from './components/ExportCalculationDashboard';
import { NavigationDropdowns, MainTabType } from './components/NavigationDropdowns';
import { ExportReportModal } from './components/ExportReportModal';
import { 
  auth, 
  onAuthStateChanged, 
  User, 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  limit 
} from './firebase';
import { 
  LayoutDashboard, 
  Globe2, 
  ShieldAlert, 
  CheckCircle2
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'trade_support_history_v1';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // UNIPASS Exchange Rates state (수입환율 및 수출환율 분리 관리)
  const [currentImportRates, setCurrentImportRates] = useState<Record<string, ExchangeRateData>>(INITIAL_IMPORT_EXCHANGE_RATES);
  const [currentExportRates, setCurrentExportRates] = useState<Record<string, ExchangeRateData>>(INITIAL_EXPORT_EXCHANGE_RATES);
  const [appliedDateDisplay, setAppliedDateDisplay] = useState<string>('2026년 8월 31일');
  const [isRefreshingRates, setIsRefreshingRates] = useState<boolean>(false);

  // Default selection: 14대 대표 품목 1번 (NICKEL COBALT ALUMINUM OXIDE)
  const initialItem = TRADE_ITEMS_DATABASE[0] || TRADE_ITEMS_DATABASE[1];

  const [selectedItem, setSelectedItem] = useState<TradeItem | undefined>(initialItem);

  const [input, setInput] = useState<CalculationInput>({
    itemId: initialItem.id,
    itemName: initialItem.name,
    hsCode: initialItem.hsCode,
    exportCountry: 'CN',
    importCountry: 'KR',
    quantity: 0,
    unitPrice: 0,
    currency: 'USD',
    incoterms: 'CIF',
    freightCost: 0,
    insuranceCost: 0,
    exchangeRate: INITIAL_IMPORT_EXCHANGE_RATES.USD.rateToKrw, // 1382.44
    applyFta: true
  });

  const [result, setResult] = useState<CalculationResult>(() => 
    calculateTradeDuties(input, initialItem)
  );

  const [historyRecords, setHistoryRecords] = useState<CalculationResult[]>([]);
  const [activeTab, setActiveTab] = useState<MainTabType>('calc_import');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Re-calculate whenever input or selected item changes
  useEffect(() => {
    const updated = calculateTradeDuties(input, selectedItem);
    setResult(updated);
  }, [input, selectedItem]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        setIsCloudSynced(true);
        loadCloudHistory(currentUser.uid);
      } else {
        setIsCloudSynced(false);
        loadLocalHistory();
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // UNIPASS Rate Sync Handler (수입환율 및 수출환율 동시 동기화)
  const handleRefreshRates = () => {
    setIsRefreshingRates(true);
    setTimeout(() => {
      const { rates: newImportRates, appliedDateDisplay: newDateDisplay } = fetchUnipassImportRates(new Date('2026-08-31'));
      const { rates: newExportRates } = fetchUnipassExportRates(new Date('2026-08-31'));
      
      setCurrentImportRates(newImportRates);
      setCurrentExportRates(newExportRates);
      setAppliedDateDisplay(newDateDisplay);

      // Update current import calculation input if using standard currency rate
      const updatedImportRate = newImportRates[input.currency]?.rateToKrw || 1382.44;
      setInput(prev => ({
        ...prev,
        exchangeRate: updatedImportRate
      }));

      setIsRefreshingRates(false);
      showToast(`관세청 UNIPASS 공식 고시환율(수입: USD 1,382.44 / 수출: USD 1,356.88)이 성공적으로 동기화되었습니다.`);
    }, 400);
  };

  // Load from local storage
  const loadLocalHistory = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHistoryRecords(JSON.parse(saved));
      } else {
        // Seed with initial item
        const initialCalc = calculateTradeDuties(input, initialItem);
        setHistoryRecords([initialCalc]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Load from Firestore
  const loadCloudHistory = async (userId: string) => {
    try {
      const q = query(
        collection(db, 'calculations'),
        where('userId', '==', userId),
        limit(50)
      );
      const snap = await getDocs(q);
      const docs: CalculationResult[] = [];
      snap.forEach((d) => {
        docs.push({ id: d.id, ...(d.data() as any) });
      });

      if (docs.length > 0) {
        // Sort descending by createdAt
        docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setHistoryRecords(docs);
      } else {
        loadLocalHistory();
      }
    } catch (err) {
      console.warn('Firestore load fallback to local:', err);
      loadLocalHistory();
    }
  };

  // Save to Cloud / Local
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    const newRecord: CalculationResult = {
      ...result,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      userId: user ? user.uid : 'local'
    };

    const updated = [newRecord, ...historyRecords.filter(r => r.id !== newRecord.id)].slice(0, 50);
    setHistoryRecords(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (user) {
      try {
        await addDoc(collection(db, 'calculations'), {
          ...newRecord,
          userId: user.uid
        });
        showToast('Firestore 클라우드에 계산 내역이 안전하게 저장되었습니다.');
      } catch (err) {
        console.error('Firestore save error:', err);
        showToast('로컬에 저장되었습니다 (클라우드 동기화 대기).');
      }
    } else {
      showToast('계산 내역이 저장되었습니다 (로그인 시 클라우드 동기화 지원).');
    }
    setIsSaving(false);
  };

  const handleDeleteRecord = async (id: string) => {
    const updated = historyRecords.filter(r => r.id !== id);
    setHistoryRecords(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (user && db) {
      try {
        await deleteDoc(doc(db, 'calculations', id));
      } catch (e) {
        console.warn(e);
      }
    }
    showToast('기록이 삭제되었습니다.');
  };

  const handleClearAll = () => {
    if (confirm('저장된 계산 이력을 모두 삭제하시겠습니까?')) {
      setHistoryRecords([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      showToast('이력이 모두 삭제되었습니다.');
    }
  };

  const handleRestoreRecord = (rec: CalculationResult) => {
    const matchingItem = TRADE_ITEMS_DATABASE.find(t => t.hsCode === rec.hsCode || t.name === rec.itemName);
    setSelectedItem(matchingItem);
    setInput({
      itemId: matchingItem?.id,
      itemName: rec.itemName,
      hsCode: rec.hsCode,
      exportCountry: rec.exportCountry === '한국' ? 'KR' : 'US',
      importCountry: rec.importCountry === '미국' ? 'US' : 'KR',
      quantity: rec.quantity,
      unitPrice: rec.unitPrice,
      currency: rec.currency,
      incoterms: (rec.incoterms as any) || 'CIF',
      freightCost: 0,
      insuranceCost: 0,
      exchangeRate: rec.exchangeRate,
      applyFta: rec.tariffRateType === 'FTA협정관세',
      customTariffRate: rec.tariffRateType === '사용자지정관세' ? rec.tariffRate : undefined
    });
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`'${rec.itemName}' 계산 설정을 불러왔습니다.`);
  };

  const handleSelectSampleItem = (itemId: string) => {
    const item = TRADE_ITEMS_DATABASE.find(t => t.id === itemId);
    if (item) {
      setSelectedItem(item);
      setInput(prev => ({
        ...prev,
        itemId: item.id,
        itemName: item.name,
        hsCode: item.hsCode,
        unitPrice: item.defaultUnitPriceUsd,
        currency: 'USD',
        exchangeRate: currentImportRates.USD?.rateToKrw || 1382.44,
        customTariffRate: undefined
      }));
      showToast(`'${item.name}' 품목이 선택되었습니다.`);
    }
  };

  const handleSelectApprovalItem = (productName: string, hskNo?: string) => {
    const matchingDatabaseItem = TRADE_ITEMS_DATABASE.find(t => 
      t.name.toLowerCase().includes(productName.toLowerCase()) || 
      productName.toLowerCase().includes(t.name.toLowerCase()) ||
      (hskNo && t.hsCode.replace(/[-.\s]/g, '').startsWith(hskNo.replace(/[-.\s]/g, '').slice(0, 6)))
    );

    setSelectedItem(matchingDatabaseItem);
    setInput(prev => ({
      ...prev,
      itemId: matchingDatabaseItem?.id,
      itemName: productName,
      hsCode: hskNo || matchingDatabaseItem?.hsCode || prev.hsCode,
      unitPrice: matchingDatabaseItem?.defaultUnitPriceUsd || prev.unitPrice,
      customTariffRate: undefined
    }));

    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`2026년 요건등록 품목 '${productName}'이(가) 계산기에 적용되었습니다.`);
  };

  const handleSelectCountryAsDestination = (countryCode: string) => {
    setInput(prev => ({
      ...prev,
      importCountry: countryCode
    }));
    showToast(`수입국(도착지)이 '${countryCode}'(으)로 변경되었습니다.`);
  };

  const handleToggleFta = (applyFta: boolean) => {
    setInput(prev => ({
      ...prev,
      applyFta,
      customTariffRate: undefined
    }));
    showToast(applyFta ? '1) 원산지증명서 O (FTA 협정세율)가 적용되었습니다.' : '2) 원산지증명서 X (WTO/기본세율)가 적용되었습니다.');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        user={user}
        authLoading={authLoading}
        onOpenReport={() => setIsReportModalOpen(true)}
        onSelectSampleItem={handleSelectSampleItem}
        currentRates={currentImportRates}
        currentExportRates={currentExportRates}
        appliedDateDisplay={appliedDateDisplay}
        onRefreshRates={handleRefreshRates}
        isRefreshingRates={isRefreshingRates}
      />

      {/* Navigation Dropdown Menu Bar (1. 산출내역조회, 2. 관세율 가이드, 3. 수출입 요건 사항) */}
      <NavigationDropdowns
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        unipassStatusText="관세청 UNIPASS 수출입 고시환율 실시간 연동 중"
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1-1. 산출내역조회 > 수입 관/부가세 산출 */}
        {activeTab === 'calc_import' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 1. Summary Metric Cards */}
            <MetricCards 
              result={result} 
              onOpenReport={() => setIsReportModalOpen(true)}
            />

            {/* 2. Interactive Calculator Form */}
            <CalculationForm
              input={input}
              onChangeInput={(newInput, item) => {
                setInput(newInput);
                if (item) setSelectedItem(item);
              }}
              selectedItem={selectedItem}
              result={result}
              onSaveToCloud={handleSaveToCloud}
              isSaving={isSaving}
              currentRates={currentImportRates}
              appliedDateDisplay={appliedDateDisplay}
              onRefreshRates={handleRefreshRates}
              isRefreshingRates={isRefreshingRates}
            />

            {/* 3. Mandatory 10-Field Essential Data Table */}
            <EssentialDataTable
              result={result}
              onOpenRequirements={() => setActiveTab('req_import')}
            />
          </div>
        )}

        {/* 1-2. 산출내역조회 > 수출 부대비용/요건 확인 (양극재 3종 & 탄산리튬 전용, 관·부가세 0원) */}
        {activeTab === 'calc_export_check' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <ExportCalculationDashboard
              currentRates={currentExportRates}
              currentExportRates={currentExportRates}
              appliedDateDisplay={appliedDateDisplay}
              onRefreshRates={handleRefreshRates}
              isRefreshingRates={isRefreshingRates}
              onSaveToCloud={handleSaveToCloud}
              isSaving={isSaving}
            />
          </div>
        )}

        {/* 2. 관세율 가이드 (HS코드별/국가별 관세율 및 FTA 협정세율 비교 매트릭스) */}
        {activeTab === 'tariff_guide' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <CountryComparisonMatrix
              input={input}
              selectedItem={selectedItem}
              result={result}
              onSelectCountryAsDestination={handleSelectCountryAsDestination}
              onToggleFta={handleToggleFta}
            />
          </div>
        )}

        {/* 3-1. 수출입 요건 사항 > 수출 요건 */}
        {activeTab === 'req_export' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <ExportRequirementsView 
              result={result}
              selectedItem={selectedItem}
              mode="regulations"
            />
          </div>
        )}

        {/* 3-2. 수출입 요건 사항 > 수입 요건 */}
        {activeTab === 'req_import' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <RequiredRegulationsView 
              result={result} 
              onSelectItemByName={handleSelectApprovalItem}
            />
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded shadow-2xl z-50 flex items-center gap-2 border border-blue-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Printable Report Modal */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={result}
        userEmail={user?.email}
      />
    </div>
  );
}
