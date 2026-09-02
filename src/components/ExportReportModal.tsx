import React from 'react';
import { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculator';
import { 
  X, 
  Building2, 
  FileText,
  Download
} from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  userEmail?: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  result,
  userEmail
}) => {
  if (!isOpen) return null;

  const reg = result.importRegulationsFull;
  const docNumber = `TD-${Date.now().toString().slice(-8)}`;
  const dateStr = new Date().toLocaleDateString('ko-KR');

  // Standalone HTML report file download
  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>수입 관세,부가세 산출 내역서_${result.hsCode}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; background: #fff; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 900; color: #0f172a; margin: 4px 0 0 0; }
    .subtitle { font-size: 11px; font-weight: bold; color: #64748b; letter-spacing: 0.05em; }
    .meta { text-align: right; font-size: 11px; color: #64748b; }
    .section-title { font-size: 12px; font-weight: bold; color: #0f172a; margin: 16px 0 8px 0; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 11px; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 6px; }
    th, td { padding: 8px 10px; border: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: bold; text-align: left; }
    .total-row { background: #1e3a8a; color: #ffffff; font-weight: bold; font-size: 12px; }
    .total-row td { border-color: #1e3a8a; }
    .warning { color: #9a3412; font-weight: bold; }
    .text-right { text-align: right; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="no-print" style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px 16px; border-radius:6px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
    <span style="font-size:12px; font-weight:bold; color:#1e40af;">📄 수입 관세,부가세 산출 내역서</span>
    <button onclick="window.print()" style="background:#1e40af; color:#fff; border:none; padding:6px 14px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:12px;">인쇄 / PDF 저장</button>
  </div>

  <div class="header">
    <div>
      <div class="subtitle">통상지원팀 (TRADE & CUSTOMS SUPPORT DEPT.)</div>
      <h1 class="title">수입 관세,부가세 산출 내역서</h1>
    </div>
    <div class="meta">
      <div>문서번호: ${docNumber}</div>
      <div>작성일자: ${dateStr}</div>
      <div>작성자: ${userEmail || '통상지원 담당자'}</div>
    </div>
  </div>

  <div class="section-title">1. 기본 품목 및 교역 정보 (Trade Route & HS Item)</div>
  <div class="box grid">
    <div><strong>[품명]</strong><br>${result.itemName}</div>
    <div><strong>[HS CODE]</strong><br><span style="color:#1e40af; font-weight:bold;">${result.hsCode}</span></div>
    <div><strong>[수출국]</strong><br>${result.exportCountry}</div>
    <div><strong>[수입국]</strong><br>${result.importCountry}</div>
  </div>

  <div class="section-title">2. 관세·부가세 및 총소요비용 산출 명세 (Duty & Tax Breakdown)</div>
  <table>
    <thead>
      <tr>
        <th>항목</th>
        <th>적용 기준 및 세율</th>
        <th class="text-right">금액 (외화 ${result.currency})</th>
        <th class="text-right">금액 (KRW 원화)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>물품대금</td>
        <td>수량: ${result.quantity.toLocaleString()} / 단가: ${formatCurrency(result.unitPrice, result.currency)}</td>
        <td class="text-right">${formatCurrency(result.quantity * result.unitPrice, result.currency)}</td>
        <td class="text-right">${formatCurrency(result.itemValueKrw, 'KRW')}</td>
      </tr>
      <tr>
        <td>과세가격 (CIF 기준)</td>
        <td>${result.incoterms} 조건 반영</td>
        <td class="text-right">${formatCurrency(result.quantity * result.unitPrice, result.currency)}</td>
        <td class="text-right" style="font-weight:bold;">${formatCurrency(result.cifValueKrw, 'KRW')}</td>
      </tr>
      <tr style="background:#f0f7ff;">
        <td style="font-weight:bold; color:#1e40af;">[관세] (Customs Duty)</td>
        <td style="color:#1e40af; font-weight:bold;">[관세율] ${result.tariffRate}% (${result.tariffRateType} ${result.ftaAppliedName || ''})</td>
        <td class="text-right" style="color:#1e40af;">${formatCurrency(result.tariffAmountForeign, result.currency)}</td>
        <td class="text-right" style="font-weight:bold; color:#1e40af;">${formatCurrency(result.tariffAmountKrw, 'KRW')}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;">[부가가치세] (VAT)</td>
        <td>부가세율 ${result.vatRate}% (과세표준: 과세가격+관세)</td>
        <td class="text-right">${formatCurrency(result.vatAmountForeign, result.currency)}</td>
        <td class="text-right" style="font-weight:bold;">${formatCurrency(result.vatAmountKrw, 'KRW')}</td>
      </tr>
      <tr class="total-row">
        <td>[관,부가세 total]</td>
        <td>적용 [환율]: 1 ${result.currency} = ${formatNumber(result.exchangeRate)}원 (관세청 UNIPASS 수입환율)</td>
        <td class="text-right">${formatCurrency(result.totalAmountForeign, result.currency)}</td>
        <td class="text-right">${formatCurrency(result.totalAmountKrw, 'KRW')}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">3. [수입시 요건사항] 및 통관 컴플라이언스 (Regulatory Requirements)</div>
  <div class="box">
    <div><strong>세관장 확인구분:</strong> ${reg.isControlled ? '<span style="color:#c2410c; font-weight:bold;">확인대상 (사전인증/승인필)</span>' : '비대상 (일반통관)'}</div>
    <div><strong>근거 법령:</strong> ${reg.applicableLaws.join(' / ')}</div>
    <div><strong>구비 서류:</strong> ${reg.requiredCertificates.join(', ')}</div>
    <div><strong>검사 기관:</strong> ${reg.inspectionAgency}</div>
    <div style="margin-top:6px; padding-top:6px; border-top:1px solid #e2e8f0;" class="warning">
      <strong>주의사항:</strong> 화학물질 관리법 / 화평법 등의 수입요건이 있는경우, 반드시 환경안전팀 및 통상지원팀에 문의 바랍니다
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `수입관세_산출내역서_${result.hsCode.replace(/[^0-9]/g, '')}_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="report-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Modal Controls */}
        <div className="bg-blue-900 text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-bold">수입 관세,부가세 산출 내역서</span>
          </div>

          <div className="flex items-center gap-2">
            {/* HTML / 파일 다운로드 버튼 (유일한 내보내기 버튼) */}
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 active:scale-98 rounded transition shadow-sm"
              title="오프라인에서 바로 열어볼 수 있는 산출내역서 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              <span>파일 저장</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-slate-300 hover:text-white transition ml-1"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-6 h-6 text-blue-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  통상지원팀 (Trade & Customs Support Dept.)
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                수입 관세,부가세 산출 내역서
              </h1>
            </div>
            <div className="text-right text-xs text-slate-500 font-medium">
              <p>문서번호: {docNumber}</p>
              <p>작성일자: {dateStr}</p>
              <p>작성자: {userEmail || '통상지원 담당자'}</p>
            </div>
          </div>

          {/* 1. 기본 품목 및 교역 경로 정보 */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              1. 기본 품목 및 교역 정보 (Trade Route & HS Item)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">[품명]</span>
                <span className="font-bold text-slate-900">{result.itemName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">[HS CODE]</span>
                <span className="font-mono font-bold text-blue-800">{result.hsCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">[수출국]</span>
                <span className="font-semibold text-slate-800">{result.exportCountry}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-bold uppercase">[수입국]</span>
                <span className="font-bold text-slate-900">{result.importCountry}</span>
              </div>
            </div>
          </div>

          {/* 2. 과세 및 세액 산출 상세 테이블 */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              2. 관세·부가세 및 총소요비용 산출 명세 (Duty & Tax Breakdown)
            </h2>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 border-r border-slate-200">항목</th>
                    <th className="p-2.5 border-r border-slate-200">적용 기준 및 세율</th>
                    <th className="p-2.5 border-r border-slate-200 text-right">금액 (외화 {result.currency})</th>
                    <th className="p-2.5 text-right">금액 (KRW 원화)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="p-2.5 border-r border-slate-200">물품대금</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-500">수량: {result.quantity.toLocaleString()} / 단가: {formatCurrency(result.unitPrice, result.currency)}</td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono">{formatCurrency(result.quantity * result.unitPrice, result.currency)}</td>
                    <td className="p-2.5 text-right font-mono">{formatCurrency(result.itemValueKrw, 'KRW')}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border-r border-slate-200">과세가격 (CIF 기준)</td>
                    <td className="p-2.5 border-r border-slate-200 text-slate-500">{result.incoterms} 조건 반영</td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono">{formatCurrency(result.quantity * result.unitPrice, result.currency)}</td>
                    <td className="p-2.5 text-right font-bold font-mono text-slate-800">{formatCurrency(result.cifValueKrw, 'KRW')}</td>
                  </tr>
                  <tr className="bg-blue-50/50">
                    <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900">[관세] (Customs Duty)</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold text-blue-900">
                      [관세율] {result.tariffRate}% ({result.tariffRateType} {result.ftaAppliedName || ''})
                    </td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono text-blue-900">{formatCurrency(result.tariffAmountForeign, result.currency)}</td>
                    <td className="p-2.5 text-right font-bold font-mono text-blue-900">{formatCurrency(result.tariffAmountKrw, 'KRW')}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2.5 border-r border-slate-200 font-bold text-slate-900">[부가가치세] (VAT)</td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-700">부가세율 {result.vatRate}% (과세표준: 과세가격+관세)</td>
                    <td className="p-2.5 border-r border-slate-200 text-right font-mono text-slate-800">{formatCurrency(result.vatAmountForeign, result.currency)}</td>
                    <td className="p-2.5 text-right font-bold font-mono text-slate-900">{formatCurrency(result.vatAmountKrw, 'KRW')}</td>
                  </tr>
                  <tr className="bg-blue-900 text-white font-bold">
                    <td className="p-3 border-r border-blue-800">[관,부가세 total]</td>
                    <td className="p-3 border-r border-blue-800 text-blue-200">적용 [환율]: 1 {result.currency} = {formatNumber(result.exchangeRate)}원 (관세청 UNIPASS 수입환율)</td>
                    <td className="p-3 border-r border-blue-800 text-right font-mono text-blue-200">{formatCurrency(result.totalAmountForeign, result.currency)}</td>
                    <td className="p-3 text-right text-base text-white font-mono">{formatCurrency(result.totalAmountKrw, 'KRW')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. 수입시 요건사항 및 통관 규제 */}
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-900"></span>
              3. [수입시 요건사항] 및 통관 컴플라이언스 (Regulatory Requirements)
            </h2>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">세관장 확인구분:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${reg.isControlled ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                  {reg.isControlled ? '확인대상 (사전인증/승인필)' : '비대상 (일반통관)'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-700">근거 법령: </span>
                <span>{reg.applicableLaws.join(' / ')}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">구비 서류: </span>
                <span>{reg.requiredCertificates.join(', ')}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">검사 기관: </span>
                <span>{reg.inspectionAgency}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-700">
                <strong className="text-amber-900 font-bold">주의사항: </strong> 화학물질 관리법 / 화평법 등의 수입요건이 있는경우, 반드시 환경안전팀 및 통상지원팀에 문의 바랍니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

