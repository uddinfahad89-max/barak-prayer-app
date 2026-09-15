import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Calendar, Award, Flame } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoin: (amount: number) => void;
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
      onAddCoin(2); // award 2 coins per good deed logged
    }
  };

  const completedCount = Object.values(record).filter(Boolean).length;
  const totalCount = Object.keys(record).length;
  const percentage = Math.round((completedCount / totalCount) * 100);

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

        {/* Title */}
        <div className="flex items-center justify-between pr-8 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📓</span>
            <div>
              <h2 className="text-xl font-bold text-white">আমল ট্র্যাকার (Journal)</h2>
              <span className="text-xs text-[#90A8A3]">আজকের ইবাদত ও নেক আমলের তালিকা</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#03221F] px-2.5 py-1 rounded-full border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{streak} দিন</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#03221F] p-4 rounded-xl border border-white/5 mb-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#90A8A3]">আজকের অগ্রগতি ({completedCount}/{totalCount})</span>
            <span className="font-bold text-[#E2A336]">{percentage}% সম্পন্ন</span>
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
            ৫ ওয়াক্ত ফরজ সালাত
          </div>

          {[
            { key: 'fajr', label: 'ফজর সালাত' },
            { key: 'dhuhr', label: 'যোহর সালাত' },
            { key: 'asr', label: 'আসর সালাত' },
            { key: 'maghrib', label: 'মাগরিব সালাত' },
            { key: 'isha', label: 'এশা সালাত' },
          ].map((item) => {
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
                <span className="text-[10px] text-amber-300/80">+২ কয়েন</span>
              </button>
            );
          })}

          <div className="text-[11px] font-bold text-[#E2A336] uppercase tracking-wider mt-4 mb-1">
            নফল ও বিশেষ আমল
          </div>

          {[
            { key: 'tahajjud', label: 'তাহাজ্জুদ সালাত' },
            { key: 'quran', label: 'কুরআন তিলাওয়াত ও তাদাব্বুর' },
            { key: 'dhikr', label: 'সকাল ও সন্ধ্যার জিকির' },
            { key: 'sadaqah', label: 'দান ও সাদাকাহ' },
            { key: 'fasting', label: 'নফল বা ফরজ সিয়াম (রোজা)' },
          ].map((item) => {
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
                <span className="text-[10px] text-amber-300/80">+২ কয়েন</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
