import React, { useState } from 'react';
import {
  User,
  Coins,
  Bell,
  Gift,
  ArrowRight,
  Sparkles,
  Compass,
  HandHelping,
  CircleDot,
  BookOpen,
  FileEdit,
  Building2,
  ChevronRight,
  Home,
  Clock,
  BookMarked,
  Users,
  MapPin,
  RefreshCw,
  Plane,
  UserCheck,
  HeartHandshake,
  Edit3,
  Plus,
} from 'lucide-react';
import { QiblaModal } from './QiblaModal';
import { TasbihModal } from './TasbihModal';
import { DuasModal } from './DuasModal';
import { JournalModal } from './JournalModal';
import { InspirationModal } from './InspirationModal';
import { CampaignModal } from './CampaignModal';
import { QuranView } from './QuranModal';
import { UmmahView } from './UmmahView';
import { ImamMatrimonyView } from './ImamMatrimonyView';
import { ImamPortalModal } from './ImamPortalModal';
import { LocationMeta, AppLanguage } from '../types';
import { TRANSLATIONS, getPrayerName } from '../utils/translations';
import { formatToIndian12Hour } from '../utils/prayerCalc';

interface MuslimAppViewProps {
  // Navigation & Location
  activeTab: 'home' | 'prayers' | 'quran' | 'ummah' | 'matrimony';
  setActiveTab: (tab: 'home' | 'prayers' | 'quran' | 'ummah' | 'matrimony') => void;
  userCity: string;
  isDetectingLocation: boolean;
  locationStatusMsg: string;
  onDetectLocation: () => void;
  userLat?: number | null;
  userLon?: number | null;
  activeLocation: LocationMeta;
  // Hijri Date
  hijriDateFormattedEn: string;
  hijriDateFormattedBn: string;
  // Prayer Times
  nextPrayerName: string;
  nextPrayerTime: string;
  sunriseTime: string;
  minutesToNext: number;
  // Mosque Jamaat Times
  mosqueName?: string;
  jamaatTimes?: { [key: string]: string };
  // Modals & Settings
  onOpenMosqueSettings: () => void;
  prayersChildren: React.ReactNode;
  // Multilingual Support
  lang?: AppLanguage;
  onSelectLang?: (lang: AppLanguage) => void;
  onOpenLocationPicker?: () => void;
}

export const MuslimAppView: React.FC<MuslimAppViewProps> = ({
  activeTab,
  setActiveTab,
  userCity,
  isDetectingLocation,
  locationStatusMsg,
  onDetectLocation,
  userLat,
  userLon,
  activeLocation,
  hijriDateFormattedEn,
  hijriDateFormattedBn,
  nextPrayerName,
  nextPrayerTime,
  sunriseTime,
  minutesToNext,
  mosqueName = '',
  jamaatTimes,
  onOpenMosqueSettings,
  prayersChildren,
  lang = 'en',
  onSelectLang,
  onOpenLocationPicker,
}) => {
  // Coins state
  const [coins, setCoins] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('muslim_app_coins') || '0', 10);
    } catch {
      return 0;
    }
  });

  const handleAddCoins = (amount: number) => {
    const newTotal = coins + amount;
    setCoins(newTotal);
    try {
      localStorage.setItem('muslim_app_coins', String(newTotal));
    } catch {
      // ignore
    }
  };

  // Feature modals
  const [isQiblaOpen, setIsQiblaOpen] = useState<boolean>(false);
  const [isTasbihOpen, setIsTasbihOpen] = useState<boolean>(false);
  const [isDuasOpen, setIsDuasOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isInspirationOpen, setIsInspirationOpen] = useState<boolean>(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState<boolean>(false);
  const [isImamPortalOpen, setIsImamPortalOpen] = useState<boolean>(false);
  const [selectedForYouTitle, setSelectedForYouTitle] = useState<string>('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const [isNotificationInfoOpen, setIsNotificationInfoOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // Derive short Hijri date (e.g., "4 Rabi' II")
  const shortHijriDate =
    lang === 'bn'
      ? hijriDateFormattedBn.split(',')[0] || '৪ রবিউস সানি'
      : lang === 'ur'
      ? hijriDateFormattedEn
          .replace('AH', '')
          .replace(/al-Thani/gi, 'الثانی')
          .replace(/al-Awwal/gi, 'الاول')
          .replace(/Rabi/gi, 'ربیع')
          .replace(/Jumada/gi, 'جمادی')
          .replace(/Rajab/gi, 'رجب')
          .replace(/Sha'ban/gi, 'شعبان')
          .replace(/Ramadan/gi, 'رمضان')
          .replace(/Shawwal/gi, 'شوال')
          .replace(/Dhu al-Qi'dah/gi, 'ذی القعدہ')
          .replace(/Dhu al-Hijjah/gi, 'ذی الحجہ')
          .replace(/Muharram/gi, 'محرم')
          .replace(/Safar/gi, 'صفر')
          .trim() || '4 ربیع الثانی'
      : hijriDateFormattedEn
          .replace('AH', '')
          .replace(/al-Thani/gi, 'II')
          .replace(/al-Awwal/gi, 'I')
          .trim() || "4 Rabi' II";

  // Display city name (matching "Howrah" from screenshot or detected location)
  const displayCity = userCity || activeLocation.name || (lang === 'ur' ? 'ہاوڑہ' : lang === 'bn' ? 'হাওড়া' : 'Howrah');

  // Next prayer localized display name
  const localizedPrayerName = getPrayerName(nextPrayerName || 'Fajr', lang);

  const PRAYER_KEYS = [
    { key: 'Fajr', labelEn: 'Fajr', labelBn: 'ফজর', labelUr: 'فجر' },
    { key: 'Dhuhr', labelEn: 'Dhuhr', labelBn: 'যোহর', labelUr: 'ظہر' },
    { key: 'Asr', labelEn: 'Asr', labelBn: 'আসর', labelUr: 'عصر' },
    { key: 'Maghrib', labelEn: 'Maghrib', labelBn: 'মাগরিব', labelUr: 'مغرب' },
    { key: 'Isha', labelEn: 'Isha', labelBn: 'এশা', labelUr: 'عشاء' },
  ];

  const hasCustomJamaatTimes = Boolean(
    jamaatTimes &&
      Object.values(jamaatTimes).some((val) => typeof val === 'string' && val.trim().length > 0)
  );

  const nextJamaatTime = (jamaatTimes && nextPrayerName && jamaatTimes[nextPrayerName]) || '';

  const remainingHours = Math.floor(minutesToNext / 60);
  const remainingMins = minutesToNext % 60;
  const remainingTimeStr =
    lang === 'ur'
      ? `• باقی ${remainingHours > 0 ? `${remainingHours} گھنٹے ` : ''}${remainingMins} منٹ`
      : lang === 'bn'
      ? `• আর ${remainingHours > 0 ? `${remainingHours} ঘণ্টা ` : ''}${remainingMins} মিনিট বাকি`
      : `• ${remainingHours > 0 ? `${remainingHours}h ` : ''}${remainingMins}m ${t.remaining}`;

  return (
    <div
      className="min-h-screen bg-[#03221F] text-white flex flex-col justify-between font-sans selection:bg-[#E2A336] selection:text-[#03221F]"
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Scrollable Main Area */}
      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-3 sm:py-6">
        {/* TAB 1: HOME (EXACT MATCH TO THE USER'S SCREENSHOT) */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Top Header Bar */}
            <header className="flex items-center justify-between gap-2 pt-1 pb-2">
              {/* Profile Avatar & Hijri Date */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsNotificationInfoOpen(true)}
                  className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
                <span className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {shortHijriDate}
                </span>
              </div>

              {/* Center: Language Switcher Buttons */}
              <div className="flex items-center bg-[#09332E] border border-white/10 rounded-full p-0.5 text-xs font-semibold shadow-xs">
                <button
                  type="button"
                  onClick={() => onSelectLang?.('en')}
                  className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                    lang === 'en'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold shadow-xs'
                      : 'text-[#90A8A3] hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLang?.('ur')}
                  className={`px-2 py-0.5 rounded-full transition-all text-[11px] font-urdu ${
                    lang === 'ur'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold shadow-xs'
                      : 'text-[#90A8A3] hover:text-white'
                  }`}
                >
                  اردو
                </button>
                <button
                  type="button"
                  onClick={() => onSelectLang?.('bn')}
                  className={`px-2 py-0.5 rounded-full transition-all text-[11px] ${
                    lang === 'bn'
                      ? 'bg-[#E2A336] text-[#03221F] font-bold shadow-xs'
                      : 'text-[#90A8A3] hover:text-white'
                  }`}
                >
                  বাং
                </button>
              </div>

              {/* Coin Counter, Notification, Gift */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Coin Counter Pill */}
                <button
                  onClick={() => setIsTasbihOpen(true)}
                  className="flex items-center gap-1.5 bg-[#09332E] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/5 hover:border-[#E2A336]/40 transition-colors"
                  title="আপনার নেক আমল ও তাসবিহ পয়েন্ট"
                >
                  <div className="w-4 h-4 rounded-full bg-[#E2A336] flex items-center justify-center text-[10px] text-[#03221F] font-black">
                    ★
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white">{coins}</span>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={() => setIsNotificationInfoOpen(true)}
                  className="p-1.5 text-stone-200 hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Gift Box Icon */}
                <button
                  onClick={() => setIsGiftModalOpen(true)}
                  className="p-1.5 text-[#E2A336] hover:text-yellow-300 transition-colors animate-bounce"
                  aria-label="Daily Gift"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </header>

            {/* 2. Premium Status Bar */}
            <button
              onClick={() => setIsNotificationInfoOpen(true)}
              className="w-full bg-[#09332E] border border-[#E2A336]/50 rounded-full px-4 py-2.5 sm:py-3 flex items-center justify-between text-left text-xs sm:text-sm hover:bg-[#0C3E37] transition-all shadow-sm group"
            >
              <span className="text-stone-200 group-hover:text-white font-medium">
                {t.premiumEnds}
              </span>
              <ArrowRight className={`w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform ${lang === 'ur' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
            </button>

            {/* 3. Prayer Times Main Card (HIGHLIGHTED IN RED IN USER'S SCREENSHOT) */}
            <div
              className="bg-[#09332E] border border-white/5 hover:border-[#E2A336]/30 rounded-2xl p-4 sm:p-5 shadow-xl transition-all relative overflow-hidden group"
              id="main-prayer-card"
            >
              {/* Background ambient Islamic pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2A336]/5 rounded-full blur-2xl pointer-events-none" />

              {/* Top Row: Next Prayer Badge & Location Name */}
              <div className="flex items-start justify-between gap-3 mb-2">
                {/* Next Prayer Badge */}
                <div className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/5">
                  <span className="text-xs text-[#90A8A3]">{t.next}</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {localizedPrayerName} <Sparkles className="w-3.5 h-3.5 text-[#E2A336]" />
                  </span>
                </div>

                {/* Location & Hijri Date (Right Aligned) */}
                <div className={lang === 'ur' ? 'text-left' : 'text-right'}>
                  <button
                    onClick={() => {
                      if (onOpenLocationPicker) {
                        onOpenLocationPicker();
                      } else {
                        onDetectLocation();
                      }
                    }}
                    className="group/loc flex items-center justify-end gap-1.5 text-sm font-bold text-white hover:text-[#E2A336] transition-colors cursor-pointer"
                    title={lang === 'bn' ? 'স্থান পরিবর্তন করুন' : 'Change Location'}
                  >
                    <span>{displayCity}</span>
                    <MapPin className="w-3.5 h-3.5 text-[#E2A336] group-hover/loc:animate-pulse shrink-0" />
                  </button>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="text-xs text-[#90A8A3]">
                      {shortHijriDate}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-medium bg-[#03221F] border border-[#E2A336]/30 text-amber-300">
                      {activeLocation.isBarakValley || ['cachar', 'hailakandi', 'karimganj'].includes(activeLocation.district?.toLowerCase() || '')
                        ? lang === 'bn' ? '🌿 বরাক' : lang === 'ur' ? '🌿 براک' : '🌿 Barak'
                        : '🇮🇳 Google'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Prayer Time (Big Typography) */}
              <div className="mt-3 mb-1">
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {nextPrayerTime}
                </div>
                <div className="text-xs sm:text-sm text-[#90A8A3] mt-1 font-medium flex items-center gap-2 flex-wrap">
                  <span>{t.sunriseAt} {sunriseTime}</span>
                  {minutesToNext > 0 && (
                    <span className="text-emerald-400 font-normal">
                      {remainingTimeStr}
                    </span>
                  )}
                </div>

                {/* Local Mosque Congregation Time pill if configured */}
                {nextJamaatTime && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E2A336]/15 border border-[#E2A336]/30 text-[#E2A336] text-xs font-semibold">
                    <Building2 className="w-3.5 h-3.5 shrink-0 text-[#E2A336]" />
                    <span className="text-emerald-200/90 font-medium">
                      {lang === 'en' ? 'Mosque Jamaat:' : lang === 'ur' ? 'مسجد میں جماعت:' : 'মসজিদে জামাত:'}
                    </span>
                    <span className="text-white font-bold">
                      {formatToIndian12Hour(nextJamaatTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Location Status Message (if detecting or detected) */}
              {locationStatusMsg && (
                <div className="mt-2 text-[11px] text-amber-200/90 bg-black/20 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center justify-between">
                  <span>📍 {locationStatusMsg}</span>
                  {isDetectingLocation && <RefreshCw className="w-3 h-3 animate-spin text-[#E2A336]" />}
                </div>
              )}

              {/* Bottom Action: View all prayer times */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('prayers')}
                  className="flex items-center justify-between w-full text-xs text-[#90A8A3] hover:text-white transition-colors group/link"
                >
                  <span className="font-medium group-hover/link:underline">{t.viewAllPrayers}</span>
                  <ArrowRight className={`w-4 h-4 text-[#90A8A3] group-hover/link:text-white transition-all ${lang === 'ur' ? 'rotate-180 group-hover/link:-translate-x-0.5' : 'group-hover/link:translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* 3.1 Mosque Jamaat Timetable Card (Rendered below main prayer card) */}
            {hasCustomJamaatTimes ? (
              <div
                id="mosque-jamaat-timetable-card"
                className="bg-[#09332E] border border-[#E2A336]/40 hover:border-[#E2A336]/60 rounded-2xl p-4 shadow-xl transition-all relative overflow-hidden group"
              >
                {/* Background soft glow */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#E2A336]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between gap-2.5 mb-3 relative z-10">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {mosqueName || (lang === 'en' ? 'My Mosque Jamaat Times' : lang === 'ur' ? 'میری مسجد کا ٹائم ٹیبل' : 'আমার মসজিদের জামাত সময়সূচি')}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                          {lang === 'en' ? '🕌 Jamaat' : lang === 'ur' ? '🕌 جماعت' : '🕌 জামাত টাইম'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#90A8A3] truncate">
                        {lang === 'en'
                          ? 'Local congregation timetable & alert'
                          : lang === 'ur'
                          ? 'مقامی باجماعت نماز کا وقت'
                          : 'মসজিদের জামাতের নির্ধারিত সময়সূচি ও এলার্ট'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenMosqueSettings}
                    className="px-2.5 py-1 rounded-lg bg-[#E2A336]/15 hover:bg-[#E2A336]/25 border border-[#E2A336]/40 text-[#E2A336] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title={lang === 'en' ? 'Edit mosque timetable' : 'মসজিদের জামাত সময় পরিবর্তন করুন'}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{lang === 'en' ? 'Edit' : lang === 'ur' ? 'ترمیم' : 'এডিট'}</span>
                  </button>
                </div>

                {/* 5-Waqt Horizontal Timetable Grid */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 relative z-10">
                  {PRAYER_KEYS.map((item) => {
                    const rawTime = jamaatTimes?.[item.key] || '';
                    const formatted = rawTime ? formatToIndian12Hour(rawTime) : '--:--';
                    const isNext = (nextPrayerName || '').toLowerCase() === item.key.toLowerCase();
                    const prayerNameLocalized =
                      lang === 'en' ? item.labelEn : lang === 'ur' ? item.labelUr : item.labelBn;

                    return (
                      <div
                        key={item.key}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          isNext
                            ? 'bg-[#E2A336]/20 border-[#E2A336] shadow-sm ring-1 ring-[#E2A336]/50'
                            : rawTime
                            ? 'bg-[#03221F]/70 border-white/5 hover:border-white/15'
                            : 'bg-black/20 border-white/5 opacity-50'
                        }`}
                      >
                        <div className={`text-[10px] sm:text-xs font-medium ${isNext ? 'text-[#E2A336] font-bold' : 'text-[#90A8A3]'}`}>
                          {prayerNameLocalized}
                        </div>
                        <div className={`text-xs sm:text-sm font-extrabold mt-0.5 tracking-tight ${isNext ? 'text-white' : rawTime ? 'text-white' : 'text-stone-500'}`}>
                          {formatted}
                        </div>
                        {isNext && (
                          <span className="inline-block mt-1 text-[8px] font-bold text-[#03221F] bg-[#E2A336] px-1 py-0.2 rounded-full">
                            {lang === 'en' ? 'Next' : lang === 'ur' ? 'اگلی' : 'পরবর্তী'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                id="mosque-jamaat-timetable-prompt"
                className="bg-[#09332E]/70 hover:bg-[#09332E] border border-white/10 hover:border-[#E2A336]/30 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E2A336] group-hover:bg-[#E2A336]/10 transition-colors shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors truncate">
                      {lang === 'en'
                        ? 'Add Mosque Jamaat Timetable'
                        : lang === 'ur'
                        ? 'مسجد کے اوقاتِ جماعت شامل کریں'
                        : 'মসজিদের নামাজের টাইম টেবিল যুক্ত করুন'}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#90A8A3] truncate">
                      {lang === 'en'
                        ? 'Display your local mosque times right here'
                        : lang === 'ur'
                        ? 'یہاں اپنی مسجد کا ٹائم ٹیبل دکھائیں'
                        : 'এখানে আপনার মসজিদের জামাত সময় প্রদর্শন করতে টাইম টেবিল সেট করুন'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenMosqueSettings}
                  className="px-3 py-1.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Add Times' : lang === 'ur' ? 'ٹائم جوڑیں' : 'টাইম যোগ করুন'}</span>
                </button>
              </div>
            )}

            {/* 4. Features Section Header & Horizontal Row */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">{t.features}</h3>
                  <button
                    onClick={() => setIsJournalOpen(true)}
                    className="text-[#90A8A3] hover:text-white p-1"
                    title={t.journal}
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={onOpenMosqueSettings}
                  className="bg-[#09332E] hover:bg-[#0C3E37] text-white text-xs px-3 py-1 rounded-full border border-white/5 transition-colors font-medium"
                >
                  {t.settings}
                </button>
              </div>

              {/* Feature Items List (Scrollable horizontally) */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {/* Feature 1: Qibla */}
                <button
                  onClick={() => setIsQiblaOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <Compass className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.qibla}</span>
                </button>

                {/* Feature 2: Duas */}
                <button
                  onClick={() => setIsDuasOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <HandHelping className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.duas}</span>
                </button>

                {/* Feature 3: Tasbih */}
                <button
                  onClick={() => setIsTasbihOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <CircleDot className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.tasbih}</span>
                </button>

                {/* Feature 4: Inspiration */}
                <button
                  onClick={() => setIsInspirationOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.inspiration}</span>
                </button>

                {/* Feature 5: Journal */}
                <button
                  onClick={() => setIsJournalOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <FileEdit className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.journal}</span>
                </button>

                {/* Feature 6: Mosque / More */}
                <button
                  onClick={onOpenMosqueSettings}
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-white/5 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/15 flex items-center justify-center text-[#E2A336]">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                  <span className="text-xs text-white font-medium">{t.mosque}</span>
                </button>

                {/* Feature 7: Imam Recruitment, Mosque & Matrimony Portal */}
                <button
                  onClick={() => setActiveTab('matrimony')}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#09332E] border border-[#E2A336]/30 group-hover:border-[#E2A336] flex items-center justify-center transition-all group-active:scale-95 shadow-md relative">
                    <div className="w-9 h-9 rounded-xl bg-[#E2A336]/20 flex items-center justify-center text-[#E2A336]">
                      <HeartHandshake className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E2A336] ring-2 ring-[#03221F]" />
                  </div>
                  <span className="text-xs text-[#E2A336] font-medium">{t.matrimony}</span>
                </button>
              </div>
            </div>

            {/* 5. "For You" Section List (All pure, uplifting Islamic features) */}
            <div className="pt-3 pb-8">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">{t.forYou}</h3>

              <div className="space-y-2.5">
                {/* For You Item: Imam Recruitment & Mosque Vacancies & Matrimony */}
                <div
                  onClick={() => setActiveTab('matrimony')}
                  className="bg-gradient-to-r from-[#09332E] to-[#0c4038] hover:to-[#0e4940] border border-[#E2A336]/30 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
                >
                  <span className="text-xl shrink-0">💍</span>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                      <span>
                        {lang === 'en'
                          ? `${t.matrimony}: Imam Recruitment & Matrimony`
                          : lang === 'ur'
                          ? `${t.matrimony}: ائمہ کی تقرری اور رشتہ داری`
                          : `${t.matrimony}: ইমাম নিযুক্তি ও পাত্র-পাত্রী`}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#E2A336] text-[#03221F] font-bold rounded-full">
                        {t.newBadge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#90A8A3] leading-snug mt-0.5">
                      {lang === 'en'
                        ? 'Mosque vacancies, Imam biodatas & Islamic matrimonial matches'
                        : lang === 'ur'
                        ? 'مساجد میں آسامیاں، ائمہ کرام کے بائیو ڈیٹا اور شرعی رشتے'
                        : 'মসজিদের নিয়োগ, ইমামদের বায়োডাটা ও দ্বীনি পাত্র-পাত্রীর খোঁজ'}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#E2A336] group-hover:translate-x-0.5 transition-transform shrink-0 ${lang === 'ur' ? 'rotate-180' : ''}`} />
                </div>

                {/* For You Item 1: Daily Sadaqah */}
                <div
                  onClick={() => {
                    setSelectedForYouTitle(t.dailySadaqah);
                    setIsCampaignOpen(true);
                  }}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">🤝</span>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {t.dailySadaqah}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#90A8A3] leading-snug">
                      {t.dailySadaqahSubtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0 ${lang === 'ur' ? 'rotate-180' : ''}`} />
                </div>

                {/* For You Item 2: Surah Memorization / Quran */}
                <div
                  onClick={() => setActiveTab('quran')}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">📖</span>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {t.hifzTracker}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#90A8A3] leading-snug">
                      {t.hifzSubtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0 ${lang === 'ur' ? 'rotate-180' : ''}`} />
                </div>

                {/* For You Item 3: Jummah Sadaqah */}
                <div
                  onClick={() => {
                    setSelectedForYouTitle(t.jummahSadaqah);
                    setIsCampaignOpen(true);
                  }}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">✨</span>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {t.jummahSadaqah}
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#90A8A3] leading-snug">
                      {t.jummahSubtitle}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0 ${lang === 'ur' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRAYERS (FULL TIMETABLE & BARAK VALLEY OFFSETS) */}
        {activeTab === 'prayers' && (
          <div className="animate-in fade-in duration-200">
            {prayersChildren}
          </div>
        )}

        {/* TAB 3: QURAN */}
        {activeTab === 'quran' && (
          <div className="animate-in fade-in duration-200">
            <QuranView />
          </div>
        )}

        {/* TAB 4: UMRAH & UMMAH */}
        {activeTab === 'ummah' && (
          <div className="animate-in fade-in duration-200">
            <UmmahView
              onAddCoin={handleAddCoins}
              lang={lang}
              onNavigateToMatrimony={() => setActiveTab('matrimony')}
            />
          </div>
        )}

        {/* TAB 5: IMAM, MOSQUE & MATRIMONY (উমরাহ পরে) */}
        {activeTab === 'matrimony' && (
          <div className="animate-in fade-in duration-200">
            <ImamMatrimonyView onAddCoin={handleAddCoins} lang={lang} />
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="sticky bottom-0 z-40 w-full bg-[#09332E] border-t border-white/10 px-2 sm:px-4 py-2 flex items-center justify-around shadow-2xl backdrop-blur-md"
        id="bottom-navigation-bar"
      >
        {/* Nav 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 cursor-pointer ${
            activeTab === 'home' ? 'text-[#E2A336]' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#E2A336]' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold">{t.home}</span>
        </button>

        {/* Nav 2: Prayers */}
        <button
          onClick={() => setActiveTab('prayers')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 cursor-pointer ${
            activeTab === 'prayers' ? 'text-[#E2A336]' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <Clock className={`w-5 h-5 ${activeTab === 'prayers' ? 'text-[#E2A336]' : ''}`} />
          <span className="text-[11px] font-semibold">{t.prayers}</span>
        </button>

        {/* Nav 3: Quran */}
        <button
          onClick={() => setActiveTab('quran')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 cursor-pointer ${
            activeTab === 'quran' ? 'text-[#E2A336]' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <BookMarked className={`w-5 h-5 ${activeTab === 'quran' ? 'text-[#E2A336]' : ''}`} />
          <span className="text-[11px] font-semibold">{t.quran}</span>
        </button>

        {/* Nav 4: Umrah */}
        <button
          onClick={() => setActiveTab('ummah')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 cursor-pointer ${
            activeTab === 'ummah' ? 'text-[#E2A336]' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <div className="relative">
            <Plane className={`w-5 h-5 ${activeTab === 'ummah' ? 'text-[#E2A336]' : ''}`} />
            {/* Red badge dot as shown in screenshot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-[#09332E]" />
          </div>
          <span className="text-[11px] font-semibold">{t.ummah}</span>
        </button>

        {/* Nav 5: Imam, Mosque & Matrimony (উমরাহ পরে একদম নিচে) */}
        <button
          onClick={() => setActiveTab('matrimony')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 cursor-pointer ${
            activeTab === 'matrimony' ? 'text-[#E2A336]' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <div className="relative">
            <HeartHandshake className={`w-5 h-5 ${activeTab === 'matrimony' ? 'text-[#E2A336]' : ''}`} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E2A336] ring-2 ring-[#09332E]" />
          </div>
          <span className="text-[11px] font-semibold whitespace-nowrap">{t.matrimony}</span>
        </button>
      </nav>

      {/* POPUP MODALS */}
      <QiblaModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        userLat={userLat}
        userLon={userLon}
        userCity={displayCity}
        lang={lang}
      />

      <TasbihModal
        isOpen={isTasbihOpen}
        onClose={() => setIsTasbihOpen(false)}
        coins={coins}
        onAddCoin={handleAddCoins}
        lang={lang}
      />

      <DuasModal
        isOpen={isDuasOpen}
        onClose={() => setIsDuasOpen(false)}
        lang={lang}
      />

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        onAddCoin={handleAddCoins}
        lang={lang}
      />

      <InspirationModal
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
        lang={lang}
      />

      <CampaignModal
        isOpen={isCampaignOpen}
        onClose={() => setIsCampaignOpen(false)}
        onAddCoin={handleAddCoins}
        campaignTitle={selectedForYouTitle}
        lang={lang}
      />

      <ImamPortalModal
        isOpen={isImamPortalOpen}
        onClose={() => setIsImamPortalOpen(false)}
        onAddCoin={handleAddCoins}
        lang={lang}
      />

      {/* Daily Gift Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          <div className="bg-[#09332E] border border-[#E2A336]/40 text-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336] mb-3">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'ur' ? 'روزانہ مبارک تحفہ!' : lang === 'bn' ? 'দৈনিক বরকতময় হাদিস উপহার!' : 'Daily Hadith Blessing Gift!'}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              {lang === 'ur'
                ? 'رسول اللہ ﷺ نے فرمایا: "جس نے صبح کے وقت سو مرتبہ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ کہا، اس کے گناہ معاف کر دیے جاتے ہیں چاہے سمندر کی جھاگ کے برابر ہی ہوں۔"'
                : lang === 'bn'
                ? 'রাসূলুল্লাহ (ﷺ) বলেছেন: "যে ব্যক্তি সকালে ১০০ বার \'সুবহানাল্লাহি ওয়া বিহামদিহি\' পাঠ করবে, তার পাপসমূহ সাগরের ফেনা পরিমাণ হলেও ক্ষমা করে দেওয়া হবে।"'
                : 'The Prophet (ﷺ) said: "Whoever says \'Subhan Allah wa bihamdihi\' 100 times in the morning, his sins will be forgiven even if they were like the foam of the sea."'}
            </p>
            <button
              onClick={() => {
                handleAddCoins(15);
                setIsGiftModalOpen(false);
              }}
              className="w-full bg-[#E2A336] text-[#03221F] font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all"
            >
              {lang === 'ur' ? 'تحفہ وصول کریں (+15 سکے)' : lang === 'bn' ? 'উপহার গ্রহণ করুন (+১৫ কয়েন)' : 'Claim Gift (+15 Coins)'}
            </button>
          </div>
        </div>
      )}

      {/* Notification Info Modal */}
      {isNotificationInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
          <div className="bg-[#09332E] border border-[#E2A336]/40 text-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-[#E2A336]" />
              <h3 className="text-base font-bold text-white">
                {lang === 'ur' ? 'نماز اور اذان کے انتباہات' : lang === 'bn' ? 'নামাজ ও জামাতের সতর্কতা' : 'Prayer & Adhan Alerts'}
              </h3>
            </div>
            <p className="text-xs text-[#90A8A3] leading-relaxed mb-4">
              {lang === 'ur'
                ? 'وقت پر نماز اور اذان کے نوٹیفیکیشنز حاصل کرنے کے لیے براؤزر کی اجازت کو فعال رکھیں۔'
                : lang === 'bn'
                ? 'আপনার ডিভাইসে ওয়াক্তমতো সতর্কবার্তা ও আযান সক্রিয় রাখতে ব্রাউজারের নোটিফিকেশন পারমিশন অন রাখুন।'
                : 'Keep browser notification permissions enabled to receive on-time Adhan alerts for your daily prayers.'}
            </p>
            <button
              onClick={() => {
                if (typeof Notification !== 'undefined') {
                  Notification.requestPermission();
                }
                setIsNotificationInfoOpen(false);
              }}
              className="w-full bg-[#E2A336] text-[#03221F] font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all"
            >
              {lang === 'ur' ? 'نوٹیفیکیشن فعال کریں' : lang === 'bn' ? 'নোটিফিকেশন সক্রিয় করুন' : 'Enable Notifications'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
