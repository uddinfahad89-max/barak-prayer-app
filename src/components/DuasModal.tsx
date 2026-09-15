import React, { useState } from 'react';
import { X, Copy, Check, Search, Heart, BookOpen } from 'lucide-react';

interface DuasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  pronunciation: string;
  meaning: string;
  reference: string;
}

const DUAS_DATABASE: DuaItem[] = [
  {
    id: 'sleep-wake',
    category: 'দৈনন্দিন',
    title: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    pronunciation: 'আলহামদু লিল্লাহিল্লাজি আহ্ইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশুর।',
    meaning: 'সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মৃত্যু (ঘুম)-র পর পুনরায় জীবন দান করলেন এবং তাঁরই কাছে সকলের পুনরুত্থান।',
    reference: 'সহিহ বুখারি: ৬৩১২',
  },
  {
    id: 'fasting-iftar',
    category: 'রোজা',
    title: 'ইফতারের সুন্নত দোয়া',
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    pronunciation: 'যাহাবাজ জামা’উ, ওয়াবতাল্লাতিল উরূক, ওয়া সাবাতাল আজরু ইনশাআল্লাহ।',
    meaning: 'পিপাসা দূর হলো, শিরা-উপশিরা সিক্ত হলো এবং আল্লাহর ইচ্ছায় প্রতিদান নিশ্চিত হলো।',
    reference: 'সুনানে আবু দাউদ: ২৩৫৭',
  },
  {
    id: 'sehri-niyyat',
    category: 'রোজা',
    title: 'রোজার নিয়ত ও দোয়া',
    arabic: 'نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ',
    pronunciation: 'নাওয়াইতু আন আসুমা গাদাম মিন শাহরি রামাদানাল মুবারাকি ফারদাল্লাকা ইয়া আল্লাহ।',
    meaning: 'হে আল্লাহ! আমি আগামীকাল পবিত্র মাহে রমজানের তোমার সন্তুষ্টির উদ্দেশ্যে ফরজ রোজা রাখার দৃঢ় সংকল্প করলাম।',
    reference: 'ইসলামিক ফিকহ সংকলন',
  },
  {
    id: 'protection-distress',
    category: 'বিপদ-আপদ',
    title: 'বিপদ-আপদ ও অনিষ্ট থেকে বাঁচার দোয়া',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    pronunciation: 'বিসমিল্লাহিল্লাজি লা ইয়াদুররু মা’আসমিহি শাইয়ুন ফিল আরদি ওয়ালা ফিস-সামা’ই, ওয়াহুয়াস সামিউল আলিম।',
    meaning: 'আল্লাহর নামে, যাঁর নামের বরকতে আসমান ও জমিনের কোনো কিছুই অনিষ্ট সাধন করতে পারে না; তিনি সর্বশ্রোতা, সর্বজ্ঞ।',
    reference: 'সুনানে তিরমিজি: ৩৩১০',
  },
  {
    id: 'forgiveness-sayyidul',
    category: 'মাগফিরাত',
    title: 'সাইয়্যিদুল ইস্তিগফার (শ্রেষ্ঠ ক্ষমাপ্রার্থনা)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    pronunciation: 'আল্লাহুম্মা আনতা রব্বি লা ইলাহা ইল্লা আনতা, খালাকতানি ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া’দিকা মাস্তাত্বা’তু, আউজু বিকা মিন শাররি মা সানা’তু, আবূউ লাকা বিনি’মাতিকা আলাইয়্যা, ওয়া আবূউ বিজাম্বি ফাগফিরলি, ফাইন্নাহু লা ইয়াগফিরুজ জুনুবা ইল্লা আনতা।',
    meaning: 'হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া সত্য কোনো মাবুদ নেই। আপনি আমাকে সৃষ্টি করেছেন, আর আমি আপনার বান্দা। আমি আমার সাধ্যমতো আপনার অঙ্গীকার ও প্রতিশ্রুতিতে অবিচল আছি। আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার নিয়ামত স্বীকার করছি এবং আমার গুনাহ স্বীকার করছি। অতএব আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া গুনাহ ক্ষমা করার কেউ নেই।',
    reference: 'সহিহ বুখারি: ৬৩০৬',
  },
  {
    id: 'mosque-enter',
    category: 'নামাজ',
    title: 'মসজিদে প্রবেশের দোয়া',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    pronunciation: 'আল্লাহুম্মাফ তাহলী আবওয়াবা রহমাতিকা।',
    meaning: 'হে আল্লাহ! আমার জন্য আপনার রহমতের দুয়ারসমূহ উন্মুক্ত করে দিন।',
    reference: 'সহিহ মুসলিম: ৭১৩',
  },
];

const CATEGORIES = ['সব দোয়া', 'রোজা', 'দৈনন্দিন', 'বিপদ-আপদ', 'মাগফিরাত', 'নামাজ'];

export const DuasModal: React.FC<DuasModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব দোয়া');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDuas = DUAS_DATABASE.filter((d) => {
    const matchCat = selectedCategory === 'সব দোয়া' || d.category === selectedCategory;
    const matchQuery =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pronunciation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-xl max-h-[90vh] rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤲</span>
          <h2 className="text-xl font-bold text-white">মাসনূন দোয়া ও মোনাজাত (Duas)</h2>
        </div>
        <p className="text-xs text-[#90A8A3] mb-4">
          হিসনুল মুসলিম ও সহিহ হাদিস থেকে সংগৃহীত প্রয়োজনীয় দোয়াসমূহ
        </p>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#90A8A3]" />
          <input
            type="text"
            placeholder="দোয়া বা অর্থ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#03221F] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-[#90A8A3] focus:outline-none focus:border-[#E2A336]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#E2A336] text-[#03221F] font-bold'
                  : 'bg-[#03221F] text-[#90A8A3] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dua Cards List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-12 text-[#90A8A3] text-sm">
              কোনো দোয়া পাওয়া যায়নি
            </div>
          ) : (
            filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-[#03221F] border border-white/5 hover:border-[#E2A336]/30 rounded-xl p-4 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#E2A336] bg-[#E2A336]/10 px-2 py-0.5 rounded-md inline-block mb-1">
                      {dua.category}
                    </span>
                    <h3 className="text-sm font-bold text-white">{dua.title}</h3>
                  </div>

                  <button
                    onClick={() => handleCopy(`${dua.arabic}\n\nউচ্চারণ: ${dua.pronunciation}\n\nঅর্থ: ${dua.meaning}`, dua.id)}
                    className="p-1.5 rounded-lg bg-white/5 text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors"
                    title="দোয়া কপি করুন"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Arabic Text */}
                <div
                  className="text-right text-lg md:text-xl font-serif text-[#E2A336] my-3 leading-relaxed tracking-wide"
                  dir="rtl"
                  lang="ar"
                >
                  {dua.arabic}
                </div>

                {/* Pronunciation */}
                <div className="text-xs text-amber-200/90 font-medium mb-2 bg-white/5 p-2 rounded-lg">
                  <span className="text-[#90A8A3] text-[10px] block font-normal">উচ্চারণ:</span>
                  {dua.pronunciation}
                </div>

                {/* Meaning */}
                <div className="text-xs text-[#90A8A3] leading-relaxed mb-2">
                  <span className="text-white font-semibold">অর্থ: </span>
                  {dua.meaning}
                </div>

                {/* Reference */}
                <div className="text-[10px] text-stone-500 italic flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>সূত্র: {dua.reference}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
