export const CLIP_PORTAL_URL = 'https://unipass.customs.go.kr/clip/index.do';

/**
 * 대한민국 관세법 및 관세청 고시 세율 적용 법정 우선순위 (1순위 ~ 7순위)
 */
export interface TariffPriorityRule {
  rank: number;
  taxType: string;
  subTypes: string[];
  applicationRule: string;
  description: string;
}

export const KOREA_TARIFF_PRIORITY_RULES: TariffPriorityRule[] = [
  {
    rank: 1,
    taxType: '탄력관세(덤핑방지·보복·긴급·상계·조정L2 등)',
    subTypes: ['덤핑방지관세 (I)', '보복관세', '긴급관세 (K)', '특정국물품긴급관세', '특별긴급관세 (T)', '상계관세', '조정관세 (L2)'],
    applicationRule: '가장 우선 적용',
    description: '불공정 무역 또는 긴급 수입 구제 조치로 다른 모든 세율에 최우선하여 부과'
  },
  {
    rank: 2,
    taxType: '자유무역협정(FTA) 협정관세',
    subTypes: ['한-중 FTA (FCN1)', '한-미 FTA (FUS1)', '한-EU FTA (FEU1)', '한-호주 FTA (FAU1)', 'RCEP FTA (FRC1)', '한-베트남 FTA (FVK1)', '한-인도 CEPA (FIC1)', '한-영 FTA (FGB1)', '한-아세안 FTA', '한-칠레 FTA', '한-싱가포르 FTA', '한-캐나다 FTA', '한-EFTA FTA'],
    applicationRule: '3, 4, 5, 6, 7 순위 세율보다 낮은 경우 우선 적용',
    description: '체결국 원산지증명서(C/O) 구비 시 WTO, 할당, 잠정, 기본세율보다 낮을 때 최우선 적용'
  },
  {
    rank: 3,
    taxType: 'WTO 양허관세 및 국제협력·APTA 협정관세',
    subTypes: [
      'WTO일반양허관세 - 공산품·수산물 및 단순 양허 (C)',
      '정보기술협정 확대협정 대상물품 (CIT)',
      'WTO개도국간의 양허관세 (D)',
      '아·태협정양허관세 (APTA) 일반양허 (E), 방글라데시 (E2), 라오스 (E3)',
      '유엔무역개발회의 개발도상국간 협정관세 (G)',
      '특정국가와의 관세협상에 따른 국제협력관세 (F)',
      '편익관세'
    ],
    applicationRule: '4, 5, 6, 7 순위 세율보다 낮은 경우 우선 적용 (단, 농림축산물 W1/W2는 6,7보다 우선)',
    description: 'WTO 가입국 간 합의된 양허세율로 국내 기본세율보다 유리한 경우 우선 적용'
  },
  {
    rank: 4,
    taxType: '조정관세(L) / 계절관세 / 할당관세(P, W)',
    subTypes: ['조정관세 (L)', '계절관세', '할당관세 (P/W: 원자재 수급안정 및 물가안정용)'],
    applicationRule: '조정·계절관세는 5, 6, 7보다 우선 / 할당관세는 5보다 낮은 경우 및 6, 7보다 우선 적용',
    description: '원자재 가격 안정 및 수급 조절을 위해 일정 수량에 한하여 인하된 세율 적용'
  },
  {
    rank: 5,
    taxType: '최빈개발도상국에 대한 특혜관세 (R)',
    subTypes: ['최빈개도국 특혜관세 (R)'],
    applicationRule: '6, 7 순위 세율보다 우선 적용',
    description: 'UN 지정 최빈개발도상국 원산지 물품에 대한 무세 또는 저율 특혜'
  },
  {
    rank: 6,
    taxType: '잠정관세 (B)',
    subTypes: ['잠정관세 (B)'],
    applicationRule: '7 순위(기본관세)보다 우선 적용',
    description: '일정 기간 동안 잠정적으로 기본세율을 대체하여 적용하는 세율'
  },
  {
    rank: 7,
    taxType: '기본관세 (A)',
    subTypes: ['기본관세 (A)'],
    applicationRule: '가장 기본적인 법정세율 (타 특혜 및 양허세율 부적용 시 최종 적용)',
    description: '관세법 별표 관세율표에 규정된 표준 법정세율'
  }
];

export interface TariffDeterminationResult {
  appliedRate: number;
  rank: number;
  taxTypeTitle: string;
  codeSymbol: string;
  reason: string;
}

/**
 * 관세법 우선순위 규칙에 따른 최종 확정 관세율 계산
 * (규칙: 탄력관세 > FTA협정세율 > WTO양허세율 > 기본세율 순; 할당관세는 한시적 정책관세로 기본 미적용 처리)
 */
export function determinePriorityTariffRate(params: {
  baseRate: number; // 7순위: 기본관세 (A)
  wtoRate?: number; // 3순위: WTO양허세율 (C/CIT)
  quotaRate?: number; // 4순위: 할당관세 (P/W) - 기본 미적용
  ftaRate?: number; // 2순위: FTA협정관세 (FCN1 등)
  applyFta?: boolean;
  ftaName?: string;
  ftaCode?: string;
}): TariffDeterminationResult {
  const base = params.baseRate ?? 8.0;
  const wto = params.wtoRate !== undefined && !isNaN(params.wtoRate) ? params.wtoRate : 5.5;
  const fta = (params.applyFta && params.ftaRate !== undefined && !isNaN(params.ftaRate)) ? params.ftaRate : undefined;

  // 1. FTA 협정세율 (원산지증명서 O) -> 2순위 최우선 적용
  if (fta !== undefined && fta <= base) {
    return {
      appliedRate: fta,
      rank: 2,
      taxTypeTitle: params.ftaName || 'FTA 협정관세',
      codeSymbol: params.ftaCode || 'FTA',
      reason: `2순위 FTA 협정세율(${fta.toFixed(1)}%)이 3순위 WTO(${wto.toFixed(1)}%), 7순위 기본(${base.toFixed(1)}%)보다 낮거나 같아 최우선 적용`
    };
  }

  // 2. 원산지증명서 X인 경우:
  // 세율적용 우선순위상 할당관세(한시적 정책관세)는 기본 미적용 기준으로 보며,
  // 3순위 WTO협정세율이 7순위 기본세율보다 낮은 경우(예: WTO 5.5% < 기본 8.0%) WTO 협정세율이 법정 우선 적용됨
  if (wto !== undefined && wto < base) {
    return {
      appliedRate: wto,
      rank: 3,
      taxTypeTitle: 'WTO일반양허관세 (C)',
      codeSymbol: 'C',
      reason: `3순위 WTO 협정세율(${wto.toFixed(1)}%)이 7순위 기본세율(${base.toFixed(1)}%)보다 낮아 우선 적용 (원산지증명서 미구비·할당관세 기본 미적용 기준)`
    };
  }

  // 3. 기본세율 (7순위)
  return {
    appliedRate: base,
    rank: 7,
    taxTypeTitle: '기본관세 (A)',
    codeSymbol: 'A',
    reason: `7순위 기본관세(${base.toFixed(1)}%) 적용 (원산지증명서 미구비 기준)`
  };
}

export interface ClipTariffSchedule {
  hsCode: string;
  nameKr: string;
  nameEn: string;
  baseRate: number; // 기본세율 (A) %
  wtoRate: number; // WTO협정세율 (C) %
  quotaRate?: number; // 할당관세 (W) %
  ftaRates: Record<string, { ftaName: string; code: string; rate: number; notes?: string }>;
  clipSourceNotes: string;
}

/**
 * 한국 수입 기준 수출국별 단일 1:1 FTA 협정 매핑 조회
 * (예: 중국 -> 한-중 FTA, 호주 -> 한-호주 FTA, 일본 -> RCEP FTA)
 */
export function getKoreaBilateralFta(exportCountryCode: string): { ftaName: string; code: string; rate: number; isFta: boolean; fullLabel: string } {
  switch (exportCountryCode) {
    case 'CN':
      return { ftaName: '한-중 FTA', code: 'FCN1', rate: 0.0, isFta: true, fullLabel: '한-중 FTA (FCN1)' };
    case 'AU':
      return { ftaName: '한-호주 FTA', code: 'FAU1', rate: 0.0, isFta: true, fullLabel: '한-호주 FTA (FAU1)' };
    case 'JP':
      return { ftaName: 'RCEP FTA', code: 'FRC1', rate: 0.0, isFta: true, fullLabel: 'RCEP FTA (FRC1)' };
    case 'US':
      return { ftaName: '한-미 FTA', code: 'FUS1', rate: 0.0, isFta: true, fullLabel: '한-미 FTA (FUS1)' };
    case 'DE':
    case 'EU':
    case 'HU':
      return { ftaName: '한-EU FTA', code: 'FEU1', rate: 0.0, isFta: true, fullLabel: '한-EU FTA (FEU1)' };
    case 'VN':
      return { ftaName: '한-베트남 FTA', code: 'FVK1', rate: 0.0, isFta: true, fullLabel: '한-베트남 FTA (FVK1)' };
    case 'GB':
      return { ftaName: '한-영 FTA', code: 'FGB1', rate: 0.0, isFta: true, fullLabel: '한-영 FTA (FGB1)' };
    case 'IN':
      return { ftaName: '한-인도 CEPA', code: 'FIC1', rate: 0.0, isFta: true, fullLabel: '한-인도 CEPA (FIC1)' };
    case 'ID':
      return { ftaName: '한-인니 CEPA', code: 'FID1', rate: 0.0, isFta: true, fullLabel: '한-인니 CEPA (FID1)' };
    case 'CA':
      return { ftaName: '한-캐나다 FTA', code: 'FCA1', rate: 0.0, isFta: true, fullLabel: '한-캐나다 FTA (FCA1)' };
    case 'SG':
      return { ftaName: '한-싱가포르 FTA', code: 'FSG1', rate: 0.0, isFta: true, fullLabel: '한-싱가포르 FTA (FSG1)' };
    case 'CL':
      return { ftaName: '한-칠레 FTA', code: 'FCL1', rate: 0.0, isFta: true, fullLabel: '한-칠레 FTA (FCL1)' };
    default:
      return { ftaName: 'FTA 미체결', code: 'A', rate: 8.0, isFta: false, fullLabel: 'FTA 미체결 (기본세율 적용)' };
  }
}

/**
 * 관세청 법령정보포털 CLIP(https://unipass.customs.go.kr/clip/index.do) 
 * 세계HS 및 관세율표 공식 고시 데이터베이스
 */
export const CLIP_HS_DATABASE: Record<string, ClipTariffSchedule> = {
  // 1. 니켈 코발트 망간 수산화물 전구체 (NCM Hydroxide)
  '2825.90-2050': {
    hsCode: '2825.90-2050',
    nameKr: '니켈·코발트·망간 복합수산화물 (NCM 전구체)',
    nameEn: 'NICKEL COBALT MANGANESE HYDROXIDE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: '양허품목 무세 적용 (0%)' },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0, notes: '무세 (0%)' },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0, notes: '역내포괄적경제동반자협정 (0%)' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 완전 철폐 (0%)' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: 'EU 전 품목 무세 (0%)' },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: 'VKFTA 0%' },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0, notes: 'CEPA 양허세율 (0%)' },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0, notes: '무세 (0%)' },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0, notes: '0%' },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0, notes: '미체결국 (기본세율)' },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0, notes: '미체결국 (기본세율)' }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본세율(A) 8.0%, WTO협정세율(C) 5.5%, 한-중 FTA 0.0%'
  },

  // 2. 니켈 코발트 망간 산화물 전구체 (NCM Oxide)
  '2825.90-1090': {
    hsCode: '2825.90-1090',
    nameKr: '니켈·코발트·망간 복합산화물 (NCMO/NMAO/NC Oxide)',
    nameEn: 'NICKEL COBALT MANGANESE OXIDE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: '양허세율 0%' },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0, notes: '0%' },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0, notes: 'RCEP 0%' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 0%' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 0%' },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: 'VKFTA 0%' },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0, notes: 'CEPA 0%' },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0, notes: '0%' },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0, notes: '0%' },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본세율(A) 8.0%, WTO협정세율(C) 5.5%, FTA 협정세율 0%'
  },

  // 3. 니켈 코발트 알루미늄 산화물 전구체 (NCA Oxide)
  '2825.90-1040': {
    hsCode: '2825.90-1040',
    nameKr: '니켈·코발트·알루미늄 복합산화물 (NCA Oxide)',
    nameEn: 'NICKEL COBALT ALUMINIUM OXIDE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본세율(A) 8.0%, WTO협정세율(C) 5.5%, 한-중 FTA 0%'
  },

  // 4. 기타 복합수산화물 (NCA Hydroxide, NCMA, NMA 등)
  '2825.90-2090': {
    hsCode: '2825.90-2090',
    nameKr: '기타 니켈 복합수산화물 (NCA/NC/NCMA/NMA/NM Hydroxide)',
    nameEn: 'OTHER NICKEL HYDROXIDES',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본세율(A) 8.0%, WTO협정세율(C) 5.5%, 한-중/한-미/한-EU FTA 0%'
  },

  // 5. NCA 리튬 복합산화물 양극재
  '2841.90-9030': {
    hsCode: '2841.90-9030',
    nameKr: '리튬 니켈 코발트 알루미늄 산화물 (NCA 양극활물질)',
    nameEn: 'LITHIUM NICKEL COBALT ALUMINIUM OXIDE(NCA)',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%, 양극재 할당관세 0%'
  },

  // 6. NCM 리튬 복합산화물 양극재
  '2841.90-9020': {
    hsCode: '2841.90-9020',
    nameKr: '리튬 니켈 코발트 망간 산화물 (NCM 양극활물질)',
    nameEn: 'LITHIUM NICKEL COBALT MANGANESE OXIDE(NCM)',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%, 양극재 할당관세 0%'
  },

  // 7. LFP 리튬 인산철 양극재 (Non-Coated)
  '2842.90-9000': {
    hsCode: '2842.90-9000',
    nameKr: '리튬 인산철 무기염 (LFP 양극활물질)',
    nameEn: 'LFP(LITHIUM FERRO PHOSPHATE)',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%'
  },

  // 8. LFP 카본 코팅 양극재 복합물
  '3824.99-9090': {
    hsCode: '3824.99-9090',
    nameKr: '탄소 코팅된 리튬 인산철 복합화합물',
    nameEn: 'LFP CARBON COATED',
    baseRate: 8.0,
    wtoRate: 6.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표 제3824호: 기본 8.0%, WTO 6.5%, 한-중 FTA 0%'
  },

  // 9. 수산화리튬
  '2825.20-1000': {
    hsCode: '2825.20-1000',
    nameKr: '수산화리튬 (LITHIUM HYDROXIDE MONOHYDRATE)',
    nameEn: 'LITHIUM HYDROXIDE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%, 배터리 원소재 할당관세 0%'
  },

  // 10. 탄산리튬
  '2836.91-1000': {
    hsCode: '2836.91-1000',
    nameKr: '탄산리튬 (LITHIUM CARBONATE)',
    nameEn: 'LITHIUM CARBONATE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%'
  },

  // 11. 황산니켈
  '2833.24-0000': {
    hsCode: '2833.24-0000',
    nameKr: '황산니켈 (NICKEL SULPHATE)',
    nameEn: 'NICKEL SULPHATE',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%'
  },

  // 12. 황산코발트
  '2833.29-1000': {
    hsCode: '2833.29-1000',
    nameKr: '황산코발트 (COBALT SULPHATES)',
    nameEn: 'COBALT SULPHATES',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%'
  },

  // 13. 황산망간
  '2833.29-9000': {
    hsCode: '2833.29-9000',
    nameKr: '황산망간 (MANGANESE SULPHATES)',
    nameEn: 'MANGANESE SULPHATES',
    baseRate: 8.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, WTO 5.5%, 한-중 FTA 0%'
  },

  // 14. 리튬이온 이차전지 배터리
  '8507.60-2000': {
    hsCode: '8507.60-2000',
    nameKr: '리튬이온 축전지 (전기자동차용 배터리 모듈/팩)',
    nameEn: 'LITHIUM-ION ACCUMULATORS',
    baseRate: 8.0,
    wtoRate: 0.0,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0 },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 },
      TW: { ftaName: '일반 MFN', code: 'A', rate: 8.0 },
      MX: { ftaName: '일반 MFN', code: 'A', rate: 8.0 }
    },
    clipSourceNotes: '관세청 CLIP 관세율표: 기본 8.0%, ITA 양허 0.0%, 한-중 FTA 0%'
  }
};

/**
 * HS Code 정규화 및 관세청 CLIP 포털 관세율 스케줄 조회
 */
import { CLIP_COMMODITIES_DATABASE } from './clipCommodities';

export function getClipTariffSchedule(rawHsCode: string, fallbackName?: string): ClipTariffSchedule {
  let schedule: ClipTariffSchedule | undefined;

  if (!rawHsCode) {
    schedule = generateFallbackClipSchedule('2825.90-2050', fallbackName || '니켈·코발트·망간 복합수산화물');
  } else {
    // Format HS Code to key (strip spaces, normalize dot/dash)
    const cleanCode = rawHsCode.trim();
    const normalized = cleanCode.replace(/\s+/g, '');

    if (CLIP_HS_DATABASE[normalized]) {
      schedule = CLIP_HS_DATABASE[normalized];
    } else {
      // Try dot/dash conversions (e.g. 2825.90.2050 -> 2825.90-2050)
      const dashFormatted = normalized.replace(/^(\d{4})\.(\d{2})\.(\d{4})$/, '$1.$2-$3');
      if (CLIP_HS_DATABASE[dashFormatted]) {
        schedule = CLIP_HS_DATABASE[dashFormatted];
      }
    }

    // Check in CLIP_COMMODITIES_DATABASE if not found yet
    if (!schedule) {
      const normDigits = cleanCode.replace(/[^0-9]/g, '');
      const foundCommodity = CLIP_COMMODITIES_DATABASE.find(c => {
        const cDigits = c.hsCode.replace(/[^0-9]/g, '');
        return cDigits === normDigits || (normDigits.length >= 4 && cDigits.startsWith(normDigits.slice(0, 4)));
      });

      if (foundCommodity) {
        schedule = {
          hsCode: foundCommodity.hsCode,
          nameKr: foundCommodity.nameKr,
          nameEn: foundCommodity.nameEn,
          baseRate: foundCommodity.baseRate,
          wtoRate: foundCommodity.wtoRate,
          quotaRate: foundCommodity.quotaRate,
          ftaRates: foundCommodity.ftaRates as any,
          clipSourceNotes: `관세청 CLIP 관세율표: 기본 ${foundCommodity.baseRate}%, WTO ${foundCommodity.wtoRate}%`
        };
      }
    }

    if (!schedule) {
      // Chapter-based heuristic from CLIP Customs Schedule rules
      schedule = generateFallbackClipSchedule(normalized, fallbackName);
    }
  }

  // Ensure EU member Hungary (HU) inherits Han-EU FTA rate if DE/EU rate exists
  if (schedule && schedule.ftaRates) {
    if (!schedule.ftaRates.HU && schedule.ftaRates.DE) {
      schedule.ftaRates.HU = {
        ...schedule.ftaRates.DE,
        notes: schedule.ftaRates.DE.notes || '한-EU FTA 0%'
      };
    }
  }

  return schedule;
}

function generateFallbackClipSchedule(hsCode: string, name?: string): ClipTariffSchedule {
  const chapter = hsCode.replace(/[^0-9]/g, '').slice(0, 2);
  let baseRate = 8.0;
  let wtoRate = 5.5;

  if (chapter === '84' || chapter === '85' || chapter === '90') {
    baseRate = 8.0;
    wtoRate = 0.0;
  } else if (chapter === '28' || chapter === '29') {
    baseRate = 5.0;
    wtoRate = 5.5;
  } else if (chapter === '38' || chapter === '39') {
    baseRate = 6.5;
    wtoRate = 6.5;
  } else if (chapter === '22') {
    // 주류/와인
    baseRate = hsCode.includes('2204') ? 30.0 : 20.0;
    wtoRate = 15.0;
  } else if (chapter === '33') {
    // 화장품
    baseRate = 6.5;
    wtoRate = 6.5;
  } else if (chapter === '61' || chapter === '62' || chapter === '64') {
    // 의류 및 신발
    baseRate = 13.0;
    wtoRate = 13.0;
  } else if (chapter === '09') {
    // 커피
    baseRate = 2.0;
    wtoRate = 2.0;
  }

  return {
    hsCode,
    nameKr: name || `품목 [HS ${hsCode}]`,
    nameEn: name || 'Trade Item',
    baseRate,
    wtoRate,
    quotaRate: undefined,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: '양허세율 0%' },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0, notes: '0%' },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0, notes: 'RCEP 0%' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 0%' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 0%' },
      HU: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 0%' },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: 'VKFTA 0%' },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0, notes: 'CEPA 0%' },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0, notes: '0%' },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0, notes: '0%' },
      TW: { ftaName: '일반 MFN', code: 'A', rate: baseRate },
      MX: { ftaName: '일반 MFN', code: 'A', rate: baseRate }
    },
    clipSourceNotes: `관세청 CLIP 관세율표 기준: 기본세율 ${baseRate}%, WTO양허세율 ${wtoRate}%, 한-중 FTA 0%`
  };
}
