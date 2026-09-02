import { TradeItem } from '../types';
import { OTHER_ITEMS } from './otherItems';

// 품목 필터 분류: 양극재, 전구체, 첨가제, 리튬, 기타
export const TRADE_ITEMS_DATABASE: TradeItem[] = [
  // ==========================================
  // [1] 양극재 (Cathode Materials)
  // ==========================================
  {
    id: 'item-lithium-nca-oxide',
    name: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    nameEn: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    category: '양극재',
    hsCode: '2841.90-9030',
    hsDescription: '리튬 니켈 코발트 알루미늄 산화물 (NCA 양극활물질 / Cathode Material)',
    subModels: [
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
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '화학물질관리법 수입확인명세서 및 이차전지 양극재 할당관세(0%) 적용 여부 확인' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0, specialRules: 'IRA 핵심광물(Critical Minerals) 적격 국가 조달비율 충족 시 세액공제' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA 양허', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 3.0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19, specialRules: 'EU 배터리법 및 핵심원자재법(CRMA) 공급망 실사 보고 의무' },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법 (화관법)', '화학물질의 등록 및 평가 등에 관한 법률 (화평법)', '산업안전보건법 (산안법 MSDS)'],
      requiredCertificates: ['화학물질 확인명세서 (한국화학물질관리협회 KCMA)', '화평법 제조·수입 등록/신고확인증', 'MSDS(물질안전보건자료) 국문본 및 공단 제출번호', 'COA (공인 시험성적서)'],
      inspectionAgency: '환경부 (유역·지방환경청), 고용노동부, 화학물질관리협회',
      clearanceNotes: '통관 전 화학물질관리협회(KCMA) 수입확인명세 제출 및 화학물질관리법 제9조에 따른 유독물질/제한물질 해당여부 사전 판정 필수.',
      prohibitedIngredients: ['미등록 신규화학물질 및 함량기준 초과 유독물질']
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '다른 4단위 호에 해당하는 재료로부터 생산된 것(CTH) 또는 역내부가가치비율 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '수산화리튬 및 NCA 전구체의 원산지 추적 소명서 및 원자재수불부 관리 필수'
    }
  },
  {
    id: 'item-lithium-ncm-oxide',
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
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 핵심소재 할당관세 0% 적용 및 부가세 매입자납부 특례 검토' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0, specialRules: 'FEOC(해외우려기관) 광물 배제 요건 및 IRA 원산지 증명 필수' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 3.0, ftaTariffRate: 0, ftaName: 'VKFTA (0%)', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법 (화학물질등록평가법)', '산업안전보건법 제110조', '대외무역법'],
      requiredCertificates: ['화학물질 수입확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료)', '화평법 등록증명서 (연간 1톤 이상 수입 시)', 'BOM 및 원산지소명서'],
      inspectionAgency: '환경부 화학물질안전원, 유역환경청, 한국화학물질관리협회',
      clearanceNotes: '통관 시 수입신고서 란별로 화학물질관리법 세관장 확인번호 기재 필수. 포장 및 라벨에 GHS 경고표지 부착 여부 확인.',
      prohibitedIngredients: ['FEOC 우려국가 비인가 광물 배제 규정 준수']
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(CTH) 또는 역내부가가치 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NCM 전구체 및 니켈 원자재 합성 공정 세번변경 및 부가가치 충족'
    }
  },
  {
    id: 'item-lfp-oxide',
    name: 'LFP(LITHIUM FERRO(or IRON) PHOSHPATE)',
    nameEn: 'LFP(LITHIUM FERRO(or IRON) PHOSHPATE)',
    category: '양극재',
    hsCode: '2842.90-9000',
    hsDescription: '리튬 인산철 무기화합물 (LFP 무기염 양극활물질 / Non-Carbon Coated)',
    subModels: [
      'LFP'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU/한-중 FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 소재 할당관세 0% 적용 및 화학물질 수입확인명세서 제출' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0, specialRules: 'IRA 핵심광물 요건 및 공급망 실사 증명' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA (0%)', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP (0%)', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법 (화학물질등록평가법)', '산업안전보건법 제110조', '대외무역법'],
      requiredCertificates: ['화학물질 수입확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료)', '화평법 등록증명서', '공인 COA 성적서'],
      inspectionAgency: '환경부 화학물질안전원, 유역환경청, 한국화학물질관리협회',
      clearanceNotes: '리튬 인산철 무기염류 수입 시 화학물질관리법 세관장 확인번호 및 MSDS 국문본 필수 제출.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(CTH) 또는 역내부가가치비율 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '인산철 및 리튬 원자재 합성 공정 원산지 소명서 구비'
    }
  },
  {
    id: 'item-lfp-carbon-coated',
    name: 'LFP(LITHIUM FERRO(or IRON) PHOSHPATE) [CARBON 코팅시]',
    nameEn: 'LFP(LITHIUM FERRO(or IRON) PHOSHPATE) [CARBON COATED]',
    category: '양극재',
    hsCode: '3824.99-9090',
    hsDescription: '탄소(Carbon) 코팅된 리튬 인산철 복합화합물 (LFP 양극활물질 / Carbon Coated LiFePO4)',
    subModels: [
      'LFP'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU/한-중 FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 양극재 할당관세 0% 적용 및 화학물질관리법 확인' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0, specialRules: 'IRA FEOC 규제 준수 및 탄산리튬 원산지 검증 필요' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA (0%)', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP (0%)', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법 (화학물질등록평가법)', '산업안전보건법 제110조', '대외무역법'],
      requiredCertificates: ['화학물질 수입확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료)', '화평법 등록증명서', '공인 COA 성적서 (탄소코팅율 분석표)'],
      inspectionAgency: '환경부 화학물질안전원, 유역환경청, 한국화학물질관리협회',
      clearanceNotes: '통관 시 카본 코팅 분석표 및 화학물질관리법 제9조에 따른 확인번호 신고 필수.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(CTH: 인산철 2835호+탄산리튬 2836호 → 복합물 3824호) 또는 RVC 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '인산철 및 리튬 원소재 소성 및 카본 코팅 가공 공정 확인'
    }
  },

  // ==========================================
  // [2] 전구체 (Precursors)
  // ==========================================
  {
    id: 'item-ncm-oxide-precursor',
    name: 'NICKEL COBALT MANGANESE OXIDE',
    nameEn: 'NICKEL COBALT MANGANESE OXIDE',
    category: '전구체',
    hsCode: '2825.90-1090',
    hsDescription: '니켈 코발트 망간 산화물 (NCMO 전구체 / Precursor)',
    subModels: [
      'NCMO'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 제조용 전구체 할당관세(0%) 적용 및 화학물질관리법 확인' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'US-KOR FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA (0%)', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료)', '화평법 등록증명서', '공인 시험성적서 (COA)'],
      inspectionAgency: '한국화학물질관리협회, 환경부 화학물질안전원',
      clearanceNotes: '통관 시 수입자 및 화학물질 확인명세서 전송 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NCMO 전구체 제조공정 및 원산지 소명서 구비'
    }
  },
  {
    id: 'item-nc-oxide-precursor',
    name: 'NICKEL COBALT OXIDE',
    nameEn: 'NICKEL COBALT OXIDE',
    category: '전구체',
    hsCode: '2825.90-1090',
    hsDescription: '니켈 코발트 복합산화물 (NC Oxide 전구체)',
    subModels: [
      'NC034(L)-D',
      'NC034(S)-D'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'US-KOR FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS 국문본', '화평법 신고/등록증'],
      inspectionAgency: '환경부, 한국화학물질관리협회',
      clearanceNotes: '니켈 및 코발트 함유 무기화합물로 화관법상 유독물질 해당여부 사전 확인 필요.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTSH or RVC 40%',
      psrDescription: '6단위 소호변경 또는 역내부가가치비율 40% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '배터리 원소재 원산지 포괄확인서 구비'
    }
  },
  {
    id: 'item-nma-oxide-precursor',
    name: 'NICKEL MANGANESE ALUMINIUM OXIDE',
    nameEn: 'NICKEL MANGANESE ALUMINIUM OXIDE',
    category: '전구체',
    hsCode: '2825.90-1090',
    hsDescription: '니켈 망간 알루미늄 복합산화물 (NMAO 전구체)',
    subModels: [
      'NMAO'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', '화평법 등록증'],
      inspectionAgency: '환경부 화학물질안전원',
      clearanceNotes: '알루미늄/니켈/망간 복합 무기산화물 세관장 확인 대상.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '원산지소명서 및 제조공정도 구비'
    }
  },
  {
    id: 'item-ncm-hydroxide',
    name: 'NICKEL COBALT MANGANESE HYDROXIDE',
    nameEn: 'NICKEL COBALT MANGANESE HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2050',
    hsDescription: '니켈 코발트 망간 복합수산화물 (NCM 전구체 / Precursor)',
    subModels: [
      'NCM'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, wtoTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA (0%) / 한-미 FTA (0%) / 한-EU FTA (0%)', vatRate: 10, specialRules: '관세청 CLIP 고시: WTO협정세율 5.5%, 한-중 FTA 0%, 배터리 원소재 할당관세 0%' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, wtoTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA (0%)', vatRate: 13 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, wtoTariffRate: 3.7, ftaTariffRate: 0, ftaName: '한-미 FTA (0%)', vatRate: 0 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, wtoTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-베트남 VKFTA (0%)', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, wtoTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 3.9, wtoTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법 (화관법)', '화학물질등록평가법 (화평법)', '산업안전보건법 제110조'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA 확인)', 'MSDS (물질안전보건자료)', '화평법 등록증명서', '공인 시험성적서 (COA)'],
      inspectionAgency: '한국화학물질관리협회, 유역환경청, 고용노동부',
      clearanceNotes: 'NCM 전구체는 배터리 핵심 원소재로 유독물질 함유 여부(니켈/코발트 기준) 확인 후 세관 수입신고 필수.',
      prohibitedIngredients: ['유독물질 기준초과 미신고 화합물']
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경(황산니켈·황산코발트 2833호 → 수산화물 2825호) 충족 또는 역내부가가치 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '공침(Co-precipitation) 공정 입증 자료 및 원료 수불부'
    }
  },
  {
    id: 'item-nca-hydroxide',
    name: 'NICKEL COBALT ALUMINUM HYDROXIDE',
    nameEn: 'NICKEL COBALT ALUMINUM HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2090',
    hsDescription: '니켈 코발트 알루미늄 복합수산화물 (NCA 전구체 / Precursor)',
    subModels: [
      'NCA036(S)',
      'NCA036(L)'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS 국문본', '화평법 등록증명서'],
      inspectionAgency: '환경부 화학물질안전원, 고용노동부',
      clearanceNotes: '통관 전 화학물질 확인명세서 EDI 전송 번호 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NCA 전구체 공침 반응 공정 확인'
    }
  },
  {
    id: 'item-nc-hydroxide',
    name: 'NICKEL COBALT HYDROXIDE',
    nameEn: 'NICKEL COBALT HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2090',
    hsDescription: '니켈 코발트 복합수산화물 (NC Hydroxide / MHP 혼합물)',
    subModels: [
      'NC024(L)',
      'NC024(S)',
      'NC034(L)',
      'NC034(S)',
      'NC035(L))',
      'NC035(S)'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: 'FTA 0%', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'US-KOR FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: 'MHP(혼합수산화침전물) 형태 통관 시 품위 및 수분율 확인 필요.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTSH or RVC 40%',
      psrDescription: '6단위 소호변경 또는 역내부가가치비율 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '제련/정제 공정 원산지 증빙'
    }
  },
  {
    id: 'item-ncma-hydroxide',
    name: 'NICKEL COBALT MANGANESE ALUMINIUM HYDROXIDE',
    nameEn: 'NICKEL COBALT MANGANESE ALUMINIUM HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2090',
    hsDescription: '니켈 코발트 망간 알루미늄 4원계 복합수산화물 (NCMA 전구체)',
    subModels: [
      'NCMA'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10, specialRules: '국가핵심기술/전략기술 소재 감면 및 할당관세 0% 검토' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법', '국가첨단전략산업 경쟁력 강화 특별법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA)', 'MSDS (물질안전보건자료)', '화평법 제조·수입 등록증명서', '공인 시험성적서 (COA)'],
      inspectionAgency: '환경부 화학물질안전원, 산업통상자원부',
      clearanceNotes: '차세대 하이니켈 4원계 전구체로 화관법상 유독물질 해당여부 및 사전신고 번호 필증 첨부.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '4원계 공침 합성 공정 원산지 소명자료 구비'
    }
  },
  {
    id: 'item-nma-hydroxide',
    name: 'NICKEL MANGANESE ALUMINIUM HYDROXIDE',
    nameEn: 'NICKEL MANGANESE ALUMINIUM HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2090',
    hsDescription: '니켈 망간 알루미늄 복합수산화물 (NMA 전구체 / Precursor)',
    subModels: [
      'NMA'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: 'FTA 0%', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'US-KOR FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 성적서'],
      inspectionAgency: '환경부, 한국화학물질관리협회',
      clearanceNotes: '통관 전 화학물질관리협회 수입확인명세서 발급.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NMA 전구체 제조공정 확인'
    }
  },
  {
    id: 'item-nm-hydroxide',
    name: 'NICKEL MANGANESE HYDROXIDE',
    nameEn: 'NICKEL MANGANESE HYDROXIDE',
    category: '전구체',
    hsCode: '2825.90-2090',
    hsDescription: '니켈 망간 복합수산화물 (NM 전구체 / Precursor)',
    subModels: [
      'NM'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: 'FTA 0%', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', '화평법 등록증'],
      inspectionAgency: '환경부 유역환경청',
      clearanceNotes: '통관 시 수입자 및 화학물질 확인명세서 전송 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'NM 전구체 합성 공정 입증'
    }
  },
  {
    id: 'item-sodium-nickel-iron-mn-oxide',
    name: 'SODIUM NICKEL IRON MANGANESE OXIDE',
    nameEn: 'SODIUM NICKEL IRON MANGANESE OXIDE',
    category: '전구체',
    hsCode: '2825.90-1090',
    hsDescription: '나트륨(소듐) 이온 배터리용 니켈 철 망간 복합산화물 전구체 (NFMO Precursor)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 6.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '소듐이온 배터리 신소재 전구체. 화관법 및 화평법 수입요건 사전 구비.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '산화물 합성 공정 확인'
    }
  },
  {
    id: 'item-iron-phosphate',
    name: 'IRON PHOSPHATE',
    nameEn: 'IRON PHOSPHATE',
    category: '전구체',
    hsCode: '2835.29-9000',
    hsDescription: '인산철 (Iron Phosphate / LFP 양극재 전구체 원료)',
    subModels: [
      'FP'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-중/한-EU FTA (0%)', vatRate: 10, specialRules: '이차전지 LFP 양극재 원료 할당관세 0% 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.1, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '통관 시 수입확인명세서 번호 신고 및 MSDS 비치 의무.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '인산철 무기염 화학반응공정 입증'
    }
  },
  {
    id: 'item-ferro-phosphate',
    name: 'FERRO PHOSPHATE',
    nameEn: 'FERRO PHOSPHATE',
    category: '전구체',
    hsCode: '2835.29-9000',
    hsDescription: '인산철 화합물 (Ferro Phosphate / LFP 양극재 전구체 원료)',
    subModels: [
      'FP'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-중/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.1, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '통관 시 수입확인명세서 번호 신고 및 MSDS 비치 의무.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '인산철 무기염 화학반응공정 입증'
    }
  },
  {
    id: 'item-anhydrous-iron-phosphate',
    name: 'ANHYDROUS IRON PHOSPHATE',
    nameEn: 'ANHYDROUS IRON PHOSPHATE',
    category: '전구체',
    hsCode: '2835.29-9000',
    hsDescription: '무수 인산철 (Anhydrous Iron Phosphate / 고순도 무수 전구체)',
    subModels: [
      'FP'
    ],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-중/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.1, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '무수물 형태의 인산철 전구체. 수분율 0.5% 미만 성적서 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '무수 인산철 정련 및 열처리 반응 공정 소명'
    }
  },
  {
    id: 'item-composite-sodium-iron-phosphate-precursor',
    name: 'COMPOSITE SODIUM IRON PHOSPHATE PRECURSOR',
    nameEn: 'COMPOSITE SODIUM IRON PHOSPHATE PRECURSOR',
    category: '전구체',
    hsCode: '2835.29-9000',
    hsDescription: '복합 나트륨(소듐) 인산철 전구체 (NFPP Precursor / Na-Ion Battery)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-중/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.1, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '소듐 배터리용 복합 인산철 전구체 수입신고.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '복합인산염 합성공정 입증'
    }
  },

  // ==========================================
  // [3] 첨가제 (Additives)
  // ==========================================
  {
    id: 'item-add-ceramic-crucible',
    name: 'CERAMIC CRUCIBLE',
    nameEn: 'Ceramic Crucible (C60, C100)',
    category: '첨가제',
    hsCode: '6903.20-2000',
    hsDescription: '기타 내화 세라믹 제품 (알루미나 등 함유 도가니 및 사가 C60, C100)',
    subModels: ['C60', 'C100'],
    defaultUnitPriceUsd: 0,
    unit: 'EA',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 8.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 한-중 FTA 3.2%', vatRate: 10, specialRules: '이차전지 제조 소모재 세관 감면 여부 확인' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 8.0, ftaTariffRate: 2.5, ftaName: '한-중 FTA 양허', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.0, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['관세법', '대외무역법'],
      requiredCertificates: ['품질검사성적서 (COA)', '원산지증명서 (C/O)', '상업송장 및 패킹리스트'],
      inspectionAgency: '관세청 세관',
      clearanceNotes: '알루미나 순도 및 내열 규격 증빙 시 원활한 통관 가능.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '다른 4단위 호에 해당하는 재료로부터 생산된 것 또는 RVC 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '고온 소성 및 세라믹 가공 공정 소명'
    }
  },
  {
    id: 'item-add-cobalt-oxide',
    name: 'COBALT OXIDE',
    nameEn: 'Cobalt Oxide',
    category: '첨가제',
    hsCode: '2822.00-1099',
    hsDescription: '산화코발트 및 수산화코발트 (이차전지 양극재 및 첨가제용)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화학물질의 등록 및 평가 등에 관한 법률(화평법)', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA)', 'MSDS (물질안전보건자료)', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '화관법 및 화평법에 따른 세관장 확인번호 및 MSDS 구비 필수.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '코발트 정련 및 산화 공정 소명'
    }
  },
  {
    id: 'item-add-ssic-roller',
    name: 'SSIC ROLLER',
    nameEn: 'Sintered Silicon Carbide Roller (SSiC Roller)',
    category: '첨가제',
    hsCode: '6903.90-1000',
    hsDescription: '탄화규소(SiC)계 상압소결 내화 세라믹 롤러 (열처리 소성로 부품 및 첨가자재)',
    defaultUnitPriceUsd: 0,
    unit: 'EA',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 8.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.9, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 8.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.0, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: false,
      applicableLaws: ['관세법', '대외무역법'],
      requiredCertificates: ['규격 및 내화도 성적서 (COA)', '원산지증명서'],
      inspectionAgency: '세관',
      clearanceNotes: 'SiC 성분 분석 및 고온 롤러 규격 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경 또는 RVC 40%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'SiC 소결 및 정밀 가공 공정 확인'
    }
  },
  {
    id: 'item-add-nano-titanium-dioxide',
    name: 'NANO TITANIUM DIOXIDE',
    nameEn: 'Nano Titanium Dioxide',
    category: '첨가제',
    hsCode: '2823.00-1000',
    hsDescription: '나노 이산화티타늄 (이차전지 활물질 코팅 및 성능 개선 첨가제)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', '입도 분석 및 COA 성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '나노 입자 크기 및 순도 분석표 첨부.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45% 이상',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '티타늄 화학적 합성 및 나노 분쇄 공정 증명'
    }
  },
  {
    id: 'item-add-cobalt-sulfate',
    name: 'COBALT SULFATE',
    nameEn: 'Cobalt Sulfate',
    category: '첨가제',
    hsCode: '2833.29-2090',
    hsDescription: '황산코발트 (이차전지 전구체 합성 및 양극재 첨가제용)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.6, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법 (유독물질)', '화평법', '위험물안전관리법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부 유역환경청, 화학물질관리협회',
      clearanceNotes: '유독물질 수입신고 및 MSDS 라벨 부착 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 RVC 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '코발트 황산염 결정화 공정 입증'
    }
  },
  {
    id: 'item-add-nano-zirconium-dioxide',
    name: 'NANO ZIRCONIUM DIOXIDE',
    nameEn: 'Nano Zirconium Dioxide',
    category: '첨가제',
    hsCode: '2825.60-2000',
    hsDescription: '나노 산화지르코늄 (양극재 표면 코팅제 및 안정화 첨가제)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.3, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '지르코니아 나노 입도 및 화학 조성 분석표 제출.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 RVC 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '지르코늄 화학 정제 및 산화 공정 소명'
    }
  },
  {
    id: 'item-add-sodium-carbonate',
    name: 'SODIUM CARBONATE',
    nameEn: 'Sodium Carbonate (SODA)',
    category: '첨가제',
    hsCode: '2836.20-0000',
    hsDescription: '탄산나트륨 (소다회 SODA, 배터리 침전제 및 반응 첨가제)',
    subModels: ['SODA'],
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 시험성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '일반 화학물질 통관 절차 및 MSDS 구비.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '솔베이법 등 합성 공정 소명'
    }
  },
  {
    id: 'item-add-aluminium-oxide',
    name: 'ALUMINIUM OXIDE',
    nameEn: 'Aluminium Oxide',
    category: '첨가제',
    hsCode: '2818.20-9000',
    hsDescription: '산화알루미늄 (알루미나, 양극재 표면 코팅 및 첨가제용 고순도 분말)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%)', vatRate: 10 },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 4.0, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법'],
      requiredCertificates: ['화학물질 확인명세서', 'MSDS', 'COA 성적서'],
      inspectionAgency: '환경부, 화학물질관리협회',
      clearanceNotes: '알루미나 순도 99% 이상 여부 및 입도 분석표 확인.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 RVC 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '베이어 공정 및 하소 공정 소명'
    }
  },

  // ==========================================
  // [4] 리튬 (Lithium Compounds)
  // ==========================================
  {
    id: 'item-lithium-carbonate',
    name: 'LITHIUM CARBONATE',
    nameEn: 'Lithium Carbonate',
    category: '리튬',
    hsCode: '28369.10-000',
    hsDescription: '탄산리튬 (LFP 및 NCM 양극재 제조용 고순도 탄산리튬)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 제조용 탄산리튬 할당관세 0% 적용' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0 },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA', vatRate: 19 },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법', '화평법', '산업안전보건법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA)', 'MSDS (물질안전보건자료)', '화평법 등록증명서', 'COA 성적서'],
      inspectionAgency: '환경부, 한국화학물질관리협회',
      clearanceNotes: '통관 전 화학물질 확인명세서 전송 확인 및 세관 통관 진행.',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치비율 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: '탄산리튬 정제 공정 원산지 확인'
    }
  },
  {
    id: 'item-lithium-hydroxide',
    name: 'LITHIUM HYDROXIDE',
    nameEn: 'Lithium Hydroxide',
    category: '리튬',
    hsCode: '2825.20-2000',
    hsDescription: '수산화리튬 (하이니켈계 양극재 NCM/NCA 제조용 배터리급 수산화리튬)',
    defaultUnitPriceUsd: 0,
    unit: 'KG',
    countryTariffs: {
      KR: { countryCode: 'KR', countryName: '한국', countryNameEn: 'Korea', flag: '🇰🇷', currency: 'KRW', baseTariffRate: 5.0, ftaTariffRate: 0, ftaName: '한-미/한-EU FTA (0%) / 할당관세 0%', vatRate: 10, specialRules: '이차전지 핵심광물 할당관세 0% 적용 및 조세특례 수입부가세 유예 가능' },
      US: { countryCode: 'US', countryName: '미국', countryNameEn: 'USA', flag: '🇺🇸', currency: 'USD', baseTariffRate: 3.7, ftaTariffRate: 0, ftaName: 'KORUS FTA (0%)', vatRate: 0, specialRules: 'IRA 핵심광물 조달비율 규정 준수 (미국 및 FTA 체결국 채굴/가공 요건)' },
      CN: { countryCode: 'CN', countryName: '중국', countryNameEn: 'China', flag: '🇨🇳', currency: 'CNY', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-중 FTA (0%)', vatRate: 13 },
      VN: { countryCode: 'VN', countryName: '베트남', countryNameEn: 'Vietnam', flag: '🇻🇳', currency: 'VND', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'VKFTA / RCEP', vatRate: 10 },
      DE: { countryCode: 'DE', countryName: '독일(EU)', countryNameEn: 'Germany', flag: '🇩🇪', currency: 'EUR', baseTariffRate: 5.5, ftaTariffRate: 0, ftaName: '한-EU FTA (0%)', vatRate: 19, specialRules: 'EU 핵심원자재법(CRMA) 전략원자재 원산지 증명 필수' },
      JP: { countryCode: 'JP', countryName: '일본', countryNameEn: 'Japan', flag: '🇯🇵', currency: 'JPY', baseTariffRate: 0, ftaTariffRate: 0, ftaName: 'RCEP (0%)', vatRate: 10 }
    },
    importRegulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법 (유독물질 지정)', '화평법 (화학물질등록평가법)', '산업안전보건법 (산안법 MSDS)', '위험물안전관리법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA 확인번호)', '화평법 등록증명서 (1톤 이상 수입)', 'MSDS (물질안전보건자료)', '순도 시험성적서 (COA)'],
      inspectionAgency: '환경부 화학물질안전원, 고용노동부, 세관',
      clearanceNotes: '강염기성 유독물질로 부식성 경고표지 및 방폭/밀폐 저장시설 증빙 필요. KCMA 수입확인명세서 EDI 번호 수입신고서 필수 기재.',
      prohibitedIngredients: ['미허가 고독성 중금속 오염 화합물']
    },
    originCriteria: {
      psrCode: 'CTH or RVC 45%',
      psrDescription: '4단위 세번변경 또는 역내부가가치 45%',
      originDocumentType: '자율발급(원산지인증수출자)',
      ftaNotes: 'IRA 적격 광물 요건 충족을 위한 염호/광산 채굴지 및 정제 제련소 추적 원산지 소명서 구비 필수'
    }
  },

  // ==========================================
  // [5] 기타 (Others) - 104개 품목
  // ==========================================
  ...OTHER_ITEMS
];

