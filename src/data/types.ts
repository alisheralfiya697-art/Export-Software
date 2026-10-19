/**
 * Master data types and interfaces for Export Software (Shipping Bill & ICEGATE clearance)
 */

export interface StateItem {
  code: string;
  name: string;
  tin: string;
}

export interface SchemeCodeItem {
  code: string;
  name: string;
  category: 'Drawback' | 'EPCG' | 'Advance' | 'RoDTEP' | 'Free' | 'EOU' | 'Other';
  description: string;
}

export interface QuantityCodeItem {
  uqc: string;
  name: string;
  standardUnit: string;
}

export interface ESanchitCodeItem {
  docCode: string;
  docName: string;
  category: string;
  mandatory: boolean;
  acceptedFormat: string;
  description: string;
}

export interface TradeAgreementItem {
  code: string;
  name: string;
  countries: string[];
  beneficiaryType: string;
}

export interface PortCodeItem {
  code: string;
  name: string;
  state: string;
  type: 'Sea' | 'Air' | 'ICD' | 'LCS';
}

export type ShippingBillType = 
  | 'Duty Drawback (19/20)'
  | 'Advance Authorisation (01)'
  | 'EPCG Scheme (02)'
  | 'RoDTEP / RoSCTL (60/61)'
  | 'Free Shipping Bill (00)'
  | 'EOU / SEZ Export (21)'
  | 'Re-Export / Repair (09)';

export type ShippingBillStatus = 
  | 'draft'
  | 'validated'
  | 'esanchit_pending'
  | 'ready_for_icegate'
  | 'transmitted'
  | 'leo_granted'
  | 'query_raised';
