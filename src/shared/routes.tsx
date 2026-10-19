import React, { useState } from 'react';
import { ListDashboard } from '../dashboard/list-dashboard.tsx';
import { ESanchitView } from '../dashboard/esanchit-view.tsx';
import { TariffView } from '../dashboard/tariff-view.tsx';
import { IcegateUtilityView } from '../dashboard/icegate-utility-view.tsx';
import { MasterDataView } from '../dashboard/master-data-view.tsx';
import { useShippingBillsStore } from '../shipping-bills/demo-store.ts';
import { ShippingBillForm } from '../shipping-bills/shipping-bill-form.tsx';
import { ShippingBill } from '../shipping-bills/model.ts';
import { ApplicationLayout } from './application-layout.tsx';
import { SAMPLE_BROKERS, SAMPLE_CONSIGNEES, SAMPLE_EXPORTERS } from '../shipping-bills/party-mock-service.ts';

export const AppRoutes: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [editingBillId, setEditingBillId] = useState<string | null>(null);

  const {
    shippingBills,
    activeBill,
    saveShippingBill,
    deleteShippingBill,
    duplicateShippingBill,
    validateBill,
    transmitToIcegate,
    grantLeo,
    resetToDefaults,
  } = useShippingBillsStore();

  const handleCreateNew = () => {
    const nextJobSeq = Math.floor(1000 + Math.random() * 8999);
    const newBill: ShippingBill = {
      id: `sb-${Date.now()}`,
      jobNo: `EXP/2026/${nextJobSeq}`,
      jobDate: new Date().toISOString().slice(0, 10),
      portOfLoading: 'INNSA1',
      portOfDestination: 'DEHAM',
      countryOfDestination: 'Germany',
      carrierType: 'Sea Vessel',
      sbType: 'Duty Drawback (19/20)',
      status: 'draft',
      exporter: SAMPLE_EXPORTERS[0],
      consignee: SAMPLE_CONSIGNEES[0],
      broker: SAMPLE_BROKERS[0],
      invoices: [
        {
          invoiceNo: `INV-2026-${nextJobSeq}`,
          invoiceDate: new Date().toISOString().slice(0, 10),
          incoterm: 'FOB',
          currency: 'USD',
          exchangeRate: 83.8,
          invoiceAmount: 25000,
          freightAmount: 0,
          insuranceAmount: 0,
          fobAmount: 25000,
          inrTotalFob: 2095000,
        },
      ],
      items: [
        {
          id: `item-${Date.now()}`,
          itemNo: 1,
          invoiceNo: `INV-2026-${nextJobSeq}`,
          hsCode: '61091000',
          description: '100% Combed Cotton T-Shirts, Knitted',
          quantity: 5000,
          uqc: 'PCS',
          unitPrice: 5.0,
          currency: 'USD',
          itemTotalValue: 25000,
          inrValue: 2095000,
          schemeCode: '19',
          drawbackRatePercent: 2.1,
          drawbackAmount: 43995,
          rodtepRatePercent: 1.5,
          rodtepAmount: 31425,
          originCountry: 'India',
        },
      ],
      cargo: {
        natureOfCargo: 'Containerized',
        totalPackages: 250,
        packageType: 'Corrugated Cartons',
        grossWeightKg: 4200,
        netWeightKg: 3800,
        marksAndNumbers: `M/S GERMAN BUYER\nHAMBURG VIA NHAVA SHEVA\nINV: INV-2026-${nextJobSeq}\nMADE IN INDIA`,
        containers: [
          {
            id: `cnt-${Date.now()}`,
            containerNo: 'MEDU7891234',
            size: '20FT',
            sealNo: 'INNSA-44120',
            sealDate: new Date().toISOString().slice(0, 10),
            sealType: 'RFID',
            packagesInContainer: 250,
            grossWeightKg: 4200,
          },
        ],
      },
      esanchitDocs: [
        {
          id: `doc-${Date.now()}-1`,
          docCode: '380000',
          docName: 'Commercial Invoice',
          fileName: `Invoice_${nextJobSeq}_signed.pdf`,
          fileSizeKb: 215,
          drn: `DRN${Date.now().toString().slice(-8)}`,
          irn: `2026${Date.now().toString().slice(-12)}`,
          uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Verified',
          signedBy: 'Apex Textiles DSC Token',
        },
        {
          id: `doc-${Date.now()}-2`,
          docCode: '271000',
          docName: 'Packing List',
          fileName: `PackingList_${nextJobSeq}.pdf`,
          fileSizeKb: 180,
          drn: `DRN${(Date.now() + 1).toString().slice(-8)}`,
          irn: `2026${(Date.now() + 1).toString().slice(-12)}`,
          uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Verified',
          signedBy: 'Apex Textiles DSC Token',
        },
      ],
      totalFobInr: 2095000,
      totalDrawbackInr: 43995,
      totalRodtepInr: 31425,
      validationErrors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveShippingBill(newBill);
    setEditingBillId(newBill.id);
    setCurrentTab('editor');
  };

  const handleSelectBill = (id: string) => {
    setEditingBillId(id);
    setCurrentTab('editor');
  };

  const handleUploadDoc = (billId: string, docCode: string) => {
    const target = shippingBills.find((b) => b.id === billId);
    if (!target) return;
    const randomIrn = `2026${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const randomDrn = `DRN${Math.floor(10000000 + Math.random() * 90000000)}`;
    const existing = target.esanchitDocs.find((d) => d.docCode === docCode);

    const docName = docCode === '380000' ? 'Commercial Invoice' : docCode === '271000' ? 'Packing List' : 'Customs Document';

    const newDoc = {
      id: existing ? existing.id : `doc-${Date.now()}`,
      docCode,
      docName,
      fileName: `doc_${docCode}_signed.pdf`,
      fileSizeKb: 250,
      drn: randomDrn,
      irn: randomIrn,
      uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Verified' as const,
      signedBy: `${target.exporter.legalName} DSC Token`,
    };

    const updatedDocs = existing
      ? target.esanchitDocs.map((d) => (d.docCode === docCode ? newDoc : d))
      : [...target.esanchitDocs, newDoc];

    saveShippingBill({ ...target, esanchitDocs: updatedDocs });
  };

  const billToEdit = shippingBills.find((b) => b.id === editingBillId) || shippingBills[0];

  return (
    <ApplicationLayout
      currentTab={currentTab}
      onTabChange={(tab) => {
        if (tab !== 'editor') setEditingBillId(null);
        setCurrentTab(tab);
      }}
      onCreateNew={handleCreateNew}
      shippingBillsCount={shippingBills.length}
    >
      {currentTab === 'editor' && billToEdit && (
        <ShippingBillForm
          bill={billToEdit}
          onSave={(updated) => {
            saveShippingBill(updated);
          }}
          onBack={() => setCurrentTab('dashboard')}
          onTransmit={(id) => {
            transmitToIcegate(id);
          }}
          onGrantLeo={(id) => {
            grantLeo(id);
          }}
        />
      )}

      {(currentTab === 'dashboard' || currentTab === 'shipping-bills') && (
        <ListDashboard
          shippingBills={shippingBills}
          onSelectBill={handleSelectBill}
          onCreateNew={handleCreateNew}
          onDuplicate={duplicateShippingBill}
          onDelete={deleteShippingBill}
          onTransmit={transmitToIcegate}
          onGrantLeo={grantLeo}
          onValidate={validateBill}
          onResetData={resetToDefaults}
        />
      )}

      {currentTab === 'esanchit' && (
        <ESanchitView
          shippingBills={shippingBills}
          onUploadDocToBill={handleUploadDoc}
        />
      )}

      {currentTab === 'tariff' && <TariffView />}

      {currentTab === 'icegate' && (
        <IcegateUtilityView
          shippingBills={shippingBills}
          onTransmitBill={transmitToIcegate}
        />
      )}

      {currentTab === 'master' && <MasterDataView />}
    </ApplicationLayout>
  );
};
