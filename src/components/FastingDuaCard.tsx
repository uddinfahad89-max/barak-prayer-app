import React, { useState } from 'react';
import { BookOpen, Copy, Check, HeartHandshake } from 'lucide-react';
import { DUAS } from '../data/defaultData';

export const FastingDuaCard: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sehri Niyyah */}
      <div className="bg-emerald-900/10 border border-emerald-900/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              {DUAS.sehri.title}
            </span>
            <button
              onClick={() =>
                handleCopy(`${DUAS.sehri.arabic}\n\n${DUAS.sehri.transliteration}\n\n${DUAS.sehri.translation}`, 'sehri')
              }
              className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors"
              title="Copy Dua"
            >
              {copiedKey === 'sehri' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-right my-3">
            <p className="text-xl sm:text-2xl font-serif text-emerald-950 leading-relaxed" dir="rtl">
              {DUAS.sehri.arabic}
            </p>
          </div>

          <p className="text-xs italic text-emerald-900 font-medium mt-2">
            "{DUAS.sehri.transliteration}"
          </p>
        </div>

        <p className="text-xs text-stone-600 border-t border-emerald-900/10 pt-3 mt-3">
          {DUAS.sehri.translation}
        </p>
      </div>

      {/* Iftar Dua */}
      <div className="bg-amber-900/10 border border-amber-900/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-700" />
              {DUAS.iftar.title}
            </span>
            <button
              onClick={() =>
                handleCopy(`${DUAS.iftar.arabic}\n\n${DUAS.iftar.transliteration}\n\n${DUAS.iftar.translation}`, 'iftar')
              }
              className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-800 transition-colors"
              title="Copy Dua"
            >
              {copiedKey === 'iftar' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-right my-3">
            <p className="text-xl sm:text-2xl font-serif text-amber-950 leading-relaxed" dir="rtl">
              {DUAS.iftar.arabic}
            </p>
          </div>

          <p className="text-xs italic text-amber-950 font-medium mt-2">
            "{DUAS.iftar.transliteration}"
          </p>
        </div>

        <p className="text-xs text-stone-600 border-t border-amber-900/10 pt-3 mt-3">
          {DUAS.iftar.translation}
        </p>
      </div>
    </div>
  );
};
