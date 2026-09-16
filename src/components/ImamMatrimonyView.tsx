import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  User,
  HeartHandshake,
  Search,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Share2,
  Users,
  SlidersHorizontal,
} from 'lucide-react';
import { ImamBiodata, MosqueVacancy, MatrimonyBiodata, AppLanguage } from '../types';
import { DEFAULT_IMAM_BIODATAS, DEFAULT_MOSQUE_VACANCIES } from '../data/defaultImamData';
import { DEFAULT_MATRIMONY_BIODATAS } from '../data/defaultMatrimonyData';
import { ImamBiodataFormModal } from './ImamBiodataFormModal';
import { MosqueVacancyFormModal } from './MosqueVacancyFormModal';
import { MatrimonyBiodataFormModal } from './MatrimonyBiodataFormModal';
import { ImamBiodataDetailModal } from './ImamBiodataDetailModal';
import { MosqueVacancyDetailModal } from './MosqueVacancyDetailModal';
import { MatrimonyBiodataDetailModal } from './MatrimonyBiodataDetailModal';

interface ImamMatrimonyViewProps {
  onAddCoin?: (amount: number) => void;
  lang?: AppLanguage;
  initialSubTab?: 'mosques' | 'imams' | 'matrimony';
}

export const ImamMatrimonyView: React.FC<ImamMatrimonyViewProps> = ({
  onAddCoin,
  lang = 'bn',
  initialSubTab = 'matrimony',
}) => {
  // Main sub-tabs: 'mosques' | 'imams' | 'matrimony'
  const [activeSubTab, setActiveSubTab] = useState<'mosques' | 'imams' | 'matrimony'>(initialSubTab);

  // Filter for Matrimony sub-filter: 'all' | 'groom' | 'bride'
  const [matrimonyTypeFilter, setMatrimonyTypeFilter] = useState<'all' | 'groom' | 'bride'>('all');

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

  // Matrimony Biodatas state with LocalStorage
  const [matrimonials, setMatrimonials] = useState<MatrimonyBiodata[]>(() => {
    try {
      const saved = localStorage.getItem('matrimony_biodatas_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MATRIMONY_BIODATAS;
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('imam_biodatas_v1', JSON.stringify(imams));
    } catch {}
  }, [imams]);

  useEffect(() => {
    try {
      localStorage.setItem('mosque_vacancies_v1', JSON.stringify(vacancies));
    } catch {}
  }, [vacancies]);

  useEffect(() => {
    try {
      localStorage.setItem('matrimony_biodatas_v1', JSON.stringify(matrimonials));
    } catch {}
  }, [matrimonials]);

  // Modals state
  const [isImamFormOpen, setIsImamFormOpen] = useState(false);
  const [isMosqueFormOpen, setIsMosqueFormOpen] = useState(false);
  const [isMatrimonyFormOpen, setIsMatrimonyFormOpen] = useState(false);

  const [selectedImamDetail, setSelectedImamDetail] = useState<ImamBiodata | null>(null);
  const [selectedVacancyDetail, setSelectedVacancyDetail] = useState<MosqueVacancy | null>(null);
  const [selectedMatrimonyDetail, setSelectedMatrimonyDetail] = useState<MatrimonyBiodata | null>(null);

  const [toastMsg, setToastMsg] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'salary_high' | 'salary_low'>('newest');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleAddImam = (newImam: ImamBiodata) => {
    setImams((prev) => [newImam, ...prev]);
    if (onAddCoin) onAddCoin(20);
    showToast('মাশাআল্লাহ! আপনার বায়োডাটা সফলভাবে যুক্ত হয়েছে। (+২০ কয়েন)');
  };

  const handleAddVacancy = (newVac: MosqueVacancy) => {
    setVacancies((prev) => [newVac, ...prev]);
    if (onAddCoin) onAddCoin(20);
    showToast('আলহামদুলিল্লাহ! মসজিদের নিয়োগ বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে। (+২০ কয়েন)');
  };

  const handleAddMatrimony = (newMat: MatrimonyBiodata) => {
    setMatrimonials((prev) => [newMat, ...prev]);
    if (onAddCoin) onAddCoin(20);
    showToast('মাশাআল্লাহ! পাত্র/পাত্রীর বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে। (+২০ কয়েন)');
  };

  const handleDeleteImam = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই বায়োডাটা মুছে ফেলতে চান?')) {
      setImams((prev) => prev.filter((item) => item.id !== id));
      showToast('বায়োডাটা মুছে ফেলা হয়েছে।');
    }
  };

  const handleDeleteVacancy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই নিয়োগ বিজ্ঞপ্তি মুছে ফেলতে চান?')) {
      setVacancies((prev) => prev.filter((item) => item.id !== id));
      showToast('বিজ্ঞপ্তিটি মুছে ফেলা হয়েছে।');
    }
  };

  const handleDeleteMatrimony = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('আপনি কি এই বায়োডাটা মুছে ফেলতে চান?')) {
      setMatrimonials((prev) => prev.filter((item) => item.id !== id));
      showToast('পাত্র/পাত্রীর বায়োডাটা মুছে ফেলা হয়েছে।');
    }
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

  // Filtered Matrimony
  const filteredMatrimonials = useMemo(() => {
    return matrimonials
      .filter((mat) => {
        if (matrimonyTypeFilter !== 'all' && mat.type !== matrimonyTypeFilter) {
          return false;
        }
        if (districtFilter !== 'all') {
          const match =
            mat.district.toLowerCase().includes(districtFilter.toLowerCase()) ||
            mat.area.toLowerCase().includes(districtFilter.toLowerCase());
          if (!match) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode = mat.codeName.toLowerCase().includes(q);
          const matchName = mat.fullName.toLowerCase().includes(q);
          const matchEdu = mat.education.toLowerCase().includes(q);
          const matchProf = mat.profession.toLowerCase().includes(q);
          const matchArea = mat.area.toLowerCase().includes(q);
          if (!matchCode && !matchName && !matchEdu && !matchProf && !matchArea) return false;
        }
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [matrimonials, matrimonyTypeFilter, districtFilter, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#E2A336] text-[#03221F] px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-[#09332E] via-[#0b3c36] to-[#062420] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#E2A336]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🕌</span>
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide">
                ইমাম, মসজিদ ও দ্বীনি পাত্র-পাত্রী পোর্টাল
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              মসজিদ কমিটির জন্য যোগ্য ইমাম নিযুক্তি, ইমাম সাহেবদের জন্য খেদমত এবং দ্বীনদার পাত্র-পাত্রীর শরীয়াহসম্মত ইসলামিক বায়োডাটা
            </p>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {activeSubTab === 'matrimony' && (
              <button
                onClick={() => setIsMatrimonyFormOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ পাত্র/পাত্রীর বায়োডাটা দিন</span>
              </button>
            )}

            {activeSubTab === 'imams' && (
              <button
                onClick={() => setIsImamFormOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ ইমাম বায়োডাটা দিন</span>
              </button>
            )}

            {activeSubTab === 'mosques' && (
              <button
                onClick={() => setIsMosqueFormOpen(true)}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ মসজিদের নিয়োগ দিন</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Sub-Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/60 relative z-10">
          <button
            onClick={() => setActiveSubTab('matrimony')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'matrimony'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#03221F]/70 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="truncate">দ্বীনি পাত্র-পাত্রী ({matrimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mosques')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'mosques'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#03221F]/70 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">মসজিদ নিয়োগ ({vacancies.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('imams')}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'imams'
                ? 'bg-[#E2A336] text-[#03221F] shadow-md'
                : 'bg-[#03221F]/70 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-800/40'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">ইমাম বায়োডাটা ({imams.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#09332E] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'matrimony'
                ? 'পাত্র/পাত্রীর নাম, পেশা, শিক্ষা, এলাকা দিয়ে খুঁজুন...'
                : activeSubTab === 'mosques'
                ? 'মসজিদের নাম, এলাকা, পদবী দিয়ে খুঁজুন...'
                : 'ইমামের নাম, শিক্ষাগত যোগ্যতা, এলাকা দিয়ে খুঁজুন...'
            }
            className="w-full bg-[#03221F] border border-emerald-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-emerald-400/50 focus:outline-hidden focus:border-[#E2A336]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Matrimony Specific Sub-Filter (All / Groom / Bride) */}
          {activeSubTab === 'matrimony' && (
            <div className="flex items-center bg-[#03221F] border border-emerald-800/80 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setMatrimonyTypeFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  matrimonyTypeFilter === 'all'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                সবাই
              </button>
              <button
                onClick={() => setMatrimonyTypeFilter('groom')}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                  matrimonyTypeFilter === 'groom'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>🤵 পাত্র</span>
              </button>
              <button
                onClick={() => setMatrimonyTypeFilter('bride')}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                  matrimonyTypeFilter === 'bride'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>👰 পাত্রী</span>
              </button>
            </div>
          )}

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-[#03221F] border border-emerald-800/80 rounded-xl px-2.5 py-2 text-xs text-emerald-200 focus:outline-hidden focus:border-[#E2A336] cursor-pointer"
          >
            <option value="all">সব এলাকা / জেলা</option>
            <option value="কাছাড়">কাছাড় (Cachar)</option>
            <option value="শিলচর">শিলচর (Silchar)</option>
            <option value="করিমগঞ্জ">করিমগঞ্জ (Karimganj)</option>
            <option value="হাইলাকান্দি">হাইলাকান্দি (Hailakandi)</option>
          </select>

          {/* Sort By */}
          {activeSubTab !== 'matrimony' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#03221F] border border-emerald-800/80 rounded-xl px-2.5 py-2 text-xs text-emerald-200 focus:outline-hidden focus:border-[#E2A336] cursor-pointer"
            >
              <option value="newest">নতুনগুলো আগে</option>
              <option value="salary_high">হাদিয়া (বেশি থেকে কম)</option>
              <option value="salary_low">হাদিয়া (কম থেকে বেশি)</option>
            </select>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: MATRIMONY (ISLAMIC GROOMS & BRIDES) */}
      {activeSubTab === 'matrimony' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-semibold">
              মোট {filteredMatrimonials.length} টি পাত্র ও পাত্রীর বায়োডাটা পাওয়া গেছে
            </span>

            <button
              onClick={() => setIsMatrimonyFormOpen(true)}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নিজের বা পরিবারের বায়োডাটা জমা দিন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredMatrimonials.map((mat) => {
              const cleanNumber = (mat.whatsappNumber || mat.guardianPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `আসসালামু আলাইকুম। বরাক ইসলামিক অ্যাপে আপনাদের ${mat.type === 'groom' ? 'পাত্রের' : 'পাত্রীর'} (${mat.codeName}) বায়োডাটা দেখে যোগাযোগ করছি।`
              );

              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMatrimonyDetail(mat)}
                  className="bg-[#09332E] border border-white/10 hover:border-[#E2A336]/60 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header: Type, CodeName, Age & Location */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336] shrink-0">
                          {mat.type === 'groom' ? (
                            <User className="w-5 h-5" />
                          ) : (
                            <Users className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-white group-hover:text-[#E2A336] transition-colors">
                              {mat.codeName}
                            </h4>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                mat.type === 'groom'
                                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                                  : 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                              }`}
                            >
                              {mat.type === 'groom' ? '🤵 পাত্র' : '👰 পাত্রী'}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>{mat.area}, {mat.district}</span>
                          </p>
                        </div>
                      </div>

                      {mat.isCustomSubmission && (
                        <button
                          onClick={(e) => handleDeleteMatrimony(mat.id, e)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-950 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Specs Pill */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#03221F] p-2 rounded-xl text-center text-[11px]">
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">বয়স</span>
                        <span className="font-bold text-white">{mat.age} বছর</span>
                      </div>
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">উচ্চতা</span>
                        <span className="font-bold text-white">{mat.height}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">গায়ের রঙ</span>
                        <span className="font-bold text-[#E2A336]">{mat.complexion}</span>
                      </div>
                    </div>

                    {/* Education & Profession */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-100">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{mat.education}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <Briefcase className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">
                          {mat.profession} {mat.monthlyIncome ? `• ${mat.monthlyIncome}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Religious Practice Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mat.religiousPractices.slice(0, 3).map((prac, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-800/40"
                        >
                          ✓ {prac}
                        </span>
                      ))}
                      {mat.religiousPractices.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#03221F] text-emerald-400 font-semibold">
                          +{mat.religiousPractices.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${cleanNumber}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${mat.guardianPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                        <span>কল</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedMatrimonyDetail(mat)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMatrimonials.length === 0 && (
            <div className="text-center py-12 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
              <HeartHandshake className="w-12 h-12 text-emerald-500/60 mx-auto" />
              <h4 className="text-base font-bold text-white">কোন পাত্র/পাত্রীর বায়োডাটা পাওয়া যায়নি</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো পাত্র বা পাত্রীর তথ্য এই মুহূর্তে নেই।
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDistrictFilter('all');
                  setMatrimonyTypeFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MOSQUE VACANCIES */}
      {activeSubTab === 'mosques' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-semibold">
              মোট {filteredVacancies.length} টি মসজিদের নিয়োগ বিজ্ঞপ্তি পাওয়া গেছে
            </span>

            <button
              onClick={() => setIsMosqueFormOpen(true)}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন বিজ্ঞপ্তি পোস্ট করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredVacancies.map((v) => {
              const cleanNumber = (v.whatsappNumber || v.contactPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `আসসালামু আলাইকুম। বরাক ইসলামিক অ্যাপে আপনাদের "${v.mosqueName}"-এর "${v.position}" পদে নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি।`
              );

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVacancyDetail(v)}
                  className="bg-[#09332E] border border-white/10 hover:border-[#E2A336]/60 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336] shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E2A336] transition-colors">
                            {v.mosqueName}
                          </h4>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>{v.area}, {v.district}</span>
                          </p>
                        </div>
                      </div>

                      {v.isCustomSubmission && (
                        <button
                          onClick={(e) => handleDeleteVacancy(v.id, e)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-950 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="p-2.5 bg-[#03221F] rounded-xl border border-emerald-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 block">নিয়োগের পদ</span>
                        <span className="text-xs font-bold text-white">{v.position}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block">মাসিক হাদিয়া</span>
                        <span className="text-xs font-bold text-[#E2A336]">
                          ₹{v.offeredSalary.toLocaleString('en-IN')} / মাস
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{v.requiredQualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <Briefcase className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span>অভিজ্ঞতা: {v.experienceRequired}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${cleanNumber}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${v.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                        <span>কল</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedVacancyDetail(v)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredVacancies.length === 0 && (
            <div className="text-center py-12 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
              <Building2 className="w-12 h-12 text-emerald-500/60 mx-auto" />
              <h4 className="text-base font-bold text-white">কোন নিয়োগ বিজ্ঞপ্তি পাওয়া যায়নি</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো মসজিদের নিয়োগ বিজ্ঞপ্তি এই মুহূর্তে নেই।
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: IMAM BIODATAS */}
      {activeSubTab === 'imams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-semibold">
              মোট {filteredImams.length} জন সম্মানিত ইমাম সাহেবের বায়োডাটা পাওয়া গেছে
            </span>

            <button
              onClick={() => setIsImamFormOpen(true)}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ইমাম সাহেবদের বায়োডাটা যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredImams.map((im) => {
              const cleanNumber = (im.whatsappNumber || im.contactPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                `আসসালামু আলাইকুম হযরত ${im.fullName}। বরাক ইসলামিক অ্যাপে আপনার বায়োডাটা দেখে মসজিদের খেদমতের ব্যাপারে যোগাযোগ করছি।`
              );

              return (
                <div
                  key={im.id}
                  onClick={() => setSelectedImamDetail(im)}
                  className="bg-[#09332E] border border-white/10 hover:border-[#E2A336]/60 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336] shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#E2A336] transition-colors">
                              {im.fullName}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                              {im.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>বর্তমান: {im.currentLocation}</span>
                          </p>
                        </div>
                      </div>

                      {im.isCustomSubmission && (
                        <button
                          onClick={(e) => handleDeleteImam(im.id, e)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-950 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="p-2.5 bg-[#03221F] rounded-xl border border-emerald-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 block">অভিজ্ঞতা ও বয়স</span>
                        <span className="text-xs font-bold text-white">
                          {im.experienceYears} বছর • বয়স {im.age}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block">প্রত্যাশিত হাদিয়া</span>
                        <span className="text-xs font-bold text-[#E2A336]">
                          ₹{im.expectedSalary.toLocaleString('en-IN')} / মাস
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{im.qualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <MapPin className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">পছন্দের এলাকা: {im.preferredLocation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${cleanNumber}?text=${waText}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-all shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${im.contactPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-xl bg-[#03221F] hover:bg-emerald-900/60 text-white border border-emerald-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E2A336]" />
                        <span>কল</span>
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
          </div>

          {filteredImams.length === 0 && (
            <div className="text-center py-12 bg-[#09332E]/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
              <User className="w-12 h-12 text-emerald-500/60 mx-auto" />
              <h4 className="text-base font-bold text-white">কোন ইমাম সাহেবের বায়োডাটা পাওয়া যায়নি</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো বায়োডাটা এই মুহূর্তে নেই।
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub-Modals */}
      <ImamBiodataFormModal
        isOpen={isImamFormOpen}
        onClose={() => setIsImamFormOpen(false)}
        onSave={handleAddImam}
        lang={lang}
      />

      <MosqueVacancyFormModal
        isOpen={isMosqueFormOpen}
        onClose={() => setIsMosqueFormOpen(false)}
        onSave={handleAddVacancy}
        lang={lang}
      />

      <MatrimonyBiodataFormModal
        isOpen={isMatrimonyFormOpen}
        onClose={() => setIsMatrimonyFormOpen(false)}
        onSave={handleAddMatrimony}
        lang={lang}
      />

      <ImamBiodataDetailModal
        isOpen={Boolean(selectedImamDetail)}
        onClose={() => setSelectedImamDetail(null)}
        biodata={selectedImamDetail}
        lang={lang}
      />

      <MosqueVacancyDetailModal
        isOpen={Boolean(selectedVacancyDetail)}
        onClose={() => setSelectedVacancyDetail(null)}
        vacancy={selectedVacancyDetail}
        lang={lang}
      />

      <MatrimonyBiodataDetailModal
        isOpen={Boolean(selectedMatrimonyDetail)}
        onClose={() => setSelectedMatrimonyDetail(null)}
        biodata={selectedMatrimonyDetail}
        lang={lang}
      />
    </div>
  );
};
