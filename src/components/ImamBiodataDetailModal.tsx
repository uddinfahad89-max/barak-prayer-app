import React from 'react';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  MessageCircle,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Building2,
  Heart,
} from 'lucide-react';
import { ImamBiodata, AppLanguage } from '../types';

interface ImamBiodataDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  biodata: ImamBiodata | null;
  lang?: AppLanguage;
}

export const ImamBiodataDetailModal: React.FC<ImamBiodataDetailModalProps> = ({
  isOpen,
  onClose,
  biodata,
}) => {
  if (!isOpen || !biodata) return null;

  const cleanNumber = biodata.whatsappNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    `আসসালামু আলাইকুম হযরত। আমরা আপনার '${biodata.fullName}' (${biodata.title}) ইমামতির বায়োডাটা দেখেছি। আমাদের মসজিদের ইমাম/খতীব নিয়োগ সংক্রান্ত বিষয়ে আপনার সাথে আলোচনা করতে চাই।`
  );

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${biodata.contactPhone}`, '_self');
  };

  const handleShare = () => {
    const text = `👳‍♂️ ইমাম সাহেবের বায়োডাটা\nনাম: ${biodata.fullName} (${biodata.title})\nযোগ্যতা: ${biodata.qualification}\nমাদ্রাসা: ${biodata.institution}\nঅভিজ্ঞতা: ${biodata.experienceYears} বছর | বয়স: ${biodata.age} বছর\nবর্তমান জেলা: ${biodata.currentLocation}\nপছন্দের এলাকা: ${biodata.preferredLocation}\nপ্রত্যাশিত হাদিয়া: ₹${biodata.expectedSalary.toLocaleString('en-IN')}\nযোগাযোগ: ${biodata.contactPhone}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('ইমাম সাহেবের বায়োডাটা ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                  {biodata.title}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  বয়স: {biodata.age} বছর • {biodata.maritalStatus}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {biodata.fullName}
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
          {/* Top Quick Salary & Contact Card */}
          <div className="bg-gradient-to-r from-[#09332E] to-[#0c433c] border border-[#E2A336]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                প্রত্যাশিত মাসিক হাদিয়া / সম্মানী
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#E2A336] flex items-baseline gap-1">
                <span>₹{biodata.expectedSalary.toLocaleString('en-IN')}</span>
                <span className="text-xs text-emerald-200/70 font-normal">/ মাস</span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 বর্তমান: <strong>{biodata.currentLocation}</strong></span>
                <span>•</span>
                <span>🎯 পছন্দের এলাকা: <strong>{biodata.preferredLocation}</strong></span>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp এ কথা বলুন</span>
              </button>
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>কল করুন</span>
              </button>
            </div>
          </div>

          {/* Academic & Islamic Degrees */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>শিক্ষাগত ও দ্বীনি যোগ্যতা</span>
            </div>
            <div className="text-sm font-semibold text-white pl-6">
              {biodata.qualification}
            </div>
            <div className="text-xs text-emerald-300/80 pl-6 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>পড়াশোনার প্রতিষ্ঠান: <strong>{biodata.institution}</strong></span>
            </div>
            <div className="text-xs text-emerald-200/90 pl-6 flex items-center gap-1.5 pt-1">
              <Briefcase className="w-3.5 h-3.5 text-[#E2A336] shrink-0" />
              <span>ইমামতি / শিক্ষকতার অভিজ্ঞতা: <strong>{biodata.experienceYears} বছর</strong></span>
            </div>
          </div>

          {/* Skills / Expertise */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>বিশেষ দক্ষতা ও খেদমতের ক্ষেত্র</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {biodata.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 text-emerald-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demanded Facilities */}
          {biodata.facilitiesDemanded && biodata.facilitiesDemanded.length > 0 && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Heart className="w-4 h-4 text-[#E2A336]" />
                <span>মসজিদ কমিটি থেকে কাঙ্ক্ষিত সুবিধাসমূহ</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {biodata.facilitiesDemanded.map((fac, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#03221F] text-emerald-200 border border-emerald-700/40 text-xs"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio notes */}
          {biodata.bioNotes && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <div className="font-bold text-white text-xs">ব্যক্তিগত বার্তা ও অনুভূতি</div>
              <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                {biodata.bioNotes}
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
            <span>বায়োডাটা শেয়ার করুন</span>
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
