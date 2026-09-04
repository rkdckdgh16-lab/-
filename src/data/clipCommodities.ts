import { TradeItem, CountryTariffInfo } from '../types';

export interface ClipCommodity {
  hsCode: string;
  nameKr: string;
  nameEn: string;
  category: string;
  hsDescription: string;
  unit: string;
  defaultUnitPriceUsd: number;
  baseRate: number; // 관세법 별표 기본세율 (A)
  wtoRate: number; // WTO협정양허세율 (C/CIT)
  quotaRate?: number; // 할당관세 (W)
  ftaRates: {
    [countryCode: string]: { ftaName: string; code: string; rate: number; notes?: string } | undefined;
    CN?: { ftaName: string; code: string; rate: number; notes?: string };
    US?: { ftaName: string; code: string; rate: number; notes?: string };
    DE?: { ftaName: string; code: string; rate: number; notes?: string };
    JP?: { ftaName: string; code: string; rate: number; notes?: string };
    VN?: { ftaName: string; code: string; rate: number; notes?: string };
    AU?: { ftaName: string; code: string; rate: number; notes?: string };
    GB?: { ftaName: string; code: string; rate: number; notes?: string };
    IN?: { ftaName: string; code: string; rate: number; notes?: string };
  };
  regulations?: {
    isControlled: boolean;
    applicableLaws: string[];
    requiredCertificates: string[];
    inspectionAgency: string;
    clearanceNotes: string;
  };
  searchKeywords: string[];
}

/**
 * 관세청 관세법령정보포털 CLIP (https://unipass.customs.go.kr/clip/index.do)
 * 세번/상품검색 공식 데이터베이스 (다양한 수입 산업군 대표 품목 및 세번)
 */
export const CLIP_COMMODITIES_DATABASE: ClipCommodity[] = [
  // ========================================================
  // [1] 반도체 / IT / 전기전자 (HS 85류)
  // ========================================================
  {
    hsCode: '8542.31-1000',
    nameKr: '전자집적회로 (프로세서 및 컨트롤러 / AP·CPU)',
    nameEn: 'ELECTRONIC INTEGRATED CIRCUITS (PROCESSORS AND CONTROLLERS)',
    category: '전기전자/반도체',
    hsDescription: '메모리·컨버터·논리회로·증폭기·클록회로 등을 갖춘 프로세서 및 컨트롤러 (스마트폰 AP, 컴퓨터 CPU 등)',
    unit: 'EA',
    defaultUnitPriceUsd: 45.0,
    baseRate: 8.0,
    wtoRate: 0.0, // ITA 정보기술협정 무세
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: 'ITA 양허 무세' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 0%' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 0%' },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0, notes: 'RCEP 0%' },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: 'VKFTA 0%' },
      TW: { ftaName: 'ITA 양허', code: 'CIT', rate: 0.0, notes: 'WTO ITA 무세' }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['상업송장(Invoice)', '포장명세서(Packing List)'],
      inspectionAgency: '관세청 세관',
      clearanceNotes: '전기용품안전관리법 및 전파법 비대상(단독 부품). ITA 협정세율 0% 즉시 적용.'
    },
    searchKeywords: ['반도체', '집적회로', 'ic', 'cpu', 'ap', 'processor', '칩', '시스템반도체', '8542', '854231']
  },
  {
    hsCode: '8542.32-1000',
    nameKr: '전자집적회로 메모리 (DRAM / 플래시메모리)',
    nameEn: 'ELECTRONIC INTEGRATED CIRCUITS (MEMORIES - DRAM / FLASH)',
    category: '전기전자/반도체',
    hsDescription: '데이터를 일시적 또는 영구적으로 저장하는 휘발성/비휘발성 반도체 메모리 소자',
    unit: 'EA',
    defaultUnitPriceUsd: 12.5,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['C/O 원산지증명서', 'BOM'],
      inspectionAgency: '관세청',
      clearanceNotes: '정보기술협정(ITA) 대상물품으로 양허관세(0%) 적용 대상.'
    },
    searchKeywords: ['메모리', 'dram', 'nand', 'flash', '디램', '낸드플래시', 'ssd용메모리', '8542', '854232']
  },
  {
    hsCode: '8517.13-0000',
    nameKr: '스마트폰 (셀룰러망이나 그 밖의 무선망용 전화기)',
    nameEn: 'SMARTPHONES FOR CELLULAR OR WIRELESS NETWORKS',
    category: '전기전자/정보통신',
    hsDescription: '이동통신망 또는 무선 네트워크를 통해 음성, 영상 및 데이터를 송수신하는 스마트폰',
    unit: 'EA',
    defaultUnitPriceUsd: 420.0,
    baseRate: 8.0,
    wtoRate: 0.0, // ITA 0%
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전파법 제58조의2 (방송통신기자재등의 적합성평가)'],
      requiredCertificates: ['방송통신기자재등의 적합등록/인증 필증 (국립전파연구원)', 'KC 전파인증서'],
      inspectionAgency: '과학기술정보통신부 국립전파연구원',
      clearanceNotes: '개인 자가사용 1대를 초과하는 상용 수입의 경우 반드시 국립전파연구원의 적합성평가(KC 인증)를 통관 전 세관장확인번호로 입력해야 함.'
    },
    searchKeywords: ['스마트폰', '핸드폰', '휴대폰', '휴대전화', '모바일폰', '아이폰', '갤럭시', 'smartphone', '8517', '851713']
  },
  {
    hsCode: '8507.60-2000',
    nameKr: '리튬이온 축전지 (전기자동차용 배터리 팩/모듈)',
    nameEn: 'LITHIUM-ION ACCUMULATORS FOR ELECTRIC VEHICLES',
    category: '전기전자/배터리',
    hsDescription: '전기자동차(EV) 구동용 리튬이온 2차전지 배터리 모듈 및 팩',
    unit: 'EA',
    defaultUnitPriceUsd: 2500.0,
    baseRate: 8.0,
    wtoRate: 0.0, // 친환경차/ITA 무세
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전기용품 및 생활용품 안전관리법', '위험물안전관리법'],
      requiredCertificates: ['KC 안전확인신고증명서 (안전인증기관)', 'UN 38.3 리튬배터리 운송안전 시험성적서', 'MSDS'],
      inspectionAgency: '국가기술표준원, 한국기계전기전자시험연구원(KTC)',
      clearanceNotes: '에너지밀도 400Wh/L 이상 또는 이동용 리튬 2차전지는 KC 안전확인대상. 수입통관 시 안전확인번호 필수.'
    },
    searchKeywords: ['리튬배터리', '배터리모듈', '배터리팩', '2차전지', '전기차배터리', 'lithium battery', 'accumulator', '8507', '850760']
  },
  {
    hsCode: '8534.00-1000',
    nameKr: '인쇄회로기판 (PCB / 다층 인쇄회로)',
    nameEn: 'PRINTED CIRCUITS (MULTILAYER PCB)',
    category: '전기전자/부품',
    hsDescription: '인쇄배선 및 인쇄소자를 인쇄공법으로 형성한 다층 인쇄회로기판(PCB)',
    unit: 'EA',
    defaultUnitPriceUsd: 4.8,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['상업송장', '패킹리스트', 'C/O'],
      inspectionAgency: '관세청',
      clearanceNotes: 'ITA 협정세율 대상 물품(0%). 별도의 세관장확인 요건 없음.'
    },
    searchKeywords: ['pcb', '인쇄회로기판', '회로기판', '기판', 'printed circuit', 'fpcb', '8534']
  },
  {
    hsCode: '8504.40-3000',
    nameKr: '인버터 (정지형 변환기 / 전력변환장치)',
    nameEn: 'INVERTERS (STATIC CONVERTERS)',
    category: '전기전자/부품',
    hsDescription: '직류(DC) 전력을 교류(AC) 전력으로 변환하는 산업용 및 신재생에너지용 인버터',
    unit: 'EA',
    defaultUnitPriceUsd: 380.0,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전기용품 및 생활용품 안전관리법', '전파법'],
      requiredCertificates: ['KC 안전확인신고필증', '전파법 적합등록필증'],
      inspectionAgency: 'KTR, KTC, 국립전파연구원',
      clearanceNotes: '정격용량 10kVA 이하의 전력변환장치는 안전확인 및 적합성평가 대상.'
    },
    searchKeywords: ['인버터', '컨버터', '변환기', '전력변환기', '태양광인버터', 'inverter', '8504', '850440']
  },

  // ========================================================
  // [2] 기계 / 제조설비 / 정밀측정기기 (HS 84류, 90류)
  // ========================================================
  {
    hsCode: '8486.20-1000',
    nameKr: '반도체 디바이스 제조용 장비 (노광기·식각기·증착기)',
    nameEn: 'MACHINES FOR THE MANUFACTURE OF SEMICONDUCTOR DEVICES',
    category: '기계/반도체설비',
    hsDescription: '반도체 웨이퍼 상에 회로를 형성하거나 처리하기 위한 노광, 식각, 박막 증착 장비',
    unit: 'SET',
    defaultUnitPriceUsd: 150000.0,
    baseRate: 8.0,
    wtoRate: 0.0, // ITA 장비 무세
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      NL: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['산업안전보건법 제84조 (안전인증/자율안전확인)', '대외무역법 (전략물자통제)'],
      requiredCertificates: ['KCs 자율안전확인신고필증 (안전보건공단)', '전략물자 수입목적확인서'],
      inspectionAgency: '한국산업안전보건공단, 전략물자관리원(KOSTI)',
      clearanceNotes: '첨단 반도체 제조 장비는 전략물자 수출입통제 대상 여부 확인 필수. 관세율은 ITA협정에 따라 0% 무세 적용.'
    },
    searchKeywords: ['반도체장비', '노광기', '식각기', '증착기', '클린룸장비', 'asml', 'semiconductor machine', '8486', '848620']
  },
  {
    hsCode: '8479.50-0000',
    nameKr: '산업용 로봇 (다관절 로봇 / 자동화 매니퓰레이터)',
    nameEn: 'INDUSTRIAL ROBOTS NOT ELSEWHERE SPECIFIED',
    category: '기계/자동화설비',
    hsDescription: '제조 공정에서 물품을 이송, 용접, 조립, 도장하기 위한 다기능 자동제어 산업용 로봇',
    unit: 'SET',
    defaultUnitPriceUsd: 28000.0,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['산업안전보건법 (자율안전확인신고)'],
      requiredCertificates: ['자율안전확인신고증명서 (한국산업안전보건공단)'],
      inspectionAgency: '고용노동부, 안전보건공단',
      clearanceNotes: '산업용 로봇은 근로자 끼임 방지 등 안전성 검증을 위해 통관 전 안전보건공단의 자율안전확인신고번호를 구비해야 함.'
    },
    searchKeywords: ['산업용로봇', '로봇', '협동로봇', '다관절로봇', 'robot', 'industrial robot', '8479', '847950']
  },
  {
    hsCode: '8471.50-1000',
    nameKr: '서버 컴퓨터 (자동자료처리기계의 중앙처리장치)',
    nameEn: 'SERVER COMPUTERS (PROCESSING UNITS FOR AUTOMATIC DATA PROCESSING)',
    category: '기계/IT하드웨어',
    hsDescription: '데이터센터 및 기업용 고성능 랙마운트 서버 및 연산처리 컴퓨터',
    unit: 'SET',
    defaultUnitPriceUsd: 4800.0,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      TW: { ftaName: 'ITA 양허', code: 'CIT', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전파법 제58조의2 (방송통신기자재 적합등록)'],
      requiredCertificates: ['방송통신기자재등의 적합등록필증 (국립전파연구원)'],
      inspectionAgency: '국립전파연구원',
      clearanceNotes: '컴퓨터 서버 본체는 전파법상 전자파적합성(EMC) 등록 대상. 관세는 ITA 무세(0%).'
    },
    searchKeywords: ['서버', '컴퓨터', '서버컴퓨터', '메인프레임', 'server', 'rack server', '8471', '847150']
  },
  {
    hsCode: '9031.49-1000',
    nameKr: '광학식 검사기기 (웨이퍼·PCB 결함 광학식 검사장비)',
    nameEn: 'OPTICAL INSPECTION INSTRUMENTS FOR SEMICONDUCTOR WAFERS',
    category: '정밀기기/검사장비',
    hsDescription: '반도체 웨이퍼, 디스플레이 패널, PCB 기판의 패턴 결함을 광학적으로 측정·검사하는 장비',
    unit: 'SET',
    defaultUnitPriceUsd: 85000.0,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['상업송장', 'C/O'],
      inspectionAgency: '관세청',
      clearanceNotes: 'ITA 협정에 따라 무세(0%) 적용. 연구개발용 감면 대상 검토 가능.'
    },
    searchKeywords: ['광학검사기', 'aoi', '검사장비', '웨이퍼검사', 'inspection', '9031', '903149']
  },
  {
    hsCode: '9027.89-1000',
    nameKr: '물리화학 분석기기 (질량분석기 / 열중량분석기 TGA)',
    nameEn: 'INSTRUMENTS FOR PHYSICAL OR CHEMICAL ANALYSIS',
    category: '정밀기기/분석장비',
    hsDescription: '이차전지 소재, 화학물질의 열적 특성, 결정 구조, 질량을 정밀 분석하는 연구용 계측기',
    unit: 'SET',
    defaultUnitPriceUsd: 65000.0,
    baseRate: 8.0,
    wtoRate: 0.0,
    ftaRates: {
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['Invoice', 'Packing List'],
      inspectionAgency: '관세청',
      clearanceNotes: '정밀 분석기기로 기본 관세 0% (WTO 양허). 학술연구용 감면 해당 여부 확인 가능.'
    },
    searchKeywords: ['분석기', 'tga', '질량분석기', '연구장비', '분석장비', '화학분석기', '9027', '902789']
  },

  // ========================================================
  // [3] 화학 / 배터리 소재 / 원자재 (HS 28류, 38류, 39류)
  // ========================================================
  {
    hsCode: '2825.20-1000',
    nameKr: '수산화리튬 (무수 및 일수화물 / 배터리용 리튬원료)',
    nameEn: 'LITHIUM HYDROXIDE (ANHYDROUS AND MONOHYDRATE)',
    category: '화학/배터리소재',
    hsDescription: '하이니켈 삼원계(NCM/NCA) 양극재 제조의 핵심 무기화학 원료',
    unit: 'KG',
    defaultUnitPriceUsd: 14.5,
    baseRate: 5.0,
    wtoRate: 5.5,
    quotaRate: 0.0, // 배터리 원자재 할당관세 0%
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: '양허 무세' },
      CL: { ftaName: '한-칠레 FTA (FCL1)', code: 'FCL1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법 (화관법 제9조)', '산업안전보건법 (MSDS)'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA 협회 제출필증)', '국문 MSDS 자료'],
      inspectionAgency: '환경부 화학물질안전원, 한국화학물질관리협회',
      clearanceNotes: '유독물질 해당 여부 확인 필수. 관세청 할당관세 적용 시 0%로 통관 가능.'
    },
    searchKeywords: ['수산화리튬', '리튬', 'lioh', '배터리소재', 'lithium hydroxide', '2825', '282520']
  },
  {
    hsCode: '2836.91-1000',
    nameKr: '탄산리튬 (LFP 및 리튬염 원료)',
    nameEn: 'LITHIUM CARBONATES',
    category: '화학/배터리소재',
    hsDescription: '리튬이온 2차전지 LFP 양극재 합성 및 수산화리튬 전환용 핵심 원료',
    unit: 'KG',
    defaultUnitPriceUsd: 11.0,
    baseRate: 5.0,
    wtoRate: 5.5,
    quotaRate: 0.0,
    ftaRates: {
      CL: { ftaName: '한-칠레 FTA (FCL1)', code: 'FCL1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['화학물질관리법'],
      requiredCertificates: ['화학물질 확인명세서 (한국화학물질관리협회)'],
      inspectionAgency: '환경부, 관세청',
      clearanceNotes: '통관 전 KCMA 수입확인명세 제출 필수.'
    },
    searchKeywords: ['탄산리튬', '리튬카보네이트', 'li2co3', 'lfp원료', 'lithium carbonate', '2836', '283691']
  },
  {
    hsCode: '3801.10-0000',
    nameKr: '인조흑연 (이차전지 음극활물질용 분말)',
    nameEn: 'ARTIFICIAL GRAPHITE IN POWDER FORM FOR BATTERY ANODES',
    category: '화학/음극재',
    hsDescription: '리튬이온 전지의 음극재로 사용되는 고순도 인조흑연 분말',
    unit: 'KG',
    defaultUnitPriceUsd: 6.2,
    baseRate: 8.0,
    wtoRate: 6.5,
    quotaRate: 0.0,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['대외무역법 (전략물자/수출통제 품목)', '화학물질관리법'],
      requiredCertificates: ['수입확인명세서', '전략물자 사전판정서'],
      inspectionAgency: '산업통상자원부, 환경부',
      clearanceNotes: '흑연은 각국 수출통제 대상(이중용도 품목). 공급망 원산지증명 철저 관리 요망.'
    },
    searchKeywords: ['흑연', '인조흑연', '음극재', '음극활물질', 'graphite', 'artificial graphite', '3801', '380110']
  },
  {
    hsCode: '3901.10-0000',
    nameKr: '선형 저밀도 폴리에틸렌 (LLDPE / 플라스틱 원료)',
    nameEn: 'POLYETHYLENE HAVING A SPECIFIC GRAVITY OF LESS THAN 0.94',
    category: '석유화학/합성수지',
    hsDescription: '포장 필름, 절연재, 산업용 용기 제조용 기본 플라스틱 폴리머 레진',
    unit: 'KG',
    defaultUnitPriceUsd: 1.15,
    baseRate: 6.5,
    wtoRate: 6.5,
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      SA: { ftaName: '일반 MFN', code: 'A', rate: 6.5 },
      AE: { ftaName: '한-UAE CEPA', code: 'FAE1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['화학물질관리법'],
      requiredCertificates: ['화학물질 확인명세서 (KCMA)'],
      inspectionAgency: '환경부',
      clearanceNotes: '고분자화합물로 화평법상 기존화학물질 등록 여부 확인.'
    },
    searchKeywords: ['폴리에틸렌', 'pe', 'lldpe', '플라스틱', '합성수지', 'polyethylene', '3901', '390110']
  },

  // ========================================================
  // [4] 자동차 / 운송기기 및 부품 (HS 87류)
  // ========================================================
  {
    hsCode: '8703.80-1000',
    nameKr: '전기승용자동차 (순수 배터리 전기차 EV)',
    nameEn: 'MOTOR CARS WITH ONLY ELECTRIC MOTOR FOR PROPULSION',
    category: '자동차/완성차',
    hsDescription: '구동용 전기모터만을 동력원으로 사용하는 순수 배터리 전기 승용차(BEV)',
    unit: 'U',
    defaultUnitPriceUsd: 38000.0,
    baseRate: 8.0,
    wtoRate: 8.0,
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 무세' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 무세' },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['자동차관리법 (자동차 안전기준 및 자기인증)', '대기환경보전법 (배출가스·소음 인증)'],
      requiredCertificates: ['자동차 자기인증확인서 (한국교통안전공단 자동차안전연구원 KATRI)', '배출가스/소음 인증서 (국립환경과학원)'],
      inspectionAgency: '국토교통부, 환경부',
      clearanceNotes: '수입 자동차는 통관 시 자기인증번호 및 소음·진동 확인번호 필수. 개별소비세(5%) 및 교육세(30%) 부과 대상.'
    },
    searchKeywords: ['전기차', '전기자동차', 'ev', '테슬라', '아이오닉', '자동차', 'electric vehicle', '8703', '870380']
  },
  {
    hsCode: '8708.29-9000',
    nameKr: '자동차 차체 부품 (도어·펜더·사이드실·배터리보호프레임)',
    nameEn: 'PARTS AND ACCESSORIES OF BODIES FOR MOTOR VEHICLES',
    category: '자동차/부품',
    hsDescription: '자동차 조립 및 A/S용 차체 구조 강판 프레스 부품 및 배터리 팩 하부 프로텍터',
    unit: 'EA',
    defaultUnitPriceUsd: 48.0,
    baseRate: 8.0,
    wtoRate: 8.0,
    ftaRates: {
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['자동차관리법'],
      requiredCertificates: ['상업송장', 'C/O'],
      inspectionAgency: '관세청',
      clearanceNotes: '일반 차체 부품은 FTA 적용 시 무세(0%).'
    },
    searchKeywords: ['자동차부품', '차체', '도어', '범퍼', '배터리케이스', 'auto parts', '8708', '870829']
  },

  // ========================================================
  // [5] 철강 / 비철금속 (HS 72류, 74류, 76류)
  // ========================================================
  {
    hsCode: '7410.11-0000',
    nameKr: '동박 (전해동박 / 배터리 음극재 집전체용 구리박)',
    nameEn: 'COPPER FOIL NOT BACKED (ELECTROLYTIC FOIL FOR BATTERY ANODES)',
    category: '철강/비철금속',
    hsDescription: '두께 0.15mm 이하의 고순도 구리박으로 리튬이온 2차전지 음극 집전체용 원소재',
    unit: 'KG',
    defaultUnitPriceUsd: 11.8,
    baseRate: 8.0,
    wtoRate: 5.5,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 },
      MY: { ftaName: '한-아세안 FTA (FAK1)', code: 'FAK1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['밀시트(Mill Sheet 시험성적서)', 'C/O'],
      inspectionAgency: '관세청',
      clearanceNotes: '품질시험성적서 첨부 권장. FTA 협정세율 0% 적용.'
    },
    searchKeywords: ['동박', '구리박', '동판', '음극집전체', 'copper foil', '7410', '741011']
  },
  {
    hsCode: '7606.12-0000',
    nameKr: '알루미늄 합금 판 (양극 집전체용 알루미늄 박/판)',
    nameEn: 'ALUMINIUM PLATES, SHEETS AND STRIP OF ALUMINIUM ALLOYS',
    category: '철강/비철금속',
    hsDescription: '배터리 양극 집전체 및 항공·차량용 경량 알루미늄 압연 합금 판재',
    unit: 'KG',
    defaultUnitPriceUsd: 3.8,
    baseRate: 8.0,
    wtoRate: 7.5,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법'],
      requiredCertificates: ['시험성적서', '상업송장'],
      inspectionAgency: '관세청',
      clearanceNotes: '알루미늄 판재는 두께와 합금 번호(1000계, 3000계 등) 규격 표기 필수.'
    },
    searchKeywords: ['알루미늄', '알루미늄판', '알루미늄박', '양극집전체', 'aluminium sheet', '7606', '760612']
  },

  // ========================================================
  // [6] 화장품 / 뷰티 / 생활용품 (HS 33류)
  // ========================================================
  {
    hsCode: '3304.99-1000',
    nameKr: '기초화장용 제품류 (스킨·로션·에센스·수분크림)',
    nameEn: 'BEAUTY OR MAKE-UP PREPARATIONS AND PREPARATIONS FOR THE CARE OF THE SKIN',
    category: '화장품/소비재',
    hsDescription: '피부 보습 및 영양 공급을 위한 페이셜 스킨, 에멀전 로션, 세럼, 수분 크림류',
    unit: 'KG',
    defaultUnitPriceUsd: 28.0,
    baseRate: 6.5,
    wtoRate: 6.5,
    ftaRates: {
      FR: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['화장품법 제5조 (화장품책임판매업 등록 및 표준통관예정보고)'],
      requiredCertificates: ['표준통관예정보고서 승인필증 (대한화장품협회 EDI)', '화장품책임판매업 등록증', '제조증명서/자유판매증명서(CFS)'],
      inspectionAgency: '식품의약품안전처, 대한화장품협회',
      clearanceNotes: '화장품 수입통관 전 한국의약품수출입협회 또는 대한화장품협회를 통한 전자문서교환(EDI) 표준통관예정보고 승인번호 필수.'
    },
    searchKeywords: ['화장품', '스킨', '로션', '크림', '에센스', '세럼', 'cosmetics', 'skincare', '3304', '330499']
  },
  {
    hsCode: '3304.10-0000',
    nameKr: '입술 메이크업용 제품류 (립스틱·틴트·립글로스)',
    nameEn: 'LIP MAKE-UP PREPARATIONS',
    category: '화장품/소비재',
    hsDescription: '입술의 착색과 보호를 위한 립스틱, 립틴트, 립글로스 및 립밤',
    unit: 'KG',
    defaultUnitPriceUsd: 35.0,
    baseRate: 6.5,
    wtoRate: 6.5,
    ftaRates: {
      FR: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['화장품법 (식약처 기능성화장품 심사 및 표준통관예정보고)'],
      requiredCertificates: ['표준통관예정보고서', '전성분표(COA)', 'BSE 미감염증명서'],
      inspectionAgency: '식약처, 한국의약품수출입협회',
      clearanceNotes: '타르색소 및 방부제 배합한도 기준 적합 여부 확인 필수.'
    },
    searchKeywords: ['립스틱', '틴트', '립메이크업', '립밤', '화장품', 'lipstick', '3304', '330410']
  },

  // ========================================================
  // [7] 주류 / 음료 / 식품 (HS 22류, 09류, 03류)
  // ========================================================
  {
    hsCode: '2204.21-1000',
    nameKr: '포도주 (와인 / 2리터 이하 용기 포장 레드·화이트)',
    nameEn: 'WINE OF FRESH GRAPES (CONTAINERS HOLDING 2L OR LESS)',
    category: '주류/식품',
    hsDescription: '유리병에 포장된 발효 포도주(레드 와인, 화이트 와인 등 병와인)',
    unit: 'L',
    defaultUnitPriceUsd: 18.0,
    baseRate: 30.0, // 관세법 기본 30%
    wtoRate: 15.0,
    ftaRates: {
      FR: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU FTA 0% (무세)' },
      IT: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 0% (무세)' },
      CL: { ftaName: '한-칠레 FTA (FCL1)', code: 'FCL1', rate: 0.0 },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['수입식품안전관리 특별법 제20조', '주세법'],
      requiredCertificates: ['수입식품등의 수입신고확인증 (식약처 관할청)', '제조공정도 및 원료성분배합비율표', '한글표시사항 스티커'],
      inspectionAgency: '식품의약품안전처 (서울/경인/부산 등 지방청)',
      clearanceNotes: '식약처 최초 수입 시 정밀검사(이산화황, 보존료 등 검사) 필수. 관세 외에 주세(30%), 교육세(10%), 부가세(10%)가 연계 산출됨.'
    },
    searchKeywords: ['와인', '포도주', '레드와인', '화이트와인', 'wine', '보르도', '2204', '220421']
  },
  {
    hsCode: '2208.30-1000',
    nameKr: '위스키 (스카치위스키·버번·몰트위스키)',
    nameEn: 'WHISKIES (SCOTCH, BOURBON, SINGLE MALT)',
    category: '주류/식품',
    hsDescription: '곡물을 발효 증류하여 오크통에 숙성한 증류주(스카치, 버번, 아이리시 위스키 등)',
    unit: 'L',
    defaultUnitPriceUsd: 45.0,
    baseRate: 20.0,
    wtoRate: 20.0,
    ftaRates: {
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0, notes: '스카치위스키 무세' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: '버번위스키 0%' },
      IE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['수입식품안전관리 특별법', '주세법'],
      requiredCertificates: ['수입식품 수입신고확인증', '원산지증명서(C/O)', '에이징 확인서(연산 증명서)'],
      inspectionAgency: '식품의약품안전처, 국세청',
      clearanceNotes: '식약처 정밀검사 및 주세(72%), 교육세(30%), 부가세(10%) 부과. 고세율 주류 품목.'
    },
    searchKeywords: ['위스키', '양주', '스카치위스키', '싱글몰트', '버번', 'whisky', 'whiskey', '2208', '220830']
  },
  {
    hsCode: '0901.11-0000',
    nameKr: '커피 (탈카페인하지 않은 생두 / 그린빈)',
    nameEn: 'COFFEE, NOT ROASTED, NOT DECAFFEINATED',
    category: '농식품/원자재',
    hsDescription: '로스팅하지 않은 아라비카 및 로부스타 커피 생두',
    unit: 'KG',
    defaultUnitPriceUsd: 4.5,
    baseRate: 2.0,
    wtoRate: 2.0,
    quotaRate: 0.0, // 커피 원두 물가안정 할당관세 0%
    ftaRates: {
      BR: { ftaName: '일반 MFN', code: 'A', rate: 2.0 },
      CO: { ftaName: '한-콜롬비아 FTA', code: 'FCO1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      ET: { ftaName: '최빈개도국 특혜 (R)', code: 'R', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['식물방역법', '수입식품안전관리 특별법'],
      requiredCertificates: ['식물검역증명서 (수출국 검역당국 발급)', '식약처 수입신고확인증'],
      inspectionAgency: '농림축산검역본부, 식품의약품안전처',
      clearanceNotes: '통관 전 농림축산검역본부의 식물검역 합격 필수(병해충 검역). 물가안정 부가세 면세 또는 할당관세 0% 여부 확인.'
    },
    searchKeywords: ['커피', '커피생두', '원두', '생두', '아라비카', '로부스타', 'coffee', 'green coffee', '0901', '090111']
  },
  {
    hsCode: '0303.11-0000',
    nameKr: '냉동 연어 (홍연어 / 대서양연어 등 냉동 어류)',
    nameEn: 'FROZEN SOCKEYE SALMON (SALMO SALAR)',
    category: '수산식품',
    hsDescription: '머리나 내장을 제거하거나 원형 그대로 급속 냉동한 연어',
    unit: 'KG',
    defaultUnitPriceUsd: 9.5,
    baseRate: 10.0,
    wtoRate: 10.0,
    ftaRates: {
      NO: { ftaName: '한-EFTA FTA (FEF1)', code: 'FEF1', rate: 0.0, notes: '노르웨이산 0%' },
      CL: { ftaName: '한-칠레 FTA (FCL1)', code: 'FCL1', rate: 0.0 },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['수산생물질병 관리법', '수입식품안전관리 특별법'],
      requiredCertificates: ['수출위생증명서 (수출국 정부 발행)', '수산생물검역증명서'],
      inspectionAgency: '국립수산물품질관리원(수품원), 식약처',
      clearanceNotes: '수산물 검역 및 식약처 방사능·중금속 검사 통과 필수.'
    },
    searchKeywords: ['연어', '생선', '수산물', '냉동연어', 'salmon', '0303', '030311']
  },

  // ========================================================
  // [8] 섬유 / 의류 / 패션잡화 (HS 61류, 62류, 42류, 64류)
  // ========================================================
  {
    hsCode: '6109.10-1000',
    nameKr: '면제 티셔츠 (남성·여성용 면 편물제 T셔츠)',
    nameEn: 'T-SHIRTS, SINGLETS AND OTHER VESTS, OF COTTON, KNITTED',
    category: '섬유/의류',
    hsDescription: '면 100% 또는 면 혼방의 니트 편물제 반소매/긴소매 티셔츠',
    unit: 'EA',
    defaultUnitPriceUsd: 8.5,
    baseRate: 13.0,
    wtoRate: 13.0,
    ftaRates: {
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: '원산지기준 충족 시 0%' },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 2.6 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전기용품 및 생활용품 안전관리법 (안전기준준수대상 생활용품)', '대외무역법 (원산지표시)'],
      requiredCertificates: ['KC 안전품질표시(KC라벨)', '시험성적서(포름알데히드, 아릴아민 등 유해물질 불검출)'],
      inspectionAgency: '국가기술표준원, FITI/FITI시험연구원',
      clearanceNotes: '의류 완제품은 한글 케어라벨(섬유 혼용률, 세탁취급표시, 제조국 원산지표시) 부착 필수.'
    },
    searchKeywords: ['티셔츠', '옷', '의류', '면티', '상의', 't-shirt', 'clothes', '6109', '610910']
  },
  {
    hsCode: '4202.21-0000',
    nameKr: '가죽 핸드백 (천연가죽제 여성·남성 가방)',
    nameEn: 'HANDBAGS WITH OUTER SURFACE OF LEATHER',
    category: '패션잡화/가방',
    hsDescription: '겉면이 천연가죽 또는 재생가죽으로 제작된 핸드백, 숄더백, 토트백',
    unit: 'EA',
    defaultUnitPriceUsd: 110.0,
    baseRate: 8.0,
    wtoRate: 8.0,
    ftaRates: {
      IT: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '이탈리아산 0%' },
      FR: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0 },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전기용품 및 생활용품 안전관리법 (가죽제품 안전기준)', '대외무역법'],
      requiredCertificates: ['KC 가죽제품 품질라벨', 'CITES 허가서(악어·뱀가죽 등 특수가죽 수입 시)'],
      inspectionAgency: '국가기술표준원, 환경부(CITES)',
      clearanceNotes: '원산지표시(Made in Italy 등) 영구 부착 필수. 200만원 초과 고가 가방은 개별소비세 검토.'
    },
    searchKeywords: ['핸드백', '가방', '가죽가방', '명품가방', 'bag', 'handbag', '4202', '420221']
  },
  {
    hsCode: '6402.19-0000',
    nameKr: '운동화 (갑피 및 바닥이 고무·플라스틱제인 스포츠 신발)',
    nameEn: 'SPORTS FOOTWEAR WITH OUTER SOLES AND UPPERS OF RUBBER OR PLASTICS',
    category: '패션잡화/신발',
    hsDescription: '런닝화, 워킹화, 스니커즈 등 운동용 및 일상용 스포츠 신발',
    unit: 'PR',
    defaultUnitPriceUsd: 26.0,
    baseRate: 13.0,
    wtoRate: 13.0,
    ftaRates: {
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0 },
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 3.9 },
      ID: { ftaName: '한-인니 CEPA (FID1)', code: 'FID1', rate: 0.0 }
    },
    regulations: {
      isControlled: true,
      applicableLaws: ['전기용품 및 생활용품 안전관리법', '대외무역법'],
      requiredCertificates: ['KC 안전품질라벨', '유해물질(프탈레이트 가소제 등) 검사'],
      inspectionAgency: '국가기술표준원',
      clearanceNotes: '신발 안쪽 또는 혀 부분에 원산지 및 사이즈, 신발 재질 라벨 명시.'
    },
    searchKeywords: ['운동화', '신발', '스니커즈', '런닝화', 'shoes', 'sneakers', 'footwear', '6402', '640219']
  }
];

/**
 * 검색어를 바탕으로 CLIP 품목 데이터베이스를 지능적으로 검색
 * (세번 10자리, 6자리, 4자리, 국문 품명, 영문 품명, 카테고리, 검색 키워드 매칭)
 */
export function searchClipCommodities(query: string): ClipCommodity[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return CLIP_COMMODITIES_DATABASE.slice(0, 15);
  }

  const normalized = trimmed.replace(/[\s-._/]/g, '');
  const tokens = trimmed.split(/\s+/).filter(Boolean);

  const matched: { commodity: ClipCommodity; score: number }[] = [];

  for (const c of CLIP_COMMODITIES_DATABASE) {
    let score = 0;
    const cHsNorm = c.hsCode.replace(/[\s-._/]/g, '').toLowerCase();
    const cNameKr = c.nameKr.toLowerCase();
    const cNameEn = c.nameEn.toLowerCase();
    const cDesc = c.hsDescription.toLowerCase();

    // 1. HS Code 정확 매칭 또는 앞자리 매칭
    if (cHsNorm === normalized) {
      score += 100;
    } else if (cHsNorm.startsWith(normalized) || normalized.startsWith(cHsNorm.slice(0, 4))) {
      score += 60;
    }

    // 2. 품명 직접 일치
    if (cNameKr.includes(trimmed) || cNameEn.includes(trimmed)) {
      score += 50;
    }

    // 3. 키워드 일치
    for (const kw of c.searchKeywords) {
      const kwNorm = kw.replace(/[\s-._/]/g, '').toLowerCase();
      if (kwNorm === normalized) {
        score += 40;
      } else if (kw.includes(trimmed) || trimmed.includes(kw)) {
        score += 25;
      }
    }

    // 4. 토큰 단위 검사
    for (const t of tokens) {
      if (cNameKr.includes(t)) score += 15;
      if (cNameEn.includes(t)) score += 10;
      if (cDesc.includes(t)) score += 5;
    }

    if (score > 0) {
      matched.push({ commodity: c, score });
    }
  }

  // 점수 순 내림차순 정렬
  matched.sort((a, b) => b.score - a.score);
  return matched.map(m => m.commodity);
}

/**
 * CLIP 데이터베이스에 없는 세번 또는 품명이 입력되었을 때,
 * 관세율표 규칙을 분석하여 지능형 임의 품목 생성 (사용자 직접 입력 세번 지원)
 */
export function generateDynamicClipCommodity(
  query: string,
  customHsCode?: string,
  customName?: string
): ClipCommodity {
  const cleanQuery = query.trim();
  let cleanHs = (customHsCode || '').trim();

  // 1. 사용자가 세번을 직접 입력한 경우 최우선 적용
  if (cleanHs) {
    const rawDigits = cleanHs.replace(/[^0-9]/g, '');
    if (rawDigits.length >= 4 && !cleanHs.includes('.')) {
      if (rawDigits.length >= 10) {
        cleanHs = `${rawDigits.slice(0, 4)}.${rawDigits.slice(4, 6)}-${rawDigits.slice(6, 10)}`;
      } else if (rawDigits.length >= 6) {
        cleanHs = `${rawDigits.slice(0, 4)}.${rawDigits.slice(4, 6)}-0000`;
      } else {
        cleanHs = `${rawDigits.slice(0, 4)}.00-0000`;
      }
    }
  } else {
    // 2. 직접 입력된 세번이 없으면 검색어(query)로부터 세번 추론
    const digitsOnly = cleanQuery.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 4) {
      if (digitsOnly.length >= 10) {
        cleanHs = `${digitsOnly.slice(0, 4)}.${digitsOnly.slice(4, 6)}-${digitsOnly.slice(6, 10)}`;
      } else if (digitsOnly.length >= 6) {
        cleanHs = `${digitsOnly.slice(0, 4)}.${digitsOnly.slice(4, 6)}-0000`;
      } else {
        cleanHs = `${digitsOnly.slice(0, 4)}.00-0000`;
      }
    } else {
      const qLower = cleanQuery.toLowerCase();
      if (qLower.includes('스마트폰') || qLower.includes('휴대폰') || qLower.includes('핸드폰') || qLower.includes('phone')) {
        cleanHs = '8517.13-0000'; // 스마트폰 공식 HS CODE
      } else if (qLower.includes('반도체') || qLower.includes('ic') || qLower.includes('cpu') || qLower.includes('ap')) {
        cleanHs = '8542.31-1000';
      } else if (qLower.includes('메모리') || qLower.includes('dram') || qLower.includes('nand') || qLower.includes('플래시')) {
        cleanHs = '8542.32-1000';
      } else if (qLower.includes('배터리') || qLower.includes('이차전지') || qLower.includes('battery')) {
        cleanHs = '8507.60-0000';
      } else if (qLower.includes('노트북') || qLower.includes('컴퓨터') || qLower.includes('태블릿') || qLower.includes('pc')) {
        cleanHs = '8471.30-0000';
      } else if (qLower.includes('와인') || qLower.includes('포도주')) {
        cleanHs = '2204.21-1000';
      } else if (qLower.includes('화장품') || qLower.includes('스킨') || qLower.includes('세럼')) {
        cleanHs = '3304.99-1000';
      } else if (qLower.includes('자동차') || qLower.includes('승용차')) {
        cleanHs = '8703.23-1000';
      } else if (qLower.includes('전구체') || qLower.includes('ncm') || qLower.includes('수산화물')) {
        cleanHs = '2825.90-2050';
      } else {
        // 데이터베이스에서 부분 검색된 첫 번째 품목 세번 참조
        const dbMatches = CLIP_COMMODITIES_DATABASE.filter(c =>
          c.nameKr.toLowerCase().includes(qLower) ||
          c.searchKeywords.some(k => k.includes(qLower))
        );
        if (dbMatches.length > 0) {
          cleanHs = dbMatches[0].hsCode;
        } else {
          cleanHs = '8517.13-0000'; // 기본값 (스마트폰/통신기기)
        }
      }
    }
  }

  const hsCode = cleanHs || '8517.13-0000';
  let nameKr = (customName || '').trim();
  if (!nameKr) {
    nameKr = cleanQuery || `관세청 CLIP 품목 [HS ${hsCode}]`;
  }
  let nameEn = customName ? customName.toUpperCase() : (cleanQuery ? cleanQuery.toUpperCase() : `COMMODITY [HS ${hsCode}]`);

  // 류(Chapter) 판별
  const chapter = hsCode.replace(/[^0-9]/g, '').slice(0, 2);
  let baseRate = 8.0;
  let wtoRate = 5.5;
  let category = '일반 공산품';

  if (chapter === '84' || chapter === '85' || chapter === '90') {
    baseRate = 8.0;
    wtoRate = 0.0; // ITA 정보기술협정 또는 정밀기계 양허 무세
    category = '전기전자·정밀기계';
  } else if (chapter === '28' || chapter === '29') {
    baseRate = 5.0;
    wtoRate = 5.5;
    category = '화학물질·소재';
  } else if (chapter === '38' || chapter === '39') {
    baseRate = 6.5;
    wtoRate = 6.5;
    category = '석유화학·합성수지';
  } else if (chapter === '22') {
    baseRate = hsCode.includes('2204') ? 30.0 : 20.0;
    wtoRate = 15.0;
    category = '음료·주류';
  } else if (chapter === '33') {
    baseRate = 6.5;
    wtoRate = 6.5;
    category = '화장품·향료';
  } else if (chapter === '61' || chapter === '62' || chapter === '64') {
    baseRate = 13.0;
    wtoRate = 13.0;
    category = '섬유·의류·신발';
  } else if (chapter === '72' || chapter === '73' || chapter === '74' || chapter === '76') {
    baseRate = 8.0;
    wtoRate = 5.5;
    category = '철강·비철금속';
  } else if (chapter === '87') {
    baseRate = 8.0;
    wtoRate = 8.0;
    category = '자동차·수송기기';
  }

  return {
    hsCode,
    nameKr,
    nameEn,
    category,
    hsDescription: `관세법령정보포털 CLIP 세번/상품검색 조회 품목 (HS 제${chapter}류 표준 관세율 스케줄 적용)`,
    unit: 'EA',
    defaultUnitPriceUsd: 100.0,
    baseRate,
    wtoRate,
    ftaRates: {
      CN: { ftaName: '한-중 FTA (FCN1)', code: 'FCN1', rate: 0.0, notes: '양허세율 0%' },
      US: { ftaName: '한-미 FTA (FUS1)', code: 'FUS1', rate: 0.0, notes: 'KORUS 0%' },
      DE: { ftaName: '한-EU FTA (FEU1)', code: 'FEU1', rate: 0.0, notes: '한-EU 0%' },
      JP: { ftaName: 'RCEP FTA (FRC1)', code: 'FRC1', rate: 0.0, notes: 'RCEP 0%' },
      VN: { ftaName: '한-베트남 FTA (FVK1)', code: 'FVK1', rate: 0.0, notes: 'VKFTA 0%' },
      AU: { ftaName: '한-호주 FTA (FAU1)', code: 'FAU1', rate: 0.0, notes: '0%' },
      GB: { ftaName: '한-영 FTA (FGB1)', code: 'FGB1', rate: 0.0, notes: '0%' },
      IN: { ftaName: '한-인도 CEPA (FIC1)', code: 'FIC1', rate: 0.0, notes: '0%' }
    },
    regulations: {
      isControlled: false,
      applicableLaws: ['관세법 제226조 세관장확인'],
      requiredCertificates: ['상업송장(Invoice)', '포장명세서(Packing List)', '원산지증명서(C/O)'],
      inspectionAgency: '관세청',
      clearanceNotes: '관세법령정보포털 CLIP 관세율표 및 세관장확인고시 확인 요망.'
    },
    searchKeywords: [cleanQuery.toLowerCase(), hsCode.toLowerCase(), nameKr.toLowerCase()]
  };
}

/**
 * CLIP 상품 데이터를 계산기용 표준 TradeItem 형식으로 변환
 */
export function convertClipCommodityToTradeItem(c: ClipCommodity): TradeItem {
  const countryTariffs: Record<string, CountryTariffInfo> = {
    KR: {
      countryCode: 'KR',
      countryName: '대한민국',
      countryNameEn: 'South Korea',
      flag: '🇰🇷',
      currency: 'KRW',
      baseTariffRate: c.baseRate,
      wtoTariffRate: c.wtoRate,
      quotaTariffRate: c.quotaRate,
      ftaTariffRate: c.ftaRates.CN?.rate ?? 0.0,
      ftaName: c.ftaRates.CN?.ftaName || '한-중 FTA (0%)',
      vatRate: 10,
      specialRules: c.regulations?.clearanceNotes || '관세청 CLIP 관세율표 고시 기준'
    },
    US: {
      countryCode: 'US',
      countryName: '미국',
      countryNameEn: 'USA',
      flag: '🇺🇸',
      currency: 'USD',
      baseTariffRate: c.baseRate <= 5 ? 3.0 : 5.0,
      wtoTariffRate: c.wtoRate,
      ftaTariffRate: c.ftaRates.US?.rate ?? 0.0,
      ftaName: 'KORUS FTA (0%)',
      vatRate: 0
    },
    CN: {
      countryCode: 'CN',
      countryName: '중국',
      countryNameEn: 'China',
      flag: '🇨🇳',
      currency: 'CNY',
      baseTariffRate: c.baseRate,
      ftaTariffRate: c.ftaRates.CN?.rate ?? 0.0,
      ftaName: '한-중 FTA',
      vatRate: 13
    },
    DE: {
      countryCode: 'DE',
      countryName: '독일(EU)',
      countryNameEn: 'Germany',
      flag: '🇩🇪',
      currency: 'EUR',
      baseTariffRate: c.baseRate,
      ftaTariffRate: c.ftaRates.DE?.rate ?? 0.0,
      ftaName: '한-EU FTA (0%)',
      vatRate: 19
    },
    JP: {
      countryCode: 'JP',
      countryName: '일본',
      countryNameEn: 'Japan',
      flag: '🇯🇵',
      currency: 'JPY',
      baseTariffRate: c.baseRate,
      ftaTariffRate: c.ftaRates.JP?.rate ?? 0.0,
      ftaName: 'RCEP (0%)',
      vatRate: 10
    },
    VN: {
      countryCode: 'VN',
      countryName: '베트남',
      countryNameEn: 'Vietnam',
      flag: '🇻🇳',
      currency: 'VND',
      baseTariffRate: c.baseRate,
      ftaTariffRate: c.ftaRates.VN?.rate ?? 0.0,
      ftaName: 'VKFTA (0%)',
      vatRate: 10
    }
  };

  return {
    id: `clip-${c.hsCode.replace(/[^a-zA-Z0-9]/g, '')}`,
    name: c.nameKr,
    nameEn: c.nameEn,
    category: c.category,
    hsCode: c.hsCode,
    hsDescription: c.hsDescription,
    subModels: [c.nameEn, c.nameKr],
    defaultUnitPriceUsd: c.defaultUnitPriceUsd,
    unit: c.unit,
    countryTariffs,
    importRegulations: {
      isControlled: c.regulations?.isControlled ?? false,
      applicableLaws: c.regulations?.applicableLaws ?? ['관세법'],
      requiredCertificates: c.regulations?.requiredCertificates ?? ['상업송장', '포장명세서'],
      inspectionAgency: c.regulations?.inspectionAgency ?? '관세청',
      clearanceNotes: c.regulations?.clearanceNotes ?? '관세법령정보포털 CLIP 공시 기준',
      prohibitedIngredients: []
    },
    originCriteria: {
      psrCode: 'CTH or RVC 40%',
      psrDescription: '4단위 세번변경(CTH) 또는 역내부가가치비율 40% 이상',
      originDocumentType: '기관발급(세관/상공회의소)',
      ftaNotes: '원산지증명서(C/O) 구비 시 협정세율 우선 적용'
    }
  };
}
