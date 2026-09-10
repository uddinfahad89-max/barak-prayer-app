import { useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_LOCATION_OFFSETS,
  DEFAULT_TIMETABLE,
  LOCATION_DETAILS,
} from './data/defaultData';
import { LocationOffsets, TimetableData, LocationMeta } from './types';
import {
  getBasePrayerTimesForDate,
  computeDayPrayerTimes,
  formatDateKey,
} from './utils/prayerCalc';
import { Header } from './components/Header';
import { CurrentPrayerCard } from './components/CurrentPrayerCard';
import { DailyPrayerGrid } from './components/DailyPrayerGrid';
import { LocationComparison } from './components/LocationComparison';
import { TimetableTable } from './components/TimetableTable';
import { FastingDuaCard } from './components/FastingDuaCard';
import { DataEditorModal } from './components/DataEditorModal';
import { CalendarPosterView } from './components/CalendarPosterView';
import { Clock, FileText, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

export default function App() {
  // State for user data
  const [locationOffsets, setLocationOffsets] = useState<LocationOffsets>(DEFAULT_LOCATION_OFFSETS);
  const [timetable, setTimetable] = useState<TimetableData>(DEFAULT_TIMETABLE);

  // UI state
  const [selectedLocationId, setSelectedLocationId] = useState<string>('silchar');
  const [customOffset, setCustomOffset] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [asrMethod, setAsrMethod] = useState<'hanafi' | 'shafii'>('hanafi');
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'poster' | 'all'>('daily');

  // Current live clock state
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format live time string
  const currentTimeStr = useMemo(() => {
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour,
    });
  }, [now, use24Hour]);

  // Current minutes from midnight
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes();

  // Construct location list
  const locations: LocationMeta[] = useMemo(() => {
    return (Object.entries(locationOffsets) as [string, number][]).map(([id, offset]) => {
      const details = LOCATION_DETAILS[id] || {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        district: '',
        state: 'Assam',
        description: `${offset >= 0 ? `+${offset}` : offset} min offset`,
      };
      return {
        ...details,
        offset,
      };
    });
  }, [locationOffsets]);

  // Selected location object
  const activeLocation: LocationMeta = useMemo(() => {
    if (selectedLocationId === 'custom') {
      return {
        id: 'custom',
        name: 'Custom Location',
        district: 'Barak Valley Region',
        state: 'Custom',
        offset: customOffset,
        description: `Manual adjustment of ${customOffset >= 0 ? `+${customOffset}` : customOffset} min from Silchar`,
        isCustom: true,
      };
    }
    const found = locations.find((l) => l.id === selectedLocationId);
    return (
      found || {
        id: 'silchar',
        name: 'Silchar',
        district: 'Cachar',
        state: 'Assam',
        offset: 0,
        description: 'Base Station (0 min)',
      }
    );
  }, [selectedLocationId, customOffset, locations]);

  // Base prayer times for the chosen date (before offset)
  const basePrayerTimes = useMemo(() => {
    return getBasePrayerTimesForDate(selectedDate, timetable, asrMethod);
  }, [selectedDate, timetable, asrMethod]);

  const dateKey = formatDateKey(selectedDate);
  const hasUserOverride = Boolean(timetable[dateKey]);

  // Computed prayer times for active location with offset applied
  const { prayers, nextPrayer, currentPrayer, minutesToNext } = useMemo(() => {
    return computeDayPrayerTimes(
      basePrayerTimes,
      activeLocation.offset,
      currentMinutesNow,
      use24Hour
    );
  }, [basePrayerTimes, activeLocation.offset, currentMinutesNow, use24Hour]);

  // Date step helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleSaveJson = (newOffsets: LocationOffsets, newTimetable: TimetableData) => {
    setLocationOffsets(newOffsets);
    setTimetable(newTimetable);
  };

  const handleResetJson = () => {
    setLocationOffsets(DEFAULT_LOCATION_OFFSETS);
    setTimetable(DEFAULT_TIMETABLE);
    setCustomOffset(0);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
        customOffset={customOffset}
        onCustomOffsetChange={setCustomOffset}
        currentTimeStr={currentTimeStr}
        use24Hour={use24Hour}
        onToggle24Hour={() => setUse24Hour(!use24Hour)}
        asrMethod={asrMethod}
        onToggleAsrMethod={() => setAsrMethod(asrMethod === 'hanafi' ? 'shafii' : 'hanafi')}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        hasUserOverrideForDate={hasUserOverride}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              id="view-tab-daily"
              onClick={() => setActiveTab('daily')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'daily'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Times &amp; Overview</span>
            </button>

            <button
              id="view-tab-poster"
              onClick={() => setActiveTab('poster')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'poster'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Authentic Printed Calendar Poster (দাইমী সময়সূচী)</span>
            </button>

            <button
              id="view-tab-all"
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Comprehensive View</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
            <span>Location:</span>
            <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
              {activeLocation.name} ({activeLocation.offset >= 0 ? `+${activeLocation.offset}` : activeLocation.offset} min)
            </span>
          </div>
        </div>

        {/* View Mode: Authentic Printed Calendar Poster */}
        {(activeTab === 'poster' || activeTab === 'all') && (
          <CalendarPosterView
            selectedLocation={activeLocation}
            use24Hour={use24Hour}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {/* View Mode: Daily Interactive Dashboard */}
        {(activeTab === 'daily' || activeTab === 'all') && (
          <>
            {/* Current Active Prayer Spotlight */}
            <CurrentPrayerCard
              selectedLocation={activeLocation}
              selectedDate={selectedDate}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onDateChange={setSelectedDate}
              prayers={prayers}
              nextPrayer={nextPrayer}
              currentPrayer={currentPrayer}
              minutesToNext={minutesToNext}
              use24Hour={use24Hour}
              hasUserOverride={hasUserOverride}
            />

            {/* 6 Prayer Cards for the Day */}
            <DailyPrayerGrid
              prayers={prayers}
              selectedLocation={activeLocation}
              use24Hour={use24Hour}
            />

            {/* Regional Location Comparison Matrix */}
            <LocationComparison
              locations={locations}
              basePrayerTimes={basePrayerTimes}
              selectedLocationId={selectedLocationId}
              onSelectLocation={setSelectedLocationId}
              use24Hour={use24Hour}
            />

            {/* Fasting & Iftar Duas */}
            <FastingDuaCard /> 
            
<div style={{ marginTop: '10px', textAlign: 'center' }}>
  <button 
    onClick={handleGetLocation}
    style={{ padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#0070f3', color: '#fff', border: 'none' }}
  >
    {loadingLocation ? 'লোকেশন খোঁজা হচ্ছে...' : '📍 বর্তমান লোকেশন দেখুন'}
  </button>

  {location && (
    <p style={{ marginTop: '8px', color: '#0070f3' }}>
      আপনার লোকেশন: {location}
    </p>
  )}
</div>

            {/* Timetable Calendar Table (with CSV & Print) */}
            <TimetableTable
              timetable={timetable}
              selectedLocation={activeLocation}
              use24Hour={use24Hour}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
              asrMethod={asrMethod}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-8 py-5 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Barak Valley Islamic Prayer &amp; Fasting Timetable • Cachar (ক্যাছাড়), Hailakandi (হাইলাকান্দি) &amp; Karimganj (করিমগঞ্জ)
          </span>
          <span className="text-stone-400">
            16 Synchronized Constituencies • Silchar (0 min Baseline)
          </span>
        </div>
      </footer>

      {/* Data Editor Modal */}
      <DataEditorModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        locationOffsets={locationOffsets}
        timetable={timetable}
        onSave={handleSaveJson}
        onReset={handleResetJson}
      />
    </div>
  );
}
