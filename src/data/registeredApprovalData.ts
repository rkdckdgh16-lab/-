export interface RegisteredApprovalItem {
  no: number;
  productName: string; // 제품명(모델규격,품명)
  approvalNumber: string; // 요건승인번호(26년)
  importCountry: string; // 수입국
  hskNo: string; // HSK No
  hazardousSubstance: string; // 인체등유해성물질 및 함량(유독물질)
  casNo: string; // 고유번호 또는 화학물질 식별번호(CAS No.)
  notes?: string;
}

/**
 * 2026년 공식 수입 요건승인 등록 현황 데이터베이스 (30개 승인품목)
 */
export const REGISTERED_APPROVAL_LIST: RegisteredApprovalItem[] = [
  {
    no: 1,
    productName: 'Nickel sulfate',
    approvalNumber: '2003842600000586',
    importCountry: '일본',
    hskNo: '2833.24-0000',
    hazardousSubstance: '황산니켈(98.5%)',
    casNo: '10101-97-0'
  },
  {
    no: 2,
    productName: 'Nickel Cobalt Hydroxide(P-NC)',
    approvalNumber: '2003842600008693',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(93~94%)',
    casNo: '12054-48-7'
  },
  {
    no: 3,
    productName: 'Nickel Cobalt Hydroxide(P-NC)',
    approvalNumber: '2003842600008323',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(60~99%), 수산화 코발트(1~40%)',
    casNo: '12054-48-7, 21041-93-0'
  },
  {
    no: 4,
    productName: 'Nickel cobalt Manganese hydroxide(P-NCM)',
    approvalNumber: '2003842600008704',
    importCountry: '중국',
    hskNo: '2825.90-2050',
    hazardousSubstance: '수산화니켈(15~99%), 수산화코발트(0.1~40%)',
    casNo: '12054-48-7, 21041-93-0'
  },
  {
    no: 5,
    productName: 'Nickel Cobalt oxide(P-NCO)',
    approvalNumber: '2003842600008729',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(88~98%), 산화코발트(2~12%)',
    casNo: '1313-99-1, 1307-96-6'
  },
  {
    no: 6,
    productName: 'Nickel Manganese Aluminium Hydroxide (NMA 99:0.5:0.5)',
    approvalNumber: '2003842600010559',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(99%)',
    casNo: '12054-48-7'
  },
  {
    no: 7,
    productName: 'Nickel Cobalt Manganese Aluminium Hydroxide(93:5:1:1)',
    approvalNumber: '2003842500038604',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(93%)',
    casNo: '12054-48-7'
  },
  {
    no: 8,
    productName: 'Nickel Manganese Aluminium Oxide(NMAO 99:0.5:0.5)',
    approvalNumber: '2003842600011383',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(99%)',
    casNo: '1313-99-1'
  },
  {
    no: 9,
    productName: 'NCM (CDS/CSG)',
    approvalNumber: '2003842600013886',
    importCountry: '미국,헝가리',
    hskNo: '2841.90-9020',
    hazardousSubstance: 'NCM(100%)',
    casNo: '182442-95-1'
  },
  {
    no: 10,
    productName: 'Sodium nickel Iron manganese oxide',
    approvalNumber: '2003842600016470',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈및 황화니켈류(30~50%)',
    casNo: '1314-06-3'
  },
  {
    no: 11,
    productName: 'Nickel Cuprum Ferrum Manganese Hydroxide',
    approvalNumber: '2003842600015645',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(10~50%)',
    casNo: '12054-48-7'
  },
  {
    no: 12,
    productName: 'Cobalt Hydroxide',
    approvalNumber: '2003842600018101',
    importCountry: '중국',
    hskNo: '2822.00-2010',
    hazardousSubstance: '수산화코발트(100%)',
    casNo: '21041-93-0'
  },
  {
    no: 13,
    productName: 'Nickel cobalt manganese oxide',
    approvalNumber: '2003842600026969(연구/개발 포함)',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(15~99.9%), 산화코발트(0.1~40%)',
    casNo: '1313-99-1, 1307-96-6'
  },
  {
    no: 14,
    productName: 'NCA',
    approvalNumber: '2003842600020222',
    importCountry: '일본,중국',
    hskNo: '2841.90-9030',
    hazardousSubstance: 'NCA(100%)',
    casNo: '177997-13-6'
  },
  {
    no: 15,
    productName: 'NICKEL OXIDE',
    approvalNumber: '2003842600021460',
    importCountry: '중국',
    hskNo: '2825.40-1000',
    hazardousSubstance: '산화니켈(100%)',
    casNo: '1313-99-1'
  },
  {
    no: 16,
    productName: 'Nickel Cobalt Manganese Hydroxide',
    approvalNumber: '2003842600019355',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화코발트망간니켈(100%)',
    casNo: '189139-63-7'
  },
  {
    no: 17,
    productName: 'Nickel Ferrum Manganese Hydroxide',
    approvalNumber: '2003842600017525',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(20~47%)',
    casNo: '12054-48-7'
  },
  {
    no: 18,
    productName: 'Cobalt Sulfate',
    approvalNumber: '2003842500038643',
    importCountry: '중국',
    hskNo: '2833.29-2010',
    hazardousSubstance: '황산코발트(99.9%)',
    casNo: '10124-43-3'
  },
  {
    no: 19,
    productName: 'Nickel cobalt Aluminum oxide',
    approvalNumber: '2003842600011091',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(94.6%), 산화코발트(3.9%)',
    casNo: '1313-99-1, 1307-96-6'
  },
  {
    no: 20,
    productName: 'Nickel dihydroxide 30~95% : Manganese trihydroxide 5~70% -> Nickel Manganese hydroxide (Nickel dihydroxide 30~99% : Manganese trihydroxide 1~70%)',
    approvalNumber: '2003842600010421',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화 니켈(30% ~ 99.00%) -> 수산화 니켈(20.00% ~ 99%)',
    casNo: '12054-48-7'
  },
  {
    no: 21,
    productName: 'Nickel Cobalt Aluminum hydroxide(P-NCA)',
    approvalNumber: '2003842600008711',
    importCountry: '중국',
    hskNo: '2825.90-2090',
    hazardousSubstance: '수산화니켈(87~94%)',
    casNo: '12054-48-7'
  },
  {
    no: 22,
    productName: 'Crude Nickel sulfate',
    approvalNumber: '2003842600000579',
    importCountry: '남아프리카공화국',
    hskNo: '2833.24-0000',
    hazardousSubstance: '황산니켈(98.5~100%)',
    casNo: '10101-97-0'
  },
  {
    no: 23,
    productName: 'Nickel Sulphate hexahydrate',
    approvalNumber: '2003842600000561',
    importCountry: '벨기에',
    hskNo: '2833.24-0000',
    hazardousSubstance: '황산니켈(98.5~100%)',
    casNo: '10101-97-0'
  },
  {
    no: 24,
    productName: 'Nickel Sulphate',
    approvalNumber: '2003842600000554',
    importCountry: '인도',
    hskNo: '2833.24-0000',
    hazardousSubstance: '황산니켈(98.5%)',
    casNo: '10101-97-0'
  },
  {
    no: 25,
    productName: 'Nickel Sulphate Hexahydrate',
    approvalNumber: '2003842600000547',
    importCountry: '대만',
    hskNo: '2833.24-0000',
    hazardousSubstance: '황산니켈(99~100%)',
    casNo: '10101-97-0'
  },
  {
    no: 26,
    productName: 'NICKEL FERRUM MANGANESE OXIDE',
    approvalNumber: '2003842600016238',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(30~35%)',
    casNo: '1313-99-1'
  },
  {
    no: 27,
    productName: 'Phosphorus Pentasulfide (99.9~100%)',
    approvalNumber: '2003842600015983',
    importCountry: '중국',
    hskNo: '2813.90-0000',
    hazardousSubstance: '오황화인(99.9~100%)',
    casNo: '1314-80-3'
  },
  {
    no: 28,
    productName: 'Nickel cobalt Manganese Oxide (NCM 95:3:2)',
    approvalNumber: '2003842600010566',
    importCountry: '중국',
    hskNo: '2825.90-1090',
    hazardousSubstance: '산화니켈(95%)',
    casNo: '1313-99-1'
  },
  {
    no: 29,
    productName: 'Nickel Cobalt Manganese Carbonate',
    approvalNumber: '2003842600021833',
    importCountry: '중국',
    hskNo: '2836.99-1090',
    hazardousSubstance: '-',
    casNo: '-'
  },
  {
    no: 30,
    productName: 'Lithium Hydroxide Monohydrate, Battery Grade',
    approvalNumber: '2003842600025269',
    importCountry: '미국',
    hskNo: '2825.20-2000',
    hazardousSubstance: '수산화리튬',
    casNo: '1310-65-2'
  }
];

export interface EmApprovalToxicItem {
  toxicName: string;
  contentPercent: string;
  casNo: string;
}

export interface EmApprovalItem {
  no: number;
  productName: string;
  approvalNumber: string;
  toxicItems: EmApprovalToxicItem[];
}

/**
 * 2026년 EM(양극재/전구체/원소재) 요건승인 등록 현황 데이터베이스 (7개 승인품목)
 */
export const EM_APPROVAL_LIST: EmApprovalItem[] = [
  {
    no: 1,
    productName: 'Nickel Cobalt Manganese Oxide',
    approvalNumber: '2003872600008173',
    toxicItems: [
      { toxicName: '산화니켈', contentPercent: '91~95', casNo: '1313-99-1' },
      { toxicName: '산화코발트', contentPercent: '4~8', casNo: '1307-96-6' }
    ]
  },
  {
    no: 2,
    productName: 'Nickel Cobalt Oxide',
    approvalNumber: '2003872600008181',
    toxicItems: [
      { toxicName: '산화니켈', contentPercent: '90~95', casNo: '1313-99-1' },
      { toxicName: '산화코발트', contentPercent: '5~10', casNo: '1307-96-6' }
    ]
  },
  {
    no: 3,
    productName: 'Lithium nickel cobalt aluminum oxide',
    approvalNumber: '2003872600008198',
    toxicItems: [
      { toxicName: 'NCA', contentPercent: '100', casNo: '177997-13-6' }
    ]
  },
  {
    no: 4,
    productName: 'Nickel Cobalt Manganese Hydroxide',
    approvalNumber: '2003872600008209',
    toxicItems: [
      { toxicName: '수산화니켈', contentPercent: '80~98', casNo: '12054-48-7' },
      { toxicName: '수산화 코발트', contentPercent: '1~15', casNo: '21041-93-0' }
    ]
  },
  {
    no: 5,
    productName: 'Nickel Cobalt hydroxide (doped carbon)',
    approvalNumber: '2003872600008216',
    toxicItems: [
      { toxicName: '수산화니켈', contentPercent: '83~93', casNo: '12054-48-7' },
      { toxicName: '수산화 코발트', contentPercent: '7~17', casNo: '21041-93-0' }
    ]
  },
  {
    no: 6,
    productName: 'Lithium nickel cobalt aluminum oxide',
    approvalNumber: '2003872600008223',
    toxicItems: [
      { toxicName: 'NCM', contentPercent: '100', casNo: '182442-95-1' }
    ]
  },
  {
    no: 7,
    productName: 'lithium hydroxide monohydrate',
    approvalNumber: '2003872600008878',
    toxicItems: [
      { toxicName: '수산화리튬', contentPercent: '55~65', casNo: '1310-65-2' }
    ]
  }
];

/**
 * 텍스트 정규화 유틸리티 (대소문자 무시, 공백 및 특수문자 제거)
 */
function normalizeString(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
}

import { 
  BmChemicalSpecItem, 
  matchBmChemicalSpec, 
  scoreBmChemicalSpecItem,
  BM_CHEMICAL_SPEC_LIST 
} from './bmChemicalSpecData';

export interface ItemApprovalStatusResult {
  isRegistered: boolean;
  hasBmMatch: boolean;
  hasEmMatch: boolean;
  hasBmChemicalSpecMatch?: boolean;
  approvalData?: RegisteredApprovalItem;
  allMatches: RegisteredApprovalItem[];
  emApprovalData?: EmApprovalItem;
  allEmMatches: EmApprovalItem[];
  bmChemicalSpecData?: BmChemicalSpecItem;
  allBmChemicalSpecMatches: BmChemicalSpecItem[];
}

/**
 * BM 승인 품목 적합도 점수 계산
 */
function scoreBmItem(item: RegisteredApprovalItem, itemName: string, hsCode?: string): number {
  if (!itemName) return 0;
  const normItem = normalizeString(itemName);
  const normProd = normalizeString(item.productName);
  const normSub = normalizeString(item.hazardousSubstance);
  const itemLower = itemName.toLowerCase();
  const prodLower = item.productName.toLowerCase();
  const subLower = item.hazardousSubstance.toLowerCase();

  let score = 0;

  // 1. Exact CAS or Approval Number Match
  if (item.casNo && item.casNo.length >= 6 && itemLower.includes(item.casNo.toLowerCase())) score += 1000;
  if (item.approvalNumber && itemLower.includes(item.approvalNumber.toLowerCase())) score += 1000;
  if (normItem === normProd) score += 800;

  // 2. Specific Acronym / Chemical formula rules
  if (normItem.includes('nca')) {
    if (prodLower === 'nca' || normProd === 'nca' || subLower.includes('nca(100%)')) {
      score += 600;
    } else if (normItem.includes('pnca') || normItem.includes('p-nca')) {
      if (prodLower.includes('p-nca')) score += 650;
    } else if (prodLower.includes('p-nca')) {
      score += 150;
    }
  }

  if (normItem.includes('ncm')) {
    if (prodLower.includes('ncm') || subLower.includes('ncm')) score += 600;
  }

  if ((normItem.includes('pnca') || normItem.includes('p-nca')) && prodLower.includes('p-nca')) score += 650;
  if ((normItem.includes('pnco') || normItem.includes('p-nco')) && prodLower.includes('p-nco')) score += 650;
  if ((normItem.includes('pnc') || normItem.includes('p-nc')) && prodLower.includes('p-nc') && !prodLower.includes('p-nca') && !prodLower.includes('p-nco')) score += 650;

  if (normItem.includes('황산니켈') && (prodLower.includes('nickel sulfate') || subLower.includes('황산니켈'))) score += 500;
  if (normItem.includes('황산코발트') && (prodLower.includes('cobalt sulfate') || subLower.includes('황산코발트'))) score += 500;
  if (normItem.includes('수산화리튬') && (prodLower.includes('lithium hydroxide') || subLower.includes('수산화리튬'))) score += 500;
  if (normItem.includes('오황화인') && (prodLower.includes('phosphorus') || subLower.includes('오황화인'))) score += 500;

  // 3. Substring inclusion
  if (normItem && normProd) {
    if (normItem === normProd) {
      score += 300;
    } else if (normItem.includes(normProd) || normProd.includes(normItem)) {
      const overlapLen = Math.min(normProd.length, normItem.length);
      const maxLen = Math.max(normProd.length, normItem.length);
      score += Math.floor((overlapLen / maxLen) * 300);
    }
  }

  if (normItem && (normSub.includes(normItem) || normItem.includes(normSub))) {
    score += 120;
  }

  // 4. Token overlap
  const tokens = itemLower.split(/[\s,()_\-/+]+/g).filter(t => t.length >= 2);
  if (tokens.length > 0) {
    const matchedTokens = tokens.filter(tok => prodLower.includes(tok) || subLower.includes(tok));
    const ratio = matchedTokens.length / tokens.length;
    if (ratio >= 0.8) score += 200;
    else if (ratio >= 0.5) score += 100;
  }

  // 5. HS Code match
  if (hsCode && item.hskNo) {
    const cleanHs = hsCode.replace(/[^0-9]/g, '');
    const cleanItemHs = item.hskNo.replace(/[^0-9]/g, '');
    if (cleanHs.length >= 6 && cleanItemHs.length >= 6 && cleanItemHs.startsWith(cleanHs.slice(0, 6))) {
      score += 40;
    }
  }

  return score;
}

/**
 * EM 승인 품목 적합도 점수 계산
 */
function scoreEmItem(em: EmApprovalItem, itemName: string, hsCode?: string): number {
  if (!itemName) return 0;
  const normItem = normalizeString(itemName);
  const normProd = normalizeString(em.productName);
  const itemLower = itemName.toLowerCase();
  const prodLower = em.productName.toLowerCase();

  let score = 0;

  // Disambiguation for Item 3 (NCA, CAS 177997-13-6) vs Item 6 (NCM, CAS 182442-95-1)
  if (normItem.includes('nca') && em.no === 6) return 0;
  if (normItem.includes('ncm') && em.no === 3) return 0;

  // 1. Exact CAS or Approval Number Match
  if (em.approvalNumber && itemLower.includes(em.approvalNumber.toLowerCase())) score += 1000;
  for (const t of em.toxicItems) {
    if (t.casNo && t.casNo.length >= 6 && itemLower.includes(t.casNo.toLowerCase())) score += 1000;
    if (t.toxicName && normItem.includes(normalizeString(t.toxicName))) score += 400;
    if (t.toxicName === 'NCA' && normItem.includes('nca')) score += 600;
    if (t.toxicName === 'NCM' && normItem.includes('ncm')) score += 600;
    if (t.toxicName === '수산화리튬' && (normItem.includes('수산화리튬') || normItem.includes('lithiumhydroxide'))) score += 600;
  }

  if (normItem === normProd) score += 800;

  // 2. Substring inclusion
  if (normItem && normProd) {
    if (normItem === normProd) {
      score += 300;
    } else if (normItem.includes(normProd) || normProd.includes(normItem)) {
      const overlapLen = Math.min(normProd.length, normItem.length);
      const maxLen = Math.max(normProd.length, normItem.length);
      score += Math.floor((overlapLen / maxLen) * 300);
    }
  }

  // 3. Token overlap
  const tokens = itemLower.split(/[\s,()_\-/+]+/g).filter(t => t.length >= 2);
  if (tokens.length > 0) {
    const matchedTokens = tokens.filter(tok => 
      prodLower.includes(tok) || 
      em.toxicItems.some(t => t.toxicName.toLowerCase().includes(tok) || t.casNo.toLowerCase().includes(tok))
    );
    const ratio = matchedTokens.length / tokens.length;
    if (ratio >= 0.8) score += 200;
    else if (ratio >= 0.5) score += 100;
  }

  return score;
}

/**
 * 품명, 화학명, 모델명, HS Code, CAS 번호로 2026년 요건승인 등록 여부 (BM 및 EM)를 정밀 판별
 * 해당 품목에 정확히 일치하는 단일(최적) 품목만 선별하여 반환
 */
export function checkItemApprovalStatus(itemName: string, hsCode?: string): ItemApprovalStatusResult {
  if (!itemName && !hsCode) {
    return { 
      isRegistered: false, 
      hasBmMatch: false, 
      hasEmMatch: false, 
      hasBmChemicalSpecMatch: false,
      allMatches: [], 
      allEmMatches: [],
      allBmChemicalSpecMatches: []
    };
  }

  const MATCH_THRESHOLD = 180;

  // 1. Score and rank BM-2026 items
  const scoredBm = REGISTERED_APPROVAL_LIST
    .map(item => ({ item, score: scoreBmItem(item, itemName, hsCode) }))
    .filter(res => res.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  // Take the single top BM match
  const bestBmMatches = scoredBm.length > 0 ? [scoredBm[0].item] : [];

  // 2. Score and rank EM-2026 items
  const scoredEm = EM_APPROVAL_LIST
    .map(em => ({ em, score: scoreEmItem(em, itemName, hsCode) }))
    .filter(res => res.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  // Take the single top EM match
  const bestEmMatches = scoredEm.length > 0 ? [scoredEm[0].em] : [];

  // 3. Score and rank BM-화학물질명세내역 items
  const bmChemicalSpecMatches = matchBmChemicalSpec(itemName);
  const hasBmChemicalSpec = bmChemicalSpecMatches.length > 0;

  const hasBm = bestBmMatches.length > 0;
  const hasEm = bestEmMatches.length > 0;

  if (hasBm || hasEm || hasBmChemicalSpec) {
    const primaryBm = bestBmMatches[0];
    const primaryEm = bestEmMatches[0];

    const approvalDataRepresentation: RegisteredApprovalItem | undefined = primaryBm ? primaryBm : (primaryEm ? {
      no: primaryEm.no,
      productName: primaryEm.productName,
      approvalNumber: primaryEm.approvalNumber,
      importCountry: 'EM 등록처',
      hskNo: '2825.90 / 2841.90',
      hazardousSubstance: primaryEm.toxicItems.map(t => `${t.toxicName}(${t.contentPercent}%)`).join(', '),
      casNo: primaryEm.toxicItems.map(t => t.casNo).join(', ')
    } : undefined);

    return {
      isRegistered: hasBm || hasEm || hasBmChemicalSpec,
      hasBmMatch: hasBm,
      hasEmMatch: hasEm,
      hasBmChemicalSpecMatch: hasBmChemicalSpec,
      approvalData: approvalDataRepresentation,
      allMatches: bestBmMatches,
      emApprovalData: primaryEm,
      allEmMatches: bestEmMatches,
      bmChemicalSpecData: bmChemicalSpecMatches[0],
      allBmChemicalSpecMatches: bmChemicalSpecMatches
    };
  }

  // 4. Fallback: Check by HS Code for BM if score was low
  if (hsCode) {
    const normHs = hsCode.replace(/[^0-9]/g, '');
    if (normHs.length >= 6) {
      const hsMatches = REGISTERED_APPROVAL_LIST.filter(item => {
        const itemHs = item.hskNo.replace(/[^0-9]/g, '');
        return itemHs.startsWith(normHs.slice(0, 6));
      });

      if (hsMatches.length > 0) {
        return {
          isRegistered: true,
          hasBmMatch: true,
          hasEmMatch: false,
          hasBmChemicalSpecMatch: false,
          approvalData: hsMatches[0],
          allMatches: [hsMatches[0]],
          allEmMatches: [],
          allBmChemicalSpecMatches: []
        };
      }
    }
  }

  return {
    isRegistered: false,
    hasBmMatch: false,
    hasEmMatch: false,
    hasBmChemicalSpecMatch: false,
    allMatches: [],
    allEmMatches: [],
    allBmChemicalSpecMatches: []
  };
}

/**
 * 실시간 검색 필터 (사용자가 요건승인번호 대시보드에서 직접 검색할 때 사용)
 */
export function searchRegisteredApprovalDatabase(keyword: string): RegisteredApprovalItem[] {
  if (!keyword || keyword.trim() === '') {
    return REGISTERED_APPROVAL_LIST;
  }

  const query = keyword.toLowerCase().trim();

  return REGISTERED_APPROVAL_LIST.filter(item => {
    return (
      item.productName.toLowerCase().includes(query) ||
      item.approvalNumber.toLowerCase().includes(query) ||
      item.importCountry.toLowerCase().includes(query) ||
      item.hskNo.toLowerCase().includes(query) ||
      item.hazardousSubstance.toLowerCase().includes(query) ||
      item.casNo.toLowerCase().includes(query) ||
      item.no.toString() === query
    );
  });
}

/**
 * EM-2026 현황 검색 필터
 */
export function searchEmApprovalDatabase(keyword: string): EmApprovalItem[] {
  if (!keyword || keyword.trim() === '') {
    return EM_APPROVAL_LIST;
  }

  const query = keyword.toLowerCase().trim();

  return EM_APPROVAL_LIST.filter(item => {
    return (
      item.productName.toLowerCase().includes(query) ||
      item.approvalNumber.toLowerCase().includes(query) ||
      item.no.toString() === query ||
      item.toxicItems.some(t => 
        t.toxicName.toLowerCase().includes(query) ||
        t.contentPercent.toLowerCase().includes(query) ||
        t.casNo.toLowerCase().includes(query)
      )
    );
  });
}
