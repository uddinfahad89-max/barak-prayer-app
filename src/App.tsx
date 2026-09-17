import { useState, useEffect, useMemo, useRef } from 'react';
import {
  DEFAULT_LOCATION_OFFSETS,
  DEFAULT_TIMETABLE,
  LOCATION_DETAILS,
} from './data/defaultData';
import { LocationOffsets, TimetableData, LocationMeta, JamaatTimes, AppLanguage } from './types';
import { ALL_INDIA_LOCATIONS } from './data/allIndiaLocations';
import {
  getBasePrayerTimesForDate,
  calculateGooglePrayerTimesForLocation,
  computeDayPrayerTimes,
  formatDateKey,
} from './utils/prayerCalc';
import {
  findClosestConstituency,
  matchConstituencyByAddressText,
  reverseGeocodeCity,
  isWithinBarakValley,
} from './utils/geoDetect';
import { calculateHijriFromDate } from './utils/hijriCalendar';
import { MuslimAppView } from './components/MuslimAppView';
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
import { LocationPickerModal } from './components/LocationPickerModal';
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
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);
  const [detectedCustomLocation, setDetectedCustomLocation] = useState<LocationMeta | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [asrMethod, setAsrMethod] = useState<'hanafi' | 'shafii'>('hanafi');
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isMosqueModalOpen, setIsMosqueModalOpen] = useState<boolean>(false);
  const [isInstallHelpOpen, setIsInstallHelpOpen] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'daily' | 'arabic' | 'poster' | 'all'>('daily');
  const [mainNavTab, setMainNavTab] = useState<'home' | 'prayers' | 'quran' | 'ummah' | 'matrimony'>('home');
  const [appLang, setAppLang] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_lang');
      if (saved === 'ur' || saved === 'en' || saved === 'bn') return saved as AppLanguage;
    } catch {
      // ignore
    }
    return 'en';
  });

  const lang = appLang;

  const handleSelectLang = (newLang: AppLanguage) => {
    setAppLang(newLang);
    try {
      localStorage.setItem('muslim_app_lang', newLang);
    } catch {
      // ignore
    }
  };

  const [userCoords, setUserCoords] = useState<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });

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
      let data: any = null;
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) data = await res.json();
      } catch {
        // try alternative IP service
      }

      if (!data) {
        try {
          const res = await fetch('https://ipwho.is/');
          if (res.ok) {
            const raw = await res.json();
            if (raw.success !== false) {
              data = {
                city: raw.city,
                region: raw.region,
                latitude: raw.latitude,
                longitude: raw.longitude,
              };
            }
          }
        } catch {
          // fallback
        }
      }

      if (data) {
        const city = data.city || data.region || (lang === 'bn' ? 'আপনার অঞ্চল' : lang === 'ur' ? 'آپ کا علاقہ' : 'Your Region');
        setUserCity(city);
        if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          const ipAddressObj = { city: data.city || '', region: data.region || '' };
          if (isWithinBarakValley(data.latitude, data.longitude, ipAddressObj)) {
            const { constituency } = findClosestConstituency(data.latitude, data.longitude);
            setSelectedLocationId(constituency.id);
            const constName = lang === 'en' ? constituency.name : constituency.nameBn;
            setLocationStatusMsg(
              lang === 'en'
                ? `Detected via IP: ${city} (${constName} • Barak Valley)`
                : lang === 'ur'
                ? `آئی پی سے شناخت: ${city} (${constituency.name} • براک وادی)`
                : `আইপি দ্বারা সনাক্তকৃত: ${city} (${constName} বিধানসভা • বরাক উপত্যকা)`
            );
            return;
          } else {
            // Outside Barak Valley -> All India city
            const matchIndia = ALL_INDIA_LOCATIONS.find(
              (loc) =>
                loc.name.toLowerCase() === city.toLowerCase() ||
                (loc.district && loc.district.toLowerCase() === city.toLowerCase())
            );
            if (matchIndia) {
              setSelectedLocationId(matchIndia.id);
              setLocationStatusMsg(
                lang === 'en'
                  ? `Detected via IP: ${matchIndia.name} (Google Method)`
                  : lang === 'ur'
                  ? `آئی پی سے شناخت: ${matchIndia.name} (گوگل طریقہ)`
                  : `আইপি দ্বারা সনাক্তকৃত: ${matchIndia.name} (গুগল পদ্ধতি)`
              );
              return;
            } else {
              const customLoc: LocationMeta = {
                id: 'gps_detected',
                name: city,
                district: data.region || '',
                state: data.region || 'India',
                offset: 0,
                lat: data.latitude,
                lon: data.longitude,
                isBarakValley: false,
                description: `${city} (Google Method)`,
              };
              setDetectedCustomLocation(customLoc);
              setSelectedLocationId('gps_detected');
              setLocationStatusMsg(
                lang === 'en'
                  ? `Detected via IP: ${city} (Google Method)`
                  : lang === 'ur'
                  ? `آئی پی سے شناخت: ${city} (گوگل طریقہ)`
                  : `আইপি দ্বারা সনাক্তকৃত: ${city} (গুগল পদ্ধতি)`
              );
              return;
            }
          }
        }
        setLocationStatusMsg(
          lang === 'en' ? `Detected via IP: ${city}` : lang === 'ur' ? `آئی پی سے شناخت: ${city}` : `আইপি দ্বারা সনাক্তকৃত: ${city}`
        );
        return;
      }
    } catch {
      // Network or CORS issue, handled gracefully
    }
    setLocationStatusMsg(
      lang === 'en'
        ? 'Location not found. Please choose your location from the list.'
        : lang === 'ur'
        ? 'مقام نہیں ملا۔ برائے مہربانی فہرست سے انتخاب کریں۔'
        : 'লোকেশন পাওয়া যায়নি। তালিকা থেকে আপনার স্থান বেছে নিন।'
    );
  };

  // কারেন্ট লোকেশনের নাম বের করার ফাংশন
  const detectUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsDetectingLocation(true);
      setLocationStatusMsg(
        lang === 'en'
          ? 'Acquiring GPS location (high accuracy)...'
          : lang === 'ur'
          ? 'جی پی ایس مقام حاصل کیا جا رہا ہے...'
          : 'জিপিএস লোকেশন সনাক্ত করা হচ্ছে...'
      );

      const handleCoordsSuccess = async (position: GeolocationPosition) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        try {
          const { city, addressObj } = await reverseGeocodeCity(latitude, longitude);
          if (city) {
            setUserCity(city);
          }

          if (isWithinBarakValley(latitude, longitude, addressObj)) {
            if (addressObj) {
              const textMatch = matchConstituencyByAddressText(addressObj);
              if (textMatch) {
                setSelectedLocationId(textMatch.id);
                const constName = lang === 'en' ? textMatch.name : textMatch.nameBn;
                setLocationStatusMsg(
                  lang === 'en'
                    ? `Detected: ${city || constName} (${constName} • Authentic Time)`
                    : lang === 'ur'
                    ? `شناخت شدہ: ${city || constName} (${textMatch.name} • اصل وقت)`
                    : `শনাক্তকৃত: ${city} (${constName} বিধানসভা • আসল সময়)`
                );
                return;
              }
            }

            // Fallback to closest Barak Valley constituency
            const { constituency, distanceKm } = findClosestConstituency(latitude, longitude);
            setSelectedLocationId(constituency.id);
            const constName = lang === 'en' ? constituency.name : constituency.nameBn;
            setLocationStatusMsg(
              lang === 'en'
                ? `Nearest detected: ${city || constName} (~${distanceKm} km • Barak Valley)`
                : lang === 'ur'
                ? `قریبی مقام: ${city || constName} (~${distanceKm} کلومیٹر • براک وادی)`
                : `শনাক্তকৃত নিকটবর্তী: ${city || constName} (~${distanceKm} কিমি • বরাক উপত্যকা)`
            );
          } else {
            // Outside Barak Valley - All India Google calculation
            const cityName = city || (lang === 'en' ? 'India Location' : 'ভারতের অবস্থান');
            const matchIndia = ALL_INDIA_LOCATIONS.find(
              (loc) => loc.name.toLowerCase() === cityName.toLowerCase()
            );
            if (matchIndia) {
              setSelectedLocationId(matchIndia.id);
              setLocationStatusMsg(
                lang === 'en'
                  ? `Detected via GPS: ${matchIndia.name} (Google Method)`
                  : lang === 'ur'
                  ? `جی پی ایس سے شناخت: ${matchIndia.name} (گوگل طریقہ)`
                  : `জিপিএস দ্বারা সনাক্তকৃত: ${matchIndia.name} (গুগল পদ্ধতি)`
              );
            } else {
              const customGpsLoc: LocationMeta = {
                id: 'gps_detected',
                name: cityName,
                district: addressObj?.state_district || addressObj?.county || '',
                state: addressObj?.state || 'India',
                offset: 0,
                lat: latitude,
                lon: longitude,
                isBarakValley: false,
                description: `${cityName} (Google Method)`,
              };
              setDetectedCustomLocation(customGpsLoc);
              setSelectedLocationId('gps_detected');
              setLocationStatusMsg(
                lang === 'en'
                  ? `Detected via GPS: ${cityName} (Google Method)`
                  : lang === 'ur'
                  ? `جی پی ایس سے شناخت: ${cityName} (گوگل طریقہ)`
                  : `জিপিএস দ্বারা সনাক্তকৃত: ${cityName} (গুগল পদ্ধতি)`
              );
            }
          }
        } catch {
          if (isWithinBarakValley(latitude, longitude)) {
            const { constituency } = findClosestConstituency(latitude, longitude);
            const constName = lang === 'en' ? constituency.name : constituency.nameBn;
            setUserCity(constName);
            setSelectedLocationId(constituency.id);
            setLocationStatusMsg(
              lang === 'en'
                ? `Detected Constituency: ${constName} (Barak Valley)`
                : lang === 'ur'
                ? `شناخت شدہ حلقہ: ${constituency.name} (براک وادی)`
                : `শনাক্তকৃত বিধানসভা: ${constituency.nameBn} (বরাক উপত্যকা)`
            );
          } else {
            const customGpsLoc: LocationMeta = {
              id: 'gps_detected',
              name: lang === 'en' ? 'Current Location' : 'বর্তমান অবস্থান',
              district: '',
              state: 'India',
              offset: 0,
              lat: latitude,
              lon: longitude,
              isBarakValley: false,
              description: lang === 'en' ? 'Current Location (Google Method)' : 'বর্তমান অবস্থান (গুগল পদ্ধতি)',
            };
            setDetectedCustomLocation(customGpsLoc);
            setSelectedLocationId('gps_detected');
            setLocationStatusMsg(
              lang === 'en'
                ? 'Applied Google calculation via GPS coordinates'
                : lang === 'ur'
                ? 'جی پی ایس سے گوگل طریقہ لاگو کیا گیا'
                : 'জিপিএস স্থানাঙ্ক দ্বারা গুগল পদ্ধতি প্রয়োগ করা হয়েছে'
            );
          }
        } finally {
          setIsDetectingLocation(false);
        }
      };

      // Try High Accuracy GPS first with zero cache for fresh fix
      navigator.geolocation.getCurrentPosition(
        handleCoordsSuccess,
        (highAccError) => {
          // If high accuracy fails or times out, try standard accuracy
          navigator.geolocation.getCurrentPosition(
            handleCoordsSuccess,
            async (finalError) => {
              setIsDetectingLocation(false);
              if (finalError && finalError.code === 1) {
                setLocationStatusMsg(
                  lang === 'en'
                    ? 'Location permission denied. Defaulted to Silchar.'
                    : lang === 'ur'
                    ? 'مقام کی اجازت نہیں ملی۔ سلچر طے ہے۔'
                    : 'লোকেশন পারমিশন মেলেনি। ডিফল্টভাবে শিলচর সেট করা আছে।'
                );
              } else {
                await tryIpFallback();
              }
            },
            { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
          );
        },
        { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      setIsDetectingLocation(false);
      tryIpFallback();
    }
  };

  // Auto-detect user's GPS / region on startup
  useEffect(() => {
    detectUserLocation();
  }, []);

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

  // Construct Barak Valley location list
  const barakLocations: LocationMeta[] = useMemo(() => {
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
        isBarakValley: true,
      };
    });
  }, [locationOffsets]);

  // Combined locations (Barak Valley + All India)
  const allLocations: LocationMeta[] = useMemo(() => {
    return [...barakLocations, ...ALL_INDIA_LOCATIONS];
  }, [barakLocations]);

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
        isBarakValley: true,
      };
    }
    if (selectedLocationId === 'gps_detected' && detectedCustomLocation) {
      return detectedCustomLocation;
    }
    const found = allLocations.find((l) => l.id === selectedLocationId);
    return (
      found || {
        id: 'silchar',
        name: 'Silchar',
        district: 'Cachar',
        state: 'Assam',
        offset: 0,
        description: 'Base Station (0 min)',
        isBarakValley: true,
      }
    );
  }, [selectedLocationId, customOffset, allLocations, detectedCustomLocation]);

  // Base prayer times for the chosen date
  // - Barak Valley locations: use user's authentic custom timetable
  // - All-India locations: calculate using Google's Karachi method
  const basePrayerTimes = useMemo(() => {
    const isBarak = Boolean(
      activeLocation.isBarakValley ||
      ['cachar', 'hailakandi', 'karimganj'].includes(activeLocation.district?.toLowerCase() || '') ||
      activeLocation.id === 'silchar' ||
      activeLocation.id === 'custom' ||
      DEFAULT_LOCATION_OFFSETS[activeLocation.id] !== undefined
    );

    if (isBarak) {
      return getBasePrayerTimesForDate(selectedDate, timetable, asrMethod);
    } else {
      const lat = activeLocation.lat ?? 22.5726; // Default to Kolkata coordinates
      const lon = activeLocation.lon ?? 88.3639;
      return calculateGooglePrayerTimesForLocation(lat, lon, selectedDate, asrMethod);
    }
  }, [selectedDate, timetable, asrMethod, activeLocation]);

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

  const hijriData = useMemo(() => {
    return calculateHijriFromDate(selectedDate, hijriAdjustment);
  }, [selectedDate, hijriAdjustment]);

  const sunrisePrayer = prayers.find((p) => p.key === 'sunrise');
  const sunriseTimeStr = sunrisePrayer?.adjustedTime ? String(sunrisePrayer.adjustedTime).toLowerCase() : '5:23 am';

  const prayerNameMap: Record<string, string> = {
    sehri_end: 'Fajr',
    sunrise: 'Ishraq',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  };

  const nextPrayerNameStr = nextPrayer?.key ? (prayerNameMap[nextPrayer.key] || 'Fajr') : 'Fajr';
  const nextPrayerTimeStr = nextPrayer?.adjustedTime ? String(nextPrayer.adjustedTime).toLowerCase() : '4:08 am';

  return (
    <>
      <MuslimAppView
        activeTab={mainNavTab}
        setActiveTab={setMainNavTab}
        userCity={userCity}
        isDetectingLocation={isDetectingLocation}
        locationStatusMsg={locationStatusMsg}
        onDetectLocation={detectUserLocation}
        userLat={userCoords.lat}
        userLon={userCoords.lon}
        activeLocation={activeLocation}
        hijriDateFormattedEn={hijriData.formattedEn}
        hijriDateFormattedBn={hijriData.formattedBn}
        nextPrayerName={nextPrayerNameStr}
        nextPrayerTime={nextPrayerTimeStr}
        sunriseTime={sunriseTimeStr}
        minutesToNext={minutesToNext}
        onOpenMosqueSettings={() => setIsMosqueModalOpen(true)}
        lang={appLang}
        onSelectLang={handleSelectLang}
        onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
        prayersChildren={
          <div className="space-y-6 pb-20">
            {/* Top Header */}
            <Header
              locations={barakLocations}
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
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
            />

            {/* Navigation View Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#09332E] p-2.5 rounded-2xl border border-white/10 shadow-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  id="view-tab-daily"
                  onClick={() => setActiveTab('daily')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'daily'
                      ? 'bg-[#E2A336] text-[#03221F] shadow-sm'
                      : 'text-[#90A8A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>দৈনিক ওয়াক্ত ও ওভারভিউ</span>
                </button>

                <button
                  id="view-tab-arabic"
                  onClick={() => setActiveTab('arabic')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'arabic'
                      ? 'bg-[#E2A336] text-[#03221F] shadow-sm'
                      : 'text-[#90A8A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>আরবী ক্যালেন্ডার</span>
                </button>

                <button
                  id="view-tab-poster"
                  onClick={() => setActiveTab('poster')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'poster'
                      ? 'bg-[#E2A336] text-[#03221F] shadow-sm'
                      : 'text-[#90A8A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>দাইমী সময়সূচী পোস্টার</span>
                </button>

                <button
                  id="view-tab-all"
                  onClick={() => setActiveTab('all')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#E2A336] text-[#03221F] shadow-sm'
                      : 'text-[#90A8A3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>সকল ভিউ</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="install-guide-tab-btn"
                  onClick={() => setIsInstallHelpOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors cursor-pointer"
                  title="ফোনে নিরাপদ ডাউনলোড ও ইনস্টল সহায়িকা"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ইনস্টল ও নিরাপত্তা</span>
                </button>
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
                  lang={lang}
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

                {/* আমার মসজিদ সেটিং করার ফর্ম */}
                <div className="mt-4 p-5 bg-[#09332E] rounded-2xl text-white border border-white/10 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-base flex items-center gap-2">
                        <span>🕌 {lang === 'en' ? 'Your Mosque Jamaat Settings' : lang === 'ur' ? 'آپ کی مسجد کے جماعت کے اوقات' : 'আপনার মসজিদের জামাত সেটিং'}</span>
                        {mosqueName && (
                          <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            {lang === 'en' ? 'Active: ' : lang === 'ur' ? 'فعال: ' : 'সক্রিয়: '}{mosqueName}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#90A8A3] mt-0.5">
                        {lang === 'en'
                          ? 'Set your local mosque jamaat congregation times (12-hr AM/PM format)'
                          : lang === 'ur'
                          ? 'مقامی مسجد کے لیے جماعت کے اوقات سیٹ کریں'
                          : 'ভারতীয় ১২-ঘণ্টা সময় (AM/PM) ফরম্যাটে প্রতিটি ওয়াক্তের জামাত সময় সেট করুন'}
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
                      title={lang === 'en' ? 'Auto-fill standard Indian prayer times' : 'বরাক উপত্যকার আদর্শ ভারতীয় জামাতের সময়সূচী স্বয়ংক্রিয় পূরণ'}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'en' ? 'Auto-fill standard times' : lang === 'ur' ? 'معیاری اوقات خودکار بھریں' : 'আদর্শ ভারতীয় সময় পূরণ'}</span>
                    </button>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder={lang === 'en' ? 'Enter mosque name (e.g. Kotamoni Bazar Jame Masjid)' : lang === 'ur' ? 'مسجد کا نام درج کریں' : 'মসজিদের নাম লিখুন (যেমন: কোটামনি বাজার জামে মসজিদ)'} 
                    value={mosqueName} 
                    onChange={(e) => setMosqueName(e.target.value)}
                    className="p-2.5 rounded-lg bg-[#03221F] w-full mb-3 text-white border border-white/10 focus:border-[#E2A336] focus:outline-none text-sm placeholder-[#90A8A3]"
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
                  <div className="mt-3.5 p-3.5 rounded-xl bg-[#03221F] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={playAzanOnJamaat}
                        onChange={(e) => handleTogglePlayAzan(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-stone-800 border-stone-600 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-[#E2A336]" />
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
                        <span className="text-[11px] text-[#90A8A3] block mt-0.5">
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
                            : 'bg-[#09332E] hover:bg-[#0C3E37] text-emerald-300 border-white/10'
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
                    className="mt-4 bg-[#E2A336] px-4 py-2.5 rounded-xl text-[#03221F] font-bold hover:bg-yellow-400 transition-colors w-full cursor-pointer shadow-sm text-sm flex items-center justify-center gap-2"
                  >
                    <span>💾 সেভ করুন ও অ্যালার্ম চালু করুন</span>
                  </button>
                </div>

                {/* Regional Location Comparison Matrix */}
                <LocationComparison
                  locations={barakLocations}
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

            {/* Footer */}
            <footer id="app-footer" className="bg-[#09332E] border border-white/10 mt-8 py-6 text-xs text-[#90A8A3] rounded-2xl p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left space-y-1">
                  <p className="font-semibold text-white">
                    বরাক উপত্যকা ইসলামিক নামাজ ও রোজার স্থায়ী সময়সূচি
                  </p>
                  <p className="text-[#90A8A3]">
                    ক্যাছাড় (Cachar), হাইলাকান্দি (Hailakandi) ও করিমগঞ্জ (Karimganj) • ১৬টি নির্বাচনী এলাকা
                  </p>
                </div>

                {/* Creator Attribution */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-[#03221F] border border-[#E2A336]/30 px-4 py-2 rounded-xl text-white shadow-2xs">
                    <span className="text-[#90A8A3] font-medium">অ্যাপটি তৈরি করেছেন:</span>
                    <span className="font-bold text-[#E2A336] tracking-wide flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                      <span>Fahad Uddin (ফাহাদ উদ্দিন)</span>
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        }
      />

      {/* Location Picker Modal (Barak Valley + All India) */}
      <LocationPickerModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        barakLocations={barakLocations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={(id, customLoc) => {
          if (customLoc) {
            setDetectedCustomLocation(customLoc);
          }
          setSelectedLocationId(id);
        }}
        onDetectLocation={detectUserLocation}
        isDetectingLocation={isDetectingLocation}
        lang={appLang}
        customOffset={customOffset}
        onCustomOffsetChange={setCustomOffset}
      />

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
        <div className="fixed bottom-16 right-5 left-5 sm:left-auto sm:w-96 z-50 bg-[#09332E] backdrop-blur-md text-white p-4 rounded-2xl border border-[#E2A336] shadow-2xl shadow-black/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse text-[#E2A336]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                🕌 {mosqueName ? `${mosqueName} - ` : ''}{activeJamaatAlert.prayer} জামাতের সময়!
              </h4>
              <p className="text-[11px] text-[#E2A336] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E2A336] animate-ping"></span>
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
    </>
  );
}
