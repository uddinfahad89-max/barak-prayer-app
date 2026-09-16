import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Flame } from 'lucide-react';
import { AppLanguage } from '../types';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoin: (amount: number) => void;
  lang?: AppLanguage;
}

interface DailyRecord {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  tahajjud: boolean;
  quran: boolean;
  sadaqah: boolean;
  fasting: boolean;
  dhikr: boolean;
}

const DEFAULT_RECORD: DailyRecord = {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
  tahajjud: false,
  quran: false,
  sadaqah: false,
  fasting: false,
  dhikr: false,
};

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onAddCoin,
  lang = 'en',
}) => {
  const todayKey = new Date().toISOString().split('T')[0];
  const [record, setRecord] = useState<DailyRecord>(() => {
    try {
      const saved = localStorage.getItem(`journal_${todayKey}`);
      return saved ? JSON.parse(saved) : DEFAULT_RECORD;
    } catch {
      return DEFAULT_RECORD;
    }
  });

  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('journal_streak') || '3', 10);
    } catch {
      return 3;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`journal_${todayKey}`, JSON.stringify(record));
    } catch {
      // ignore
    }
  }, [record, todayKey]);

  if (!isOpen) return null;

  const toggleItem = (key: keyof DailyRecord) => {
    const newVal = !record[key];
    setRecord((prev) => ({ ...prev, [key]: newVal }));
    if (newVal) {
      onAddCoin(2);
    }
  };

  const completedCount = Object.values(record).filter(Boolean).length;
  const totalCount = Object.keys(record).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const title = lang === 'ur' ? 'اعمال ٹریکر (روزنامچہ)' : lang === 'bn' ? 'আমল ট্র্যাকার (Journal)' : 'Daily Deeds Journal';
  const subtitle = lang === 'ur' ? 'آج کی عبادات اور نیک اعمال کی فہرست' : lang === 'bn' ? 'আজকের ইবাদত ও নেক আমলের তালিকা' : 'Track your daily prayers and righteous deeds';
  const streakText = lang === 'ur' ? `${streak} دن` : lang === 'bn' ? `${streak} দিন` : `${streak} days`;
  const progressText = lang === 'ur' ? `آج کی پیشرفت (${completedCount}/${totalCount})` : lang === 'bn' ? `আজকের অগ্রগতি (${completedCount}/${totalCount})` : `Today's Progress (${completedCount}/${totalCount})`;
  const completedText = lang === 'ur' ? `${percentage}٪ مکمل` : lang === 'bn' ? `${percentage}% সম্পন্ন` : `${percentage}% Completed`;
  const fardHeader = lang === 'ur' ? '5 وقت کی فرض نمازیں' : lang === 'bn' ? '৫ ওয়াক্ত ফরজ সালাত' : '5 Daily Obligatory Prayers';
  const naflHeader = lang === 'ur' ? 'نوافل اور خصوصی اعمال' : lang === 'bn' ? 'নফল ও বিশেষ আমল' : 'Voluntary & Sunnah Acts';
  const coinsText = lang === 'ur' ? '+2 سکے' : lang === 'bn' ? '+২ কয়েন' : '+2 Coins';

  const fardItems = [
    { key: 'fajr', label: lang === 'ur' ? 'نمازِ فجر' : lang === 'bn' ? 'ফজর সালাত' : 'Fajr Prayer' },
    { key: 'dhuhr', label: lang === 'ur' ? 'نمازِ ظہر' : lang === 'bn' ? 'যোহর সালাত' : 'Dhuhr Prayer' },
    { key: 'asr', label: lang === 'ur' ? 'نمازِ عصر' : lang === 'bn' ? 'আসর সালাত' : 'Asr Prayer' },
    { key: 'maghrib', label: lang === 'ur' ? 'نمازِ مغرب' : lang === 'bn' ? 'মাগরিব সালাত' : 'Maghrib Prayer' },
    { key: 'isha', label: lang === 'ur' ? 'نمازِ عشاء' : lang === 'bn' ? 'এশা সালাত' : 'Isha Prayer' },
  ];

  const naflItems = [
    { key: 'tahajjud', label: lang === 'ur' ? 'نمازِ تہجد' : lang === 'bn' ? 'তাহাজ্জুদ সালাত' : 'Tahajjud (Night Prayer)' },
    { key: 'quran', label: lang === 'ur' ? 'تلاوتِ قرآن و تدبر' : lang === 'bn' ? 'কুরআন তিলাওয়াত ও তাদাব্বুর' : 'Quran Recitation & Reflection' },
    { key: 'dhikr', label: lang === 'ur' ? 'صبح و شام کے اذکار' : lang === 'bn' ? 'সকাল ও সন্ধ্যার জিকির' : 'Morning & Evening Adhkar' },
    { key: 'sadaqah', label: lang === 'ur' ? 'صدقہ و خیرات' : lang === 'bn' ? 'দান ও সাদাকাহ' : 'Sadaqah & Helping Others' },
    { key: 'fasting', label: lang === 'ur' ? 'روزہ (فرض یا نفل)' : lang === 'bn' ? 'নফল বা ফরজ সিয়াম (রোজা)' : 'Fasting (Fard or Voluntary)' },
  ];

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

        {/* Title */}
        <div className={`flex items-center justify-between ${lang === 'ur' ? 'pl-8' : 'pr-8'} mb-3`}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📓</span>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <span className="text-xs text-[#90A8A3]">{subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#03221F] px-2.5 py-1 rounded-full border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{streakText}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#03221F] p-4 rounded-xl border border-white/5 mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#90A8A3]">{progressText}</span>
            <span className="font-bold text-[#E2A336]">{completedText}</span>
          </div>
          <div className="w-full h-2.5 bg-[#0C3E37] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E2A336] to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[50vh] pr-1">
          <div className="text-[11px] font-bold text-[#E2A336] uppercase tracking-wider mb-1">
            {fardHeader}
          </div>

          {fardItems.map((item) => {
            const isDone = record[item.key as keyof DailyRecord];
            return (
              <button
                key={item.key}
                onClick={() => toggleItem(item.key as keyof DailyRecord)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                  isDone
                    ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#03221F] border-white/5 text-[#90A8A3] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-white/20 bg-black/20'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                <span className="text-[10px] text-amber-300/80">{coinsText}</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold text-[#E2A336] uppercase tracking-wider mt-4 mb-1">
            {naflHeader}
          </div>

          {naflItems.map((item) => {
            const isDone = record[item.key as keyof DailyRecord];
            return (
              <button
                key={item.key}
                onClick={() => toggleItem(item.key as keyof DailyRecord)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                  isDone
                    ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-[#03221F] border-white/5 text-[#90A8A3] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-white/20 bg-black/20'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                <span className="text-[10px] text-amber-300/80">{coinsText}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
