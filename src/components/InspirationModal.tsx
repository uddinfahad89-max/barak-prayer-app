import React, { useState } from 'react';
import { X, Sparkles, Share2, Bookmark, Heart, ChevronRight } from 'lucide-react';

interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSPIRATIONS = [
  {
    type: 'আল-কুরআন',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আর তোমরা আমার প্রতি কৃতজ্ঞ হও এবং অকৃতজ্ঞ হয়ো না।',
    reference: 'সূরা আল-বাক্বারা, আয়াত: ১৫২',
    reflection: 'সর্বদা আল্লাহর জিকিরে জিহ্বা সিক্ত রাখলে বান্দা আল্লাহর রহমত ও বিশেষ সান্নিধ্য লাভ করে।',
  },
  {
    type: 'সহিহ হাদিস',
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    translation: 'যে ব্যক্তি দ্বীনি ইলম বা জ্ঞান অন্বেষণের পথে বের হয়, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।',
    reference: 'সহিহ মুসলিম: ২৬৯৯',
    reflection: 'প্রতিদিন কুরআন ও সুন্নাহর ন্যূনতম একটি বিষয় শেখাও জান্নাতের অমূল্য পথ সুগম করে।',
  },
  {
    type: 'আল-কুরআন',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'জেনে রেখো! আল্লাহর স্মরণেই কেবল হৃদয়সমূহ প্রশান্তি লাভ করে।',
    reference: 'সূরা আর-রাদ, আয়াত: ২৮',
    reflection: 'দুনিয়ার সকল অস্থিরতা ও পেরেশানির একমাত্র মহাঔষধ হলো অন্তরের গভীর থেকে আল্লাহকে স্মরণ করা।',
  },
  {
    type: 'সহিহ হাদিস',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সে, যে নিজে কুরআন শিখে এবং অপরকে শিক্ষা দেয়।',
    reference: 'সহিহ বুখারি: ৫০২৭',
    reflection: 'কুরআন শেখা ও শেখানোর চেয়ে উত্তম ও মর্যাদাপূর্ণ আমল মুমিনের জীবনে আর কিছু হতে পারে না।',
  },
];

export const InspirationModal: React.FC<InspirationModalProps> = ({ isOpen, onClose }) => {
  const [index, setIndex] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  if (!isOpen) return null;

  const current = INSPIRATIONS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % INSPIRATIONS.length);
    setLiked(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#E2A336]" />
          <h2 className="text-xl font-bold text-white">দৈনিক অনুপ্রেরণা (Inspiration)</h2>
        </div>

        {/* Card Content */}
        <div className="bg-[#03221F] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-inner flex-1">
          <span className="text-[10px] uppercase font-bold text-[#E2A336] bg-[#E2A336]/10 px-2.5 py-0.5 rounded-full inline-block mb-3">
            {current.type}
          </span>

          {/* Arabic */}
          <div
            className="text-right text-lg md:text-xl font-serif text-[#E2A336] leading-relaxed my-3"
            dir="rtl"
            lang="ar"
          >
            {current.arabic}
          </div>

          {/* Translation */}
          <div className="text-sm font-medium text-stone-200 leading-relaxed mb-3">
            "{current.translation}"
          </div>

          {/* Reference */}
          <div className="text-xs text-[#90A8A3] font-semibold mb-4">
            — {current.reference}
          </div>

          {/* Reflection */}
          <div className="bg-[#09332E]/60 p-3 rounded-xl border border-white/5 text-xs text-amber-100/80 leading-relaxed">
            <strong className="text-[#E2A336] block mb-1">💡 অন্তর্দৃষ্টি ও আমল:</strong>
            {current.reflection}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs ${
              liked
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-[#03221F] border-white/10 text-[#90A8A3] hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{liked ? 'পছন্দ হয়েছে' : 'পছন্দ'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-[#E2A336] text-[#03221F] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md hover:bg-yellow-400 transition-all active:scale-95"
          >
            <span>পরবর্তী উপদেশ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
