import React, { useState } from 'react';
import { X, Droplets, Heart, CheckCircle, ShieldCheck, ExternalLink } from 'lucide-react';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoin?: (amount: number) => void;
  campaignTitle?: string;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCoin,
  campaignTitle = 'Send Clean Water to Gaza (গাজায় সুপেয় পানি)',
}) => {
  const [pledged, setPledged] = useState<boolean>(false);
  const [litresCount, setLitresCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('gaza_water_litres') || '500', 10);
    } catch {
      return 500;
    }
  });

  if (!isOpen) return null;

  const handlePledge = () => {
    setPledged(true);
    const newCount = litresCount + 20;
    setLitresCount(newCount);
    try {
      localStorage.setItem('gaza_water_litres', String(newCount));
    } catch {
      // ignore
    }
    if (onAddCoin) {
      onAddCoin(10);
    }
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

        {/* Hero Visual */}
        <div className="w-full bg-gradient-to-r from-emerald-900/60 to-[#03221F] p-4 rounded-xl border border-white/5 flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 text-amber-400">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#E2A336] bg-[#E2A336]/10 px-2 py-0.5 rounded">
              জরুরি মানবিক সাদাকাহ
            </span>
            <h2 className="text-base font-bold text-white mt-1">{campaignTitle}</h2>
          </div>
        </div>

        {/* Hadith on Water Sadaqah */}
        <div className="bg-[#03221F] p-4 rounded-xl border border-white/5 text-xs mb-4 leading-relaxed">
          <div className="text-amber-300 font-semibold mb-1">রাসূলুল্লাহ (ﷺ) ইরশাদ করেছেন:</div>
          <p className="text-stone-300 italic">
            "সবচেয়ে উত্তম সদকা হলো মানুষকে সুপেয় পানি পান করানো।"
          </p>
          <span className="text-[10px] text-[#90A8A3] block mt-1">— সুনানে আবু দাউদ ও নাসায়ী</span>
        </div>

        {/* Crisis Info */}
        <div className="space-y-2 text-xs text-[#90A8A3] leading-relaxed mb-5">
          <p>
            গাজার যুদ্ধবিধ্বস্ত পরিবার এবং বিশেষ করে অবুঝ শিশুদের জন্য বিশুদ্ধ পানীয় জলের তীব্র সংকট চলছে। প্রতিটি ফোঁটা পানি একটি শিশুর মুখে জীবন ও আশা ফিরিয়ে দিতে পারে।
          </p>
          <div className="flex items-center gap-2 text-emerald-300 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>সরাসরি মানবিক সহায়তা ও নির্ভরযোগ্য মুসলিম রিলিফ নেটওয়ার্ক</span>
          </div>
        </div>

        {/* Community Counter */}
        <div className="bg-[#03221F] p-3 rounded-xl border border-white/5 flex items-center justify-between mb-5">
          <div>
            <span className="text-[11px] text-[#90A8A3] block">উম্মাহর মোট সংকল্পকৃত পানি</span>
            <span className="text-lg font-black text-[#E2A336]">{litresCount.toLocaleString('bn-BD')} লিটার</span>
          </div>
          <div className="text-2xl">💧</div>
        </div>

        {/* Actions */}
        {pledged ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-center text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>জাযাকাল্লাহু খাইরান! আপনার নিয়ত ও সাদাকা কবুল হোক। (+১০ কয়েন যোগ হয়েছে)</span>
          </div>
        ) : (
          <button
            onClick={handlePledge}
            className="w-full bg-[#E2A336] hover:bg-yellow-400 text-[#03221F] font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-[#03221F]" />
            <span>আমি ২০ লিটার পানি দানের নিয়ত ও সংকল্প করলাম</span>
          </button>
        )}
      </div>
    </div>
  );
};
