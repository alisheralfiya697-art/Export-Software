import { TradeAgreementItem } from './types.ts';

export const TRADE_AGREEMENTS: TradeAgreementItem[] = [
  {
    code: 'IN-UAE-CEPA',
    name: 'India-UAE Comprehensive Economic Partnership Agreement (CEPA)',
    countries: ['United Arab Emirates'],
    beneficiaryType: 'Preferential Tariff / Duty Exemption',
  },
  {
    code: 'IN-AUS-ECTA',
    name: 'India-Australia Economic Cooperation and Trade Agreement (ECTA)',
    countries: ['Australia'],
    beneficiaryType: 'Preferential Tariff Quota & Concession',
  },
  {
    code: 'AIFTA',
    name: 'ASEAN-India Free Trade Agreement (AIFTA)',
    countries: ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Vietnam', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Brunei'],
    beneficiaryType: 'Regional Free Trade Agreement',
  },
  {
    code: 'SAFTA',
    name: 'South Asian Free Trade Area (SAFTA)',
    countries: ['Bangladesh', 'Bhutan', 'Maldives', 'Nepal', 'Pakistan', 'Sri Lanka', 'Afghanistan'],
    beneficiaryType: 'Regional Concessional Tariff',
  },
  {
    code: 'IN-JPN-CEPA',
    name: 'India-Japan Comprehensive Economic Partnership Agreement',
    countries: ['Japan'],
    beneficiaryType: 'Bilateral Trade Agreement',
  },
  {
    code: 'IN-KOR-CEPA',
    name: 'India-Korea Comprehensive Economic Partnership Agreement',
    countries: ['South Korea'],
    beneficiaryType: 'Bilateral Trade Agreement',
  },
  {
    code: 'APTA',
    name: 'Asia-Pacific Trade Agreement (APTA)',
    countries: ['China', 'Bangladesh', 'South Korea', 'Laos', 'Sri Lanka', 'Mongolia'],
    beneficiaryType: 'Tariff Preference Certificate',
  },
];
