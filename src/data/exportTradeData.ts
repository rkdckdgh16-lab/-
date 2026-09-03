import { TradeItem } from '../types';

/**
 * 대한민국 수출 전용 품목 데이터베이스 (고객 지정 4개 품목 한정)
 * 1. LITHIUM CARBONATE (2836.91-0000) - LI2CO3
 * 2. SALTS OF OXOMETALIC (2841.90-9090) - LNO (L2N)
 * 3. LITHIUM NICKEL COBALT ALUMINIUM OXIDE (2841.90-9030) - CA-NCA020, NCA024-12B, NCA022, NCA034B, NCA034H, NCA035-14B, NCA035-14T, EA13A, NCA035-14L, EA15A, SA15B, SA16A, EA15AB, NCA024-12BJ, NCA030A
 * 4. LITHIUM NICKEL COBALT MANGANESE OXIDE (2841.90-9020) - CSG131-13AW, CGH020-12BW, CDS172-14BW, NCM-X9014B3
 * 
 * * 참고: 대한민국 수출 시 관세율은 0% (관세 0원), 부가가치세는 영세율 0% (부가세 0원) 고정값입니다.
 */

export const EXPORT_TRADE_ITEMS: TradeItem[] = [
  // 1. 탄산리튬 (2836.91-0000)
  {
    id: 'export-lithium-carbonate',
    name: 'LITHIUM CARBONATE',
    nameEn: 'LITHIUM CARBONATE',
    category: '탄산리튬',
    hsCode: '2836.91-0000',
    hsDescription: '탄산리튬 (Lithium Carbonate / Li2CO3)',
    subModels: [
      'LI2CO3'
    ],
    defaultUnitPriceUsd: 15.5,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0, specialRules: '수출 관세 0% / 부가가치세 영세율(0%) 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['대외무역법 제11조(수출입공고)', '전략물자 수출입고시', '산업안전보건법 제110조(MSDS)'],
      requiredCertificates: ['수출신고필증 (UNIPASS)', '영문 GHS MSDS', 'COA (시험성적서)', '포장명세서(Packing List)'],
      inspectionAgency: '관세청, 산업통상자원부, 전략물자관리원(KOSTI)',
      clearanceNotes: '수출신고 수리 후 30일 이내 적재 이행 필수. 영문 MSDS 및 상업송장(Commercial Invoice) 구비.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(CTH) 또는 역내부가가치 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '수출자/제조자 원산지증명서(C/O) 발급 및 원산지소명자료 5년 보관'
    }
  },

  // 2. 옥소금속산염류 (2841.90-9090)
  {
    id: 'export-salts-of-oxometalic',
    name: 'SALTS OF OXOMETALIC',
    nameEn: 'SALTS OF OXOMETALIC',
    category: '양극재',
    hsCode: '2841.90-9090',
    hsDescription: '기타 옥소금속산염류 (Salts of Oxometalic / LNO 양극활물질)',
    subModels: [
      'LNO (L2N)'
    ],
    defaultUnitPriceUsd: 28.0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0, specialRules: '수출 관세 0% / 부가가치세 영세율(0%) 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['대외무역법', '전략물자 수출입통제', '산업안전보건법 (MSDS)'],
      requiredCertificates: ['수출신고필증', '영문 MSDS', '선적서류(B/L, C/I, P/L)', '원산지증명서(C/O)'],
      inspectionAgency: '관세청, 산업통상자원부',
      clearanceNotes: '특수 옥소금속산염류 수출 시 바이어 최종용도(End-use) 확인 및 전략물자 자가판정서 구비.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '수출물품 원산지포괄확인서 및 제조공정도 관리'
    }
  },

  // 3. NCA 양극재 (2841.90-9030)
  {
    id: 'export-lithium-nca-oxide',
    name: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    nameEn: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    category: '양극재',
    hsCode: '2841.90-9030',
    hsDescription: '리튬 니켈 코발트 알루미늄 산화물 (NCA 양극활물질 / Cathode Material)',
    subModels: [
      'CA-NCA020',
      'NCA024-12B',
      'NCA022',
      'NCA034B',
      'NCA034H',
      'NCA035-14B',
      'NCA035-14T',
      'EA13A',
      'NCA035-14L',
      'EA15A',
      'SA15B',
      'SA16A',
      'EA15AB',
      'NCA024-12BJ',
      'NCA030A'
    ],
    defaultUnitPriceUsd: 32.0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0, specialRules: '수출 관세 0% / 부가가치세 영세율(0%) 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['대외무역법 제19조(전략물자수출통제)', '산업안전보건법 제110조(MSDS)', '선박안전법(해상위험물검사)'],
      requiredCertificates: ['전략물자 판정서 (YesTrade 사전확인)', '한국선급 위험물용기검사증', '영문 GHS MSDS', '원산지인증수출자 C/O'],
      inspectionAgency: '전략물자관리원(KOSTI), 한국해사위험물검사원(KOMDI), 관세청',
      clearanceNotes: '이차전지 하이니켈계 양극재 수출 시 수입국 세관 및 바이어 요구에 따른 원산지포괄확인서 및 영문 MSDS 제출.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '다른 4단위 호에 해당하는 재료로부터 생산된 것(CTH) 또는 RVC 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '수산화리튬 및 NCA 전구체의 원산지 추적 소명서 및 원자재수불부 관리'
    }
  },

  // 4. NCM 양극재 (2841.90-9020)
  {
    id: 'export-lithium-ncm-oxide',
    name: 'LITHIUM NICKEL COBALT MANGANESE OXIDE(NCM)',
    nameEn: 'LITHIUM NICKEL COBALT MANGANESE OXIDE(NCM)',
    category: '양극재',
    hsCode: '2841.90-9020',
    hsDescription: '리튬 니켈 코발트 망간 산화물 (NCM 양극활물질 / Cathode Material)',
    subModels: [
      'CSG131-13AW',
      'CGH020-12BW',
      'CDS172-14BW',
      'NCM-X9014B3'
    ],
    defaultUnitPriceUsd: 30.0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0, specialRules: '수출 관세 0% / 부가가치세 영세율(0%) 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: '수출관세 면제 (0%)', vatRate: 0 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['대외무역법 제19조', '산업안전보건법 제110조', '선박안전법'],
      requiredCertificates: ['전략물자 판정서 (KOSTI)', '수출신고필증', '영문 GHS MSDS', '원산지증명서(C/O)'],
      inspectionAgency: '전략물자관리원, 관세청, 한국화학물질관리협회',
      clearanceNotes: '수출신고 수리 후 30일 이내 선적 완료 및 사후 관세환급(Drawback) 신청 대상 검토.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(CTH) 또는 역내부가가치 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NCM 전구체 및 니켈 원자재 합성 공정 세번변경 및 부가가치 충족 증빙'
    }
  }
];
