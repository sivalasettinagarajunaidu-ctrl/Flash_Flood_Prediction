import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Building,
  HeartPulse,
  Radio,
} from 'lucide-react';

interface ContactItem {
  id: string;
  name: string;
  category: 'National' | 'State Authority' | 'District Room' | 'Medical';
  phone: string;
  available: string;
  description: string;
}

export const EmergencyContactsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const contacts: ContactItem[] = [
    {
      id: 'c1',
      name: 'National Disaster Management Authority (NDMA)',
      category: 'National',
      phone: '1078',
      available: '24x7 Toll-Free',
      description: 'Central disaster response operations control room coordinating NDRF battalions.',
    },
    {
      id: 'c2',
      name: 'All-India Universal Emergency Service',
      category: 'National',
      phone: '112',
      available: '24x7 Unified',
      description: 'Single emergency access point routing to police, fire, and mountain rescue.',
    },
    {
      id: 'c3',
      name: 'Mountain Emergency Ambulance Service',
      category: 'Medical',
      phone: '108',
      available: '24x7 Dispatch',
      description: '4x4 hill terrain ambulances equipped with oxygen, trauma kit, and paramedics.',
    },
    {
      id: 'c4',
      name: 'Uttarakhand State Disaster Management (USDMA)',
      category: 'State Authority',
      phone: '0135-2710334',
      available: '24x7 Control Room',
      description: 'Dehradun control coordinating Garhwal and Kumaon mountain flood response.',
    },
    {
      id: 'c5',
      name: 'Himachal Pradesh Disaster Management Cell',
      category: 'State Authority',
      phone: '1070',
      available: '24x7 Toll-Free',
      description: 'Shimla operations center handling Beas, Sutlej, and Parvati basin warnings.',
    },
    {
      id: 'c6',
      name: 'Kerala State Emergency Operations Centre (KSDMA)',
      category: 'State Authority',
      phone: '1077',
      available: '24x7 District Helpline',
      description: 'Coordinates Wayanad and Idukki hill catchment flood & debris slide emergencies.',
    },
    {
      id: 'c7',
      name: 'Sikkim State Disaster Management Authority (SSDMA)',
      category: 'State Authority',
      phone: '03592-202758',
      available: '24x7 Control Room',
      description: 'Gangtok headquarters monitoring Teesta river basin and Glacial Lake outbursts.',
    },
    {
      id: 'c8',
      name: 'Rudraprayag District Emergency Control Room (Mandakini)',
      category: 'District Room',
      phone: '01364-233727',
      available: 'Local Control',
      description: 'Dedicated district center monitoring Kedarnath corridor and Mandakini hydrographs.',
    },
  ];

  const handleCopy = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-wider">
              24x7 Direct Lifelines
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Official Emergency Helplines & Contacts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Verified direct telephone contact directory for National, State, and Mountain District disaster control centers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search state, agency, or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.category}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">{item.available}</span>
              </div>
              <h3 className="font-bold text-sm text-white">{item.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="font-mono text-base font-black text-cyan-300">{item.phone}</div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.phone)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedPhone === item.phone ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>

                <a
                  href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-colors"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
