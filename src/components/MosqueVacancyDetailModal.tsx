import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Clock,
  Briefcase,
  UserCheck,
} from 'lucide-react';
import { MosqueVacancy, AppLanguage } from '../types';

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
}) => {
  if (!isOpen || !vacancy) return null;

  const cleanNumber = vacancy.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `আসসালামু আলাইকুম। আপনাদের '${vacancy.mosqueName}' (${vacancy.area}, ${vacancy.district}) এর '${vacancy.position}' পদে নিয়োগ বিজ্ঞপ্তি দেখে যোগাযোগ করছি। আমি এই পদে খেদমতের জন্য আগ্রহী।`
  );

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${vacancy.contactPhone}`, '_self');
  };

  const handleShare = () => {
    const text = `🕌 মসজিদ কমিটির নিয়োগ বিজ্ঞপ্তি\nমসজিদ: ${vacancy.mosqueName}\nস্থান: ${vacancy.area}, ${vacancy.district}\nপদ: ${vacancy.position}\nযোগ্যতা: ${vacancy.requiredQualification}\nমাসিক হাদিয়া: ₹${vacancy.offeredSalary.toLocaleString('en-IN')}\nযোগাযোগ: ${vacancy.contactPerson} (${vacancy.contactPhone})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('মসজিদের নিয়োগ বিজ্ঞপ্তি ক্লিপবোর্ডে কপি করা হয়েছে!');
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
                  {vacancy.position}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  {vacancy.joiningDeadline}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {vacancy.mosqueName}
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
                কমিটি কর্তৃক নির্ধারিত মাসিক হাদিয়া
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#E2A336] flex items-baseline gap-1">
                <span>₹{vacancy.offeredSalary.toLocaleString('en-IN')}</span>
                <span className="text-xs text-emerald-200/70 font-normal">/ মাস</span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 স্থান: <strong>{vacancy.area}, {vacancy.district}</strong></span>
                <span>•</span>
                <span>⏱️ যোগদান: <strong>{vacancy.joiningDeadline}</strong></span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp এ আবেদন</span>
              </button>
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>কমিটিতে কল করুন</span>
              </button>
            </div>
          </div>

          {/* Committee Contact Details */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <UserCheck className="w-4 h-4" />
              <span>যোগাযোগ ও দায়িত্বশীল ব্যক্তি</span>
            </div>
            <div className="text-sm font-semibold text-white pl-6">
              {vacancy.contactPerson}
            </div>
            <div className="text-xs text-emerald-300/80 pl-6 flex items-center gap-3 flex-wrap">
              <span>📞 মোবাইল: <strong className="text-white">{vacancy.contactPhone}</strong></span>
              <span>💬 হোয়াটসঅ্যাপ: <strong className="text-white">{vacancy.whatsappNumber}</strong></span>
            </div>
          </div>

          {/* Requirements & Qualifications */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <Briefcase className="w-4 h-4" />
              <span>প্রয়োজনীয় যোগ্যতা ও শর্তাবলী</span>
            </div>
            <div className="pl-6 space-y-1.5">
              <div className="text-xs text-emerald-100">
                <span className="text-emerald-300 font-semibold">শিক্ষাগত যোগ্যতা: </span>
                <span className="text-white font-medium">{vacancy.requiredQualification}</span>
              </div>
              <div className="text-xs text-emerald-100">
                <span className="text-emerald-300 font-semibold">অভিজ্ঞতা: </span>
                <span className="text-white font-medium">{vacancy.experienceRequired}</span>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>ইমাম সাহেবের প্রধান দায়িত্বসমূহ</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pl-6">
                {vacancy.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-2 text-emerald-100 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Provided */}
          {vacancy.facilitiesOffered && vacancy.facilitiesOffered.length > 0 && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Building2 className="w-4 h-4 text-[#E2A336]" />
                <span>কমিটি কর্তৃক প্রদত্ত সকল সুযোগ-সুবিধা</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                {vacancy.facilitiesOffered.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 text-emerald-200 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Description */}
          {vacancy.description && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-white text-xs">বিজ্ঞপ্তির অতিরিক্ত বিবরণ ও নিয়মাবলী</div>
              <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                {vacancy.description}
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
            <span>বিজ্ঞপ্তি শেয়ার করুন</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
