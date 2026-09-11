import React, { useState } from 'react';
import { X, Building2, Bell, Check, Clock, Volume2, Sparkles, ShieldCheck } from 'lucide-react';
import { JamaatTimes, PrayerDisplayInfo } from '../types';
import { playPrayerChime } from '../utils/audioAlert';

interface MosqueSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mosqueName: string;
  jamaatTimes: JamaatTimes;
  onSave: (name: string, times: JamaatTimes) => void;
  currentPrayers?: PrayerDisplayInfo[];
}

export const MosqueSettingsModal: React.FC<MosqueSettingsModalProps> = ({
  isOpen,
  onClose,
  mosqueName: initialMosqueName,
  jamaatTimes: initialJamaatTimes,
  onSave,
  currentPrayers = [],
}) => {
  const [name, setName] = useState(initialMosqueName);
  const [times, setTimes] = useState<JamaatTimes>({
    Fajr: initialJamaatTimes.Fajr || '',
    Dhuhr: initialJamaatTimes.Dhuhr || '',
    Asr: initialJamaatTimes.Asr || '',
    Maghrib: initialJamaatTimes.Maghrib || '',
    Isha: initialJamaatTimes.Isha || '',
  });
  const [notificationStatus, setNotificationStatus] = useState<string>(() => {
    if (typeof Notification !== 'undefined') {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTimeChange = (prayer: keyof JamaatTimes, value: string) => {
    setTimes((prev) => ({
      ...prev,
      [prayer]: value,
    }));
  };

  const handleRequestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
        if (perm === 'granted') {
          playPrayerChime();
          new Notification('🕌 নোটিফিকেশন সক্রিয় হয়েছে!', {
            body: 'জামাতের নির্ধারিত সময়ে আপনি স্বয়ংক্রিয় অ্যালার্ম পাবেন।',
            icon: '/icon.png',
          });
        }
      } catch (err) {
        console.warn('Notification permission error or denied', err);
      }
    }
  };

  const handleApplyPreset = (minutesAfterAdhan = 15) => {
    if (!currentPrayers || currentPrayers.length === 0) return;

    const findPrayerTime = (key: string) => {
      const p = currentPrayers.find((item) => item.key === key);
      return p ? p.adjustedTime24 : '';
    };

    const addMinutes = (timeStr: string, mins: number) => {
      if (!timeStr || !timeStr.includes(':')) return '';
      const [h, m] = timeStr.split(':').map(Number);
      const total = (h * 60 + m + mins) % (24 * 60);
      const rh = Math.floor(total / 60);
      const rm = total % 60;
      return `${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}`;
    };

    const fajrBase = findPrayerTime('sehri_end');
    const dhuhrBase = findPrayerTime('dhuhr');
    const asrBase = findPrayerTime('asr');
    const maghribBase = findPrayerTime('maghrib');
    const ishaBase = findPrayerTime('isha');

    setTimes({
      Fajr: fajrBase ? addMinutes(fajrBase, 25) : times.Fajr,
      Dhuhr: dhuhrBase ? addMinutes(dhuhrBase, 20) : times.Dhuhr,
      Asr: asrBase ? addMinutes(asrBase, 15) : times.Asr,
      Maghrib: maghribBase ? addMinutes(maghribBase, 7) : times.Maghrib,
      Isha: ishaBase ? addMinutes(ishaBase, 20) : times.Isha,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, times);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const prayerLabels: { key: keyof JamaatTimes; nameEn: string; nameBn: string; defaultHint: string }[] = [
    { key: 'Fajr', nameEn: 'Fajr', nameBn: 'ফজর', defaultHint: 'উদা: 05:15' },
    { key: 'Dhuhr', nameEn: 'Dhuhr', nameBn: 'যোহর', defaultHint: 'উদা: 01:30' },
    { key: 'Asr', nameEn: 'Asr', nameBn: 'আসর', defaultHint: 'উদা: 04:30' },
    { key: 'Maghrib', nameEn: 'Maghrib', nameBn: 'মাগরিব', defaultHint: 'উদা: 06:05 (আযানের ৫-৭ মি: পর)' },
    { key: 'Isha', nameEn: 'Isha', nameBn: 'এশা', defaultHint: 'উদা: 08:00' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-800/80 text-amber-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">মসজিদের জামাত ও অ্যালার্ম</h3>
              <p className="text-xs text-emerald-200/80">Local Mosque Jamaat Times &amp; Prayer Alert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Mosque Name Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <span>মসজিদের নাম (Mosque Name)</span>
              <span className="text-stone-400 font-normal text-[11px]">— অপশনাল</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: শিলচর বড় মসজিদ / স্থানীয় জামে মসজিদ"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder-stone-400 transition-all"
              />
            </div>
          </div>

          {/* Quick Preset Generator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>আজকের আযান থেকে জামাতের সময় স্বয়ংক্রিয় পূরণ করতে চান?</span>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset(15)}
              className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-[11px] transition-colors shrink-0 shadow-xs"
            >
              স্বয়ংক্রিয় পূরণ
            </button>
          </div>

          {/* Jamaat Times Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>প্রতিটি নামাজের জামাতের সময় (HH:MM ফরম্যাট)</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">24-hour (e.g. 13:30)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prayerLabels.map((p) => {
                const isConfigured = Boolean(times[p.key]);
                return (
                  <div
                    key={p.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isConfigured
                        ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200/50'
                        : 'bg-stone-50/60 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <span className="text-emerald-800">{p.nameBn}</span>
                        <span className="text-stone-400 font-normal">({p.nameEn})</span>
                      </span>
                      {isConfigured && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-950 font-medium">
                          সেট করা
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={times[p.key] || ''}
                        onChange={(e) => handleTimeChange(p.key, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-mono text-stone-900 bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Permission Card */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <Bell className="w-4 h-4 text-emerald-700" />
                <span>ব্রাউজার নোটিফিকেশন অ্যালার্ম</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  notificationStatus === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : notificationStatus === 'denied'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {notificationStatus === 'granted'
                  ? 'অনুমোদিত (Active)'
                  : notificationStatus === 'denied'
                  ? 'বন্ধ (Blocked)'
                  : 'অনুমতি প্রয়োজন'}
              </span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              প্রতি ৩০ সেকেন্ড পর পর সময় মিলিয়ে জামাতের সময়ে অটো অ্যালার্ম ও নোটিফিকেশন পাঠানো হবে।
            </p>
            {notificationStatus !== 'granted' && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="w-full py-1.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>নোটিফিকেশন পারমিশন সক্রিয় করুন</span>
              </button>
            )}
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>মসজিদ ও জামাতের সময় সফলভাবে সেভ হয়েছে!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
