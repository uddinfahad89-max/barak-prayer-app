import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  User,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  Search,
  Plus,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Trash2,
  Edit3,
  CheckCircle2,
  SlidersHorizontal,
  Share2,
} from 'lucide-react';
import { ImamBiodata, MosqueVacancy, AppLanguage } from '../types';
import { DEFAULT_IMAM_BIODATAS, DEFAULT_MOSQUE_VACANCIES } from '../data/defaultImamData';
import { ImamBiodataFormModal } from './ImamBiodataFormModal';
import { MosqueVacancyFormModal } from './MosqueVacancyFormModal';
import { ImamBiodataDetailModal } from './ImamBiodataDetailModal';
import { MosqueVacancyDetailModal } from './MosqueVacancyDetailModal';

interface ImamPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoin?: (amount: number) => void;
  lang?: AppLanguage;
}

export const ImamPortalModal: React.FC<ImamPortalModalProps> = ({
  isOpen,
  onClose,
  onAddCoin,
  lang = 'bn',
}) => {
  // Main Sub-Tab: 'mosques' (vacancies) vs 'imams' (biodatas)
  const [activeTab, setActiveTab] = useState<'mosques' | 'imams'>('mosques');

  // Imam Biodatas state with LocalStorage
  const [imams, setImams] = useState<ImamBiodata[]>(() => {
    try {
      const saved = localStorage.getItem('imam_biodatas_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_IMAM_BIODATAS;
  });

  // Mosque Vacancies state with LocalStorage
  const [vacancies, setVacancies] = useState<MosqueVacancy[]>(() => {
    try {
      const saved = localStorage.getItem('mosque_vacancies_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MOSQUE_VACANCIES;
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('imam_biodatas_v1', JSON.stringify(imams));
    } catch {
      // ignore
    }
  }, [imams]);

  useEffect(() => {
    try {
      localStorage.setItem('mosque_vacancies_v1', JSON.stringify(vacancies));
    } catch {
      // ignore
    }
  }, [vacancies]);

  // Modals state
  const [isImamFormOpen, setIsImamFormOpen] = useState(false);
  const [isMosqueFormOpen, setIsMosqueFormOpen] = useState(false);
  const [editingImam, setEditingImam] = useState<ImamBiodata | null>(null);
  const [editingVacancy, setEditingVacancy] = useState<MosqueVacancy | null>(null);
  const [selectedImamDetail, setSelectedImamDetail] = useState<ImamBiodata | null>(null);
  const [selectedVacancyDetail, setSelectedVacancyDetail] = useState<MosqueVacancy | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'salary_high' | 'salary_low'>('newest');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSaveImam = (savedImam: ImamBiodata) => {
    setImams((prev) => {
      const exists = prev.some((item) => item.id === savedImam.id);
      if (exists) {
        return prev.map((item) => (item.id === savedImam.id ? savedImam : item));
      }
      return [savedImam, ...prev];
    });
    if (selectedImamDetail && selectedImamDetail.id === savedImam.id) {
      setSelectedImamDetail(savedImam);
    }
    const isEditing = !!editingImam;
    setEditingImam(null);
    if (!isEditing && onAddCoin) onAddCoin(20);
    showToast(
      isEditing
        ? (lang === 'en' ? 'Biodata updated successfully!' : 'ইমাম সাহেবের বায়োডাটা সফলভাবে আপডেট করা হয়েছে।')
        : (lang === 'en' ? 'Biodata published successfully! (+20 Coins)' : 'মাশাআল্লাহ! আপনার বায়োডাটা সফলভাবে যুক্ত হয়েছে। (+২০ কয়েন)')
    );
  };

  const handleSaveVacancy = (savedVac: MosqueVacancy) => {
    setVacancies((prev) => {
      const exists = prev.some((item) => item.id === savedVac.id);
      if (exists) {
        return prev.map((item) => (item.id === savedVac.id ? savedVac : item));
      }
      return [savedVac, ...prev];
    });
    if (selectedVacancyDetail && selectedVacancyDetail.id === savedVac.id) {
      setSelectedVacancyDetail(savedVac);
    }
    const isEditing = !!editingVacancy;
    setEditingVacancy(null);
    if (!isEditing && onAddCoin) onAddCoin(20);
    showToast(
      isEditing
        ? (lang === 'en' ? 'Vacancy post updated successfully!' : 'নিয়োগ বিজ্ঞপ্তিটি সফলভাবে আপডেট করা হয়েছে।')
        : (lang === 'en' ? 'Vacancy post published successfully! (+20 Coins)' : 'আলহামদুলিল্লাহ! মসজিদের নিয়োগ বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে। (+২০ কয়েন)')
    );
  };

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'imam' | 'vacancy'; id: string; title: string } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'imam') {
      setImams((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedImamDetail && selectedImamDetail.id === deleteTarget.id) {
        setSelectedImamDetail(null);
      }
      showToast(lang === 'en' ? 'Biodata deleted successfully.' : 'বায়োডাটা মুছে ফেলা হয়েছে।');
    } else {
      setVacancies((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedVacancyDetail && selectedVacancyDetail.id === deleteTarget.id) {
        setSelectedVacancyDetail(null);
      }
      showToast(lang === 'en' ? 'Vacancy post deleted successfully.' : 'বিজ্ঞপ্তিটি মুছে ফেলা হয়েছে।');
    }
    setDeleteTarget(null);
  };

  // Filtered Mosque Vacancies
  const filteredVacancies = useMemo(() => {
    return vacancies
      .filter((v) => {
        if (districtFilter !== 'all') {
          const match =
            v.district.toLowerCase().includes(districtFilter.toLowerCase()) ||
            v.area.toLowerCase().includes(districtFilter.toLowerCase());
          if (!match) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMosque = v.mosqueName.toLowerCase().includes(q);
          const matchArea = v.area.toLowerCase().includes(q);
          const matchPos = v.position.toLowerCase().includes(q);
          const matchQual = v.requiredQualification.toLowerCase().includes(q);
          if (!matchMosque && !matchArea && !matchPos && !matchQual) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary_high') return b.offeredSalary - a.offeredSalary;
        if (sortBy === 'salary_low') return a.offeredSalary - b.offeredSalary;
        return b.createdAt - a.createdAt;
      });
  }, [vacancies, districtFilter, searchQuery, sortBy]);

  // Filtered Imams
  const filteredImams = useMemo(() => {
    return imams
      .filter((im) => {
        if (districtFilter !== 'all') {
          const match =
            im.currentLocation.toLowerCase().includes(districtFilter.toLowerCase()) ||
            im.preferredLocation.toLowerCase().includes(districtFilter.toLowerCase());
          if (!match) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = im.fullName.toLowerCase().includes(q);
          const matchTitle = im.title.toLowerCase().includes(q);
          const matchQual = im.qualification.toLowerCase().includes(q);
          const matchLoc = im.currentLocation.toLowerCase().includes(q);
          if (!matchName && !matchTitle && !matchQual && !matchLoc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary_high') return b.expectedSalary - a.expectedSalary;
        if (sortBy === 'salary_low') return a.expectedSalary - b.expectedSalary;
        return b.createdAt - a.createdAt;
      });
  }, [imams, districtFilter, searchQuery, sortBy]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 bg-[#E2A336] text-[#03221F] px-4 py-2 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-[#09332E] border-b border-emerald-800/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  ইমাম নিযুক্তি ও বায়োডাটা পোর্টাল
                </h3>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                  সেবা
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                মসজিদ কমিটির জন্য ইমাম খোঁজা এবং ইমাম সাহেবদের জন্য উপযুক্ত মসজিদ খেদমত
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Action CTAs Bar */}
        <div className="px-4 py-3 bg-[#072a25] border-b border-emerald-800/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="text-xs text-emerald-200">
            <span className="font-bold text-[#E2A336]">আপনি কি তথ্য যুক্ত করতে চান?</span>
            <p className="text-[11px] text-emerald-300/70">ইমাম বা মসজিদ কমিটি সরাসরি বায়োডাটা দিতে পারেন</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImamFormOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>ইমামের বায়োডাটা দিন</span>
            </button>

            <button
              onClick={() => setIsMosqueFormOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer border border-emerald-500/30"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>মসজিদের নিয়োগ দিন</span>
            </button>
          </div>
        </div>

        {/* Main Sub-Tabs: Mosque Vacancies vs Imams Biodata */}
        <div className="grid grid-cols-2 gap-2 px-4 pt-3 bg-[#03221F]">
          <button
            onClick={() => setActiveTab('mosques')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'mosques'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#09332E] text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>মসজিদের নিয়োগ বিজ্ঞপ্তি ({vacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('imams')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'imams'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#09332E] text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ইমাম সাহেবদের বায়োডাটা ({imams.length})</span>
          </button>
        </div>

        {/* Search & Location Filter Toolbar */}
        <div className="px-4 py-2.5 bg-[#03221F] space-y-2 border-b border-emerald-800/40">
          <div className="relative">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === 'mosques'
                  ? 'মসজিদের নাম, এলাকা (শিলচর, সোনাই, করিমগঞ্জ) বা পদ দিয়ে খুঁজুন...'
                  : 'ইমাম সাহেবের নাম, পদবী (হাফেজ, মুফতী), বা জেলা দিয়ে খুঁজুন...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#09332E] border border-emerald-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
            {/* District filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
              <span className="text-emerald-400 font-medium shrink-0 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> এলাকা:
              </span>
              {['all', 'শিলচর', 'কাছাড়', 'করিমগঞ্জ', 'হাইলাকান্দি', 'আসাম'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDistrictFilter(d)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                    districtFilter === d
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'bg-[#09332E] text-emerald-300 hover:text-white border border-emerald-800/40'
                  }`}
                >
                  {d === 'all' ? 'সব এলাকা' : d}
                </button>
              ))}
            </div>

            {/* Sort by */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
              <span className="text-emerald-400 text-[11px]">ক্রমানুসার:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#09332E] border border-emerald-700/60 text-emerald-100 rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                <option value="newest">নতুন আগে</option>
                <option value="salary_high">বেশি হাদিয়া আগে</option>
                <option value="salary_low">কম হাদিয়া আগে</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Content Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* ================= SECTION 1: MOSQUE VACANCIES ================= */}
          {activeTab === 'mosques' && (
            <div className="space-y-3">
              {filteredVacancies.map((vac) => {
                const cleanNumber = vac.whatsappNumber.replace(/[^0-9]/g, '');
                const waText = encodeURIComponent(
                  `আসসালামু আলাইকুম। আপনাদের '${vac.mosqueName}' (${vac.area}, ${vac.district}) এর '${vac.position}' পদের নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি।`
                );

                return (
                  <div
                    key={vac.id}
                    onClick={() => setSelectedVacancyDetail(vac)}
                    className="bg-[#09332E] border border-emerald-800/70 hover:border-[#E2A336]/60 rounded-2xl p-4 transition-all shadow-md hover:shadow-xl cursor-pointer group space-y-2.5 relative"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#03221F] border border-emerald-700 flex items-center justify-center text-[#E2A336] shrink-0 font-bold text-xs mt-0.5">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors">
                              {vac.mosqueName}
                            </h4>
                            {vac.isCustomSubmission && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-[#03221F] font-bold">
                                ✨ আপনার বিজ্ঞপ্তি
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>
                              {vac.area}, {vac.district}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                          {vac.position}
                        </span>

                        {vac.isCustomSubmission && (
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setEditingVacancy(vac);
                                setIsMosqueFormOpen(true);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-[#03221F] bg-[#E2A336] hover:bg-[#c98e2a] transition-all cursor-pointer flex items-center gap-0.5"
                              title={lang === 'en' ? 'Edit post' : 'বিজ্ঞপ্তি এডিট'}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Edit' : 'এডিট'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget({ type: 'vacancy', id: vac.id, title: vac.mosqueName });
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 transition-colors cursor-pointer"
                              title={lang === 'en' ? 'Delete post' : 'বিজ্ঞপ্তি মুছুন'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Salary & Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-emerald-800/40">
                      <div>
                        <div className="text-xs text-white font-semibold">
                          যোগ্যতা: <span className="text-emerald-200">{vac.requiredQualification}</span>
                        </div>
                        <div className="text-[11px] text-emerald-300/80 mt-0.5">
                          অভিজ্ঞতা: {vac.experienceRequired} • যোগদান: <strong>{vac.joiningDeadline}</strong>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-emerald-300/80 block">মাসিক হাদিয়া / বেতন</span>
                        <div className="text-lg sm:text-xl font-black text-[#E2A336]">
                          ₹{vac.offeredSalary.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Facilities Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      {vac.facilitiesOffered.slice(0, 3).map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-700/40 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#E2A336]" />
                          <span>{fac}</span>
                        </span>
                      ))}
                      {vac.facilitiesOffered.length > 3 && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          +{vac.facilitiesOffered.length - 3} টি সুবিধা
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
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
                          <span>WhatsApp আবেদন</span>
                        </a>

                        <a
                          href={`tel:${vac.contactPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                          <span className="hidden sm:inline">কল করুন</span>
                        </a>
                      </div>

                      <button
                        onClick={() => setSelectedVacancyDetail(vac)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>বিজ্ঞপ্তি দেখুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredVacancies.length === 0 && (
                <div className="text-center py-10 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
                  <Building2 className="w-10 h-10 text-emerald-500/60 mx-auto" />
                  <h4 className="text-base font-bold text-white">কোন মসজিদের বিজ্ঞপ্তি পাওয়া যায়নি</h4>
                  <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                    আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো মসজিদের নিয়োগ বিজ্ঞপ্তি এই মুহূর্তে নেই।
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDistrictFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs"
                  >
                    ফিল্টার রিসেট করুন
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= SECTION 2: IMAMS BIODATAS ================= */}
          {activeTab === 'imams' && (
            <div className="space-y-3">
              {filteredImams.map((im) => {
                const cleanNumber = im.whatsappNumber.replace(/[^0-9]/g, '');
                const waText = encodeURIComponent(
                  `আসসালামু আলাইকুম হযরত। আমরা আপনার '${im.fullName}' (${im.title}) ইমামতির বায়োডাটা দেখে যোগাযোগ করছি।`
                );

                return (
                  <div
                    key={im.id}
                    onClick={() => setSelectedImamDetail(im)}
                    className="bg-[#09332E] border border-emerald-800/70 hover:border-[#E2A336]/60 rounded-2xl p-4 transition-all shadow-md hover:shadow-xl cursor-pointer group space-y-2.5 relative"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#03221F] border border-emerald-700 flex items-center justify-center text-[#E2A336] shrink-0 font-bold text-xs mt-0.5">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors">
                              {im.fullName}
                            </h4>
                            {im.isCustomSubmission && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-[#03221F] font-bold">
                                ✨ আপনার বায়োডাটা
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>
                              {im.currentLocation} • বয়স: {im.age} বছর ({im.maritalStatus})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                          {im.title}
                        </span>

                        {im.isCustomSubmission && (
                          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setEditingImam(im);
                                setIsImamFormOpen(true);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-[#03221F] bg-[#E2A336] hover:bg-[#c98e2a] transition-all cursor-pointer flex items-center gap-0.5"
                              title={lang === 'en' ? 'Edit biodata' : 'বায়োডাটা এডিট'}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Edit' : 'এডিট'}</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTarget({ type: 'imam', id: im.id, title: im.fullName });
                              }}
                              className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 transition-colors cursor-pointer"
                              title={lang === 'en' ? 'Delete biodata' : 'বায়োডাটা মুছুন'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Degree & Madrasa & Experience */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-emerald-800/40">
                      <div>
                        <div className="text-xs text-white font-semibold flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#E2A336]" />
                          <span>{im.qualification}</span>
                        </div>
                        <div className="text-[11px] text-emerald-300/80 mt-0.5">
                          প্রতিষ্ঠান: {im.institution} • অভিজ্ঞতা: <strong>{im.experienceYears} বছর</strong>
                        </div>
                        <div className="text-[11px] text-emerald-300/70 mt-0.5">
                          পছন্দের এলাকা: {im.preferredLocation}
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-emerald-300/80 block">প্রত্যাশিত মাসিক হাদিয়া</span>
                        <div className="text-lg sm:text-xl font-black text-[#E2A336]">
                          ₹{im.expectedSalary.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                      {im.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-700/40 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#E2A336]" />
                          <span>{skill}</span>
                        </span>
                      ))}
                      {im.skills.length > 3 && (
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          +{im.skills.length - 3} টি বিশেষ দক্ষতা
                        </span>
                      )}
                    </div>

                    {/* Action Bar */}
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
                          <span>WhatsApp বার্তা</span>
                        </a>

                        <a
                          href={`tel:${im.contactPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                          <span className="hidden sm:inline">কল করুন</span>
                        </a>
                      </div>

                      <button
                        onClick={() => setSelectedImamDetail(im)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>বায়োডাটা দেখুন</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredImams.length === 0 && (
                <div className="text-center py-10 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
                  <User className="w-10 h-10 text-emerald-500/60 mx-auto" />
                  <h4 className="text-base font-bold text-white">কোন ইমাম সাহেবের বায়োডাটা পাওয়া যায়নি</h4>
                  <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                    আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো ইমাম সাহেবের বায়োডাটা এই মুহূর্তে নেই।
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setDistrictFilter('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs"
                  >
                    ফিল্টার রিসেট করুন
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-emerald-300/70 hidden sm:inline">
            💡 ইমাম ও মসজিদ কমিটির মধ্যে সরাসরি ও বিশ্বস্ত যোগাযোগের দ্বীনি মাধ্যম
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors ml-auto cursor-pointer"
          >
            {lang === 'en' ? 'Close' : lang === 'ur' ? 'بند کریں' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#03221F] border border-rose-600/70 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-3 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{lang === 'en' ? 'Confirm Deletion' : 'মুছে ফেলার নিশ্চিতকরণ'}</span>
            </h3>
            <p className="text-rose-200/90">
              {lang === 'en'
                ? `Are you sure you want to delete "${deleteTarget.title}"?`
                : `আপনি কি নিশ্চিত যে "${deleteTarget.title}" মুছে ফেলতে চান?`}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-medium cursor-pointer"
              >
                {lang === 'en' ? 'Cancel' : 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
              >
                {lang === 'en' ? 'Yes, Delete' : 'মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modals: Form for Imam, Form for Mosque, Detail for Imam, Detail for Mosque */}
      <ImamBiodataFormModal
        isOpen={isImamFormOpen}
        onClose={() => {
          setIsImamFormOpen(false);
          setEditingImam(null);
        }}
        onSave={handleSaveImam}
        lang={lang}
        initialData={editingImam}
      />

      <MosqueVacancyFormModal
        isOpen={isMosqueFormOpen}
        onClose={() => {
          setIsMosqueFormOpen(false);
          setEditingVacancy(null);
        }}
        onSave={handleSaveVacancy}
        lang={lang}
        initialData={editingVacancy}
      />

      <ImamBiodataDetailModal
        isOpen={Boolean(selectedImamDetail)}
        onClose={() => setSelectedImamDetail(null)}
        biodata={selectedImamDetail}
        lang={lang}
        onEdit={(biodata) => {
          setEditingImam(biodata);
          setIsImamFormOpen(true);
        }}
        onDelete={(biodata) => {
          setDeleteTarget({ type: 'imam', id: biodata.id, title: biodata.fullName });
        }}
      />

      <MosqueVacancyDetailModal
        isOpen={Boolean(selectedVacancyDetail)}
        onClose={() => setSelectedVacancyDetail(null)}
        vacancy={selectedVacancyDetail}
        lang={lang}
        onEdit={(vac) => {
          setEditingVacancy(vac);
          setIsMosqueFormOpen(true);
        }}
        onDelete={(vac) => {
          setDeleteTarget({ type: 'vacancy', id: vac.id, title: vac.mosqueName });
        }}
      />
    </div>
  );
};
