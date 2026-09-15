import React, { useState } from 'react';
import { BookOpen, Play, Pause, Volume2, Search, Check, Copy } from 'lucide-react';

interface SurahData {
  number: number;
  nameAr: string;
  nameBn: string;
  meaningBn: string;
  versesCount: number;
  verses: {
    number: number;
    arabic: string;
    bengali: string;
    transliteration: string;
  }[];
}

const SURAH_COLLECTION: SurahData[] = [
  {
    number: 1,
    nameAr: 'الفاتحة',
    nameBn: 'সূরা আল-ফাতিহা',
    meaningBn: 'সূচনা',
    versesCount: 7,
    verses: [
      {
        number: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        bengali: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
        transliteration: 'বিসমিল্লাহির রাহমানির রাহিম',
      },
      {
        number: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        bengali: 'সকল প্রশংসা বিশ্বজগতের প্রতিপালক আল্লাহর জন্য।',
        transliteration: 'আলহামদু লিল্লাহি রাব্বিল আলামিন',
      },
      {
        number: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        bengali: 'যিনি পরম দয়ালু ও অতি দাতা।',
        transliteration: 'আর-রাহমানির রাহিম',
      },
      {
        number: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        bengali: 'যিনি বিচার দিবসের একমাত্র অধিপতি।',
        transliteration: 'মালিকি ইয়াওমিদ্দিন',
      },
      {
        number: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        bengali: 'আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য চাই।',
        transliteration: 'ইয়্যাকা না’বুদু ওয়া ইয়্যাকা নাসতাঈন',
      },
      {
        number: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        bengali: 'আমাদেরকে সরল-সঠিক পথ প্রদর্শন করুন।',
        transliteration: 'ইহদিনাস সিরাতাল মুস্তাকীম',
      },
      {
        number: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        bengali: 'সেসব মানুষের পথ, যাঁদের আপনি পুরস্কৃত করেছেন; তাঁদের পথ নয় যাঁদের ওপর আপনার ক্রোধ বর্ষিত হয়েছে, আর না পথভ্রষ্টদের পথ।',
        transliteration: 'সিরাতাল্লাজিনা আন’আমতা আলাইহিম, গাইরিল মাগদুবি আলাইহিম ওয়ালাদ-দোয়াল্লীন (আমিন)',
      },
    ],
  },
  {
    number: 112,
    nameAr: 'الإخلاص',
    nameBn: 'সূরা আল-ইখলাস',
    meaningBn: 'একনিষ্ঠতা',
    versesCount: 4,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        bengali: 'বলুন, তিনিই আল্লাহ, একক ও অদ্বিতীয়।',
        transliteration: 'ক্বুল হুয়াল্লাহু আহাদ',
      },
      {
        number: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        bengali: 'আল্লাহ অমুখাপেক্ষী (সকলের ভরসাস্থল)।',
        transliteration: 'আল্লাহুস সামাদ',
      },
      {
        number: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        bengali: 'তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।',
        transliteration: 'লাম ইয়ালিদ ওয়া লাম ইউলাদ',
      },
      {
        number: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        bengali: 'এবং তাঁর সমকক্ষ কেউই নেই।',
        transliteration: 'ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ',
      },
    ],
  },
  {
    number: 113,
    nameAr: 'الفلق',
    nameBn: 'সূরা আল-ফালাক্ব',
    meaningBn: 'নিশিভোর',
    versesCount: 5,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        bengali: 'বলুন, আমি আশ্রয় প্রার্থনা করছি প্রভাতের পালনকর্তার।',
        transliteration: 'ক্বুল আউজু বিরাব্বিল ফালাক্ব',
      },
      {
        number: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        bengali: 'তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে।',
        transliteration: 'মিন শাররি মা খালাক্ব',
      },
      {
        number: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        bengali: 'এবং অন্ধকার রাতের অনিষ্ট থেকে যখন তা গাঢ় হয়।',
        transliteration: 'ওয়া মিন শাররি গাসিক্বিন ইজা ওয়াক্বাব',
      },
      {
        number: 4,
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        bengali: 'এবং গ্রন্থিতে ফুঁক দিয়ে জাদুকারিণীদের অনিষ্ট থেকে।',
        transliteration: 'ওয়া মিন শাররিন নাফ্ফাসাতি ফিল উক্বাফ',
      },
      {
        number: 5,
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        bengali: 'এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।',
        transliteration: 'ওয়া মিন শাররি হাসিদিন ইজা হাসাদ',
      },
    ],
  },
  {
    number: 114,
    nameAr: 'الناس',
    nameBn: 'সূরা আন-নাস',
    meaningBn: 'মানবজাতি',
    versesCount: 6,
    verses: [
      {
        number: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        bengali: 'বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের।',
        transliteration: 'ক্বুল আউজু বিরাব্বিন নাস',
      },
      {
        number: 2,
        arabic: 'مَلِكِ النَّاسِ',
        bengali: 'মানুষের রাজাধিরাজের।',
        transliteration: 'মালিকিন নাস',
      },
      {
        number: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        bengali: 'মানুষের একমাত্র সত্য উপাস্যের।',
        transliteration: 'ইলাহিন নাস',
      },
      {
        number: 4,
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        bengali: 'কুমন্ত্রণাদাতা আত্মগোপনকারী শয়তানের অনিষ্ট থেকে।',
        transliteration: 'মিন শাররিল ওয়াসওয়াসিল খান্নাস',
      },
      {
        number: 5,
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        bengali: 'যে মানুষের অন্তরে কুমন্ত্রণা দেয়।',
        transliteration: 'আল্লাজি ইউওয়াসউইসু ফি সুদুরিন নাস',
      },
      {
        number: 6,
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        bengali: 'জিনদের মধ্য থেকে এবং মানুষদের মধ্য থেকেও।',
        transliteration: 'মিনাল জিন্নাতি ওয়ান নাস',
      },
    ],
  },
];

export const QuranView: React.FC = () => {
  const [selectedSurah, setSelectedSurah] = useState<SurahData>(SURAH_COLLECTION[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-[#09332E] border border-[#E2A336]/30 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">পবিত্র আল-কুরআন</h2>
            <p className="text-xs text-[#90A8A3]">আরবি তিলাওয়াত, বাংলা উচ্চারণ ও সরল অনুবাদ</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-serif text-[#E2A336] block" dir="rtl" lang="ar">
            {selectedSurah.nameAr}
          </span>
          <span className="text-xs text-[#90A8A3]">{selectedSurah.versesCount} টি আয়াত</span>
        </div>
      </div>

      {/* Surah Pills Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SURAH_COLLECTION.map((s) => (
          <button
            key={s.number}
            onClick={() => setSelectedSurah(s)}
            className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedSurah.number === s.number
                ? 'bg-[#E2A336] text-[#03221F] font-bold shadow-md'
                : 'bg-[#09332E] text-[#90A8A3] hover:text-white border border-white/5'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
              {s.number}
            </span>
            <span>{s.nameBn}</span>
          </button>
        ))}
      </div>

      {/* Verses List */}
      <div className="space-y-4">
        {selectedSurah.verses.map((verse) => (
          <div
            key={verse.number}
            className="bg-[#09332E] border border-white/5 hover:border-[#E2A336]/30 rounded-2xl p-5 transition-all"
          >
            {/* Top verse number bar */}
            <div className="flex items-center justify-between mb-3">
              <span className="w-7 h-7 rounded-lg bg-[#03221F] border border-[#E2A336]/30 text-[#E2A336] font-bold text-xs flex items-center justify-center">
                {verse.number}
              </span>

              <button
                onClick={() =>
                  handleCopy(
                    `${verse.arabic}\n\nউচ্চারণ: ${verse.transliteration}\n\nঅর্থ: ${verse.bengali}`,
                    verse.number
                  )
                }
                className="p-1.5 rounded-lg bg-[#03221F] text-[#90A8A3] hover:text-white transition-colors"
                title="আয়াত কপি করুন"
              >
                {copiedIndex === verse.number ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Arabic */}
            <div
              className="text-right text-xl md:text-2xl font-serif text-[#E2A336] my-4 leading-relaxed tracking-wider"
              dir="rtl"
              lang="ar"
            >
              {verse.arabic}
            </div>

            {/* Transliteration */}
            <div className="text-xs text-amber-200/90 mb-2 bg-[#03221F] p-2.5 rounded-xl border border-white/5">
              <span className="text-[#90A8A3] text-[10px] block mb-0.5">উচ্চারণ:</span>
              {verse.transliteration}
            </div>

            {/* Bengali Meaning */}
            <div className="text-sm text-stone-200 leading-relaxed">
              <span className="text-[#E2A336] font-semibold">অর্থ: </span>
              {verse.bengali}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
