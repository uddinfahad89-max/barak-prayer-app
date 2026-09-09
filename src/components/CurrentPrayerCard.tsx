import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Moon, Sun, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { PrayerDisplayInfo, LocationMeta } from '../types';

interface CurrentPrayerCardProps {
  selectedLocation: LocationMeta;
  selectedDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDateChange: (d: Date) => void;
  prayers: PrayerDisplayInfo[];
  nextPrayer: PrayerDisplayInfo;
  currentPrayer: PrayerDisplayInfo | null;
  minutesToNext: number;
  use24Hour: boolean;
  hasUserOverride: boolean;
}

export const CurrentPrayerCard: React.FC<CurrentPrayerCardProps> = ({
  selectedLocation,
  selectedDate,
  onPrevDay,
  onNextDay,
  onDateChange,
  prayers,
  nextPrayer,
  currentPrayer,
  minutesToNext,
  use24Hour,
  hasUserOverride,
}) => {
  const sehriEnd = prayers.find((p) => p.key === 'sehri_end');
  const maghrib = prayers.find((p) => p.key === 'maghrib');

  // Calculate fasting duration
  let fastingDurationStr = '';
  if (sehriEnd && maghrib) {
    const fastingMinutes = (maghrib.adjustedMinutes - sehriEnd.adjustedMinutes + 1440) % 1440;
    const hours = Math.floor(fastingMinutes / 60);
    const mins = fastingMinutes % 60;
    fastingDurationStr = `${hours}h ${mins}m`;
  }

  // Next prayer hours and minutes breakdown
  const nextHours = Math.floor(minutesToNext / 60);
  const nextMins = minutesToNext % 60;

  // Date formatting
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dateInputValue = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

  const offsetLabel =
    selectedLocation.offset === 0
      ? 'Silchar Baseline (0 min)'
      : `${selectedLocation.offset > 0 ? `+${selectedLocation.offset}` : selectedLocation.offset} min offset from Silchar`;

  return (
    <div
      id="current-prayer-banner"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/60"
    >
      {/* Subtle decorative Islamic geometric motif */}
      <div className="absolute -right-12 -top-12 w-64 h-64 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-emerald-200">
          <polygon points="100,10 120,70 185,70 135,110 155,175 100,135 45,175 65,110 15,70 80,70" />
        </svg>
      </div>

      {/* Location and Date Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {selectedLocation.name}
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-800 text-amber-300 border border-emerald-700">
                {offsetLabel}
              </span>
            </h2>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            {selectedLocation.district ? `${selectedLocation.district} District, ` : ''}
            {selectedLocation.state} • {selectedLocation.description || 'Barak Valley Region'}
          </p>
        </div>

        {/* Date Selector with Previous/Next Arrows */}
        <div className="flex items-center gap-2 bg-emerald-950/80 p-1 rounded-xl border border-emerald-800/80">
          <button
            id="prev-day-btn"
            onClick={onPrevDay}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <input
              id="selected-date-picker"
              type="date"
              value={dateInputValue}
              onChange={(e) => {
                if (e.target.value) {
                  const parts = e.target.value.split('-');
                  const newD = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                  onDateChange(newD);
                }
              }}
              className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
            />
          </div>

          <button
            id="next-day-btn"
            onClick={onNextDay}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Status Grid: Next Prayer Countdown + Ramadan Fasting Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Left Column: Next Prayer Countdown */}
        <div className="lg:col-span-7 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Upcoming Next
            </span>
            {hasUserOverride && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-[11px] font-medium flex items-center gap-1 border border-emerald-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Prompt Timetable Matched
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              {nextPrayer.label}
            </h3>
            <span className="text-xl sm:text-2xl font-serif text-amber-300/90" dir="rtl">
              {nextPrayer.arabicName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                {nextPrayer.adjustedTime}
              </span>
              <span className="text-xs text-emerald-300">
                (Silchar base: {nextPrayer.baseTime})
              </span>
            </div>

            <div className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-xs font-mono text-emerald-200">
              In <span className="font-bold text-amber-300">{nextHours}h {nextMins}m</span>
            </div>
          </div>

          <p className="text-xs text-emerald-300/80 mt-1">
            {formattedDate}
          </p>
        </div>

        {/* Right Column: Ramadan / Fasting Spotlight (Sehri & Iftar) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 bg-emerald-950/60 p-4 rounded-xl border border-emerald-800/60 shadow-inner">
          {/* Sehri Ends */}
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-emerald-900/40 border border-emerald-700/30">
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span className="flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                Sehri Ends
              </span>
              <span className="text-[10px] text-amber-300 font-mono">Suhoor</span>
            </div>
            <span className="text-lg sm:text-xl font-bold font-mono text-white">
              {sehriEnd ? sehriEnd.adjustedTime : '--:--'}
            </span>
            <span className="text-[10px] text-emerald-400/80">
              Fast starts / Fajr begins
            </span>
          </div>

          {/* Iftar / Maghrib */}
          <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/30">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Iftar Time
              </span>
              <span className="text-[10px] text-amber-400 font-mono">Maghrib</span>
            </div>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-300">
              {maghrib ? maghrib.adjustedTime : '--:--'}
            </span>
            <span className="text-[10px] text-amber-300/80">
              Break fast / Sunset
            </span>
          </div>

          {/* Fasting Duration badge */}
          <div className="col-span-2 pt-1 flex items-center justify-between text-xs text-emerald-300/80 border-t border-emerald-800/40 mt-1">
            <span>Daily Fasting Duration:</span>
            <span className="font-mono font-bold text-white">{fastingDurationStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
