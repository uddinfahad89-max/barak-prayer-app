import React, { useState } from 'react';
import {
  ISLAMIC_MONTHS,
  calculateHijriFromDate,
  generateHijriMonthDays,
  toBengaliNumerals,
  toArabicNumerals,
  HijriDayCell,
  SPECIAL_ISLAMIC_EVENTS,
  getTodayFormattedDate,
} from '../utils/hijriCalendar';
import {
  Moon,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Sliders,
  CheckCircle,
  Clock,
  Printer,
  Info,
  Star,
} from 'lucide-react';

interface ArabicCalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  hijriAdjustment: number;
  onAdjustmentChange: (adj: number) => void;
}

export const ArabicCalendarView: React.FC<ArabicCalendarViewProps> = ({
  selectedDate,
  onSelectDate,
  hijriAdjustment,
  onAdjustmentChange,
}) => {
  const currentHijri = calculateHijriFromDate(selectedDate, hijriAdjustment);

  const [activeHijriYear, setActiveHijriYear] = useState<number>(currentHijri.year);
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(currentHijri.monthIndex);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const monthMeta = ISLAMIC_MONTHS[activeMonthIndex];

  // Generate days for this Hijri month
  const monthDays: HijriDayCell[] = generateHijriMonthDays(
    activeHijriYear,
    activeMonthIndex,
    selectedDate,
    hijriAdjustment
  );

  const handlePrevMonth = () => {
    if (activeMonthIndex === 0) {
      setActiveMonthIndex(11);
      setActiveHijriYear((prev) => prev - 1);
    } else {
      setActiveMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonthIndex === 11) {
      setActiveMonthIndex(0);
      setActiveHijriYear((prev) => prev + 1);
    } else {
      setActiveMonthIndex((prev) => prev + 1);
    }
  };

  const handleJumpToCurrent = () => {
    const today = new Date();
    const h = calculateHijriFromDate(today, hijriAdjustment);
    setActiveHijriYear(h.year);
    setActiveMonthIndex(h.monthIndex);
    onSelectDate(today);
  };

  return (
    <div className="space-y-6">
      {/* Islamic Calendar Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/60">
        {/* Subtle decorative background motif */}
        <div className="absolute right-0 top-0 w-80 h-80 opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full text-emerald-200">
            <polygon points="100,10 120,70 185,70 135,110 155,175 100,135 45,175 65,110 15,70 80,70" />
          </svg>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                <Moon className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>আরবী / হিজরি ক্যালেন্ডার</span>
                <span className="text-sm font-serif text-amber-300 font-normal" dir="rtl">
                  التقويم الهجري
                </span>
              </h2>
              {monthMeta.isSacred && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  সম্মানিত মাস (الأشهر الحرم)
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-300/90 mt-1 flex flex-wrap items-center gap-2">
              <span>চাঁদের হিসাব ও ইসলামিক বিশেষ দিনসমূহ</span>
              <span className="text-emerald-500">•</span>
              <span className="text-amber-300 font-medium">আজ: {currentHijri.formattedBn}</span>
              <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.5 rounded text-emerald-300 font-mono border border-emerald-700/50">
                {getTodayFormattedDate(selectedDate)}
              </span>
            </p>
          </div>

          {/* Controls: Prev/Next Month, Moon Offset & Jump Today */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleJumpToCurrent}
              className="px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-medium transition-colors border border-emerald-700/80"
              title="বর্তমান তারিখে ফিরে যান"
            >
              আজকে যান
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                showSettings
                  ? 'bg-amber-500 text-stone-900 border-amber-400 font-bold'
                  : 'bg-emerald-950/80 text-emerald-200 border-emerald-800 hover:bg-emerald-800'
              }`}
              title="চাঁদ দেখার সামঞ্জস্য (Moon Sighting Adjustment)"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">চাঁদ সামঞ্জস্য</span>
              {hijriAdjustment !== 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-stone-950 font-bold">
                  {hijriAdjustment > 0 ? `+${hijriAdjustment}` : hijriAdjustment}
                </span>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-800 hover:bg-emerald-800 transition-colors"
              title="ক্যালেন্ডার প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Moon Adjustment Drawer */}
        {showSettings && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/90 border border-amber-500/40 text-stone-200 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-amber-300 block sm:inline">
                  🌙 চাঁদ দেখার সামঞ্জস্য (Local Moon Sighting):
                </span>{' '}
                <span>
                  বরাক উপত্যকা ও ভারতীয় উপমহাদেশে স্থানীয় চাঁদ দেখার তারতম্যের কারণে হিজরি তারিখ ১ বা ২ দিন আগে-পিছে হতে পারে।
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                {[-2, -1, 0, 1, 2].map((adj) => (
                  <button
                    key={adj}
                    onClick={() => onAdjustmentChange(adj)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      hijriAdjustment === adj
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
                    }`}
                  >
                    {adj === 0 ? 'স্বাভাবিক (০)' : adj > 0 ? `+${adj}` : adj}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Month Navigation & Spotlight Banner */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900/40 p-4 rounded-xl border border-emerald-800/60">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 transition-colors"
              title="পূর্ববর্তী হিজরি মাস"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {monthMeta.nameBn}
                </h3>
                <span className="text-xl sm:text-2xl font-serif text-amber-300" dir="rtl">
                  {monthMeta.nameAr}
                </span>
                <span className="text-sm font-semibold text-emerald-300 ml-1">
                  ({monthMeta.nameEn})
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {monthMeta.descriptionBn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Year Badge */}
            <div className="flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-lg border border-emerald-800">
              <span className="text-xs text-emerald-300">হিজরি সন:</span>
              <span className="text-base font-extrabold text-amber-300 font-mono">
                {toBengaliNumerals(activeHijriYear)} হিজরী ({activeHijriYear} AH)
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-800 transition-colors"
              title="পরবর্তী হিজরি মাস"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Month Selector Buttons */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {ISLAMIC_MONTHS.map((m) => (
            <button
              key={m.index}
              onClick={() => setActiveMonthIndex(m.index)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all flex items-center gap-1 ${
                activeMonthIndex === m.index
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/80 hover:text-white'
              }`}
            >
              <span>{m.nameBn}</span>
              {m.isSacred && <span className="text-[10px] text-amber-600">★</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Hijri Calendar Grid */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-stone-800 text-sm sm:text-base">
              {monthMeta.nameBn} {toBengaliNumerals(activeHijriYear)} হিজরী মাহিনা (দিনপঞ্জি)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>জুমুআহ (শুক্রবার)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>আইয়ামে বীজ (১৩, ১৪, ১৫ রোজা)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>বিশেষ দিবস</span>
            </span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-semibold text-stone-500">
          <div className="py-1.5 text-stone-700">রবি (Sun)</div>
          <div className="py-1.5 text-stone-700">সোম (Mon)</div>
          <div className="py-1.5 text-stone-700">মঙ্গল (Tue)</div>
          <div className="py-1.5 text-stone-700">বুধ (Wed)</div>
          <div className="py-1.5 text-stone-700">বৃহঃ (Thu)</div>
          <div className="py-1.5 text-emerald-800 font-bold bg-emerald-50 rounded">শুক্র (Fri)</div>
          <div className="py-1.5 text-stone-700">শনি (Sat)</div>
        </div>

        {/* Month Day Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* Pad empty cells for the first day's weekday */}
          {monthDays.length > 0 &&
            Array.from({ length: monthDays[0].gregorianDate.getDay() }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="min-h-[70px] sm:min-h-[85px] bg-stone-50/50 rounded-xl border border-dashed border-stone-200/60 opacity-40"
              />
            ))}

          {monthDays.map((cell) => {
            const isFriday = cell.gregorianDate.getDay() === 5;
            const isMondayOrThursday = cell.gregorianDate.getDay() === 1 || cell.gregorianDate.getDay() === 4;

            return (
              <div
                key={cell.hijriDay}
                onClick={() => onSelectDate(cell.gregorianDate)}
                className={`relative min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  cell.isSelectedDate
                    ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/50'
                    : cell.isToday
                    ? 'bg-amber-50 text-stone-900 border-amber-300 ring-1 ring-amber-400'
                    : isFriday
                    ? 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200 text-stone-800'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                }`}
              >
                {/* Top Row: Hijri Day Number & Arabic Numeral */}
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-base sm:text-xl font-extrabold leading-none ${
                        cell.isSelectedDate
                          ? 'text-amber-300'
                          : cell.isToday
                          ? 'text-amber-800'
                          : isFriday
                          ? 'text-emerald-800'
                          : 'text-stone-800'
                      }`}
                    >
                      {toBengaliNumerals(cell.hijriDay)}
                    </span>
                    <span
                      className={`text-xs font-serif opacity-75 hidden sm:inline ${
                        cell.isSelectedDate ? 'text-emerald-200' : 'text-stone-500'
                      }`}
                      dir="rtl"
                    >
                      {toArabicNumerals(cell.hijriDay)}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1">
                    {cell.isToday && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-stone-950">
                        আজ
                      </span>
                    )}
                    {cell.isAyyamAlBeed && !cell.isSelectedDate && (
                      <span
                        className="text-[9px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300"
                        title="আইয়ামে বীজ: সুন্নাত রোজা"
                      >
                        বীজ
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Special Events or Sunnah fasts */}
                {cell.specialEvent ? (
                  <div
                    className={`mt-1 text-[10px] leading-tight font-semibold px-1 py-0.5 rounded truncate ${
                      cell.isSelectedDate
                        ? 'bg-rose-500 text-white'
                        : cell.specialEvent.type === 'eid'
                        ? 'bg-emerald-600 text-white font-bold'
                        : cell.specialEvent.type === 'fasting'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                    title={cell.specialEvent.titleBn}
                  >
                    {cell.specialEvent.titleBn}
                  </div>
                ) : cell.isAyyamAlBeed ? (
                  <div
                    className={`text-[9px] truncate font-medium ${
                      cell.isSelectedDate ? 'text-amber-200' : 'text-amber-700'
                    }`}
                  >
                    আইয়ামে বীজ রোজা
                  </div>
                ) : isFriday ? (
                  <div
                    className={`text-[9px] font-semibold ${
                      cell.isSelectedDate ? 'text-emerald-200' : 'text-emerald-700'
                    }`}
                  >
                    জুমুআহ দিবস
                  </div>
                ) : isMondayOrThursday ? (
                  <div
                    className={`text-[9px] hidden sm:block opacity-60 ${
                      cell.isSelectedDate ? 'text-emerald-200' : 'text-stone-400'
                    }`}
                  >
                    সুন্নাত রোজা
                  </div>
                ) : null}

                {/* Bottom Row: Corresponding Gregorian Date */}
                <div
                  className={`mt-1 text-[10px] font-mono border-t pt-1 flex items-center justify-between ${
                    cell.isSelectedDate
                      ? 'border-emerald-700 text-emerald-200'
                      : 'border-stone-100 text-stone-500'
                  }`}
                >
                  <span>
                    {cell.gregorianDate.getDate()}{' '}
                    {cell.gregorianDate.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-[9px] opacity-80">{cell.dayOfWeekShortEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Islamic Events & Sunnah Fasting Guide for this Month */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ayyam al-Beed & Sunnah Fasting Information Card */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>আইয়ামে বীজ ও সুন্নাত রোজা (Sunnah Fasting)</span>
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            প্রতি হিজরি মাসের <strong>১৩, ১৪ ও ১৫ তারিখকে</strong> &lsquo;আইয়ামে বীজ&rsquo; (উজ্জ্বল দিনসমূহ) বলা হয়।
            রাসূলুল্লাহ (সা.) এই দিনগুলোতে নিয়মিত রোজা রাখতেন (নাসায়ী: ২৩৪৫)। এছাড়া প্রতি <strong>সোমবার ও বৃহস্পতিবার</strong> রোজা রাখাও বরকতময় সুন্নাত।
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-medium">
              ১৩ {monthMeta.nameBn}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-medium">
              ১৪ {monthMeta.nameBn}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-medium">
              ১৫ {monthMeta.nameBn}
            </span>
          </div>
        </div>

        {/* Significant Islamic Days in the Year */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
          <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-emerald-600" />
            <span>বছরের প্রধান প্রধান ইসলামিক দিনসমূহ</span>
          </h4>
          <div className="space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between items-center py-0.5 border-b border-stone-200/60">
              <span className="font-semibold text-stone-800">পবিত্র আশুরা (মুহররম ১০)</span>
              <span className="text-stone-500">বিশেষ রোজা</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-stone-200/60">
              <span className="font-semibold text-stone-800">পবিত্র শবে বরাত (শাবান ১৫)</span>
              <span className="text-stone-500">ইবাদতের রজনী</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-stone-200/60">
              <span className="font-semibold text-stone-800">পবিত্র মাহে রমজান (রমজান ১-৩০)</span>
              <span className="text-stone-500">ফরজ সিয়াম</span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-stone-200/60">
              <span className="font-semibold text-stone-800">পবিত্র ঈদুল ফিতর (শাওয়াল ১)</span>
              <span className="text-stone-500">রমজানের আনন্দ</span>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-stone-800">পবিত্র ঈদুল আজহা ও হজ্জ (জ্বিলহজ্জ ১০)</span>
              <span className="text-stone-500">কোরবানি ও হজ্জ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
