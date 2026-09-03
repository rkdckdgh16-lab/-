export interface TradeItem {
  id: string;
  name: string; // 품명 (Korean)
  nameEn: string; // English Item Name
  category: string; // 품목 분류 (전기전자, 기계, 화학/배터리, 자동차, 화장품, 식품/농수산, 철강/금속, 섬유, 바이오/의료 등)
  hsCode: string; // HS CODE (e.g. 8507.60.2000)
  hsDescription: string; // HS 품명 해설
  subModels?: string[]; // 세부 모델 목록 (검색 매칭용, UI 기본 숨김)
  defaultUnitPriceUsd: number; // 기준 단가 (USD)
  unit: string; // 단위 (개, KG, SET, TON, M, L)
  // 국가별 기본/협정 관세 정보
  countryTariffs: Record<string, CountryTariffInfo>;
  // 수입시 요건사항
  importRegulations: ImportRegulation;
  // FTA 원산지 정보
  originCriteria: OriginCriteria;
}

export interface CountryTariffInfo {
  countryCode: string;
  countryName: string; // 한국, 미국, 중국, 일본, 베트남, 독일(EU), 인도, 멕시코, 호주, 영국 등
  countryNameEn: string;
  flag: string;
  currency: string; // KRW, USD, CNY, JPY, VND, EUR, INR, MXN, AUD, GBP
  baseTariffRate: number; // 기본 관세율 (MFN) %
  ftaTariffRate?: number; // FTA 협정관세율 %
  ftaName?: string; // 한-미 FTA, 한-중 FTA, 한-EU FTA, 한-베트남 FTA, RCEP 등
  wtoTariffRate?: number; // WTO 양허관세율 %
  quotaTariffRate?: number; // 할당관세율 (W/P) %
  vatRate: number; // 부가가치세율 % (한국 10%, 중국 13%, 베트남 8%, 독일 19% 등)
  otherTaxRate?: number; // 개별소비세/주세/농특세/교육세 등
  specialRules?: string; // 관세 비고/감면 조건
}

export interface CustomsVerificationItem {
  lawName: string; // 관련 법령 (예: 화학물질관리법, 전파법, 전기용품안전관리법 등)
  authority: string; // 소관/확인기관 (한국화학물질관리협회, 국립전파연구원, 원자력안전위원회 등)
  requirementDetail: string; // 세관장확인 요건 및 확인방법 상세내용
  documentName: string; // 필수 구비서류 / 전자문서명
  electronicNoticeCode?: string; // 관세청 UNIPASS 전자문서 확인부호
}

export interface ExportImportNoticeItem {
  category: '수입자유화(자동승인)' | '수입제한품목' | '수입승인대상' | '전략물자통제대상';
  authority: string; // 소관부처 (산업통상자원부, 전략물자관리원 등)
  content: string; // 수출입공고 규정 내용
  specialNotes?: string; // 비고 및 유의사항
}

export interface IntegratedNoticeItem {
  lawName: string; // 관련 법령 조항 (예: 화학물질관리법 제9조, 화평법 제10조 등)
  authority: string; // 주무관청
  requirements: string; // 통합공고 요건 규정 전문
  procedure: string; // 수입 절차 및 의무사항
  inspectionStandard?: string; // 검사 및 시험 기준
}

export interface ImportRegulation {
  isControlled: boolean; // 세관장 확인대상 여부
  applicableLaws: string[]; // 관련 법령
  requiredCertificates: string[]; // 구비/인증 서류
  inspectionAgency: string; // 검사/승인 기관
  clearanceNotes: string; // 통관시 주의사항
  prohibitedIngredients?: string[]; // 반입 금지/제한 성분 또는 조건
  
  // 관세청 법령정보포털 CLIP (세계 HS -> 관세율표 -> 국내관세율) 요건사항-수입 상세 데이터
  clipSourceUrl?: string; // CLIP 상세 URL
  customsVerifications?: CustomsVerificationItem[]; // [세관장확인] (관세법 제226조)
  exportImportNotices?: ExportImportNoticeItem[]; // [수출입공고] (대외무역법 제11조)
  integratedNotices?: IntegratedNoticeItem[]; // [통합공고] (대외무역법 제12조)
}

export interface OriginCriteria {
  psrCode: string; // 품목별 원산지결정기준 (CTH, CTSH, CC, RVC 40%, RVC 45% 등)
  psrDescription: string; // PSR 상세설명 (예: 4단위 세번변경기준 또는 역내부가가치비율 40% 이상)
  originDocumentType: '기관발급(세관/상공회의소)' | '자율발급(원산지인증수출자)' | '수출자/제조자 자율발급';
  ftaNotes: string; // 원산지증명서 발급 유의사항
}

export interface ExchangeRateData {
  currency: string;
  symbol: string;
  name: string;
  rateToKrw: number; // 1 외화당 KRW (JPY/VND는 100단위 or 1단위 표기)
  baseUnit: number; // 1 or 100
  updatedDate: string;
  rateType?: 'import' | 'export'; // 수입환율 / 수출환율
  source?: string; // 관세청 UNIPASS
  sourceUrl?: string; // https://unipass.customs.go.kr/csp/index.do
}

export interface CalculationInput {
  itemId?: string;
  itemName: string; // [품명]
  hsCode: string; // [HS CODE]
  exportCountry: string; // [수출국]
  importCountry: string; // [수입국]
  quantity: number; // 수량
  unitPrice: number; // 단가
  currency: string; // 결제 통화 (USD, KRW, EUR, CNY, JPY 등)
  incoterms: 'FOB' | 'CIF' | 'EXW' | 'CFR' | 'DAP' | 'DDP' | 'FCA';
  freightCost: number; // 운임 (선택)
  insuranceCost: number; // 보험료 (선택)
  exchangeRate: number; // [환율]
  applyFta: boolean; // FTA 적용 여부
  customTariffRate?: number; // 사용자 지정 관세율 (선택)
}

export interface CalculationResult {
  id?: string;
  createdAt: string;
  userId?: string;
  
  // 필수 필드 [품명][HS CODE][수출국][수입국][관세율][관세][부가가치세][총금액][환율][수입시 요건사항]
  itemName: string; // [품명]
  hsCode: string; // [HS CODE]
  exportCountry: string; // [수출국]
  importCountry: string; // [수입국]
  tariffRate: number; // [관세율] (%)
  tariffRateType: '기본관세(MFN)' | 'FTA협정관세' | 'WTO양허관세' | '사용자지정관세';
  wtoTariffRate?: number; // [WTO협정세율] (%)
  tariffAmountKrw: number; // [관세] (KRW)
  tariffAmountForeign: number; // [관세] (외화)
  vatRate: number; // 부가세율 (%)
  vatAmountKrw: number; // [부가가치세] (KRW)
  vatAmountForeign: number; // [부가가치세] (외화)
  
  totalAmountKrw: number; // [총금액] (KRW - 물품대금 + 운임/보험 + 관세 + 부가세)
  totalAmountForeign: number; // [총금액] (외화)
  
  exchangeRate: number; // [환율] (적용 환율)
  currency: string;
  
  importRegulationsSummary: string; // [수입시 요건사항] 요약
  importRegulationsFull: ImportRegulation; // [수입시 요건사항] 전체
  
  // 추가 계산 상세
  cifValueKrw: number; // 과세가격(CIF) KRW
  itemValueKrw: number; // 순수 물품대금 KRW
  ftaAppliedName?: string; // 적용 FTA 명
  mfnTariffAmountKrw: number; // MFN 기준 관세액
  ftaSavingsKrw: number; // FTA 절감세액
  
  // 수량 및 단가
  quantity: number;
  unitPrice: number;
  incoterms: string;
  originCriteria?: OriginCriteria;

  // 2026년 요건승인 등록 현황 및 화학물질 명세
  approvalStatus?: {
    isRegistered: boolean;
    hasBmMatch?: boolean;
    hasEmMatch?: boolean;
    hasBmChemicalSpecMatch?: boolean;
    approvalNumber?: string;
    hazardousSubstance?: string;
    casNo?: string;
    hskNo?: string;
    registeredProductName?: string;
    importCountry?: string;
    no?: number;
    bmMatches?: RegisteredApprovalItemDetail[];
    emMatches?: RegisteredApprovalItemDetail[];
    bmChemicalSpecMatches?: BmChemicalSpecItemDetail[];
  };
}

export interface BmChemicalSpecItemDetail {
  no: number;
  productName: string;
  modelSpec: string;
}

export interface RegisteredApprovalItemDetail {
  type: 'BM' | 'EM';
  no: number;
  productName: string;
  approvalNumber: string;
  hazardousSubstance: string;
  casNo: string;
  hskNo?: string;
  importCountry?: string;
  contentPercent?: string;
  toxicItems?: {
    toxicName: string;
    contentPercent: string;
    casNo: string;
  }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  department?: string; // 통상지원팀
}
