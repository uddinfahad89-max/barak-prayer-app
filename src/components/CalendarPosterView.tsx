import React, { useState } from 'react';
import {
  YEARLY_CALENDAR_MONTHS,
  CALENDAR_POSTER_META,
  CalendarMonthData,
} from '../data/calendarData';
import { LocationMeta } from '../types';
import { applyOffset } from '../utils/prayerCalc';
import {
  FileText,
  Calendar,
  Layers,
  MapPin,
  Clock,
  AlertTriangle,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

interface CalendarPosterViewProps {
  selectedLocation: LocationMeta;
  use24Hour: boolean;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarPosterView: React.FC<CalendarPosterViewProps> = ({
  selectedLocation,
  use24Hour,
  selectedDate,
  onSelectDate,
}) => {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(selectedDate.getMonth());
  const [viewMode, setViewMode] = useState<'single_month' | 'all_months'>('single_month');
  const [showRawBase, setShowRawBase] = useState<boolean>(false);

  const activeOffset = showRawBase ? 0 : selectedLocation.offset;

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const currentDay = selectedDate.getDate();

  const handlePrintPoster = () => {
    window.print();
  };

  const renderMonthCard = (month: CalendarMonthData, isCompact = false) => {
    return (
      <div
        key={month.monthIndex}
        className="bg-white rounded-xl border border-stone-300/80 shadow-xs overflow-hidden flex flex-col"
      >
        {/* Month Header */}
        <div className={`px-3 py-2 text-white flex items-center justify-between ${month.headerColor}`}>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wide text-sm">{month.nameEn}</span>
            <span className="text-xs font-serif opacity-90">/ {month.nameBn}</span>
          </div>
          <span className="text-[11px] font-mono px-1.5 py-0.5 bg-black/20 rounded">
            Month {String(month.monthIndex + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-[11px] border-collapse">
            <thead>
              <tr className="bg-stone-100/90 text-stone-700 font-semibold border-b border-stone-200 text-[10px]">
                <th className="py-1.5 px-1 border-r border-stone-200">তারিখ / Date</th>
                <th className="py-1.5 px-1 bg-amber-50/60 border-r border-stone-200 text-amber-900">
                  ছেহরী শেষ / Fajr
                </th>
                <th className="py-1.5 px-1 border-r border-stone-200">সূর্যোদয় / Sunrise</th>
                <th className="py-1.5 px-1 border-r border-stone-200">যোহর / Dhuhr</th>
                <th className="py-1.5 px-1 border-r border-stone-200">আছর / Asr</th>
                <th className="py-1.5 px-1 bg-rose-50/60 border-r border-stone-200 text-rose-900">
                  মাগরিব / Maghrib
                </th>
                <th className="py-1.5 px-1 text-stone-700">এশা / Isha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {month.entries.map((entry, idx) => {
                // Determine if this entry corresponds to the currently selected date
                const isEntryCurrentMonth = currentMonth === month.monthIndex;
                const nextEntryDay = month.entries[idx + 1]?.day || 32;
                const isSelectedDateRow =
                  isEntryCurrentMonth &&
                  currentDay >= entry.day &&
                  currentDay < nextEntryDay;

                // Format times with offset
                const s = applyOffset(entry.sehri_end, 'sehri_end', activeOffset);
                const sr = applyOffset(entry.sunrise, 'sunrise', activeOffset);
                const dh = applyOffset(entry.dhuhr, 'dhuhr', activeOffset);
                const as = applyOffset(entry.asr, 'asr', activeOffset);
                const mg = applyOffset(entry.maghrib, 'maghrib', activeOffset);
                const is = applyOffset(entry.isha, 'isha', activeOffset);

                const fmt = (res: { time12: string; time24: string }) =>
                  use24Hour ? res.time24 : res.time12;

                return (
                  <tr
                    key={entry.day}
                    onClick={() => onSelectDate(new Date(currentYear, month.monthIndex, entry.day))}
                    className={`cursor-pointer transition-colors ${
                      isSelectedDateRow
                        ? 'bg-amber-100/80 font-semibold text-amber-950 ring-1 ring-amber-400/50'
                        : idx % 2 === 0
                        ? 'bg-white hover:bg-stone-50'
                        : 'bg-stone-50/50 hover:bg-stone-100/80'
                    }`}
                  >
                    <td className="py-1.5 px-1.5 font-bold font-mono text-stone-800 border-r border-stone-200 whitespace-nowrap">
                      {String(entry.day).padStart(2, '0')}
                      {isSelectedDateRow && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 bg-amber-600 text-white rounded-full">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-medium text-amber-950 bg-amber-50/30 border-r border-stone-200">
                      {fmt(s)}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-stone-700 border-r border-stone-200">
                      {fmt(sr)}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-stone-700 border-r border-stone-200">
                      {fmt(dh)}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-stone-700 border-r border-stone-200">
                      {fmt(as)}
                    </td>
                    <td className="py-1.5 px-1 font-mono font-medium text-rose-950 bg-rose-50/30 border-r border-stone-200">
                      {fmt(mg)}
                    </td>
                    <td className="py-1.5 px-1 font-mono text-stone-700">{fmt(is)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div id="calendar-poster-section" className="w-full bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-300 shadow-sm space-y-6">
      {/* Top Header Card mimicking the authentic physical poster */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-md border border-emerald-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-emerald-700/50 pb-4">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              <span>Authentic Printed Calendar Poster Chart</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif">
              {CALENDAR_POSTER_META.titleBn}
            </h2>
            <p className="text-xs text-emerald-200/90 font-sans">
              {CALENDAR_POSTER_META.titleEn} (Silchar, Cachar, Hailakandi, Karimganj, Mizoram)
            </p>
          </div>

          {/* Quick Offset Notice Badges */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs">
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/30 rounded-lg text-amber-200 font-medium">
                করিমগঞ্জ: +২ মিনিট (+2 min)
              </span>
              <span className="px-2.5 py-1 bg-sky-500/20 border border-sky-400/30 rounded-lg text-sky-200 font-medium">
                হায়লাকান্দি / লালা / বদরপুর / কালাইন: -১ মিনিট (-1 min)
              </span>
              <span className="px-2.5 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-indigo-200 font-medium">
                আইজল: -৩ মিনিট (-3 min)
              </span>
            </div>
            <span className="text-[11px] text-emerald-300/80">
              মূল কেন্দ্র: শিলচর (Silchar Base 0 min)
            </span>
          </div>
        </div>

        {/* Toolbar inside the poster banner */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRawBase(false)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                !showRawBase
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-950/70'
              }`}
            >
              Adjusted for {selectedLocation.name} ({selectedLocation.offset >= 0 ? `+${selectedLocation.offset}` : selectedLocation.offset}m)
            </button>
            <button
              onClick={() => setShowRawBase(true)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                showRawBase
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'bg-emerald-950/40 text-emerald-200 hover:bg-emerald-950/70'
              }`}
            >
              Exact Silchar Base Poster Values (Raw)
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="bg-emerald-950/60 p-0.5 rounded-lg border border-emerald-700/60 flex">
              <button
                onClick={() => setViewMode('single_month')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'single_month'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setViewMode('all_months')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  viewMode === 'all_months'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                All 12 Months (Poster)
              </button>
            </div>

            <button
              onClick={handlePrintPoster}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 border border-white/20 transition-colors"
              title="Print Poster Layout"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Poster</span>
            </button>
          </div>
        </div>
      </div>

      {/* Month Selection Buttons if Single Month Mode */}
      {viewMode === 'single_month' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {YEARLY_CALENDAR_MONTHS.map((m) => {
              const isSelected = selectedMonthIdx === m.monthIndex;
              return (
                <button
                  key={m.monthIndex}
                  onClick={() => setSelectedMonthIdx(m.monthIndex)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-sm font-semibold'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <span>{m.nameEn}</span>
                  <span className="text-[11px] opacity-80 font-serif">({m.nameBn})</span>
                </button>
              );
            })}
          </div>

          {/* Single Month Render */}
          <div>{renderMonthCard(YEARLY_CALENDAR_MONTHS[selectedMonthIdx])}</div>
        </div>
      )}

      {/* All 12 Months Grid */}
      {viewMode === 'all_months' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {YEARLY_CALENDAR_MONTHS.map((m) => renderMonthCard(m, true))}
        </div>
      )}

      {/* Bottom Notes & Publisher Information matching the original printed sheet */}
      <div className="bg-amber-50/80 rounded-xl p-4 sm:p-5 border border-amber-200 text-amber-950 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>সতর্কতামূলক নোট ও জরুরি নির্দেশনা (Publisher Cautionary Guidelines)</span>
        </div>
        <ul className="space-y-1.5 list-disc list-inside text-stone-800 leading-relaxed">
          {CALENDAR_POSTER_META.notesBn.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>

        <div className="pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-stone-600 gap-2">
          <div>
            <span className="font-semibold text-stone-800">প্রকাশক / Publisher:</span>{' '}
            {CALENDAR_POSTER_META.publisher}
          </div>
          <div>
            <span className="font-semibold text-stone-800">মোবাইল / Contacts:</span>{' '}
            {CALENDAR_POSTER_META.contacts.join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};
