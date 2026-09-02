import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculator';
import { 
  History, 
  Trash2, 
  RotateCcw, 
  Download, 
  Search, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HistoryAndBookmarksProps {
  records: CalculationResult[];
  onRestoreRecord: (record: CalculationResult) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  isCloudSynced: boolean;
}

export const HistoryAndBookmarks: React.FC<HistoryAndBookmarksProps> = ({
  records,
  onRestoreRecord,
  onDeleteRecord,
  onClearAll,
  isCloudSynced
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.hsCode.includes(searchTerm) ||
    r.exportCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.importCountry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCsv = () => {
    if (records.length === 0) return;
    const headers = ['품명', 'HS CODE', '수출국', '수입국', '관세율(%)', '관세(원)', '부가가치세(원)', '총금액(원)', '환율', '수입시 요건사항', '계산일시'];
    const rows = records.map(r => [
      `"${r.itemName.replace(/"/g, '""')}"`,
      `"${r.hsCode}"`,
      `"${r.exportCountry}"`,
      `"${r.importCountry}"`,
      r.tariffRate,
      r.tariffAmountKrw,
      r.vatAmountKrw,
      r.totalAmountKrw,
      r.exchangeRate,
      `"${r.importRegulationsSummary.replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('ko-KR')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `통상지원_관세계산이력_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-100 text-blue-900 rounded flex items-center justify-center font-bold">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                통상 업무 계산 이력 관리 (History & Sync)
              </h3>
              {isCloudSynced && (
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold">
                  ☁️ Firestore 클라우드 실시간 동기화됨
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              저장된 관세 계산 내역을 다시 불러오거나 CSV 데이터로 내보낼 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCsv}
            disabled={records.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 transition shadow-2xs disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>CSV 내보내기</span>
          </button>
          {records.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded border border-rose-200 font-medium transition"
              title="이력 전체 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>전체 비우기</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 text-xs font-bold transition shadow-2xs"
            title="통상 업무 계산 이력관리 섹션 숨기기/펼치기"
          >
            <span>이력관리 {isExpanded ? '접기' : '펼치기'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {isExpanded ? (
        <>
          {/* Filter and count */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="이력 검색 (품명, HS코드, 국가)"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          총 <strong className="text-slate-900 font-bold">{records.length}</strong>건 저장됨
        </span>
      </div>

      {/* Table list with Professional Polish styling */}
      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-2.5 border-r border-slate-200">일시</th>
                <th className="p-2.5 border-r border-slate-200">[품명]</th>
                <th className="p-2.5 border-r border-slate-200 text-center">[HS CODE]</th>
                <th className="p-2.5 border-r border-slate-200">통상 경로</th>
                <th className="p-2.5 border-r border-slate-200 text-right">[관세율]</th>
                <th className="p-2.5 border-r border-slate-200 text-right">[관세]</th>
                <th className="p-2.5 border-r border-slate-200 text-right">[부가가치세]</th>
                <th className="p-2.5 border-r border-slate-200 text-right bg-blue-50/50 text-blue-900">[총금액]</th>
                <th className="p-2.5 text-center">동작</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="p-2.5 border-r border-slate-200 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900 max-w-[150px] truncate" title={r.itemName}>
                    {r.itemName}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center whitespace-nowrap font-mono text-blue-700 bg-blue-50/50 font-bold">
                    {r.hsCode}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 whitespace-nowrap text-slate-700 font-medium">
                    {r.exportCountry} → {r.importCountry}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-right whitespace-nowrap">
                    <span className="font-bold text-slate-900 font-mono">
                      {r.tariffRate}%
                    </span>
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-right whitespace-nowrap font-bold text-slate-900 font-mono">
                    {formatCurrency(r.tariffAmountKrw, 'KRW')}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-right whitespace-nowrap text-slate-700 font-mono">
                    {formatCurrency(r.vatAmountKrw, 'KRW')}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-right whitespace-nowrap font-bold text-blue-900 bg-blue-50/30 font-mono">
                    {formatCurrency(r.totalAmountKrw, 'KRW')}
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onRestoreRecord(r)}
                        className="px-2 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 rounded border border-blue-200 transition flex items-center gap-1"
                        title="계산기 반영하기"
                      >
                        <RotateCcw className="w-3 h-3" /> 불러오기
                      </button>
                      {r.id && (
                        <button
                          onClick={() => onDeleteRecord(r.id!)}
                          className="p-1 hover:bg-rose-100 text-rose-500 rounded transition"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <Clock className="w-6 h-6 mx-auto mb-1.5 text-slate-400" />
          <p className="font-semibold text-slate-600">저장된 계산 이력이 없습니다.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">상단 계산기에서 [계산내역 저장] 버튼을 누르면 이력에 안전하게 보관됩니다.</p>
        </div>
      )}
    </>
  ) : (
    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 text-slate-600">
        <Clock className="w-4 h-4 text-blue-700" />
        <span>현재 보관된 통상 계산 이력: <strong className="text-slate-900">{records.length}건</strong></span>
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="text-blue-700 hover:text-blue-900 font-bold text-xs underline self-start sm:self-auto"
      >
        저장 이력 목록 및 검색 펼치기 →
      </button>
    </div>
  )}
    </div>
  );
};
