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
} from 'lucide-react';
import { QiblaModal } from './QiblaModal';
import { TasbihModal } from './TasbihModal';
import { DuasModal } from './DuasModal';
import { JournalModal } from './JournalModal';
import { InspirationModal } from './InspirationModal';
import { CampaignModal } from './CampaignModal';
import { QuranView } from './QuranModal';
import { UmmahView } from './UmmahView';
import { LocationMeta } from '../types';

interface MuslimAppViewProps {
  // Navigation & Location
  activeTab: 'home' | 'prayers' | 'quran' | 'ummah';
  setActiveTab: (tab: 'home' | 'prayers' | 'quran' | 'ummah') => void;
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
  // Modals & Settings
  onOpenMosqueSettings: () => void;
  prayersChildren: React.ReactNode;
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
  onOpenMosqueSettings,
  prayersChildren,
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
  const [selectedForYouTitle, setSelectedForYouTitle] = useState<string>('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const [isNotificationInfoOpen, setIsNotificationInfoOpen] = useState<boolean>(false);

  // Derive short Hijri date (e.g., "4 Rabi' II")
  const shortHijriDate = hijriDateFormattedEn
    .replace('AH', '')
    .replace(/al-Thani/gi, 'II')
    .replace(/al-Awwal/gi, 'I')
    .trim() || "4 Rabi' II";

  // Display city name (matching "Howrah" from screenshot or detected location)
  const displayCity = userCity || activeLocation.name || 'Howrah';

  return (
    <div className="min-h-screen bg-[#03221F] text-white flex flex-col justify-between font-sans selection:bg-[#E2A336] selection:text-[#03221F]">
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
                <span className="text-base font-bold text-white tracking-wide">
                  {shortHijriDate}
                </span>
              </div>

              {/* Coin Counter, Notification, Gift */}
              <div className="flex items-center gap-3">
                {/* Coin Counter Pill */}
                <button
                  onClick={() => setIsTasbihOpen(true)}
                  className="flex items-center gap-1.5 bg-[#09332E] px-3 py-1.5 rounded-full border border-white/5 hover:border-[#E2A336]/40 transition-colors"
                  title="আপনার নেক আমল ও তাসবিহ পয়েন্ট"
                >
                  <div className="w-4 h-4 rounded-full bg-[#E2A336] flex items-center justify-center text-[10px] text-[#03221F] font-black">
                    ★
                  </div>
                  <span className="text-sm font-bold text-white">{coins}</span>
                </button>

                {/* Notifications Bell */}
                <button
                  onClick={() => setIsNotificationInfoOpen(true)}
                  className="p-1.5 text-stone-200 hover:text-white transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {/* Gift Box Icon */}
                <button
                  onClick={() => setIsGiftModalOpen(true)}
                  className="p-1.5 text-[#E2A336] hover:text-yellow-300 transition-colors animate-bounce"
                  aria-label="Daily Gift"
                >
                  <Gift className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* 2. Premium Status Bar */}
            <button
              onClick={() => setIsNotificationInfoOpen(true)}
              className="w-full bg-[#09332E] border border-[#E2A336]/50 rounded-full px-4 py-3 flex items-center justify-between text-left text-xs sm:text-sm hover:bg-[#0C3E37] transition-all shadow-sm group"
            >
              <span className="text-stone-200 group-hover:text-white font-medium">
                Premium ends in 71 hours
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
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
                  <span className="text-xs text-[#90A8A3]">Next</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    {nextPrayerName} <Sparkles className="w-3.5 h-3.5 text-[#E2A336]" />
                  </span>
                </div>

                {/* Location & Hijri Date (Right Aligned) */}
                <div className="text-right">
                  <button
                    onClick={onDetectLocation}
                    className="group/loc flex items-center justify-end gap-1 text-sm font-bold text-white hover:text-[#E2A336] transition-colors"
                    title="লোকেশন রিফ্রেশ বা সনাক্ত করুন"
                  >
                    <span>{displayCity}</span>
                    <MapPin className="w-3.5 h-3.5 text-[#E2A336] group-hover/loc:animate-pulse" />
                  </button>
                  <div className="text-xs text-[#90A8A3] mt-0.5">
                    {shortHijriDate}
                  </div>
                </div>
              </div>

              {/* Main Prayer Time (Big Typography) */}
              <div className="mt-3 mb-1">
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {nextPrayerTime}
                </div>
                <div className="text-xs sm:text-sm text-[#90A8A3] mt-1 font-medium flex items-center gap-2">
                  <span>Sunrise at {sunriseTime}</span>
                  {minutesToNext > 0 && (
                    <span className="text-emerald-400 font-normal">
                      • আর {Math.floor(minutesToNext / 60) > 0 ? `${Math.floor(minutesToNext / 60)} ঘণ্টা ` : ''}
                      {minutesToNext % 60} মিনিট বাকি
                    </span>
                  )}
                </div>
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
                  <span className="font-medium group-hover/link:underline">View all prayer times</span>
                  <ArrowRight className="w-4 h-4 text-[#90A8A3] group-hover/link:text-white group-hover/link:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>

            {/* 4. Campaign Banner (Send Clean Water to Gaza) */}
            <div
              onClick={() => {
                setSelectedForYouTitle('Send Clean Water to Gaza');
                setIsCampaignOpen(true);
              }}
              className="bg-gradient-to-r from-[#0D433A] to-[#09332E] border border-[#E2A336]/30 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 cursor-pointer hover:border-[#E2A336] transition-all shadow-md active:scale-[0.99] group"
            >
              {/* Illustration / Icon Box */}
              <div className="w-20 h-16 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
                <div className="text-3xl">💧</div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#03221F]/60 to-transparent" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#E2A336] leading-tight tracking-tight">
                  Send Clean<br />Water to Gaza
                </h3>
              </div>
            </div>

            {/* 5. Features Section Header & Horizontal Row */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-white">Features</h3>
                  <button
                    onClick={() => setIsJournalOpen(true)}
                    className="text-[#90A8A3] hover:text-white p-1"
                    title="আমল সম্পাদনা"
                  >
                    <FileEdit className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={onOpenMosqueSettings}
                  className="bg-[#09332E] hover:bg-[#0C3E37] text-white text-xs px-3 py-1 rounded-full border border-white/5 transition-colors font-medium"
                >
                  More
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
                  <span className="text-xs text-white font-medium">Qibla</span>
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
                  <span className="text-xs text-white font-medium">Duas</span>
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
                  <span className="text-xs text-white font-medium">Tasbih</span>
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
                  <span className="text-xs text-white font-medium">Inspiration</span>
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
                  <span className="text-xs text-white font-medium">Journal</span>
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
                  <span className="text-xs text-white font-medium">Mosque</span>
                </button>
              </div>
            </div>

            {/* 6. "For You" Section List */}
            <div className="pt-3 pb-8">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">For You</h3>

              <div className="space-y-2.5">
                {/* For You Item 1 */}
                <div
                  onClick={() => {
                    setSelectedForYouTitle('Send bread to mother in Gaza');
                    setIsCampaignOpen(true);
                  }}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">🍞</span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-snug flex-1">
                    Send bread so a mother in Gaza can feed her children.
                  </p>
                  <ChevronRight className="w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0" />
                </div>

                {/* For You Item 2 */}
                <div
                  onClick={() => setActiveTab('quran')}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">🌱</span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-snug flex-1">
                    Start memorising surahs now to lead your family's prayers every night.
                  </p>
                  <ChevronRight className="w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0" />
                </div>

                {/* For You Item 3 */}
                <div
                  onClick={() => {
                    setSelectedForYouTitle('Automate Friday Sadaqah for Gaza');
                    setIsCampaignOpen(true);
                  }}
                  className="bg-[#09332E] hover:bg-[#0C3E37] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.99] group"
                >
                  <span className="text-xl shrink-0">🇵🇸</span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-snug flex-1">
                    Automate your Friday sadaqah to send continuous weekly aid to Gaza.
                  </p>
                  <ChevronRight className="w-4 h-4 text-[#90A8A3] group-hover:text-white shrink-0" />
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

        {/* TAB 4: UMMAH */}
        {activeTab === 'ummah' && (
          <div className="animate-in fade-in duration-200">
            <UmmahView onAddCoin={handleAddCoins} />
          </div>
        )}
      </div>

      {/* 7. Bottom Navigation Bar (MATCHING SCREENSHOT WITH ACTIVE STATES) */}
      <nav
        className="sticky bottom-0 z-40 w-full bg-[#09332E] border-t border-white/10 px-4 py-2 flex items-center justify-around shadow-2xl backdrop-blur-md"
        id="bottom-navigation-bar"
      >
        {/* Nav 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
            activeTab === 'home' ? 'text-white' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-white' : ''}`} />
          </div>
          <span className="text-[11px] font-semibold">Home</span>
        </button>

        {/* Nav 2: Prayers */}
        <button
          onClick={() => setActiveTab('prayers')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
            activeTab === 'prayers' ? 'text-white' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <Clock className={`w-5 h-5 ${activeTab === 'prayers' ? 'text-[#E2A336]' : ''}`} />
          <span className="text-[11px] font-semibold">Prayers</span>
        </button>

        {/* Nav 3: Quran */}
        <button
          onClick={() => setActiveTab('quran')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
            activeTab === 'quran' ? 'text-white' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <BookMarked className={`w-5 h-5 ${activeTab === 'quran' ? 'text-[#E2A336]' : ''}`} />
          <span className="text-[11px] font-semibold">Quran</span>
        </button>

        {/* Nav 4: Ummah */}
        <button
          onClick={() => setActiveTab('ummah')}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 ${
            activeTab === 'ummah' ? 'text-white' : 'text-[#90A8A3] hover:text-white'
          }`}
        >
          <div className="relative">
            <Users className={`w-5 h-5 ${activeTab === 'ummah' ? 'text-[#E2A336]' : ''}`} />
            {/* Red badge dot as shown in screenshot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-[#09332E]" />
          </div>
          <span className="text-[11px] font-semibold">Ummah</span>
        </button>
      </nav>

      {/* POPUP MODALS */}
      <QiblaModal
        isOpen={isQiblaOpen}
        onClose={() => setIsQiblaOpen(false)}
        userLat={userLat}
        userLon={userLon}
        userCity={displayCity}
      />

      <TasbihModal
        isOpen={isTasbihOpen}
        onClose={() => setIsTasbihOpen(false)}
        coins={coins}
        onAddCoin={handleAddCoins}
      />

      <DuasModal isOpen={isDuasOpen} onClose={() => setIsDuasOpen(false)} />

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        onAddCoin={handleAddCoins}
      />

      <InspirationModal
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
      />

      <CampaignModal
        isOpen={isCampaignOpen}
        onClose={() => setIsCampaignOpen(false)}
        onAddCoin={handleAddCoins}
        campaignTitle={selectedForYouTitle}
      />

      {/* Daily Gift Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#09332E] border border-[#E2A336]/40 text-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336] mb-3">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">দৈনিক বরকতময় হাদিস উপহার!</h3>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              রাসূলুল্লাহ (ﷺ) বলেছেন: "যে ব্যক্তি সকালে ১০০ বার 'সুবহানাল্লাহি ওয়া বিহামদিহি' পাঠ করবে, তার পাপসমূহ সাগরের ফেনা পরিমাণ হলেও ক্ষমা করে দেওয়া হবে।"
            </p>
            <button
              onClick={() => {
                handleAddCoins(15);
                setIsGiftModalOpen(false);
              }}
              className="w-full bg-[#E2A336] text-[#03221F] font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition-all"
            >
              উপহার গ্রহণ করুন (+১৫ কয়েন)
            </button>
          </div>
        </div>
      )}

      {/* Notification Info Modal */}
      {isNotificationInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#09332E] border border-[#E2A336]/40 text-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-[#E2A336]" />
              <h3 className="text-base font-bold text-white">নামাজ ও জামাতের সতর্কতা</h3>
            </div>
            <p className="text-xs text-[#90A8A3] leading-relaxed mb-4">
              আপনার ডিভাইসে ওয়াক্তমতো সতর্কবার্তা ও আযান সক্রিয় রাখতে ব্রাউজারের নোটিফিকেশন পারমিশন অন রাখুন।
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
              নোটিফিকেশন সক্রিয় করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
