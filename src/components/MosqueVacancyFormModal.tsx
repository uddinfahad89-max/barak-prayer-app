import React, { useState } from 'react';
import { X, Sparkles, Building2, MapPin, Phone, MessageCircle, Briefcase, IndianRupee, ShieldCheck } from 'lucide-react';
import { MosqueVacancy, AppLanguage } from '../types';

interface MosqueVacancyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vacancy: MosqueVacancy) => void;
  lang?: AppLanguage;
}

const COMMON_FACILITIES_OFFERED = [
  'মসজিদ সংলগ্ন সুসজ্জিত একক কামরা',
  'কমিটি কর্তৃক তিন বেলা খাবার সুব্যবস্থা',
  'ফ্রি বিদ্যুৎ ও পানির ব্যবস্থা',
  'ওয়াইফাই ইন্টারনেট সুবিধা',
  'ঈদুল ফিতর ও ঈদুল আজহায় আকর্ষণীয় বোনাস',
  'বাৎসরিক ২০ দিনের পেইড ছুটি',
  'পরিবার নিয়ে থাকার পৃথক ব্যবস্থা',
];

const COMMON_RESPONSIBILITIES = [
  '৫ ওয়াক্ত ফরজ নামাজের ইমামতি',
  'শুক্রবার জুমআর নামাজে বিষয়ভিত্তিক বয়ান ও খুতবা পাঠ',
  'সকালে নূরানী মক্তবে শিশুদের সহীহ কুরআন শিক্ষা দান',
  'রমজানে তারাবীহ নামাজ পরিচালনা',
  'মহল্লার দ্বীনি পরিবেশ উন্নয়নে সহায়তা',
];

export const MosqueVacancyFormModal: React.FC<MosqueVacancyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [mosqueName, setMosqueName] = useState('');
  const [area, setArea] = useState('');
  const [district, setDistrict] = useState('কাছাড়, আসাম');
  const [position, setPosition] = useState('পেশ ইমাম ও খতীব');
  const [requiredQualification, setRequiredQualification] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('১-২ বছরের অভিজ্ঞতা');
  const [offeredSalary, setOfferedSalary] = useState('15000');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'মসজিদ সংলগ্ন সুসজ্জিত একক কামরা',
    'কমিটি কর্তৃক তিন বেলা খাবার সুব্যবস্থা',
    'ফ্রি বিদ্যুৎ ও পানির ব্যবস্থা',
    'ঈদুল ফিতর ও ঈদুল আজহায় আকর্ষণীয় বোনাস',
  ]);
  const [selectedResponsibilities, setSelectedResponsibilities] = useState<string[]>([
    '৫ ওয়াক্ত ফরজ নামাজের ইমামতি',
    'শুক্রবার জুমআর নামাজে বিষয়ভিত্তিক বয়ান ও খুতবা পাঠ',
    'সকালে নূরানী মক্তবে শিশুদের সহীহ কুরআন শিক্ষা দান',
  ]);
  const [joiningDeadline, setJoiningDeadline] = useState('অবিলম্বে');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const toggleResponsibility = (resp: string) => {
    setSelectedResponsibilities((prev) =>
      prev.includes(resp) ? prev.filter((r) => r !== resp) : [...prev, resp]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mosqueName.trim()) {
      setErrorMsg('অনুগ্রহ করে মসজিদের নাম লিখুন।');
      return;
    }
    if (!area.trim()) {
      setErrorMsg('মসজিদের এলাকা বা গ্রামের নাম লিখুন।');
      return;
    }
    if (!contactPhone.trim() && !whatsappNumber.trim()) {
      setErrorMsg('কমিটির দায়িত্বশীল ব্যক্তির অন্তত একটি মোবাইল বা হোয়াটসঅ্যাপ নম্বর দিন।');
      return;
    }

    const phoneFinal = contactPhone.trim() || whatsappNumber.trim();
    const waFinal = whatsappNumber.trim() || phoneFinal;

    const newVacancy: MosqueVacancy = {
      id: 'mosque-' + Date.now(),
      mosqueName: mosqueName.trim(),
      area: area.trim(),
      district: district.trim(),
      position: position.trim() || 'পেশ ইমাম ও খতীব',
      requiredQualification: requiredQualification.trim() || 'দাওরায়ে হাদীস / হাফেজে কুরআন',
      experienceRequired: experienceRequired.trim() || 'অভিজ্ঞ আলেম অগ্রাধিকার',
      offeredSalary: parseInt(offeredSalary, 10) || 15000,
      facilitiesOffered: selectedFacilities,
      responsibilities: selectedResponsibilities,
      joiningDeadline: joiningDeadline.trim() || 'অবিলম্বে',
      contactPerson: contactPerson.trim() || 'মসজিদ পরিচালনা কমিটি',
      contactPhone: phoneFinal,
      whatsappNumber: waFinal,
      description: description.trim(),
      createdAt: Date.now(),
      isCustomSubmission: true,
    };

    onSave(newVacancy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                মসজিদ কমিটির নিয়োগ বিজ্ঞপ্তি দিন
              </h3>
              <p className="text-xs text-emerald-300/80">
                যোগ্য ও সুন্নতের পাবন্দ ইমাম, খতীব বা মুয়াজ্জিন খোঁজার জন্য বায়োডাটা
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Mosque Information */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <Building2 className="w-4 h-4" />
              <span>১. মসজিদের পরিচিতি ও অবস্থান</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  মসজিদের নাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: বায়তুস সালাম জামে মসজিদ"
                  value={mosqueName}
                  onChange={(e) => setMosqueName(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">
                  গ্রাম / পাড়া / এলাকা <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: তারাপুর শিববাড়ি রোড / সোনাই বাজার"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">জেলা ও রাজ্য</label>
                <input
                  type="text"
                  placeholder="উদা: কাছাড়, আসাম / করিমগঞ্জ / হাইলাকান্দি"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">কোন পদের জন্য লোক দরকার?</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                >
                  <option value="পেশ ইমাম ও খতীব">পেশ ইমাম ও খতীব</option>
                  <option value="পেশ ইমাম ও মক্তব শিক্ষক">পেশ ইমাম ও মক্তব শিক্ষক</option>
                  <option value="হিফজ শিক্ষক ও ইমাম">হিফজ শিক্ষক ও ইমাম</option>
                  <option value="সহকারী ইমাম ও মুয়াজ্জিন">সহকারী ইমাম ও মুয়াজ্জিন</option>
                  <option value="শুধুমাত্র মুয়াজ্জিন ও খাদেম">শুধুমাত্র মুয়াজ্জিন ও খাদেম</option>
                </select>
              </div>
            </div>
          </div>

          {/* Requirements & Salary */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <Briefcase className="w-4 h-4" />
              <span>২. শিক্ষাগত যোগ্যতা, অভিজ্ঞতা ও হাদিয়া</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">প্রয়োজনীয় শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  placeholder="উদা: দাওরায়ে হাদীস পাশ ও সুন্দর ক্বিরাত"
                  value={requiredQualification}
                  onChange={(e) => setRequiredQualification(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">প্রয়োজনীয় অভিজ্ঞতা</label>
                <input
                  type="text"
                  placeholder="উদা: কমপক্ষে ১-২ বছর / নতুন হলেও চলবে"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">
                  মাসিক হাদিয়া / বেতন (টাকায়) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={4000}
                    step={500}
                    placeholder="15000"
                    value={offeredSalary}
                    onChange={(e) => setOfferedSalary(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">যোগদানের সময়সীমা</label>
                <input
                  type="text"
                  placeholder="উদা: অবিলম্বে / আগামী মাসের ১ তারিখ"
                  value={joiningDeadline}
                  onChange={(e) => setJoiningDeadline(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>
          </div>

          {/* Responsibilities & Facilities Offered */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>৩. প্রদত্ত সুবিধা ও দায়িত্বসমূহ</span>
            </div>

            <div>
              <label className="text-emerald-200 block mb-1.5 font-medium">কমিটি কর্তৃক প্রদত্ত সুবিধাসমূহ:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_FACILITIES_OFFERED.map((fac) => (
                  <label
                    key={fac}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#03221F] text-emerald-100 hover:bg-emerald-900/40 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(fac)}
                      onChange={() => toggleFacility(fac)}
                      className="accent-[#E2A336]"
                    />
                    <span>{fac}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-emerald-200 block mb-1.5 font-medium">ইমাম সাহেবের প্রধান দায়িত্বসমূহ:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_RESPONSIBILITIES.map((resp) => (
                  <label
                    key={resp}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#03221F] text-emerald-100 hover:bg-emerald-900/40 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedResponsibilities.includes(resp)}
                      onChange={() => toggleResponsibility(resp)}
                      className="accent-[#E2A336]"
                    />
                    <span>{resp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <Phone className="w-4 h-4" />
              <span>৪. মসজিদ কমিটির যোগাযোগ</span>
            </div>

            <div>
              <label className="text-emerald-200 block mb-1">
                দায়িত্বশীল ব্যক্তির নাম ও পদবী
              </label>
              <input
                type="text"
                placeholder="উদা: আলহাজ্ব রফিক আহমেদ (সভাপতি / সাধারণ সম্পাদক)"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  মোবাইল নম্বর (কল) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+919435000000"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">
                  হোয়াটসঅ্যাপ নম্বর (WhatsApp) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+919435000000"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>

            <div>
              <label className="text-emerald-200 block mb-1">
                বিজ্ঞপ্তির বিস্তারিত বিবরণ বা বিশেষ শর্ত
              </label>
              <textarea
                rows={3}
                placeholder="ইন্টারভিউ এর নিয়ম, সাক্ষাৎ করার সময় ইত্যাদি বিস্তারিত লিখুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336] resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-semibold transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>নিয়োগ বিজ্ঞপ্তি প্রকাশ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
