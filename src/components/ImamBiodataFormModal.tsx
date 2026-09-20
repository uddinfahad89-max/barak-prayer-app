import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, GraduationCap, MapPin, Phone, MessageCircle, Briefcase, IndianRupee, HeartHandshake } from 'lucide-react';
import { ImamBiodata, AppLanguage } from '../types';

interface ImamBiodataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (biodata: ImamBiodata) => void;
  lang?: AppLanguage;
  initialData?: ImamBiodata | null;
}

const COMMON_SKILLS = [
  '৫ ওয়াক্ত ফরজ নামাজের সহীহ ইমামতি',
  'জুমআর আকর্ষণীয় খুতবা ও বয়ান',
  'শিশুদের নূরানী কায়দা ও নাজেরা পাঠদান',
  'সহীহ ক্বিরাত ও তাজবীদ শিক্ষা',
  'দৈনন্দিন প্রয়োজনীয় মাসআলা-মাসায়েল সমাধান',
  'রমজানে খতম তারাবীহ পড়ানো',
  'যুবকদের দ্বীনি তালিম ও দাওয়াত',
];

const COMMON_FACILITIES = [
  'পৃথক থাকার ঘর (একক কামরা)',
  'খাবার সুব্যবস্থা',
  'বিদ্যুৎ ও পানির সুবিধা',
  'ওয়াইফাই ইন্টারনেট',
  'পরিবার নিয়ে থাকার সুব্যবস্থা',
];

export const ImamBiodataFormModal: React.FC<ImamBiodataFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang = 'bn',
  initialData = null,
}) => {
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('হাফেজ ও মাওলানা');
  const [age, setAge] = useState<string>('28');
  const [maritalStatus, setMaritalStatus] = useState<'বিবাহিত' | 'অবিবাহিত'>('বিবাহিত');
  const [qualification, setQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState<string>('3');
  const [currentLocation, setCurrentLocation] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState<string>('12000');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    '৫ ওয়াক্ত ফরজ নামাজের সহীহ ইমামতি',
    'জুমআর আকর্ষণীয় খুতবা ও বয়ান',
    'শিশুদের নূরানী কায়দা ও নাজেরা পাঠদান',
  ]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'পৃথক থাকার ঘর (একক কামরা)',
    'খাবার সুব্যবস্থা',
  ]);
  const [contactPhone, setContactPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bioNotes, setBioNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || '');
      setTitle(initialData.title || 'হাফেজ ও মাওলানা');
      setAge(String(initialData.age || 28));
      setMaritalStatus(initialData.maritalStatus || 'বিবাহিত');
      setQualification(initialData.qualification || '');
      setInstitution(initialData.institution || 'কওমী / আলিয়া মাদ্রাসা');
      setExperienceYears(String(initialData.experienceYears || 0));
      setCurrentLocation(initialData.currentLocation || '');
      setPreferredLocation(initialData.preferredLocation || '');
      setExpectedSalary(String(initialData.expectedSalary || 12000));
      setSelectedSkills(initialData.skills || ['৫ ওয়াক্ত ফরজ নামাজের সহীহ ইমামতি']);
      setSelectedFacilities(initialData.facilitiesDemanded || ['পৃথক থাকার ঘর (একক কামরা)', 'খাবার সুব্যবস্থা']);
      setContactPhone(initialData.contactPhone || '');
      setWhatsappNumber(initialData.whatsappNumber || '');
      setBioNotes(initialData.bioNotes || '');
      setErrorMsg('');
    } else if (isOpen) {
      setFullName('');
      setTitle('হাফেজ ও মাওলানা');
      setAge('28');
      setMaritalStatus('বিবাহিত');
      setQualification('');
      setInstitution('');
      setExperienceYears('3');
      setCurrentLocation('');
      setPreferredLocation('');
      setExpectedSalary('12000');
      setSelectedSkills([
        '৫ ওয়াক্ত ফরজ নামাজের সহীহ ইমামতি',
        'জুমআর আকর্ষণীয় খুতবা ও বয়ান',
        'শিশুদের নূরানী কায়দা ও নাজেরা পাঠদান',
      ]);
      setSelectedFacilities([
        'পৃথক থাকার ঘর (একক কামরা)',
        'খাবার সুব্যবস্থা',
      ]);
      setContactPhone('');
      setWhatsappNumber('');
      setBioNotes('');
      setErrorMsg('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleFacility = (fac: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!qualification.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার শিক্ষাগত যোগ্যতা (যেমন: দাওরায়ে হাদীস) উল্লেখ করুন।');
      return;
    }
    if (!currentLocation.trim()) {
      setErrorMsg('আপনার বর্তমান জেলা বা ঠিকানা উল্লেখ করুন।');
      return;
    }
    if (!contactPhone.trim() && !whatsappNumber.trim()) {
      setErrorMsg('অন্তত একটি যোগাযোগ বা হোয়াটসঅ্যাপ নম্বর দিন।');
      return;
    }

    const phoneFinal = contactPhone.trim() || whatsappNumber.trim();
    const waFinal = whatsappNumber.trim() || phoneFinal;

    const savedBiodata: ImamBiodata = {
      id: initialData?.id || 'imam-' + Date.now(),
      fullName: fullName.trim(),
      title: title.trim() || 'হাফেজ ও মাওলানা',
      age: parseInt(age, 10) || 28,
      maritalStatus,
      qualification: qualification.trim(),
      institution: institution.trim() || 'কওমী / আলিয়া মাদ্রাসা',
      experienceYears: parseInt(experienceYears, 10) || 0,
      currentLocation: currentLocation.trim(),
      preferredLocation: preferredLocation.trim() || 'যেকোনো উপযুক্ত মসজিদ',
      expectedSalary: parseInt(expectedSalary, 10) || 12000,
      skills: selectedSkills.length > 0 ? selectedSkills : ['৫ ওয়াক্ত ফরজ নামাজের সহীহ ইমামতি'],
      facilitiesDemanded: selectedFacilities,
      contactPhone: phoneFinal,
      whatsappNumber: waFinal,
      bioNotes: bioNotes.trim(),
      createdAt: initialData?.createdAt || Date.now(),
      isVerified: true,
      isCustomSubmission: true,
    };

    onSave(savedBiodata);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialData
                  ? (lang === 'en' ? 'Edit Imam Biodata' : lang === 'ur' ? 'امام بائیوڈیٹا ترمیم کریں' : 'ইমাম সাহেবের বায়োডাটা সম্পাদনা করুন')
                  : (lang === 'en' ? 'Add Imam Biodata' : lang === 'ur' ? 'امام بائیوڈیٹا شامل کریں' : 'ইমাম সাহেবের বায়োডাটা যোগ করুন')}
              </h3>
              <p className="text-xs text-emerald-300/80">
                {initialData
                  ? (lang === 'en' ? 'Update your qualifications, skills and demands' : 'আপনার শিক্ষাগত যোগ্যতা ও অভিজ্ঞতার তথ্য আপডেট করুন')
                  : (lang === 'en' ? 'Let mosque committees directly reach you for appointment' : 'মসজিদ কমিটি যেন আপনার সাথে সরাসরি যোগাযোগ করে নিয়োগ দিতে পারে')}
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

          {/* Personal Info */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <User className="w-4 h-4" />
              <span>১. ব্যক্তিগত পরিচয়</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  পুরো নাম <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: মাওলানা হাফেজ আব্দুর রহমান"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">উপাধি / পদবী</label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                >
                  <option value="হাফেজ ও মাওলানা">হাফেজ ও মাওলানা</option>
                  <option value="দাওরায়ে হাদীস (মাওলানা)">দাওরায়ে হাদীস (মাওলানা)</option>
                  <option value="মুফতী সাহেব">মুফতী সাহেব</option>
                  <option value="হাফেজে কুরআন">হাফেজে কুরআন</option>
                  <option value="ক্বারী সাহেব">ক্বারী সাহেব</option>
                  <option value="মুয়াজ্জিন ও খাদেম">মুয়াজ্জিন ও খাদেম</option>
                </select>
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">বয়স</label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">বৈবাহিক অবস্থা</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1.5 text-emerald-200 cursor-pointer">
                    <input
                      type="radio"
                      name="marital"
                      checked={maritalStatus === 'বিবাহিত'}
                      onChange={() => setMaritalStatus('বিবাহিত')}
                      className="accent-[#E2A336]"
                    />
                    <span>বিবাহিত</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-emerald-200 cursor-pointer">
                    <input
                      type="radio"
                      name="marital"
                      checked={maritalStatus === 'অবিবাহিত'}
                      onChange={() => setMaritalStatus('অবিবাহিত')}
                      className="accent-[#E2A336]"
                    />
                    <span>অবিবাহিত</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Qualification & Experience */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>২. শিক্ষাগত যোগ্যতা ও অভিজ্ঞতা</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  ডিগ্রী / শিক্ষাগত যোগ্যতা <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: দাওরায়ে হাদীস ও হিফজ সমাপন"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">পড়াশোনার মাদ্রাসা / জামিয়া</label>
                <input
                  type="text"
                  placeholder="উদা: দারুল উলুম বাঁশকান্দি / দেওবন্দ"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">ইমামতি / শিক্ষকতার অভিজ্ঞতা (বছর)</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  placeholder="উদা: ৫ বছর (নতুন হলে ০ দিন)"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">
                  প্রত্যাশিত মাসিক হাদিয়া (টাকায়)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₹</span>
                  <input
                    type="number"
                    min={3000}
                    step={500}
                    placeholder="12000"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-[#E2A336]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Preferences */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <MapPin className="w-4 h-4" />
              <span>৩. ঠিকানা ও পছন্দের এলাকা</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  বর্তমান অবস্থান / নিজ জেলা <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="উদা: সোনাই, কাছাড় / করিমগঞ্জ"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1">
                  কোথায় দায়িত্ব পালনে ইচ্ছুক?
                </label>
                <input
                  type="text"
                  placeholder="উদা: শিলচর / বরাক উপত্যকা / আসাম"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>
          </div>

          {/* Skills & Facilities */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <Briefcase className="w-4 h-4" />
              <span>৪. বিশেষ দক্ষতা ও সুবিধা</span>
            </div>

            <div>
              <label className="text-emerald-200 block mb-1.5 font-medium">যেসব দায়িত্ব পালনে দক্ষ:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_SKILLS.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#03221F] text-emerald-100 hover:bg-emerald-900/40 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="accent-[#E2A336]"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-emerald-200 block mb-1.5 font-medium">মসজিদ থেকে কাঙ্ক্ষিত সুবিধা:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COMMON_FACILITIES.map((fac) => (
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
          </div>

          {/* Contact Details */}
          <div className="bg-[#09332E]/60 border border-emerald-800/50 rounded-xl p-3.5 space-y-3">
            <div className="font-bold text-[#E2A336] flex items-center gap-1.5 text-xs sm:text-sm">
              <Phone className="w-4 h-4" />
              <span>৫. সরাসরি যোগাযোগের নম্বর</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-emerald-200 block mb-1">
                  মোবাইল নম্বর (কল) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+919864000000"
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
                  placeholder="+919864000000"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#E2A336]"
                />
              </div>
            </div>

            <div>
              <label className="text-emerald-200 block mb-1">
                সংক্ষিপ্ত পরিচিতি বা বিশেষ বার্তা
              </label>
              <textarea
                rows={3}
                placeholder="আপনার আগের খেদমত, সুন্নতের পাবন্দী ও চরিত্র সম্পর্কে সংক্ষেপে কিছু লিখুন..."
                value={bioNotes}
                onChange={(e) => setBioNotes(e.target.value)}
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
              {lang === 'en' ? 'Cancel' : lang === 'ur' ? 'منسوخ' : 'বাতিল'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {initialData
                  ? (lang === 'en' ? 'Update Biodata' : lang === 'ur' ? 'بائیوڈیٹا اپ ڈیٹ کریں' : 'বায়োডাটা আপডেট করুন')
                  : (lang === 'en' ? 'Publish Biodata' : lang === 'ur' ? 'بائیوڈیٹا شائع کریں' : 'বায়োডাটা প্রকাশ করুন')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
