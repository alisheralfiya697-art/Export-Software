import { useState, useEffect } from 'react';
import { ShippingBill } from './model.ts';
import { SAMPLE_BROKERS, SAMPLE_CONSIGNEES, SAMPLE_EXPORTERS } from './party-mock-service.ts';
import { ShippingBillService } from './shipping-bill-service.ts';

const STORAGE_KEY = 'export_software_shipping_bills_v1';

export const INITIAL_SHIPPING_BILLS: ShippingBill[] = [
  {
    id: 'sb-001',
    jobNo: 'EXP/2026/0891',
    jobDate: '2026-10-15',
    sbNumber: '7829104',
    sbDate: '2026-10-16',
    portOfLoading: 'INNSA1',
    portOfDestination: 'DEHAM',
    countryOfDestination: 'Germany',
    carrierType: 'Sea Vessel',
    vesselFlightName: 'MSC BARI',
    voyageFlightNo: 'V-2604W',
    sbType: 'Duty Drawback (19/20)',
    status: 'leo_granted',
    leoNumber: 'LEO/INNSA1/2026/99318',
    leoDate: '2026-10-17 14:32:00',
    leoOfficer: 'S. K. Raman (Superintendent Customs, Docks)',
    exporter: SAMPLE_EXPORTERS[0],
    consignee: SAMPLE_CONSIGNEES[0],
    broker: SAMPLE_BROKERS[0],
    invoices: [
      {
        invoiceNo: 'EXP-INV-2026-0044',
        invoiceDate: '2026-10-14',
        incoterm: 'FOB',
        currency: 'EUR',
        exchangeRate: 91.20,
        invoiceAmount: 48500,
        freightAmount: 0,
        insuranceAmount: 0,
        fobAmount: 48500,
        inrTotalFob: 4423200,
      },
    ],
    items: [
      {
        id: 'item-101',
        itemNo: 1,
        invoiceNo: 'EXP-INV-2026-0044',
        hsCode: '61091000',
        description: 'Men 100% Combed Cotton Knitted T-Shirts (Dyed & Washed)',
        quantity: 12000,
        uqc: 'PCS',
        unitPrice: 2.75,
        currency: 'EUR',
        itemTotalValue: 33000,
        inrValue: 3009600,
        schemeCode: '19',
        drawbackRatePercent: 2.1,
        drawbackAmount: 63201.6,
        rodtepRatePercent: 1.5,
        rodtepAmount: 45144,
        originCountry: 'India',
      },
      {
        id: 'item-102',
        itemNo: 2,
        invoiceNo: 'EXP-INV-2026-0044',
        hsCode: '62034200',
        description: 'Men Woven Denim Cotton Trousers & Jeans with Brass Rivets',
        quantity: 2500,
        uqc: 'PCS',
        unitPrice: 6.20,
        currency: 'EUR',
        itemTotalValue: 15500,
        inrValue: 1413600,
        schemeCode: '19',
        drawbackRatePercent: 2.8,
        drawbackAmount: 39580.8,
        rodtepRatePercent: 1.8,
        rodtepAmount: 25444.8,
        originCountry: 'India',
      },
    ],
    cargo: {
      natureOfCargo: 'Containerized',
      totalPackages: 450,
      packageType: 'Corrugated Cartons',
      grossWeightKg: 8950,
      netWeightKg: 8200,
      marksAndNumbers: 'M/S NORDIC FASHION\nHAMBURG VIA NHAVA SHEVA\nINV: EXP-INV-2026-0044\nCTN: 1/450\nMADE IN INDIA',
      containers: [
        {
          id: 'cnt-1',
          containerNo: 'MEDU8291045',
          size: '40HC',
          sealNo: 'INNSA-98214',
          sealDate: '2026-10-15',
          sealType: 'RFID',
          packagesInContainer: 450,
          grossWeightKg: 8950,
        },
      ],
    },
    esanchitDocs: [
      {
        id: 'doc-1',
        docCode: '380000',
        docName: 'Commercial Invoice',
        fileName: 'Invoice_EXP_0044_signed.pdf',
        fileSizeKb: 342,
        drn: 'DRN2026091823',
        irn: '2026101509823412',
        uploadDate: '2026-10-15 11:20',
        status: 'Verified',
        signedBy: 'Apex Textiles DSC Token',
      },
      {
        id: 'doc-2',
        docCode: '271000',
        docName: 'Packing List',
        fileName: 'PackingList_0044_signed.pdf',
        fileSizeKb: 280,
        drn: 'DRN2026091824',
        irn: '2026101509823413',
        uploadDate: '2026-10-15 11:24',
        status: 'Verified',
        signedBy: 'Apex Textiles DSC Token',
      },
      {
        id: 'doc-3',
        docCode: '861000',
        docName: 'Certificate of Origin',
        fileName: 'CoO_Preferential_EUR1.pdf',
        fileSizeKb: 410,
        drn: 'DRN2026091825',
        irn: '2026101509823414',
        uploadDate: '2026-10-15 11:30',
        status: 'Verified',
        signedBy: 'Textiles Committee DSC',
      },
    ],
    totalFobInr: 4423200,
    totalDrawbackInr: 102782.4,
    totalRodtepInr: 70588.8,
    validationErrors: [],
    updatedAt: '2026-10-17T14:35:00.000Z',
    createdAt: '2026-10-14T09:15:00.000Z',
  },
  {
    id: 'sb-002',
    jobNo: 'EXP/2026/0912',
    jobDate: '2026-10-17',
    sbNumber: '8910243',
    sbDate: '2026-10-18',
    portOfLoading: 'INDEL4',
    portOfDestination: 'USNYC',
    countryOfDestination: 'United States',
    carrierType: 'Air Cargo',
    vesselFlightName: 'Air India Cargo',
    voyageFlightNo: 'AIC-101',
    sbType: 'Advance Authorisation (01)',
    status: 'transmitted',
    exporter: SAMPLE_EXPORTERS[2],
    consignee: SAMPLE_CONSIGNEES[1],
    broker: SAMPLE_BROKERS[1],
    invoices: [
      {
        invoiceNo: 'SBP-USA-2026-88',
        invoiceDate: '2026-10-16',
        incoterm: 'CIF',
        currency: 'USD',
        exchangeRate: 83.80,
        invoiceAmount: 76400,
        freightAmount: 3200,
        insuranceAmount: 400,
        fobAmount: 72800,
        inrTotalFob: 6100640,
      },
    ],
    items: [
      {
        id: 'item-201',
        itemNo: 1,
        invoiceNo: 'SBP-USA-2026-88',
        hsCode: '30049099',
        description: 'Paracetamol & Metformin Solid Oral Dosage Tablets (Finished Formulations)',
        quantity: 50000,
        uqc: 'PAC',
        unitPrice: 1.528,
        currency: 'USD',
        itemTotalValue: 76400,
        inrValue: 6402320,
        schemeCode: '01',
        drawbackRatePercent: 0,
        drawbackAmount: 0,
        rodtepRatePercent: 0,
        rodtepAmount: 0,
        originCountry: 'India',
      },
    ],
    cargo: {
      natureOfCargo: 'Bulk',
      totalPackages: 120,
      packageType: 'Insulated Shippers / Cold Chain Cartons',
      grossWeightKg: 1420,
      netWeightKg: 1180,
      marksAndNumbers: 'AMERICAN GLOBAL DIST / NEW YORK / AIR CARGO / KEEP 15-25C',
      containers: [],
    },
    esanchitDocs: [
      {
        id: 'doc-21',
        docCode: '380000',
        docName: 'Commercial Invoice',
        fileName: 'Inv_SBP_88_signed.pdf',
        fileSizeKb: 412,
        drn: 'DRN2026101701',
        irn: '2026101784910283',
        uploadDate: '2026-10-17 16:10',
        status: 'Verified',
        signedBy: 'SunBio Pharma DSC',
      },
      {
        id: 'doc-22',
        docCode: '271000',
        docName: 'Packing List',
        fileName: 'Packing_List_88.pdf',
        fileSizeKb: 198,
        drn: 'DRN2026101702',
        irn: '2026101784910284',
        uploadDate: '2026-10-17 16:12',
        status: 'Verified',
        signedBy: 'SunBio Pharma DSC',
      },
    ],
    totalFobInr: 6100640,
    totalDrawbackInr: 0,
    totalRodtepInr: 0,
    validationErrors: [],
    updatedAt: '2026-10-18T08:10:00.000Z',
    createdAt: '2026-10-16T15:20:00.000Z',
  },
  {
    id: 'sb-003',
    jobNo: 'EXP/2026/0944',
    jobDate: '2026-10-18',
    portOfLoading: 'INMUN1',
    portOfDestination: 'AEDXB',
    countryOfDestination: 'United Arab Emirates',
    carrierType: 'Sea Vessel',
    vesselFlightName: 'HAPAG-LLOYD EXPRESS',
    voyageFlightNo: 'HL-449',
    sbType: 'RoDTEP / RoSCTL (60/61)',
    status: 'validated',
    exporter: SAMPLE_EXPORTERS[1],
    consignee: SAMPLE_CONSIGNEES[2],
    broker: SAMPLE_BROKERS[0],
    invoices: [
      {
        invoiceNo: 'GPC-EXP-940',
        invoiceDate: '2026-10-18',
        incoterm: 'FOB',
        currency: 'USD',
        exchangeRate: 83.75,
        invoiceAmount: 38200,
        freightAmount: 0,
        insuranceAmount: 0,
        fobAmount: 38200,
        inrTotalFob: 3199250,
      },
    ],
    items: [
      {
        id: 'item-301',
        itemNo: 1,
        invoiceNo: 'GPC-EXP-940',
        hsCode: '73259910',
        description: 'Ductile Iron & Spheroidal Graphite Grey Castings for Pump Housings',
        quantity: 18500,
        uqc: 'KGS',
        unitPrice: 2.065,
        currency: 'USD',
        itemTotalValue: 38200,
        inrValue: 3199250,
        schemeCode: '60',
        drawbackRatePercent: 0,
        drawbackAmount: 0,
        rodtepRatePercent: 2.4,
        rodtepAmount: 76782,
        tradeAgreementCode: 'IN-UAE-CEPA',
        originCountry: 'India',
      },
    ],
    cargo: {
      natureOfCargo: 'Containerized',
      totalPackages: 18,
      packageType: 'Heavy Duty Wooden Pallets',
      grossWeightKg: 19200,
      netWeightKg: 18500,
      marksAndNumbers: 'GULF TRADING JEBEL ALI / PALLETS 1 TO 18 / CEPA PREFERENTIAL TARIFF',
      containers: [
        {
          id: 'cnt-301',
          containerNo: 'HLXU4910283',
          size: '20FT',
          sealNo: 'SL-78391',
          sealDate: '2026-10-18',
          sealType: 'Self-Sealing',
          packagesInContainer: 18,
          grossWeightKg: 19200,
        },
      ],
    },
    esanchitDocs: [
      {
        id: 'doc-31',
        docCode: '380000',
        docName: 'Commercial Invoice',
        fileName: 'Invoice_GPC_940.pdf',
        fileSizeKb: 215,
        drn: 'DRN2026101890',
        irn: '2026101811442901',
        uploadDate: '2026-10-18 10:15',
        status: 'Verified',
        signedBy: 'GPC DSC Token',
      },
      {
        id: 'doc-32',
        docCode: '271000',
        docName: 'Packing List',
        fileName: 'PackingList_940.pdf',
        fileSizeKb: 184,
        drn: 'DRN2026101891',
        irn: '2026101811442902',
        uploadDate: '2026-10-18 10:18',
        status: 'Verified',
        signedBy: 'GPC DSC Token',
      },
    ],
    totalFobInr: 3199250,
    totalDrawbackInr: 0,
    totalRodtepInr: 76782,
    validationErrors: [],
    updatedAt: '2026-10-18T10:30:00.000Z',
    createdAt: '2026-10-18T09:00:00.000Z',
  },
];

export function useShippingBillsStore() {
  const [shippingBills, setShippingBills] = useState<ShippingBill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved shipping bills:', e);
    }
    return INITIAL_SHIPPING_BILLS;
  });

  const [activeBillId, setActiveBillId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(shippingBills));
    } catch (e) {
      console.error('Failed to save shipping bills to storage:', e);
    }
  }, [shippingBills]);

  const activeBill = shippingBills.find((sb) => sb.id === activeBillId) || null;

  const saveShippingBill = (bill: ShippingBill) => {
    const updated = ShippingBillService.recalculateTotals(bill);
    const errors = ShippingBillService.validateShippingBill(updated);
    updated.validationErrors = errors;

    setShippingBills((prev) => {
      const exists = prev.some((x) => x.id === bill.id);
      if (exists) {
        return prev.map((x) => (x.id === bill.id ? { ...updated, updatedAt: new Date().toISOString() } : x));
      } else {
        return [{ ...updated, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
      }
    });
    return updated;
  };

  const deleteShippingBill = (id: string) => {
    setShippingBills((prev) => prev.filter((x) => x.id !== id));
    if (activeBillId === id) setActiveBillId(null);
  };

  const duplicateShippingBill = (id: string) => {
    const orig = shippingBills.find((x) => x.id === id);
    if (!orig) return;
    const newJobNo = `EXP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const cloned: ShippingBill = {
      ...orig,
      id: `sb-${Date.now()}`,
      jobNo: newJobNo,
      jobDate: new Date().toISOString().slice(0, 10),
      sbNumber: undefined,
      sbDate: undefined,
      status: 'draft',
      leoNumber: undefined,
      leoDate: undefined,
      leoOfficer: undefined,
      esanchitDocs: orig.esanchitDocs.map((d) => ({
        ...d,
        drn: `DRN${Date.now().toString().slice(-8)}`,
        irn: '',
        status: 'Pending',
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveShippingBill(cloned);
    setActiveBillId(cloned.id);
  };

  const validateBill = (id: string) => {
    const bill = shippingBills.find((x) => x.id === id);
    if (!bill) return;
    const errors = ShippingBillService.validateShippingBill(bill);
    const updated = {
      ...bill,
      validationErrors: errors,
      status: errors.filter((e) => e.severity === 'error').length === 0 ? 'validated' : 'draft',
      updatedAt: new Date().toISOString(),
    };
    saveShippingBill(updated as ShippingBill);
  };

  const transmitToIcegate = (id: string) => {
    const bill = shippingBills.find((x) => x.id === id);
    if (!bill) return;
    const randomSB = Math.floor(7000000 + Math.random() * 2999999).toString();
    const today = new Date().toISOString().slice(0, 10);
    const updated: ShippingBill = {
      ...bill,
      sbNumber: randomSB,
      sbDate: today,
      status: 'transmitted',
      updatedAt: new Date().toISOString(),
    };
    saveShippingBill(updated);
  };

  const grantLeo = (id: string) => {
    const bill = shippingBills.find((x) => x.id === id);
    if (!bill) return;
    const leoNo = `LEO/${bill.portOfLoading}/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 89999)}`;
    const updated: ShippingBill = {
      ...bill,
      status: 'leo_granted',
      leoNumber: leoNo,
      leoDate: new Date().toLocaleString(),
      leoOfficer: 'Customs Appraiser & Docks Examiner (EDI-II)',
      updatedAt: new Date().toISOString(),
    };
    saveShippingBill(updated);
  };

  const resetToDefaults = () => {
    setShippingBills(INITIAL_SHIPPING_BILLS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    shippingBills,
    activeBill,
    activeBillId,
    setActiveBillId,
    saveShippingBill,
    deleteShippingBill,
    duplicateShippingBill,
    validateBill,
    transmitToIcegate,
    grantLeo,
    resetToDefaults,
  };
}
