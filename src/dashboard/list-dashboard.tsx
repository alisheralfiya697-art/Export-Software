import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Ship,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { MAJOR_PORTS } from '../data/states.ts';
import { ShippingBillStatus } from '../data/types.ts';
import { ShippingBill } from '../shipping-bills/model.ts';
import { getWorkflowStepInfo } from '../shipping-bills/workflow.ts';

interface ListDashboardProps {
  shippingBills: ShippingBill[];
  onSelectBill: (id: string) => void;
  onCreateNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onTransmit: (id: string) => void;
  onGrantLeo: (id: string) => void;
  onValidate: (id: string) => void;
  onResetData: () => void;
}

export const ListDashboard: React.FC<ListDashboardProps> = ({
  shippingBills,
  onSelectBill,
  onCreateNew,
  onDuplicate,
  onDelete,
  onTransmit,
  onGrantLeo,
  onValidate,
  onResetData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [portFilter, setPortFilter] = useState<string>('all');
  const [previewPrintBill, setPreviewPrintBill] = useState<ShippingBill | null>(null);

  // Calculations
  const totalBills = shippingBills.length;
  const leoBills = shippingBills.filter((b) => b.status === 'leo_granted').length;
  const transmittedBills = shippingBills.filter((b) => b.status === 'transmitted').length;
  const totalFobInr = shippingBills.reduce((acc, curr) => acc + curr.totalFobInr, 0);
  const totalIncentivesInr = shippingBills.reduce(
    (acc, curr) => acc + (curr.totalDrawbackInr || 0) + (curr.totalRodtepInr || 0),
    0
  );

  // Filtered bills
  const filteredBills = shippingBills.filter((b) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      b.jobNo.toLowerCase().includes(term) ||
      (b.sbNumber && b.sbNumber.toLowerCase().includes(term)) ||
      b.exporter.legalName.toLowerCase().includes(term) ||
      b.consignee.name.toLowerCase().includes(term) ||
      b.items.some((item) => item.hsCode.includes(term) || item.description.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesPort = portFilter === 'all' || b.portOfLoading === portFilter;

    return matchesSearch && matchesStatus && matchesPort;
  });

  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Filings</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalBills}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              {leoBills} LEO Cleared • {transmittedBills} Under Review
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total Export FOB</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{formatLakhsCrores(totalFobInr)}</div>
            <div className="text-xs text-slate-500 mt-1">₹{totalFobInr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Total DBK & RoDTEP</span>
            <div className="text-2xl font-bold text-indigo-700 mt-1">{formatLakhsCrores(totalIncentivesInr)}</div>
            <div className="text-xs text-slate-500 mt-1">Direct export incentive claims</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Customs Clearance Rate</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {totalBills > 0 ? Math.round((leoBills / totalBills) * 100) : 0}%
            </div>
            <div className="text-xs text-slate-500 mt-1">Let Export Order approval</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Job, SB No, Exporter, Buyer or HS Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="validated">Validated</option>
            <option value="transmitted">Transmitted to ICEGATE</option>
            <option value="leo_granted">LEO Granted</option>
          </select>

          <select
            value={portFilter}
            onChange={(e) => setPortFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="all">All Ports</option>
            {MAJOR_PORTS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code} ({p.name.slice(0, 16)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetData}
            title="Reset to sample demo data"
            className="p-2 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Shipping Bill
          </button>
        </div>
      </div>

      {/* Main Shipping Bills Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Job / SB Details</th>
                <th className="py-3 px-4 font-semibold">Port & Destination</th>
                <th className="py-3 px-4 font-semibold">Exporter & Consignee</th>
                <th className="py-3 px-4 font-semibold">Cargo & Items</th>
                <th className="py-3 px-4 font-semibold text-right">FOB Value (INR)</th>
                <th className="py-3 px-4 font-semibold">Workflow Status</th>
                <th className="py-3 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">No Shipping Bills found</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying your search or filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((sb) => {
                  const wf = getWorkflowStepInfo(sb.status);
                  const errorCount = sb.validationErrors?.filter((e) => e.severity === 'error').length || 0;

                  return (
                    <tr key={sb.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Job & SB */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{sb.jobNo}</div>
                        <div className="text-[11px] text-slate-500">{sb.jobDate}</div>
                        {sb.sbNumber ? (
                          <div className="mt-1 inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-200 text-[11px]">
                            SB: {sb.sbNumber}
                          </div>
                        ) : (
                          <div className="mt-1 text-[11px] text-slate-400">SB Unassigned</div>
                        )}
                      </td>

                      {/* Port & Dest */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{sb.portOfLoading}</div>
                        <div className="text-slate-600 mt-0.5">
                          → {sb.countryOfDestination} ({sb.portOfDestination})
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{sb.carrierType}</div>
                      </td>

                      {/* Exporter & Buyer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[200px]" title={sb.exporter.legalName}>
                          {sb.exporter.tradeName || sb.exporter.legalName}
                        </div>
                        <div className="text-slate-500 truncate max-w-[200px] mt-0.5" title={sb.consignee.name}>
                          To: {sb.consignee.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">IEC: {sb.exporter.iec}</div>
                      </td>

                      {/* Cargo */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700">
                          <strong>{sb.items.length}</strong> {sb.items.length === 1 ? 'Item' : 'Items'}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {sb.cargo.totalPackages} {sb.cargo.packageType}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Wt: {sb.cargo.grossWeightKg.toLocaleString()} KG
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          ₹{sb.totalFobInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {sb.invoices[0]?.currency} {sb.invoices[0]?.fobAmount.toLocaleString()}
                        </div>
                        {(sb.totalDrawbackInr > 0 || sb.totalRodtepInr > 0) && (
                          <div className="text-emerald-700 font-medium text-[10px] mt-0.5">
                            Incentive: ₹{(sb.totalDrawbackInr + sb.totalRodtepInr).toLocaleString()}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          sb.status === 'leo_granted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sb.status === 'transmitted'
                            ? 'bg-indigo-100 text-indigo-800'
                            : sb.status === 'validated'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {wf.label}
                        </span>

                        {errorCount > 0 && (
                          <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {errorCount} errors
                          </div>
                        )}

                        {sb.status === 'leo_granted' && sb.leoNumber && (
                          <div className="text-[10px] text-emerald-700 font-mono mt-1 truncate max-w-[140px]">
                            {sb.leoNumber}
                          </div>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectBill(sb.id)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md font-semibold text-xs transition-colors"
                            title="Edit Shipping Bill"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewPrintBill(sb)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Print Customs Copy"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDuplicate(sb.id)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Duplicate as new Job"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(sb.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Customs Shipping Bill Printable Preview Modal */}
      {previewPrintBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-300 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-base">
                  Official Customs Shipping Bill Copy (EDI FORM - 1.5)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPrintBill(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-900 font-sans text-xs bg-white">
              {/* Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  Government of India — Central Board of Indirect Taxes and Customs (CBIC)
                </div>
                <h1 className="text-xl font-black uppercase tracking-wider mt-1 text-slate-900">
                  Indian Customs EDI System — Shipping Bill for Export
                </h1>
                <div className="text-xs text-slate-600 mt-1">
                  Customs Location: <strong>{previewPrintBill.portOfLoading}</strong> | Scheme Type: <strong>{previewPrintBill.sbType}</strong>
                </div>
              </div>

              {/* Status and Numbers Bar */}
              <div className="grid grid-cols-4 gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block">Job Reference:</span>
                  <span className="font-bold text-slate-900">{previewPrintBill.jobNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Shipping Bill No:</span>
                  <span className="font-bold text-blue-700">{previewPrintBill.sbNumber || 'PENDING ALLOCATION'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SB Date:</span>
                  <span className="font-bold text-slate-900">{previewPrintBill.sbDate || previewPrintBill.jobDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Clearance Status:</span>
                  <span className="font-bold uppercase text-emerald-700">{previewPrintBill.status}</span>
                </div>
              </div>

              {/* Exporter / Consignee Table */}
              <div className="grid grid-cols-2 gap-4 border border-slate-300 rounded-lg p-4">
                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-700 border-b pb-1 mb-2">1. Exporter Details</h4>
                  <div className="font-bold text-slate-900">{previewPrintBill.exporter.legalName}</div>
                  <div className="text-slate-600 mt-0.5">{previewPrintBill.exporter.addressLine1}, {previewPrintBill.exporter.city}</div>
                  <div className="mt-1 font-mono text-[11px]">
                    IEC: <strong>{previewPrintBill.exporter.iec}</strong> | PAN: <strong>{previewPrintBill.exporter.pan}</strong>
                  </div>
                  <div className="font-mono text-[11px]">
                    GSTIN: <strong>{previewPrintBill.exporter.gstin}</strong> | AD Code: <strong>{previewPrintBill.exporter.adCode}</strong>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-700 border-b pb-1 mb-2">2. Consignee / Buyer Details</h4>
                  <div className="font-bold text-slate-900">{previewPrintBill.consignee.name}</div>
                  <div className="text-slate-600 mt-0.5">{previewPrintBill.consignee.address}, {previewPrintBill.consignee.city}</div>
                  <div className="mt-1 text-slate-700">
                    Country: <strong>{previewPrintBill.consignee.country} ({previewPrintBill.consignee.countryCode})</strong>
                  </div>
                  <div className="mt-1 text-slate-700">
                    CHA / Customs Broker: <strong>{previewPrintBill.broker.chaName}</strong> (Lic: {previewPrintBill.broker.chaLicenseNo})
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-700 mb-2">3. Item Specifications & Scheme Benefits</h4>
                <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 p-2 font-semibold">#</th>
                      <th className="border border-slate-300 p-2 font-semibold">HS Code</th>
                      <th className="border border-slate-300 p-2 font-semibold">Description</th>
                      <th className="border border-slate-300 p-2 font-semibold">Qty & UQC</th>
                      <th className="border border-slate-300 p-2 font-semibold text-right">Value (INR)</th>
                      <th className="border border-slate-300 p-2 font-semibold">Scheme</th>
                      <th className="border border-slate-300 p-2 font-semibold text-right">Drawback (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewPrintBill.items.map((i) => (
                      <tr key={i.id}>
                        <td className="border border-slate-300 p-2 font-bold">{i.itemNo}</td>
                        <td className="border border-slate-300 p-2 font-mono font-bold">{i.hsCode}</td>
                        <td className="border border-slate-300 p-2">{i.description}</td>
                        <td className="border border-slate-300 p-2 font-mono">{i.quantity} {i.uqc}</td>
                        <td className="border border-slate-300 p-2 text-right font-mono font-bold">₹{i.inrValue.toLocaleString()}</td>
                        <td className="border border-slate-300 p-2 font-mono">Code {i.schemeCode}</td>
                        <td className="border border-slate-300 p-2 text-right font-mono text-emerald-800">
                          {i.drawbackAmount > 0 ? `₹${i.drawbackAmount.toLocaleString()}` : 'NIL'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold">
                    <tr>
                      <td colSpan={4} className="border border-slate-300 p-2 text-right">TOTAL FOB VALUE (INR):</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-blue-900">
                        ₹{previewPrintBill.totalFobInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-slate-300 p-2 text-right">TOTAL DBK:</td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-emerald-800">
                        ₹{previewPrintBill.totalDrawbackInr.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* LEO Section */}
              {previewPrintBill.status === 'leo_granted' && (
                <div className="border-2 border-emerald-600 bg-emerald-50/60 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      LET EXPORT ORDER (LEO) PASSED UNDER SECTION 51 OF CUSTOMS ACT, 1962
                    </div>
                    <div className="text-xs text-emerald-800 mt-1">
                      LEO No: <span className="font-mono font-bold">{previewPrintBill.leoNumber}</span> | Timestamp: {previewPrintBill.leoDate}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Appraiser / Docks Officer: {previewPrintBill.leoOfficer}
                    </div>
                  </div>
                  <div className="w-24 h-24 border-2 border-dashed border-emerald-600 rounded-full flex items-center justify-center text-center p-2 text-[10px] font-bold text-emerald-900 rotate-[-8deg] uppercase">
                    Customs LEO Verified
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
