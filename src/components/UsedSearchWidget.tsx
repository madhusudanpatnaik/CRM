import React, { useState } from 'react';
import { Search, ArrowRight, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface UsedSearchWidgetProps {
  onAddLeadFromWeb: (name: string, email: string, phone: string, partName: string, vehicle: any) => void;
  onApplyFilters: (year: string, make: string, model: string, option: string, category: 'Engine' | 'Transmission') => void;
  onOpenLiveChat: () => void;
}

export default function UsedSearchWidget({ onAddLeadFromWeb, onApplyFilters, onOpenLiveChat }: UsedSearchWidgetProps) {
  const [searchPartType, setSearchPartType] = useState<'Engine' | 'Transmission'>('Engine');
  const [searchMake, setSearchMake] = useState<string>('');
  const [searchModel, setSearchModel] = useState<string>('');
  const [searchYear, setSearchYear] = useState<string>('');
  const [searchOption, setSearchOption] = useState<string>('');
  const [searchStep, setSearchStep] = useState<1 | 2 | 3>(1);
  const [searchContactName, setSearchContactName] = useState<string>('');
  const [searchContactEmail, setSearchContactEmail] = useState<string>('');
  const [searchContactPhone, setSearchContactPhone] = useState<string>('');
  const [searchStepError, setSearchStepError] = useState<string | null>(null);

  const WIDGET_VEHICLE_DATA = {
    makes: ['Toyota', 'BMW', 'Ford', 'Subaru', 'Acura', 'Honda', 'Audi', 'Chevrolet', 'Nissan', 'Lexus'],
    models: {
      'Toyota': ['Camry', 'Supra', 'RAV4', 'Corolla', 'Tacoma'],
      'BMW': ['M2', '3-Series', '5-Series', 'X3', 'M340i'],
      'Subaru': ['Outback', 'Legacy', 'Crosstrek', 'WRX', 'Forester'],
      'Ford': ['F-150', 'Mustang GT', 'Explorer', 'F-150 Raptor'],
      'Acura': ['MDX', 'Integra', 'TLX', 'NSX'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot'],
      'Audi': ['A4', 'Q5', 'S4', 'R8'],
      'Chevrolet': ['Corvette', 'Camaro SS', 'Silverado', 'Cruze'],
      'Nissan': ['GT-R', 'Z', 'Frontier', 'Altima'],
      'Lexus': ['RX350', 'IS350', 'ES350', 'LS500']
    } as Record<string, string[]>,
    years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011'],
    options: {
      'Engine': [
        '3.0L S58 Twin-Turbo Inline-6',
        '2.5L I4 Dual VVT-i',
        '3.5L EcoBoost Dual-Turbo V6',
        '6.2L LT1 Naturally Aspirated V8',
        '2.5L Boxer 4-Cylinder H4',
        '4.0L High-Output V8',
        '2.5L L4 DOHC Engine'
      ],
      'Transmission': [
        '8-Speed ZF Automatic RWD / AWD',
        '6-Speed Manual',
        '10-Speed Overdrive 10R80',
        'Lineartronic CVT Automatic',
        '6-Speed Dual-Clutch S-Tronic',
        'TR690 Automatic CVT'
      ]
    } as Record<string, string[]>
  };

  const currentModels = searchMake ? WIDGET_VEHICLE_DATA.models[searchMake] || [] : [];

  return (
    <div id="used-search-widget-container" className="bg-white/95 text-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-orange-600" />
          <span>3-Step Part Finding System</span>
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <span className={`px-2 py-0.5 rounded-full ${searchStep === 1 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>1. Specs</span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-full ${searchStep === 2 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>2. Contact</span>
          <span className="text-slate-300">→</span>
          <span className={`px-2 py-0.5 rounded-full ${searchStep === 3 ? 'bg-orange-600 text-white' : 'bg-slate-200'}`}>3. Match</span>
        </div>
      </div>

      {searchStepError && (
        <div className="mb-3 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded font-medium flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{searchStepError}</span>
        </div>
      )}

      {/* Step 1: Specs fields input */}
      {searchStep === 1 && (
        <div className="space-y-3">
          <p className="text-[10px] text-slate-500 mb-1 leading-normal font-medium">
            To find compatible OEM units, select your vehicle specs below. Model selection depends on choosing a Make first.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">Part category</label>
              <select
                value={searchPartType}
                onChange={(e) => setSearchPartType(e.target.value as 'Engine' | 'Transmission')}
                className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
              >
                <option value="Engine">Engine (Cylinders/Block)</option>
                <option value="Transmission">Transmission (Gearbox)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">Vehicle Make</label>
              <select
                value={searchMake}
                onChange={(e) => {
                  setSearchMake(e.target.value);
                  setSearchModel('');
                  setSearchYear('');
                  setSearchOption('');
                  setSearchStepError(null);
                }}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
              >
                <option value="">Select Make</option>
                {WIDGET_VEHICLE_DATA.makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">Vehicle Model</label>
              <select
                value={searchModel}
                onChange={(e) => {
                  setSearchModel(e.target.value);
                  setSearchYear('');
                  setSearchOption('');
                  setSearchStepError(null);
                }}
                disabled={!searchMake}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">Select Model</option>
                {currentModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-slate-500 block mb-1">Model Year</label>
              <select
                value={searchYear}
                onChange={(e) => {
                  setSearchYear(e.target.value);
                  setSearchOption('');
                  setSearchStepError(null);
                }}
                disabled={!searchModel}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">Select Year</option>
                {WIDGET_VEHICLE_DATA.years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Cylinder Capacity / Gearbox Option</label>
            <select
              value={searchOption}
              onChange={(e) => {
                setSearchOption(e.target.value);
                setSearchStepError(null);
              }}
              disabled={!searchYear}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer font-mono"
            >
              <option value="">Select Specs Option</option>
              {WIDGET_VEHICLE_DATA.options[searchPartType].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (!searchMake || !searchModel || !searchYear || !searchOption) {
                  setSearchStepError('Please complete all vehicle specifications to continue.');
                  return;
                }
                setSearchStepError(null);
                setSearchStep(2);
              }}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <span>Proceed To Step 2 (Contact Details)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Contact Specifications */}
      {searchStep === 2 && (
        <div className="space-y-3">
          <p className="text-[10px] text-slate-500 mb-1 leading-normal font-medium">
            We have mapped stock matching your <span className="font-bold text-slate-900">{searchYear} {searchMake} {searchModel}</span>! Complete contact details to load matched physical records.
          </p>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Your Full Name</label>
              <input
                type="text"
                required
                value={searchContactName}
                onChange={(e) => setSearchContactName(e.target.value)}
                placeholder="e.g. John Miller"
                className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Contact Email Address</label>
                <input
                  type="email"
                  required
                  value={searchContactEmail}
                  onChange={(e) => setSearchContactEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Active Phone Number</label>
                <input
                  type="tel"
                  required
                  value={searchContactPhone}
                  onChange={(e) => setSearchContactPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setSearchStep(1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!searchContactName || !searchContactEmail || !searchContactPhone) {
                  setSearchStepError('Please complete Name, Email and Phone to proceed fitting validation query.');
                  return;
                }

                // Registers Lead profile automatically!
                onAddLeadFromWeb(
                  searchContactName,
                  searchContactEmail,
                  searchContactPhone,
                  `${searchYear} ${searchMake} ${searchModel} ${searchPartType}`,
                  {
                    year: Number(searchYear),
                    make: searchMake,
                    model: searchModel,
                    engineSize: searchOption,
                  }
                );

                // Push filters to parent state to update inventory lists below!
                onApplyFilters(searchYear, searchMake, searchModel, searchOption, searchPartType);

                setSearchStepError(null);
                setSearchStep(3);
              }}
              className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <span>Generate Guaranteed Match</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success Screen representation */}
      {searchStep === 3 && (
        <div className="text-center py-4 space-y-3 animate-fade-in">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">✓ Guaranteed Fitment Verified!</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We have registered your configuration and created Ticket Inquiry for <strong className="text-slate-900 font-semibold">{searchContactName}</strong>. Standard 15-day commercial dispatch is pre-authorized.
          </p>

          <div className="mx-auto max-w-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-left space-y-1 text-[11px] font-mono">
            <div className="flex justify-between border-b pb-1"><span className="text-slate-400">Spec Log:</span><span className="text-slate-900 font-extrabold font-sans text-xs">{searchYear} {searchMake} {searchModel}</span></div>
            <div className="flex justify-between border-b py-1"><span className="text-slate-400">Category:</span><span className="text-slate-800">{searchPartType}</span></div>
            <div className="flex justify-between py-1"><span className="text-slate-400">Option Specs:</span><span className="text-slate-800 text-[10px] break-words line-clamp-1">{searchOption}</span></div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchStep(1);
                setSearchMake('');
                setSearchModel('');
                setSearchYear('');
                setSearchOption('');
                setSearchContactName('');
                setSearchContactEmail('');
                setSearchContactPhone('');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition font-semibold"
            >
              New Search
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('inventory-list-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs transition font-bold"
            >
              See Live Parts Specs Below
            </button>
          </div>
        </div>
      )}

      {/* Sourcing assistance fallback link */}
      <div className="mt-4 pt-3 border-t border-slate-200 border-dashed text-center">
        <button
          onClick={onOpenLiveChat}
          className="text-[11px] text-orange-600 font-extrabold hover:underline inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Unable To Find? Request ASE Specialist Sourcing Assistance</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
