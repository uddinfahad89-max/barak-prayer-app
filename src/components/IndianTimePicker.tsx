import React from 'react';
import { formatToIndian12Hour } from '../utils/prayerCalc';

interface IndianTimePickerProps {
  label: string;
  nameBn?: string;
  value: string; // "HH:MM" 24h format
  onChange: (value: string) => void;
  defaultAmPm?: 'AM' | 'PM';
}

export const IndianTimePicker: React.FC<IndianTimePickerProps> = ({
  label,
  nameBn,
  value,
  onChange,
  defaultAmPm = 'PM',
}) => {
  const fallbackAmPm: 'AM' | 'PM' = defaultAmPm === 'AM' ? 'AM' : 'PM';

  // Parse current 24-hour value into 12-hour components
  const parseValue = (timeStr: string): { hour12: string; minute: string; ampm: 'AM' | 'PM' } => {
    if (!timeStr || !timeStr.includes(':')) {
      return { hour12: '12', minute: '00', ampm: fallbackAmPm };
    }
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = String(parseInt(mStr, 10) || 0).padStart(2, '0');
    if (isNaN(h)) return { hour12: '12', minute: '00', ampm: fallbackAmPm };
    const ampm: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return {
      hour12: String(h).padStart(2, '0'),
      minute: m,
      ampm,
    };
  };

  const { hour12, minute, ampm } = parseValue(value);

  // Update 24-hour value
  const updateTime = (newH12: string, newM: string, newAmPm: 'AM' | 'PM') => {
    let h = parseInt(newH12, 10) % 12;
    if (newAmPm === 'PM') h += 12;
    const h24Str = String(h).padStart(2, '0');
    const mStr = String(parseInt(newM, 10) || 0).padStart(2, '0');
    onChange(`${h24Str}:${mStr}`);
  };

  const formattedDisplay = value ? formatToIndian12Hour(value) : '--:-- --';

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = [
    '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'
  ];

  return (
    <div className="flex flex-col bg-stone-900/70 p-3 rounded-xl border border-stone-700/80 shadow-xs hover:border-emerald-700/60 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-stone-200 flex items-center gap-1">
          <span>{label}</span>
          {nameBn && <span className="text-stone-400 font-normal">({nameBn})</span>}
        </label>
      </div>

      {/* Indian 12-Hour formatted badge */}
      <div className="bg-emerald-950/90 border border-emerald-800/80 rounded-lg py-1 px-2 mb-2 flex items-center justify-between text-xs">
        <span className="text-[10px] text-emerald-400 font-medium">ভারতীয় সময়:</span>
        <span className="font-mono font-bold text-amber-300 tracking-wide text-sm">
          {formattedDisplay}
        </span>
      </div>

      {/* 12-Hour Interactive Controls */}
      <div className="grid grid-cols-3 gap-1">
        {/* Hour (1 - 12) */}
        <select
          value={hour12}
          onChange={(e) => updateTime(e.target.value, minute, ampm)}
          className="bg-stone-800 text-white font-mono text-xs p-1.5 rounded-md border border-stone-700 focus:border-emerald-500 focus:outline-none cursor-pointer"
          title="ঘণ্টা (Hour 01-12)"
        >
          {hoursList.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        {/* Minute (00 - 55) */}
        <select
          value={minutesList.includes(minute) ? minute : 'custom'}
          onChange={(e) => {
            if (e.target.value !== 'custom') {
              updateTime(hour12, e.target.value, ampm);
            }
          }}
          className="bg-stone-800 text-white font-mono text-xs p-1.5 rounded-md border border-stone-700 focus:border-emerald-500 focus:outline-none cursor-pointer"
          title="মিনিট (Minute)"
        >
          {minutesList.map((m) => (
            <option key={m} value={m}>
              :{m}
            </option>
          ))}
          {!minutesList.includes(minute) && (
            <option value="custom">:{minute}</option>
          )}
        </select>

        {/* AM / PM Toggle */}
        <div className="flex rounded-md overflow-hidden border border-stone-700">
          <button
            type="button"
            onClick={() => updateTime(hour12, minute, 'AM')}
            className={`flex-1 py-1 text-[11px] font-bold transition-colors ${
              ampm === 'AM'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => updateTime(hour12, minute, 'PM')}
            className={`flex-1 py-1 text-[11px] font-bold transition-colors ${
              ampm === 'PM'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};
