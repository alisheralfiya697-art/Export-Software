import { ShippingBillStatus, ShippingBillType } from '../data/types.ts';

export interface ExporterDetails {
  iec: string;               // 10 digits/chars e.g. "0392019481"
  pan: string;               // 10 characters e.g. "AAACT1234F"
  gstin: string;             // 15 characters e.g. "27AAACT1234F1Z8"
  legalName: string;
  tradeName?: string;
  branchCode: string;        // 3 digits e.g. "001"
  addressLine1: string;
  city: string;
  stateCode: string;         // 2 digits e.g. "27"
  postalCode: string;
  adCode: string;            // 14 digits authorized dealer bank code
  bankName: string;
  accountNumber: string;
  aeoStatus: 'None' | 'AEO-T1' | 'AEO-T2' | 'AEO-T3';
  contactPerson: string;
  email: string;
  phone: string;
}

export interface ConsigneeDetails {
  name: string;
  address: string;
  city: string;
  country: string;
  countryCode: string;       // 2 letter ISO e.g. "US", "AE", "DE"
  postalCode: string;
  isBuyerSameAsConsignee: boolean;
  buyerName?: string;
  buyerAddress?: string;
  buyerCountry?: string;
}

export interface CustomsBrokerDetails {
  chaLicenseNo: string;      // e.g. "11/2009/BOM"
  chaPan: string;
  chaName: string;
  cardHolderName: string;
  cardHolderId: string;
  phone: string;
  email: string;
}

export interface LineItem {
  id: string;
  itemNo: number;
  invoiceNo: string;
  hsCode: string;            // 8 digits e.g. "61091000"
  description: string;
  quantity: number;
  uqc: string;               // e.g. "PCS", "KGS"
  unitPrice: number;
  currency: string;
  itemTotalValue: number;    // Quantity * unitPrice
  inrValue: number;          // itemTotalValue * exchangeRate
  schemeCode: string;        // e.g. "19", "60", "01"
  drawbackRatePercent: number;
  drawbackAmount: number;
  rodtepRatePercent: number;
  rodtepAmount: number;
  tradeAgreementCode?: string;
  originCountry: string;
}

export interface InvoiceHeader {
  invoiceNo: string;
  invoiceDate: string;
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'EXW' | 'DAP';
  currency: string;
  exchangeRate: number;      // e.g. USD to INR = 83.50
  invoiceAmount: number;
  freightAmount: number;
  insuranceAmount: number;
  fobAmount: number;
  inrTotalFob: number;
}

export interface ContainerInfo {
  id: string;
  containerNo: string;       // 11 characters e.g. "MSKU1234567"
  size: '20FT' | '40FT' | '40HC' | 'LCL';
  sealNo: string;
  sealDate: string;
  sealType: 'Customs' | 'Self-Sealing' | 'RFID';
  packagesInContainer: number;
  grossWeightKg: number;
}

export interface CargoSummary {
  natureOfCargo: 'Containerized' | 'Bulk' | 'Break Bulk' | 'Liquid Bulk';
  totalPackages: number;
  packageType: string;       // Boxes, Pallets, Drums, Cartons
  grossWeightKg: number;
  netWeightKg: number;
  marksAndNumbers: string;
  containers: ContainerInfo[];
}

export interface ESanchitUpload {
  id: string;
  docCode: string;           // 6 digits e.g. "380000"
  docName: string;
  fileName: string;
  fileSizeKb: number;
  drn: string;               // Document Reference Number
  irn: string;               // Image Reference Number 16 digits
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  signedBy: string;
}

export interface ValidationErrorItem {
  field: string;
  section: 'general' | 'parties' | 'invoices' | 'cargo' | 'esanchit';
  message: string;
  severity: 'error' | 'warning';
}

export interface ShippingBill {
  id: string;
  jobNo: string;             // Internal reference e.g. "EXP/2026/0412"
  jobDate: string;
  sbNumber?: string;         // ICEGATE assigned SB No e.g. "7829104"
  sbDate?: string;
  portOfLoading: string;     // Port code e.g. "INNSA1"
  portOfDestination: string; // e.g. "USNYC" or "AEDXB"
  countryOfDestination: string;
  carrierType: 'Sea Vessel' | 'Air Cargo' | 'Multimodal / Rail' | 'Land Border';
  vesselFlightName?: string;
  voyageFlightNo?: string;
  sbType: ShippingBillType;
  status: ShippingBillStatus;

  exporter: ExporterDetails;
  consignee: ConsigneeDetails;
  broker: CustomsBrokerDetails;

  invoices: InvoiceHeader[];
  items: LineItem[];
  cargo: CargoSummary;
  esanchitDocs: ESanchitUpload[];

  totalFobInr: number;
  totalDrawbackInr: number;
  totalRodtepInr: number;
  leoNumber?: string;
  leoDate?: string;
  leoOfficer?: string;

  validationErrors: ValidationErrorItem[];
  notes?: string;
  updatedAt: string;
  createdAt: string;
}
