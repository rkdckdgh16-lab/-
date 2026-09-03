import React, { useState, useMemo } from 'react';
import { CalculationResult, TradeItem } from '../types';
import { getClipExportRequirements } from '../data/clipExportRequirements';
import { 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  CheckSquare, 
  Clock, 
  Award, 
  Globe2, 
  FileSpreadsheet, 
  DollarSign, 
  Search,
  Scale,
  Building,
  Check,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';

interface ExportRequirementsViewProps {
  result: CalculationResult;
  selectedItem?: TradeItem;
  mode?: 'check' | 'regulations'; // 'check': 수출 요건 확인, 'regulations': 수출 요건
}

export const ExportRequirementsView: React.FC<ExportRequirementsViewProps> = ({ 
  result, 
  selectedItem,
  mode = 'check' 
}) => {
  const [activeTab, setActiveTab] = useState<'check' | 'strategic' | 'origin' | 'drawback' | 'process'>(
    mode === 'regulations' ? 'strategic' : 'check'
  );

  const [clipExportTab, setClipExportTab] = useState<'customs' | 'export_import' | 'integrated'>('customs');

  const clipExportData = useMemo(() => {
    return getClipExportRequirements(result.hsCode, result.itemName);
  }, [result.hsCode, result.itemName]);

  // Checklist state for user interaction
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: true,
    step4: false,
    step5: false,
    step6: false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isNcaBatteryItem = result.hsCode.startsWith('2841.90') || result.itemName.includes('NICKEL') || result.itemName.includes('COBALT');

  return (
    <div className="space-y-6">
      {/* 1. Top Summary Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>통상지원팀 수출 통관 & 컴플라이언스 관리</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{mode === 'check' ? '수출 요건 확인 (수출 통관 체크리스트)' : '수출 요건 (전략물자·원산지인증·수출법령)'}</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              현재 선택 품목: <strong className="text-white">[{result.hsCode}] {result.itemName}</strong> (수출국: 🇰🇷 한국 → 수입국: {result.importCountry})
            </p>
          </div>

          {/* Quick External Portals */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.yestrade.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded shadow transition"
            >
              <span>YesTrade 전략물자판정</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
            <a
              href="https://unipass.customs.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded border border-slate-700 shadow transition"
            >
              <span>관세청 UNIPASS 수출신고</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('check')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'check'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>1. 품목별 수출요건 자가진단</span>
          </button>

          <button
            onClick={() => setActiveTab('strategic')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'strategic'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2. 전략물자·수출통제 (대외무역법 제19조)</span>
          </button>

          <button
            onClick={() => setActiveTab('origin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'origin'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>3. 원산지증명서(C/O) & 인증수출자</span>
          </button>

          <button
            onClick={() => setActiveTab('drawback')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'drawback'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. 관세환급(Drawback) 가이드</span>
          </button>

          <button
            onClick={() => setActiveTab('process')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'process'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. 수출통관 6단계 프로세스</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 품목별 수출요건 자가진단 */}
      {activeTab === 'check' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-900" />
                <span>선택 품목 수출 필수 요건 자가진단 (Pre-Export Checklist)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                한국에서 해외로 수출 전 반드시 사전에 이행되어야 하는 법적 요건 및 구비서류를 점검합니다.
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200 font-bold">
              HSK {result.hsCode}
            </span>
          </div>

          {/* UNIPASS CLIP Official Result Banner */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/40">
            <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-950 font-black text-sm">· 수출</span>
                <span className="text-slate-600 font-medium">| 관세청 법령정보포털 CLIP 공식 요건조회 (HSK {result.hsCode})</span>
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
                <span>관세청 CLIP 원문 사이트</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Left Tabs */}
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

              {/* Right Content */}
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

          {/* Diagnosis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: 전략물자 판정 */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">1. 전략물자 판정</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isNcaBatteryItem ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {isNcaBatteryItem ? '판정확인 권고' : '일반 품목'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">전략물자 사전판정서 확인</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                전략물자관리원(KOSTI) YesTrade 전문판정 또는 자체 판정서가 유효기간(2년) 내에 있는지 확인합니다.
              </p>
            </div>

            {/* Card 2: 원산지증명서 */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">2. FTA 원산지증명</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  {result.originCriteria.originDocumentType}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">원산지 소명서 및 C/O 발급</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                수입국 바이어의 특혜관세(0%) 적용을 위해 FTA 원산지포괄확인서 및 제조원가명세서(BOM)를 구비합니다.
              </p>
            </div>

            {/* Card 3: 환경안전/MSDS */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">3. 환경안전 & 화학물질</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-200">
                  MSDS / 화관법
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">국문/영문 GHS MSDS 구비</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                화학물질관리법 및 산업안전보건법 제110조에 따라 수입국 언어 MSDS 및 위험물 운송(UN No.) 검사를 준비합니다.
              </p>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
              <span>수출 실무자 필수 체크리스트 (클릭하여 완료 여부 체크)</span>
              <span className="text-slate-500 font-normal">
                {Object.values(checkedItems).filter(Boolean).length} / 6 완료
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {[
                { id: 'step1', title: '수출계약 및 인코텀즈(Incoterms 2020) 확정', desc: 'FOB, CIF, DAP, DDP(관세지급반입인도조건) 등 조건에 따른 해상운임/보험료, 관세 부담 및 위험 분기점 명시' },
                { id: 'step2', title: '전략물자 판정서(YesTrade) 유효성 확인', desc: '해당 HS Code 물품이 통제 품목(이중용도 품목)에 해당하는지 사전 판정 완료' },
                { id: 'step3', title: 'FTA 원산지 포괄확인서 및 원산지인증수출자 번호 준비', desc: '품목별 또는 업체별 원산지인증수출자 인증번호 및 서명권자 등록 확인' },
                { id: 'step4', title: '상업송장(Commercial Invoice) & 포장명세서(Packing List) 작성', desc: 'HS Code 10자리, 순중량(Net Weight), 총중량(Gross Weight), 원산지 표기' },
                { id: 'step5', title: '위험물 포장검사 및 영문 GHS MSDS 동봉 (화학/이차전지 소재)', desc: '한국선급(KR) 또는 위험물검사원 포장증명서 구비 및 운송사 전달' },
                { id: 'step6', title: '관세청 UNIPASS 수출신고필증 교부 및 적재이행(30일 이내)', desc: '수출신고 수리 후 30일 이내에 선박/항공기에 적재 완료 (미적재 시 과태료)' }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition select-none ${
                    checkedItems[item.id] ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition ${
                    checkedItems[item.id] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-400 bg-white'
                  }`}>
                    {checkedItems[item.id] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${checkedItems[item.id] ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 전략물자 및 수출통제 */}
      {activeTab === 'strategic' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">전략물자 수출통제 제도 (대외무역법 제19조)</h3>
              <p className="text-xs text-slate-500">대량살상무기(WMD) 및 재래식무기로 전용될 수 있는 이중용도(Dual-use) 품목의 수출 규제</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-blue-900">1. 전략물자 판정 절차</span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>전문판정:</strong> 전략물자관리원(KOSTI)을 통해 신청 후 판정서 발급 (처리기간 10일, 유효기간 2년)</li>
                <li><strong>자가판정:</strong> 기업이 YesTrade 시스템을 통해 자율적으로 통제기준을 검색하여 판정</li>
                <li><strong>비전략물자 확인:</strong> 전략물자에 해당하지 않을 경우에도 통제국가(러시아, 벨라루스 등) 수출 시 상황허가 대상 여부 확인 필수</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-900">2. 수출허가 및 사후관리</span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>개별수출허가:</strong> 건별로 산업통상자원부장관 또는 관계 행정기관에 신청하여 승인 획득</li>
                <li><strong>포괄수출허가:</strong> 자율준수무역거래자(CP 기업)로 지정된 기업에 한해 특정 국가/품목 대상 일괄 허가</li>
                <li><strong>위반 시 제재:</strong> 7년 이하의 징역 또는 수출물품 가액의 5배 이하 벌금, 최대 3년 수출입 금지 처분</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>⚠️ 에코프로비엠/에코프로이엠 핵심 품목(이차전지 양극재 및 전구체) 주의사항:</strong><br />
            리튬 니켈 코발트 망간 산화물 및 전구체 등은 특수 정밀소재로서 바이어 및 최종 용도(End-user / End-use) 확인서 징구가 필수이며, 
            러시아·벨라루스 등 특별 수출통제 대상국 및 우려거래처 수출 시 사전 상황허가를 득하여야 합니다.
          </div>
        </div>
      )}

      {/* TAB 3: 원산지증명서 & 인증수출자 */}
      {activeTab === 'origin' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <Award className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="text-base font-bold text-slate-900">FTA 원산지증명서(C/O) 발급 및 원산지인증수출자 제도</h3>
              <p className="text-xs text-slate-500">한국 관세청 및 상공회의소 연계 자율발급 / 기관발급 절차</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800">품목별 / 업체별 원산지인증수출자 혜택</span>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>기관발급 C/O 신청 시 첨부서류 생략:</strong> 원산지소명서, 원자재내역서, 제조공정도 제출 면제</li>
                <li><strong>한-EU FTA 필수 요건:</strong> 6,000유로 초과 수출 건은 반드시 인증수출자만이 자율 C/O 발급 가능</li>
                <li><strong>신속 발급:</strong> 상공회의소/세관 심사 대기시간 없이 실시간 전산 자동 승인</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800">원산지 입증서류 5년 보관의무</span>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>BOM (자재명세서):</strong> 완제품 제조에 투입된 모든 원재료의 HS Code 및 가격 명세</li>
                <li><strong>원산지(포괄)확인서:</strong> 국내 공급 협력사로부터 수취한 원산지 확인 증빙서류</li>
                <li><strong>제조공정도 & 원가계산서:</strong> 한국 내 실질적 변형(세번변경기준 또는 부가가치기준) 충족 증빙</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 관세환급 가이드 */}
      {activeTab === 'drawback' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">수출용 원재료 관세환급 (Customs Drawback) 가이드</h3>
              <p className="text-xs text-slate-500">수출물품 제조에 사용된 수입 원재료에 납부한 관세를 수출 완료 후 세관으로부터 환급받는 제도</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-blue-900">1. 개별환급 (대기업 / 중견기업)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                완제품 1단위를 제조하는 데 소요된 수입 원재료의 양(소요량 증명서)과 수입신고필증을 1:1 매칭하여 실제 납부한 관세액을 정확히 계산하여 환급받는 방식.
              </p>
              <div className="text-[11px] bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                <strong>필요 서류:</strong> 수입신고필증, 수출신고필증, 원자재수불부, 생산일지, 소요량계산서
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900">2. 간이정액환급 (중소기업)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                관세청장이 매년 고시하는 간이정액환급율표에 따라, 복잡한 소요량 증명 없이 수출금액(FOB 원화 환산 1만원당 정액)을 기준으로 간편하게 환급받는 방식.
              </p>
              <div className="text-[11px] bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                <strong>대상:</strong> 중소기업기본법상 중소기업으로서 최근 2년간 매년 환급액이 6억원 이하인 기업
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-900">
            <strong>💡 관세환급 신청 기한:</strong> 수출신고 수리일로부터 <strong>2년 이내</strong>에 관세청 UNIPASS 전자통관시스템을 통해 신청해야 환급이 가능합니다.
          </div>
        </div>
      )}

      {/* TAB 5: 수출통관 6단계 프로세스 */}
      {activeTab === 'process' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <Layers className="w-5 h-5 text-blue-900" />
            <div>
              <h3 className="text-base font-bold text-slate-900">관세청 UNIPASS 수출통관 6단계 전체 흐름</h3>
              <p className="text-xs text-slate-500">수출계약 체결부터 사후 관세환급까지 통상지원팀 표준 업무 플로우</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-center text-xs">
            {[
              { num: '01', title: '수출계약 체결', sub: 'Incoterms & 결제조건' },
              { num: '02', title: '물품장치 & 포장', sub: '위험물검사 & MSDS' },
              { num: '03', title: '수출신고 (UNIPASS)', sub: '관세사 또는 자율신고' },
              { num: '04', title: '세관심사 및 수리', sub: '수출신고필증 교부' },
              { num: '05', title: '선적 및 적재', sub: '수리 후 30일 이내 적재' },
              { num: '06', title: 'C/O 발급 & 환급', sub: 'FTA 특혜 & 관세환급' }
            ].map((step, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] font-mono font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded">STEP {step.num}</span>
                <p className="font-bold text-slate-800 mt-1">{step.title}</p>
                <p className="text-[10px] text-slate-500">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
