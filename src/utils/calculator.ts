import { CalculationInput, CalculationResult, TradeItem, CountryTariffInfo, ImportRegulation } from '../types';
import { INITIAL_EXCHANGE_RATES, COUNTRIES } from '../data/exchangeRates';
import { TRADE_ITEMS_DATABASE } from '../data/tradeData';
import { getClipTariffSchedule, getKoreaBilateralFta, determinePriorityTariffRate } from '../data/clipTariffData';
import { getClipImportRegulations } from '../data/clipImportRequirements';
import { checkItemApprovalStatus } from '../data/registeredApprovalData';

export function calculateTradeDuties(
  input: CalculationInput,
  selectedItem?: TradeItem
): CalculationResult {
  const {
    itemName,
    hsCode,
    exportCountry,
    importCountry,
    quantity,
    unitPrice,
    currency,
    incoterms,
    freightCost = 0,
    insuranceCost = 0,
    exchangeRate,
    applyFta,
    customTariffRate
  } = input;

  // 1. Identify destination country info & tariff rates (Grounded in 관세청 CLIP 포털)
  const destCountryCode = importCountry;
  const item = selectedItem || TRADE_ITEMS_DATABASE.find(t => t.hsCode === hsCode || t.name === itemName);
  const clipSchedule = getClipTariffSchedule(hsCode || item?.hsCode || '', itemName || item?.name);

  let countryTariff: CountryTariffInfo | undefined;
  if (destCountryCode === 'KR') {
    const koreaBilateral = getKoreaBilateralFta(exportCountry);
    countryTariff = {
      countryCode: 'KR',
      countryName: '대한민국',
      countryNameEn: 'South Korea',
      flag: '🇰🇷',
      currency: 'KRW',
      baseTariffRate: clipSchedule.baseRate ?? 8.0,
      wtoTariffRate: clipSchedule.wtoRate ?? 5.5,
      ftaTariffRate: koreaBilateral.rate,
      ftaName: koreaBilateral.fullLabel,
      vatRate: 10
    };
  } else if (item && item.countryTariffs[destCountryCode]) {
    countryTariff = { ...item.countryTariffs[destCountryCode] };
    if (countryTariff.wtoTariffRate === undefined) {
      countryTariff.wtoTariffRate = clipSchedule.wtoRate;
    }
  } else {
    // Fallback based on country defaults & CLIP
    const countryMeta = COUNTRIES.find(c => c.code === destCountryCode);
    const ftaData = clipSchedule.ftaRates[destCountryCode];
    countryTariff = {
      countryCode: destCountryCode,
      countryName: countryMeta ? countryMeta.name : destCountryCode,
      countryNameEn: countryMeta ? countryMeta.nameEn : destCountryCode,
      flag: countryMeta ? countryMeta.flag : '🌐',
      currency: countryMeta ? countryMeta.defaultCurrency : 'USD',
      baseTariffRate: clipSchedule.baseRate,
      ftaTariffRate: ftaData ? ftaData.rate : 0.0,
      ftaName: ftaData ? ftaData.ftaName : `${exportCountry}-${destCountryCode} FTA`,
      wtoTariffRate: clipSchedule.wtoRate,
      vatRate: countryMeta ? countryMeta.defaultVat : 10
    };
  }

  // Ensure WTO rate from CLIP is attached
  if (countryTariff.wtoTariffRate === undefined) {
    countryTariff.wtoTariffRate = clipSchedule.wtoRate;
  }

  // If importing into Korea from a partner with FTA (e.g. China -> Korea with 한-중 FTA)
  if (destCountryCode === 'KR' && exportCountry) {
    const originFta = getKoreaBilateralFta(exportCountry);
    countryTariff.ftaName = originFta.fullLabel;
    countryTariff.ftaTariffRate = originFta.rate;
    countryTariff.baseTariffRate = clipSchedule.baseRate ?? 8.0;
    countryTariff.wtoTariffRate = clipSchedule.wtoRate ?? 5.5;
  } else if (clipSchedule.ftaRates[destCountryCode]) {
    const destFta = clipSchedule.ftaRates[destCountryCode];
    countryTariff.ftaName = destFta.ftaName;
    if (countryTariff.ftaTariffRate === undefined) {
      countryTariff.ftaTariffRate = destFta.rate;
    }
  }

  // 2. Determine applied tariff rate according to Korean Customs Legal Priority Rules (관세법상 1순위~7순위)
  let appliedTariffRate = 0;
  let tariffRateType: CalculationResult['tariffRateType'] = '기본관세(MFN)';
  let ftaName = countryTariff.ftaName;

  const baseRate = countryTariff.baseTariffRate ?? clipSchedule.baseRate ?? 8.0;
  const wtoRate = countryTariff.wtoTariffRate ?? clipSchedule.wtoRate ?? 5.5;
  const quotaRate = countryTariff.quotaTariffRate ?? clipSchedule.quotaRate;
  const ftaRate = countryTariff.ftaTariffRate;

  if (customTariffRate !== undefined && customTariffRate !== null && !isNaN(customTariffRate)) {
    appliedTariffRate = customTariffRate;
    tariffRateType = '사용자지정관세';
  } else {
    // 법정 7단계 세율 적용 우선순위 판정 (이미지 규칙: 덤핑 > FTA > WTO/APTA > 할당 > 최빈국 > 잠정 > 기본)
    const priorityResult = determinePriorityTariffRate({
      baseRate,
      wtoRate,
      quotaRate,
      ftaRate,
      applyFta,
      ftaName: countryTariff.ftaName,
      ftaCode: countryTariff.ftaName
    });

    appliedTariffRate = priorityResult.appliedRate;
    if (priorityResult.rank === 2) {
      tariffRateType = 'FTA협정관세';
      ftaName = countryTariff.ftaName || priorityResult.taxTypeTitle;
    } else if (priorityResult.rank === 3) {
      tariffRateType = 'WTO양허관세';
      ftaName = priorityResult.taxTypeTitle;
    } else if (priorityResult.rank === 4) {
      tariffRateType = '기본관세(MFN)';
      ftaName = priorityResult.taxTypeTitle;
    } else {
      tariffRateType = '기본관세(MFN)';
      ftaName = priorityResult.taxTypeTitle;
    }
  }

  const vatRate = countryTariff.vatRate ?? 10;
  const mfnRate = countryTariff.baseTariffRate ?? 8.0;

  // 3. Currency and Exchange Rate handling
  const exRateInfo = INITIAL_EXCHANGE_RATES[currency] || { rateToKrw: exchangeRate || 1380, baseUnit: 1 };
  const effectiveExchangeRate = exchangeRate > 0 ? exchangeRate : exRateInfo.rateToKrw;
  const rateMultiplier = effectiveExchangeRate / (exRateInfo.baseUnit || 1);

  // 4. Value calculations
  const rawItemValueForeign = quantity * unitPrice;
  const totalFreightForeign = freightCost;
  const totalInsuranceForeign = insuranceCost;

  // CIF Value (과세가격)
  let cifValueForeign = rawItemValueForeign;
  if (incoterms === 'FOB' || incoterms === 'EXW' || incoterms === 'CFR') {
    cifValueForeign = rawItemValueForeign + totalFreightForeign + totalInsuranceForeign;
  }

  const itemValueKrw = Math.round(rawItemValueForeign * rateMultiplier);
  const cifValueKrw = Math.round(cifValueForeign * rateMultiplier);

  // 5. Duty (관세액)
  const tariffAmountKrw = Math.round(cifValueKrw * (appliedTariffRate / 100));
  const tariffAmountForeign = rateMultiplier > 0 ? Number((tariffAmountKrw / rateMultiplier).toFixed(2)) : 0;

  // MFN tariff amount for savings comparison
  const mfnTariffAmountKrw = Math.round(cifValueKrw * (mfnRate / 100));
  const ftaSavingsKrw = Math.max(0, mfnTariffAmountKrw - tariffAmountKrw);

  // 6. VAT (부가가치세)
  // 부가세 과세표준 = CIF 과세가격 + 관세
  const vatTaxableBaseKrw = cifValueKrw + tariffAmountKrw;
  const vatAmountKrw = Math.round(vatTaxableBaseKrw * (vatRate / 100));
  const vatAmountForeign = rateMultiplier > 0 ? Number((vatAmountKrw / rateMultiplier).toFixed(2)) : 0;

  // 7. Total Landed Cost (총금액)
  const totalAmountKrw = cifValueKrw + tariffAmountKrw + vatAmountKrw;
  const totalAmountForeign = rateMultiplier > 0 ? Number((totalAmountKrw / rateMultiplier).toFixed(2)) : 0;

  // 8. Import Regulations & Requirements Summary (Grounded in UNIPASS CLIP 포털)
  const clipRegData = getClipImportRegulations(hsCode || item?.hsCode || '', itemName || item?.name);
  
  const reg: ImportRegulation = {
    isControlled: clipRegData.isControlled,
    applicableLaws: clipRegData.applicableLaws,
    requiredCertificates: clipRegData.requiredCertificates,
    inspectionAgency: clipRegData.inspectionAgency,
    clearanceNotes: clipRegData.clearanceNotes,
    prohibitedIngredients: clipRegData.prohibitedIngredients,
    clipSourceUrl: clipRegData.clipSourceUrl,
    customsVerifications: clipRegData.customsVerifications,
    exportImportNotices: clipRegData.exportImportNotices,
    integratedNotices: clipRegData.integratedNotices
  };

  const regSummary = reg.isControlled
    ? `[세관장확인대상] ${reg.applicableLaws.join(', ')} / 필수서류: ${reg.requiredCertificates.slice(0, 2).join(', ')}`
    : `[일반통관] ${reg.applicableLaws.join(', ')}`;

  const exportCountryName = COUNTRIES.find(c => c.code === exportCountry)?.name || exportCountry;
  const importCountryName = COUNTRIES.find(c => c.code === importCountry)?.name || importCountry;

  // 2026년 요건승인 등록 여부 판별 (BM 및 EM 동시 판별 + BM 화학물질명세내역)
  const approvalCheck = checkItemApprovalStatus(itemName, hsCode);
  const primaryApproval = approvalCheck.approvalData;
  const primaryEmApproval = approvalCheck.emApprovalData;

  const bmDetails = approvalCheck.allMatches.map(m => ({
    type: 'BM' as const,
    no: m.no,
    productName: m.productName,
    approvalNumber: m.approvalNumber,
    hazardousSubstance: m.hazardousSubstance,
    casNo: m.casNo,
    hskNo: m.hskNo,
    importCountry: m.importCountry
  }));

  const emDetails = approvalCheck.allEmMatches.map(m => ({
    type: 'EM' as const,
    no: m.no,
    productName: m.productName,
    approvalNumber: m.approvalNumber,
    hazardousSubstance: m.toxicItems.map(t => `${t.toxicName}(${t.contentPercent}%)`).join(', '),
    casNo: m.toxicItems.map(t => t.casNo).join(', '),
    hskNo: '2825.90 / 2841.90',
    importCountry: 'EM 등록처',
    toxicItems: m.toxicItems
  }));

  const bmChemicalSpecDetails = (approvalCheck.allBmChemicalSpecMatches || []).map(m => ({
    no: m.no,
    productName: m.productName,
    modelSpec: m.modelSpec
  }));

  return {
    id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date().toISOString(),
    itemName,
    hsCode,
    exportCountry: exportCountryName,
    importCountry: importCountryName,
    tariffRate: appliedTariffRate,
    tariffRateType,
    wtoTariffRate: countryTariff.wtoTariffRate ?? clipSchedule.wtoRate,
    tariffAmountKrw,
    tariffAmountForeign,
    vatRate,
    vatAmountKrw,
    vatAmountForeign,
    totalAmountKrw,
    totalAmountForeign,
    exchangeRate: effectiveExchangeRate,
    currency,
    importRegulationsSummary: regSummary,
    importRegulationsFull: reg,
    cifValueKrw,
    itemValueKrw,
    ftaAppliedName: ftaName,
    mfnTariffAmountKrw,
    ftaSavingsKrw,
    quantity,
    unitPrice,
    incoterms,
    originCriteria: item?.originCriteria,
    approvalStatus: {
      isRegistered: approvalCheck.isRegistered,
      hasBmMatch: approvalCheck.hasBmMatch,
      hasEmMatch: approvalCheck.hasEmMatch,
      hasBmChemicalSpecMatch: approvalCheck.hasBmChemicalSpecMatch,
      approvalNumber: primaryApproval?.approvalNumber,
      hazardousSubstance: primaryApproval?.hazardousSubstance,
      casNo: primaryApproval?.casNo,
      hskNo: primaryApproval?.hskNo,
      registeredProductName: primaryApproval?.productName,
      importCountry: primaryApproval?.importCountry,
      no: primaryApproval?.no,
      bmMatches: bmDetails,
      emMatches: emDetails,
      bmChemicalSpecMatches: bmChemicalSpecDetails
    }
  };
}

export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 2 }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}
