import React, { useState } from 'react';
import { X, HeartHandshake, CheckCircle2, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { MatrimonyBiodata, AppLanguage } from '../types';

interface MatrimonyBiodataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (biodata: MatrimonyBiodata) => void;
  lang?: AppLanguage;
}

export const MatrimonyBiodataFormModal: React.FC<MatrimonyBiodataFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang = 'bn',
}) => {
  const [type, setType] = useState<'groom' | 'bride'>('groom');
  const [fullName, setFullName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [height, setHeight] = useState("5' 6\"");
  const [complexion, setComplexion] = useState('উজ্জ্বল শ্যামলা');
  const [maritalStatus, setMaritalStatus] = useState<'অবিবাহিত' | 'ডিভোর্সড' | 'বিধবা' | 'বিপত্নীক'>('অবিবাহিত');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [district, setDistrict] = useState('কাছাড়');
  const [area, setArea] = useState('');
  const [familyType, setFamilyType] = useState('দ্বীনদার সম্ভ্রান্ত সুন্নি পরিবার');
  const [partnerExpectations, setPartnerExpectations] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('পিতা');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bioNotes, setBioNotes] = useState('');

  // Selected religious practices
  const [selectedPractices, setSelectedPractices] = useState<string[]>([
    '৫ ওয়াক্ত নামাজি',
    'হালাল উপার্জনে যত্নশীল',
  ]);

  const practiceOptions = [
    '৫ ওয়াক্ত নামাজি',
    'সুন্নতি দাড়ি',
    'সম্পূর্ণ পর্দনশীন (নিকাব/বোরকা)',
    'সহীহ কুরআন তিলাওয়াত',
    'হালাল উপার্জনে যত্নশীল',
    'ধূমপান ও নেশামুক্ত',
    'দ্বীনি মাহফিল ও সুন্নতের অনুসারী',
    'তাহাজ্জুদ ও নফল রোজা পালনকারী',
  ];

  const togglePractice = (item: string) => {
    if (selectedPractices.includes(item)) {
      setSelectedPractices(selectedPractices.filter((p) => p !== item));
    } else {
      setSelectedPractices([...selectedPractices, item]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !guardianPhone.trim() || !education.trim()) {
      alert('দয়া করে নাম, শিক্ষাগত যোগ্যতা এবং অভিভাবকের ফোন নম্বর সঠিকভাবে দিন।');
      return;
    }

    const generatedCode = codeName.trim()
      ? codeName.trim()
      : type === 'groom'
      ? `পাত্র-${Math.floor(100 + Math.random() * 900)} (${profession || 'চাকরিজীবী'})`
      : `পাত্রী-${Math.floor(200 + Math.random() * 900)} (${profession || 'শিক্ষিতা'})`;

    const newBiodata: MatrimonyBiodata = {
      id: `mat-${Date.now()}`,
      type,
      fullName: fullName.trim(),
      codeName: generatedCode,
      age: Number(age) || 25,
      height: height.trim() || "5' 6\"",
      complexion: complexion.trim() || 'উজ্জ্বল শ্যামলা',
      maritalStatus,
      education: education.trim(),
      profession: profession.trim() || 'সাধারণ',
      monthlyIncome: monthlyIncome.trim() || 'আলোচনা সাপেক্ষে',
      religiousPractices: selectedPractices,
      fatherOccupation: fatherOccupation.trim() || 'ব্যবসায়ী/চাকরিজীবী',
      district: district.trim(),
      area: area.trim() || 'শিলচর/কাছাড়',
      familyType: familyType.trim() || 'দ্বীনদার পরিবার',
      partnerExpectations:
        partnerExpectations.trim() || '৫ ওয়াক্ত নামাজি ও ভদ্র অমায়িক দ্বীনদার জীবনসঙ্গী কাম্য।',
      guardianRelation: guardianRelation.trim() || 'পিতা',
      guardianPhone: guardianPhone.trim(),
      whatsappNumber: (whatsappNumber || guardianPhone).trim(),
      bioNotes: bioNotes.trim() || 'পরিবারসহ দ্বীনি অনুশাসন মেনে চলার চেষ্টা করি।',
      createdAt: Date.now(),
      isVerified: true,
      isCustomSubmission: true,
    };

    onSave(newBiodata);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#03221F] border border-emerald-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#09332E] border-b border-emerald-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                দ্বীনি পাত্র/পাত্রীর বায়োডাটা জমা দিন
              </h3>
              <p className="text-[11px] text-emerald-300/80">
                শরীয়াহসম্মত সুন্নতি বিবাহের জন্য আপনার বা আপনার সন্তানের তথ্য
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. Type Selector (Groom vs Bride) */}
          <div className="p-3 bg-[#072a25] border border-emerald-800/60 rounded-xl space-y-2">
            <label className="font-bold text-white block text-sm">কার জন্য বায়োডাটা দিতে চান? *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('groom')}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'groom'
                    ? 'bg-[#E2A336] text-[#03221F] shadow-md ring-2 ring-[#E2A336]/50'
                    : 'bg-[#03221F] text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/40'
                }`}
              >
                <User className="w-4 h-4" />
                <span>🤵 পাত্রের (বরের) বায়োডাটা</span>
              </button>

              <button
                type="button"
                onClick={() => setType('bride')}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'bride'
                    ? 'bg-[#E2A336] text-[#03221F] shadow-md ring-2 ring-[#E2A336]/50'
                    : 'bg-[#03221F] text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/40'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>👰 পাত্রীর (কনের) বায়োডাটা</span>
              </button>
            </div>
          </div>

          {/* 2. Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                {type === 'groom' ? 'পাত্রের সম্পূর্ণ নাম *' : 'পাত্রীর সম্পূর্ণ নাম *'}
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: মোহাম্মদ তানভীর লস্কর"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                শিরোনাম / পদবী (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার / আলেমা ও শিক্ষিকা"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">বয়স (বছর) *</label>
              <input
                type="number"
                min="18"
                max="70"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">উচ্চতা</label>
              <input
                type="text"
                placeholder="যেমন: 5' 8&quot; বা 5' 3&quot;"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">গায়ের রঙ</label>
              <select
                value={complexion}
                onChange={(e) => setComplexion(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#E2A336]"
              >
                <option value="ফর্সা">ফর্সা</option>
                <option value="উজ্জ্বল ফর্সা">উজ্জ্বল ফর্সা</option>
                <option value="উজ্জ্বল শ্যামলা">উজ্জ্বল শ্যামলা</option>
                <option value="শ্যামলা">শ্যামলা</option>
                <option value="গৌরবর্ণ">গৌরবর্ণ</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">বৈবাহিক অবস্থা</label>
              <select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as any)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#E2A336]"
              >
                <option value="অবিবাহিত">অবিবাহিত</option>
                <option value="ডিভোর্সড">ডিভোর্সড</option>
                <option value="বিধবা">বিধবা</option>
                <option value="বিপত্নীক">বিপত্নীক</option>
              </select>
            </div>
          </div>

          {/* 3. Education & Profession */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                শিক্ষাগত যোগ্যতা *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: বি.টেক / এম.এ / দাওরায়ে হাদীস (টাইটেল)"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                পেশা / কর্মক্ষেত্র *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: সরকারি শিক্ষক / সফটওয়্যার ইঞ্জিনিয়ার / গৃহিণী"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                মাসিক আয় (টাকায়)
              </label>
              <input
                type="text"
                placeholder="যেমন: ₹৪৫,০০০ / মাস (ঐচ্ছিক)"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">
                পিতার পেশা
              </label>
              <input
                type="text"
                placeholder="যেমন: ব্যবসায়ী / অবসরপ্রাপ্ত শিক্ষক / কৃষক"
                value={fatherOccupation}
                onChange={(e) => setFatherOccupation(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>
          </div>

          {/* 4. Religious Practice Tags */}
          <div>
            <label className="font-medium text-emerald-200 block mb-1.5">
              দ্বীনি অভ্যাস ও বৈশিষ্ট্যসমূহ
            </label>
            <div className="flex flex-wrap gap-1.5">
              {practiceOptions.map((opt) => {
                const isSelected = selectedPractices.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => togglePractice(opt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E2A336] text-[#03221F]'
                        : 'bg-[#072a25] text-emerald-300 border border-emerald-800/60 hover:bg-emerald-900/30'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-medium text-emerald-200 block mb-1">জেলা *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#E2A336]"
              >
                <option value="কাছাড়">কাছাড় (Cachar)</option>
                <option value="করিমগঞ্জ">করিমগঞ্জ (Karimganj)</option>
                <option value="হাইলাকান্দি">হাইলাকান্দি (Hailakandi)</option>
                <option value="আসামের অন্যান্য জেলা">আসামের অন্যান্য জেলা</option>
                <option value="অন্যান্য রাজ্য">অন্যান্য রাজ্য</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-emerald-200 block mb-1">গ্রাম / এলাকা *</label>
              <input
                type="text"
                required
                placeholder="যেমন: তারাপুর, শিলচর / সোনাই / বদরপুর"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
              />
            </div>
          </div>

          {/* 6. Partner Expectations */}
          <div>
            <label className="font-medium text-emerald-200 block mb-1">
              প্রত্যাশিত জীবনসঙ্গীর বিবরণ ও প্রত্যাশা
            </label>
            <textarea
              rows={2}
              placeholder="যেমন: ৫ ওয়াক্ত নামাজি, বদভ্যাসমুক্ত, শিষ্টাচারী এবং দ্বীনদার পরিবারের জীবনসঙ্গী কাম্য..."
              value={partnerExpectations}
              onChange={(e) => setPartnerExpectations(e.target.value)}
              className="w-full bg-[#072a25] border border-emerald-700/60 rounded-xl px-3 py-2 text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-[#E2A336]"
            />
          </div>

          {/* 7. Guardian Contact Info */}
          <div className="p-3 bg-[#072a25] border border-emerald-800/60 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E2A336]">
              <ShieldCheck className="w-4 h-4" />
              <span>অভিভাবকের সাথে যোগাযোগের তথ্য (শরীয়াহ রক্ষা করতে)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="font-medium text-emerald-200 block mb-1">সম্পর্ক</label>
                <select
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-2.5 py-1.5 text-white"
                >
                  <option value="পিতা">পিতা</option>
                  <option value="মাতা">মাতা</option>
                  <option value="বড় ভাই">বড় ভাই</option>
                  <option value="মামা/চাচা">মামা/চাচা</option>
                  <option value="অভিভাবক">অন্যান্য অভিভাবক</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-emerald-200 block mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91..."
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="font-medium text-emerald-200 block mb-1">হোয়াটসঅ্যাপ নম্বর</label>
                <input
                  type="tel"
                  placeholder="+91..."
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-[#03221F] border border-emerald-700/60 rounded-xl px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E2A336] hover:bg-[#c98e2a] text-[#03221F] font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>বায়োডাটা সংরক্ষণ করুন ও প্রকাশ করুন (+২০ কয়েন)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
