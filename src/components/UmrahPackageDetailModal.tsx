import React, { useState } from 'react';
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
  Trash2,
  Check,
} from 'lucide-react';
import { UmrahPackage, AppLanguage } from '../types';
import { getUmrahDisplay } from '../utils/portalTranslations';

interface UmrahPackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: UmrahPackage | null;
  lang?: AppLanguage;
  onDeletePackage?: (pkgId: string) => void;
}

export const UmrahPackageDetailModal: React.FC<UmrahPackageDetailModalProps> = ({
  isOpen,
  onClose,
  pkg,
  lang = 'bn',
  onDeletePackage,
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !pkg) return null;

  const display = getUmrahDisplay(pkg, lang);

  const handleWhatsApp = () => {
    const cleanNumber = pkg.whatsappNumber.replace(/[^0-9]/g, '');
    let message = '';
    if (lang === 'en') {
      message = encodeURIComponent(
        `Assalamu Alaikum. I am interested in your '${display.packageTitle}' Umrah package (₹${pkg.pricePerPerson.toLocaleString('en-IN')} per person). Please share more details and booking procedure.`
      );
    } else if (lang === 'ur') {
      message = encodeURIComponent(
        `السلام علیکم! میں آپ کے '${display.packageTitle}' عمرہ پیکیج (فی کس ₹${pkg.pricePerPerson.toLocaleString('en-IN')}) کے بارے میں معلومات اور بکنگ کے لیے رابطہ کر رہا ہوں۔`
      );
    } else {
      message = encodeURIComponent(
        `আসসালামু আলাইকুম। আমি আপনাদের '${display.packageTitle}' উমরাহ প্যাকেজ (জনপ্রতি ₹${pkg.pricePerPerson.toLocaleString('en-IN')}) সম্পর্কে বিস্তারিত জানতে ও বুকিং করতে আগ্রহী।`
      );
    }
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${pkg.contactPhone}`, '_self');
  };

  const handleShare = () => {
    const text = `🕋 ${display.packageTitle}\n${
      lang === 'en' ? 'Agency' : lang === 'ur' ? 'ایجنسی' : 'কোম্পানি'
    }: ${display.companyName}\n${
      lang === 'en' ? 'Price per person' : lang === 'ur' ? 'خرچ فی کس' : 'জনপ্রতি খরচ'
    }: ₹${pkg.pricePerPerson.toLocaleString('en-IN')}\n${
      lang === 'en' ? 'Duration' : lang === 'ur' ? 'مدت' : 'মেয়াদ'
    }: ${pkg.durationDays} ${
      lang === 'en' ? 'Days' : lang === 'ur' ? 'دن' : 'দিন'
    } | ${
      lang === 'en' ? 'From' : lang === 'ur' ? 'روانگی' : 'যাত্রা'
    }: ${display.departureCity}\n${
      lang === 'en' ? 'Contact' : lang === 'ur' ? 'رابطہ' : 'যোগাযোগ'
    }: ${pkg.contactPhone}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const confirmDelete = () => {
    if (onDeletePackage) {
      onDeletePackage(pkg.id);
      setShowConfirmDelete(false);
      onClose();
    }
  };

  const sharingLabel =
    pkg.sharingType === 'double'
      ? (lang === 'en' ? '2-Person Room' : lang === 'ur' ? '۲ افراد کمرہ' : '২ জন রুম')
      : pkg.sharingType === 'triple'
      ? (lang === 'en' ? '3-Person Room' : lang === 'ur' ? '۳ افراد کمرہ' : '৩ জন রুম')
      : (lang === 'en' ? '4-Person Room' : lang === 'ur' ? '۴ افراد کمرہ' : '৪ জন রুম');

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
                    ? (lang === 'en' ? '🌙 Ramadan Special' : lang === 'ur' ? '🌙 رمضان اسپیشل' : '🌙 রমজান স্পেশাল')
                    : pkg.category === 'vip'
                    ? (lang === 'en' ? '👑 5-Star VIP' : lang === 'ur' ? '👑 ۵-اسٹار وی آئی پی' : '👑 ৫-স্টার ভিআইপি')
                    : pkg.category === 'deluxe'
                    ? (lang === 'en' ? '💎 Deluxe' : lang === 'ur' ? '💎 ڈیلکس' : '💎 ডিলাক্স')
                    : (lang === 'en' ? '🌟 Economy' : lang === 'ur' ? '🌟 معاشی' : '🌟 ইকোনমি')}
                </span>
                <span className="text-xs text-emerald-300/80 font-medium">
                  {pkg.durationDays} {lang === 'en' ? 'Days Blessed Journey' : lang === 'ur' ? 'روزہ مقدس سفر' : 'দিনের পবিত্র কাফেলা'}
                </span>
                {pkg.isCustomSubmission && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {lang === 'en' ? 'User Listing' : lang === 'ur' ? 'صارف کی لسٹنگ' : 'আপনার লিস্টিং'}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {display.packageTitle}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Price & Overview Card */}
          <div className="bg-gradient-to-r from-[#09332E] to-[#0d443d] border border-[#E2A336]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                {lang === 'en' ? 'Total Package Cost (Per Person)' : lang === 'ur' ? 'کل پیکیج قیمت (فی کس)' : 'সর্বমোট প্যাকেজ মূল্য (জনপ্রতি)'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#E2A336] flex items-baseline gap-1">
                <span>₹{pkg.pricePerPerson.toLocaleString('en-IN')}</span>
                <span className="text-xs text-emerald-200/70 font-normal">
                  / {sharingLabel}
                </span>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-2 flex-wrap">
                <span>🛫 {lang === 'en' ? 'Departure City:' : lang === 'ur' ? 'شہر روانگی:' : 'প্রারম্ভিক শহর:'} <strong>{display.departureCity}</strong></span>
                <span>•</span>
                <span>📅 {lang === 'en' ? 'Departure Date:' : lang === 'ur' ? 'تاریخ سفر:' : 'যাত্রা:'} <strong>{display.departureMonthOrDate}</strong></span>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{lang === 'en' ? 'WhatsApp Booking' : lang === 'ur' ? 'واٹس ایپ رابطہ' : 'WhatsApp এ বুকিং'}</span>
              </button>
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{lang === 'en' ? 'Call Now' : lang === 'ur' ? 'کال کریں' : 'কল করুন'}</span>
              </button>
            </div>
          </div>

          {/* Agency Details */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#E2A336]" />
                <span className="font-bold text-white text-sm">{display.companyName}</span>
              </div>
              {pkg.licenseNumber && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-700">
                  Lic: {pkg.licenseNumber}
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-200/80 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{display.officeLocation}</span>
            </div>
          </div>

          {/* Hotels & Distance from Haram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Makkah Hotel */}
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#E2A336] font-bold">
                <Hotel className="w-4 h-4" />
                <span>{lang === 'en' ? 'Makkah Mukarramah Hotel' : lang === 'ur' ? 'مکہ مکرمہ ہوٹل' : 'মক্কা মুকাররমা হোটেল'}</span>
              </div>
              <div className="text-sm font-semibold text-white">{display.makkahHotel}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#03221F] text-amber-300 border border-amber-500/30">
                <span>🕋 {lang === 'en' ? `Only ${pkg.makkahDistanceMeters}m from Holy Haram` : lang === 'ur' ? `حرم شریف سے صرف ${pkg.makkahDistanceMeters} میٹر` : `হারাম শরীফ থেকে মাত্র ${pkg.makkahDistanceMeters} মিটার`}</span>
                <span className="text-[10px] text-emerald-400">
                  (~{Math.ceil(pkg.makkahDistanceMeters / 80)} {lang === 'en' ? 'min walk' : lang === 'ur' ? 'منٹ پیدل' : 'মিনিট হাঁটা'})
                </span>
              </div>
            </div>

            {/* Madinah Hotel */}
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Hotel className="w-4 h-4" />
                <span>{lang === 'en' ? 'Madinah Munawwarah Hotel' : lang === 'ur' ? 'مدینہ منورہ ہوٹل' : 'মদিনা মুনাওয়ারা হোটেল'}</span>
              </div>
              <div className="text-sm font-semibold text-white">{display.madinahHotel}</div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-[#03221F] text-emerald-300 border border-emerald-500/30">
                <span>🕌 {lang === 'en' ? `Only ${pkg.madinahDistanceMeters}m from Masjid an-Nabawi` : lang === 'ur' ? `مسجد نبوی سے صرف ${pkg.madinahDistanceMeters} میٹر` : `মসজিদুন নববী থেকে মাত্র ${pkg.madinahDistanceMeters} মিটার`}</span>
                <span className="text-[10px] text-emerald-400">
                  (~{Math.ceil(pkg.madinahDistanceMeters / 80)} {lang === 'en' ? 'min walk' : lang === 'ur' ? 'منٹ پیدل' : 'মিনিট হাঁটা'})
                </span>
              </div>
            </div>
          </div>

          {/* Included Amenities & Inclusions */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-[#E2A336] font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'en' ? 'All Package Inclusions & Amenities' : lang === 'ur' ? 'پیکیج میں شامل تمام سہولیات' : 'প্যাকেজের অন্তর্ভুক্ত সকল সুবিধাসমূহ'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {display.inclusions.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-emerald-100 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {display.description && (
            <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
              <div className="font-bold text-white text-xs">
                {lang === 'en' ? 'Detailed Description & Terms' : lang === 'ur' ? 'تفصیلی تفصیلات اور شرائط' : 'বিস্তারিত বিবরণ ও নিয়মাবলী'}
              </div>
              <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                {display.description}
              </p>
            </div>
          )}

          {/* In-Modal Delete Confirmation Box */}
          {showConfirmDelete && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-600/70 text-rose-200 space-y-2 animate-in fade-in duration-200">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>
                  {lang === 'en'
                    ? 'Confirm Delete this Umrah Package?'
                    : lang === 'ur'
                    ? 'کیا آپ واقعی اس عمرہ پیکیج کو حذف کرنا چاہتے ہیں؟'
                    : 'আপনি কি নিশ্চিত এই উমরাহ প্যাকেজটি মুছে ফেলতে চান?'}
                </span>
              </div>
              <p className="text-xs text-rose-300/90">
                {lang === 'en'
                  ? 'This action cannot be undone.'
                  : lang === 'ur'
                  ? 'یہ عمل واپس نہیں لیا جا سکتا۔'
                  : 'এই প্যাকেজটি আপনার তালিকা থেকে স্থায়ীভাবে মুছে যাবে।'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {lang === 'en' ? 'Yes, Delete' : lang === 'ur' ? 'ہاں، حذف کریں' : 'হ্যাঁ, মুছুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#03221F] hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold cursor-pointer border border-emerald-700/50"
                >
                  {lang === 'en' ? 'Cancel' : lang === 'ur' ? 'منسوخ' : 'বাতিল'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'en' ? 'Copied!' : lang === 'ur' ? 'کاپی ہوگیا!' : 'কপি হয়েছে!') : (lang === 'en' ? 'Share Details' : lang === 'ur' ? 'شیئر کریں' : 'শেয়ার করুন')}</span>
            </button>

            {onDeletePackage && !showConfirmDelete && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900/90 border border-rose-600/40 text-rose-300 font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{lang === 'en' ? 'Delete' : lang === 'ur' ? 'حذف کریں' : 'মুছুন'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : lang === 'ur' ? 'بند کریں' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
