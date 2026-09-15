import React, { useState } from 'react';
import { MapPin, ArrowRightLeft, Building2 } from 'lucide-react';
import { LocationMeta, PrayerTimetableItem } from '../types';
import { applyOffset } from '../utils/prayerCalc';

interface LocationComparisonProps {
  locations: LocationMeta[];
  basePrayerTimes: PrayerTimetableItem;
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  use24Hour: boolean;
}

export const LocationComparison: React.FC<LocationComparisonProps> = ({
  locations,
  basePrayerTimes,
  selectedLocationId,
  onSelectLocation,
  use24Hour,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredLocations = locations.filter((loc) => {
    if (selectedDistrict === 'all') return true;
    return loc.district?.toLowerCase() === selectedDistrict?.toLowerCase();
  });

  // Group by district
  const districts = ['Cachar', 'Hailakandi', 'Karimganj'];

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-700" />
            <span>Regional Constituencies Comparison Matrix</span>
          </h3>
          <p className="text-xs text-stone-500">
            Compare synchronized prayer and fasting times across all 16 Barak Valley constituencies (Cachar, Hailakandi &amp; Karimganj)
          </p>
        </div>

        {/* District Filter Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedDistrict('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDistrict === 'all'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            All ({locations.length})
          </button>
          <button
            onClick={() => setSelectedDistrict('Cachar')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDistrict === 'Cachar'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            Cachar (ক্যাছাড়)
          </button>
          <button
            onClick={() => setSelectedDistrict('Hailakandi')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDistrict === 'Hailakandi'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            Hailakandi (হাইলাকান্দি)
          </button>
          <button
            onClick={() => setSelectedDistrict('Karimganj')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDistrict === 'Karimganj'
                ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
            }`}
          >
            Karimganj (করিমগঞ্জ)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 bg-stone-50/70 font-medium">
              <th className="py-2.5 px-3 rounded-l-lg">Constituency / বিধানসভা</th>
              <th className="py-2.5 px-3">District / জেলা</th>
              <th className="py-2.5 px-2 text-center">Offset</th>
              <th className="py-2.5 px-3 font-semibold text-indigo-900">Sehri Ends (Fajr)</th>
              <th className="py-2.5 px-3">Sunrise</th>
              <th className="py-2.5 px-3">Dhuhr</th>
              <th className="py-2.5 px-3">Asr</th>
              <th className="py-2.5 px-3 font-semibold text-rose-900">Maghrib (Iftar)</th>
              <th className="py-2.5 px-3 rounded-r-lg">Isha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredLocations.map((loc) => {
              const isCurrent = loc.id === selectedLocationId;
              const offset = loc.offset;

              const sehriRes = applyOffset(basePrayerTimes.sehri_end, 'sehri_end', offset);
              const sunriseRes = applyOffset(basePrayerTimes.sunrise, 'sunrise', offset);
              const dhuhrRes = applyOffset(basePrayerTimes.dhuhr, 'dhuhr', offset);
              const asrRes = applyOffset(basePrayerTimes.asr, 'asr', offset);
              const maghribRes = applyOffset(basePrayerTimes.maghrib, 'maghrib', offset);
              const ishaRes = applyOffset(basePrayerTimes.isha, 'isha', offset);

              const fmt = (res: { time12: string; time24: string }) => (use24Hour ? res.time24 : res.time12);

              return (
                <tr
                  key={loc.id}
                  onClick={() => onSelectLocation(loc.id)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-amber-50/90 font-medium ring-1 ring-amber-300'
                      : 'hover:bg-stone-50/80'
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-600' : 'text-stone-400'}`} />
                      <span className={`font-semibold ${isCurrent ? 'text-amber-950' : 'text-stone-800'}`}>
                        {loc.name}
                      </span>
                      {loc.nameBn && (
                        <span className="text-stone-500 font-serif text-[11px]">
                          ({loc.nameBn})
                        </span>
                      )}
                      {loc.id === 'silchar' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                          Base 0m
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-stone-600">
                    <span className="inline-flex items-center gap-1">
                      <span>{loc.district}</span>
                      {loc.districtBn && <span className="text-stone-400">({loc.districtBn})</span>}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        offset === 0
                          ? 'bg-stone-100 text-stone-700'
                          : offset > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {offset === 0 ? '0 min' : offset > 0 ? `+${offset} min` : `${offset} min`}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-indigo-950 font-bold">{fmt(sehriRes)}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(sunriseRes)}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(dhuhrRes)}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(asrRes)}</td>
                  <td className="py-2.5 px-3 font-mono text-rose-950 font-bold">{fmt(maghribRes)}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">{fmt(ishaRes)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
