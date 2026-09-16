import React, { useState } from 'react';
import { X, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { AppLanguage } from '../types';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

interface InspirationItem {
  type: { en: string; ur: string; bn: string };
  arabic: string;
  translation: { en: string; ur: string; bn: string };
  reference: { en: string; ur: string; bn: string };
  reflection: { en: string; ur: string; bn: string };
}

const INSPIRATIONS: InspirationItem[] = [
  {
    type: { en: 'Al-Quran', ur: 'قرآن مجید', bn: 'আল-কুরআন' },
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: {
      en: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
      ur: 'پس تم مجھے یاد رکھو، میں تمہیں یاد رکھوں گا، اور میرا شکر ادا کرو اور ناشکری نہ کرو۔',
      bn: 'অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর তোমরা আমার প্রতি কৃতজ্ঞ হও এবং অকৃতজ্ঞ হয়ো না।',
    },
    reference: {
      en: 'Surah Al-Baqarah, 2:152',
      ur: 'سورۃ البقرہ، آیت 152',
      bn: 'সূরা আল-বাক্বারা, আয়াত: ১৫২',
    },
    reflection: {
      en: 'Whenever your tongue is moist with the remembrance of Allah, His divine mercy and closeness envelops your heart.',
      ur: 'جب بھی زبان ذکر الٰہی سے تر رہتی ہے، اللہ تعالیٰ کی رحمت اور قرب دل کو سکون بخشتا ہے۔',
      bn: 'সর্বদা আল্লাহর জিকিরে জিহ্বা সিক্ত রাখলে বান্দা আল্লাহর রহমত ও বিশেষ সান্নিধ্য লাভ করে।',
    },
  },
  {
    type: { en: 'Sahih Hadith', ur: 'حدیث نبوی', bn: 'সহিহ হাদিস' },
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: {
      en: 'Whoever travels a path in search of sacred knowledge, Allah will make easy for him a path to Paradise.',
      ur: 'جو شخص علم کی تلاش میں کسی راستے پر چلتا ہے، اللہ تعالیٰ اس کے لیے جنت کا راستہ آسان فرما دیتا ہے۔',
      bn: 'যে ব্যক্তি দ্বীনি ইলম বা জ্ঞান অন্বেষণের পথে বের হয়, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।',
    },
    reference: {
      en: 'Sahih Muslim: 2699',
      ur: 'صحیح مسلم: 2699',
      bn: 'সহিহ মুসলিম: ২৬৯৯',
    },
    reflection: {
      en: 'Learning even one beneficial verse or prophetic guidance each day illuminates your eternal path to Jannah.',
      ur: 'روزانہ دین و حکمت کی ایک بات سیکھنا بھی اخروی نجات اور جنت کی کنجی بن سکتا ہے۔',
      bn: 'প্রতিদিন কুরআন ও সুন্নাহর ন্যূনতম একটি বিষয় শেখাও জান্নাতের অমূল্য পথ সুগম করে।',
    },
  },
  {
    type: { en: 'Al-Quran', ur: 'قرآن مجید', bn: 'আল-কুরআন' },
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: {
      en: 'Unquestionably, by the remembrance of Allah hearts find peace.',
      ur: 'یاد رکھو! اللہ کے ذکر سے ہی دلوں کو اطمینان اور سکون ملتا ہے۔',
      bn: 'জেনে রেখো! আল্লাহর স্মরণেই কেবল হৃদয়সমূহ প্রশান্তি লাভ করে।',
    },
    reference: {
      en: 'Surah Ar-Ra’d, 13:28',
      ur: 'سورۃ الرعد، آیت 28',
      bn: 'সূরা আর-রাদ, আয়াত: ২৮',
    },
    reflection: {
      en: 'In times of worry and grief, direct your full heart to Allah, and deep tranquility will replace anxiety.',
      ur: 'زندگی کی ہر بے چینی اور پریشانی کا واحد روحانی علاج اخلاص کے ساتھ ذکرِ الٰہی ہے۔',
      bn: 'দুনিয়ার সকল অস্থিরতা ও পেরেশানির একমাত্র মহাঔষধ হলো অন্তরের গভীর থেকে আল্লাহকে স্মরণ করা।',
    },
  },
  {
    type: { en: 'Sahih Hadith', ur: 'حدیث نبوی', bn: 'সহিহ হাদিস' },
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: {
      en: 'The best among you are those who learn the Quran and teach it to others.',
      ur: 'تم میں سے سب سے بہترین شخص وہ ہے جو قرآن سیکھے اور دوسروں کو سکھائے۔',
      bn: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে নিজে কুরআন শিখে এবং অপরকে শিক্ষা দেয়।',
    },
    reference: {
      en: 'Sahih al-Bukhari: 5027',
      ur: 'صحیح بخاری: 5027',
      bn: 'সহিহ বুখারি: ৫০২৭',
    },
    reflection: {
      en: 'Reciting, understanding, and passing on the light of the Quran is the highest honor for a believer.',
      ur: 'قرآن کریم کی تلاوت، فہم اور اس کا ابلاغ مؤمن کی زندگی کا عظیم ترین اعزاز ہے۔',
      bn: 'কুরআন শেখা ও শেখানোর চেয়ে উত্তম ও মর্যাদাপূর্ণ আমল মুমিনের জীবনে আর কিছু হতে পারে না।',
    },
  },
];

export const InspirationModal: React.FC<InspirationModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [index, setIndex] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  if (!isOpen) return null;

  const current = INSPIRATIONS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % INSPIRATIONS.length);
    setLiked(false);
  };

  const modalTitle = lang === 'ur' ? 'روزانہ کی ہدایت و حکمت' : lang === 'bn' ? 'দৈনিক অনুপ্রেরণা ও হেদায়েত' : 'Daily Quran & Hadith Inspiration';
  const nextText = lang === 'ur' ? 'اگلی حکمت' : lang === 'bn' ? 'পরবর্তী বাণী' : 'Next Inspiration';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${lang === 'ur' ? 'left-4' : 'right-4'} p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#E2A336]" />
          <h2 className="text-lg font-bold text-white">{modalTitle}</h2>
        </div>

        {/* Card */}
        <div className="bg-[#03221F] border border-white/10 rounded-2xl p-5 mb-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#E2A336] bg-[#E2A336]/10 px-2.5 py-0.5 rounded-full">
              {current.type[lang] || current.type.en}
            </span>
            <span className="text-[11px] text-[#90A8A3]">
              {index + 1} / {INSPIRATIONS.length}
            </span>
          </div>

          {/* Arabic */}
          <div
            dir="rtl"
            className="text-center font-serif text-xl sm:text-2xl text-[#E2A336] leading-relaxed my-4"
          >
            {current.arabic}
          </div>

          {/* Translation */}
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed mb-3 font-medium">
            "{current.translation[lang] || current.translation.en}"
          </p>

          {/* Reference */}
          <div className="text-[11px] text-[#E2A336]/90 font-semibold mb-3">
            — {current.reference[lang] || current.reference.en}
          </div>

          {/* Reflection */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-[#90A8A3] leading-relaxed">
            <span className="text-white font-semibold block mb-0.5">
              {lang === 'ur' ? 'سبق و حکمت:' : lang === 'bn' ? 'শিক্ষা ও আমল:' : 'Lesson & Reflection:'}
            </span>
            {current.reflection[lang] || current.reflection.en}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-white/5 text-[#90A8A3] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
            <span>{liked ? (lang === 'ur' ? 'محفوظ شدہ' : lang === 'bn' ? 'পছন্দ করা হয়েছে' : 'Saved') : (lang === 'ur' ? 'پسند کریں' : lang === 'bn' ? 'পছন্দ' : 'Favorite')}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#E2A336] text-[#03221F] font-bold px-4 py-2 rounded-xl text-xs hover:bg-amber-400 transition-all shadow-md active:scale-95"
          >
            <span>{nextText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
