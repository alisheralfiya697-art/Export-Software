import { ConsigneeDetails, CustomsBrokerDetails, ExporterDetails } from './model.ts';

export const SAMPLE_EXPORTERS: ExporterDetails[] = [
  {
    iec: '0308019482',
    pan: 'AABCT8492K',
    gstin: '27AABCT8492K1Z9',
    legalName: 'Apex Textiles & Apparels Global Ltd',
    tradeName: 'Apex Exim India',
    branchCode: '001',
    addressLine1: 'Plot 45-B, MIDC Industrial Area, Andheri East',
    city: 'Mumbai',
    stateCode: '27',
    postalCode: '400093',
    adCode: '02918374650012',
    bankName: 'State Bank of India - Overseas Branch',
    accountNumber: '38192849102',
    aeoStatus: 'AEO-T2',
    contactPerson: 'Rajesh Sharma (VP Exports)',
    email: 'exports@apexapparel.in',
    phone: '+91 22 6789 4400',
  },
  {
    iec: '0514028391',
    pan: 'AAACS4920E',
    gstin: '24AAACS4920E1ZF',
    legalName: 'Gujarat Precision Castings & Engineering LLP',
    tradeName: 'GPC Engineering',
    branchCode: '002',
    addressLine1: 'Survey No 128, GIDC Phase II, Vatva',
    city: 'Ahmedabad',
    stateCode: '24',
    postalCode: '382445',
    adCode: '05281938470034',
    bankName: 'HDFC Bank Ltd - Trade Finance Dept',
    accountNumber: '50200049281726',
    aeoStatus: 'AEO-T1',
    contactPerson: 'Sneha Patel (Head of Logistics)',
    email: 'logistics@gpccasting.com',
    phone: '+91 79 4910 8820',
  },
  {
    iec: '0719047261',
    pan: 'AACCP3910L',
    gstin: '33AACCP3910L1Z4',
    legalName: 'SunBio Pharmaceuticals & Life Sciences Pvt Ltd',
    tradeName: 'SunBio Pharma',
    branchCode: '001',
    addressLine1: '14, SIPCOT IT & Biotech Park, Siruseri',
    city: 'Chennai',
    stateCode: '33',
    postalCode: '603103',
    adCode: '03918274650088',
    bankName: 'ICICI Bank Ltd - Corporate Banking',
    accountNumber: '000405018392',
    aeoStatus: 'AEO-T3',
    contactPerson: 'Dr. Anand Kumar (Regulatory Exim)',
    email: 'regulatory@sunbiopharma.org',
    phone: '+91 44 2839 9900',
  },
];

export const SAMPLE_CONSIGNEES: ConsigneeDetails[] = [
  {
    name: 'Nordic Fashion & Retail GmbH',
    address: 'Kaufingerstrasse 18, Innenstadt',
    city: 'Munich',
    country: 'Germany',
    countryCode: 'DE',
    postalCode: '80331',
    isBuyerSameAsConsignee: true,
  },
  {
    name: 'American Global Distribution Corp',
    address: '450 Lexington Avenue, 14th Floor',
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    postalCode: '10017',
    isBuyerSameAsConsignee: true,
  },
  {
    name: 'Gulf Trading & Logistics FZE',
    address: 'JAFZA One, Tower A, Jebel Ali Free Zone',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    postalCode: '17234',
    isBuyerSameAsConsignee: true,
  },
  {
    name: 'Tokyo Precision Machinery Co., Ltd.',
    address: '2-4-1 Nihonbashi, Chuo-ku',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    postalCode: '103-0027',
    isBuyerSameAsConsignee: true,
  },
];

export const SAMPLE_BROKERS: CustomsBrokerDetails[] = [
  {
    chaLicenseNo: '11/0492/BOM/REG',
    chaPan: 'AAFCB1948H',
    chaName: 'FastTrack Cargo & Customs Clearing Agency',
    cardHolderName: 'Vikramaditya Rao',
    cardHolderId: 'CHA-CARD-8842',
    phone: '+91 22 2261 4930',
    email: 'filing@fasttrackcha.com',
  },
  {
    chaLicenseNo: '06/0128/DEL/REG',
    chaPan: 'AALCB9281P',
    chaName: 'Northern Freight & Customs Logistics',
    cardHolderName: 'Harpreet Singh',
    cardHolderId: 'CHA-CARD-4419',
    phone: '+91 11 2565 8920',
    email: 'customs@northernfreight.in',
  },
];

export function getExporters(): ExporterDetails[] {
  return SAMPLE_EXPORTERS;
}

export function getConsignees(): ConsigneeDetails[] {
  return SAMPLE_CONSIGNEES;
}

export function getBrokers(): CustomsBrokerDetails[] {
  return SAMPLE_BROKERS;
}
