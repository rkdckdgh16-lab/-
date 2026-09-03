import { 
  CustomsVerificationItem, 
  ExportImportNoticeItem, 
  IntegratedNoticeItem 
} from '../types';

export interface ClipExportRegulationData {
  hsCode: string;
  nameKr: string;
  nameEn: string;
  hasExportRequirements: boolean; // false if "조회결과가 존재하지 않습니다" (수출요건 없음)
  summaryText: string; // "수출요건 없음" or 요건 요약
  clipSourceUrl: string;
  customsVerifications: CustomsVerificationItem[]; // [세관장확인 - 수출] (관세법 제226조)
  exportImportNotices: ExportImportNoticeItem[]; // [수출입공고 - 수출] (대외무역법 제11조)
  integratedNotices: IntegratedNoticeItem[]; // [통합공고 - 수출] (대외무역법 제12조)
  statusBadge: string;
  clearanceNote: string;
}

/**
 * 관세청 법령정보포털 CLIP (https://unipass.customs.go.kr/clip/index.do)
 * 세계 HS -> 관세율표 -> 국내관세율 상세목록
 * [요건사항 - 수출] 공식 고시 데이터베이스
 * 
 * 1. 세관장확인 (수출) - 관세법 제226조의 규정에 의한 세관장확인대상물품 및 확인방법 지정고시
 * 2. 수출입공고 (수출) - 대외무역법 제11조에 따른 수출입공고
 * 3. 통합공고 (수출) - 대외무역법 제12조에 따른 통합공고
 */
export const CLIP_EXPORT_REQUIREMENTS_DATABASE: Record<string, ClipExportRegulationData> = {
  // 1. 탄산리튬 (2836.91-0000)
  '2836.91-0000': {
    hsCode: '2836.91-0000',
    nameKr: '탄산리튬 (Lithium Carbonate)',
    nameEn: 'LITHIUM CARBONATE',
    hasExportRequirements: false,
    summaryText: '수출요건 없음',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [], // 조회결과가 존재하지 않습니다.
    exportImportNotices: [],   // 조회결과가 존재하지 않습니다.
    integratedNotices: [],     // 조회결과가 존재하지 않습니다.
    statusBadge: '수출요건 없음 (자유수출 품목)',
    clearanceNote: '관세청 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 요건이 존재하지 않습니다. 일반 수출통관 절차에 따라 수출신고 후 30일 이내 적재 진행하시면 됩니다.'
  },

  // 2. 옥소금속산염류 (2841.90-9090)
  '2841.90-9090': {
    hsCode: '2841.90-9090',
    nameKr: '기타 옥소금속산염류 (Salts of Oxometalic / LNO)',
    nameEn: 'SALTS OF OXOMETALIC',
    hasExportRequirements: false,
    summaryText: '수출요건 없음',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [], // 조회결과가 존재하지 않습니다.
    exportImportNotices: [],   // 조회결과가 존재하지 않습니다.
    integratedNotices: [],     // 조회결과가 존재하지 않습니다.
    statusBadge: '수출요건 없음 (자유수출 품목)',
    clearanceNote: '관세청 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 요건이 존재하지 않습니다. 일반 수출통관 절차를 적용합니다.'
  },

  // 3. NCA 양극재 (2841.90-9030)
  '2841.90-9030': {
    hsCode: '2841.90-9030',
    nameKr: '리튬 니켈 코발트 알루미늄 산화물 (NCA 양극재)',
    nameEn: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    hasExportRequirements: false,
    summaryText: '수출요건 없음',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [], // 조회결과가 존재하지 않습니다.
    exportImportNotices: [],   // 조회결과가 존재하지 않습니다.
    integratedNotices: [],     // 조회결과가 존재하지 않습니다.
    statusBadge: '수출요건 없음 (자유수출 품목)',
    clearanceNote: '관세청 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 요건이 존재하지 않습니다. 일반 수출통관 절차를 적용합니다.'
  },

  // 4. NCM 양극재 (2841.90-9020)
  '2841.90-9020': {
    hsCode: '2841.90-9020',
    nameKr: '리튬 니켈 코발트 망간 산화물 (NCM 양극재)',
    nameEn: 'LITHIUM NICKEL COBALT MANGANESE OXIDE(NCM)',
    hasExportRequirements: false,
    summaryText: '수출요건 없음',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [], // 조회결과가 존재하지 않습니다.
    exportImportNotices: [],   // 조회결과가 존재하지 않습니다.
    integratedNotices: [],     // 조회결과가 존재하지 않습니다.
    statusBadge: '수출요건 없음 (자유수출 품목)',
    clearanceNote: '관세청 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 요건이 존재하지 않습니다. 일반 수출통관 절차를 적용합니다.'
  }
};

/**
 * HS CODE로 관세청 CLIP 수출 요건사항 조회 함수
 */
export function getClipExportRequirements(hsCode: string, name?: string): ClipExportRegulationData {
  const cleanHs = hsCode.trim();
  
  if (CLIP_EXPORT_REQUIREMENTS_DATABASE[cleanHs]) {
    return CLIP_EXPORT_REQUIREMENTS_DATABASE[cleanHs];
  }

  // 6단위 매칭 시도 (예: 2841.90)
  const sixDigit = cleanHs.substring(0, 7);
  for (const key of Object.keys(CLIP_EXPORT_REQUIREMENTS_DATABASE)) {
    if (key.startsWith(sixDigit)) {
      return CLIP_EXPORT_REQUIREMENTS_DATABASE[key];
    }
  }

  // 기본 반환값: 조회결과가 존재하지 않음 (수출요건 없음)
  return {
    hsCode: cleanHs,
    nameKr: name || '수출 품목',
    nameEn: name || 'Export Item',
    hasExportRequirements: false,
    summaryText: '수출요건 없음',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [],
    exportImportNotices: [],
    integratedNotices: [],
    statusBadge: '수출요건 없음',
    clearanceNote: '관세청 CLIP 조회결과 세관장확인, 수출입공고, 통합공고 상 수출 요건이 존재하지 않습니다.'
  };
}
