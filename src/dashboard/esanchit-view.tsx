import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { ESANCHIT_DOCUMENT_CODES } from '../data/e-sanchit-codes.ts';
import { ShippingBill } from '../shipping-bills/model.ts';

interface ESanchitViewProps {
  shippingBills: ShippingBill[];
  onUploadDocToBill: (billId: string, docCode: string) => void;
}

export const ESanchitView: React.FC<ESanchitViewProps> = ({
  shippingBills,
  onUploadDocToBill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string>(shippingBills[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedBill = shippingBills.find((b) => b.id === selectedBillId) || shippingBills[0];

  const categories = ['all', 'Commercial', 'Shipping', 'Regulatory', 'Quality', 'Financial'];

  const filteredCodes = ESANCHIT_DOCUMENT_CODES.filter((doc) => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      doc.docCode.includes(term) ||
      doc.docName.toLowerCase().includes(term) ||
      doc.description.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UploadCloud className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">
                e-SANCHIT Single-Window Document Repository
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Electronic Storage and Access to Documents (e-SANCHIT) allows exporters to submit digitised, digitally signed PDF clearance documents directly to Indian Customs and receive a 16-digit Image Reference Number (IRN).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Active Job / Shipping Bill:
            </label>
            <select
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {shippingBills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.jobNo} {b.sbNumber ? `(SB: ${b.sbNumber})` : ''} - {b.exporter.tradeName || b.exporter.legalName.slice(0, 20)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Bill Uploaded Docs Summary */}
      {selectedBill && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-sm text-blue-950">
                Documents for Job: {selectedBill.jobNo} ({selectedBill.exporter.legalName})
              </h3>
            </div>
            <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
              {selectedBill.esanchitDocs?.length || 0} Documents Uploaded with Verified IRN
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedBill.esanchitDocs?.length === 0 ? (
              <div className="col-span-3 text-center py-4 text-xs text-slate-500">
                No documents uploaded yet for this shipping bill. Choose documents from the catalog below.
              </div>
            ) : (
              selectedBill.esanchitDocs.map((doc) => (
                <div key={doc.id} className="bg-white p-3 rounded-lg border border-blue-200 text-xs shadow-2xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-bold">
                        {doc.docCode}
                      </span>
                      <div className="font-semibold text-slate-900 mt-1 truncate max-w-[180px]">{doc.docName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{doc.fileName}</div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between font-mono text-[10px] text-slate-500">
                    <span>IRN:</span>
                    <span className="font-bold text-blue-800">{doc.irn}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Document Catalog */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-semibold text-slate-900">e-SANCHIT Document Master Catalog</h3>
            <p className="text-xs text-slate-500">Click upload to simulate digital signing and instantaneous IRN generation</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search doc name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCodes.map((doc) => {
            const isUploaded = selectedBill?.esanchitDocs?.some((d) => d.docCode === doc.docCode);

            return (
              <div
                key={doc.docCode}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isUploaded
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800">
                      {doc.docCode}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {doc.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">{doc.docName}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{doc.acceptedFormat}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBill) {
                        onUploadDocToBill(selectedBill.id, doc.docCode);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isUploaded
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {isUploaded ? 'Re-Upload IRN' : 'Upload & Generate IRN'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
