import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Share2,
  User,
  Users,
} from 'lucide-react';
import { MatrimonyBiodata, AppLanguage } from '../types';

interface MatrimonyBiodataDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  biodata: MatrimonyBiodata | null;
  lang?: AppLanguage;
}

export const MatrimonyBiodataDetailModal: React.FC<MatrimonyBiodataDetailModalProps> = ({
  isOpen,
  onClose,
  biodata,
  lang = 'bn',
}) => {
  if (!isOpen || !biodata) return null;

  const cleanNumber = (biodata.whatsappNumber || biodata.guardianPhone).replace(/[^0-9]/g, '');

  const waMessage = encodeURIComponent(
    `আসসালামু আলাইকুম ওয়ারাহমাতুল্লাহ।
বরাক ইসলামিক অ্যাপ্লিকেশনের "দ্বীনি পাত্র-পাত্রী পোর্টাল"-এ আপনাদের "${biodata.type === 'groom' ? 'পাত্রের' : 'পাত্রীর'} (${biodata.codeName})" বায়োডাটা দেখে যোগাযোগ করছি।
আমরা বিস্তারিত আলোচনা ও দ্বীনি প্রস্তাবের জন্য কথা বলতে আগ্রহী।`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${biodata.type === 'groom' ? 'পাত্র' : 'পাত্রী'}: ${biodata.codeName}`,
        text: `${biodata.codeName} - বয়স: ${biodata.age}, পেশা: ${biodata.profession}, জেলা: ${biodata.district}। বরাক ইসলামিক অ্যাপে বিস্তারিত দেখুন।`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${biodata.codeName} | বয়স: ${biodata.age} | পেশা: ${biodata.profession} | জেলা: ${biodata.district} | অভিভাবকের ফোন: ${biodata.guardianPhone}`
      );
      alert('বায়োডাটার সারসংক্ষেপ কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#03221F] border border-emerald-700/80 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              {biodata.type === 'groom' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  {biodata.codeName}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  biodata.type === 'groom' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' : 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                }`}>
                  {biodata.type === 'groom' ? 'পাত্র (বর)' : 'পাত্রী (কনে)'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                {biodata.fullName} • {biodata.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-3 gap-2 bg-[#072a25] p-3 rounded-xl border border-emerald-800/60 text-center">
            <div>
              <span className="text-[10px] text-emerald-400/80 block">বয়স</span>
              <span className="text-sm font-bold text-white">{biodata.age} বছর</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400/80 block">উচ্চতা</span>
              <span className="text-sm font-bold text-white">{biodata.height}</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400/80 block">গায়ের রঙ</span>
              <span className="text-sm font-bold text-[#E2A336]">{biodata.complexion}</span>
            </div>
          </div>

          {/* Education & Profession */}
          <div className="space-y-2.5 bg-[#072a25] p-3.5 rounded-xl border border-emerald-800/60">
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#E2A336] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-emerald-400 font-medium">শিক্ষাগত যোগ্যতা:</span>
                <p className="text-xs font-semibold text-white mt-0.5">{biodata.education}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-emerald-800/40">
              <Briefcase className="w-4 h-4 text-[#E2A336] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-emerald-400 font-medium">পেশা ও আয়:</span>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {biodata.profession} {biodata.monthlyIncome ? `(${biodata.monthlyIncome})` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-2 border-t border-emerald-800/40">
              <MapPin className="w-4 h-4 text-[#E2A336] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-emerald-400 font-medium">ঠিকানা ও এলাকা:</span>
                <p className="text-xs font-semibold text-white mt-0.5">
                  {biodata.area}, {biodata.district}
                </p>
              </div>
            </div>
          </div>

          {/* Religious Practices */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E2A336]" />
              <span>দ্বীনি বৈশিষ্ট্য ও ধর্মীয় অনুশাসন:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {biodata.religiousPractices.map((prac, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#072a25] border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#E2A336]" />
                  <span>{prac}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Family & Background */}
          <div className="space-y-1.5 bg-[#072a25] p-3 rounded-xl border border-emerald-800/60">
            <h4 className="text-xs font-bold text-emerald-200">পারিবারিক পরিচিতি:</h4>
            <p className="text-xs text-emerald-100">
              <span className="text-emerald-400 font-medium">পিতার পেশা:</span> {biodata.fatherOccupation}
            </p>
            <p className="text-xs text-emerald-100">
              <span className="text-emerald-400 font-medium">পরিবারের ধরন:</span> {biodata.familyType}
            </p>
            {biodata.bioNotes && (
              <p className="text-xs text-emerald-300/90 italic pt-1 border-t border-emerald-800/40">
                "{biodata.bioNotes}"
              </p>
            )}
          </div>

          {/* Expectations */}
          <div className="space-y-1.5 bg-[#072a25] p-3 rounded-xl border border-emerald-800/60">
            <h4 className="text-xs font-bold text-[#E2A336] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>প্রত্যাশিত জীবনসঙ্গী:</span>
            </h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {biodata.partnerExpectations}
            </p>
          </div>

          {/* Guardian & Contact Information */}
          <div className="p-4 bg-[#09332E] border border-emerald-700/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-medium">যোগাযোগের অভিভাবক:</span>
                <p className="text-xs font-bold text-white">
                  {biodata.guardianRelation}
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#E2A336] font-bold">
                {biodata.guardianPhone}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60">
              <a
                href={`https://wa.me/${cleanNumber}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-md text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp বার্তা</span>
              </a>

              <a
                href={`tel:${biodata.guardianPhone}`}
                className="py-2.5 px-3 rounded-xl bg-[#03221F] hover:bg-emerald-950 text-white border border-emerald-600 font-bold flex items-center justify-center gap-1.5 transition-colors text-xs shadow-md"
              >
                <Phone className="w-4 h-4 text-[#E2A336]" />
                <span>সরাসরি কল করুন</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/80 flex items-center justify-between">
          <span className="text-[10px] text-emerald-400/80">
            🔒 দ্বীনি ও শরীয়াহ রক্ষা করে শুধুমাত্র পরিবারের সাথে যোগাযোগ করুন
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
