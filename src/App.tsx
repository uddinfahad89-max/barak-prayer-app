import { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_LOCATION_OFFSETS,
  DEFAULT_TIMETABLE,
  LOCATION_DETAILS,
} from './data/defaultData';
import { LocationOffsets, TimetableData, LocationMeta, JamaatTimes } from './types';
import {
  getBasePrayerTimesForDate,
  computeDayPrayerTimes,
  formatDateKey,
} from './utils/prayerCalc';
import {
  findClosestConstituency,
  matchConstituencyByAddressText,
} from './utils/geoDetect';
import { playPrayerChime } from './utils/audioAlert';
import { Header } from './components/Header';
import { CurrentPrayerCard } from './components/CurrentPrayerCard';
import { DailyPrayerGrid } from './components/DailyPrayerGrid';
import { LocationComparison } from './components/LocationComparison';
import { TimetableTable } from './components/TimetableTable';
import { FastingDuaCard } from './components/FastingDuaCard';
import { DataEditorModal } from './components/DataEditorModal';
import { CalendarPosterView } from './components/CalendarPosterView';
import { MosqueSettingsModal } from './components/MosqueSettingsModal';
import { ArabicCalendarView } from './components/ArabicCalendarView';
import { InstallHelpModal } from './components/InstallHelpModal';
import { Clock, FileText, Calendar as CalendarIcon, Sparkles, Moon, ShieldCheck, Smartphone } from 'lucide-react';

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
  const [isMosqueModalOpen, setIsMosqueModalOpen] = useState<boolean>(false);
  const [isInstallHelpOpen, setIsInstallHelpOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'arabic' | 'poster' | 'all'>('daily');

  // PWA Install prompt listener
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // হিজরি / আরবী ক্যালেন্ডার চাঁদ দেখার সামঞ্জস্য
  const [hijriAdjustment, setHijriAdjustment] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('hijriAdjustment');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const handleHijriAdjustmentChange = (adj: number) => {
    setHijriAdjustment(adj);
    try {
      localStorage.setItem('hijriAdjustment', adj.toString());
    } catch {
      // ignore
    }
  };

  // ইউজারের শহরের নাম ও GPS স্টোর করার জন্য স্টেট
  const [userCity, setUserCity] = useState<string>('');
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationStatusMsg, setLocationStatusMsg] = useState<string>('');

  // মসজিদের তথ্য ও অ্যালার্মের স্টেট
  const [mosqueName, setMosqueName] = useState<string>(() => {
    try {
      return localStorage.getItem('mosqueName') || '';
    } catch {
      return '';
    }
  });

  const [jamaatTimes, setJamaatTimes] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('jamaatTimes');
      return saved ? JSON.parse(saved) : { Fajr: '', Dhuhr: '', Asr: '', Maghrib: '', Isha: '' };
    } catch {
      return { Fajr: '', Dhuhr: '', Asr: '', Maghrib: '', Isha: '' };
    }
  });

  const lastNotifiedMinuteRef = useRef<string>('');

  // তথ্য সেভ করার ফাংশন
  const saveMosqueSettings = (name: string, times: any) => {
    setMosqueName(name);
    setJamaatTimes(times);
    try {
      localStorage.setItem('mosqueName', name);
      localStorage.setItem('jamaatTimes', JSON.stringify(times));
    } catch (err) {
      console.warn('Storage save warning:', err);
    }

    try {
      alert('মসজিদ ও জামাতের সময় সফলভাবে সেভ হয়েছে!');
    } catch {
      // In case alert is restricted in iframe sandbox
    }

    // নোটিফিকেশনের পারমিশন নেওয়া
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  // সময় চেক করে অ্যালার্ম/নোটিফিকেশন দেওয়ার ইফেক্ট
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM ফরম্যাট

      Object.entries(jamaatTimes).forEach(([prayer, time]) => {
        if (time && time === currentTime) {
          const alertKey = `${prayer}_${currentTime}`;
          if (lastNotifiedMinuteRef.current !== alertKey) {
            lastNotifiedMinuteRef.current = alertKey;
            playPrayerChime();
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(`🕌 ${mosqueName || 'মসজিদ'} - জামাতের সময়!`, {
                body: `${prayer} নামাজের জামাতের সময় হয়ে গেছে।`,
                icon: '/icon.png',
              });
            }
          }
        }
      });
    }, 30000); // প্রতি ৩০ সেকেন্ড পর পর চেক করবে

    return () => clearInterval(interval);
  }, [jamaatTimes, mosqueName]);

  // আইপি ভিত্তিক ফলব্যাক লোকেশন ফাংশন
  const tryIpFallback = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.region || 'আপনার অঞ্চল';
        setUserCity(city);
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          const { constituency, distanceKm } = findClosestConstituency(data.latitude, data.longitude);
          if (distanceKm <= 80) {
            setSelectedLocationId(constituency.id);
            setLocationStatusMsg(`আইপি দ্বারা সনাক্তকৃত: ${city} (${constituency.nameBn} বিধানসভা)`);
            return;
          }
        }
        setLocationStatusMsg(`আইপি দ্বারা সনাক্তকৃত: ${city} (শিলচর বেস সময়)`);
        return;
      }
    } catch {
      // Network or CORS issue, handled gracefully
    }
    setLocationStatusMsg('লোকেশন পাওয়া যায়নি। তালিকা থেকে আপনার বিধানসভা বেছে নিন।');
  };

  // কারেন্ট লোকেশনের নাম বের করার ফাংশন
  const detectUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsDetectingLocation(true);
      setLocationStatusMsg('জিপিএস লোকেশন সনাক্ত করা হচ্ছে...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            if (res.ok) {
              const data = await res.json();
              const address = data.address || {};
              const city =
                address.city ||
                address.town ||
                address.village ||
                address.suburb ||
                address.county ||
                address.state_district ||
                'আপনার স্থান';
              setUserCity(city);

              // Find matching or closest constituency in Barak Valley
              const textMatch = matchConstituencyByAddressText(address);
              if (textMatch) {
                setSelectedLocationId(textMatch.id);
                setLocationStatusMsg(`শনাক্তকৃত: ${city} (${textMatch.nameBn} বিধানসভা নির্বাচন করা হয়েছে)`);
                return;
              }
            }

            // Fallback to coordinate math
            const { constituency, distanceKm } = findClosestConstituency(latitude, longitude);
            setUserCity(constituency.nameBn);
            if (distanceKm <= 60) {
              setSelectedLocationId(constituency.id);
              setLocationStatusMsg(
                `সনাক্তকৃত নিকটবর্তী বিধানসভা: ${constituency.nameBn} (দূরত্ব ~${distanceKm} কিমি)`
              );
            } else {
              setLocationStatusMsg(`সনাক্তকৃত স্থান (শিলচর বেস অথবা কাস্টম অফসেট প্রযোজ্য)`);
            }
          } catch {
            // Reverse geocode failed, directly use coordinates
            const { constituency } = findClosestConstituency(latitude, longitude);
            setUserCity(constituency.nameBn);
            setSelectedLocationId(constituency.id);
            setLocationStatusMsg(`শনাক্তকৃত বিধানসভা: ${constituency.nameBn}`);
          } finally {
            setIsDetectingLocation(false);
          }
        },
        async (error) => {
          setIsDetectingLocation(false);
          // Handle GPS denial or unavailability gracefully without throwing console.error
          if (error && error.code === 1) {
            // PERMISSION_DENIED
            setLocationStatusMsg('লোকেশন পারমিশন মেলেনি। তালিকা থেকে আপনার বিধানসভা নির্বাচন করুন।');
          } else {
            // POSITION_UNAVAILABLE or TIMEOUT - try IP fallback
            await tryIpFallback();
          }
        },
        { timeout: 8000, enableHighAccuracy: false, maximumAge: 300000 }
      );
    } else {
      setIsDetectingLocation(false);
      tryIpFallback();
    }
  };

  const handleClearDetectedLocation = () => {
    setUserCity('');
    setLocationStatusMsg('');
  };

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
        userCity={userCity}
        isDetectingLocation={isDetectingLocation}
        locationStatusMsg={locationStatusMsg}
        onDetectLocation={detectUserLocation}
        onClearDetectedLocation={handleClearDetectedLocation}
        mosqueName={mosqueName}
        onOpenMosqueSettings={() => setIsMosqueModalOpen(true)}
        hijriAdjustment={hijriAdjustment}
        onOpenArabicCalendar={() => setActiveTab('arabic')}
        onOpenInstallHelp={() => setIsInstallHelpOpen(true)}
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
              id="view-tab-arabic"
              onClick={() => setActiveTab('arabic')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'arabic'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>Arabic Calendar (আরবী ক্যালেন্ডার)</span>
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

          <div className="flex items-center gap-2">
            <button
              id="install-guide-tab-btn"
              onClick={() => setIsInstallHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
              title="ফোনে নিরাপদ ডাউনলোড ও ইনস্টল সহায়িকা"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ইনস্টল ও নিরাপত্তা</span>
            </button>

            <div className="text-xs text-stone-500 hidden sm:flex items-center gap-2">
              <span>Location:</span>
              <span className="font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                {activeLocation.name} ({activeLocation.offset >= 0 ? `+${activeLocation.offset}` : activeLocation.offset} min)
              </span>
            </div>
          </div>
        </div>

        {/* View Mode: Arabic / Hijri Calendar */}
        {(activeTab === 'arabic' || activeTab === 'all') && (
          <ArabicCalendarView
            selectedDate={selectedDate}
            onSelectDate={(newDate) => {
              setSelectedDate(newDate);
            }}
            hijriAdjustment={hijriAdjustment}
            onAdjustmentChange={handleHijriAdjustmentChange}
          />
        )}

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
              userCity={userCity}
              mosqueName={mosqueName}
              hijriAdjustment={hijriAdjustment}
              onOpenArabicCalendar={() => setActiveTab('arabic')}
            />

            {/* 6 Prayer Cards for the Day */}
            <DailyPrayerGrid
              prayers={prayers}
              selectedLocation={activeLocation}
              use24Hour={use24Hour}
              jamaatTimes={jamaatTimes}
              mosqueName={mosqueName}
              onOpenMosqueSettings={() => setIsMosqueModalOpen(true)}
            />

            {/* আমার মসজিদ সেটিং করার ফর্ম/বাটন */}
            <div className="mt-4 p-5 bg-stone-800 rounded-xl text-white border border-stone-700 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>🕌 আপনার মসজিদের জামাত সেটিং</span>
                  {mosqueName && (
                    <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      সক্রিয়: {mosqueName}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-400">প্রতিটি ওয়াক্তের জামাত সময় সেট করে রাখুন</p>
              </div>
              
              <input 
                type="text" 
                placeholder="মসজিদের নাম লিখুন" 
                value={mosqueName} 
                onChange={(e) => setMosqueName(e.target.value)}
                className="p-2.5 rounded-lg bg-stone-700 w-full mb-3 text-white border border-stone-600 focus:border-emerald-500 focus:outline-none text-sm placeholder-stone-400"
              />

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                  <div key={prayer} className="flex flex-col bg-stone-900/50 p-2.5 rounded-lg border border-stone-700/80">
                    <label className="text-xs font-semibold text-stone-300 mb-1">{prayer} জামাত:</label>
                    <input 
                      type="time" 
                      value={jamaatTimes[prayer] || ''} 
                      onChange={(e) => setJamaatTimes({...jamaatTimes, [prayer]: e.target.value})}
                      className="p-1.5 rounded bg-stone-700 text-white font-mono text-sm border border-stone-600 focus:border-emerald-500 focus:outline-none w-full"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={() => saveMosqueSettings(mosqueName, jamaatTimes)}
                className="mt-4 bg-emerald-600 px-4 py-2.5 rounded-lg text-white font-semibold hover:bg-emerald-500 transition-colors w-full cursor-pointer shadow-sm text-sm flex items-center justify-center gap-2"
              >
                <span>💾 সেভ করুন ও অ্যালার্ম চালু করুন</span>
              </button>
            </div>

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

      {/* Mosque & Jamaat Settings Modal */}
      <MosqueSettingsModal
        isOpen={isMosqueModalOpen}
        onClose={() => setIsMosqueModalOpen(false)}
        mosqueName={mosqueName}
        jamaatTimes={jamaatTimes}
        onSave={saveMosqueSettings}
        currentPrayers={prayers}
      />

      {/* Install & Security Help Modal */}
      <InstallHelpModal
        isOpen={isInstallHelpOpen}
        onClose={() => setIsInstallHelpOpen(false)}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={!!deferredPrompt}
      />
    </div>
  );
}
