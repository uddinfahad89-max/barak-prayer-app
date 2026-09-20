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
  Edit3,
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
import { TRANSLATIONS } from '../utils/translations';
import { getMatrimonyDisplay, getImamDisplay, getMosqueDisplay } from '../utils/portalTranslations';

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
  const t = TRANSLATIONS[lang || 'bn'];
  // Main sub-tabs: 'mosques' | 'imams' | 'matrimony'
  const [activeSubTab, setActiveSubTab] = useState<'mosques' | 'imams' | 'matrimony'>(initialSubTab);

  // Filter for Matrimony sub-filter: 'all' | 'groom' | 'bride'
  const [matrimonyTypeFilter, setMatrimonyTypeFilter] = useState<'all' | 'groom' | 'bride'>('all');

  // Imam Biodatas state with LocalStorage
  const [imams, setImams] = useState<ImamBiodata[]>(() => {
    try {
      const saved = localStorage.getItem('imam_biodatas_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('imam_biodatas_v1');
      if (old) {
        const oldParsed = JSON.parse(old);
        if (Array.isArray(oldParsed)) {
          const customOnly = oldParsed.filter((item) => item.isCustomSubmission);
          if (customOnly.length > 0) {
            return [...customOnly, ...DEFAULT_IMAM_BIODATAS];
          }
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_IMAM_BIODATAS;
  });

  // Mosque Vacancies state with LocalStorage
  const [vacancies, setVacancies] = useState<MosqueVacancy[]>(() => {
    try {
      const saved = localStorage.getItem('mosque_vacancies_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('mosque_vacancies_v1');
      if (old) {
        const oldParsed = JSON.parse(old);
        if (Array.isArray(oldParsed)) {
          const customOnly = oldParsed.filter((item) => item.isCustomSubmission);
          if (customOnly.length > 0) {
            return [...customOnly, ...DEFAULT_MOSQUE_VACANCIES];
          }
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_MOSQUE_VACANCIES;
  });

  // Matrimony Biodatas state with LocalStorage
  const [matrimonials, setMatrimonials] = useState<MatrimonyBiodata[]>(() => {
    try {
      const saved = localStorage.getItem('matrimony_biodatas_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const old = localStorage.getItem('matrimony_biodatas_v1');
      if (old) {
        const oldParsed = JSON.parse(old);
        if (Array.isArray(oldParsed)) {
          const customOnly = oldParsed.filter((item) => item.isCustomSubmission);
          if (customOnly.length > 0) {
            return [...customOnly, ...DEFAULT_MATRIMONY_BIODATAS];
          }
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_MATRIMONY_BIODATAS;
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('imam_biodatas_v2', JSON.stringify(imams));
    } catch {}
  }, [imams]);

  useEffect(() => {
    try {
      localStorage.setItem('mosque_vacancies_v2', JSON.stringify(vacancies));
    } catch {}
  }, [vacancies]);

  useEffect(() => {
    try {
      localStorage.setItem('matrimony_biodatas_v2', JSON.stringify(matrimonials));
    } catch {}
  }, [matrimonials]);

  // Modals state
  const [isImamFormOpen, setIsImamFormOpen] = useState(false);
  const [isMosqueFormOpen, setIsMosqueFormOpen] = useState(false);
  const [isMatrimonyFormOpen, setIsMatrimonyFormOpen] = useState(false);

  const [editingImam, setEditingImam] = useState<ImamBiodata | null>(null);
  const [editingVacancy, setEditingVacancy] = useState<MosqueVacancy | null>(null);
  const [editingMatrimony, setEditingMatrimony] = useState<MatrimonyBiodata | null>(null);

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

  const handleSaveMatrimony = (savedMat: MatrimonyBiodata) => {
    setMatrimonials((prev) => {
      const exists = prev.some((item) => item.id === savedMat.id);
      if (exists) {
        return prev.map((item) => (item.id === savedMat.id ? savedMat : item));
      }
      return [savedMat, ...prev];
    });
    if (selectedMatrimonyDetail && selectedMatrimonyDetail.id === savedMat.id) {
      setSelectedMatrimonyDetail(savedMat);
    }
    const isEditing = !!editingMatrimony;
    setEditingMatrimony(null);
    if (!isEditing && onAddCoin) onAddCoin(20);
    showToast(
      isEditing
        ? (lang === 'en' ? 'Biodata updated successfully!' : 'পাত্র/পাত্রীর বায়োডাটা সফলভাবে আপডেট করা হয়েছে।')
        : (lang === 'en' ? 'Biodata published successfully! (+20 Coins)' : 'মাশাআল্লাহ! পাত্র/পাত্রীর বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে। (+২০ কয়েন)')
    );
  };

  const [deleteTarget, setDeleteTarget] = useState<{ type: 'imam' | 'vacancy' | 'matrimony'; id: string; title: string } | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'imam') {
      setImams((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedImamDetail && selectedImamDetail.id === deleteTarget.id) {
        setSelectedImamDetail(null);
      }
      showToast(lang === 'en' ? 'Biodata deleted.' : 'বায়োডাটা মুছে ফেলা হয়েছে।');
    } else if (deleteTarget.type === 'vacancy') {
      setVacancies((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedVacancyDetail && selectedVacancyDetail.id === deleteTarget.id) {
        setSelectedVacancyDetail(null);
      }
      showToast(lang === 'en' ? 'Vacancy post deleted.' : 'বিজ্ঞপ্তিটি মুছে ফেলা হয়েছে।');
    } else {
      setMatrimonials((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      if (selectedMatrimonyDetail && selectedMatrimonyDetail.id === deleteTarget.id) {
        setSelectedMatrimonyDetail(null);
      }
      showToast(lang === 'en' ? 'Biodata deleted.' : 'পাত্র/পাত্রীর বায়োডাটা মুছে ফেলা হয়েছে।');
    }
    setDeleteTarget(null);
  };

  // Multilingual District Matcher
  const matchesDistrict = (district: string, area: string, districtEn?: string, areaEn?: string) => {
    if (districtFilter === 'all') return true;
    const df = districtFilter.toLowerCase();
    const map: Record<string, string[]> = {
      'কাছাড়': ['কাছাড়', 'cachar'],
      'শিলচর': ['শিলচর', 'silchar'],
      'করিমগঞ্জ': ['করিমগঞ্জ', 'karimganj'],
      'হাইলাকান্দি': ['হাইলাকান্দি', 'hailakandi'],
    };
    const targets = map[districtFilter] || [df];
    return targets.some((target) =>
      district.toLowerCase().includes(target) ||
      area.toLowerCase().includes(target) ||
      (districtEn && districtEn.toLowerCase().includes(target)) ||
      (areaEn && areaEn.toLowerCase().includes(target))
    );
  };

  // Filtered Mosque Vacancies
  const filteredVacancies = useMemo(() => {
    return vacancies
      .filter((v) => {
        if (!matchesDistrict(v.district, v.area, v.districtEn, v.areaEn)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMosque =
            v.mosqueName.toLowerCase().includes(q) ||
            (v.mosqueNameEn && v.mosqueNameEn.toLowerCase().includes(q));
          const matchArea =
            v.area.toLowerCase().includes(q) ||
            (v.areaEn && v.areaEn.toLowerCase().includes(q));
          const matchPos =
            v.position.toLowerCase().includes(q) ||
            (v.positionEn && v.positionEn.toLowerCase().includes(q));
          const matchQual =
            v.requiredQualification.toLowerCase().includes(q) ||
            (v.requiredQualificationEn && v.requiredQualificationEn.toLowerCase().includes(q));
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
          const match = matchesDistrict(
            im.currentLocation,
            im.preferredLocation,
            im.currentLocationEn,
            im.preferredLocationEn
          );
          if (!match) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            im.fullName.toLowerCase().includes(q) ||
            (im.fullNameEn && im.fullNameEn.toLowerCase().includes(q));
          const matchTitle =
            im.title.toLowerCase().includes(q) ||
            (im.titleEn && im.titleEn.toLowerCase().includes(q));
          const matchQual =
            im.qualification.toLowerCase().includes(q) ||
            (im.qualificationEn && im.qualificationEn.toLowerCase().includes(q));
          const matchLoc =
            im.currentLocation.toLowerCase().includes(q) ||
            (im.currentLocationEn && im.currentLocationEn.toLowerCase().includes(q));
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
        if (!matchesDistrict(mat.district, mat.area, mat.districtEn, mat.areaEn)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchCode =
            mat.codeName.toLowerCase().includes(q) ||
            (mat.codeNameEn && mat.codeNameEn.toLowerCase().includes(q));
          const matchName =
            mat.fullName.toLowerCase().includes(q) ||
            (mat.fullNameEn && mat.fullNameEn.toLowerCase().includes(q));
          const matchEdu =
            mat.education.toLowerCase().includes(q) ||
            (mat.educationEn && mat.educationEn.toLowerCase().includes(q));
          const matchProf =
            mat.profession.toLowerCase().includes(q) ||
            (mat.professionEn && mat.professionEn.toLowerCase().includes(q));
          const matchArea =
            mat.area.toLowerCase().includes(q) ||
            (mat.areaEn && mat.areaEn.toLowerCase().includes(q));
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
                {t.matrimonyPortalTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              {t.matrimonyPortalSubtitle}
            </p>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {activeSubTab === 'matrimony' && (
              <button
                onClick={() => {
                  setEditingMatrimony(null);
                  setIsMatrimonyFormOpen(true);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postMatrimonyBtn}</span>
              </button>
            )}

            {activeSubTab === 'imams' && (
              <button
                onClick={() => {
                  setEditingImam(null);
                  setIsImamFormOpen(true);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postImamBtn}</span>
              </button>
            )}

            {activeSubTab === 'mosques' && (
              <button
                onClick={() => {
                  setEditingVacancy(null);
                  setIsMosqueFormOpen(true);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.postMosqueBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Sub-Tabs: Displayed Line by Line as Requested */}
        <div className="flex flex-col gap-2.5 mt-4 pt-3 border-t border-emerald-800/60 relative z-10">
          {/* Sub-Tab 1: Matrimony */}
          <button
            id="subtab-matrimony-btn"
            onClick={() => setActiveSubTab('matrimony')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl font-bold transition-all flex items-center justify-between gap-3 text-left cursor-pointer group shadow-sm ${
              activeSubTab === 'matrimony'
                ? 'bg-[#E2A336] text-[#03221F] ring-2 ring-[#E2A336]/60 shadow-lg scale-[1.01]'
                : 'bg-[#03221F]/80 text-emerald-200 hover:bg-emerald-900/50 border border-emerald-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeSubTab === 'matrimony'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-[#E2A336]/20 text-[#E2A336] group-hover:bg-[#E2A336]/30'
                }`}
              >
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span>{t.subtabMatrimony}</span>
                  {activeSubTab === 'matrimony' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#03221F] text-[#E2A336] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-snug ${
                    activeSubTab === 'matrimony' ? 'text-[#03221F]/80 font-medium' : 'text-emerald-300/70'
                  }`}
                >
                  {t.subtabMatrimonyDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  activeSubTab === 'matrimony'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                }`}
              >
                {matrimonials.length}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  activeSubTab === 'matrimony' ? 'text-[#03221F]' : 'text-emerald-400'
                }`}
              />
            </div>
          </button>

          {/* Sub-Tab 2: Mosque Vacancies */}
          <button
            id="subtab-mosques-btn"
            onClick={() => setActiveSubTab('mosques')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl font-bold transition-all flex items-center justify-between gap-3 text-left cursor-pointer group shadow-sm ${
              activeSubTab === 'mosques'
                ? 'bg-[#E2A336] text-[#03221F] ring-2 ring-[#E2A336]/60 shadow-lg scale-[1.01]'
                : 'bg-[#03221F]/80 text-emerald-200 hover:bg-emerald-900/50 border border-emerald-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeSubTab === 'mosques'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-[#E2A336]/20 text-[#E2A336] group-hover:bg-[#E2A336]/30'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span>{t.subtabMosques}</span>
                  {activeSubTab === 'mosques' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#03221F] text-[#E2A336] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-snug ${
                    activeSubTab === 'mosques' ? 'text-[#03221F]/80 font-medium' : 'text-emerald-300/70'
                  }`}
                >
                  {t.subtabMosquesDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  activeSubTab === 'mosques'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                }`}
              >
                {vacancies.length}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  activeSubTab === 'mosques' ? 'text-[#03221F]' : 'text-emerald-400'
                }`}
              />
            </div>
          </button>

          {/* Sub-Tab 3: Imam Biodatas */}
          <button
            id="subtab-imams-btn"
            onClick={() => setActiveSubTab('imams')}
            className={`w-full p-3 sm:p-3.5 rounded-2xl font-bold transition-all flex items-center justify-between gap-3 text-left cursor-pointer group shadow-sm ${
              activeSubTab === 'imams'
                ? 'bg-[#E2A336] text-[#03221F] ring-2 ring-[#E2A336]/60 shadow-lg scale-[1.01]'
                : 'bg-[#03221F]/80 text-emerald-200 hover:bg-emerald-900/50 border border-emerald-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  activeSubTab === 'imams'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-[#E2A336]/20 text-[#E2A336] group-hover:bg-[#E2A336]/30'
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span>{t.subtabImams}</span>
                  {activeSubTab === 'imams' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#03221F] text-[#E2A336] font-extrabold uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 leading-snug ${
                    activeSubTab === 'imams' ? 'text-[#03221F]/80 font-medium' : 'text-emerald-300/70'
                  }`}
                >
                  {t.subtabImamsDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  activeSubTab === 'imams'
                    ? 'bg-[#03221F] text-[#E2A336]'
                    : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                }`}
              >
                {imams.length}
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  activeSubTab === 'imams' ? 'text-[#03221F]' : 'text-emerald-400'
                }`}
              />
            </div>
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
                ? t.searchMatrimonyPlaceholder
                : activeSubTab === 'mosques'
                ? t.searchMosquesPlaceholder
                : t.searchImamsPlaceholder
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
                {t.filterAll}
              </button>
              <button
                onClick={() => setMatrimonyTypeFilter('groom')}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                  matrimonyTypeFilter === 'groom'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>{t.filterGroom}</span>
              </button>
              <button
                onClick={() => setMatrimonyTypeFilter('bride')}
                className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                  matrimonyTypeFilter === 'bride'
                    ? 'bg-[#E2A336] text-[#03221F]'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                <span>{t.filterBride}</span>
              </button>
            </div>
          )}

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-[#03221F] border border-emerald-800/80 rounded-xl px-2.5 py-2 text-xs text-emerald-200 focus:outline-hidden focus:border-[#E2A336] cursor-pointer"
          >
            <option value="all">{t.filterAllDistricts}</option>
            <option value="কাছাড়">{lang === 'en' ? 'Cachar' : lang === 'ur' ? 'کچهار (Cachar)' : 'কাছাড় (Cachar)'}</option>
            <option value="শিলচর">{lang === 'en' ? 'Silchar' : lang === 'ur' ? 'سلچر (Silchar)' : 'শিলচর (Silchar)'}</option>
            <option value="করিমগঞ্জ">{lang === 'en' ? 'Karimganj' : lang === 'ur' ? 'کریم گنج (Karimganj)' : 'করিমগঞ্জ (Karimganj)'}</option>
            <option value="হাইলাকান্দি">{lang === 'en' ? 'Hailakandi' : lang === 'ur' ? 'ہائیلاکاندی (Hailakandi)' : 'হাইলাকান্দি (Hailakandi)'}</option>
          </select>

          {/* Sort By */}
          {activeSubTab !== 'matrimony' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#03221F] border border-emerald-800/80 rounded-xl px-2.5 py-2 text-xs text-emerald-200 focus:outline-hidden focus:border-[#E2A336] cursor-pointer"
            >
              <option value="newest">{t.sortNewest}</option>
              <option value="salary_high">{t.sortSalaryHigh}</option>
              <option value="salary_low">{t.sortSalaryLow}</option>
            </select>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: MATRIMONY (ISLAMIC GROOMS & BRIDES) */}
      {activeSubTab === 'matrimony' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-semibold">
              {lang === 'en'
                ? `Total ${filteredMatrimonials.length} matrimonial profiles found`
                : lang === 'ur'
                ? `کل ${filteredMatrimonials.length} رشتے دستیاب ہیں`
                : `মোট ${filteredMatrimonials.length} টি পাত্র ও পাত্রীর বায়োডাটা পাওয়া গেছে`}
            </span>

            <button
              onClick={() => {
                setEditingMatrimony(null);
                setIsMatrimonyFormOpen(true);
              }}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? '+ Submit Biodata'
                  : lang === 'ur'
                  ? '+ بائیو ڈیٹا جمع کریں'
                  : 'নিজের বা পরিবারের বায়োডাটা জমা দিন'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredMatrimonials.map((mat) => {
              const dMat = getMatrimonyDisplay(mat, lang);
              const cleanNumber = (mat.whatsappNumber || mat.guardianPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                lang === 'en'
                  ? `Assalamu Alaikum. Contacting you regarding the matrimonial biodata (${dMat.codeName}) on Barak Islamic App.`
                  : lang === 'ur'
                  ? `السلام علیکم۔ بارک اسلامک ایپ پر بائیو ڈیٹا (${dMat.codeName}) کے سلسلے میں رابطہ کر رہے ہیں۔`
                  : `আসসালামু আলাইকুম। বরাক ইসলামিক অ্যাপে আপনাদের ${mat.type === 'groom' ? 'পাত্রের' : 'পাত্রীর'} (${dMat.codeName}) বায়োডাটা দেখে যোগাযোগ করছি।`
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
                              {dMat.codeName}
                            </h4>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                mat.type === 'groom'
                                  ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                                  : 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                              }`}
                            >
                              {mat.type === 'groom'
                                ? lang === 'en'
                                  ? '🤵 Groom'
                                  : lang === 'ur'
                                  ? '🤵 دولہا'
                                  : '🤵 পাত্র'
                                : lang === 'en'
                                ? '👰 Bride'
                                : lang === 'ur'
                                ? '👰 دلہن'
                                : '👰 পাত্রী'}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>{dMat.area}, {dMat.district}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingMatrimony(mat);
                            setIsMatrimonyFormOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg text-[#03221F] bg-[#E2A336] hover:bg-[#c98e2a] transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                          title={lang === 'en' ? 'Edit Biodata' : 'বায়োডাটা এডিট'}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Edit' : lang === 'ur' ? 'ترمیم' : 'এডিট'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: 'matrimony', id: mat.id, title: dMat.fullName });
                          }}
                          className="p-1.5 rounded-lg text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/40 transition-colors cursor-pointer"
                          title={lang === 'en' ? 'Delete' : 'মুছুন'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Specs Pill */}
                    <div className="grid grid-cols-3 gap-1.5 bg-[#03221F] p-2 rounded-xl text-center text-[11px]">
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">{t.age}</span>
                        <span className="font-bold text-white">{mat.age} {t.years}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">
                          {lang === 'en' ? 'Height' : lang === 'ur' ? 'قد' : 'উচ্চতা'}
                        </span>
                        <span className="font-bold text-white">{mat.height}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400/70 block text-[10px]">
                          {lang === 'en' ? 'Complexion' : lang === 'ur' ? 'رنگت' : 'গায়ের রঙ'}
                        </span>
                        <span className="font-bold text-[#E2A336]">{dMat.complexion}</span>
                      </div>
                    </div>

                    {/* Education & Profession */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-100">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{dMat.education}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <Briefcase className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">
                          {dMat.profession} {dMat.monthlyIncome ? `• ${dMat.monthlyIncome}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Religious Practice Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {dMat.religiousPractices.slice(0, 3).map((prac, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-[#03221F] text-emerald-200 border border-emerald-800/40"
                        >
                          ✓ {prac}
                        </span>
                      ))}
                      {dMat.religiousPractices.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#03221F] text-emerald-400 font-semibold">
                          +{dMat.religiousPractices.length - 3}
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
                        <span>{t.callDirect}</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedMatrimonyDetail(mat)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
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
              <h4 className="text-base font-bold text-white">{t.noDataFound}</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                {lang === 'en'
                  ? 'No matrimonial profiles match your selected filters at this time.'
                  : lang === 'ur'
                  ? 'منتخب کردہ فلٹر کے مطابق کوئی پروفائل موجود نہیں ہے۔'
                  : 'আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো পাত্র বা পাত্রীর তথ্য এই মুহূর্তে নেই।'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDistrictFilter('all');
                  setMatrimonyTypeFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#E2A336] text-[#03221F] font-bold text-xs"
              >
                {t.resetFilter}
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
              {lang === 'en'
                ? `Total ${filteredVacancies.length} mosque vacancies found`
                : lang === 'ur'
                ? `کل ${filteredVacancies.length} مساجد کی آسامیاں دستیاب ہیں`
                : `মোট ${filteredVacancies.length} টি মসজিদের নিয়োগ বিজ্ঞপ্তি পাওয়া গেছে`}
            </span>

            <button
              onClick={() => {
                setEditingVacancy(null);
                setIsMosqueFormOpen(true);
              }}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? '+ Post Mosque Vacancy'
                  : lang === 'ur'
                  ? '+ نئی آسامی پوسٹ کریں'
                  : 'নতুন বিজ্ঞপ্তি পোস্ট করুন'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredVacancies.map((v) => {
              const dMosque = getMosqueDisplay(v, lang);
              const cleanNumber = (v.whatsappNumber || v.contactPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                lang === 'en'
                  ? `Assalamu Alaikum. Contacting you regarding the vacancy of "${dMosque.position}" at "${dMosque.mosqueName}" posted on Barak Islamic App.`
                  : lang === 'ur'
                  ? `السلام علیکم۔ بارک اسلامک ایپ پر "${dMosque.mosqueName}" میں "${dMosque.position}" کی آسامی کے سلسلے میں رابطہ کر رہے ہیں۔`
                  : `আসসালামু আলাইকুম। বরাক ইসলামিক অ্যাপে আপনাদের "${dMosque.mosqueName}"-এর "${dMosque.position}" পদে নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি।`
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
                            {dMosque.mosqueName}
                          </h4>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>{dMosque.area}, {dMosque.district}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingVacancy(v);
                            setIsMosqueFormOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg text-[#03221F] bg-[#E2A336] hover:bg-[#c98e2a] transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                          title={lang === 'en' ? 'Edit Vacancy' : 'বিজ্ঞপ্তি এডিট'}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Edit' : lang === 'ur' ? 'ترمیم' : 'এডিট'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: 'vacancy', id: v.id, title: dMosque.mosqueName });
                          }}
                          className="p-1.5 rounded-lg text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/40 transition-colors cursor-pointer"
                          title={lang === 'en' ? 'Delete' : 'মুছুন'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#03221F] rounded-xl border border-emerald-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 block">
                          {lang === 'en' ? 'Position' : lang === 'ur' ? 'عہدہ' : 'নিয়োগের পদ'}
                        </span>
                        <span className="text-xs font-bold text-white">{dMosque.position}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block">{t.salaryHonorarium}</span>
                        <span className="text-xs font-bold text-[#E2A336]">
                          ₹{v.offeredSalary.toLocaleString('en-IN')} / {lang === 'en' ? 'month' : lang === 'ur' ? 'ماہ' : 'মাস'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{dMosque.requiredQualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <Briefcase className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span>
                          {lang === 'en' ? 'Experience: ' : lang === 'ur' ? 'تجربہ: ' : 'অভিজ্ঞতা: '}
                          {dMosque.experienceRequired}
                        </span>
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
                        <span>{t.callDirect}</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedVacancyDetail(v)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
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
              <h4 className="text-base font-bold text-white">{t.noDataFound}</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                {lang === 'en'
                  ? 'No mosque vacancies match your selected filters at this time.'
                  : lang === 'ur'
                  ? 'اس وقت آپ کے منتخب فلٹر کے مطابق کوئی آسامی دستیاب نہیں ہے۔'
                  : 'আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো মসজিদের নিয়োগ বিজ্ঞপ্তি এই মুহূর্তে নেই।'}
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
              {lang === 'en'
                ? `Total ${filteredImams.length} Imam biodatas found`
                : lang === 'ur'
                ? `کل ${filteredImams.length} ائمہ کرام کے بائیو ڈیٹا موجود ہیں`
                : `মোট ${filteredImams.length} জন সম্মানিত ইমাম সাহেবের বায়োডাটা পাওয়া গেছে`}
            </span>

            <button
              onClick={() => {
                setEditingImam(null);
                setIsImamFormOpen(true);
              }}
              className="text-xs text-[#E2A336] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {lang === 'en'
                  ? '+ Submit Imam Biodata'
                  : lang === 'ur'
                  ? '+ امام بائیو ڈیٹا جمع کریں'
                  : 'ইমাম সাহেবদের বায়োডাটা যুক্ত করুন'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredImams.map((im) => {
              const dImam = getImamDisplay(im, lang);
              const cleanNumber = (im.whatsappNumber || im.contactPhone).replace(/[^0-9]/g, '');
              const waText = encodeURIComponent(
                lang === 'en'
                  ? `Assalamu Alaikum Hazrat ${dImam.fullName}. Contacting you regarding your biodata posted on Barak Islamic App.`
                  : lang === 'ur'
                  ? `السلام علیکم حضرت ${dImam.fullName}۔ بارک اسلامک ایپ پر آپ کے بائیو ڈیٹا کے سلسلے میں رابطہ کر رہے ہیں۔`
                  : `আসসালামু আলাইকুম হযরত ${dImam.fullName}। বরাক ইসলামিক অ্যাপে আপনার বায়োডাটা দেখে মসজিদের খেদমতের ব্যাপারে যোগাযোগ করছি।`
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
                              {dImam.fullName}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                              {dImam.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E2A336] shrink-0" />
                            <span>
                              {lang === 'en' ? 'Current: ' : lang === 'ur' ? 'موجودہ: ' : 'বর্তমান: '}
                              {dImam.currentLocation}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setEditingImam(im);
                            setIsImamFormOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg text-[#03221F] bg-[#E2A336] hover:bg-[#c98e2a] transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold shadow-2xs"
                          title={lang === 'en' ? 'Edit Biodata' : 'বায়োডাটা এডিট'}
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{lang === 'en' ? 'Edit' : lang === 'ur' ? 'ترمیم' : 'এডিট'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({ type: 'imam', id: im.id, title: dImam.fullName });
                          }}
                          className="p-1.5 rounded-lg text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/40 transition-colors cursor-pointer"
                          title={lang === 'en' ? 'Delete' : 'মুছুন'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#03221F] rounded-xl border border-emerald-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 block">{t.experienceAge}</span>
                        <span className="text-xs font-bold text-white">
                          {im.experienceYears} {t.years} • {t.age} {im.age}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-400 block">
                          {lang === 'en' ? 'Expected Honorarium' : lang === 'ur' ? 'متوقع مشاہرہ' : 'প্রত্যাশিত হাদিয়া'}
                        </span>
                        <span className="text-xs font-bold text-[#E2A336]">
                          ₹{im.expectedSalary.toLocaleString('en-IN')} / {lang === 'en' ? 'month' : lang === 'ur' ? 'ماہ' : 'মাস'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <GraduationCap className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">{dImam.qualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-200">
                        <MapPin className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                        <span className="line-clamp-1">
                          {lang === 'en' ? 'Preferred Area: ' : lang === 'ur' ? 'پسندیدہ علاقہ: ' : 'পছন্দের এলাকা: '}
                          {dImam.preferredLocation}
                        </span>
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
                        <span>{t.callDirect}</span>
                      </a>
                    </div>

                    <button
                      onClick={() => setSelectedImamDetail(im)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
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
              <h4 className="text-base font-bold text-white">{t.noDataFound}</h4>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                {lang === 'en'
                  ? 'No Imam biodatas match your selected filters at this time.'
                  : lang === 'ur'
                  ? 'اس وقت آپ کے منتخب فلٹر کے مطابق کوئی بائیو ڈیٹا دستیاب نہیں ہے۔'
                  : 'আপনার নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো ইমাম সাহেবের তথ্য এই মুহূর্তে নেই।'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sub-Modals */}
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

      <MatrimonyBiodataFormModal
        isOpen={isMatrimonyFormOpen}
        onClose={() => {
          setIsMatrimonyFormOpen(false);
          setEditingMatrimony(null);
        }}
        onSave={handleSaveMatrimony}
        lang={lang}
        initialData={editingMatrimony}
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

      <MatrimonyBiodataDetailModal
        isOpen={Boolean(selectedMatrimonyDetail)}
        onClose={() => setSelectedMatrimonyDetail(null)}
        biodata={selectedMatrimonyDetail}
        lang={lang}
        onEdit={(biodata) => {
          setEditingMatrimony(biodata);
          setIsMatrimonyFormOpen(true);
        }}
        onDelete={(biodata) => {
          setDeleteTarget({ type: 'matrimony', id: biodata.id, title: biodata.fullName });
        }}
      />
    </div>
  );
};
