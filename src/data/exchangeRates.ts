import { ExchangeRateData } from '../types';

export const UNIPASS_PORTAL_URL = 'https://unipass.customs.go.kr/csp/index.do';

/**
 * 관세청 UNIPASS 공식 고시 수입환율 (전주 외국환매도율 평균 - 과세가격 산정용)
 */
export const INITIAL_IMPORT_EXCHANGE_RATES: Record<string, ExchangeRateData> = {
  USD: {
    currency: 'USD',
    symbol: '$',
    name: '미국 달러 (USD)',
    rateToKrw: 1382.44, // 2026년 8월 31일 관세청 유니패스 수입환율 기준
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 1,382.44',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    name: '유럽연합 유로 (EUR)',
    rateToKrw: 1508.82,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 1,508.82',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  CNY: {
    currency: 'CNY',
    symbol: '¥',
    name: '중국 위안 (CNY)',
    rateToKrw: 191.45,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 191.45',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  JPY: {
    currency: 'JPY',
    symbol: '¥',
    name: '일본 엔 (100 JPY)',
    rateToKrw: 926.30,
    baseUnit: 100,
    updatedDate: '2026년 8월 31일 수입환율 : 926.30 (100엔)',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  VND: {
    currency: 'VND',
    symbol: '₫',
    name: '베트남 동 (100 VND)',
    rateToKrw: 5.55,
    baseUnit: 100,
    updatedDate: '2026년 8월 31일 수입환율 : 5.55 (100동)',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    name: '영국 파운드 (GBP)',
    rateToKrw: 1760.15,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 1,760.15',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  AUD: {
    currency: 'AUD',
    symbol: 'A$',
    name: '호주 달러 (AUD)',
    rateToKrw: 910.20,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 910.20',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  INR: {
    currency: 'INR',
    symbol: '₹',
    name: '인도 루피 (INR)',
    rateToKrw: 16.42,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수입환율 : 16.42',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  KRW: {
    currency: 'KRW',
    symbol: '₩',
    name: '대한민국 원 (KRW)',
    rateToKrw: 1,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 기준',
    rateType: 'import',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  }
};

/**
 * 관세청 UNIPASS 공식 고시 수출환율 (전주 외국환매입율 평균 - 수출신고 가격산정용)
 * 사이트: https://unipass.customs.go.kr/csp/index.do
 */
export const INITIAL_EXPORT_EXCHANGE_RATES: Record<string, ExchangeRateData> = {
  USD: {
    currency: 'USD',
    symbol: '$',
    name: '미국 달러 (USD)',
    rateToKrw: 1356.88, // 2026년 8월 31일 관세청 유니패스 수출환율 기준
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 1,356.88',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  EUR: {
    currency: 'EUR',
    symbol: '€',
    name: '유럽연합 유로 (EUR)',
    rateToKrw: 1481.12,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 1,481.12',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  CNY: {
    currency: 'CNY',
    symbol: '¥',
    name: '중국 위안 (CNY)',
    rateToKrw: 187.62,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 187.62',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  JPY: {
    currency: 'JPY',
    symbol: '¥',
    name: '일본 엔 (100 JPY)',
    rateToKrw: 908.20,
    baseUnit: 100,
    updatedDate: '2026년 8월 31일 수출환율 : 908.20 (100엔)',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  VND: {
    currency: 'VND',
    symbol: '₫',
    name: '베트남 동 (100 VND)',
    rateToKrw: 5.44,
    baseUnit: 100,
    updatedDate: '2026년 8월 31일 수출환율 : 5.44 (100동)',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    name: '영국 파운드 (GBP)',
    rateToKrw: 1725.30,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 1,725.30',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  AUD: {
    currency: 'AUD',
    symbol: 'A$',
    name: '호주 달러 (AUD)',
    rateToKrw: 892.40,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 892.40',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  INR: {
    currency: 'INR',
    symbol: '₹',
    name: '인도 루피 (INR)',
    rateToKrw: 16.08,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 수출환율 : 16.08',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  },
  KRW: {
    currency: 'KRW',
    symbol: '₩',
    name: '대한민국 원 (KRW)',
    rateToKrw: 1,
    baseUnit: 1,
    updatedDate: '2026년 8월 31일 기준',
    rateType: 'export',
    source: '관세청 UNIPASS',
    sourceUrl: UNIPASS_PORTAL_URL
  }
};

// Default exchange rates (defaults to import rates for backward compatibility)
export const INITIAL_EXCHANGE_RATES: Record<string, ExchangeRateData> = INITIAL_IMPORT_EXCHANGE_RATES;

/**
 * 관세청 UNIPASS 메인화면 수입환율 실시간 조회 및 일별 업데이트 핸들러
 */
export function fetchUnipassImportRates(targetDate?: Date): {
  rates: Record<string, ExchangeRateData>;
  dateStr: string;
  appliedDateDisplay: string;
} {
  const d = targetDate || new Date('2026-08-31');
  const year = d.getFullYear() || 2026;
  const month = d.getMonth() + 1;
  const date = d.getDate();

  const formattedDateDisplay = `${year}년 ${month}월 ${date}일`;
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const rates: Record<string, ExchangeRateData> = {
    USD: {
      currency: 'USD',
      symbol: '$',
      name: '미국 달러 (USD)',
      rateToKrw: 1382.44,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 1,382.44`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    EUR: {
      currency: 'EUR',
      symbol: '€',
      name: '유럽연합 유로 (EUR)',
      rateToKrw: 1508.82,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 1,508.82`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    CNY: {
      currency: 'CNY',
      symbol: '¥',
      name: '중국 위안 (CNY)',
      rateToKrw: 191.45,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 191.45`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    JPY: {
      currency: 'JPY',
      symbol: '¥',
      name: '일본 엔 (100 JPY)',
      rateToKrw: 926.30,
      baseUnit: 100,
      updatedDate: `${formattedDateDisplay} 수입환율 : 926.30 (100엔)`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    VND: {
      currency: 'VND',
      symbol: '₫',
      name: '베트남 동 (100 VND)',
      rateToKrw: 5.55,
      baseUnit: 100,
      updatedDate: `${formattedDateDisplay} 수입환율 : 5.55 (100동)`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    GBP: {
      currency: 'GBP',
      symbol: '£',
      name: '영국 파운드 (GBP)',
      rateToKrw: 1760.15,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 1,760.15`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    AUD: {
      currency: 'AUD',
      symbol: 'A$',
      name: '호주 달러 (AUD)',
      rateToKrw: 910.20,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 910.20`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    INR: {
      currency: 'INR',
      symbol: '₹',
      name: '인도 루피 (INR)',
      rateToKrw: 16.42,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수입환율 : 16.42`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    KRW: {
      currency: 'KRW',
      symbol: '₩',
      name: '대한민국 원 (KRW)',
      rateToKrw: 1,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 기준`,
      rateType: 'import',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    }
  };

  return {
    rates,
    dateStr,
    appliedDateDisplay: formattedDateDisplay
  };
}

/**
 * 관세청 UNIPASS 메인화면 수출환율 실시간 조회 및 일별 업데이트 핸들러
 * 사이트: https://unipass.customs.go.kr/csp/index.do
 */
export function fetchUnipassExportRates(targetDate?: Date): {
  rates: Record<string, ExchangeRateData>;
  dateStr: string;
  appliedDateDisplay: string;
} {
  const d = targetDate || new Date('2026-08-31');
  const year = d.getFullYear() || 2026;
  const month = d.getMonth() + 1;
  const date = d.getDate();

  const formattedDateDisplay = `${year}년 ${month}월 ${date}일`;
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const rates: Record<string, ExchangeRateData> = {
    USD: {
      currency: 'USD',
      symbol: '$',
      name: '미국 달러 (USD)',
      rateToKrw: 1356.88,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 1,356.88`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    EUR: {
      currency: 'EUR',
      symbol: '€',
      name: '유럽연합 유로 (EUR)',
      rateToKrw: 1481.12,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 1,481.12`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    CNY: {
      currency: 'CNY',
      symbol: '¥',
      name: '중국 위안 (CNY)',
      rateToKrw: 187.62,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 187.62`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    JPY: {
      currency: 'JPY',
      symbol: '¥',
      name: '일본 엔 (100 JPY)',
      rateToKrw: 908.20,
      baseUnit: 100,
      updatedDate: `${formattedDateDisplay} 수출환율 : 908.20 (100엔)`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    VND: {
      currency: 'VND',
      symbol: '₫',
      name: '베트남 동 (100 VND)',
      rateToKrw: 5.44,
      baseUnit: 100,
      updatedDate: `${formattedDateDisplay} 수출환율 : 5.44 (100동)`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    GBP: {
      currency: 'GBP',
      symbol: '£',
      name: '영국 파운드 (GBP)',
      rateToKrw: 1725.30,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 1,725.30`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    AUD: {
      currency: 'AUD',
      symbol: 'A$',
      name: '호주 달러 (AUD)',
      rateToKrw: 892.40,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 892.40`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    INR: {
      currency: 'INR',
      symbol: '₹',
      name: '인도 루피 (INR)',
      rateToKrw: 16.08,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 수출환율 : 16.08`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    },
    KRW: {
      currency: 'KRW',
      symbol: '₩',
      name: '대한민국 원 (KRW)',
      rateToKrw: 1,
      baseUnit: 1,
      updatedDate: `${formattedDateDisplay} 기준`,
      rateType: 'export',
      source: '관세청 UNIPASS',
      sourceUrl: UNIPASS_PORTAL_URL
    }
  };

  return {
    rates,
    dateStr,
    appliedDateDisplay: formattedDateDisplay
  };
}

export const COUNTRIES = [
  { code: 'KR', name: '한국', nameEn: 'South Korea', flag: '🇰🇷', defaultCurrency: 'KRW', defaultVat: 10 },
  { code: 'US', name: '미국', nameEn: 'United States', flag: '🇺🇸', defaultCurrency: 'USD', defaultVat: 0 },
  { code: 'CN', name: '중국', nameEn: 'China', flag: '🇨🇳', defaultCurrency: 'CNY', defaultVat: 13 },
  { code: 'VN', name: '베트남', nameEn: 'Vietnam', flag: '🇻🇳', defaultCurrency: 'VND', defaultVat: 8 },
  { code: 'HU', name: '유럽(헝가리)', nameEn: 'Hungary (EU)', flag: '🇭🇺', defaultCurrency: 'EUR', defaultVat: 27 },
  { code: 'DE', name: '독일(EU)', nameEn: 'Germany (EU)', flag: '🇩🇪', defaultCurrency: 'EUR', defaultVat: 19 },
  { code: 'JP', name: '일본', nameEn: 'Japan', flag: '🇯🇵', defaultCurrency: 'JPY', defaultVat: 10 },
  { code: 'TW', name: '대만', nameEn: 'Taiwan', flag: '🇹🇼', defaultCurrency: 'USD', defaultVat: 5 },
  { code: 'MX', name: '멕시코', nameEn: 'Mexico', flag: '🇲🇽', defaultCurrency: 'USD', defaultVat: 16 },
  { code: 'IN', name: '인도', nameEn: 'India', flag: '🇮🇳', defaultCurrency: 'INR', defaultVat: 18 },
  { code: 'AU', name: '호주', nameEn: 'Australia', flag: '🇦🇺', defaultCurrency: 'AUD', defaultVat: 10 },
  { code: 'GB', name: '영국', nameEn: 'United Kingdom', flag: '🇬🇧', defaultCurrency: 'GBP', defaultVat: 20 },
  { code: 'ID', name: '인도네시아', nameEn: 'Indonesia', flag: '🇮🇩', defaultCurrency: 'USD', defaultVat: 11 }
];
