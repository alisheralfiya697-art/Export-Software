import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  FileText,
  Globe2,
  PackageCheck,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { ESANCHIT_DOCUMENT_CODES } from '../data/e-sanchit-codes.ts';
import { QUANTITY_CODES } from '../data/quantity-code.ts';
import { SCHEME_CODES } from '../data/scheme-codes.ts';
import { MAJOR_PORTS } from '../data/states.ts';
import { TRADE_AGREEMENTS } from '../data/trade-agrements.ts';
import { ShippingBillType } from '../data/types.ts';
import {
  CargoSummary,
  ContainerInfo,
  ESanchitUpload,
  InvoiceHeader,
  LineItem,
  ShippingBill,
} from './model.ts';
import { BrokerDialog, ConsigneeDialog, ExporterDialog } from './party-dialogs.tsx';
import { ShippingBillService } from './shipping-bill-service.ts';
import { getWorkflowStepInfo } from './workflow.ts';

interface ShippingBillFormProps {
  bill: ShippingBill;
  onSave: (updated: ShippingBill) => void;
  onBack: () => void;
  onTransmit: (id: string) => void;
  onGrantLeo: (id: string) => void;
}

export const ShippingBillForm: React.FC<ShippingBillFormProps> = ({
  bill,
  onSave,
  onBack,
  onTransmit,
  onGrantLeo,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'parties' | 'items' | 'cargo' | 'esanchit' | 'review'>('general');
  const [formData, setFormData] = useState<ShippingBill>(bill);

  // Party dialog states
  const [showExporterDialog, setShowExporterDialog] = useState(false);
  const [showConsigneeDialog, setShowConsigneeDialog] = useState(false);
  const [showBrokerDialog, setShowBrokerDialog] = useState(false);

  // Notification / Toast
  const [copyToast, setCopyToast] = useState(false);

  // Sync internal form when bill prop changes
  React.useEffect(() => {
    setFormData(bill);
  }, [bill.id]);

  const updateFormData = (patch: Partial<ShippingBill>) => {
    setFormData((prev) => {
      const merged = { ...prev, ...patch };
      const recalced = ShippingBillService.recalculateTotals(merged);
      const errors = ShippingBillService.validateShippingBill(recalced);
      return { ...recalced, validationErrors: errors };
    });
  };

  const handleManualSave = () => {
    const updated = ShippingBillService.recalculateTotals(formData);
    const errors = ShippingBillService.validateShippingBill(updated);
    updated.validationErrors = errors;
    onSave(updated);
  };

  // Line Item Handlers
  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      itemNo: (formData.items?.length || 0) + 1,
      invoiceNo: formData.invoices[0]?.invoiceNo || 'INV-001',
      hsCode: '61091000',
      description: 'New Export Item Description',
      quantity: 100,
      uqc: 'PCS',
      unitPrice: 10.0,
      currency: formData.invoices[0]?.currency || 'USD',
      itemTotalValue: 1000,
      inrValue: 83500,
      schemeCode: '19',
      drawbackRatePercent: 2.0,
      drawbackAmount: 1670,
      rodtepRatePercent: 1.5,
      rodtepAmount: 1252.5,
      originCountry: 'India',
    };
    updateFormData({ items: [...formData.items, newItem] });
  };

  const handleUpdateItem = (id: string, patch: Partial<LineItem>) => {
    const updatedItems = formData.items.map((item) => (item.id === id ? { ...item, ...patch } : item));
    updateFormData({ items: updatedItems });
  };

  const handleRemoveItem = (id: string) => {
    const remaining = formData.items
      .filter((i) => i.id !== id)
      .map((item, idx) => ({ ...item, itemNo: idx + 1 }));
    updateFormData({ items: remaining });
  };

  // Container Handlers
  const handleAddContainer = () => {
    const newCnt: ContainerInfo = {
      id: `cnt-${Date.now()}`,
      containerNo: `MSKU${Math.floor(1000000 + Math.random() * 8999999)}`,
      size: '40HC',
      sealNo: `IN-${Math.floor(10000 + Math.random() * 89999)}`,
      sealDate: new Date().toISOString().slice(0, 10),
      sealType: 'RFID',
      packagesInContainer: 100,
      grossWeightKg: 5000,
    };
    updateFormData({
      cargo: {
        ...formData.cargo,
        containers: [...formData.cargo.containers, newCnt],
      },
    });
  };

  const handleRemoveContainer = (id: string) => {
    updateFormData({
      cargo: {
        ...formData.cargo,
        containers: formData.cargo.containers.filter((c) => c.id !== id),
      },
    });
  };

  // e-SANCHIT Document simulation
  const handleUploadEsanchit = (docCode: string) => {
    const meta = ESANCHIT_DOCUMENT_CODES.find((d) => d.docCode === docCode);
    const existing = formData.esanchitDocs.find((d) => d.docCode === docCode);
    const randomIrn = `${new Date().getFullYear()}${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const randomDrn = `DRN${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newDoc: ESanchitUpload = {
      id: existing ? existing.id : `doc-${Date.now()}`,
      docCode: docCode,
      docName: meta?.docName || 'Customs Attachment',
      fileName: `${meta?.docName.replace(/[^a-zA-Z0-9]/g, '_')}_signed.pdf`,
      fileSizeKb: Math.floor(200 + Math.random() * 400),
      drn: randomDrn,
      irn: randomIrn,
      uploadDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Verified',
      signedBy: `${formData.exporter.tradeName || formData.exporter.legalName} DSC Token`,
    };

    const updatedDocs = existing
      ? formData.esanchitDocs.map((d) => (d.docCode === docCode ? newDoc : d))
      : [...formData.esanchitDocs, newDoc];

    updateFormData({ esanchitDocs: updatedDocs });
  };

  const currentWorkflow = getWorkflowStepInfo(formData.status);
  const errorCount = formData.validationErrors.filter((e) => e.severity === 'error').length;
  const warningCount = formData.validationErrors.filter((e) => e.severity === 'warning').length;

  const generatedFlatFile = ShippingBillService.generateIcegateFlatFile(formData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedFlatFile);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const downloadFlatFile = () => {
    const blob = new Blob([generatedFlatFile], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.jobNo.replace(/\//g, '_')}_ICEGATE.sb`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Job Ref: {formData.jobNo}
                </h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  formData.status === 'leo_granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : formData.status === 'transmitted'
                    ? 'bg-indigo-100 text-indigo-800'
                    : formData.status === 'validated'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {currentWorkflow.label}
                </span>
                {formData.sbNumber && (
                  <span className="bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                    SB No: {formData.sbNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Port: <span className="font-semibold text-slate-700">{formData.portOfLoading}</span> | Dest: <span className="font-semibold text-slate-700">{formData.countryOfDestination} ({formData.portOfDestination})</span> | Type: <span className="font-semibold text-slate-700">{formData.sbType}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleManualSave}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>

            {formData.status !== 'transmitted' && formData.status !== 'leo_granted' && (
              <button
                type="button"
                onClick={() => {
                  handleManualSave();
                  onTransmit(formData.id);
                }}
                disabled={errorCount > 0}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  errorCount === 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title={errorCount > 0 ? 'Resolve all validation errors before transmitting to ICEGATE' : ''}
              >
                <Send className="w-4 h-4" />
                Transmit to ICEGATE
              </button>
            )}

            {formData.status === 'transmitted' && (
              <button
                type="button"
                onClick={() => onGrantLeo(formData.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Grant LEO Clearance
              </button>
            )}
          </div>
        </div>

        {/* Validation Errors Notice */}
        {errorCount > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">
                {errorCount} Customs Validation {errorCount === 1 ? 'Error' : 'Errors'} Detected:
              </span>{' '}
              {formData.validationErrors
                .filter((e) => e.severity === 'error')
                .map((e) => e.message)
                .join(' • ')}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-5 -mb-5 overflow-x-auto text-sm font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            1. General & Port Details
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'parties'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            2. Exporter & Parties
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'items'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            3. Invoices & Items ({formData.items?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('cargo')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'cargo'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            4. Cargo & Containers
          </button>
          <button
            onClick={() => setActiveTab('esanchit')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'esanchit'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            5. e-SANCHIT Docs ({formData.esanchitDocs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === 'review'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            6. ICEGATE EDI Flat File
          </button>
        </div>
      </div>

      {/* TAB 1: General & Port Details */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-semibold text-slate-900">Customs Port & Filing Parameters</h2>
            <p className="text-xs text-slate-500">Configure Indian customs location, destination port and export scheme category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Internal Job Reference Number *
              </label>
              <input
                type="text"
                value={formData.jobNo}
                onChange={(e) => updateFormData({ jobNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Job Creation Date *
              </label>
              <input
                type="date"
                value={formData.jobDate}
                onChange={(e) => updateFormData({ jobDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Port of Loading (Customs Location) *
              </label>
              <select
                value={formData.portOfLoading}
                onChange={(e) => updateFormData({ portOfLoading: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                {MAJOR_PORTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Shipping Bill Type / Promotion Scheme *
              </label>
              <select
                value={formData.sbType}
                onChange={(e) => updateFormData({ sbType: e.target.value as ShippingBillType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Duty Drawback (19/20)">Duty Drawback (19/20)</option>
                <option value="RoDTEP / RoSCTL (60/61)">RoDTEP / RoSCTL (60/61)</option>
                <option value="Advance Authorisation (01)">Advance Authorisation (01)</option>
                <option value="EPCG Scheme (02)">EPCG Scheme (02)</option>
                <option value="Free Shipping Bill (00)">Free Shipping Bill (00)</option>
                <option value="EOU / SEZ Export (21)">EOU / SEZ Export (21)</option>
                <option value="Re-Export / Repair (09)">Re-Export / Repair (09)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Destination Country *
              </label>
              <input
                type="text"
                value={formData.countryOfDestination}
                onChange={(e) => updateFormData({ countryOfDestination: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Port of Final Destination (UN/LOCODE) *
              </label>
              <input
                type="text"
                value={formData.portOfDestination}
                onChange={(e) => updateFormData({ portOfDestination: e.target.value.toUpperCase() })}
                placeholder="e.g. DEHAM, USNYC, AEDXB"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Transport Mode / Carrier Type
              </label>
              <select
                value={formData.carrierType}
                onChange={(e) => updateFormData({ carrierType: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Sea Vessel">Sea Vessel (Ocean Liner)</option>
                <option value="Air Cargo">Air Cargo (Freighter / Belly Cargo)</option>
                <option value="Multimodal / Rail">Multimodal / ICD Rail</option>
                <option value="Land Border">Land Customs Station (LCS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Vessel Name / Airline Name
              </label>
              <input
                type="text"
                value={formData.vesselFlightName || ''}
                onChange={(e) => updateFormData({ vesselFlightName: e.target.value })}
                placeholder="e.g. MSC BARI or Air India"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Voyage No / Flight No
              </label>
              <input
                type="text"
                value={formData.voyageFlightNo || ''}
                onChange={(e) => updateFormData({ voyageFlightNo: e.target.value })}
                placeholder="e.g. V-2604W"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('parties')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Continue to Parties →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Exporter & Parties */}
      {activeTab === 'parties' && (
        <div className="space-y-6">
          {/* Exporter Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">1. Exporter KYC & Bank AD Code</h3>
                  <p className="text-xs text-slate-500">DGFT IEC, GSTIN, PAN and RBI Bank Authorized Dealer Code</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExporterDialog(true)}
                className="px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-semibold"
              >
                Change / Edit Exporter
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Legal Entity Name</span>
                <span className="font-semibold text-slate-800 text-sm">{formData.exporter.legalName}</span>
                {formData.exporter.tradeName && (
                  <span className="text-slate-500 block">({formData.exporter.tradeName})</span>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">IEC & PAN</span>
                <span className="font-mono font-bold text-slate-800">IEC: {formData.exporter.iec}</span>
                <span className="font-mono text-slate-600 block">PAN: {formData.exporter.pan}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">GSTIN & State</span>
                <span className="font-mono font-bold text-slate-800">{formData.exporter.gstin}</span>
                <span className="text-slate-600 block">State Code: {formData.exporter.stateCode}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Authorized Dealer (AD) Code</span>
                <span className="font-mono font-bold text-emerald-700">{formData.exporter.adCode}</span>
                <span className="text-slate-600 truncate block">{formData.exporter.bankName}</span>
              </div>
            </div>
          </div>

          {/* Consignee Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">2. Consignee & Overseas Buyer</h3>
                  <p className="text-xs text-slate-500">Foreign customer recipient and shipping destination address</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConsigneeDialog(true)}
                className="px-3 py-1.5 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold"
              >
                Change / Edit Consignee
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Overseas Company Name</span>
                <span className="font-semibold text-slate-800 text-sm">{formData.consignee.name}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Address & City</span>
                <span className="text-slate-800">{formData.consignee.address}, {formData.consignee.city}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Country & ISO Code</span>
                <span className="font-semibold text-slate-800 text-sm">{formData.consignee.country}</span>
                <span className="font-mono text-slate-600 block">Code: {formData.consignee.countryCode}</span>
              </div>
            </div>
          </div>

          {/* Customs Broker Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">3. Customs House Agent (CHA) / Broker</h3>
                  <p className="text-xs text-slate-500">Licensed customs broker authorized to submit ICEGATE EDI declaration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBrokerDialog(true)}
                className="px-3 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-semibold"
              >
                Change / Edit CHA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Agency Name</span>
                <span className="font-semibold text-slate-800">{formData.broker.chaName}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">License No & PAN</span>
                <span className="font-mono font-bold text-slate-800">{formData.broker.chaLicenseNo}</span>
                <span className="font-mono text-slate-600 block">{formData.broker.chaPan}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500 block">Customs Pass Holder</span>
                <span className="font-semibold text-slate-800">{formData.broker.cardHolderName}</span>
                <span className="font-mono text-slate-600 block">{formData.broker.cardHolderId}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
            >
              ← Back to General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('items')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Continue to Invoices & Items →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Invoices & Line Items */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Invoice Header Section */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-semibold text-slate-900">Commercial Invoice Details</h3>
              <p className="text-xs text-slate-500">Invoice terms of sale, currency conversion rate, freight and insurance</p>
            </div>

            {formData.invoices.map((inv, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Invoice Number *</label>
                  <input
                    type="text"
                    value={inv.invoiceNo}
                    onChange={(e) => {
                      const updated = [...formData.invoices];
                      updated[idx].invoiceNo = e.target.value;
                      updateFormData({ invoices: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Invoice Date *</label>
                  <input
                    type="date"
                    value={inv.invoiceDate}
                    onChange={(e) => {
                      const updated = [...formData.invoices];
                      updated[idx].invoiceDate = e.target.value;
                      updateFormData({ invoices: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Incoterm</label>
                  <select
                    value={inv.incoterm}
                    onChange={(e) => {
                      const updated = [...formData.invoices];
                      updated[idx].incoterm = e.target.value as any;
                      updateFormData({ invoices: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white text-sm"
                  >
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                    <option value="DAP">DAP (Delivered at Place)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Currency</label>
                  <select
                    value={inv.currency}
                    onChange={(e) => {
                      const updated = [...formData.invoices];
                      updated[idx].currency = e.target.value;
                      updateFormData({ invoices: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white text-sm"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Customs Exchange Rate (INR)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={inv.exchangeRate}
                    onChange={(e) => {
                      const updated = [...formData.invoices];
                      updated[idx].exchangeRate = parseFloat(e.target.value) || 1;
                      updateFormData({ invoices: updated });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Line Items Table */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900">Customs Export Line Items</h3>
                <p className="text-xs text-slate-500">8-digit ITC-HS classification, scheme selection, and incentive rates</p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="py-2.5 px-3 font-semibold w-10">#</th>
                    <th className="py-2.5 px-3 font-semibold w-28">HS Code (8 Digits)</th>
                    <th className="py-2.5 px-3 font-semibold min-w-[200px]">Item Description</th>
                    <th className="py-2.5 px-3 font-semibold w-24">Qty & UQC</th>
                    <th className="py-2.5 px-3 font-semibold w-24">Unit Price</th>
                    <th className="py-2.5 px-3 font-semibold w-28 text-right">Total ({formData.invoices[0]?.currency})</th>
                    <th className="py-2.5 px-3 font-semibold w-28 text-right">Value (INR)</th>
                    <th className="py-2.5 px-3 font-semibold w-32">Scheme</th>
                    <th className="py-2.5 px-3 font-semibold w-24">DBK / RoDTEP %</th>
                    <th className="py-2.5 px-3 font-semibold w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-600">{item.itemNo}</td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          maxLength={8}
                          value={item.hsCode}
                          onChange={(e) => handleUpdateItem(item.id, { hsCode: e.target.value.replace(/\D/g, '') })}
                          className={`w-full px-2 py-1.5 border rounded-md font-mono text-xs ${
                            item.hsCode.length === 8 ? 'border-slate-300' : 'border-red-500 bg-red-50'
                          }`}
                          placeholder="61091000"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs"
                          placeholder="Detailed goods description..."
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                            className="w-16 px-1.5 py-1.5 border border-slate-300 rounded-md text-xs"
                          />
                          <select
                            value={item.uqc}
                            onChange={(e) => handleUpdateItem(item.id, { uqc: e.target.value })}
                            className="w-14 px-1 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                          >
                            {QUANTITY_CODES.map((q) => (
                              <option key={q.uqc} value={q.uqc}>
                                {q.uqc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs font-mono"
                        />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                        {item.itemTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-800">
                        ₹{item.inrValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={item.schemeCode}
                          onChange={(e) => handleUpdateItem(item.id, { schemeCode: e.target.value })}
                          className="w-full px-1.5 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                        >
                          {SCHEME_CODES.map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.code} - {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">DBK%:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={item.drawbackRatePercent}
                              onChange={(e) => handleUpdateItem(item.id, { drawbackRatePercent: parseFloat(e.target.value) || 0 })}
                              className="w-12 px-1 py-0.5 border border-slate-300 rounded-md text-[11px]"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">RoD%:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={item.rodtepRatePercent}
                              onChange={(e) => handleUpdateItem(item.id, { rodtepRatePercent: parseFloat(e.target.value) || 0 })}
                              className="w-12 px-1 py-0.5 border border-slate-300 rounded-md text-[11px]"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary Footer */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Total Items:</span>
                <span className="text-base font-bold">{formData.items.length} Lines</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total FOB (INR):</span>
                <span className="text-base font-bold text-emerald-400">
                  ₹{formData.totalFobInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Drawback (INR):</span>
                <span className="text-base font-bold text-amber-300">
                  ₹{formData.totalDrawbackInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated RoDTEP (INR):</span>
                <span className="text-base font-bold text-cyan-300">
                  ₹{formData.totalRodtepInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('parties')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
            >
              ← Back to Parties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cargo')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Continue to Cargo & Containers →
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Cargo & Containers */}
      {activeTab === 'cargo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="font-semibold text-slate-900">Cargo Packaging & Weight Details</h3>
              <p className="text-xs text-slate-500">Gross & Net weights, package counts, package marks and descriptions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-medium">Nature of Cargo *</label>
                <select
                  value={formData.cargo.natureOfCargo}
                  onChange={(e) => updateFormData({ cargo: { ...formData.cargo, natureOfCargo: e.target.value as any } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white text-sm"
                >
                  <option value="Containerized">Containerized (FCL / LCL)</option>
                  <option value="Bulk">Bulk Cargo</option>
                  <option value="Break Bulk">Break Bulk Cargo</option>
                  <option value="Liquid Bulk">Liquid Bulk (Tanker)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Total Packages *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cargo.totalPackages}
                  onChange={(e) => updateFormData({ cargo: { ...formData.cargo, totalPackages: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Package Type</label>
                <input
                  type="text"
                  value={formData.cargo.packageType}
                  onChange={(e) => updateFormData({ cargo: { ...formData.cargo, packageType: e.target.value } })}
                  placeholder="e.g. Corrugated Cartons, Pallets, Drums"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-medium">Total Gross Weight (KG) *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cargo.grossWeightKg}
                  onChange={(e) => updateFormData({ cargo: { ...formData.cargo, grossWeightKg: parseFloat(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-slate-700 mb-1 font-medium">Shipping Marks & Package Numbers</label>
                <textarea
                  rows={3}
                  value={formData.cargo.marksAndNumbers}
                  onChange={(e) => updateFormData({ cargo: { ...formData.cargo, marksAndNumbers: e.target.value } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="M/S CONSIGNEE NAME... MADE IN INDIA"
                />
              </div>
            </div>
          </div>

          {/* Containers Table */}
          {formData.cargo.natureOfCargo === 'Containerized' && (
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Container & Customs Seal Details</h3>
                  <p className="text-xs text-slate-500">ISO 6346 Container numbers, RFID e-Seals, and packing loads</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddContainer}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  Add Container
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-semibold">Container No (ISO 6346)</th>
                      <th className="py-2.5 px-3 font-semibold">Size</th>
                      <th className="py-2.5 px-3 font-semibold">Seal Type</th>
                      <th className="py-2.5 px-3 font-semibold">Seal Number</th>
                      <th className="py-2.5 px-3 font-semibold">Pkgs in Cnt</th>
                      <th className="py-2.5 px-3 font-semibold">Gross Wt (KG)</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {formData.cargo.containers.map((cnt, idx) => (
                      <tr key={cnt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            maxLength={11}
                            value={cnt.containerNo}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].containerNo = e.target.value.toUpperCase();
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="w-36 px-2 py-1.5 border border-slate-300 rounded-md font-mono text-xs"
                            placeholder="MSKU1234567"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={cnt.size}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].size = e.target.value as any;
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="px-2 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                          >
                            <option value="20FT">20FT Standard</option>
                            <option value="40FT">40FT Standard</option>
                            <option value="40HC">40FT High Cube</option>
                            <option value="LCL">LCL Cargo</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={cnt.sealType}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].sealType = e.target.value as any;
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="px-2 py-1.5 border border-slate-300 rounded-md text-xs bg-white"
                          >
                            <option value="RFID">RFID e-Seal (Self-Sealing)</option>
                            <option value="Self-Sealing">Self-Sealing (Factory)</option>
                            <option value="Customs">Customs Physical Bottle Seal</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={cnt.sealNo}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].sealNo = e.target.value;
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="w-32 px-2 py-1.5 border border-slate-300 rounded-md font-mono text-xs"
                            placeholder="IN-98124"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={cnt.packagesInContainer}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].packagesInContainer = parseInt(e.target.value) || 0;
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="w-20 px-2 py-1.5 border border-slate-300 rounded-md text-xs"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={cnt.grossWeightKg}
                            onChange={(e) => {
                              const updated = [...formData.cargo.containers];
                              updated[idx].grossWeightKg = parseFloat(e.target.value) || 0;
                              updateFormData({ cargo: { ...formData.cargo, containers: updated } });
                            }}
                            className="w-24 px-2 py-1.5 border border-slate-300 rounded-md text-xs font-mono"
                          />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveContainer(cnt.id)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('items')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
            >
              ← Back to Invoices
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('esanchit')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Continue to e-SANCHIT Docs →
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: e-SANCHIT Docs */}
      {activeTab === 'esanchit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900">e-SANCHIT Paperless Document Locker</h3>
                <p className="text-xs text-slate-500">
                  Mandatory ICEGATE e-SANCHIT document repository with 16-digit Image Reference Numbers (IRN)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ESANCHIT_DOCUMENT_CODES.map((codeMeta) => {
                const uploaded = formData.esanchitDocs?.find((d) => d.docCode === codeMeta.docCode);

                return (
                  <div
                    key={codeMeta.docCode}
                    className={`p-4 rounded-xl border transition-all ${
                      uploaded
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : codeMeta.mandatory
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                            {codeMeta.docCode}
                          </span>
                          <h4 className="font-semibold text-sm text-slate-900">{codeMeta.docName}</h4>
                          {codeMeta.mandatory && (
                            <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm uppercase">
                              Mandatory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{codeMeta.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUploadEsanchit(codeMeta.docCode)}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          uploaded
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        {uploaded ? 'Re-upload' : 'Upload & Sign'}
                      </button>
                    </div>

                    {uploaded && (
                      <div className="mt-3 pt-3 border-t border-emerald-200 text-xs space-y-1">
                        <div className="flex justify-between text-slate-600">
                          <span>File: <strong className="text-slate-800">{uploaded.fileName}</strong> ({uploaded.fileSizeKb} KB)</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                          </span>
                        </div>
                        <div className="flex justify-between font-mono text-[11px] text-slate-500">
                          <span>DRN: {uploaded.drn}</span>
                          <span className="text-blue-700 font-bold">IRN: {uploaded.irn}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Signed: {uploaded.signedBy} on {uploaded.uploadDate}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('cargo')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
            >
              ← Back to Cargo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Review & View Flat File →
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: ICEGATE EDI Flat File & Review */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900">ICEGATE 1.5 EDI Gateway RES File</h3>
                <p className="text-xs text-slate-500">Standard Customs Flat File message ready for ICEGATE upload or SFTP transmission</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copyToast ? 'Copied!' : 'Copy Flat File'}
                </button>
                <button
                  type="button"
                  onClick={downloadFlatFile}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .sb File
                </button>
              </div>
            </div>

            <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] select-all border border-slate-800 leading-relaxed">
              <pre>{generatedFlatFile}</pre>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('esanchit')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium"
            >
              ← Back to e-SANCHIT
            </button>

            {formData.status !== 'transmitted' && formData.status !== 'leo_granted' && (
              <button
                type="button"
                onClick={() => {
                  handleManualSave();
                  onTransmit(formData.id);
                }}
                disabled={errorCount > 0}
                className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 ${
                  errorCount === 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Transmit Directly to ICEGATE
              </button>
            )}
          </div>
        </div>
      )}

      {/* Party Modals */}
      <ExporterDialog
        isOpen={showExporterDialog}
        onClose={() => setShowExporterDialog(false)}
        currentExporter={formData.exporter}
        onSelect={(exp) => updateFormData({ exporter: exp })}
      />

      <ConsigneeDialog
        isOpen={showConsigneeDialog}
        onClose={() => setShowConsigneeDialog(false)}
        currentConsignee={formData.consignee}
        onSelect={(c) => updateFormData({ consignee: c })}
      />

      <BrokerDialog
        isOpen={showBrokerDialog}
        onClose={() => setShowBrokerDialog(false)}
        currentBroker={formData.broker}
        onSelect={(b) => updateFormData({ broker: b })}
      />
    </div>
  );
};
