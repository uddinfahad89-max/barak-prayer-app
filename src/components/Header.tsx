import React, { useState } from 'react';
import { Clock, MapPin, Sliders, Volume2, Code2, Calendar, ChevronDown } from 'lucide-react';
import { LocationMeta } from '../types';
import { playPrayerChime } from '../utils/audioAlert';

interface HeaderProps {
  locations: LocationMeta[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  customOffset: number;
  onCustomOffsetChange: (val: number) => void;
  currentTimeStr: string;
  use24Hour: boolean;
  onToggle24Hour: () => void;
  asrMethod: 'hanafi' | 'shafii';
  onToggleAsrMethod: () => void;
  onOpenDataModal: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  hasUserOverrideForDate: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  customOffset,
  onCustomOffsetChange,
  currentTimeStr,
  use24Hour,
  onToggle24Hour,
  asrMethod,
  onToggleAsrMethod,
  onOpenDataModal,
  selectedDate,
  onSelectDate,
  hasUserOverrideForDate,
}) => {
  const [districtFilter, setDistrictFilter] = useState<'all' | 'Cachar' | 'Hailakandi' | 'Karimganj'>('all');

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];

  const filteredLocations = locations.filter((loc) => {
    if (districtFilter === 'all') return true;
    return loc.district.toLowerCase() === districtFilter.toLowerCase();
  });

  return (
    <header className="w-full bg-emerald-950 text-emerald-50 border-b border-emerald-900/60 shadow-md">
      {/* Top Banner with branding and live clock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-800 text-amber-300 shadow-inner">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Prayer &amp; Fasting Timetable
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-emerald-300/80 mt-1">
            Barak Valley Constituencies: Cachar (ক্যাছাড়), Hailakandi (হাইলাকান্দি) &amp; Karimganj (করিমগঞ্জ)
          </p>
        </div>

        {/* Live Clock & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Clock badge */}
          <div
            id="live-clock-badge"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/80 border border-emerald-700/50 text-emerald-100 text-sm font-mono shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="font-semibold">{currentTimeStr}</span>
          </div>

          {/* 12h / 24h Toggle */}
          <button
            id="toggle-time-format-btn"
            onClick={onToggle24Hour}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/50 text-xs font-medium text-emerald-200 transition-colors"
            title="Toggle between 12-hour (AM/PM) and 24-hour format"
          >
            {use24Hour ? '24-Hour' : '12-Hour'}
          </button>

          {/* Asr Juristic Method Toggle */}
          <button
            id="toggle-asr-method-btn"
            onClick={onToggleAsrMethod}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/50 text-xs font-medium text-emerald-200 transition-colors"
            title="Switch Asr calculation method (Hanafi 2x shadow vs Shafi'i 1x shadow)"
          >
            Asr: <span className="text-amber-300 font-semibold">{asrMethod === 'hanafi' ? 'Hanafi' : "Shafi'i"}</span>
          </button>

          {/* Audio Chime Preview */}
          <button
            id="test-chime-btn"
            onClick={playPrayerChime}
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-300 hover:text-amber-300 transition-colors"
            title="Test prayer alert chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* JSON Data & Configuration */}
          <button
            id="open-data-modal-btn"
            onClick={onOpenDataModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-xs font-medium text-amber-200 transition-colors"
            title="View & edit timetable data JSON"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-300" />
            <span>JSON Timetable</span>
          </button>
        </div>
      </div>

      {/* District & Location Selector Bar */}
      <div className="bg-emerald-900/60 border-t border-emerald-800/60 px-4 sm:px-6 py-2.5 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* District filter badges */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-300 font-medium flex items-center gap-1 shrink-0 mr-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              District:
            </span>
            <button
              id="filter-district-all"
              onClick={() => setDistrictFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                districtFilter === 'all'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                  : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/30'
              }`}
            >
              All ({locations.length})
            </button>
            <button
              id="filter-district-cachar"
              onClick={() => setDistrictFilter('Cachar')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                districtFilter === 'Cachar'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                  : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/30'
              }`}
            >
              Cachar (ক্যাছাড়)
            </button>
            <button
              id="filter-district-hailakandi"
              onClick={() => setDistrictFilter('Hailakandi')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                districtFilter === 'Hailakandi'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                  : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/30'
              }`}
            >
              Hailakandi (হাইলাকান্দি)
            </button>
            <button
              id="filter-district-karimganj"
              onClick={() => setDistrictFilter('Karimganj')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                districtFilter === 'Karimganj'
                  ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs'
                  : 'bg-emerald-950/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/30'
              }`}
            >
              Karimganj (করিমগঞ্জ)
            </button>
          </div>

          {/* Quick Date Shortcuts */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-xs text-emerald-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Date:
            </span>
            <button
              id="quick-date-today"
              onClick={() => onSelectDate(new Date())}
              className="px-2 py-0.5 rounded text-xs bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/40"
            >
              Today
            </button>
            <button
              id="quick-date-jan1"
              onClick={() => {
                const d = new Date();
                d.setMonth(0);
                d.setDate(1);
                onSelectDate(d);
              }}
              className="px-2 py-0.5 rounded text-xs bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/40"
            >
              01-01
            </button>
          </div>
        </div>

        {/* Constituencies Horizontal Scrolling List */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-xs font-medium text-emerald-300 shrink-0">
            Constituencies:
          </span>

          {filteredLocations.map((loc) => {
            const isSelected = loc.id === selectedLocationId;
            const offsetSign = loc.offset > 0 ? `+${loc.offset}` : `${loc.offset}`;
            return (
              <button
                key={loc.id}
                id={`loc-btn-${loc.id}`}
                onClick={() => onSelectLocation(loc.id)}
                className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-400 text-emerald-950 shadow font-semibold ring-2 ring-amber-300/50'
                    : 'bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/40'
                }`}
              >
                <span>{loc.name}</span>
                {loc.nameBn && <span className="opacity-80 font-serif">({loc.nameBn})</span>}
                <span
                  className={`px-1 py-0.2 rounded text-[10px] ${
                    isSelected
                      ? 'bg-emerald-950/20 text-emerald-950 font-bold'
                      : loc.offset === 0
                      ? 'bg-emerald-800 text-emerald-300'
                      : loc.offset > 0
                      ? 'bg-amber-900/60 text-amber-300'
                      : 'bg-sky-950 text-sky-300'
                  }`}
                >
                  {loc.offset === 0 ? '0m Base' : `${offsetSign}m`}
                </span>
              </button>
            );
          })}

          {/* Custom Location button */}
          <button
            id="loc-btn-custom"
            onClick={() => onSelectLocation('custom')}
            className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedLocationId === 'custom'
                ? 'bg-amber-400 text-emerald-950 shadow font-semibold'
                : 'bg-emerald-950/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/40'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Custom</span>
            <span className="text-[10px] opacity-80">({customOffset > 0 ? `+${customOffset}` : customOffset}m)</span>
          </button>
        </div>

        {/* If Custom Location Selected, show custom slider */}
        {selectedLocationId === 'custom' && (
          <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-emerald-800/40 flex items-center gap-3">
            <span className="text-xs text-amber-200 font-medium">Custom Minutes Offset:</span>
            <input
              id="custom-offset-slider"
              type="range"
              min="-15"
              max="15"
              step="1"
              value={customOffset}
              onChange={(e) => onCustomOffsetChange(parseInt(e.target.value, 10))}
              className="w-48 accent-amber-400 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-amber-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
              {customOffset > 0 ? `+${customOffset}` : customOffset} min
            </span>
            <span className="text-[11px] text-emerald-300/80">
              (Applied directly to Silchar base prayer &amp; fasting times)
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
