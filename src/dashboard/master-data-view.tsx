import React, { useState } from 'react';
import {
  Building2,
  Globe2,
  Landmark,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { MAJOR_PORTS, INDIAN_STATES } from '../data/states.ts';
import { SAMPLE_BROKERS, SAMPLE_CONSIGNEES, SAMPLE_EXPORTERS } from '../shipping-bills/party-mock-service.ts';

export const MasterDataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'exporters' | 'consignees' | 'brokers' | 'ports' | 'states'>('exporters');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">Customs Master Data & KYC Registers</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authorized Exporters, Overseas Consignees, Licensed Customs Brokers, Registered Port Locations, and GST State Codes
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 mt-6 -mb-6 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('exporters')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'exporters'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Registered Exporters ({SAMPLE_EXPORTERS.length})
          </button>
          <button
            onClick={() => setActiveTab('consignees')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'consignees'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Overseas Buyers ({SAMPLE_CONSIGNEES.length})
          </button>
          <button
            onClick={() => setActiveTab('brokers')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'brokers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Licensed CHAs ({SAMPLE_BROKERS.length})
          </button>
          <button
            onClick={() => setActiveTab('ports')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'ports'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Customs Ports ({MAJOR_PORTS.length})
          </button>
          <button
            onClick={() => setActiveTab('states')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'states'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            State Codes ({INDIAN_STATES.length})
          </button>
        </div>
      </div>

      {/* Tab: Exporters */}
      {activeTab === 'exporters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_EXPORTERS.map((exp) => (
            <div key={exp.iec} className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{exp.legalName}</h3>
                  {exp.tradeName && <div className="text-xs text-blue-600 font-semibold">{exp.tradeName}</div>}
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {exp.aeoStatus}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">IEC:</span>
                  <span className="font-mono font-bold text-slate-800">{exp.iec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PAN:</span>
                  <span className="font-mono text-slate-800">{exp.pan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GSTIN:</span>
                  <span className="font-mono text-slate-800">{exp.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank AD Code:</span>
                  <span className="font-mono font-bold text-emerald-700">{exp.adCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bank:</span>
                  <span className="text-slate-800 truncate max-w-[180px]">{exp.bankName}</span>
                </div>
                <div className="pt-2 text-[11px] text-slate-500">
                  {exp.addressLine1}, {exp.city} - {exp.postalCode}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Consignees */}
      {activeTab === 'consignees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_CONSIGNEES.map((c) => (
            <div key={c.name} className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                  <div className="text-xs text-slate-500">{c.country} ({c.countryCode})</div>
                </div>
                <Globe2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="text-xs text-slate-600 border-t border-slate-100 pt-3 space-y-1">
                <div>{c.address}</div>
                <div>{c.city}, {c.postalCode}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Brokers */}
      {activeTab === 'brokers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_BROKERS.map((b) => (
            <div key={b.chaLicenseNo} className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{b.chaName}</h3>
                  <div className="text-xs font-mono text-indigo-600 font-semibold">License: {b.chaLicenseNo}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cardholder:</span>
                  <span className="font-semibold text-slate-800">{b.cardHolderName} ({b.cardHolderId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PAN:</span>
                  <span className="font-mono text-slate-800">{b.chaPan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone / Email:</span>
                  <span className="text-slate-800">{b.phone} | {b.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Ports */}
      {activeTab === 'ports' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Port Code (ICEGATE)</th>
                <th className="py-2.5 px-4 font-semibold">Port / Terminal Name</th>
                <th className="py-2.5 px-4 font-semibold">State</th>
                <th className="py-2.5 px-4 font-semibold">Facility Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MAJOR_PORTS.map((p) => (
                <tr key={p.code} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{p.code}</td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{p.name}</td>
                  <td className="py-2.5 px-4 text-slate-600">{p.state}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                      {p.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: States */}
      {activeTab === 'states' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 font-semibold">State / UT Code</th>
                <th className="py-2.5 px-4 font-semibold">State / Union Territory Name</th>
                <th className="py-2.5 px-4 font-semibold">GSTIN / TIN Prefix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {INDIAN_STATES.map((s) => (
                <tr key={s.code} className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-mono font-bold text-slate-800">{s.code}</td>
                  <td className="py-2 px-4 text-slate-700">{s.name}</td>
                  <td className="py-2 px-4 font-mono text-slate-500">{s.tin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
