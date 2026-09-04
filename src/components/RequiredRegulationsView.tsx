import React, { useState, useMemo } from 'react';
import { CalculationResult } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileCheck, 
  Scale, 
  Building, 
  AlertTriangle, 
  Stamp,
  ExternalLink,
  BookOpen,
  FileText,
  Layers,
  HelpCircle,
  Clock,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  XCircle,
  Copy,
  Info,
  ArrowRight,
  Database
} from 'lucide-react';
import { 
  REGISTERED_APPROVAL_LIST, 
  EM_APPROVAL_LIST,
  checkItemApprovalStatus, 
  searchRegisteredApprovalDatabase, 
  searchEmApprovalDatabase,
  RegisteredApprovalItem,
  EmApprovalItem
} from '../data/registeredApprovalData';
import {
  BM_CHEMICAL_SPEC_LIST,
  searchBmChemicalSpecDatabase,
  BmChemicalSpecItem
} from '../data/bmChemicalSpecData';
import { isSubjectToChemicalLaws } from '../utils/calculator';

interface RequiredRegulationsViewProps {
  result: CalculationResult;
  onSelectItemByName?: (productName: string, hskNo?: string) => void;
}

type ReqTabType = 'customs' | 'exportImport' | 'integrated' | 'guide' | 'approvalLedger';

export const RequiredRegulationsView: React.FC<RequiredRegulationsViewProps> = ({ result, onSelectItemByName }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  
  // 화평법/화관법 등 화학물질 관리법 적용 품목 여부 판별
  const isChemicalLawItem = useMemo(() => {
    return result.approvalStatus?.isChemicalRegulation ?? isSubjectToChemicalLaws(
      result.hsCode,
      result.importRegulationsFull?.applicableLaws,
      result.approvalStatus,
      result.itemName
    );
  }, [result]);

  const [activeSubTab, setActiveSubTab] = useState<ReqTabType>(isChemicalLawItem ? 'approvalLedger' : 'customs');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [emSearchKeyword, setEmSearchKeyword] = useState<string>('');
  const [bmSpecSearchKeyword, setBmSpecSearchKeyword] = useState<string>('');
  const [copiedApproval, setCopiedApproval] = useState<string | null>(null);

  // 품목 변경 시 화학물질 대상 여부에 따라 탭 기본값 자동 동기화
  React.useEffect(() => {
    if (!isChemicalLawItem && activeSubTab === 'approvalLedger') {
      setActiveSubTab('customs');
    }
  }, [isChemicalLawItem]);
  
  const reg = result.importRegulationsFull;
  const origin = result.originCriteria;

  const customsList = reg.customsVerifications || [];
  const exportImportList = reg.exportImportNotices || [];
  const integratedList = reg.integratedNotices || [];

  // 현재 계산기 품목의 요건승인 등록 여부 실시간 판별
  const currentApprovalStatus = useMemo(() => {
    return checkItemApprovalStatus(result.itemName, result.hsCode);
  }, [result.itemName, result.hsCode]);

  // BM 대장 검색 필터링
  const filteredLedger = useMemo(() => {
    return searchRegisteredApprovalDatabase(searchKeyword);
  }, [searchKeyword]);

  // EM 대장 검색 필터링
  const filteredEmLedger = useMemo(() => {
    return searchEmApprovalDatabase(emSearchKeyword);
  }, [emSearchKeyword]);

  // BM 화학물질명세내역 검색 필터링
  const filteredBmSpecLedger = useMemo(() => {
    return searchBmChemicalSpecDatabase(bmSpecSearchKeyword);
  }, [bmSpecSearchKeyword]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApproval(text);
    setTimeout(() => setCopiedApproval(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
      {/* 1. Header with UNIPASS CLIP official link */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 mt-0.5 ${
            isChemicalLawItem && currentApprovalStatus.isRegistered 
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
              : reg.isControlled 
                ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                : 'bg-blue-100 text-blue-900 border border-blue-200'
          }`}>
            {isChemicalLawItem && currentApprovalStatus.isRegistered ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            ) : reg.isControlled ? (
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-blue-700" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isChemicalLawItem
                  ? '[수입시 요건사항] 및 2026년 요건승인 등록 현황 대시보드'
                  : '[수입시 요건사항] 통관 요건 및 법령 대시보드'}
              </h3>
              
              {/* 🎯 화평법/화관법 등 화학물질 관리법일 때만 2026년 요건승인 등록 여부 뱃지 노출 */}
              {isChemicalLawItem ? (
                currentApprovalStatus.isRegistered ? (
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      ✅ 2026년 요건승인 등록 완료
                      {currentApprovalStatus.hasBmMatch && currentApprovalStatus.hasEmMatch && (
                        <> (BM: {currentApprovalStatus.allMatches[0]?.approvalNumber || currentApprovalStatus.approvalData?.approvalNumber} / EM: {currentApprovalStatus.emApprovalData?.approvalNumber})</>
                      )}
                      {currentApprovalStatus.hasBmMatch && !currentApprovalStatus.hasEmMatch && (
                        <> (BM: {currentApprovalStatus.approvalData?.approvalNumber})</>
                      )}
                      {!currentApprovalStatus.hasBmMatch && currentApprovalStatus.hasEmMatch && (
                        <> (EM: {currentApprovalStatus.emApprovalData?.approvalNumber})</>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>⚠️ 2026년 요건 미등록 품목 (화평법·화관법 사전승인/신고 필요)</span>
                  </span>
                )
              ) : (
                reg.isControlled ? (
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                    <span>🔍 세관장확인대상 (개별 법령 요건확인)</span>
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>일반통관 (세관장확인 비대상)</span>
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
              <span>품명: <strong>{result.itemName}</strong></span>
              <span className="text-slate-300">|</span>
              <span>HS CODE: <strong className="font-mono text-blue-900">{result.hsCode}</strong></span>
              <span className="text-slate-300">|</span>
              <span>수입국: <strong>{result.importCountry}</strong></span>
            </p>
          </div>
        </div>

        {/* Actions: Official CLIP Portal Link Badge & Collapse Button */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <a
            href="https://unipass.customs.go.kr/clip/index.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-2xs group"
          >
            <span>관세청 CLIP 법령포털</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-white" />
          </a>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 text-xs font-bold transition shadow-2xs"
            title="수입시 요건사항 섹션 숨기기/펼치기"
          >
            <span>요건사항 {isExpanded ? '접기' : '펼치기'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* 🌟 2. 품명 입력 시 요건승인 등록 여부 즉시 판별 카드 (화평법/화관법 등 화학물질 관리법일 때만 화학 요건 배너 표시) */}
      {isExpanded && (
        <div className="mb-5 space-y-3">
          {isChemicalLawItem ? (
            currentApprovalStatus.isRegistered ? (
              <>
                {/* BM 등록 품목 카드 (BM 매칭 시 표시) */}
                {currentApprovalStatus.hasBmMatch && currentApprovalStatus.approvalData && (
                <div className="bg-emerald-50/90 border-2 border-emerald-500/40 rounded-xl p-4 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-600 text-white rounded-lg font-bold shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 bg-emerald-200 text-emerald-950 rounded">
                            No. {currentApprovalStatus.approvalData.no}
                          </span>
                          <h4 className="text-sm font-bold text-emerald-950">
                            2026년 수입 요건승인 등록 완료 품목입니다 (BM)
                          </h4>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          등록 제품명: <strong>{currentApprovalStatus.approvalData.productName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-emerald-300 shadow-2xs self-start md:self-auto">
                      <span className="text-xs font-semibold text-slate-600">요건승인번호(26년):</span>
                      <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {currentApprovalStatus.approvalData.approvalNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentApprovalStatus.approvalData!.approvalNumber)}
                        className="text-emerald-700 hover:text-emerald-900 p-1 transition"
                        title="승인번호 복사"
                      >
                        {copiedApproval === currentApprovalStatus.approvalData.approvalNumber ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 세부 등록 스펙 그리드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">HSK No. (관세율표 번호)</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {currentApprovalStatus.approvalData.hskNo}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">인체등유해성물질 및 함량</span>
                      <div className="font-bold text-rose-700 text-xs mt-0.5 space-y-1" title={currentApprovalStatus.approvalData.hazardousSubstance}>
                        {currentApprovalStatus.approvalData.hazardousSubstance
                          .split(',')
                          .map((sub, idx) => (
                            <div key={idx} className="leading-snug bg-rose-50/60 px-1.5 py-0.5 rounded border border-rose-100">
                              {sub.trim()}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">식별번호 (CAS No.)</span>
                      <div className="font-mono font-bold text-blue-900 text-xs mt-0.5 space-y-0.5">
                        {currentApprovalStatus.approvalData.casNo ? (
                          currentApprovalStatus.approvalData.casNo.split(',').map((cas, idx) => (
                            <div key={idx} className="leading-tight">{cas.trim()}</div>
                          ))
                        ) : (
                          '-'
                        )}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">승인 등록 수입(출)국</span>
                      <span className="font-bold text-slate-800 text-xs">
                        {currentApprovalStatus.approvalData.importCountry}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* EM 등록 품목 카드 (EM 매칭 시 표시) */}
              {currentApprovalStatus.hasEmMatch && currentApprovalStatus.emApprovalData && (
                <div className="bg-amber-50/90 border-2 border-amber-500/40 rounded-xl p-4 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-amber-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-600 text-white rounded-lg font-bold shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 bg-yellow-300 text-slate-950 rounded">
                            No. {currentApprovalStatus.emApprovalData.no}
                          </span>
                          <h4 className="text-sm font-bold text-slate-950">
                            2026년 수입 요건승인 등록 완료 품목입니다 (EM)
                          </h4>
                        </div>
                        <p className="text-xs text-amber-950 mt-0.5">
                          등록 제품명: <strong>{currentApprovalStatus.emApprovalData.productName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-amber-300 shadow-2xs self-start md:self-auto">
                      <span className="text-xs font-semibold text-slate-600">요건승인번호(26년):</span>
                      <span className="text-xs font-mono font-black text-slate-950 bg-amber-100/80 px-2 py-0.5 rounded">
                        {currentApprovalStatus.emApprovalData.approvalNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentApprovalStatus.emApprovalData!.approvalNumber)}
                        className="text-amber-800 hover:text-amber-950 p-1 transition"
                        title="승인번호 복사"
                      >
                        {copiedApproval === currentApprovalStatus.emApprovalData.approvalNumber ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 세부 등록 스펙 그리드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">등록 구분 및 HSK</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        EM 등록 (2825.90 / 2841.90)
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">유독물명칭 및 함유량(%)</span>
                      <div className="font-bold text-rose-700 text-xs mt-0.5 space-y-1">
                        {currentApprovalStatus.emApprovalData.toxicItems.map((toxic, idx) => (
                          <div key={idx} className="leading-snug bg-rose-50/60 px-1.5 py-0.5 rounded border border-rose-100 flex items-center justify-between gap-1">
                            <span>{toxic.toxicName}</span>
                            <span className="text-rose-900 font-black">{toxic.contentPercent}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">식별번호 (CAS No.)</span>
                      <div className="font-mono font-bold text-blue-900 text-xs mt-0.5 space-y-0.5">
                        {currentApprovalStatus.emApprovalData.toxicItems.map((toxic, idx) => (
                          <div key={idx} className="leading-tight">{toxic.casNo}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200/70">
                      <span className="text-[11px] font-semibold text-slate-500 block">승인 등록 관리처</span>
                      <span className="font-bold text-slate-800 text-xs">
                        EM(양극재/전구체/원소재) 수입요건
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-rose-50/90 border-2 border-rose-300 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-600 text-white rounded-lg font-bold shadow-xs mt-0.5">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                    <span>2026년 요건승인 목록 미등록 품목 (화평법·화관법 대상)</span>
                    <span className="text-[11px] font-normal text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                      사전 요건 확인 대상
                    </span>
                  </h4>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    입력하신 품명(<strong>{result.itemName}</strong>)은 2026년 기승인 품목(BM 30선 및 EM 7선)에 등록되어 있지 않습니다. 수입 통관 전 화학물질관리협회(KCMA) 또는 관세청 전산시스템(UNIPASS)을 통해 화학물질 확인명세서 제출 및 사전 승인번호 발급 절차를 완료해야 합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('approvalLedger')}
                className="px-3.5 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition whitespace-nowrap self-start md:self-auto shrink-0 shadow-2xs"
              >
                2026년 등록 대장 확인 →
              </button>
            </div>
          )
        ) : (
          // 비화학물질 품목(커피, 식품, 스마트폰, 일반공산품 등)인 경우 맞춤형 안내 배너
          reg.isControlled ? (
            <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-600 text-white rounded-lg font-bold shadow-xs mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <span>개별 법령 세관장확인 대상 품목</span>
                    <span className="text-[11px] font-normal text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                      수입요건 구비 필요
                    </span>
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    해당 품목(<strong>{result.itemName}</strong>)은 <strong>{reg.applicableLaws.join(', ')}</strong>에 따른 요건확인 대상입니다. 통관 전 소관 기관({reg.inspectionAgency || '소관 기관'})의 검사·승인 확인서류를 구비하여 세관 수입신고서에 연계하여야 합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTab('customs')}
                className="px-3.5 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition whitespace-nowrap self-start md:self-auto shrink-0 shadow-2xs"
              >
                세관장확인 요건 보기 →
              </button>
            </div>
          ) : (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg font-bold shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-950">
                    일반통관 대상 품목 (세관장확인 비대상)
                  </h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    해당 품목(<strong>{result.itemName}</strong>)은 별도의 사전 요건확인 절차 없이 관세법 및 대외무역법에 따른 일반 수입신고 절차로 신속 통관이 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          )
        )}
        </div>
      )}

      {isExpanded ? (
        <>
          {/* 3. Sub Navigation Tabs for CLIP 3-Part Requirements + 2026 Approval Ledger */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 mb-5">
            <button
              onClick={() => setActiveSubTab('approvalLedger')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition ${
                activeSubTab === 'approvalLedger'
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>📋 2026년 요건승인 대장 (화학물질)</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === 'approvalLedger' ? 'bg-amber-400 text-blue-950 font-black' : 'bg-slate-200 text-slate-800'
              }`}>
                BM 30건 + EM 7건
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('customs')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition ${
                activeSubTab === 'customs'
                  ? 'bg-white text-blue-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-blue-700" />
              <span>1. 세관장확인 (관세법 제226조)</span>
              {customsList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
                  {customsList.length}건
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('exportImport')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition ${
                activeSubTab === 'exportImport'
                  ? 'bg-white text-blue-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. 수출입공고 (대외무역법 제11조)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('integrated')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition ${
                activeSubTab === 'integrated'
                  ? 'bg-white text-blue-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-700" />
              <span>3. 통합공고 (대외무역법 제12조)</span>
              {integratedList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full text-[10px]">
                  {integratedList.length}건
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition ${
                activeSubTab === 'guide'
                  ? 'bg-white text-blue-900 shadow-2xs border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>4. 실무 통관 가이드 & FTA PSR</span>
            </button>
          </div>

          {/* 4. Tab Contents */}

          {/* TAB 0: 2026년 요건승인 등록 대장 (30건) */}
          {activeSubTab === 'approvalLedger' && (
            <div className="space-y-3.5">
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[11px]">
                    BM-2026 현황
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    수입 요건승인번호 등록 품목 대장 및 실시간 등록 여부 조회
                  </h4>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  품명, 모델규격, 화학명, CAS No, 승인번호, 수입국으로 검색하여 등록 여부를 즉시 검증할 수 있습니다.
                </p>
              </div>

              {/* No / 제품명 바로 위 검색 바 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="relative w-full max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="품명 / CAS No / 승인번호 / HSK 검색..."
                    className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs font-medium"
                  />
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-medium shrink-0 self-end sm:self-auto">
                  조회 결과: <strong className="text-blue-900 font-bold">{filteredLedger.length}</strong>건 / 전체 30건
                </div>
              </div>

              {/* 요건승인 30건 상세 테이블 */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-12">No</th>
                      <th className="py-2.5 px-3 min-w-[200px]">제품명 (모델규격, 품명)</th>
                      <th className="py-2.5 px-3 min-w-[180px]">요건승인번호 (26년)</th>
                      <th className="py-2.5 px-3 text-center min-w-[100px]">수입국</th>
                      <th className="py-2.5 px-3 font-mono min-w-[120px]">HSK No</th>
                      <th className="py-2.5 px-3 min-w-[220px]">인체등유해성물질 및 함량 (유독물질)</th>
                      <th className="py-2.5 px-3 font-mono min-w-[130px]">CAS No.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredLedger.length > 0 ? (
                      filteredLedger.map((item) => {
                        const isCurrentItem = 
                          currentApprovalStatus.isRegistered && 
                          currentApprovalStatus.approvalData?.no === item.no;

                        return (
                          <tr 
                            key={item.no} 
                            className={`transition hover:bg-blue-50/40 ${
                              isCurrentItem ? 'bg-emerald-50/80 font-medium' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center font-bold text-slate-600">
                              {item.no}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">
                                <span>{item.productName}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {item.approvalNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(item.approvalNumber)}
                                  className="text-slate-400 hover:text-blue-700 p-0.5"
                                  title="승인번호 복사"
                                >
                                  {copiedApproval === item.approvalNumber ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-800">
                              {item.importCountry}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold">
                              {item.hskNo}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="space-y-1">
                                {item.hazardousSubstance
                                  .split(',')
                                  .map((sub, idx) => (
                                    <div 
                                      key={idx} 
                                      className="text-slate-800 font-medium bg-slate-50 px-2 py-0.5 rounded text-xs leading-tight inline-block mr-1 sm:block sm:mr-0"
                                    >
                                      {sub.trim()}
                                    </div>
                                  ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                              {item.casNo ? (
                                <div className="space-y-1">
                                  {item.casNo.split(',').map((cas, idx) => (
                                    <div key={idx} className="text-xs leading-tight">
                                      {cas.trim()}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          <p className="font-semibold text-sm">검색어와 일치하는 등록 요건이 없습니다.</p>
                          <p className="text-xs text-slate-400 mt-1">다른 검색어로 조회해보시거나 미등록 품목 사전 승인 절차를 확인하세요.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* EM-2026 현황 대장 (별도 추가 내역) */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-slate-200 space-y-3.5">
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 font-black rounded text-[11px]">
                      EM-2026 현황
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      EM-2026 수입 요건승인번호 등록 품목 현황
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    EM(양극재/전구체/원소재) 수입 요건승인 등록 현황 내역입니다.
                  </p>
                </div>

                {/* EM No / 제품명 바로 위 검색 바 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <div className="relative w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emSearchKeyword}
                      onChange={(e) => setEmSearchKeyword(e.target.value)}
                      placeholder="EM 품명 / CAS No / 승인번호 / 유독물명칭 검색..."
                      className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs font-medium"
                    />
                    {emSearchKeyword && (
                      <button
                        type="button"
                        onClick={() => setEmSearchKeyword('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-medium shrink-0 self-end sm:self-auto">
                    조회 결과: <strong className="text-amber-800 font-bold">{filteredEmLedger.length}</strong>건 / 전체 7건
                  </div>
                </div>

                {/* EM-2026 테이블 (이미지 양식 1:1 반영) */}
                <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-2xs">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="text-slate-800 font-bold border-b border-slate-300">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12 bg-slate-300 text-slate-900 border-r border-slate-300">
                          NO
                        </th>
                        <th className="py-2.5 px-3 min-w-[220px] bg-slate-300 text-slate-900 border-r border-slate-300 text-center">
                          제품명
                        </th>
                        <th className="py-2.5 px-3 min-w-[180px] bg-slate-300 text-slate-900 border-r border-slate-300 text-center font-bold">
                          요건승인번호(26)
                        </th>
                        <th className="py-2.5 px-3 min-w-[140px] bg-slate-300 text-slate-900 border-r border-slate-300 text-center">
                          유독물명칭
                        </th>
                        <th className="py-2.5 px-3 min-w-[110px] bg-slate-300 text-slate-900 border-r border-slate-300 text-center">
                          함유량(%)
                        </th>
                        <th className="py-2.5 px-3 min-w-[130px] bg-slate-300 text-slate-900 text-center font-mono">
                          CAS NO
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredEmLedger.length > 0 ? (
                        filteredEmLedger.map((item) => {
                          const isCurrentItem = 
                            currentApprovalStatus.emApprovalData?.no === item.no ||
                            currentApprovalStatus.approvalData?.approvalNumber === item.approvalNumber;

                          return (
                            <tr 
                              key={item.no} 
                              className={`transition hover:bg-yellow-50/50 ${
                                isCurrentItem ? 'bg-amber-50/80 font-medium' : ''
                              }`}
                            >
                              {/* NO */}
                              <td className="py-2.5 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                                {item.no}
                              </td>

                              {/* 제품명 */}
                              <td className="py-2.5 px-3 font-semibold text-slate-900 border-r border-slate-200">
                                <div className="text-center">
                                  <span>{item.productName}</span>
                                </div>
                              </td>

                              {/* 요건승인번호(26) */}
                              <td className="py-2.5 px-3 border-r border-slate-200">
                                <div className="flex items-center justify-center gap-1.5">
                                  <span className="font-mono font-bold text-slate-950">
                                    {item.approvalNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(item.approvalNumber)}
                                    className="text-slate-400 hover:text-blue-700 p-0.5"
                                    title="승인번호 복사"
                                  >
                                    {copiedApproval === item.approvalNumber ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* 유독물명칭 */}
                              <td className="py-0 px-0 border-r border-slate-200">
                                <div className="divide-y divide-slate-200 text-center font-medium text-slate-900">
                                  {item.toxicItems.map((toxic, tIdx) => (
                                    <div key={tIdx} className="py-2 px-3">
                                      {toxic.toxicName}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* 함유량(%) */}
                              <td className="py-0 px-0 border-r border-slate-200">
                                <div className="divide-y divide-slate-200 text-center font-medium text-slate-900">
                                  {item.toxicItems.map((toxic, tIdx) => (
                                    <div key={tIdx} className="py-2 px-3">
                                      {toxic.contentPercent}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* CAS NO */}
                              <td className="py-0 px-0">
                                <div className="divide-y divide-slate-200 text-center font-mono font-semibold text-slate-700">
                                  {item.toxicItems.map((toxic, tIdx) => (
                                    <div key={tIdx} className="py-2 px-3">
                                      {toxic.casNo}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-slate-500">
                            <p className="font-semibold text-sm">일치하는 EM-2026 등록 요건이 없습니다.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* BM-화학물질명세내역 대장 (별도 추가 내역) */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-4 border-t border-slate-200 space-y-3.5">
                <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-500 text-white font-black rounded text-[11px]">
                      BM-화학물질명세내역
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      BM-화학물질명세내역 품목 현황 (총 126건)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    배터리 소재 및 화학물질 명세·모델규격 현황 관리 내역입니다.
                  </p>
                </div>

                {/* BM-화학물질명세내역 검색 바 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <div className="relative w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bmSpecSearchKeyword}
                      onChange={(e) => setBmSpecSearchKeyword(e.target.value)}
                      placeholder="제품명 / 모델·규격 / NO 검색..."
                      className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-xs placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-2xs font-medium"
                    />
                    {bmSpecSearchKeyword && (
                      <button
                        type="button"
                        onClick={() => setBmSpecSearchKeyword('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-medium shrink-0 self-end sm:self-auto">
                    조회 결과: <strong className="text-indigo-800 font-bold">{filteredBmSpecLedger.length}</strong>건 / 전체 126건
                  </div>
                </div>

                {/* BM-화학물질명세내역 테이블 (이미지 양식 1:1 반영: NO, 제품명, 모델·규격) */}
                <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-2xs max-h-[500px] overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse sticky-header">
                    <thead className="text-slate-800 font-bold border-b border-slate-300 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-16 bg-yellow-300 text-slate-950 font-black border-r border-yellow-400">
                          NO
                        </th>
                        <th className="py-2.5 px-4 min-w-[280px] bg-yellow-300 text-slate-950 font-black border-r border-yellow-400 text-center">
                          제품명
                        </th>
                        <th className="py-2.5 px-4 min-w-[340px] bg-yellow-300 text-slate-950 font-black text-center">
                          모델·규격
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {filteredBmSpecLedger.length > 0 ? (
                        filteredBmSpecLedger.map((item) => {
                          const isCurrentItem = 
                            currentApprovalStatus.allBmChemicalSpecMatches?.some(m => m.no === item.no);

                          return (
                            <tr 
                              key={item.no} 
                              className={`transition hover:bg-indigo-50/50 ${
                                isCurrentItem ? 'bg-indigo-50 font-medium' : ''
                              }`}
                            >
                              {/* NO */}
                              <td className="py-2.5 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                                {item.no}
                              </td>

                              {/* 제품명 */}
                              <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={item.no === 58 ? 'text-red-600 font-bold' : ''}>
                                    {item.productName}
                                  </span>
                                  {onSelectItemByName && (
                                    <button
                                      type="button"
                                      onClick={() => onSelectItemByName(item.productName)}
                                      className="text-[10px] text-indigo-600 hover:text-indigo-900 hover:underline px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 font-medium shrink-0"
                                      title="계산기 품명으로 적용"
                                    >
                                      적용
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* 모델·규격 */}
                              <td className="py-2.5 px-4 text-slate-800 font-mono">
                                <span className={item.no === 58 ? 'text-red-600 font-bold' : ''}>
                                  {item.modelSpec || '-'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-slate-500">
                            <p className="font-semibold text-sm">일치하는 BM-화학물질명세내역이 없습니다.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: 세관장확인 (관세법 제226조의 규정에 의한 세관장확인대상물품 및 확인방법 지정고시) */}
          {activeSubTab === 'customs' && (
            <div className="space-y-4">
              <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
                <Scale className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    [관세법 제226조에 따른 세관장확인제도]
                  </p>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    관세청장이 주무부장관과 협의하여 고시한 품목으로서, 통관 시 관세청 전자통관시스템(UNIPASS)을 통해 구비서류 및 인증·허가·신고 내역이 전자문서로 세관에 자동 통보·대조되어야만 수입신고 수리가 허용됩니다.
                  </p>
                </div>
              </div>

              {customsList.length > 0 ? (
                <div className="grid grid-cols-1 gap-3.5">
                  {customsList.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-900 text-white rounded text-xs font-bold">
                            법령 {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            ⚖️ {item.lawName}
                          </h4>
                        </div>
                        {item.electronicNoticeCode && (
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                            전자문서 연계코드: {item.electronicNoticeCode}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="md:col-span-2">
                          <span className="text-slate-500 font-semibold block mb-1">세관장확인 요건 및 확인방법 상세:</span>
                          <p className="text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed font-medium">
                            {item.requirementDetail}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-500 font-semibold block mb-1">확인·소관기관:</span>
                            <div className="bg-white p-2.5 rounded border border-slate-200 font-bold text-slate-900 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-blue-700" />
                              <span>{item.authority}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold block mb-1">필수 구비/전자확인서류:</span>
                            <div className="bg-white p-2.5 rounded border border-slate-200 font-medium text-blue-950 flex items-center gap-1.5">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{item.documentName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    세관장확인 비대상 (일반 통관) 품목입니다
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-lg mx-auto">
                    본 HS CODE({result.hsCode})는 관세법 제226조에 따른 세관장확인 대상 고시품목에 해당하지 않으므로, 별도의 사전 요건승인 전자통보 없이 표준 수입신고서 및 기본 통관서류(Invoice, Packing List 등)로 수입이 가능합니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 수출입공고 (대외무역법 제11조 및 수출입공고) */}
          {activeSubTab === 'exportImport' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 p-3.5 rounded-lg border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-950">
                <BookOpen className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    [대외무역법 제11조에 따른 수출입공고 기준]
                  </p>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    산업통상자원부장관이 고시하는 수출입공고에 따라 물품의 수입제한 여부, 수입자동승인(수입자유화) 여부 및 전략물자 수출입통제 대상을 심사합니다.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {exportImportList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          item.category.includes('자유화') 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          소관부처: {item.authority}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded border border-slate-200 text-xs leading-relaxed text-slate-800 font-medium">
                      <strong>공고 내용:</strong> {item.content}
                    </div>

                    {item.specialNotes && (
                      <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200 font-medium">
                        📌 <strong>수출입공고 비고:</strong> {item.specialNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 통합공고 (대외무역법 제12조 및 통합공고) */}
          {activeSubTab === 'integrated' && (
            <div className="space-y-4">
              <div className="bg-purple-50/60 p-3.5 rounded-lg border border-purple-200 flex items-start gap-2.5 text-xs text-purple-950">
                <Layers className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    [대외무역법 제12조에 따른 통합공고 기준]
                  </p>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    개별 법률(화학물질관리법, 화평법, 산안법, 전파법, 전안법, 원자력안전법 등)에서 정한 수출입 요건 및 절차를 종합 고시한 것으로, 수입자가 법령상 이행해야 하는 사전 등록·신고 및 사후관리 의무를 규정합니다.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {integratedList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-900 text-white rounded text-xs font-bold">
                          통합공고 {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          📜 {item.lawName}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-600">
                        주무관청: {item.authority}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-semibold block mb-0.5">요건 규정 전문:</span>
                        <p className="text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed font-medium">
                          {item.requirements}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block mb-0.5">수입 실무 절차 및 의무:</span>
                        <p className="text-purple-950 bg-purple-50/50 p-2.5 rounded border border-purple-200 leading-relaxed font-medium">
                          {item.procedure}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 실무 통관 가이드 & FTA PSR */}
          {activeSubTab === 'guide' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left: 통관 실무 주의사항 & 주무기관 */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>통관 시 실무 유의사항</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded border border-slate-200 font-medium">
                    {reg.clearanceNotes}
                  </p>
                  {reg.prohibitedIngredients && reg.prohibitedIngredients.length > 0 && (
                    <div className="mt-2.5 text-xs text-rose-800 bg-rose-50 p-2.5 rounded border border-rose-200">
                      <strong>반입 제한/주의 성분:</strong> {reg.prohibitedIngredients.join(', ')}
                    </div>
                  )}
                </div>

                {/* 필수 구비 및 인증 서류 */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase mb-2">
                    <FileCheck className="w-4 h-4 text-blue-700" />
                    <span>세관 제출 필수 구비서류 및 시험성적서</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {reg.requiredCertificates.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200">
                        <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800">{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 검사/승인 주무기관 */}
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
                  <Building className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <div>
                    <span className="text-slate-600 font-medium">검사/승인 주무기관: </span>
                    <span className="font-bold text-blue-950">{reg.inspectionAgency}</span>
                  </div>
                </div>
              </div>

              {/* Right: FTA 원산지결정기준 (PSR) & 증명방식 */}
              <div className="space-y-4">
                {origin ? (
                  <div className="bg-blue-50/40 rounded-lg p-4 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase">
                        <Stamp className="w-4 h-4 text-blue-700" />
                        <span>FTA 원산지결정기준 (PSR) 및 증명 방식</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded border border-blue-200">
                        {origin.originDocumentType}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded border border-blue-100 space-y-2.5 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 font-semibold text-[11px]">기준 코드:</span>
                        <span className="font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {origin.psrCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold text-[11px]">결정기준 해설: </span>
                        <span className="text-slate-800 font-medium">{origin.psrDescription}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                        <strong>원산지 증빙 주의사항:</strong> {origin.ftaNotes}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs text-slate-600">
                    선택된 품목에 대한 추가 PSR 기준 정보가 설정되어 있지 않습니다.
                  </div>
                )}

                {/* UNIPASS 요건확인 연계 절차 안내 */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>UNIPASS 전자통관시스템 요건확인 절차</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700 font-medium bg-white p-3 rounded border border-slate-200">
                    <li>물품 입항 전/후 주무기관 전자민원창구에 수입 요건 승인 신청</li>
                    <li>승인기관에서 세관 전산망(UNIPASS)으로 전자문서 연계 통보</li>
                    <li>관세사/수입자가 수입신고서 작성 시 [요건확인 승인번호] 기재</li>
                    <li>세관 전산에서 승인번호 및 발급내역 일치 여부 자동 심사 후 수리</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-500 font-medium">요건 현황:</span>
            {currentApprovalStatus.isRegistered ? (
              <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                ✅ 2026년 요건승인 등록 완료 ({currentApprovalStatus.approvalData?.approvalNumber})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-900 border border-rose-300">
                ⚠️ 요건 미등록 품목
              </span>
            )}
            <span className="text-slate-600">
              (등록대장 30건 / 세관장확인 {customsList.length}건 / 통합공고 {integratedList.length}건)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-blue-700 hover:text-blue-900 font-bold text-xs underline self-start sm:self-auto"
          >
            2026년 등록 대장 및 요건 법령 펼치기 →
          </button>
        </div>
      )}
    </div>
  );
};

