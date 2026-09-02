import { 
  CustomsVerificationItem, 
  ExportImportNoticeItem, 
  IntegratedNoticeItem, 
  ImportRegulation 
} from '../types';

export interface ClipImportRegulationData {
  hsCode: string;
  nameKr: string;
  nameEn: string;
  isControlled: boolean;
  applicableLaws: string[];
  requiredCertificates: string[];
  inspectionAgency: string;
  clearanceNotes: string;
  prohibitedIngredients?: string[];
  clipSourceUrl: string;
  customsVerifications: CustomsVerificationItem[];
  exportImportNotices: ExportImportNoticeItem[];
  integratedNotices: IntegratedNoticeItem[];
}

/**
 * 관세청 법령정보포털 CLIP (https://unipass.customs.go.kr/clip/index.do)
 * 세계 HS -> 관세율표 -> 국내관세율 상세목록
 * [요건사항 - 수입] 공식 고시 데이터베이스
 * 
 * 1. 세관장확인 (관세법 제226조 세관장확인대상물품 및 확인방법 지정고시)
 * 2. 수출입공고 (대외무역법 제11조 및 수출입공고)
 * 3. 통합공고 (대외무역법 제12조 및 통합공고)
 */
export const CLIP_IMPORT_REQUIREMENTS_DATABASE: Record<string, ClipImportRegulationData> = {
  // =========================================================================
  // 1. 니켈 코발트 망간 복합수산화물 (NCM 전구체) - 2825.90-2050
  // =========================================================================
  '2825.90-2050': {
    hsCode: '2825.90-2050',
    nameKr: '니켈·코발트·망간 복합수산화물 (NCM 전구체)',
    nameEn: 'NICKEL COBALT MANGANESE HYDROXIDE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법 (화관법)',
      '화학물질의 등록 및 평가 등에 관한 법률 (화평법)',
      '산업안전보건법 제110조 (산안법 MSDS)'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (한국화학물질관리협회 KCMA)',
      '화평법 제조·수입 등록/신고확인증 (국립환경과학원/환경청)',
      '물질안전보건자료(MSDS) 국문본 및 공단 제출번호',
      'COA (공인 성분분석 시험성적서)'
    ],
    inspectionAgency: '환경부 (유역·지방환경청), 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '통관 전 화학물질관리협회(KCMA)에 화학물질확인명세서 전산 제출 필수. 관세청 통관시스템(UNIPASS)과 요건확인 연계되어 세관장확인번호가 자동 대조됩니다.',
    prohibitedIngredients: ['미등록 신규화학물질 및 기준초과 제한/금지물질'],
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '다음의 것은 한국화학물질관리협회장에게 화학물질확인명세서 제출확인을 받은 물품(전자문서로 세관에 통보된 것에 한함). 단, 화학물질관리법 제9조에 따른 화학물질 확인대상 화학물질에 한함.',
        documentName: '화학물질 확인명세서 (전자문서)',
        electronicNoticeCode: 'KCMA (1510)'
      },
      {
        lawName: '화학물질의 등록 및 평가 등에 관한 법률',
        authority: '국립환경과학원장 / 유역·지방환경청장',
        requirementDetail: '연간 1톤 이상 수입하는 기존화학물질 또는 신규화학물질로서 국립환경과학원장 또는 유역환경청장에게 제조·수입 등록 또는 신고를 필하고 발급받은 확인서(전자문서 연계 대상).',
        documentName: '화학물질 제조·수입 등록(신고)확인증',
        electronicNoticeCode: 'MOE (1515)'
      },
      {
        lawName: '산업안전보건법',
        authority: '고용노동부장관 / 한국산업안전보건공단',
        requirementDetail: '화학물질 또는 혼합물을 수입하려는 자는 고용노동부령으로 정하는 물질안전보건자료(MSDS)를 작성하여 공단 전산망에 제출하고 발급받은 제출번호를 수입신고서에 기재하여야 함.',
        documentName: 'MSDS 제출번호 및 물질안전보건자료',
        electronicNoticeCode: 'MOEL (1710)'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입제한물품에 해당하지 아니하며, 대외무역법 제11조에 따른 수입자동승인 품목임.',
        specialNotes: '단, 대외무역법 제19조 및 전략물자 수출입고시 별표2에 따른 이중용도 화학물질 해당 여부 사전 판정 준수'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조 (화학물질의 확인)',
        authority: '환경부',
        requirements: '화학물질을 수입하려는 자는 수입 전에 화학물질에 포함된 화학물질이 유독물질, 허가물질, 제한물질, 금지물질, 사고대비물질에 해당하는지 여부를 확인하여 환경부령으로 정하는 확인명세서를 한국화학물질관리협회에 제출하여야 함.',
        procedure: '수입 통관 전 한국화학물질관리협회(KCMA) 전자민원창구를 통해 수입확인명세서 작성·제출 ➔ 승인번호 발급 ➔ UNIPASS 수입신고서 란에 입력.'
      },
      {
        lawName: '화학물질의 등록 및 평가 등에 관한 법률 제10조 (화학물질의 등록 등)',
        authority: '환경부 (국립환경과학원)',
        requirements: '연간 1톤 이상 기존화학물질을 수입하거나 신규화학물질을 수입하려는 자는 수입 전에 화학물질의 용도 및 유해성·위험성에 관한 정보를 환경부장관에게 등록하여야 함.',
        procedure: '화학물질정보처리시스템(K-REACH) 등록증명서 구비 후 통관 진행.'
      },
      {
        lawName: '산업안전보건법 제110조 (물질안전보건자료의 작성 및 제출)',
        authority: '고용노동부',
        requirements: '물질안전보건자료대상물질을 수입하는 자는 제조·수입 전에 고용노동부장관이 지정하는 전산시스템을 통해 MSDS 및 비공개승인 심사를 필하여야 함.',
        procedure: '안전보건공단 MSDS 전산시스템 등록 ➔ 국문 경고표지 포장 부착 ➔ 수입신고서 기재.'
      }
    ]
  },

  // =========================================================================
  // 2. 니켈 코발트 망간 복합산화물 (NCMO 전구체) - 2825.90-1090
  // =========================================================================
  '2825.90-1090': {
    hsCode: '2825.90-1090',
    nameKr: '니켈·코발트·망간 복합산화물 (NCMO/NMAO Oxide)',
    nameEn: 'NICKEL COBALT MANGANESE OXIDE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법',
      '화학물질의 등록 및 평가 등에 관한 법률',
      '산업안전보건법 제110조'
    ],
    requiredCertificates: [
      '화학물질 수입확인명세서 (KCMA 확인)',
      'MSDS (물질안전보건자료 국문본)',
      '화평법 등록증명서 (연간 1톤 이상 수입 시)',
      '원료 성분분석표 (COA)'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '통관 시 수입신고서 란별로 화학물질관리법 세관장 확인번호 기재 필수. 포장 및 라벨에 GHS 경고표지 부착 확인.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필한 물품(전자문서로 세관에 통보된 것에 한함).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      },
      {
        lawName: '산업안전보건법',
        authority: '한국산업안전보건공단',
        requirementDetail: 'MSDS 전산 제출번호 발급 확인 및 수입신고서 기재.',
        documentName: 'MSDS 제출확인서',
        electronicNoticeCode: 'MOEL'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '대외무역법 제11조에 따른 수입자유화 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '수입 전 유독/제한/사고대비물질 여부 확인 및 확인명세서 제출.',
        procedure: 'KCMA 수입확인명세서 제출 ➔ 전산연계 ➔ 세관 수입신고.'
      },
      {
        lawName: '산업안전보건법 제110조',
        authority: '고용노동부',
        requirements: 'MSDS 작성 및 유해성·위험성 정보 제공 의무.',
        procedure: '공단 MSDS 시스템 등록 및 경고표지 부착.'
      }
    ]
  },

  // =========================================================================
  // 3. 니켈 코발트 알루미늄 산화물 전구체 - 2825.90-1040
  // =========================================================================
  '2825.90-1040': {
    hsCode: '2825.90-1040',
    nameKr: '니켈·코발트·알루미늄 복합산화물 (NCA Oxide)',
    nameEn: 'NICKEL COBALT ALUMINIUM OXIDE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법',
      '화학물질의 등록 및 평가 등에 관한 법률',
      '산업안전보건법'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (KCMA)',
      '화평법 등록확인서',
      'MSDS 국문본 및 공단 제출번호',
      'COA 시험성적서'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '화학물질관리법 제9조에 따른 수입확인명세서 제출 및 통관 전 전산 연계 확인 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필한 물품 (전자문서 통보 필수).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 확인명세서 제출 및 심사.',
        procedure: '전자문서 제출 후 세관 확인.'
      }
    ]
  },

  // =========================================================================
  // 4. 기타 니켈 복합수산화물 (NCA/NCMA Hydroxide) - 2825.90-2090
  // =========================================================================
  '2825.90-2090': {
    hsCode: '2825.90-2090',
    nameKr: '기타 니켈 복합수산화물 (NCA/NC/NCMA/NMA Hydroxide)',
    nameEn: 'OTHER NICKEL HYDROXIDES',
    isControlled: true,
    applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
    requiredCertificates: ['화학물질 확인명세서 (KCMA)', '화평법 등록증', 'MSDS 국문본', 'COA'],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '통관 전 화학물질관리협회 수입확인명세 제출 및 화학물질관리법 제9조 요건 확인 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '화학물질확인명세서 확인을 받은 물품(전자문서로 세관에 통보된 것에 한함).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 대상.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 수입 사전 확인명세서 제출.',
        procedure: 'KCMA 전자신청 ➔ 승인 ➔ 수입신고.'
      }
    ]
  },

  // =========================================================================
  // 5. NCA 리튬 복합산화물 양극재 - 2841.90-9030
  // =========================================================================
  '2841.90-9030': {
    hsCode: '2841.90-9030',
    nameKr: '리튬 니켈 코발트 알루미늄 산화물 (NCA 양극활물질)',
    nameEn: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법 (화관법)',
      '화학물질의 등록 및 평가 등에 관한 법률 (화평법)',
      '산업안전보건법 제110조',
      '대외무역법 (전략물자 통제 여부)'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (한국화학물질관리협회 KCMA)',
      '화평법 제조·수입 등록확인서 (환경청)',
      'MSDS (물질안전보건자료 국문본)',
      'COA (공인 시험성적서)'
    ],
    inspectionAgency: '환경부 (유역·지방환경청), 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '이차전지 핵심소재 할당관세(0%) 적용 가능 여부 및 화학물질관리법 제9조 세관장확인번호 사전 취득 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 받은 물품(전자문서로 세관에 통보된 것에 한함).',
        documentName: '화학물질 확인명세서 (전자문서)',
        electronicNoticeCode: 'KCMA'
      },
      {
        lawName: '화학물질의 등록 및 평가 등에 관한 법률',
        authority: '환경부 (국립환경과학원장)',
        requirementDetail: '연간 1톤 이상 수입 시 기존화학물질 등록증명서 또는 신규화학물질 등록확인.',
        documentName: '화평법 제조·수입 등록증',
        electronicNoticeCode: 'MOE'
      },
      {
        lawName: '산업안전보건법',
        authority: '고용노동부장관',
        requirementDetail: 'MSDS 작성 및 공단 시스템 등록번호 부여.',
        documentName: 'MSDS 및 제출승인번호',
        electronicNoticeCode: 'MOEL'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목이나 전략물자 판정 확인 권고.',
        specialNotes: '미국 IRA 핵심광물 적격 원산지 요건 증명 서류 사전 구비 권장'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 수입자는 사전에 한국화학물질관리협회에 확인명세서 제출 의무.',
        procedure: '수입신고 전 KCMA 시스템 제출 ➔ 접수번호 수입신고서 기재.'
      },
      {
        lawName: '산업안전보건법 제110조',
        authority: '고용노동부',
        requirements: '화학물질 양도·제공 시 국문 MSDS 제공 및 경고표지 부착.',
        procedure: '용기 포장별 GHS 라벨 부착 및 통관.'
      }
    ]
  },

  // =========================================================================
  // 6. NCM 리튬 복합산화물 양극재 - 2841.90-9020
  // =========================================================================
  '2841.90-9020': {
    hsCode: '2841.90-9020',
    nameKr: '리튬 니켈 코발트 망간 산화물 (NCM 양극활물질)',
    nameEn: 'LITHIUM NICKEL COBALT MANGANESE OXIDE(NCM)',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법',
      '화학물질의 등록 및 평가 등에 관한 법률',
      '산업안전보건법 제110조'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (KCMA 확인)',
      'MSDS (물질안전보건자료 국문본)',
      '화평법 등록증명서',
      'COA 성분분석표'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '통관 시 수입신고서 란별로 화학물질관리법 세관장 확인번호 기재 필수. 포장 및 라벨에 GHS 경고표지 부착 여부 확인.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 받은 물품(전자문서 통보).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      },
      {
        lawName: '산업안전보건법',
        authority: '한국산업안전보건공단',
        requirementDetail: 'MSDS 작성 및 전산시스템 제출번호 발급 확인.',
        documentName: 'MSDS 제출확인서',
        electronicNoticeCode: 'MOEL'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 수입 사전 확인명세서 제출 및 적합 승인.',
        procedure: '전자문서 제출 후 세관 통관 전산 대조.'
      }
    ]
  },

  // =========================================================================
  // 7. LFP 리튬 인산철 무기염 양극재 - 2842.90-9000
  // =========================================================================
  '2842.90-9000': {
    hsCode: '2842.90-9000',
    nameKr: '리튬 인산철 무기염 (LFP 양극활물질 / Non-Carbon Coated)',
    nameEn: 'LFP(LITHIUM FERRO PHOSPHATE)',
    isControlled: true,
    applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
    requiredCertificates: [
      '화학물질 수입확인명세서 (KCMA 확인)',
      'MSDS (물질안전보건자료)',
      '화평법 등록증명서',
      'COA'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '리튬 인산철 무기염류 수입 시 화학물질관리법 세관장 확인번호 및 MSDS 국문본 필수 제출.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필한 물품 (전자문서 통보).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 대상.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 확인명세서 제출.',
        procedure: 'KCMA 시스템 승인 후 수입신고.'
      }
    ]
  },

  // =========================================================================
  // 8. LFP 탄소 코팅 양극재 복합물 - 3824.99-9090
  // =========================================================================
  '3824.99-9090': {
    hsCode: '3824.99-9090',
    nameKr: '탄소 코팅된 리튬 인산철 복합화합물 / 기타 화학조제품',
    nameEn: 'LFP CARBON COATED / CHEMICAL PREPARATIONS',
    isControlled: true,
    applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법 제110조'],
    requiredCertificates: [
      '화학물질 확인명세서 (KCMA)',
      '화평법 등록확인서',
      'MSDS 국문본',
      '조제품 구성 성분명세서 (100% Formulation)'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '혼합물질의 경우 전 구성 성분(CAS No.)에 대한 확인명세서 제출 및 유독물질 함유 여부 심사 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '혼합물질 전 성분에 대하여 한국화학물질관리협회장에게 화학물질확인명세서 확인을 받은 물품.',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 대상.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '화학물질 제조·수입 사전 확인명세서 제출.',
        procedure: 'KCMA 전자문서 제출 ➔ 세관 전산연계.'
      }
    ]
  },

  // =========================================================================
  // 9. 수산화리튬 - 2825.20-1000
  // =========================================================================
  '2825.20-1000': {
    hsCode: '2825.20-1000',
    nameKr: '수산화리튬 (LITHIUM HYDROXIDE MONOHYDRATE)',
    nameEn: 'LITHIUM HYDROXIDE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법 (유독물질 해당 시 수입신고 필수)',
      '화학물질의 등록 및 평가 등에 관한 법률',
      '산업안전보건법 (강알칼리 부식성 물질 관리)'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (한국화학물질관리협회 KCMA)',
      '유독물질 수입신고필증 (유역환경청장 - 해당 시)',
      'MSDS 국문본 및 공단 제출번호',
      'COA (순도 및 수분함량 검사서)'
    ],
    inspectionAgency: '환경부 (유역·지방환경청), 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '수산화리튬은 강부식성 유독물질로 지정되어 있어 화학물질관리법상 유독물질 수입신고서 및 보관시설 적합 여부 확인이 필수적입니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장 / 유역(지방)환경청장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필한 물품. 유독물질에 해당하는 경우 유역(지방)환경청장에게 유독물질 수입신고를 필한 확인서.',
        documentName: '화학물질확인명세서 / 유독물질 수입신고확인증',
        electronicNoticeCode: 'KCMA / MOE'
      },
      {
        lawName: '산업안전보건법',
        authority: '한국산업안전보건공단',
        requirementDetail: '부식성 유해화학물질 MSDS 전산 제출번호 확인.',
        documentName: 'MSDS 제출확인서',
        electronicNoticeCode: 'MOEL'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목 (핵심광물 공급망 관리 대상).'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조, 제20조',
        authority: '환경부',
        requirements: '화학물질확인명세서 제출 및 유독물질 수입신고 의무 준수.',
        procedure: '수입 전 KCMA 명세서 제출 및 관할 환경청 유독물질 신고 ➔ 통관.'
      }
    ]
  },

  // =========================================================================
  // 10. 탄산리튬 - 2836.91-1000
  // =========================================================================
  '2836.91-1000': {
    hsCode: '2836.91-1000',
    nameKr: '탄산리튬 (LITHIUM CARBONATE)',
    nameEn: 'LITHIUM CARBONATE',
    isControlled: true,
    applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
    requiredCertificates: [
      '화학물질 수입확인명세서 (KCMA 확인)',
      '화평법 등록확인서',
      'MSDS 국문본',
      'COA'
    ],
    inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
    clearanceNotes: '통관 전 화학물질관리협회(KCMA) 수입확인명세서 제출 및 화평법 등록 여부 확인.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필한 물품 (전자문서 통보).',
        documentName: '화학물질 확인명세서',
        electronicNoticeCode: 'KCMA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 대상.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조',
        authority: '환경부',
        requirements: '수입 전 화학물질확인명세서 제출.',
        procedure: '전자문서 제출 및 세관 대조.'
      }
    ]
  },

  // =========================================================================
  // 11. 황산니켈 - 2833.24-0000
  // =========================================================================
  '2833.24-0000': {
    hsCode: '2833.24-0000',
    nameKr: '황산니켈 (NICKEL SULPHATE)',
    nameEn: 'NICKEL SULPHATE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법 (유독물질 및 제한물질)',
      '화학물질의 등록 및 평가 등에 관한 법률',
      '산업안전보건법 제110조 (특수건강진단 대상물질)'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (한국화학물질관리협회 KCMA)',
      '유독물질 수입신고서 (유역환경청)',
      'MSDS 국문본 및 공단 제출번호',
      'COA'
    ],
    inspectionAgency: '환경부, 유역환경청, 고용노동부',
    clearanceNotes: '황산니켈은 유독물질에 해당하므로 수입 전 유역환경청 유독물질 수입신고필증 및 화학물질관리협회 명세서 제출 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장 / 유역환경청장',
        requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 필하고, 유역환경청장에게 유독물질 수입신고를 필한 물품.',
        documentName: '화학물질확인명세서 및 유독물질 수입신고필증',
        electronicNoticeCode: 'KCMA / MOE'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조, 제20조',
        authority: '환경부',
        requirements: '유독물질 수입자는 환경부령으로 정하는 바에 따라 관할 유역환경청장에게 신고하여야 함.',
        procedure: 'KCMA 명세서 제출 ➔ 환경청 유독물질 신고 ➔ 통관.'
      }
    ]
  },

  // =========================================================================
  // 12. 황산코발트 - 2833.29-1000
  // =========================================================================
  '2833.29-1000': {
    hsCode: '2833.29-1000',
    nameKr: '황산코발트 (COBALT SULPHATES)',
    nameEn: 'COBALT SULPHATES',
    isControlled: true,
    applicableLaws: ['화학물질관리법 (유독물질)', '화평법', '산업안전보건법'],
    requiredCertificates: ['화학물질 확인명세서', '유독물질 수입신고필증', 'MSDS', 'COA'],
    inspectionAgency: '환경부, 유역환경청, 고용노동부',
    clearanceNotes: '유독물질 수입신고필증 및 화학물질 수입확인명세서 세관장확인번호 사전 취득 필수.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장 / 유역환경청장',
        requirementDetail: '화학물질확인명세서 및 유독물질 수입신고 확인을 필한 물품.',
        documentName: '화학물질확인명세서 / 유독물질신고필증',
        electronicNoticeCode: 'KCMA / MOE'
      }
    ],
    exportImportNotices: [
      { category: '수입자유화(자동승인)', authority: '산업통상자원부', content: '수출입공고상 수입자유화 대상.' }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조, 제20조',
        authority: '환경부',
        requirements: '유독물질 수입신고 및 확인명세서 제출.',
        procedure: '전자문서 제출 및 세관 통관 전산 대조.'
      }
    ]
  },

  // =========================================================================
  // 13. 리튬이온 축전지 배터리 - 8507.60-2000
  // =========================================================================
  '8507.60-2000': {
    hsCode: '8507.60-2000',
    nameKr: '리튬이온 축전지 (전기자동차용 배터리 모듈/팩)',
    nameEn: 'LITHIUM-ION ACCUMULATORS',
    isControlled: true,
    applicableLaws: [
      '전기용품 및 생활용품 안전관리법 (전안법)',
      '전파법 제58조의2 (BMS 통신회로 내장 시)',
      '폐기물의 국가간 이동 및 그 처리에 관한 법률 (폐전지 해당 시)'
    ],
    requiredCertificates: [
      'KC 안전인증서 또는 안전확인신고필증 (한국기계전기전자시험연구원 KTC/KTL)',
      '방송통신기자재등의 적합성평가확인서 (국립전파연구원 - 해당 시)',
      'UN38.3 위험물 안전수송 시험성적서',
      '제조사 사양서(Specification Sheet)'
    ],
    inspectionAgency: '국가기술표준원 (한국산업기술시험원 KTL / KTC), 국립전파연구원, 환경부',
    clearanceNotes: '단전지 에너지밀도 400Wh/L 이상의 리튬이온 축전지 또는 이동형 배터리는 KC 안전확인신고필증 또는 면제확인서가 필수적이며, UN38.3 항공/해상 운송승인이 요구됩니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '전기용품 및 생활용품 안전관리법',
        authority: '안전인증기관 (KTC/KTR/KTL 등)',
        requirementDetail: '안전인증기관의 안전확인신고를 필하거나 안전인증 면제확인을 받은 물품(전자문서로 세관에 통보된 것에 한함). 단, 전기용품안전관리 대상 리튬이차전지(단전지 에너지밀도 400Wh/L 이상 등)에 한함.',
        documentName: '안전확인신고필증 또는 면제확인서',
        electronicNoticeCode: 'KATS (전안법)'
      },
      {
        lawName: '전파법',
        authority: '국립전파연구원장',
        requirementDetail: 'BMS(배터리관리시스템) 내 유무선 통신 기능(CAN/Bluetooth/LTE 등)이 포함된 경우 국립전파연구원장의 적합성평가확인서 또는 면제확인서를 교부받은 물품.',
        documentName: '방송통신기자재 적합등록필증/면제확인서',
        electronicNoticeCode: 'RRA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부 / 환경부',
        content: '신품 배터리는 수입자유화 대상이나, 폐배터리(사용후 배터리)의 경우 폐기물의 국가간 이동법에 따른 수입허가 필요.',
        specialNotes: '자원의 절약과 재활용촉진에 관한 법률상 생산자책임재활용(EPR) 의무 대상 여부 확인'
      }
    ],
    integratedNotices: [
      {
        lawName: '전기용품 및 생활용품 안전관리법 제15조 (안전확인대상전기용품의 신고 등)',
        authority: '산업통상자원부 (국가기술표준원)',
        requirements: '안전확인대상전기용품을 수입하려는 자는 모델별로 안전확인시험을 거쳐 안전인증기관에 안전확인신고를 하여야 함.',
        procedure: '지정 공인시험기관 UN38.3 및 KC 안전확인 시험 ➔ 신고필증 수령 ➔ 통관.'
      },
      {
        lawName: '전파법 제58조의2 (방송통신기자재등의 적합성평가)',
        authority: '과학기술정보통신부 (국립전파연구원)',
        requirements: '방송통신기자재를 수입하려는 자는 적합성평가를 받아야 함.',
        procedure: '국립전파연구원 전자민원센터 적합등록 또는 시험연구용 면제신청.'
      }
    ]
  },

  // =========================================================================
  // 14. 배터리 시험검사장비 / 데이터수집장치 - 9031.80-9099
  // =========================================================================
  '9031.80-9099': {
    hsCode: '9031.80-9099',
    nameKr: '배터리 충방전 검사시스템 / 측정장비 (BATTERY TESTING SYSTEM)',
    nameEn: 'BATTERY TESTING SYSTEM / DATA ACQUISITION MODULE',
    isControlled: true,
    applicableLaws: [
      '전파법 제58조의2 (방송통신기자재등의 적합성평가)',
      '전기용품 및 생활용품 안전관리법'
    ],
    requiredCertificates: [
      '방송통신기자재등의 적합등록필증 또는 면제확인서 (국립전파연구원)',
      'KC 적합성평가 확인서 (산업용/연구개발용 면제확인서 가능)',
      '제조사 카탈로그 및 사양서'
    ],
    inspectionAgency: '과학기술정보통신부 (국립전파연구원), 국립전파시험인증센터',
    clearanceNotes: '산업용 검사장비 및 데이터수집 모듈은 전파법상 적합성평가(KC 방송통신기자재 적합등록) 대상이며, 연구개발용·공장생산설비용으로 수입 시 국립전파연구원에 사전 면제확인 신청이 가능합니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '전파법',
        authority: '국립전파연구원장',
        requirementDetail: '국립전파연구원장에게 방송통신기자재등의 적합성평가확인서 또는 시험·연구개발용 면제확인서를 교부받은 물품 (전자문서 통보).',
        documentName: '적합등록필증 또는 적합성평가 면제확인서',
        electronicNoticeCode: 'RRA (1520)'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 수입자유화 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '전파법 제58조의2, 제58조의3',
        authority: '과학기술정보통신부',
        requirements: '전기·전자기기 수입 시 전자파 적합성평가 등록 또는 면제 승인 의무.',
        procedure: '국립전파연구원 전산포털(rra.go.kr)에 전자파 시험성적서 제출 또는 연구용 면제 신청 ➔ 면제확인번호 수입신고서 기재.'
      }
    ]
  },

  // =========================================================================
  // 15. X-ray 검사장치 (비파괴검사기) - 9022.19-2000
  // =========================================================================
  '9022.19-2000': {
    hsCode: '9022.19-2000',
    nameKr: 'X선 검사장치 (APPARATUS BASED ON THE USE OF X-RAYS / D8 ENDEAVOR)',
    nameEn: 'APPARATUS BASED ON THE USE OF X-RAYS',
    isControlled: true,
    applicableLaws: [
      '원자력안전법 제53조 (방사선발생장치 수입허가)',
      '전파법 제58조의2 (방송통신기자재 적합등록)',
      '대외무역법 (전략물자 통제목록 해당 여부)'
    ],
    requiredCertificates: [
      '원자력안전위원회 방사선발생장치 수입허가증 또는 신고필증',
      '한국원자력안전기술원(KINS) 검사확인서',
      '전파법 적합성평가 면제확인서',
      'X-ray 튜브 규격서 및 방사선 차폐 성능성적서'
    ],
    inspectionAgency: '원자력안전위원회, 한국원자력안전기술원(KINS), 국립전파연구원',
    clearanceNotes: 'X-ray 발생장치는 원자력안전법에 따라 원자력안전위원회의 사전 수입허가를 반드시 득해야 하며, 세관 통관 전 전산 연계 확인번호가 필수적입니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '원자력안전법',
        authority: '원자력안전위원회위원장 / 한국원자력안전기술원장',
        requirementDetail: '원자력안전위원회위원장에게 방사선발생장치 생산·수입허가를 받은 자가 발급받은 수입허가증 또는 수입신고필증(전자문서로 세관에 통보된 것에 한함).',
        documentName: '방사선발생장치 수입허가증/신고필증',
        electronicNoticeCode: 'NSSC (원자력)'
      },
      {
        lawName: '전파법',
        authority: '국립전파연구원장',
        requirementDetail: '국립전파연구원장의 적합성평가 면제확인서 또는 적합등록필증.',
        documentName: '적합성평가 확인서/면제확인서',
        electronicNoticeCode: 'RRA'
      }
    ],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부 / 원자력안전위원회',
        content: '수출입공고상 수입자유화 대상이나 전략물자 및 방사선 안전규제 특별관리 품목.'
      }
    ],
    integratedNotices: [
      {
        lawName: '원자력안전법 제53조 (방사선발생장치의 생산·수입 허가)',
        authority: '원자력안전위원회',
        requirements: '방사선발생장치를 수입하려는 자는 대통령령으로 정하는 바에 따라 위원회의 허가를 받아야 함.',
        procedure: '수입 전 KINS 안전성 평가 ➔ 원자력안전위원회 수입허가증 취득 ➔ 관세청 UNIPASS 수입신고.'
      }
    ]
  },

  // =========================================================================
  // 16. 주사전자현미경 (FE-SEM) - 9012.10-1090
  // =========================================================================
  '9012.10-1090': {
    hsCode: '9012.10-1090',
    nameKr: '전자현미경 (FIELD EMISSION SCANNING ELECTRON MICROSCOPE / GEMINISEM)',
    nameEn: 'MICROSCOPES (FE-SEM)',
    isControlled: true,
    applicableLaws: ['전파법 제58조의2', '대외무역법 (전략물자 판정)'],
    requiredCertificates: [
      '국립전파연구원 적합성평가 확인서 또는 면제확인서',
      '전략물자 판정서 (해당 고해상도 현미경 사양 시)',
      '기기 카탈로그 및 분석 사양서'
    ],
    inspectionAgency: '과학기술정보통신부 (국립전파연구원), 전략물자관리원',
    clearanceNotes: '연구개발용 수입 시 국립전파연구원 적합성평가 면제신청으로 신속 통관 가능.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '전파법',
        authority: '국립전파연구원장',
        requirementDetail: '국립전파연구원장에게 방송통신기자재등의 적합등록필증 또는 연구시험용 면제확인서를 교부받은 물품.',
        documentName: '적합성평가 확인서/면제확인서',
        electronicNoticeCode: 'RRA'
      }
    ],
    exportImportNotices: [
      { category: '수입자유화(자동승인)', authority: '산업통상자원부', content: '수출입공고상 수입자유화 대상.' }
    ],
    integratedNotices: [
      {
        lawName: '전파법 제58조의2',
        authority: '과학기술정보통신부',
        requirements: '전자현미경 제어반 및 검출기 전파 적합성평가 등록 또는 면제.',
        procedure: '면제확인서 신청 ➔ 승인번호 수입신고서 기재.'
      }
    ]
  },

  // =========================================================================
  // 17. 오황화인 (Phosphorus Pentasulphide) - 2813.90-1020 / 2813.90-0000
  // =========================================================================
  '2813.90-1020': {
    hsCode: '2813.90-1020',
    nameKr: '오황화인 (PHOSPHOROUS PENTASULPHIDE)',
    nameEn: 'PHOSPHOROUS PENTASULPHIDE',
    isControlled: true,
    applicableLaws: [
      '화학물질관리법 (사고대비물질 / 유독물질)',
      '위험물안전관리법 (소방청 - 제2류 가연성 고체)',
      '화학무기·생물무기의 금지 및 특정화학물질의 제조·수출입 규제 등에 관한 법률'
    ],
    requiredCertificates: [
      '화학물질 확인명세서 (KCMA)',
      '사고대비물질 취급신고서 / 유독물질 수입신고필증',
      'MSDS 및 위험물 운송안전승인서'
    ],
    inspectionAgency: '환경부 (유역환경청), 소방청, 산업통상자원부',
    clearanceNotes: '오황화인은 수분과 접촉 시 유독가스(황화수소)를 발생시키는 사고대비물질로 지정되어 있어 특수 위험물 보관창고 배정 및 화학물질관리법 세관장확인 절차가 엄격히 적용됩니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [
      {
        lawName: '화학물질관리법',
        authority: '한국화학물질관리협회장 / 유역환경청장',
        requirementDetail: '사고대비물질 및 유독물질 수입 확인명세서와 신고필증을 교부받은 물품.',
        documentName: '화학물질확인명세서/유독물질수입신고필증',
        electronicNoticeCode: 'KCMA / MOE'
      }
    ],
    exportImportNotices: [
      {
        category: '수입승인대상',
        authority: '산업통상자원부',
        content: '화학무기금지협약(CWC) 통제목록 해당 여부 및 산자부 사전 수입승인 대상 여부 확인.',
        specialNotes: '위험물 안전운송 규정(IMDG Code) 준수 필수'
      }
    ],
    integratedNotices: [
      {
        lawName: '화학물질관리법 제9조 및 제39조',
        authority: '환경부',
        requirements: '사고대비물질 취급관리계획서 수립 및 수입 확인 의무.',
        procedure: 'KCMA 명세서 제출 ➔ 환경청 유독물질 신고 ➔ 소방서 위험물 저장소 확인 ➔ 통관.'
      }
    ]
  }
};

/**
 * HS Code별 관세청 법령정보포털 CLIP [요건사항 - 수입] 종합 데이터 조회
 */
export function getClipImportRegulations(rawHsCode: string, fallbackName?: string): ClipImportRegulationData {
  if (!rawHsCode) {
    return generateFallbackClipRegulations('2825.90-2050', fallbackName || '품목');
  }

  const cleanCode = rawHsCode.trim();
  const normalized = cleanCode.replace(/\s+/g, '');

  if (CLIP_IMPORT_REQUIREMENTS_DATABASE[normalized]) {
    return CLIP_IMPORT_REQUIREMENTS_DATABASE[normalized];
  }

  const dashFormatted = normalized.replace(/^(\d{4})\.(\d{2})\.(\d{4})$/, '$1.$2-$3');
  if (CLIP_IMPORT_REQUIREMENTS_DATABASE[dashFormatted]) {
    return CLIP_IMPORT_REQUIREMENTS_DATABASE[dashFormatted];
  }

  return generateFallbackClipRegulations(normalized, fallbackName);
}

/**
 * HS Chapter 및 세번에 따른 표준 CLIP 요건사항 Fallback 생성기
 */
function generateFallbackClipRegulations(hsCode: string, name?: string): ClipImportRegulationData {
  const isChemical = hsCode.startsWith('28') || hsCode.startsWith('29') || hsCode.startsWith('38') || hsCode.startsWith('34');
  const isMachinery = hsCode.startsWith('84') || hsCode.startsWith('85') || hsCode.startsWith('90');
  const isElectrical = hsCode.startsWith('85') || hsCode.startsWith('90');
  const isGeneralParts = hsCode.startsWith('73') || hsCode.startsWith('40') || hsCode.startsWith('39') || hsCode.startsWith('68') || hsCode.startsWith('69');

  if (isChemical) {
    return {
      hsCode,
      nameKr: name || `화학 품목 [HS ${hsCode}]`,
      nameEn: name || 'Chemical Material',
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화학물질의 등록 및 평가 등에 관한 법률', '산업안전보건법 제110조'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료 국문본)', '화평법 제조·수입 등록/신고서', 'COA'],
      inspectionAgency: '환경부, 한국화학물질관리협회, 고용노동부',
      clearanceNotes: '통관 전 화학물질관리협회(KCMA)에 화학물질확인명세서를 전산 제출하고 승인번호를 수입신고서에 기재하여야 합니다.',
      clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
      customsVerifications: [
        {
          lawName: '화학물질관리법',
          authority: '한국화학물질관리협회장',
          requirementDetail: '한국화학물질관리협회장에게 화학물질확인명세서 확인을 받은 물품(전자문서로 세관에 통보된 것에 한함).',
          documentName: '화학물질 확인명세서 (전자문서)',
          electronicNoticeCode: 'KCMA'
        },
        {
          lawName: '산업안전보건법',
          authority: '고용노동부장관 / 한국산업안전보건공단',
          requirementDetail: '화학물질 수입 전 물질안전보건자료(MSDS) 공단 전산 제출 및 승인번호 취득.',
          documentName: 'MSDS 제출번호',
          electronicNoticeCode: 'MOEL'
        }
      ],
      exportImportNotices: [
        {
          category: '수입자유화(자동승인)',
          authority: '산업통상자원부',
          content: '대외무역법 제11조에 따른 수입자유화 품목.'
        }
      ],
      integratedNotices: [
        {
          lawName: '화학물질관리법 제9조',
          authority: '환경부',
          requirements: '화학물질 제조·수입 전 유독물질/제한물질 해당여부 확인 및 명세서 제출.',
          procedure: 'KCMA 전자신청 ➔ 전산연계 ➔ 세관 수입신고.'
        }
      ]
    };
  }

  if (isMachinery) {
    return {
      hsCode,
      nameKr: name || `기계·측정설비 품목 [HS ${hsCode}]`,
      nameEn: name || 'Machinery / Equipment',
      isControlled: isElectrical,
      applicableLaws: isElectrical 
        ? ['전파법 제58조의2 (방송통신기자재 적합성평가)', '전기용품 및 생활용품 안전관리법'] 
        : ['산업안전보건법 (자율안전확인신고 대상 여부)'],
      requiredCertificates: isElectrical
        ? ['전파법 적합등록필증 또는 연구개발용 면제확인서', '장비 사양서(Catalog)']
        : ['상업송장', '포장명세서', '장비 기술사양서'],
      inspectionAgency: isElectrical ? '과학기술정보통신부 (국립전파연구원), 국가기술표준원' : '고용노동부, 세관 통관심사과',
      clearanceNotes: isElectrical
        ? '전기·전자 및 통신제어 기능이 포함된 설비의 경우 전파법상 적합등록 또는 시험연구용 면제확인서를 구비하여야 합니다.'
        : '일반 산업용 기계설비로서 통관 심사 후 공장 설치 및 시운전 절차를 진행합니다.',
      clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
      customsVerifications: isElectrical ? [
        {
          lawName: '전파법',
          authority: '국립전파연구원장',
          requirementDetail: '국립전파연구원장에게 방송통신기자재등의 적합성평가확인서 또는 면제확인서를 교부받은 물품 (전자문서 통보).',
          documentName: '적합등록필증 또는 적합성평가 면제확인서',
          electronicNoticeCode: 'RRA'
        }
      ] : [],
      exportImportNotices: [
        {
          category: '수입자유화(자동승인)',
          authority: '산업통상자원부',
          content: '수출입공고상 수입자유화 품목 (전략물자 해당여부 판정).'
        }
      ],
      integratedNotices: [
        {
          lawName: isElectrical ? '전파법 제58조의2' : '산업안전보건법 제89조',
          authority: isElectrical ? '과학기술정보통신부' : '고용노동부',
          requirements: isElectrical ? '방송통신기자재 적합성평가 의무' : '산업용 기계·설비 안전기준 준수',
          procedure: '사전 면제/승인 ➔ 세관 신고서 기재 ➔ 수입 통관.'
        }
      ]
    };
  }

  // General Parts (Iron, Rubber, Plastics, etc.)
  return {
    hsCode,
    nameKr: name || `일반 원부자재·부품 [HS ${hsCode}]`,
    nameEn: name || 'General Parts / Materials',
    isControlled: false,
    applicableLaws: ['관세법', '대외무역법'],
    requiredCertificates: ['수입신고서', '상업송장(Commercial Invoice)', '포장명세서(Packing List)', 'B/L (선하증권)'],
    inspectionAgency: '관세청 (관할 세관 통관심사과)',
    clearanceNotes: '별도의 세관장확인 요건이 없는 일반 수입자유화 물품으로 표준 통관 절차에 따라 수입신고가 진행됩니다.',
    clipSourceUrl: 'https://unipass.customs.go.kr/clip/index.do',
    customsVerifications: [],
    exportImportNotices: [
      {
        category: '수입자유화(자동승인)',
        authority: '산업통상자원부',
        content: '수출입공고상 별도의 수입제한이 없는 자동승인 대상 품목임.'
      }
    ],
    integratedNotices: [
      {
        lawName: '대외무역법 제12조 (통합공고)',
        authority: '산업통상자원부',
        requirements: '개별 법령상 별도의 수입승인 및 허가 요건 비해당 품목.',
        procedure: '표준 수입신고서 작성 및 관세 납부 ➔ 통관 완료.'
      }
    ]
  };
}
