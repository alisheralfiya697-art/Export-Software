import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  FileCode,
  HardDriveDownload,
  Play,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { ShippingBill } from '../shipping-bills/model.ts';
import { ShippingBillService } from '../shipping-bills/shipping-bill-service.ts';

interface IcegateUtilityViewProps {
  shippingBills: ShippingBill[];
  onTransmitBill: (id: string) => void;
}

export const IcegateUtilityView: React.FC<IcegateUtilityViewProps> = ({
  shippingBills,
  onTransmitBill,
}) => {
  const [selectedBillId, setSelectedBillId] = useState<string>(shippingBills[0]?.id || '');
  const [copyStatus, setCopyStatus] = useState(false);
  const [validationReport, setValidationReport] = useState<string | null>(null);

  const selectedBill = shippingBills.find((b) => b.id === selectedBillId) || shippingBills[0];
  const flatFile = selectedBill ? ShippingBillService.generateIcegateFlatFile(selectedBill) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(flatFile);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedBill) return;
    const blob = new Blob([flatFile], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBill.jobNo.replace(/\//g, '_')}_ICEGATE.sb`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const runDiagnostic = () => {
    if (!selectedBill) return;
    const errors = ShippingBillService.validateShippingBill(selectedBill);
    const lines = [
      `[ICEGATE EDI VALIDATOR v1.5.82 - DIAGNOSTIC REPORT]`,
      `Target Job: ${selectedBill.jobNo} | Port: ${selectedBill.portOfLoading}`,
      `Exporter IEC: ${selectedBill.exporter.iec} | AD Code: ${selectedBill.exporter.adCode}`,
      `Invoice Count: ${selectedBill.invoices.length} | Items: ${selectedBill.items.length}`,
      `e-SANCHIT Docs: ${selectedBill.esanchitDocs.length}`,
      `----------------------------------------------------`,
    ];

    if (errors.length === 0) {
      lines.push(`✔ COMPLIANCE CHECK PASSED: 0 schema or business validation errors.`);
      lines.push(`✔ EDI Flat file records: SB_HEADER, SB_INVOICE, SB_ITEM, SB_ESANCHIT verified.`);
      lines.push(`✔ Ready for transmission via ICEGATE SFTP or Web Gateway.`);
    } else {
      lines.push(`✖ FOUND ${errors.length} COMPLIANCE ISSUE(S):`);
      errors.forEach((err, idx) => {
        lines.push(`  ${idx + 1}. [${err.severity.toUpperCase()}] Section: ${err.section} -> ${err.message}`);
      });
    }

    setValidationReport(lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                ICEGATE EDI 1.5 Flat File Generator & Gateway Inspector
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complies with CBIC Customs Flat File Specification (RES 1.5 format for ICES 1.5 EDI Gateway)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Select Job:
            </label>
            <select
              value={selectedBillId}
              onChange={(e) => {
                setSelectedBillId(e.target.value);
                setValidationReport(null);
              }}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {shippingBills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.jobNo} - {b.exporter.tradeName || b.exporter.legalName.slice(0, 15)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: EDI Flat File Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-600" />
                <span className="font-bold text-xs text-slate-800">
                  Flat File Preview: {selectedBill?.jobNo}.sb
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copyStatus ? 'Copied!' : 'Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>

            <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[480px] border border-slate-800 leading-relaxed">
              <pre>{flatFile}</pre>
            </div>
          </div>
        </div>

        {/* Right: Diagnostic Engine */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">EDI Diagnostics & Test</h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Run schema validation against Indian Customs ICEGATE 1.5 format specifications to detect header, delimiter, line-item, or document errors before submission.
            </p>

            <button
              type="button"
              onClick={runDiagnostic}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Play className="w-4 h-4" />
              Run ICEGATE Compliance Check
            </button>

            {validationReport && (
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-slate-800 max-h-[300px]">
                {validationReport}
              </div>
            )}

            {selectedBill && selectedBill.status !== 'transmitted' && selectedBill.status !== 'leo_granted' && (
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => onTransmitBill(selectedBill.id)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Transmit Directly to ICEGATE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
