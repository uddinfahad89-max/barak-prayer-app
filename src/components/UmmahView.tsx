import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Send, Sparkles } from 'lucide-react';

interface DuaRequest {
  id: string;
  author: string;
  location: string;
  text: string;
  ameenCount: number;
  hasAmeen: boolean;
  timeAgo: string;
}

const INITIAL_DUAS: DuaRequest[] = [
  {
    id: '1',
    author: 'আব্দুল করিম',
    location: 'শিলচর, আসাম',
    text: 'আমার অসুস্থ মায়ের দ্রুত আরোগ্য ও দীর্ঘ নেক হায়াতের জন্য সকলের কাছে খাস দোয়ার দরখাস্ত।',
    ameenCount: 42,
    hasAmeen: false,
    timeAgo: '১০ মিনিট আগে',
  },
  {
    id: '2',
    author: 'মুহাম্মাদ ইমরান',
    location: 'হাওড়া, পশ্চিমবঙ্গ',
    text: 'আল্লাহ যেন গাজা ও ফিলিস্তিনের মজলুম ভাই-বোন ও এতিম শিশুদের হেফাজতে রাখেন এবং শান্তি ফিরিয়ে দেন। আমিন।',
    ameenCount: 156,
    hasAmeen: false,
    timeAgo: '২৫ মিনিট আগে',
  },
  {
    id: '3',
    author: 'ফাতিমা খাতুন',
    location: 'করিমগঞ্জ, আসাম',
    text: 'পরিবারের দ্বীনি বরকত এবং সন্তানের সুন্দর চরিত্র ও পরীক্ষার সাফল্যের জন্য দোয়ার দরখাস্ত রইল।',
    ameenCount: 28,
    hasAmeen: false,
    timeAgo: '১ ঘণ্টা আগে',
  },
];

export const UmmahView: React.FC<{ onAddCoin: (amount: number) => void }> = ({ onAddCoin }) => {
  const [duas, setDuas] = useState<DuaRequest[]>(INITIAL_DUAS);
  const [newDuaText, setNewDuaText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');

  const handleAmeen = (id: string) => {
    setDuas((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.hasAmeen;
          if (nextState) onAddCoin(1);
          return {
            ...d,
            ameenCount: d.ameenCount + (nextState ? 1 : -1),
            hasAmeen: nextState,
          };
        }
        return d;
      })
    );
  };

  const handlePostDua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuaText.trim()) return;

    const newEntry: DuaRequest = {
      id: Date.now().toString(),
      author: authorName.trim() || 'উম্মাহর এক ভাই/বোন',
      location: 'ভারত',
      text: newDuaText.trim(),
      ameenCount: 1,
      hasAmeen: true,
      timeAgo: 'এইমাত্র',
    };

    setDuas([newEntry, ...duas]);
    setNewDuaText('');
    onAddCoin(5);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-[#09332E] border border-[#E2A336]/30 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#E2A336]/20 border border-[#E2A336]/30 flex items-center justify-center text-[#E2A336]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">উম্মাহ ওয়াল (Dua Wall)</h2>
            <p className="text-xs text-[#90A8A3]">একে অপরের জন্য খাস দোয়া ও সহমর্মিতা প্রকাশ করুন</p>
          </div>
        </div>

        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Post a Dua Card */}
      <form
        onSubmit={handlePostDua}
        className="bg-[#09332E] border border-white/5 rounded-2xl p-4 space-y-3"
      >
        <div className="text-xs font-bold text-[#E2A336]">আপনার দোয়ার আবেদন জানান:</div>
        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            placeholder="আপনার নাম (ঐচ্ছিক)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full bg-[#03221F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#90A8A3] focus:outline-none focus:border-[#E2A336]"
          />
          <textarea
            rows={2}
            placeholder="কী বিষয়ে উম্মাহর দোয়া চান তা লিখুন..."
            value={newDuaText}
            onChange={(e) => setNewDuaText(e.target.value)}
            className="w-full bg-[#03221F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#90A8A3] focus:outline-none focus:border-[#E2A336] resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#E2A336] hover:bg-yellow-400 text-[#03221F] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>দোয়ার আবেদন পাঠান</span>
          </button>
        </div>
      </form>

      {/* Dua Feed */}
      <div className="space-y-3">
        {duas.map((item) => (
          <div
            key={item.id}
            className="bg-[#09332E] border border-white/5 hover:border-[#E2A336]/30 rounded-2xl p-4 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#03221F] border border-[#E2A336]/30 text-[#E2A336] flex items-center justify-center font-bold text-xs">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.author}</h4>
                  <span className="text-[10px] text-[#90A8A3]">{item.location} • {item.timeAgo}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-200 leading-relaxed my-2">
              {item.text}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-[#90A8A3] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E2A336]" />
                {item.ameenCount} জন আমিন বলেছেন
              </span>

              <button
                onClick={() => handleAmeen(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                  item.hasAmeen
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-[#03221F] text-[#90A8A3] hover:text-white border border-white/5'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${item.hasAmeen ? 'fill-white' : ''}`} />
                <span>{item.hasAmeen ? 'আমিন বলা হয়েছে' : 'আমিন'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
