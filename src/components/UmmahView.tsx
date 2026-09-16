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
} from 'lucide-react';
import { UmrahPackage, UmrahCategory, AppLanguage } from '../types';
import { DEFAULT_UMRAH_PACKAGES } from '../data/defaultUmrahPackages';
import { UmrahPackageFormModal } from './UmrahPackageFormModal';
import { UmrahPackageDetailModal } from './UmrahPackageDetailModal';
import { ImamPortalModal } from './ImamPortalModal';

interface DuaRequest {
  id: string;
  author: string;
  location: string;
  text: string;
  ameenCount: number;
  hasAmeen: boolean;
  timeAgo: string;
}

const INITIAL_DUAS: DuaRequest[] = [
  {
    id: '1',
    author: 'আব্দুল করিম',
    location: 'শিলচর, আসাম',
    text: 'আমার অসুস্থ মায়ের দ্রুত আরোগ্য ও দীর্ঘ নেক হায়াতের জন্য সকলের কাছে খাস দোয়ার দরখাস্ত।',
    ameenCount: 42,
    hasAmeen: false,
    timeAgo: '১০ মিনিট আগে',
  },
  {
    id: '2',
    author: 'মুহাম্মাদ ইমরান',
    location: 'হাওড়া, পশ্চিমবঙ্গ',
    text: 'আল্লাহ যেন গাজা ও ফিলিস্তিনের মজলুম ভাই-বোন ও এতিম শিশুদের হেফাজতে রাখেন এবং শান্তি ফিরিয়ে দেন। আমিন।',
    ameenCount: 156,
    hasAmeen: false,
    timeAgo: '২৫ মিনিট আগে',
  },
  {
    id: '3',
    author: 'ফাতিমা খাতুন',
    location: 'করিমগঞ্জ, আসাম',
    text: 'পরিবারের দ্বীনি বরকত এবং সন্তানের সুন্দর চরিত্র ও পরীক্ষার সাফল্যের জন্য দোয়ার দরখাস্ত রইল।',
    ameenCount: 28,
    hasAmeen: false,
    timeAgo: '১ ঘণ্টা আগে',
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
  // Main Sub-Tab: 'umrah' vs 'duas'
  const [activeSubTab, setActiveSubTab] = useState<'umrah' | 'duas'>('umrah');

  // Umrah Packages State with LocalStorage persistence
  const [packages, setPackages] = useState<UmrahPackage[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_packages_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
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
    showToast('মাশাআল্লাহ! আপনার উমরাহ প্যাকেজ সফলভাবে লিস্টিং করা হয়েছে। (+২০ কয়েন)');
  };

  // Delete package (if added by user)
  const handleDeletePackage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই উমরাহ প্যাকেজটি মুছে ফেলতে চান?')) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
      showToast('প্যাকেজটি সফলভাবে মুছে ফেলা হয়েছে।');
    }
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
            pkg.officeLocation.toLowerCase().includes(c);
          if (!matches) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = pkg.packageTitle.toLowerCase().includes(q);
          const matchCompany = pkg.companyName.toLowerCase().includes(q);
          const matchCity = pkg.departureCity.toLowerCase().includes(q);
          const matchOffice = pkg.officeLocation.toLowerCase().includes(q);
          const matchMakkah = pkg.makkahHotel.toLowerCase().includes(q);
          const matchMadinah = pkg.madinahHotel.toLowerCase().includes(q);
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

    const newEntry: DuaRequest = {
      id: Date.now().toString(),
      author: authorName.trim() || 'উম্মাহর এক ভাই/বোন',
      location: 'ভারত',
      text: newDuaText.trim(),
      ameenCount: 1,
      hasAmeen: true,
      timeAgo: 'এইমাত্র',
    };

    setDuas([newEntry, ...duas]);
    setNewDuaText('');
    onAddCoin(5);
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
                  উমরাহ প্যাকেজ ও উম্মাহ প্ল্যাটফর্ম
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2A336] text-[#03221F]">
                  পবিত্র কাফেলা
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                উমরাহ ট্রাভেলস কোম্পানির প্যাকেজসমূহ ও বিশ্বস্ত এজেন্সির সাথে সরাসরি বুকিং
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>এজেন্সির প্যাকেজ যোগ করুন</span>
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
            <span className="truncate">উমরাহ প্যাকেজ ({packages.length})</span>
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
            <span className="truncate">উম্মাহ দোয়া ওয়াল ({duas.length})</span>
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: UMRAH PACKAGES ===================== */}
      {activeSubTab === 'umrah' && (
        <div className="space-y-4">
          {/* Mobile "Add Package" banner */}
          <div className="sm:hidden bg-[#072c27] border border-[#E2A336]/30 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-xs text-white">
              <span className="font-bold text-[#E2A336]">উমরাহ ট্রাভেলস কোম্পানি?</span>
              <p className="text-[11px] text-emerald-300/80">আপনার প্যাকেজের ডিটেইল পূরণ করুন</p>
            </div>
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#E2A336] text-[#03221F] font-bold text-xs flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>প্যাকেজ দিন</span>
            </button>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-[#09332E]/80 border border-emerald-800/60 rounded-2xl p-3.5 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="এজেন্সির নাম, শহর (শিলচর, করিমগঞ্জ, কলকাতা) বা হোটেল খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white"
                >
                  মুছুন
                </button>
              )}
            </div>

            {/* Category Pills & Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                সকল প্যাকেজ
              </button>
              <button
                onClick={() => setCategoryFilter('ramadan')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  categoryFilter === 'ramadan'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                🌙 রমজান স্পেশাল
              </button>
              <button
                onClick={() => setCategoryFilter('economy')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  categoryFilter === 'economy'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                🌟 সাশ্রয়ী ইকোনমি
              </button>
              <button
                onClick={() => setCategoryFilter('deluxe')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  categoryFilter === 'deluxe'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                💎 ৪-স্টার ডিলাক্স
              </button>
              <button
                onClick={() => setCategoryFilter('vip')}
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                  categoryFilter === 'vip'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'bg-[#03221F] text-emerald-200 border border-emerald-800/60 hover:bg-emerald-800/40'
                }`}
              >
                👑 ৫-স্টার ভিআইপি
              </button>
            </div>

            {/* Departure City & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 text-xs">
              {/* City filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-emerald-400 font-medium shrink-0 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> প্রারম্ভিক শহর:
                </span>
                {['all', 'শিলচর', 'করিমগঞ্জ', 'গুয়াহাটি', 'কলকাতা'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium shrink-0 transition-all ${
                      cityFilter === c
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-[#03221F] text-emerald-300 hover:text-white'
                    }`}
                  >
                    {c === 'all' ? 'সব শহর' : c}
                  </button>
                ))}
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                <span className="text-emerald-400 text-[11px]">ক্রমানুসার:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#03221F] border border-emerald-700/60 text-emerald-100 rounded-lg px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="default">নতুন প্যাকেজ আগে</option>
                  <option value="price_low">কম খরচ থেকে বেশি</option>
                  <option value="price_high">বেশি খরচ থেকে কম</option>
                  <option value="duration">কম দিন থেকে বেশি</option>
                </select>
              </div>
            </div>
          </div>

          {/* Packages Feed */}
          <div className="space-y-3">
            {filteredPackages.map((pkg) => {
              const cleanNumber = pkg.whatsappNumber.replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `আসসালামু আলাইকুম। আমি আপনাদের '${pkg.packageTitle}' (₹${pkg.pricePerPerson.toLocaleString('en-IN')}) উমরাহ প্যাকেজ সম্পর্কে জানতে আগ্রহী।`
              );

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedDetailPkg(pkg)}
                  className="bg-[#09332E] border border-emerald-800/70 hover:border-[#E2A336]/60 rounded-2xl p-4 sm:p-5 transition-all shadow-md hover:shadow-xl cursor-pointer group space-y-3 relative"
                >
                  {/* Top Bar: Agency info & Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#03221F] border border-emerald-700 flex items-center justify-center text-[#E2A336] shrink-0 font-bold text-xs mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors">
                            {pkg.companyName}
                          </h4>
                          {pkg.isCustomSubmission ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-[#03221F] font-bold">
                              ✨ আপনার লিস্টিং
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              ✓ অনুমোদিত
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-emerald-300/70 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{pkg.officeLocation}</span>
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
                          ? '🌙 রমজান'
                          : pkg.category === 'vip'
                          ? '👑 ৫-স্টার'
                          : pkg.category === 'deluxe'
                          ? '💎 ডিলাক্স'
                          : '🌟 ইকোনমি'}
                      </span>

                      {/* If added by user, show delete button */}
                      {pkg.isCustomSubmission && (
                        <button
                          onClick={(e) => handleDeletePackage(pkg.id, e)}
                          className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 transition-colors"
                          title="প্যাকেজটি মুছুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Price Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-emerald-800/40">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {pkg.packageTitle}
                      </h3>
                      <div className="text-[11px] text-emerald-200/80 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="font-semibold text-[#E2A336]">
                          ⏱️ {pkg.durationDays} দিন
                        </span>
                        <span>•</span>
                        <span>🛫 প্রারম্ভিক: {pkg.departureCity}</span>
                        <span>•</span>
                        <span>📅 কাফেলা: {pkg.departureMonthOrDate}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[10px] text-emerald-300/80 block">সর্বমোট জনপ্রতি</span>
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
                        <strong>মক্কা:</strong> {pkg.makkahHotel} (~{pkg.makkahDistanceMeters}মি.)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <Hotel className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        <strong>মদিনা:</strong> {pkg.madinahHotel} (~{pkg.madinahDistanceMeters}মি.)
                      </span>
                    </div>
                  </div>

                  {/* Top Inclusions Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    {pkg.inclusions.slice(0, 4).map((inc, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-700/40 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#E2A336]" />
                        <span>{inc}</span>
                      </span>
                    ))}
                    {pkg.inclusions.length > 4 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        +{pkg.inclusions.length - 4} টি সুবিধা
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
                        <span>WhatsApp এ চ্যাট</span>
                      </a>

                      <a
                        href={`tel:${pkg.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                        <span className="hidden sm:inline">কল করুন</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedDetailPkg(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>বিস্তারিত</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredPackages.length === 0 && (
              <div className="text-center py-10 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
                <Plane className="w-10 h-10 text-emerald-500/60 mx-auto" />
                <h4 className="text-base font-bold text-white">কোন প্যাকেজ পাওয়া যায়নি</h4>
                <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                  আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো উমরাহ প্যাকেজ এই মুহূর্তে নেই।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setCityFilter('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            )}
          </div>

          {/* ===================== IMAM, MOSQUE & MATRIMONY SECTION (উমরাহ প্যাকেজগুলোর একদম নিচে) ===================== */}
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
                        ইমাম নিযুক্তি, মসজিদ ও দ্বীনি পাত্র-পাত্রী পোর্টাল
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                        নতুন সেবা
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/90 mt-0.5">
                      উমরাহের পর দ্বীনি উম্মাহর সেবায় ইমাম নিযুক্তি এবং শরীয়াহসম্মত সুন্নতি বিবাহের বায়োডাটা
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
                  <span>সম্পূর্ণ পোর্টাল খুলুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Direct Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative z-10">
                {/* Card 1: Matrimony (পাত্র-পাত্রী) */}
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
                      দ্বীনি পাত্র-পাত্রী (নিকাহ)
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    বর ও কনের শরীয়াহসম্মত ইসলামিক বায়োডাটা ও অভিভাবকদের সাথে যোগাযোগ
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>বায়োডাটা দেখুন</span>
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
                      মসজিদের নিয়োগ বিজ্ঞপ্তি
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    মসজিদ কমিটির জন্য যোগ্য খতীব, ইমাম, মুয়াজ্জিন ও শিক্ষক নিযুক্তি
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>বিজ্ঞপ্তি দেখুন</span>
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
                      ইমাম সাহেবের বায়োডাটা
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-300/80 leading-snug">
                    হাফেজ ও আলেম সাহেবদের মসজিদের খেদমতের আবেদন ও বায়োডাটা
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[11px] text-[#E2A336] font-bold">
                    <span>বায়োডাটা দেখুন</span>
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
              <span>আপনার দোয়ার আবেদন জানান:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                placeholder="আপনার নাম (ঐচ্ছিক)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-emerald-400/50 focus:outline-none focus:border-[#E2A336]"
              />
              <textarea
                rows={2}
                placeholder="কী বিষয়ে উম্মাহর দোয়া চান তা লিখুন..."
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
                <span>দোয়ার আবেদন পাঠান (+৫ কয়েন)</span>
              </button>
            </div>
          </form>

          {/* Dua Feed */}
          <div className="space-y-3">
            {duas.map((item) => (
              <div
                key={item.id}
                className="bg-[#09332E] border border-emerald-800/60 hover:border-[#E2A336]/40 rounded-2xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#03221F] border border-[#E2A336]/30 text-[#E2A336] flex items-center justify-center font-bold text-xs">
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.author}</h4>
                      <span className="text-[10px] text-emerald-300/70">
                        {item.location} • {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-stone-200 leading-relaxed my-2">{item.text}</p>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40">
                  <span className="text-[10px] text-emerald-300/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E2A336]" />
                    {item.ameenCount} জন আমিন বলেছেন
                  </span>

                  <button
                    onClick={() => handleAmeen(item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                      item.hasAmeen
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-[#03221F] text-emerald-300 hover:text-white border border-emerald-700/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.hasAmeen ? 'fill-white' : ''}`} />
                    <span>{item.hasAmeen ? 'আমিন বলা হয়েছে' : 'আমিন'}</span>
                  </button>
                </div>
              </div>
            ))}
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
