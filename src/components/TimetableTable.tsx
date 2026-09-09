import React, { useState } from 'react';
import { Calendar, Search, Download, Printer, Filter, CheckCircle2 } from 'lucide-react';
import { LocationMeta, TimetableData, PrayerTimetableItem } from '../types';
import { applyOffset, getBasePrayerTimesForDate, formatDateKey } from '../utils/prayerCalc';

interface TimetableTableProps {
  timetable: TimetableData;
  selectedLocation: LocationMeta;
  use24Hour: boolean;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  asrMethod: 'hanafi' | 'shafii';
}

export const TimetableTable: React.FC<TimetableTableProps> = ({
  timetable,
  selectedLocation,
  use24Hour,
  onSelectDate,
  selectedDate,
  asrMethod,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all_year' | 'active_month' | 'specific_month'>('active_month');
  const [specificMonth, setSpecificMonth] = useState<number>(selectedDate.getMonth());

  const offset = selectedLocation.offset;

  // Generate list of rows based on selected view mode
  const currentYear = selectedDate.getFullYear();

  let dateList: Date[] = [];

  if (viewMode === 'all_year') {
    // All 365/366 days
    const keys = Object.keys(timetable).sort();
    dateList = keys.map((k) => {
      const [m, d] = k.split('-').map((v) => parseInt(v, 10));
      return new Date(currentYear, m - 1, d);
    });
  } else if (viewMode === 'specific_month') {
    const daysInMonth = new Date(currentYear, specificMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dateList.push(new Date(currentYear, specificMonth, day));
    }
  } else {
    // Current active month
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dateList.push(new Date(currentYear, month, day));
    }
  }

  // Filter with search query
  const filteredDates = dateList.filter((d) => {
    const key = formatDateKey(d);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    return key.includes(searchQuery) || dateStr.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'MM-DD', 'Sehri_Ends', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib_Iftar', 'Isha', 'Location', 'Offset_Min'];
    const rows = filteredDates.map((d) => {
      const key = formatDateKey(d);
      const baseTimes = getBasePrayerTimesForDate(d, timetable, asrMethod);
      const s = applyOffset(baseTimes.sehri_end, 'sehri_end', offset);
      const sr = applyOffset(baseTimes.sunrise, 'sunrise', offset);
      const dh = applyOffset(baseTimes.dhuhr, 'dhuhr', offset);
      const as = applyOffset(baseTimes.asr, 'asr', offset);
      const mg = applyOffset(baseTimes.maghrib, 'maghrib', offset);
      const is = applyOffset(baseTimes.isha, 'isha', offset);
      const fmt = (res: { time12: string; time24: string }) => (use24Hour ? res.time24 : res.time12);

      return [
        d.toISOString().slice(0, 10),
        key,
        fmt(s),
        fmt(sr),
        fmt(dh),
        fmt(as),
        fmt(mg),
        fmt(is),
        selectedLocation.name,
        offset,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Prayer_Timetable_${selectedLocation.name}_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="timetable-table-section" className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-700" />
            <span>Calendar Timetable Table</span>
          </h3>
          <p className="text-xs text-stone-500">
            Timetable adjusted for <span className="font-semibold text-stone-800">{selectedLocation.name}</span> ({offset >= 0 ? `+${offset}` : offset} min)
          </p>
        </div>

        {/* View Mode Filters & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            <button
              id="tab-active-month"
              onClick={() => setViewMode('active_month')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'active_month'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active Month
            </button>
            <div className="flex items-center">
              <button
                id="tab-specific-month"
                onClick={() => setViewMode('specific_month')}
                className={`px-2 py-1 rounded-l-md font-medium transition-all ${
                  viewMode === 'specific_month'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Month:
              </button>
              <select
                id="timetable-month-select"
                value={specificMonth}
                onChange={(e) => {
                  setSpecificMonth(parseInt(e.target.value, 10));
                  setViewMode('specific_month');
                }}
                className="bg-white/80 border border-stone-200 rounded-r-md px-1.5 py-0.5 text-xs text-stone-800 focus:outline-none"
              >
                {[
                  'Jan (জানুয়ারী)', 'Feb (ফেব্রুয়ারী)', 'Mar (মার্চ)', 'Apr (এপ্রিল)',
                  'May (মে)', 'Jun (জুন)', 'Jul (জুলাই)', 'Aug (আগস্ট)',
                  'Sep (সেপ্টেম্বর)', 'Oct (অক্টোবর)', 'Nov (নভেম্বর)', 'Dec (ডিসেম্বর)'
                ].map((mName, i) => (
                  <option key={i} value={i}>{mName}</option>
                ))}
              </select>
            </div>
            <button
              id="tab-all-year"
              onClick={() => setViewMode('all_year')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'all_year'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Full Year (365 Days)
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              id="timetable-search-input"
              type="text"
              placeholder="Search date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36"
            />
          </div>

          {/* Export and Print */}
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors border border-stone-200"
            title="Export timetable to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            id="print-timetable-btn"
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors border border-stone-200"
            title="Print printable timetable card"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-600 bg-stone-50/80 font-medium">
              <th className="py-2.5 px-3 rounded-l-lg">Date</th>
              <th className="py-2.5 px-2">Key</th>
              <th className="py-2.5 px-3 font-semibold text-indigo-950 bg-indigo-50/40">Sehri Ends</th>
              <th className="py-2.5 px-3">Sunrise</th>
              <th className="py-2.5 px-3">Dhuhr</th>
              <th className="py-2.5 px-3">Asr</th>
              <th className="py-2.5 px-3 font-semibold text-rose-950 bg-rose-50/40">Maghrib (Iftar)</th>
              <th className="py-2.5 px-3">Isha</th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredDates.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-stone-400">
                  No matching dates found
                </td>
              </tr>
            ) : (
              filteredDates.map((dateItem) => {
                const dateKey = formatDateKey(dateItem);
                const hasExplicitData = Boolean(timetable[dateKey]);
                const isSelected =
                  dateItem.getDate() === selectedDate.getDate() &&
                  dateItem.getMonth() === selectedDate.getMonth();

                const baseTimes = getBasePrayerTimesForDate(dateItem, timetable, asrMethod);

                const sehriRes = applyOffset(baseTimes.sehri_end, 'sehri_end', offset);
                const sunriseRes = applyOffset(baseTimes.sunrise, 'sunrise', offset);
                const dhuhrRes = applyOffset(baseTimes.dhuhr, 'dhuhr', offset);
                const asrRes = applyOffset(baseTimes.asr, 'asr', offset);
                const maghribRes = applyOffset(baseTimes.maghrib, 'maghrib', offset);
                const ishaRes = applyOffset(baseTimes.isha, 'isha', offset);

                const fmt = (res: { time12: string; time24: string }) => (use24Hour ? res.time24 : res.time12);

                return (
                  <tr
                    key={dateKey}
                    onClick={() => onSelectDate(dateItem)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50/90 font-medium'
                        : 'hover:bg-stone-50/70'
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${isSelected ? 'text-amber-950' : 'text-stone-800'}`}>
                          {dateItem.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {hasExplicitData && (
                          <span
                            className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-0.5"
                            title="From exact prompt timetable JSON"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            JSON
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-stone-500 text-[11px]">{dateKey}</td>
                    <td className="py-2.5 px-3 font-mono text-indigo-950 font-bold bg-indigo-50/20">{fmt(sehriRes)}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(sunriseRes)}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(dhuhrRes)}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(asrRes)}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-950 font-bold bg-rose-50/20">{fmt(maghribRes)}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(ishaRes)}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDate(dateItem);
                        }}
                        className={`text-[11px] px-2 py-0.5 rounded transition-colors ${
                          isSelected
                            ? 'bg-amber-600 text-white font-medium'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isSelected ? 'Active' : 'Select'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
