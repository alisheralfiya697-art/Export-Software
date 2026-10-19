import React, { useState } from 'react';
import { Building2, Globe2, ShieldCheck, X } from 'lucide-react';
import { ConsigneeDetails, CustomsBrokerDetails, ExporterDetails } from './model.ts';
import { SAMPLE_BROKERS, SAMPLE_CONSIGNEES, SAMPLE_EXPORTERS } from './party-mock-service.ts';

interface ExporterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exporter: ExporterDetails) => void;
  currentExporter: ExporterDetails;
}

export const ExporterDialog: React.FC<ExporterDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentExporter,
}) => {
  const [form, setForm] = useState<ExporterDetails>(currentExporter);

  if (!isOpen) return null;

  const handleSelectSample = (sample: ExporterDetails) => {
    setForm(sample);
  };

  const handleSave = () => {
    onSelect(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg">Exporter Master & KYC Details</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Quick Select Presets */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Quick Pick Registered Exporter
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {SAMPLE_EXPORTERS.map((exp) => (
                <button
                  key={exp.iec}
                  type="button"
                  onClick={() => handleSelectSample(exp)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all ${
                    form.iec === exp.iec
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-medium ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate">{exp.tradeName || exp.legalName}</div>
                  <div className="text-slate-500 mt-1">IEC: {exp.iec}</div>
                  <div className="text-emerald-700 font-mono mt-0.5">{exp.aeoStatus}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Legal Registered Name *
              </label>
              <input
                type="text"
                value={form.legalName}
                onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Trade Name
              </label>
              <input
                type="text"
                value={form.tradeName || ''}
                onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                IEC (10 Characters) *
              </label>
              <input
                type="text"
                maxLength={10}
                value={form.iec}
                onChange={(e) => setForm({ ...form, iec: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                PAN (10 Characters) *
              </label>
              <input
                type="text"
                maxLength={10}
                value={form.pan}
                onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                GSTIN (15 Characters) *
              </label>
              <input
                type="text"
                maxLength={15}
                value={form.gstin}
                onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Authorized Dealer (AD) Code (14 Digits) *
              </label>
              <input
                type="text"
                maxLength={14}
                value={form.adCode}
                onChange={(e) => setForm({ ...form, adCode: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
                placeholder="02918374650012"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Registered Factory / Office Address *
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">PIN / Postal Code</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">AEO Status</label>
              <select
                value={form.aeoStatus}
                onChange={(e) => setForm({ ...form, aeoStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-sm bg-white"
              >
                <option value="None">None (Standard)</option>
                <option value="AEO-T1">AEO-T1 (Fast Track Green Channel)</option>
                <option value="AEO-T2">AEO-T2 (Priority Examination)</option>
                <option value="AEO-T3">AEO-T3 (Highest Security Tier)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs"
          >
            Apply Exporter
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConsigneeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (consignee: ConsigneeDetails) => void;
  currentConsignee: ConsigneeDetails;
}

export const ConsigneeDialog: React.FC<ConsigneeDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentConsignee,
}) => {
  const [form, setForm] = useState<ConsigneeDetails>(currentConsignee);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-lg">Overseas Consignee / Buyer</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Quick Pick Frequent Buyers
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_CONSIGNEES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setForm(c)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    form.name === c.name
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-medium'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-slate-500">{c.country} ({c.countryCode})</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Consignee / Buyer Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Overseas Street Address *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Country *</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ISO Country Code (2 letters)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(form);
              onClose();
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-xs"
          >
            Apply Consignee
          </button>
        </div>
      </div>
    </div>
  );
};

interface BrokerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (broker: CustomsBrokerDetails) => void;
  currentBroker: CustomsBrokerDetails;
}

export const BrokerDialog: React.FC<BrokerDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentBroker,
}) => {
  const [form, setForm] = useState<CustomsBrokerDetails>(currentBroker);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-lg">Customs Broker / CHA Details</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
              Quick Pick Authorized CHA
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_BROKERS.map((b) => (
                <button
                  key={b.chaLicenseNo}
                  type="button"
                  onClick={() => setForm(b)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all ${
                    form.chaLicenseNo === b.chaLicenseNo
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-medium'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-semibold">{b.chaName}</div>
                  <div className="text-slate-500 mt-1">Lic: {b.chaLicenseNo} | Card: {b.cardHolderName}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Customs House Agent (CHA) Name
              </label>
              <input
                type="text"
                value={form.chaName}
                onChange={(e) => setForm({ ...form, chaName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                CHA License Number
              </label>
              <input
                type="text"
                value={form.chaLicenseNo}
                onChange={(e) => setForm({ ...form, chaLicenseNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  value={form.cardHolderName}
                  onChange={(e) => setForm({ ...form, cardHolderName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Card ID / Pass Number
                </label>
                <input
                  type="text"
                  value={form.cardHolderId}
                  onChange={(e) => setForm({ ...form, cardHolderId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(form);
              onClose();
            }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-xs"
          >
            Apply Broker
          </button>
        </div>
      </div>
    </div>
  );
};
