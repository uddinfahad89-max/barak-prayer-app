import React from 'react';
import {
  X,
  Building2,
  Phone,
  MessageCircle,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { MosqueVacancy, AppLanguage } from '../types';
import { getMosqueDisplay } from '../utils/portalTranslations';

interface MosqueVacancyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancy: MosqueVacancy | null;
  lang?: AppLanguage;
}

export const MosqueVacancyDetailModal: React.FC<MosqueVacancyDetailModalProps> = ({
  isOpen,
  onClose,
  vacancy,
  lang = 'bn',
}) => {
  if (!isOpen || !vacancy) return null;

  const d = getMosqueDisplay(vacancy, lang);
  const cleanNumber = (vacancy.whatsappNumber || vacancy.contactPhone).replace(/[^0-9]/g, '');

  const message = encodeURIComponent(
    lang === 'en'
      ? `Assalamu Alaikum. Contacting regarding the vacancy for '${d.position}' at '${d.mosqueName}' (${d.area}, ${d.district}) published on Barak Islamic App. I am interested in serving this position.`
      : `আসসালামু আলাইকুম। আপনাদের '${vacancy.mosqueName}' (${vacancy.area}, ${vacancy.district}) এর '${vacancy.position}' পদে নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি। আমি এই পদে খেদমতের জন্য আগ্রহী।`
  );

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${vacancy.contactPhone}`, '_self');
  };

  const handleShare = () => {
    const text = `🕌 ${d.mosqueName}\n${lang === 'en' ? 'Position' : 'পদ'}: ${d.position}\n${lang === 'en' ? 'Location' : 'স্থান'}: ${d.area}, ${d.district}\n${lang === 'en' ? 'Qualification' : 'যোগ্যতা'}: ${d.requiredQualification}\n${lang === 'en' ? 'Honorarium' : 'মাসিক হাদিয়া'}: ₹${vacancy.offeredSalary.toLocaleString('en-IN')}\n${lang === 'en' ? 'Contact' : 'যোগাযোগ'}: ${d.contactPerson} (${vacancy.contactPhone})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(lang === 'en' ? 'Mosque vacancy copied to clipboard!' : 'মসজিদের নিয়োগ বিজ্ঞপ্তি ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                  {d.position}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  {d.joiningDeadline}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {d.mosqueName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Salary & Location Banner */}
          <div className="bg-gradient-to-r from-[#09332E] to-[#0c433c] border border-[#E2A336]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                {lang === 'en' ? 'Designated Monthly Honorarium' : 'কমিটি কর্তৃক নির্ধারিত মাসিক হাদিয়া'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#E2A336] flex items-baseline gap-1">
                <span>₹{vacancy.offeredSalary.toLocaleString('en-IN')}</span>
                <span className="text-xs text-emerald-200/70 font-normal">/ {lang === 'en' ? 'month' : 'মাস'}</span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 {lang === 'en' ? 'Location: ' : 'স্থান: '}<strong>{d.area}, {d.district}</strong></span>
                <span>•</span>
                <span>⏱️ {lang === 'en' ? 'Deadline: ' : 'যোগদান: '}<strong>{d.joiningDeadline}</strong></span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{lang === 'en' ? 'WhatsApp Apply' : 'WhatsApp এ আবেদন'}</span>
              </button>
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'en' ? 'Call Committee' : 'কমিটিতে কল করুন'}</span>
              </button>
            </div>
          </div>

          {/* Committee Contact Details */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <UserCheck className="w-4 h-4" />
              <span>{lang === 'en' ? 'Contact & Responsible Official' : 'যোগাযোগ ও দায়িত্বশীল ব্যক্তি'}</span>
            </div>
            <div className="text-sm font-semibold text-white pl-6">
              {d.contactPerson}
            </div>
            <div className="text-xs text-emerald-300/80 pl-6 flex items-center gap-3 flex-wrap">
              <span>📞 {lang === 'en' ? 'Mobile: ' : 'মোবাইল: '}<strong className="text-white">{vacancy.contactPhone}</strong></span>
              <span>💬 {lang === 'en' ? 'WhatsApp: ' : 'হোয়াটসঅ্যাপ: '}<strong className="text-white">{vacancy.whatsappNumber}</strong></span>
            </div>
          </div>

          {/* Requirements & Qualifications */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <Briefcase className="w-4 h-4" />
              <span>{lang === 'en' ? 'Qualifications & Requirements' : 'প্রয়োজনীয় যোগ্যতা ও শর্তাবলী'}</span>
            </div>
            <div className="pl-6 space-y-1.5">
              <div className="text-xs text-emerald-100">
                <span className="text-emerald-300 font-semibold">{lang === 'en' ? 'Required Qualification: ' : 'শিক্ষাগত যোগ্যতা: '}</span>
                <span className="text-white font-medium">{d.requiredQualification}</span>
              </div>
              <div className="text-xs text-emerald-100">
                <span className="text-emerald-300 font-semibold">{lang === 'en' ? 'Experience: ' : 'অভিজ্ঞতা: '}</span>
                <span className="text-white font-medium">{d.experienceRequired}</span>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          {d.responsibilities && d.responsibilities.length > 0 && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'en' ? 'Primary Responsibilities' : 'ইমাম সাহেবের প্রধান দায়িত্বসমূহ'}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-6">
                {d.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-2 text-emerald-100 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Provided */}
          {d.facilitiesOffered && d.facilitiesOffered.length > 0 && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Building2 className="w-4 h-4 text-[#E2A336]" />
                <span>{lang === 'en' ? 'Facilities & Benefits Provided by Committee' : 'কমিটি কর্তৃক প্রদত্ত সকল সুযোগ-সুবিধা'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                {d.facilitiesOffered.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 text-emerald-200 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Description */}
          {d.description && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-white text-xs">
                {lang === 'en' ? 'Additional Notes & Guidelines' : 'বিজ্ঞপ্তির অতিরিক্ত বিবরণ ও নিয়মাবলী'}
              </div>
              <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                {d.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Share Notice' : 'বিজ্ঞপ্তি শেয়ার করুন'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
