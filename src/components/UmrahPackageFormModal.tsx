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
  Plus,
  Send,
} from 'lucide-react';
import { UmrahPackage, UmrahCategory, AppLanguage } from '../types';

interface UmrahPackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePackage: (pkg: UmrahPackage) => void;
  lang?: AppLanguage;
}

const COMMON_INCLUSIONS = {
  bn: [
    'উমরাহ ভিসা ও হেলথ ইনস্যুরেন্স',
    'রিটার্ন ফ্লাইটের টিকিট',
    'মক্কা ও মদিনা হোটেল শেয়ারিং',
    '৩ বেলা বাংলা খাবার সরবরাহ',
    'মক্কা ও মদিনা ঐতিহাসিক স্থান জিয়ারাহ',
    'অভিজ্ঞ মুয়াল্লিম দ্বারা সরাসরি নির্দেশিকা',
    'লগেজ ট্রান্সপোর্ট ও যাতায়াত সুবিধা',
    '৫ লিটার জমজমের পানি'
  ],
  en: [
    'Umrah Visa & Health Insurance',
    'Return Flight Ticket',
    'Makkah & Madinah Hotel Sharing',
    '3 Meals Daily Included',
    'Makkah & Madinah Historical Ziyarah',
    'Guided by Experienced Muallim',
    'Luggage & Transport Service',
    '5L Zamzam Water Included'
  ]
};


export const UmrahPackageFormModal: React.FC<UmrahPackageFormModalProps> = ({
  isOpen,
  onClose,
  onSavePackage,
  lang = 'bn',
}) => {
  const [companyName, setCompanyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [officeLocation, setOfficeLocation] = useState('শিলচর, আসাম');
  const [packageTitle, setPackageTitle] = useState('');
  const [pricePerPerson, setPricePerPerson] = useState<string>('85000');
  const [sharingType, setSharingType] = useState<'quad' | 'triple' | 'double' | 'any'>('quad');
  const [category, setCategory] = useState<UmrahCategory>('deluxe');
  const [durationDays, setDurationDays] = useState<number>(15);
  const [departureCity, setDepartureCity] = useState('শিলচর / গুয়াহাটি');
  const [departureMonthOrDate, setDepartureMonthOrDate] = useState('রমজান ২০২৬');
  const [makkahHotel, setMakkahHotel] = useState('হোটেল আনোয়ার আল দিয়াহ');
  const [makkahDistanceMeters, setMakkahDistanceMeters] = useState<number>(350);
  const [madinahHotel, setMadinahHotel] = useState('হোটেল দার আল তাকাওয়া');
  const [madinahDistanceMeters, setMadinahDistanceMeters] = useState<number>(200);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([
    'সৌদি উমরাহ ভিসা ও ইন্সুরেন্স',
    'রিটার্ন এয়ার টিকিট',
    'মক্কা ও মদিনা হোটেল আবাসন',
    '৩ বেলা দেশি বুফে খাবার',
    'মক্কা ও মদিনার ঐতিহাসিক স্থান জিয়ারত',
    'শীতাতপ নিয়ন্ত্রিত বাসে অভ্যন্তরীণ যাতায়াত',
    'অভিজ্ঞ মুয়াল্লিম ও আলেম গাইড',
    '৫ লিটার জমজম পানি',
  ]);
  const [customInclusionText, setCustomInclusionText] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleInclusion = (inc: string) => {
    setSelectedInclusions((prev) =>
      prev.includes(inc) ? prev.filter((item) => item !== inc) : [...prev, inc]
    );
  };

  const handleAddCustomInclusion = () => {
    if (!customInclusionText.trim()) return;
    if (!selectedInclusions.includes(customInclusionText.trim())) {
      setSelectedInclusions([...selectedInclusions, customInclusionText.trim()]);
    }
    setCustomInclusionText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!companyName.trim()) {
      setErrorMsg(lang === 'bn' ? 'দয়া করে ট্রাভেল কোম্পানির নাম লিখুন' : 'Please enter company name');
      return;
    }
    if (!contactPhone.trim() && !whatsappNumber.trim()) {
      setErrorMsg(
        lang === 'bn' ? 'কমপক্ষে একটি কল বা হোয়াটসঅ্যাপ নম্বর দিন' : 'Please enter phone or WhatsApp number'
      );
      return;
    }
    if (!packageTitle.trim()) {
      setErrorMsg(lang === 'bn' ? 'প্যাকেজের শিরোনাম লিখুন' : 'Please enter package title');
      return;
    }
    const price = parseInt(pricePerPerson, 10);
    if (isNaN(price) || price <= 0) {
      setErrorMsg(lang === 'bn' ? 'সঠিক মূল্য উল্লেখ করুন' : 'Please enter a valid price');
      return;
    }

    const newPackage: UmrahPackage = {
      id: `custom_pkg_${Date.now()}`,
      companyName: companyName.trim(),
      licenseNumber: licenseNumber.trim() || undefined,
      contactPhone: contactPhone.trim() || whatsappNumber.trim(),
      whatsappNumber: whatsappNumber.trim() || contactPhone.trim(),
      officeLocation: officeLocation.trim() || 'শিলচর, আসাম',
      packageTitle: packageTitle.trim(),
      pricePerPerson: price,
      sharingType,
      category,
      durationDays: Number(durationDays) || 15,
      departureCity: departureCity.trim() || 'শিলচর',
      departureMonthOrDate: departureMonthOrDate.trim() || 'শীঘ্রই',
      makkahHotel: makkahHotel.trim() || 'মক্কা হোটেল',
      makkahDistanceMeters: Number(makkahDistanceMeters) || 300,
      madinahHotel: madinahHotel.trim() || 'মদিনা হোটেল',
      madinahDistanceMeters: Number(madinahDistanceMeters) || 200,
      inclusions: selectedInclusions.length > 0 ? selectedInclusions : ['উমরাহ ভিসা', 'হোটেল', 'জিয়ারত'],
      description: description.trim() || undefined,
      createdAt: Date.now(),
      isVerified: true,
      isCustomSubmission: true,
    };

    onSavePackage(newPackage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn'
                  ? 'উমরাহ ট্রাভেলস প্যাকেজ লিস্টিং'
                  : 'Post Umrah Travel Package'}
              </h3>
              <p className="text-xs text-emerald-300/80">
                {lang === 'bn'
                  ? 'আপনার ট্রাভেল এজেন্সির প্যাকেজ বিবরণ পূরণ করুন যাতে হাজীরা সরাসরি দেখতে ও বুক করতে পারেন'
                  : 'Fill in your Umrah package details for pilgrims to view and contact you directly'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-900/60 border border-rose-500/50 text-rose-200 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section 1: Agency Information */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-[#E2A336] font-bold text-sm">
              <Building2 className="w-4 h-4" />
              <span>{lang === 'bn' ? '১. ট্রাভেল এজেন্সি ও যোগাযোগের তথ্য' : '1. Agency & Contact Info'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  কোম্পানি / এজেন্সির নাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: আল-হারামাইন ট্যুরস অ্যান্ড ট্রাভেলস"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  লাইসেন্স বা রেজি: নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: HAJJ-ASSAM-2026/01"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  হোয়াটসঅ্যাপ নম্বর (WhatsApp) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="+91 94350 12345"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg pl-8 pr-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  কল করার ফোন নম্বর <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98640 54321"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg pl-8 pr-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-emerald-200 font-semibold mb-1">
                  অফিসের ঠিকানা / শহর <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: সোনাই রোড, শিলচর / স্টেশন রোড, করিমগঞ্জ / কলকাতা"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg pl-8 pr-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Package Details */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-[#E2A336] font-bold text-sm">
              <Plane className="w-4 h-4" />
              <span>{lang === 'bn' ? '২. প্যাকেজের বিবরণ ও খরচ' : '2. Package Info & Pricing'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-emerald-200 font-semibold mb-1">
                  প্যাকেজের শিরোনাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ১৫ দিনের মাহে রমজান উমরাহ স্পেশাল কাফেলা"
                  value={packageTitle}
                  onChange={(e) => setPackageTitle(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  জনপ্রতি মূল্য (টাকায় / ₹) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="10000"
                    placeholder="85000"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg pl-7 pr-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  রুম শেয়ারিং ধরণ
                </label>
                <select
                  value={sharingType}
                  onChange={(e) => setSharingType(e.target.value as any)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                >
                  <option value="quad">৪ জনের শেয়ারিং (Quad)</option>
                  <option value="triple">৩ জনের শেয়ারিং (Triple)</option>
                  <option value="double">২ জনের শেয়ারিং (Double)</option>
                  <option value="any">যেকোনো শেয়ারিং ব্যবস্থা</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  প্যাকেজ ক্যাটাগরি
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UmrahCategory)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                >
                  <option value="ramadan">🌙 রমজান স্পেশাল (Ramadan)</option>
                  <option value="economy">🌟 ইকোনমি / সাশ্রয়ী (Economy)</option>
                  <option value="deluxe">💎 ডিলাক্স / ৪-স্টার (Deluxe)</option>
                  <option value="vip">👑 ভিআইপি / ৫-স্টার লাক্সারি (VIP)</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  সফরের সময়কাল (দিন সংখ্যা) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  max="45"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  যাত্রার প্রারম্ভিক শহর / এয়ারপোর্ট <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: শিলচর / গুয়াহাটি / কলকাতা"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  সম্ভাব্য যাত্রার তারিখ বা মাস <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রমজান ২০২৬ / প্রতি শুক্রবার"
                  value={departureMonthOrDate}
                  onChange={(e) => setDepartureMonthOrDate(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hotel Accommodations */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-[#E2A336] font-bold text-sm">
              <Hotel className="w-4 h-4" />
              <span>{lang === 'bn' ? '৩. মক্কা ও মদিনার হোটেল ও দূরত্ব' : '3. Hotels & Distances'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  মক্কার হোটেলের নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হোটেল আনোয়ার আল দিয়াহ"
                  value={makkahHotel}
                  onChange={(e) => setMakkahHotel(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  মক্কায় হারাম শরীফ থেকে দূরত্ব (মিটার)
                </label>
                <input
                  type="number"
                  placeholder="350"
                  value={makkahDistanceMeters}
                  onChange={(e) => setMakkahDistanceMeters(parseInt(e.target.value, 10))}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  মদিনার হোটেলের নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: হোটেল দার আল তাকাওয়া"
                  value={madinahHotel}
                  onChange={(e) => setMadinahHotel(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="block text-emerald-200 font-semibold mb-1">
                  মদিনায় মসজিদুন নববী থেকে দূরত্ব (মিটার)
                </label>
                <input
                  type="number"
                  placeholder="200"
                  value={madinahDistanceMeters}
                  onChange={(e) => setMadinahDistanceMeters(parseInt(e.target.value, 10))}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Inclusions Checkboxes */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 text-[#E2A336] font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'bn' ? '৪. প্যাকেজে যা যা অন্তর্ভুক্ত' : '4. Inclusions'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(COMMON_INCLUSIONS[lang as 'bn' | 'en'] || COMMON_INCLUSIONS.bn).map((inc) => {
                const isChecked = selectedInclusions.includes(inc);
                return (
                  <button
                    type="button"
                    key={inc}
                    onClick={() => toggleInclusion(inc)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'bg-[#E2A336]/20 border-[#E2A336] text-white'
                        : 'bg-[#03221F] border-emerald-800/60 text-emerald-300/70 hover:bg-emerald-900/40'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        isChecked ? 'text-[#E2A336]' : 'text-emerald-700'
                      }`}
                    />
                    <span className="text-[11px] font-medium leading-tight">{inc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Inclusion Input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="অন্য কোনো বিশেষ সুবিধা যুক্ত করুন..."
                value={customInclusionText}
                onChange={(e) => setCustomInclusionText(e.target.value)}
                className="flex-1 bg-[#03221F] border border-emerald-700/60 rounded-lg px-3 py-1.5 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
              />
              <button
                type="button"
                onClick={handleAddCustomInclusion}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>যোগ করুন</span>
              </button>
            </div>
          </div>

          {/* Section 5: Additional Notes */}
          <div className="bg-[#09332E]/70 border border-emerald-800/60 rounded-xl p-3.5 space-y-2">
            <label className="block text-emerald-200 font-semibold">
              ৫. বিশেষ বিবরণ বা শর্তাবলী (ঐচ্ছিক)
            </label>
            <textarea
              rows={3}
              placeholder="পাসপোর্টের প্রয়োজনীয়তা, বয়স্ক হাজীদের সেবা, বিশেষ গাইড বা বুকিংয়ের নিয়মাবলী লিখুন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#03221F] border border-emerald-700/60 rounded-lg p-2.5 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336] resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-medium transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>প্যাকেজ পোস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
