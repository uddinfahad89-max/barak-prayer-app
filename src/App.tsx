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
import { IndianTimePicker } from './components/IndianTimePicker';
import { playPrayerChime, playAzan, stopAzan, setAzanEndCallback } from './utils/audioAlert';
import { Clock, FileText, Calendar as CalendarIcon, Sparkles, Moon, ShieldCheck, Smartphone, Volume2, Square, Heart } from 'lucide-react';

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

  // জামাতের সময় আযান বাজানোর সেটিং ("জুদি কেহ চাই")
  const [playAzanOnJamaat, setPlayAzanOnJamaat] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('playAzanOnJamaat');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isAzanActive, setIsAzanActive] = useState<boolean>(false);
  const [activeJamaatAlert, setActiveJamaatAlert] = useState<{ prayer: string; time: string } | null>(null);

  const handleTogglePlayAzan = (enabled: boolean) => {
    setPlayAzanOnJamaat(enabled);
    try {
      localStorage.setItem('playAzanOnJamaat', String(enabled));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  };

  useEffect(() => {
    setAzanEndCallback(() => {
      setIsAzanActive(false);
      setActiveJamaatAlert(null);
    });
  }, []);

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

  // সময় চেক করে অ্যালার্ম/আজান দেওয়ার ইফেক্ট (ভারতীয় সময় IST)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // ভারতীয় সময় (Asia/Kolkata IST) HH:MM
      const currentTime = now.toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      Object.entries(jamaatTimes).forEach(([prayer, time]) => {
        if (time && time === currentTime) {
          const alertKey = `${prayer}_${currentTime}`;
          if (lastNotifiedMinuteRef.current !== alertKey) {
            lastNotifiedMinuteRef.current = alertKey;

            // ব্যবহারকারী যদি আযান চান ("জুদি কেহ চাই"), তবে আযান বাজবে, অন্যথায় শান্ত চাইম
            if (playAzanOnJamaat) {
              playAzan(1.0).then((success) => {
                if (success) {
                  setIsAzanActive(true);
                  setActiveJamaatAlert({ prayer, time: currentTime });
                }
              });
            } else {
              playPrayerChime();
            }

            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(`🕌 ${mosqueName || 'মসজিদ'} - জামাতের সময়!`, {
                body: `${prayer} নামাজের জামাতের সময় হয়ে গেছে।`,
                icon: '/icon.svg',
              });
            }
          }
        }
      });
    }, 30000); // প্রতি ৩০ সেকেন্ড পর পর চেক করবে

    return () => clearInterval(interval);
  }, [jamaatTimes, mosqueName, playAzanOnJamaat]);

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

  // Format live time string (ভারতীয় সময় IST)
  const currentTimeStr = useMemo(() => {
    return now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
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
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span>🕌 আপনার মসজিদের জামাত সেটিং</span>
                    {mosqueName && (
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        সক্রিয়: {mosqueName}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    ভারতীয় ১২-ঘণ্টা সময় (AM/PM) ফরম্যাটে প্রতিটি ওয়াক্তের জামাত সময় সেট করুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setJamaatTimes({
                      Fajr: '05:15',
                      Dhuhr: '13:15',
                      Asr: '16:15',
                      Maghrib: '17:35',
                      Isha: '20:00',
                    });
                  }}
                  className="px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/70 hover:bg-amber-900 border border-amber-800/80 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                  title="বরাক উপত্যকার আদর্শ ভারতীয় জামাতের সময়সূচী স্বয়ংক্রিয় পূরণ"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>আদর্শ ভারতীয় সময় পূরণ</span>
                </button>
              </div>
              
              <input 
                type="text" 
                placeholder="মসজিদের নাম লিখুন (যেমন: কোটামনি বাজার জামে মসজিদ)" 
                value={mosqueName} 
                onChange={(e) => setMosqueName(e.target.value)}
                className="p-2.5 rounded-lg bg-stone-700 w-full mb-3 text-white border border-stone-600 focus:border-emerald-500 focus:outline-none text-sm placeholder-stone-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-sm">
                {[
                  { key: 'Fajr', label: 'Fajr জামাত', nameBn: 'ফজর', defaultAmPm: 'AM' as const },
                  { key: 'Dhuhr', label: 'Dhuhr জামাত', nameBn: 'জোহর', defaultAmPm: 'PM' as const },
                  { key: 'Asr', label: 'Asr জামাত', nameBn: 'আসর', defaultAmPm: 'PM' as const },
                  { key: 'Maghrib', label: 'Maghrib জামাত', nameBn: 'মাগরিব', defaultAmPm: 'PM' as const },
                  { key: 'Isha', label: 'Isha জামাত', nameBn: 'এশা', defaultAmPm: 'PM' as const },
                ].map((item) => (
                  <IndianTimePicker
                    key={item.key}
                    label={item.label}
                    nameBn={item.nameBn}
                    value={jamaatTimes[item.key] || ''}
                    defaultAmPm={item.defaultAmPm}
                    onChange={(newVal) => setJamaatTimes((prev) => ({ ...prev, [item.key]: newVal }))}
                  />
                ))}
              </div>

              {/* আজান চালু/বন্ধ করার অপশন ও টেস্ট বাটন ("জুদি কেহ চাই") */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-stone-900/80 border border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={playAzanOnJamaat}
                    onChange={(e) => handleTogglePlayAzan(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-stone-800 border-stone-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>জামাতের সময়ে সুমধুর আযান দিন</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                          playAzanOnJamaat
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {playAzanOnJamaat ? 'আযান চালু' : 'আযান বন্ধ'}
                      </span>
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      ওয়াক্তের জামাত সময় উপস্থিত হলে পবিত্র মদিনা শরীফের আযান বাজবে (যদি চান চালু রাখুন)
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (isAzanActive) {
                        stopAzan();
                        setIsAzanActive(false);
                        setActiveJamaatAlert(null);
                      } else {
                        playAzan(1.0);
                        setIsAzanActive(true);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isAzanActive
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                        : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border-stone-600'
                    }`}
                  >
                    {isAzanActive ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>⏹ আযান বন্ধ করুন</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>▶ টেস্ট আযান শুনুন</span>
                      </>
                    )}
                  </button>
                </div>
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
      <footer id="app-footer" className="bg-white border-t border-stone-200 mt-8 py-6 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="font-semibold text-stone-800">
              বরাক উপত্যকা ইসলামিক নামাজ ও রোজার স্থায়ী সময়সূচি
            </p>
            <p className="text-stone-500">
              ক্যাছাড় (Cachar), হাইলাকান্দি (Hailakandi) ও করিমগঞ্জ (Karimganj) • ১৬টি নির্বাচনী এলাকা
            </p>
          </div>

          {/* Creator Attribution */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/70 border border-emerald-300/80 px-4 py-2 rounded-xl text-emerald-950 shadow-2xs">
              <span className="text-stone-600 font-medium">অ্যাপটি তৈরি করেছেন:</span>
              <span className="font-bold text-emerald-900 tracking-wide flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                <span>Fahad Uddin (ফাহাদ উদ্দিন)</span>
              </span>
            </div>
          </div>
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
        playAzanOnJamaat={playAzanOnJamaat}
        onTogglePlayAzan={handleTogglePlayAzan}
      />

      {/* Install & Security Help Modal */}
      <InstallHelpModal
        isOpen={isInstallHelpOpen}
        onClose={() => setIsInstallHelpOpen(false)}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={!!deferredPrompt}
      />

      {/* Floating Active Azan / Jamaat Alert Banner */}
      {activeJamaatAlert && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:w-96 z-50 bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-emerald-500 shadow-2xl shadow-emerald-950/50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                🕌 {mosqueName ? `${mosqueName} - ` : ''}{activeJamaatAlert.prayer} জামাতের সময়!
              </h4>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>সুমধুর আযান চলছে...</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAzan();
              setIsAzanActive(false);
              setActiveJamaatAlert(null);
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>থামান</span>
          </button>
        </div>
      )}
    </div>
  );
}
