import React from 'react';
import { Sunrise, Sunset, Sun, Moon, Sparkles, Check, Clock, Building2 } from 'lucide-react';
import { PrayerDisplayInfo, LocationMeta, JamaatTimes } from '../types';

interface DailyPrayerGridProps {
  prayers: PrayerDisplayInfo[];
  selectedLocation: LocationMeta;
  use24Hour: boolean;
  jamaatTimes?: JamaatTimes;
  mosqueName?: string;
  onOpenMosqueSettings?: () => void;
}

export const DailyPrayerGrid: React.FC<DailyPrayerGridProps> = ({
  prayers,
  selectedLocation,
  use24Hour,
  jamaatTimes,
  mosqueName,
  onOpenMosqueSettings,
}) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'sehri_end':
        return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'sunrise':
        return <Sunrise className="w-5 h-5 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'asr':
        return <Sun className="w-5 h-5 text-orange-400" />;
      case 'maghrib':
        return <Sunset className="w-5 h-5 text-rose-400" />;
      case 'isha':
        return <Moon className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-emerald-400" />;
    }
  };

  const offsetMinutes = selectedLocation.offset;
  const offsetString =
    offsetMinutes === 0
      ? '0m'
      : offsetMinutes > 0
      ? `+${offsetMinutes}m`
      : `${offsetMinutes}m`;

  const getJamaatTime = (key: string) => {
    if (!jamaatTimes) return '';
    if (key === 'sehri_end') return jamaatTimes.Fajr;
    if (key === 'dhuhr') return jamaatTimes.Dhuhr;
    if (key === 'asr') return jamaatTimes.Asr;
    if (key === 'maghrib') return jamaatTimes.Maghrib;
    if (key === 'isha') return jamaatTimes.Isha;
    return '';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>Today's Prayer &amp; Fasting Schedule</span>
            {mosqueName && (
              <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                🕌 {mosqueName}
              </span>
            )}
          </h3>
          <p className="text-xs text-stone-500">
            Calculated for <span className="font-semibold text-stone-700">{selectedLocation.name}</span> with {offsetMinutes === 0 ? 'base Silchar timing' : `${offsetString} offset from Silchar base`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {onOpenMosqueSettings && (
            <button
              onClick={onOpenMosqueSettings}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{mosqueName ? 'জামাতের সময় আপডেট' : 'জামাতের সময় সেট করুন'}</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200"></span>
              Next
            </span>
            <span className="flex items-center gap-1 ml-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Current
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Prayer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {prayers.map((prayer) => {
          const isNext = prayer.isNext;
          const isCurrent = prayer.isCurrent;
          const isFasting = prayer.isSpecialFasting;
          const jamaatTime = getJamaatTime(prayer.key);

          return (
            <div
              key={prayer.key}
              id={`prayer-card-${prayer.key}`}
              className={`relative flex flex-col justify-between p-4 rounded-xl transition-all duration-200 ${
                isNext
                  ? 'bg-amber-50/80 border-2 border-amber-500 shadow-md ring-2 ring-amber-300/30'
                  : isCurrent
                  ? 'bg-emerald-50/70 border border-emerald-500 shadow-sm'
                  : isFasting
                  ? 'bg-stone-50/90 border border-stone-200/90 hover:border-emerald-300 hover:shadow-sm'
                  : 'bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              {/* Badge for Next or Fasting */}
              {isNext && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  Next
                </div>
              )}
              {isCurrent && !isNext && (
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-medium tracking-wider flex items-center gap-1 shadow-sm">
                  <Check className="w-2.5 h-2.5" />
                  Current
                </div>
              )}

              {/* Card Header: Icon + Name */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-stone-100/90">
                    {getIcon(prayer.key)}
                  </div>
                  <span className="text-sm font-serif text-stone-400 font-medium" dir="rtl">
                    {prayer.arabicName}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-stone-800">
                  {prayer.label}
                </h4>

                {prayer.key === 'sehri_end' && (
                  <span className="inline-block mt-0.5 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                    Fajr Start / Suhoor Ends
                  </span>
                )}
                {prayer.key === 'maghrib' && (
                  <span className="inline-block mt-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    Iftar / Fast Breaking
                  </span>
                )}
                {prayer.key === 'sunrise' && (
                  <span className="inline-block mt-0.5 text-[10px] text-stone-500">
                    Prohibited prayer window
                  </span>
                )}
                {prayer.key === 'dhuhr' && (
                  <span className="inline-block mt-0.5 text-[10px] text-stone-500">
                    Post-Zawal Midday
                  </span>
                )}
                {prayer.key === 'asr' && (
                  <span className="inline-block mt-0.5 text-[10px] text-stone-500">
                    Shadow length prayer
                  </span>
                )}
                {prayer.key === 'isha' && (
                  <span className="inline-block mt-0.5 text-[10px] text-stone-500">
                    Nighttime prayer
                  </span>
                )}
              </div>

              {/* Card Footer: Adjusted Time + Base Time Comparison */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${
                      isNext ? 'text-amber-700' : 'text-stone-900'
                    }`}
                  >
                    {prayer.adjustedTime}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                  <span>Base (Silchar):</span>
                  <span className="font-mono text-stone-700">{prayer.baseTime}</span>
                </div>

                {offsetMinutes !== 0 && (
                  <div className="flex items-center justify-between text-[10px] text-amber-700 mt-0.5 font-medium">
                    <span>Applied offset:</span>
                    <span>{offsetString}</span>
                  </div>
                )}

                {jamaatTime && (
                  <div className="mt-2.5 pt-1.5 border-t border-emerald-200/80 flex items-center justify-between text-[11px] bg-emerald-100/70 -mx-1 px-2 py-0.5 rounded text-emerald-950 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-700" />
                      <span>জামাত:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-900">{jamaatTime}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
