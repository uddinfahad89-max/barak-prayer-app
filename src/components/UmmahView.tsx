import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  Plane,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  SlidersHorizontal,
  Hotel,
  ShieldCheck,
  Trash2,
  ChevronRight,
  Info,
  Check,
  UserCheck,
  HeartHandshake,
  User,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { UmrahPackage, UmrahCategory, AppLanguage } from '../types';
import { DEFAULT_UMRAH_PACKAGES } from '../data/defaultUmrahPackages';
import { UmrahPackageFormModal } from './UmrahPackageFormModal';
import { UmrahPackageDetailModal } from './UmrahPackageDetailModal';
import { ImamPortalModal } from './ImamPortalModal';
import { TRANSLATIONS } from '../utils/translations';
import { getUmrahDisplay } from '../utils/portalTranslations';

interface DuaRequest {
  id: string;
  author: string;
  authorBn?: string;
  authorUr?: string;
  location: string;
  locationBn?: string;
  locationUr?: string;
  text: string;
  textBn?: string;
  textUr?: string;
  ameenCount: number;
  hasAmeen: boolean;
  timeAgo: string;
  timeAgoBn?: string;
  timeAgoUr?: string;
}

const INITIAL_DUAS: DuaRequest[] = [
  {
    id: '1',
    author: 'Abdul Karim',
    authorBn: 'আব্দুল করিম',
    authorUr: 'عبد الکریم',
    location: 'Silchar, Assam',
    locationBn: 'শিলচর, আসাম',
    locationUr: 'سلچر، آسام',
    text: 'Requesting heartfelt duas from everyone for my ailing mother’s speedy recovery and long blessed life.',
    textBn: 'আমার অসুস্থ মায়ের দ্রুত আরোগ্য ও দীর্ঘ নেক হায়াতের জন্য সকলের কাছে খাস দোয়ার দরখাস্ত।',
    textUr: 'میری بیمار والدہ کی جلد صحت یابی اور لمبی نیک زندگی کے لیے تمام بھائیوں اور بہنوں سے دعاؤں کی درخواست ہے۔',
    ameenCount: 42,
    hasAmeen: false,
    timeAgo: '10 mins ago',
    timeAgoBn: '১০ মিনিট আগে',
    timeAgoUr: '۱۰ منٹ پہلے',
  },
  {
    id: '2',
    author: 'Muhammad Imran',
    authorBn: 'মুহাম্মাদ ইমরান',
    authorUr: 'محمد عمران',
    location: 'Howrah, West Bengal',
    locationBn: 'হাওড়া, পশ্চিমবঙ্গ',
    locationUr: 'ہاوڑہ، مغربی بنگال',
    text: 'May Allah SWT protect our oppressed brothers, sisters, and orphaned children in Gaza and Palestine, and grant peace. Ameen.',
    textBn: 'আল্লাহ যেন গাজা ও ফিলিস্তিনের মজলুম ভাই-বোন ও এতিম শিশুদের হেফাজতে রাখেন এবং শান্তি ফিরিয়ে দেন। আমিন।',
    textUr: 'اللہ تعالیٰ غزہ اور فلسطین کے مظلوم بھائی بہنوں اور یتیم بچوں کی حفاظت فرمائے اور امن عطا فرمائے۔ آمین۔',
    ameenCount: 156,
    hasAmeen: false,
    timeAgo: '25 mins ago',
    timeAgoBn: '২৫ মিনিট আগে',
    timeAgoUr: '۲۵ منٹ پہلے',
  },
  {
    id: '3',
    author: 'Fatima Khatun',
    authorBn: 'ফাতিমা খাতুন',
    authorUr: 'فاطمہ خاتون',
    location: 'Karimganj, Assam',
    locationBn: 'করিমগঞ্জ, আসাম',
    locationUr: 'کریم گنج، آسام',
    text: 'Seeking prayers for Islamic barakah in our home and moral upbringing and academic success for our children.',
    textBn: 'পরিবারের দ্বীনি বরকত এবং সন্তানের সুন্দর চরিত্র ও পরীক্ষার সাফল্যের জন্য দোয়ার দরখাস্ত রইল।',
    textUr: 'گھر میں دینی برکت اور بچوں کے نیک کردار اور امتحانات میں کامیابی کے لیے خصوصی دعا کی درخواست ہے۔',
    ameenCount: 28,
    hasAmeen: false,
    timeAgo: '1 hour ago',
    timeAgoBn: '১ ঘণ্টা আগে',
    timeAgoUr: '۱ گھنٹہ پہلے',
  },
];

interface UmmahViewProps {
  onAddCoin: (amount: number) => void;
  lang?: AppLanguage;
  onNavigateToMatrimony?: () => void;
}

export const UmmahView: React.FC<UmmahViewProps> = ({
  onAddCoin,
  lang = 'bn',
  onNavigateToMatrimony,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  // Main Sub-Tab: 'umrah' vs 'duas'
  const [activeSubTab, setActiveSubTab] = useState<'umrah' | 'duas'>('umrah');

  // Umrah Packages State with LocalStorage persistence & automatic translation synchronization
  const [packages, setPackages] = useState<UmrahPackage[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_packages_v1');
      if (saved) {
        const parsed: UmrahPackage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge translations from DEFAULT_UMRAH_PACKAGES so old cached objects get localized
          const defaultsMap = new Map(DEFAULT_UMRAH_PACKAGES.map((p) => [p.id, p]));
          return parsed.map((p) => {
            const defaultMatch = defaultsMap.get(p.id);
            if (defaultMatch) {
              return {
                ...defaultMatch,
                ...p,
                companyNameEn: defaultMatch.companyNameEn,
                companyNameUr: defaultMatch.companyNameUr,
                packageTitleEn: defaultMatch.packageTitleEn,
                packageTitleUr: defaultMatch.packageTitleUr,
                departureCityEn: defaultMatch.departureCityEn,
                departureCityUr: defaultMatch.departureCityUr,
                departureMonthOrDateEn: defaultMatch.departureMonthOrDateEn,
                departureMonthOrDateUr: defaultMatch.departureMonthOrDateUr,
                officeLocationEn: defaultMatch.officeLocationEn,
                officeLocationUr: defaultMatch.officeLocationUr,
                makkahHotelEn: defaultMatch.makkahHotelEn,
                makkahHotelUr: defaultMatch.makkahHotelUr,
                madinahHotelEn: defaultMatch.madinahHotelEn,
                madinahHotelUr: defaultMatch.madinahHotelUr,
                inclusionsEn: defaultMatch.inclusionsEn,
                inclusionsUr: defaultMatch.inclusionsUr,
                descriptionEn: defaultMatch.descriptionEn,
                descriptionUr: defaultMatch.descriptionUr,
              };
            }
            return p;
          });
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_UMRAH_PACKAGES;
  });

  // Save packages to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('umrah_packages_v1', JSON.stringify(packages));
    } catch {
      // ignore
    }
  }, [packages]);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [selectedDetailPkg, setSelectedDetailPkg] = useState<UmrahPackage | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<UmrahPackage | null>(null);
  const [isImamPortalOpen, setIsImamPortalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Search & Filter state for Umrah
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | UmrahCategory>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high' | 'duration'>('default');

  // Dua state
  const [duas, setDuas] = useState<DuaRequest[]>(INITIAL_DUAS);
  const [newDuaText, setNewDuaText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');

  // Show temporary toast
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Add new package from agency
  const handleAddPackage = (newPkg: UmrahPackage) => {
    setPackages((prev) => [newPkg, ...prev]);
    onAddCoin(20);
    showToast(
      lang === 'en'
        ? 'MashaAllah! Your Umrah package has been published successfully. (+20 Coins)'
        : lang === 'ur'
        ? 'ماشاءاللہ! آپ کا عمرہ پیکیج شائع ہو گیا۔ (+20 سکے)'
        : 'মাশাআল্লাহ! আপনার উমরাহ প্যাকেজ সফলভাবে লিস্টিং করা হয়েছে। (+২০ কয়েন)'
    );
  };

  // Delete package handler with state
  const confirmDeletePackage = () => {
    if (!packageToDelete) return;
    const targetId = packageToDelete.id;
    setPackages((prev) => prev.filter((p) => p.id !== targetId));
    if (selectedDetailPkg?.id === targetId) {
      setSelectedDetailPkg(null);
    }
    setPackageToDelete(null);
    showToast(
      lang === 'en'
        ? 'Package deleted successfully.'
        : lang === 'ur'
        ? 'پیکیج کامیابی سے حذف کر دیا گیا۔'
        : 'প্যাকেজটি সফলভাবে মুছে ফেলা হয়েছে।'
    );
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    setPackages(DEFAULT_UMRAH_PACKAGES);
    showToast(
      lang === 'en'
        ? 'Default Umrah packages restored.'
        : lang === 'ur'
        ? 'ڈیفالٹ عمرہ پیکیجز بحال کر دیے گئے۔'
        : 'ডিফল্ট উমরাহ প্যাকেজসমূহ পুনরুদ্ধার করা হয়েছে।'
    );
  };

  // Filtered & Sorted Umrah Packages
  const filteredPackages = useMemo(() => {
    return packages
      .filter((pkg) => {
        // Category filter
        if (categoryFilter !== 'all' && pkg.category !== categoryFilter) {
          return false;
        }
        // City filter
        if (cityFilter !== 'all') {
          const c = cityFilter.toLowerCase();
          const matches =
            pkg.departureCity.toLowerCase().includes(c) ||
            pkg.officeLocation.toLowerCase().includes(c) ||
            (pkg.departureCityEn?.toLowerCase().includes(c) ?? false) ||
            (pkg.officeLocationEn?.toLowerCase().includes(c) ?? false);
          if (!matches) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle =
            pkg.packageTitle.toLowerCase().includes(q) ||
            (pkg.packageTitleEn?.toLowerCase().includes(q) ?? false);
          const matchCompany =
            pkg.companyName.toLowerCase().includes(q) ||
            (pkg.companyNameEn?.toLowerCase().includes(q) ?? false);
          const matchCity =
            pkg.departureCity.toLowerCase().includes(q) ||
            (pkg.departureCityEn?.toLowerCase().includes(q) ?? false);
          const matchOffice =
            pkg.officeLocation.toLowerCase().includes(q) ||
            (pkg.officeLocationEn?.toLowerCase().includes(q) ?? false);
          const matchMakkah =
            pkg.makkahHotel.toLowerCase().includes(q) ||
            (pkg.makkahHotelEn?.toLowerCase().includes(q) ?? false);
          const matchMadinah =
            pkg.madinahHotel.toLowerCase().includes(q) ||
            (pkg.madinahHotelEn?.toLowerCase().includes(q) ?? false);
          if (
            !matchTitle &&
            !matchCompany &&
            !matchCity &&
            !matchOffice &&
            !matchMakkah &&
            !matchMadinah
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.pricePerPerson - b.pricePerPerson;
        if (sortBy === 'price_high') return b.pricePerPerson - a.pricePerPerson;
        if (sortBy === 'duration') return a.durationDays - b.durationDays;
        return b.createdAt - a.createdAt;
      });
  }, [packages, categoryFilter, cityFilter, searchQuery, sortBy]);

  // Dua handlers
  const handleAmeen = (id: string) => {
    setDuas((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.hasAmeen;
          if (nextState) onAddCoin(1);
          return {
            ...d,
            ameenCount: d.ameenCount + (nextState ? 1 : -1),
            hasAmeen: nextState,
          };
        }
        return d;
      })
    );
  };

  const handlePostDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuaText.trim()) return;

    const defaultAuthor =
      lang === 'en'
        ? 'A Brother/Sister of Ummah'
        : lang === 'ur'
        ? 'امت کا ایک بھائی/بہن'
        : 'উম্মাহর এক ভাই/বোন';

    const defaultLocation =
      lang === 'en' ? 'India' : lang === 'ur' ? 'ہندوستان' : 'ভারত';

    const defaultTime =
      lang === 'en' ? 'Just now' : lang === 'ur' ? 'ابھی ابھی' : 'এইমাত্র';

    const newEntry: DuaRequest = {
      id: Date.now().toString(),
      author: authorName.trim() || defaultAuthor,
      authorBn: authorName.trim() || 'উম্মাহর এক ভাই/বোন',
      location: defaultLocation,
      text: newDuaText.trim(),
      ameenCount: 1,
      hasAmeen: true,
      timeAgo: defaultTime,
    };

    setDuas([newEntry, ...duas]);
    setNewDuaText('');
    onAddCoin(5);
    showToast(
      lang === 'en'
        ? 'Dua request submitted. May Allah accept it! (+5 Coins)'
        : lang === 'ur'
        ? 'دعا کی درخواست بھیج دی گئی۔ (+5 سکے)'
        : 'দোয়ার আবেদন পাঠানো হয়েছে। আল্লাহ কবুল করুন! (+৫ কয়েন)'
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-20">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#E2A336] text-[#03221F] px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-[#09332E] border border-[#E2A336]/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336] shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {t.umrahPortalTitle}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2A336] text-[#03221F]">
                  {lang === 'en' ? 'Holy Journey' : lang === 'ur' ? 'مقدس سفر' : 'পবিত্র কাফেলা'}
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                {t.umrahPortalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addUmrahPackage}</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Umrah Packages vs Dua Wall */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-800/60">
          <button
            onClick={() => setActiveSubTab('umrah')}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'umrah'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#03221F]/60 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span className="truncate">{t.umrahTab} ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('duas')}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'duas'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#03221F]/60 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="truncate">{t.duaWallTab} ({duas.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: UMRAH PACKAGES ===================== */}
      {activeSubTab === 'umrah' && (
        <div className="space-y-4">
          {/* Mobile "Add Package" banner */}
          <div className="sm:hidden bg-[#072c27] border border-[#E2A336]/30 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-xs text-white">
              <span className="font-bold text-[#E2A336]">
                {lang === 'en' ? 'Umrah Travels Agency?' : lang === 'ur' ? 'عمرہ ٹریول ایجنسی؟' : 'উমরাহ ট্রাভেলস কোম্পানি?'}
              </span>
              <p className="text-[11px] text-emerald-300/80">
                {lang === 'en' ? 'Submit your package details' : lang === 'ur' ? 'اپنے پیکیج کی تفصیلات درج کریں' : 'আপনার প্যাকেজের ডিটেইল পূরণ করুন'}
              </p>
            </div>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#E2A336] text-[#03221F] font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Add Package' : lang === 'ur' ? 'پیکیج دیں' : 'প্যাকেজ দিন'}</span>
            </button>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-[#09332E]/80 border border-emerald-800/60 rounded-2xl p-3.5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  lang === 'en'
                    ? 'Search agency name, city (Silchar, Karimganj, Kolkata) or hotel...'
                    : lang === 'ur'
                    ? 'ایجنسی کا نام، شہر یا ہوٹل تلاش کریں...'
                    : 'এজেন্সির নাম, শহর (শিলচর, করিমগঞ্জ, কলকাতা) বা হোটেল খুঁজুন...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white cursor-pointer"
                >
                  {lang === 'en' ? 'Clear' : lang === 'ur' ? 'صاف کریں' : 'মুছুন'}
                </button>
              )}
            </div>

            {/* Category Pills & Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                {lang === 'en' ? 'All Packages' : lang === 'ur' ? 'تمام پیکیجز' : 'সকল প্যাকেজ'}
              </button>
              <button
                onClick={() => setCategoryFilter('ramadan')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === 'ramadan'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                {lang === 'en' ? '🌙 Ramadan Special' : lang === 'ur' ? '🌙 رمضان اسپیشل' : '🌙 রমজান স্পেশাল'}
              </button>
              <button
                onClick={() => setCategoryFilter('economy')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === 'economy'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                {lang === 'en' ? '🌟 Economy' : lang === 'ur' ? '🌟 معاشی' : '🌟 সাশ্রয়ী ইকোনমি'}
              </button>
              <button
                onClick={() => setCategoryFilter('deluxe')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === 'deluxe'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                {lang === 'en' ? '💎 4-Star Deluxe' : lang === 'ur' ? '💎 ۴-اسٹار ڈیلکس' : '💎 ৪-স্টার ডিলাক্স'}
              </button>
              <button
                onClick={() => setCategoryFilter('vip')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all cursor-pointer ${
                  categoryFilter === 'vip'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                {lang === 'en' ? '👑 5-Star VIP' : lang === 'ur' ? '👑 ۵-اسٹار وی آئی پی' : '👑 ৫-স্টার ভিআইপি'}
              </button>
            </div>

            {/* Departure City & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 text-xs">
              {/* City filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-emerald-400 font-medium shrink-0 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {lang === 'en' ? 'Departure City:' : lang === 'ur' ? 'روانگی کا شہر:' : 'প্রারম্ভিক শহর:'}
                </span>
                {['all', 'শিলচর', 'করিমগঞ্জ', 'গুয়াহাটি', 'কলকাতা'].map((c) => {
                  const cityLabel =
                    c === 'all'
                      ? (lang === 'en' ? 'All Cities' : lang === 'ur' ? 'تمام شہر' : 'সব শহর')
                      : c === 'শিলচর' && lang === 'en' ? 'Silchar'
                      : c === 'করিমগঞ্জ' && lang === 'en' ? 'Karimganj'
                      : c === 'গুয়াহাটি' && lang === 'en' ? 'Guwahati'
                      : c === 'কলকাতা' && lang === 'en' ? 'Kolkata'
                      : c;
                  return (
                    <button
                      key={c}
                      onClick={() => setCityFilter(c)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                        cityFilter === c
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-[#03221F] text-emerald-300 hover:text-white'
                      }`}
                    >
                      {cityLabel}
                    </button>
                  );
                })}
              </div>

              {/* Sort by and Restore Defaults */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-[11px]">
                    {lang === 'en' ? 'Sort:' : lang === 'ur' ? 'ترتیب:' : 'ক্রমানুসার:'}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#03221F] border border-emerald-700/60 text-emerald-100 rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="default">{t.sortNewest || (lang === 'en' ? 'Newest First' : 'নতুন প্যাকেজ আগে')}</option>
                    <option value="price_low">{lang === 'en' ? 'Price: Low to High' : lang === 'ur' ? 'قیمت: کم سے زیادہ' : 'কম খরচ থেকে বেশি'}</option>
                    <option value="price_high">{lang === 'en' ? 'Price: High to Low' : lang === 'ur' ? 'قیمت: زیادہ سے کم' : 'বেশি খরচ থেকে কম'}</option>
                    <option value="duration">{lang === 'en' ? 'Duration: Short to Long' : lang === 'ur' ? 'مدت: کم سے زیادہ' : 'কম দিন থেকে বেশি'}</option>
                  </select>
                </div>

                <button
                  onClick={handleRestoreDefaults}
                  className="p-1 rounded text-emerald-400 hover:text-[#E2A336] hover:bg-emerald-900/40 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  title={lang === 'en' ? 'Restore default packages' : lang === 'ur' ? 'ڈیفالٹ پیکیجز بحال کریں' : 'ডিফল্ট প্যাকেজ ফিরিয়ে আনুন'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[10px]">{lang === 'en' ? 'Restore' : 'রিসেট'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Packages Feed */}
          <div className="space-y-3">
            {filteredPackages.map((pkg) => {
              const display = getUmrahDisplay(pkg, lang);
              const cleanNumber = pkg.whatsappNumber.replace(/[^0-9]/g, '');

              let waText = '';
              if (lang === 'en') {
                waText = encodeURIComponent(
                  `Assalamu Alaikum. I am interested in your '${display.packageTitle}' Umrah package (₹${pkg.pricePerPerson.toLocaleString('en-IN')} per person). Please share more details.`
                );
              } else if (lang === 'ur') {
                waText = encodeURIComponent(
                  `السلام علیکم! میں آپ کے '${display.packageTitle}' عمرہ پیکیج (فی کس ₹${pkg.pricePerPerson.toLocaleString('en-IN')}) کے بارے میں معلومات چاہتا ہوں۔`
                );
              } else {
                waText = encodeURIComponent(
                  `আসসালামু আলাইকুম। আমি আপনাদের '${display.packageTitle}' (₹${pkg.pricePerPerson.toLocaleString('en-IN')}) উমরাহ প্যাকেজ সম্পর্কে জানতে আগ্রহী।`
                );
              }

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedDetailPkg(pkg)}
                  className="bg-[#09332E] border border-emerald-800/70 hover:border-[#E2A336]/60 rounded-2xl p-4 sm:p-5 transition-all shadow-md hover:shadow-xl cursor-pointer group space-y-3 relative"
                >
                  {/* Top Bar: Agency info & Category Badge & Delete Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#03221F] border border-emerald-700 flex items-center justify-center text-[#E2A336] shrink-0 font-bold text-xs mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors">
                            {display.companyName}
                          </h4>
                          {pkg.isCustomSubmission ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-[#03221F] font-bold">
                              {lang === 'en' ? '✨ Your Listing' : lang === 'ur' ? '✨ آپ کی فہرست' : '✨ আপনার লিস্টিং'}
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              {lang === 'en' ? '✓ Verified' : lang === 'ur' ? '✓ تصدیق شدہ' : '✓ অনুমোদিত'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-300/70 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{display.officeLocation}</span>
                          {pkg.licenseNumber && (
                            <span className="text-[10px] text-emerald-400/60 hidden sm:inline">
                              • Lic: {pkg.licenseNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          pkg.category === 'ramadan'
                            ? 'bg-amber-400 text-emerald-950'
                            : pkg.category === 'vip'
                            ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
                            : pkg.category === 'deluxe'
                            ? 'bg-sky-900/80 text-sky-200 border border-sky-500/40'
                            : 'bg-emerald-800 text-emerald-200'
                        }`}
                      >
                        {pkg.category === 'ramadan'
                          ? (lang === 'en' ? '🌙 Ramadan' : lang === 'ur' ? '🌙 رمضان' : '🌙 রমজান')
                          : pkg.category === 'vip'
                          ? (lang === 'en' ? '👑 5-Star' : lang === 'ur' ? '👑 ۵-اسٹار' : '👑 ৫-স্টার')
                          : pkg.category === 'deluxe'
                          ? (lang === 'en' ? '💎 Deluxe' : lang === 'ur' ? '💎 ڈیلکس' : '💎 ডিলাক্স')
                          : (lang === 'en' ? '🌟 Economy' : lang === 'ur' ? '🌟 معاشی' : '🌟 ইকোনমি')}
                      </span>

                      {/* Package Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPackageToDelete(pkg);
                        }}
                        className="p-1 rounded-md text-rose-400/80 hover:text-rose-200 hover:bg-rose-900/50 transition-colors cursor-pointer flex items-center gap-1"
                        title={lang === 'en' ? 'Delete this package' : lang === 'ur' ? 'پیکیج حذف کریں' : 'প্যাকেজটি মুছুন'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] text-rose-300 hidden sm:inline">
                          {lang === 'en' ? 'Delete' : lang === 'ur' ? 'حذف' : 'মুছুন'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Price Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-emerald-800/40">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {display.packageTitle}
                      </h3>
                      <div className="text-[11px] text-emerald-200/80 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-semibold text-[#E2A336]">
                          ⏱️ {pkg.durationDays} {lang === 'en' ? 'Days' : lang === 'ur' ? 'دن' : 'দিন'}
                        </span>
                        <span>•</span>
                        <span>🛫 {lang === 'en' ? 'From:' : lang === 'ur' ? 'روانگی:' : 'প্রারম্ভিক:'} {display.departureCity}</span>
                        <span>•</span>
                        <span>📅 {lang === 'en' ? 'Date:' : lang === 'ur' ? 'تاریخ:' : 'কাফেলা:'} {display.departureMonthOrDate}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-emerald-300/80 block">
                        {lang === 'en' ? 'Total per person' : lang === 'ur' ? 'کل فی کس' : 'সর্বমোট জনপ্রতি'}
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-[#E2A336]">
                        ₹{pkg.pricePerPerson.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Hotels Distances Pill */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#03221F]/80 p-2.5 rounded-xl border border-emerald-800/50 text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Hotel className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <strong>{lang === 'en' ? 'Makkah:' : lang === 'ur' ? 'مکہ:' : 'মক্কা:'}</strong> {display.makkahHotel} (~{pkg.makkahDistanceMeters}{lang === 'en' ? 'm' : 'মি.'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <Hotel className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <strong>{lang === 'en' ? 'Madinah:' : lang === 'ur' ? 'مدینہ:' : 'মদিনা:'}</strong> {display.madinahHotel} (~{pkg.madinahDistanceMeters}{lang === 'en' ? 'm' : 'মি.'})
                      </span>
                    </div>
                  </div>

                  {/* Top Inclusions Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    {display.inclusions.slice(0, 4).map((inc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-700/40 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#E2A336]" />
                        <span>{inc}</span>
                      </span>
                    ))}
                    {display.inclusions.length > 4 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        +{display.inclusions.length - 4} {lang === 'en' ? 'more benefits' : lang === 'ur' ? 'مزید سہولیات' : 'টি সুবিধা'}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons: WhatsApp, Call, View Details */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-800/50 text-xs">
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanNumber}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>{lang === 'en' ? 'WhatsApp' : lang === 'ur' ? 'واٹس ایپ' : 'WhatsApp এ চ্যাট'}</span>
                      </a>

                      <a
                        href={`tel:${pkg.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                        <span className="hidden sm:inline">{t.callDirect}</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedDetailPkg(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredPackages.length === 0 && (
              <div className="text-center py-10 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
                <Plane className="w-10 h-10 text-emerald-500/60 mx-auto" />
                <h4 className="text-base font-bold text-white">{t.noDataFound}</h4>
                <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                  {lang === 'en'
                    ? 'No Umrah packages match your search or filter criteria.'
                    : lang === 'ur'
                    ? 'آپ کی تلاش کے مطابق کوئی عمرہ پیکیج دستیاب نہیں ہے۔'
                    : 'আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো উমরাহ প্যাকেজ এই মুহূর্তে নেই।'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setCityFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs cursor-pointer"
                  >
                    {t.resetFilter}
                  </button>
                  <button
                    onClick={handleRestoreDefaults}
                    className="px-4 py-2 rounded-xl bg-[#03221F] hover:bg-emerald-900/50 border border-emerald-700 text-emerald-200 font-bold text-xs cursor-pointer"
                  >
                    {lang === 'en' ? 'Restore Default Packages' : lang === 'ur' ? 'پیکیجز بحال کریں' : 'ডিফল্ট প্যাকেজ ফেরত আনুন'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================== IMAM, MOSQUE & MATRIMONY SECTION ===================== */}
          <div className="mt-8 pt-6 border-t border-emerald-800/80 space-y-4">
            <div className="bg-gradient-to-br from-[#09332E] via-[#0b3c36] to-[#062420] border border-[#E2A336]/40 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E2A336]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336] shrink-0 font-bold">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {t.matrimonyPortalTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                        {t.newBadge}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      {t.matrimonyPortalSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToMatrimony) onNavigateToMatrimony();
                    else setIsImamPortalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{lang === 'en' ? 'Open Full Portal' : lang === 'ur' ? 'مکمل پورٹل کھولیں' : 'সম্পূর্ণ পোর্টাল খুলুন'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Direct Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative z-10">
                {/* Card 1: Matrimony */}
                <div
                  onClick={() => {
                    if (onNavigateToMatrimony) onNavigateToMatrimony();
                    else setIsImamPortalOpen(true);
                  }}
                  className="bg-[#03221F]/80 hover:bg-[#03221F] border border-emerald-700/60 hover:border-[#E2A336] p-3.5 rounded-xl cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E2A336] transition-colors">
                      {t.subtabMatrimony}
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    {t.subtabMatrimonyDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>{t.viewDetails}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 2: Mosque Vacancies */}
                <div
                  onClick={() => {
                    if (onNavigateToMatrimony) onNavigateToMatrimony();
                    else setIsImamPortalOpen(true);
                  }}
                  className="bg-[#03221F]/80 hover:bg-[#03221F] border border-emerald-700/60 hover:border-[#E2A336] p-3.5 rounded-xl cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E2A336] transition-colors">
                      {t.subtabMosques}
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    {t.subtabMosquesDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>{t.viewDetails}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 3: Imam Biodatas */}
                <div
                  onClick={() => {
                    if (onNavigateToMatrimony) onNavigateToMatrimony();
                    else setIsImamPortalOpen(true);
                  }}
                  className="bg-[#03221F]/80 hover:bg-[#03221F] border border-emerald-700/60 hover:border-[#E2A336] p-3.5 rounded-xl cursor-pointer transition-all shadow-sm group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E2A336] transition-colors">
                      {t.subtabImams}
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    {t.subtabImamsDesc}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>{t.viewDetails}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: DUA WALL ===================== */}
      {activeSubTab === 'duas' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Post a Dua Card */}
          <form
            onSubmit={handlePostDua}
            className="bg-[#09332E] border border-emerald-800/60 rounded-2xl p-4 space-y-3 shadow-md"
          >
            <div className="text-xs font-bold text-[#E2A336] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'en'
                  ? 'Submit your prayer / Dua request:'
                  : lang === 'ur'
                  ? 'اپنی دعا کی درخواست بھیجیں:'
                  : 'আপনার দোয়ার আবেদন জানান:'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Your name (optional)' : lang === 'ur' ? 'آپ کا نام (اختیاری)' : 'আপনার নাম (ঐচ্ছিক)'}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#E2A336]"
              />
              <textarea
                rows={2}
                placeholder={
                  lang === 'en'
                    ? 'Write what you would like the Ummah to pray for...'
                    : lang === 'ur'
                    ? 'دعا کی درخواست لکھیں...'
                    : 'কী বিষয়ে উম্মাহর দোয়া চান তা লিখুন...'
                }
                value={newDuaText}
                onChange={(e) => setNewDuaText(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#E2A336] resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#E2A336] hover:bg-yellow-400 text-[#03221F] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en'
                    ? 'Submit Dua Request (+5 Coins)'
                    : lang === 'ur'
                    ? 'دعا کی درخواست بھیجیں (+5 سکے)'
                    : 'দোয়ার আবেদন পাঠান (+৫ কয়েন)'}
                </span>
              </button>
            </div>
          </form>

          {/* Dua Feed */}
          <div className="space-y-3">
            {duas.map((item) => {
              const authorDisplay =
                lang === 'bn' ? (item.authorBn || item.author) : lang === 'ur' ? (item.authorUr || item.author) : item.author;
              const locationDisplay =
                lang === 'bn' ? (item.locationBn || item.location) : lang === 'ur' ? (item.locationUr || item.location) : item.location;
              const textDisplay =
                lang === 'bn' ? (item.textBn || item.text) : lang === 'ur' ? (item.textUr || item.text) : item.text;
              const timeDisplay =
                lang === 'bn' ? (item.timeAgoBn || item.timeAgo) : lang === 'ur' ? (item.timeAgoUr || item.timeAgo) : item.timeAgo;

              return (
                <div
                  key={item.id}
                  className="bg-[#09332E] border border-emerald-800/60 hover:border-[#E2A336]/40 rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#03221F] border border-[#E2A336]/30 text-[#E2A336] flex items-center justify-center font-bold text-xs">
                        {authorDisplay.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{authorDisplay}</h4>
                        <span className="text-[10px] text-emerald-300/70">
                          {locationDisplay} • {timeDisplay}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-200 leading-relaxed my-2">{textDisplay}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40">
                    <span className="text-[10px] text-emerald-300/80 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E2A336]" />
                      {item.ameenCount}{' '}
                      {lang === 'en'
                        ? 'people said Ameen'
                        : lang === 'ur'
                        ? 'لوگوں نے آمین کہا'
                        : 'জন আমিন বলেছেন'}
                    </span>

                    <button
                      onClick={() => handleAmeen(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.hasAmeen
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-[#03221F] text-emerald-300 hover:text-white border border-emerald-700/50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.hasAmeen ? 'fill-white' : ''}`} />
                      <span>
                        {item.hasAmeen
                          ? (lang === 'en' ? 'Ameen Said' : lang === 'ur' ? 'آمین کہہ دیا' : 'আমিন বলা হয়েছে')
                          : (lang === 'en' ? 'Say Ameen' : lang === 'ur' ? 'آمین' : 'আমিন')}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation In-App Modal (Safe for iframes) */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#03221F] border border-rose-600/70 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'en'
                    ? 'Delete Umrah Package?'
                    : lang === 'ur'
                    ? 'عمرہ پیکیج حذف کریں؟'
                    : 'উমরাহ প্যাকেজটি মুছে ফেলতে চান?'}
                </h3>
                <p className="text-xs text-rose-300/80">
                  {lang === 'en'
                    ? 'Are you sure you want to delete this package from the listing?'
                    : lang === 'ur'
                    ? 'کیا آپ واقعی اس پیکیج کو لسٹنگ سے ہٹانا چاہتے ہیں؟'
                    : 'আপনি কি নিশ্চিত যে এই প্যাকেজটি তালিকা থেকে সরিয়ে ফেলতে চান?'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#09332E] rounded-xl border border-emerald-800/60 text-xs text-white space-y-1">
              <div className="font-bold text-[#E2A336]">
                {getUmrahDisplay(packageToDelete, lang).packageTitle}
              </div>
              <div className="text-emerald-300/80 text-[11px]">
                {getUmrahDisplay(packageToDelete, lang).companyName} • ₹{packageToDelete.pricePerPerson.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 rounded-xl bg-[#09332E] hover:bg-emerald-900/60 text-emerald-200 font-semibold text-xs transition-colors cursor-pointer border border-emerald-700/50"
              >
                {lang === 'en' ? 'Cancel' : lang === 'ur' ? 'منسوخ' : 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={confirmDeletePackage}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Yes, Delete' : lang === 'ur' ? 'ہاں، حذف کریں' : 'হ্যাঁ, মুছুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agency Package Registration Modal */}
      <UmrahPackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSavePackage={handleAddPackage}
        lang={lang}
      />

      {/* Package Detail View Modal */}
      <UmrahPackageDetailModal
        isOpen={Boolean(selectedDetailPkg)}
        onClose={() => setSelectedDetailPkg(null)}
        pkg={selectedDetailPkg}
        lang={lang}
        onDeletePackage={(id) => {
          const pkg = packages.find((p) => p.id === id);
          if (pkg) setPackageToDelete(pkg);
        }}
      />

      {/* Imam Recruitment & Mosque Vacancies Modal */}
      <ImamPortalModal
        isOpen={isImamPortalOpen}
        onClose={() => setIsImamPortalOpen(false)}
        onAddCoin={onAddCoin}
        lang={lang}
      />
    </div>
  );
};
