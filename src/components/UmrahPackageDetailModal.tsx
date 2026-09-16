import React from 'react';
import {
  X,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Plane,
  Hotel,
  ShieldCheck,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { UmrahPackage, AppLanguage } from '../types';

interface UmrahPackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: UmrahPackage | null;
  lang?: AppLanguage;
}

export const UmrahPackageDetailModal: React.FC<UmrahPackageDetailModalProps> = ({
  isOpen,
  onClose,
  pkg,
  lang = 'bn',
}) => {
  if (!isOpen || !pkg) return null;

  const handleWhatsApp = () => {
    const cleanNumber = pkg.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম। আমি আপনাদের '${pkg.packageTitle}' উমরাহ প্যাকেজ (জনপ্রতি ₹${pkg.pricePerPerson.toLocaleString('en-IN')}) সম্পর্কে বিস্তারিত জানতে ও বুকিং করতে আগ্রহী।`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${pkg.contactPhone}`, '_self');
  };

  const handleShare = () => {
    const text = `🕋 ${pkg.packageTitle}\nকোম্পানি: ${pkg.companyName}\nজনপ্রতি খরচ: ₹${pkg.pricePerPerson.toLocaleString('en-IN')}\nমেয়াদ: ${pkg.durationDays} দিন | যাত্রা: ${pkg.departureCity}\nযোগাযোগ: ${pkg.contactPhone}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('প্যাকেজের তথ্য ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E2A336] text-[#03221F]">
                  {pkg.category === 'ramadan'
                    ? '🌙 রমজান স্পেশাল'
                    : pkg.category === 'vip'
                    ? '👑 ৫-স্টার ভিআইপি'
                    : pkg.category === 'deluxe'
                    ? '💎 ডিলাক্স'
                    : '🌟 ইকোনমি'}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  {pkg.durationDays} দিনের পবিত্র কাফেলা
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {pkg.packageTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Price & Overview Card */}
          <div className="bg-gradient-to-r from-[#09332E] to-[#0d443d] border border-[#E2A336]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                সর্বমোট প্যাকেজ মূল্য (জনপ্রতি)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#E2A336] flex items-baseline gap-1">
                <span>₹{pkg.pricePerPerson.toLocaleString('en-IN')}</span>
                <span className="text-xs text-emerald-200/70 font-normal">
                  / {pkg.sharingType === 'double' ? '২ জন রুম' : pkg.sharingType === 'triple' ? '৩ জন রুম' : '৪ জন রুম'}
                </span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-2">
                <span>🛫 প্রারম্ভিক শহর: <strong>{pkg.departureCity}</strong></span>
                <span>•</span>
                <span>📅 যাত্রা: <strong>{pkg.departureMonthOrDate}</strong></span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp এ বুকিং</span>
              </button>
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>কল করুন</span>
              </button>
            </div>
          </div>

          {/* Agency Details */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E2A336]" />
                <span className="font-bold text-white text-sm">{pkg.companyName}</span>
              </div>
              {pkg.licenseNumber && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-700">
                  Lic: {pkg.licenseNumber}
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-200/80 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{pkg.officeLocation}</span>
            </div>
          </div>

          {/* Hotels & Distance from Haram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Makkah Hotel */}
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#E2A336] font-bold">
                <Hotel className="w-4 h-4" />
                <span>মক্কা মুকাররমা হোটেল</span>
              </div>
              <div className="text-sm font-semibold text-white">{pkg.makkahHotel}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#03221F] text-amber-300 border border-amber-500/30">
                <span>🕋 হারাম শরীফ থেকে মাত্র {pkg.makkahDistanceMeters} মিটার</span>
                <span className="text-[10px] text-emerald-400">
                  (~{Math.ceil(pkg.makkahDistanceMeters / 80)} মিনিট হাঁটা)
                </span>
              </div>
            </div>

            {/* Madinah Hotel */}
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Hotel className="w-4 h-4" />
                <span>মদিনা মুনাওয়ারা হোটেল</span>
              </div>
              <div className="text-sm font-semibold text-white">{pkg.madinahHotel}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#03221F] text-emerald-300 border border-emerald-500/30">
                <span>🕌 মসজিদুন নববী থেকে মাত্র {pkg.madinahDistanceMeters} মিটার</span>
                <span className="text-[10px] text-emerald-400">
                  (~{Math.ceil(pkg.madinahDistanceMeters / 80)} মিনিট হাঁটা)
                </span>
              </div>
            </div>
          </div>

          {/* Included Amenities & Inclusions */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>প্যাকেজের অন্তর্ভুক্ত সকল সুবিধাসমূহ</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pkg.inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-emerald-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {pkg.description && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-white text-xs">বিস্তারিত বিবরণ ও নিয়মাবলী</div>
              <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>শেয়ার করুন</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
