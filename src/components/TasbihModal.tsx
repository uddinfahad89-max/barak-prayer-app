import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface TasbihModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onAddCoin: (amount: number) => void;
}

const DHIKR_PRESETS = [
  { id: 'subhanallah', textAr: 'سُبْحَانَ اللَّهِ', textBn: 'সুবহানাল্লাহ', meaning: 'আল্লাহ অতি পবিত্র ও ত্রুটিমুক্ত', target: 33 },
  { id: 'alhamdulillah', textAr: 'الْحَمْدُ لِلَّهِ', textBn: 'আলহামদুলিল্লাহ', meaning: 'সকল প্রশংসা মহান আল্লাহর জন্য', target: 33 },
  { id: 'allahuakbar', textAr: 'اللَّهُ أَكْبَرُ', textBn: 'আল্লাহু আকবার', meaning: 'আল্লাহ সর্বশ্রেষ্ঠ ও মহান', target: 34 },
  { id: 'astaghfirullah', textAr: 'أَسْتَغْفِرُ اللَّهَ', textBn: 'আস্তাগফিরুল্লাহ', meaning: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি', target: 100 },
  { id: 'lailaha', textAr: 'لَا إِلَهَ إِلَّا اللَّهُ', textBn: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'আল্লাহ ব্যতীত কোনো উপাস্য নেই', target: 100 },
  { id: 'durood', textAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', textBn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ', meaning: 'হে আল্লাহ! মুহাম্মাদ (সা.)-এর উপর রহমত বর্ষণ করুন', target: 100 },
];

export const TasbihModal: React.FC<TasbihModalProps> = ({
  isOpen,
  onClose,
  coins,
  onAddCoin,
}) => {
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [laps, setLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Play subtle web audio click
  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  };

  const handleIncrement = () => {
    playClickSound();

    if (navigator.vibrate) {
      navigator.vibrate(20);
    }

    const nextCount = count + 1;
    setCount(nextCount);

    // Reward coin every 10 counts or on round completion
    if (nextCount % 10 === 0) {
      onAddCoin(1);
    }

    if (nextCount >= selectedDhikr.target) {
      setLaps((l) => l + 1);
      setCount(0);
      onAddCoin(5); // bonus coins for finishing a round
    }
  };

  const handleReset = () => {
    setCount(0);
    setLaps(0);
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((count / selectedDhikr.target) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="w-full flex items-center justify-between pr-8 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📿</span>
            <h2 className="text-xl font-bold text-white">ডিজিটাল তাসবিহ</h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#03221F] px-2.5 py-1 rounded-full border border-[#E2A336]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E2A336]" />
            <span className="text-xs font-bold text-[#E2A336]">{coins} কয়েন</span>
          </div>
        </div>

        {/* Dhikr Selector Pills */}
        <div className="w-full flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {DHIKR_PRESETS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDhikr(d);
                setCount(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all flex flex-col items-center ${
                selectedDhikr.id === d.id
                  ? 'bg-[#E2A336] text-[#03221F] font-bold shadow-md'
                  : 'bg-[#03221F] text-[#90A8A3] hover:text-white border border-white/5'
              }`}
            >
              <span>{d.textBn}</span>
              <span className="text-[10px] opacity-75">{d.target} বার</span>
            </button>
          ))}
        </div>

        {/* Active Dhikr Card */}
        <div className="w-full bg-[#03221F] rounded-xl p-4 border border-white/5 text-center mb-6">
          <div className="text-2xl font-serif text-[#E2A336] mb-1 dir-rtl" lang="ar">
            {selectedDhikr.textAr}
          </div>
          <div className="text-sm font-bold text-white">{selectedDhikr.textBn}</div>
          <div className="text-xs text-[#90A8A3] mt-0.5">{selectedDhikr.meaning}</div>
        </div>

        {/* Big Tap Bead / Button */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Circular Progress Ring */}
          <svg className="w-52 h-52 -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="90"
              stroke="#0C3E37"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="104"
              cy="104"
              r="90"
              stroke="#E2A336"
              strokeWidth="10"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 - (565.48 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-200 ease-out"
            />
          </svg>

          {/* Touch Trigger */}
          <button
            onClick={handleIncrement}
            className="absolute w-40 h-40 rounded-full bg-gradient-to-b from-[#0D433A] to-[#062924] border-4 border-[#E2A336]/40 flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-transform select-none group"
            id="tasbih-tap-btn"
          >
            <span className="text-5xl font-black text-white tracking-tight group-hover:text-[#E2A336] transition-colors">
              {count}
            </span>
            <span className="text-[11px] font-semibold text-[#90A8A3] mt-1 uppercase tracking-wider">
              লক্ষ্য: {selectedDhikr.target}
            </span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5">ট্যাপ করুন</span>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="w-full flex items-center justify-between mt-6 px-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-xs text-[#90A8A3] hover:text-white transition-colors bg-[#03221F] px-3 py-2 rounded-lg border border-white/5"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E2A336]" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            <span>শব্দ {soundEnabled ? 'অন' : 'অফ'}</span>
          </button>

          <div className="text-xs text-[#90A8A3]">
            সম্পূর্ণ চক্র: <strong className="text-white">{laps}</strong>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#90A8A3] hover:text-white transition-colors bg-[#03221F] px-3 py-2 rounded-lg border border-white/5"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>রিসেট</span>
          </button>
        </div>
      </div>
    </div>
  );
};
