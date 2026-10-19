import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  HelpCircle,
  Percent,
  Search,
  Tag,
} from 'lucide-react';
import { SCHEME_CODES } from '../data/scheme-codes.ts';
import { TRADE_AGREEMENTS } from '../data/trade-agrements.ts';

interface TariffItem {
  hsCode: string;
  chapter: string;
  description: string;
  uqc: string;
  dbkRate: number;
  dbkCap?: number;
  rodtepRate: number;
  exportDuty: number;
  applicableFta: string[];
}

export const SAMPLE_TARIFF_DATABASE: TariffItem[] = [
  {
    hsCode: '61091000',
    chapter: 'Ch 61 - Knitted Apparel',
    description: 'T-shirts, singlets and other vests, knitted or crocheted, of cotton',
    uqc: 'PCS',
    dbkRate: 2.1,
    dbkCap: 25.5,
    rodtepRate: 1.5,
    exportDuty: 0,
    applicableFta: ['IN-UAE-CEPA', 'IN-AUS-ECTA', 'AIFTA'],
  },
  {
    hsCode: '62034200',
    chapter: 'Ch 62 - Woven Apparel',
    description: 'Men trousers, bib and brace overalls, breeches and shorts of cotton',
    uqc: 'PCS',
    dbkRate: 2.8,
    dbkCap: 48.0,
    rodtepRate: 1.8,
    exportDuty: 0,
    applicableFta: ['IN-UAE-CEPA', 'IN-AUS-ECTA', 'SAFTA'],
  },
  {
    hsCode: '30049099',
    chapter: 'Ch 30 - Pharmaceuticals',
    description: 'Medicaments consisting of mixed or unmixed products for therapeutic uses, in measured doses',
    uqc: 'PAC',
    dbkRate: 1.2,
    rodtepRate: 1.0,
    exportDuty: 0,
    applicableFta: ['AIFTA', 'SAFTA', 'IN-JPN-CEPA'],
  },
  {
    hsCode: '73259910',
    chapter: 'Ch 73 - Iron & Steel Articles',
    description: 'Other cast articles of iron or steel: Of SG Iron or Ductile Iron',
    uqc: 'KGS',
    dbkRate: 1.5,
    rodtepRate: 2.4,
    exportDuty: 0,
    applicableFta: ['IN-UAE-CEPA', 'IN-AUS-ECTA', 'IN-KOR-CEPA'],
  },
  {
    hsCode: '84713010',
    chapter: 'Ch 84 - Machinery & Electronics',
    description: 'Portable automatic data processing machines, weighing not more than 10 kg (Personal computers / laptops)',
    uqc: 'NOS',
    dbkRate: 0.8,
    rodtepRate: 1.2,
    exportDuty: 0,
    applicableFta: ['AIFTA', 'IN-JPN-CEPA', 'APTA'],
  },
  {
    hsCode: '64039190',
    chapter: 'Ch 64 - Footwear',
    description: 'Footwear with outer soles of rubber, plastics, leather and uppers of leather covering the ankle',
    uqc: 'PRS',
    dbkRate: 2.4,
    dbkCap: 85.0,
    rodtepRate: 1.6,
    exportDuty: 0,
    applicableFta: ['IN-UAE-CEPA', 'IN-AUS-ECTA'],
  },
  {
    hsCode: '09012110',
    chapter: 'Ch 09 - Coffee, Tea & Spices',
    description: 'Coffee, roasted, not decaffeinated in consumer packs',
    uqc: 'KGS',
    dbkRate: 0.15,
    rodtepRate: 1.4,
    exportDuty: 0,
    applicableFta: ['SAFTA', 'AIFTA'],
  },
  {
    hsCode: '10063020',
    chapter: 'Ch 10 - Cereals',
    description: 'Semi-milled or wholly milled rice, whether or not polished or glazed: Basmati Rice',
    uqc: 'TON',
    dbkRate: 0,
    rodtepRate: 0,
    exportDuty: 0,
    applicableFta: ['SAFTA', 'IN-UAE-CEPA'],
  },
];

export const TariffView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [calcFobInr, setCalcFobInr] = useState<number>(500000);
  const [selectedTariff, setSelectedTariff] = useState<TariffItem>(SAMPLE_TARIFF_DATABASE[0]);

  const filtered = SAMPLE_TARIFF_DATABASE.filter(
    (t) =>
      t.hsCode.includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcDbk = Number(((calcFobInr * selectedTariff.dbkRate) / 100).toFixed(2));
  const calcRodtep = Number(((calcFobInr * selectedTariff.rodtepRate) / 100).toFixed(2));
  const calcTotalIncentive = calcDbk + calcRodtep;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Indian Customs 8-Digit ITC-HS & Export Incentive Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant verification of Duty Drawback (DBK Schedule), RoDTEP rates, standard UQC units, and Trade Agreement eligibilities.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search & Tariff List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by 8-digit HS Code, keyword (e.g. cotton, medicine, iron) or chapter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-200">
            {filtered.map((item) => {
              const isSelected = selectedTariff.hsCode === item.hsCode;
              return (
                <div
                  key={item.hsCode}
                  onClick={() => setSelectedTariff(item)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {item.hsCode}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">{item.chapter}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                          UQC: {item.uqc}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1.5 font-medium">{item.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-700">
                        DBK: {item.dbkRate > 0 ? `${item.dbkRate}%` : 'NIL'}
                      </div>
                      <div className="text-xs font-bold text-cyan-700 mt-0.5">
                        RoDTEP: {item.rodtepRate > 0 ? `${item.rodtepRate}%` : 'NIL'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.applicableFta.map((fta) => (
                      <span
                        key={fta}
                        className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded"
                      >
                        {fta}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Incentive Simulator & Calculator */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Live Incentive Calculator</h3>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500">Selected ITC-HS:</span>
              <div className="font-mono font-bold text-slate-900 text-sm">{selectedTariff.hsCode}</div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{selectedTariff.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Simulated Export FOB Value (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  step="10000"
                  min="0"
                  value={calcFobInr}
                  onChange={(e) => setCalcFobInr(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Duty Drawback Rate:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTariff.dbkRate}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Drawback Cash Claim:</span>
                <span className="font-mono font-bold text-emerald-700">₹{calcDbk.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">RoDTEP Scrip Rate:</span>
                <span className="font-mono font-bold text-slate-800">{selectedTariff.rodtepRate}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">RoDTEP Duty Credit:</span>
                <span className="font-mono font-bold text-cyan-700">₹{calcRodtep.toLocaleString()}</span>
              </div>

              <div className="flex justify-between p-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg mt-3">
                <span className="font-bold">Total Incentive Yield:</span>
                <span className="font-mono font-black text-sm text-amber-300">
                  ₹{calcTotalIncentive.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-normal bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
              Drawback is credited directly to the Exporter registered Bank AD Code via ICEGATE EDI, while RoDTEP is issued as an electronic transferable duty credit ledger token.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
