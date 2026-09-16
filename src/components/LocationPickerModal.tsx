import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Search,
  LocateFixed,
  Sparkles,
  Check,
  ChevronRight,
  Compass,
  Building2,
  Sliders,
} from 'lucide-react';
import { LocationMeta, AppLanguage } from '../types';
import { ALL_INDIA_LOCATIONS, INDIAN_STATES_LIST } from '../data/allIndiaLocations';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  barakLocations: LocationMeta[];
  selectedLocationId: string;
  onSelectLocation: (id: string, customLoc?: LocationMeta) => void;
  onDetectLocation: () => void;
  isDetectingLocation: boolean;
  lang?: AppLanguage;
  customOffset: number;
  onCustomOffsetChange: (val: number) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  barakLocations,
  selectedLocationId,
  onSelectLocation,
  onDetectLocation,
  isDetectingLocation,
  lang = 'en',
  customOffset,
  onCustomOffsetChange,
}) => {
  const [activeTab, setActiveTab] = useState<'barak' | 'india'>('barak');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [barakDistrict, setBarakDistrict] = useState<'all' | 'Cachar' | 'Hailakandi' | 'Karimganj'>('all');

  if (!isOpen) return null;

  // Filter Barak Valley locations
  const filteredBarak = barakLocations.filter((loc) => {
    if (barakDistrict !== 'all' && loc.district?.toLowerCase() !== barakDistrict.toLowerCase()) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      (loc.nameBn && loc.nameBn.toLowerCase().includes(q)) ||
      loc.district.toLowerCase().includes(q)
    );
  });

  // Filter All-India locations
  const filteredIndia = ALL_INDIA_LOCATIONS.filter((loc) => {
    if (selectedState !== 'all' && loc.state.toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      (loc.nameBn && loc.nameBn.toLowerCase().includes(q)) ||
      (loc.nameUr && loc.nameUr.toLowerCase().includes(q)) ||
      loc.state.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q)
    );
  });

  const isRtl = lang === 'ur';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn'
                  ? 'নামাজের স্থান ও সময়সূচী বেছে নিন'
                  : lang === 'ur'
                  ? 'نماز کا مقام اور نظام الاوقات منتخب کریں'
                  : 'Select Prayer Location'}
              </h3>
              <p className="text-xs text-emerald-300/80">
                {lang === 'bn'
                  ? 'বরাক উপত্যকার আসল ক্যালেন্ডার অথবা গুগল অনুযায়ী পুরা ভারতের সময়'
                  : lang === 'ur'
                  ? 'براک وادی کا اصل کیلنڈر یا گوگل کے مطابق پورے ہندوستان کا وقت'
                  : 'Authentic Barak Valley Timetable or All-India Google Method'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Detect Button */}
        <div className="px-5 py-2.5 bg-[#052824] border-b border-emerald-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <LocateFixed className="w-4 h-4 text-[#E2A336] shrink-0" />
            <span>
              {lang === 'bn'
                ? 'আপনার ডিভাইসের জিপিএস অবস্থান সনাক্ত করুন'
                : lang === 'ur'
                ? 'اپنے آلے کا جی پی ایس مقام تلاش کریں'
                : 'Detect your current GPS location'}
            </span>
          </div>
          <button
            onClick={() => {
              onDetectLocation();
              onClose();
            }}
            disabled={isDetectingLocation}
            className="px-3 py-1.5 rounded-lg bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <Compass className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingLocation
                ? lang === 'bn'
                  ? 'সনাক্ত হচ্ছে...'
                  : 'Detecting...'
                : lang === 'bn'
                ? 'জিপিএস সনাক্তকরণ'
                : lang === 'ur'
                ? 'جی پی ایس تلاش'
                : 'Auto Detect'}
            </span>
          </button>
        </div>

        {/* Main Tabs: Barak Valley vs All India */}
        <div className="p-3 bg-[#072d28] border-b border-emerald-900/60">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab('barak');
                setSearchQuery('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                activeTab === 'barak'
                  ? 'bg-gradient-to-r from-emerald-800 to-[#0C3E37] text-white border-[#E2A336] shadow-md ring-1 ring-[#E2A336]/40'
                  : 'bg-[#03221F]/60 text-emerald-300/80 border-emerald-800/40 hover:bg-emerald-900/40'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">🌿</span>
                <span>
                  {lang === 'bn' ? 'বরাক উপত্যকা' : lang === 'ur' ? 'براک وادی' : 'Barak Valley'}
                </span>
              </div>
              <span className="text-[10px] text-[#E2A336] font-normal">
                {lang === 'bn'
                  ? '✓ আপনার প্রদত্ত আসল ক্যালেন্ডার'
                  : lang === 'ur'
                  ? '✓ اصل مستند کیلنڈر'
                  : '✓ Authentic Local Timetable'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('india');
                setSearchQuery('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                activeTab === 'india'
                  ? 'bg-gradient-to-r from-[#0C3E37] to-emerald-800 text-white border-[#E2A336] shadow-md ring-1 ring-[#E2A336]/40'
                  : 'bg-[#03221F]/60 text-emerald-300/80 border-emerald-800/40 hover:bg-emerald-900/40'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">🇮🇳</span>
                <span>
                  {lang === 'bn' ? 'পুরা ভারত' : lang === 'ur' ? 'پورا ہندوستان' : 'All India'}
                </span>
              </div>
              <span className="text-[10px] text-amber-300 font-normal">
                {lang === 'bn'
                  ? '✓ গুগল ও করাচি পদ্ধতি অনুযায়ী'
                  : lang === 'ur'
                  ? '✓ گوگل و کراچی طریقہ'
                  : '✓ Google & Karachi Method'}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="mt-2.5 relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'barak'
                  ? lang === 'bn'
                    ? 'শিলচর, হাইলাকান্দি, করিমগঞ্জ বা বিধানসভা খুঁজুন...'
                    : 'Search constituency (Silchar, Hailakandi, Badarpur...)'
                  : lang === 'bn'
                  ? 'ভারতের যে কোন শহর খুঁজুন (কলকাতা, হাওড়া, দিল্লি, মুম্বই, পাটনা, গুয়াহাটি...)'
                  : lang === 'ur'
                  ? 'شہر تلاش کریں (کولکتہ، ہاوڑہ، دہلی، ممبئی، لکھنؤ، گوہاٹی...)'
                  : 'Search any Indian city (Kolkata, Howrah, Delhi, Mumbai, Lucknow...)'
              }
              className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#E2A336] focus:ring-1 focus:ring-[#E2A336]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
          {/* TAB 1: BARAK VALLEY */}
          {activeTab === 'barak' && (
            <div className="space-y-3">
              {/* Barak District Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setBarakDistrict('all')}
                  className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                    barakDistrict === 'all'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold'
                      : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                  }`}
                >
                  All ({barakLocations.length})
                </button>
                <button
                  onClick={() => setBarakDistrict('Cachar')}
                  className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                    barakDistrict === 'Cachar'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold'
                      : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                  }`}
                >
                  Cachar (ক্যাছাড়)
                </button>
                <button
                  onClick={() => setBarakDistrict('Hailakandi')}
                  className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                    barakDistrict === 'Hailakandi'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold'
                      : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                  }`}
                >
                  Hailakandi (হাইলাকান্দি)
                </button>
                <button
                  onClick={() => setBarakDistrict('Karimganj')}
                  className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                    barakDistrict === 'Karimganj'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold'
                      : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                  }`}
                >
                  Karimganj (করিমগঞ্জ)
                </button>
              </div>

              {/* Constituencies Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredBarak.map((loc) => {
                  const isSelected = selectedLocationId === loc.id;
                  const offsetSign = loc.offset > 0 ? `+${loc.offset}` : `${loc.offset}`;

                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc.id);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#E2A336]/20 border-[#E2A336] shadow-md ring-1 ring-[#E2A336]'
                          : 'bg-[#09332E]/70 hover:bg-[#0C3E37] border-emerald-800/60 text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-[#E2A336] text-[#03221F]'
                              : 'bg-emerald-900/90 text-emerald-300'
                          }`}
                        >
                          {loc.offset === 0 ? '0' : offsetSign}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{loc.name}</span>
                            {loc.nameBn && (
                              <span className="text-xs text-emerald-300/80 font-normal">
                                ({loc.nameBn})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-300/70">
                            {loc.district} District
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                            loc.offset === 0
                              ? 'bg-emerald-800/80 text-emerald-200'
                              : loc.offset > 0
                              ? 'bg-amber-900/80 text-amber-200'
                              : 'bg-sky-900/80 text-sky-200'
                          }`}
                        >
                          {loc.offset === 0 ? 'Base Station' : `${offsetSign} min`}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#E2A336]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Offset Option for Barak Valley */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#09332E]/80 border border-emerald-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sliders className="w-4 h-4 text-[#E2A336]" />
                    <span>
                      {lang === 'bn' ? 'কাস্টম মিনিট অফসেট' : 'Custom Minute Offset (from Silchar)'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E2A336] bg-[#03221F] px-2 py-0.5 rounded border border-emerald-700">
                    {customOffset > 0 ? `+${customOffset}` : customOffset} min
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={customOffset}
                  onChange={(e) => onCustomOffsetChange(parseInt(e.target.value, 10))}
                  className="w-full accent-[#E2A336] cursor-pointer"
                />
                <button
                  onClick={() => {
                    onSelectLocation('custom');
                    onClose();
                  }}
                  className={`mt-2 w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedLocationId === 'custom'
                      ? 'bg-[#E2A336] text-[#03221F]'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedLocationId === 'custom'
                    ? '✓ Custom Location Active'
                    : 'Apply Custom Offset'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ALL INDIA (GOOGLE METHOD) */}
          {activeTab === 'india' && (
            <div className="space-y-3">
              {/* State Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
                <button
                  onClick={() => setSelectedState('all')}
                  className={`px-3 py-1 rounded-lg font-medium shrink-0 transition-all ${
                    selectedState === 'all'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold'
                      : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                  }`}
                >
                  All States ({ALL_INDIA_LOCATIONS.length})
                </button>
                {INDIAN_STATES_LIST.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-all ${
                      selectedState === st
                        ? 'bg-[#E2A336] text-[#03221F] font-bold'
                        : 'bg-[#09332E] text-emerald-200 hover:bg-emerald-800/60 border border-emerald-700/40'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Notice Banner */}
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#E2A336] shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn'
                    ? 'ভারতের সকল শহরের জন্য গুগল সার্চ ও করাচি ইসলামিক রিসার্চ বিশ্ববিদ্যালয়ের সঠিক সময়সূচী ব্যবহৃত হচ্ছে।'
                    : lang === 'ur'
                    ? 'تمام ہندوستانی شہروں کے لیے گوگل سرچ اور کراچی یونیورسٹی کے طریقہ کار کے مطابق درست اوقات حساب کیے جاتے ہیں۔'
                    : 'Calculated using authentic University of Islamic Sciences, Karachi method matching Google search results across India.'}
                </span>
              </div>

              {/* Indian Cities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredIndia.map((loc) => {
                  const isSelected = selectedLocationId === loc.id;

                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc.id, loc);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#E2A336]/20 border-[#E2A336] shadow-md ring-1 ring-[#E2A336]'
                          : 'bg-[#09332E]/70 hover:bg-[#0C3E37] border-emerald-800/60 text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-[#E2A336] text-[#03221F]'
                              : 'bg-emerald-900/90 text-emerald-300'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                            <span>{loc.name}</span>
                            {loc.nameBn && (
                              <span className="text-xs text-emerald-300/80 font-normal">
                                ({loc.nameBn})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-300/70">
                            {loc.state} • {loc.lat?.toFixed(2)}°N, {loc.lon?.toFixed(2)}°E
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-amber-300 font-semibold border border-amber-500/20">
                          Google
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#E2A336]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredIndia.length === 0 && (
                <div className="text-center py-8 text-emerald-400/80 text-xs sm:text-sm">
                  {lang === 'bn'
                    ? 'কোন শহর পাওয়া যায়নি। সার্চ পরিবর্তন করুন।'
                    : 'No cities match your search. Try searching another name.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300/80">
          <span>
            {activeTab === 'barak'
              ? 'Barak Valley: Cachar, Hailakandi & Karimganj'
              : 'All India: Over 100+ cities with Google prayer times'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
          >
            {lang === 'bn' ? 'ঠিক আছে' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
