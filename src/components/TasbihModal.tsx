import React, { useState } from 'react';
import { X, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';

interface TasbihModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onAddCoin: (amount: number) => void;
  lang?: AppLanguage;
}

interface DhikrPreset {
  id: string;
  textAr: string;
  text: { en: string; ur: string; bn: string };
  meaning: { en: string; ur: string; bn: string };
  target: number;
}

const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    textAr: 'سُبْحَانَ اللَّهِ',
    text: { en: 'SubhanAllah', ur: 'سبحان اللہ', bn: 'সুবহানাল্লাহ' },
    meaning: {
      en: 'Glory be to Allah, free from all imperfection',
      ur: 'اللہ ہر عیب اور نقص سے پاک ہے',
      bn: 'আল্লাহ অতি পবিত্র ও ত্রুটিমুক্ত',
    },
    target: 33,
  },
  {
    id: 'alhamdulillah',
    textAr: 'الْحَمْدُ لِلَّهِ',
    text: { en: 'Alhamdulillah', ur: 'الحمد للہ', bn: 'আলহামদুলিল্লাহ' },
    meaning: {
      en: 'All praise and gratitude is due to Allah alone',
      ur: 'تمام تعریفیں اور شکر صرف اللہ کے لیے ہیں',
      bn: 'সকল প্রশংসা মহান আল্লাহর জন্য',
    },
    target: 33,
  },
  {
    id: 'allahuakbar',
    textAr: 'اللَّهُ أَكْبَرُ',
    text: { en: 'Allahu Akbar', ur: 'اللہ اکبر', bn: 'আল্লাহু আকবার' },
    meaning: {
      en: 'Allah is the Greatest over all things',
      ur: 'اللہ سب سے بڑا اور بلند و بالا ہے',
      bn: 'আল্লাহ সর্বশ্রেষ্ঠ ও মহান',
    },
    target: 34,
  },
  {
    id: 'astaghfirullah',
    textAr: 'أَسْتَغْفِرُ اللَّهَ',
    text: { en: 'Astaghfirullah', ur: 'استغفر اللہ', bn: 'আস্তাগফিরুল্লাহ' },
    meaning: {
      en: 'I seek forgiveness from Allah my Lord',
      ur: 'میں اپنے رب اللہ سے معافی اور مغفرت مانگتا ہوں',
      bn: 'আমি আল্লাহর নিকট ক্ষমা প্রার্থনা করছি',
    },
    target: 100,
  },
  {
    id: 'lailaha',
    textAr: 'لَا إِلَهَ إِلَّا اللَّهُ',
    text: { en: 'La ilaha illallah', ur: 'لا الہ الا اللہ', bn: 'লা ইলাহা ইল্লাল্লাহ' },
    meaning: {
      en: 'None has the right to be worshipped except Allah',
      ur: 'اللہ کے سوا کوئی عبادت کے لائق نہیں',
      bn: 'আল্লাহ ব্যতীত কোনো সত্য উপাস্য নেই',
    },
    target: 100,
  },
  {
    id: 'durood',
    textAr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    text: { en: 'Salawat on Prophet (pbuh)', ur: 'درود شریف', bn: 'দরুদ শরীফ' },
    meaning: {
      en: 'O Allah, send blessings and peace upon Muhammad',
      ur: 'اے اللہ! ہمارے نبی محمد صلی اللہ علیہ وسلم پر رحمتیں نازل فرما',
      bn: 'হে আল্লাহ! মুহাম্মাদ (সা.)-এর উপর রহমত বর্ষণ করুন',
    },
    target: 100,
  },
];

export const TasbihModal: React.FC<TasbihModalProps> = ({
  isOpen,
  onClose,
  coins,
  onAddCoin,
  lang = 'en',
}) => {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState<number>(0);
  const [laps, setLaps] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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

    if (nextCount % 10 === 0) {
      onAddCoin(1);
    }

    if (nextCount >= selectedDhikr.target) {
      setLaps((l) => l + 1);
      setCount(0);
      onAddCoin(5);
    }
  };

  const handleReset = () => {
    setCount(0);
    setLaps(0);
  };

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((count / selectedDhikr.target) * 100));

  const modalTitle = lang === 'ur' ? 'ڈیجیٹل تسبیح' : lang === 'bn' ? 'ডিজিটাল তসবীহ' : 'Digital Tasbih';
  const coinsText = lang === 'ur' ? `${coins} سکے` : lang === 'bn' ? `${coins} কয়েন` : `${coins} Coins`;
  const roundsText = lang === 'ur' ? `چکر: ${laps}` : lang === 'bn' ? `রাউন্ড: ${laps}` : `Rounds: ${laps}`;
  const targetText = lang === 'ur' ? `ہدف: ${selectedDhikr.target}` : lang === 'bn' ? `টার্গেট: ${selectedDhikr.target}` : `Target: ${selectedDhikr.target}`;
  const tapToCountText = lang === 'ur' ? 'گننے کے لیے دبائیں' : lang === 'bn' ? 'গণনা করতে চাপুন' : 'Tap to Count';
  const resetText = lang === 'ur' ? 'دوبارہ شروع' : lang === 'bn' ? 'রিসেট' : 'Reset';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center"
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

        {/* Top Header */}
        <div className={`w-full flex items-center justify-between ${lang === 'ur' ? 'pl-8' : 'pr-8'} mb-4`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📿</span>
            <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#03221F] px-2.5 py-1 rounded-full border border-[#E2A336]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#E2A336]" />
            <span className="text-xs font-bold text-[#E2A336]">{coinsText}</span>
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
              <span>{d.text[lang] || d.text.en}</span>
            </button>
          ))}
        </div>

        {/* Active Dhikr Display */}
        <div className="text-center my-2">
          <div dir="rtl" className="text-3xl font-serif font-bold text-[#E2A336] mb-1">
            {selectedDhikr.textAr}
          </div>
          <div className="text-sm font-semibold text-white">
            {selectedDhikr.text[lang] || selectedDhikr.text.en}
          </div>
          <div className="text-xs text-[#90A8A3] mt-1 max-w-xs">
            {selectedDhikr.meaning[lang] || selectedDhikr.meaning.en}
          </div>
        </div>

        {/* Counter Circle Button */}
        <div className="my-6 relative">
          <button
            onClick={handleIncrement}
            className="w-48 h-48 rounded-full bg-gradient-to-b from-[#0D433A] to-[#03221F] border-4 border-[#E2A336] shadow-2xl flex flex-col items-center justify-center cursor-pointer active:scale-95 hover:border-amber-400 transition-all select-none group"
          >
            <span className="text-5xl font-black text-white tracking-tight group-hover:scale-105 transition-transform">
              {count}
            </span>
            <span className="text-xs text-[#E2A336] font-medium mt-1">
              / {selectedDhikr.target}
            </span>
            <span className="text-[11px] text-[#90A8A3] mt-1">
              {tapToCountText}
            </span>
          </button>

          {/* Progress ring indicator */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#03221F] px-3 py-0.5 rounded-full border border-white/10 text-[11px] text-[#E2A336] font-bold">
            {progressPercent}%
          </div>
        </div>

        {/* Controls: Reset & Sound Toggle */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-white/10 px-4 text-xs text-[#90A8A3]">
          <div className="flex items-center gap-2">
            <span>{roundsText}</span>
            <span>•</span>
            <span>{targetText}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#E2A336]" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{resetText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
