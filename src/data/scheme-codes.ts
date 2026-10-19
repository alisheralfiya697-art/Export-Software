import { SchemeCodeItem } from './types.ts';

export const SCHEME_CODES: SchemeCodeItem[] = [
  {
    code: '00',
    name: 'Free Shipping Bill',
    category: 'Free',
    description: 'Exports without claim for export incentives or duty remission',
  },
  {
    code: '19',
    name: 'Customs Duty Drawback (All Industry Rate)',
    category: 'Drawback',
    description: 'Claim of drawback on customs and central excise duties at notified schedule rates',
  },
  {
    code: '20',
    name: 'Customs Duty Drawback (Brand Rate)',
    category: 'Drawback',
    description: 'Drawback calculated on actual duties paid on imported or indigenous inputs',
  },
  {
    code: '01',
    name: 'Advance Authorisation Scheme',
    category: 'Advance',
    description: 'Duty-free import of inputs physically incorporated in export product (with positive value addition)',
  },
  {
    code: '02',
    name: 'EPCG Scheme (Export Promotion Capital Goods)',
    category: 'EPCG',
    description: 'Zero duty import of capital goods for pre-production, production and post-production',
  },
  {
    code: '60',
    name: 'RoDTEP (Remission of Duties and Taxes on Exported Products)',
    category: 'RoDTEP',
    description: 'Rebate of embedded central, state and local duties/taxes not rebated under any other mechanism',
  },
  {
    code: '61',
    name: 'RoSCTL (Rebate of State and Central Taxes and Levies)',
    category: 'RoDTEP',
    description: 'Rebate for apparel, made-ups, and textile articles under Chapter 61, 62 & 63',
  },
  {
    code: '21',
    name: 'EOU / EHTP / STP Scheme Export',
    category: 'EOU',
    description: 'Export of goods manufactured in 100% Export Oriented Units or Technology Parks',
  },
  {
    code: '09',
    name: 'Re-Export of Imported Goods / Repair',
    category: 'Other',
    description: 'Goods imported for repair, replacement, or testing being re-exported under Sec 74',
  },
];
