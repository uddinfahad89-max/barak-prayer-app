import React, { useState } from 'react';
import { X, Heart, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoin?: (amount: number) => void;
  lang?: AppLanguage;
  campaignTitle?: string;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCoin,
  lang = 'en',
  campaignTitle,
}) => {
  const [pledged, setPledged] = useState<boolean>(false);
  const [deedsCount, setDeedsCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('daily_sadaqah_deeds') || '1250', 10);
    } catch {
      return 1250;
    }
  });

  if (!isOpen) return null;

  const handlePledge = () => {
    setPledged(true);
    const newCount = deedsCount + 1;
    setDeedsCount(newCount);
    try {
      localStorage.setItem('daily_sadaqah_deeds', String(newCount));
    } catch {
      // ignore
    }
    if (onAddCoin) {
      onAddCoin(10);
    }
  };

  const title =
    campaignTitle ||
    (lang === 'ur'
      ? 'روزانہ کا صدقہ و خیرات'
      : lang === 'bn'
      ? 'দৈনিক দান ও সাদাকাহ'
      : 'Daily Sadaqah & Charitable Giving');

  const badgeText =
    lang === 'ur'
      ? 'مبارک عمل و صدقہ'
      : lang === 'bn'
      ? 'বরকতময় দান ও আমল'
      : 'Blessed Act of Sadaqah';

  const hadithLead =
    lang === 'ur'
      ? 'رسول اللہ ﷺ نے فرمایا:'
      : lang === 'bn'
      ? 'রাসূলুল্লাহ (ﷺ) ইরশাদ করেছেন:'
      : 'The Messenger of Allah (ﷺ) said:';

  const hadithText =
    lang === 'ur'
      ? 'صدقہ رب کے غضب کو ٹھنڈا کرتا ہے اور بری موت سے بچاتا ہے۔'
      : lang === 'bn'
      ? 'সাদাকাহ রবের ক্রোধ নিভিয়ে দেয় এবং অপমৃত্যু থেকে রক্ষা করে।'
      : 'Charity extinguishes the anger of the Lord and prevents an evil death.';

  const hadithRef =
    lang === 'ur' ? '— جامع ترمذی: 664' : lang === 'bn' ? '— জামে তিরমিজি: ৬৬৪' : '— Jami` at-Tirmidhi: 664';

  const descText =
    lang === 'ur'
      ? 'ہر روز خیرات و صدقے کی نیت دل کو پاکیزگی، رزق میں برکت اور آفات و مصائب سے حفاظت عطا کرتی ہے۔'
      : lang === 'bn'
      ? 'প্রতিদিন সামান্য দান ও উত্তম কাজের নিয়ত অন্তরে প্রশান্তি, রিজিকে বরকত এবং বিপদাপদ দূর করে।'
      : 'Setting a daily intention for charity and kindness brings immense blessings, purifies wealth, and protects against hardships.';

  const countLabel =
    lang === 'ur'
      ? 'امت کے کل نیک ارادے و صدقات'
      : lang === 'bn'
      ? 'উম্মাহর মোট সংকল্প ও দান'
      : 'Total Ummah Intentions & Deeds';

  const successMessage =
    lang === 'ur'
      ? 'جزاک اللہ خیراً! آپ کی نیت اور صدقہ قبول ہو۔ (+10 سکے حاصل ہوئے)'
      : lang === 'bn'
      ? 'জাযাকাল্লাহু খাইরান! আপনার নিয়ত ও সাদাকা কবুল হোক। (+১০ কয়েন যোগ হয়েছে)'
      : 'JazakAllah Khair! May Allah accept your sincere intention & charity. (+10 Coins)';

  const pledgeButtonText =
    lang === 'ur'
      ? 'میں نے آج صدقہ و خیرات کی نیت کی'
      : lang === 'bn'
      ? 'আমি আজ দান ও সাদাকার নিয়ত করলাম'
      : 'I intend to give Sadaqah & do good today';

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

        {/* Hero Visual */}
        <div className="w-full bg-gradient-to-r from-emerald-900/60 to-[#03221F] p-4 rounded-xl border border-white/5 flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-400">
            <Heart className="w-7 h-7 fill-amber-400/20" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E2A336] bg-[#E2A336]/10 px-2 py-0.5 rounded">
              {badgeText}
            </span>
            <h2 className="text-base font-bold text-white mt-1">{title}</h2>
          </div>
        </div>

        {/* Hadith on Sadaqah */}
        <div className="bg-[#03221F] p-4 rounded-xl border border-white/5 text-xs mb-4 leading-relaxed">
          <div className="text-amber-300 font-semibold mb-1">{hadithLead}</div>
          <p className="text-stone-300 italic">"{hadithText}"</p>
          <span className="text-[10px] text-[#90A8A3] block mt-1">{hadithRef}</span>
        </div>

        {/* Info */}
        <div className="space-y-2 text-xs text-[#90A8A3] leading-relaxed mb-5">
          <p>{descText}</p>
          <div className="flex items-center gap-2 text-emerald-300 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {lang === 'ur'
                ? 'اخلاصِ نیت اور رضائے الٰہی'
                : lang === 'bn'
                ? 'বিশুদ্ধ নিয়ত ও আল্লাহর সন্তুষ্টি অর্জন'
                : 'Sincere intention for the pleasure of Allah'}
            </span>
          </div>
        </div>

        {/* Community Counter */}
        <div className="bg-[#03221F] p-3 rounded-xl border border-white/5 flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] text-[#90A8A3] block">{countLabel}</span>
            <span className="text-lg font-black text-[#E2A336]">
              {deedsCount.toLocaleString(lang === 'bn' ? 'bn-BD' : undefined)}
            </span>
          </div>
          <div className="text-2xl">🌱</div>
        </div>

        {/* Actions */}
        {pledged ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <button
            onClick={handlePledge}
            className="w-full bg-[#E2A336] hover:bg-yellow-400 text-[#03221F] font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#03221F]" />
            <span>{pledgeButtonText}</span>
          </button>
        )}
      </div>
    </div>
  );
};

