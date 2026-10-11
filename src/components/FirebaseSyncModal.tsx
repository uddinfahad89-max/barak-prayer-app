import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  CloudUpload,
  CloudDownload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  Calendar,
  MapPin,
  Building2,
  User,
  HeartHandshake,
  Plane,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  saveAllPrayerAppDataToFirebase,
  fetchAllDataFromFirebase,
  getLastSyncTime,
  SyncProgressItem,
  SyncResult,
} from '../utils/firebaseDataSync';
import { LocationOffsets, TimetableData, AppLanguage } from '../types';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationOffsets: LocationOffsets;
  timetable: TimetableData;
  mosqueName: string;
  jamaatTimes: Record<string, string>;
  playAzanOnJamaat: boolean;
  hijriAdjustment: number;
  lang?: AppLanguage;
  onApplyRemoteData?: (data: {
    timetable?: TimetableData;
    locationOffsets?: LocationOffsets;
    mosqueSettings?: {
      mosqueName: string;
      jamaatTimes: Record<string, string>;
      playAzanOnJamaat: boolean;
      hijriAdjustment: number;
    };
  }) => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  locationOffsets,
  timetable,
  mosqueName,
  jamaatTimes,
  playAzanOnJamaat,
  hijriAdjustment,
  lang = 'bn',
  onApplyRemoteData,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [progressItems, setProgressItems] = useState<SyncProgressItem[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTime());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLastSync(getLastSyncTime());
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAll = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSyncResult(null);

    try {
      const res = await saveAllPrayerAppDataToFirebase(
        {
          locationOffsets,
          timetable,
          mosqueName,
          jamaatTimes,
          playAzanOnJamaat,
          hijriAdjustment,
        },
        (updatedProgress) => {
          setProgressItems(updatedProgress);
        }
      );

      setIsSaving(false);
      setSyncResult(res);
      if (res.success) {
        setLastSync(res.timestamp);
      } else {
        setErrorMessage(res.error || 'Failed to save to Firebase');
      }
    } catch (err: unknown) {
      setIsSaving(false);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error during sync');
    }
  };

  const handleFetchAll = async () => {
    setIsFetching(true);
    setErrorMessage(null);

    try {
      const remoteData = await fetchAllDataFromFirebase();
      setIsFetching(false);
      if (onApplyRemoteData) {
        onApplyRemoteData(remoteData);
      }
      setSyncResult({
        success: true,
        timestamp: new Date().toISOString(),
        totalSyncedItems: (remoteData.timetable ? Object.keys(remoteData.timetable).length : 0),
        details: {
          imams: remoteData.imamsCount || 0,
          packages: remoteData.packagesCount || 0,
          matrimonials: remoteData.matrimonialsCount || 0,
        },
      });
    } catch (err: unknown) {
      setIsFetching(false);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to retrieve data from Firebase');
    }
  };

  const formatLastSync = (isoStr: string | null) => {
    if (!isoStr) return lang === 'bn' ? 'এখনো কোনো ডাটা সিঙ্ক করা হয়নি' : 'Not synced yet';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString(lang === 'bn' ? 'bn-BD' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b1e1b] border border-emerald-600/40 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#09332E] via-[#0d413b] to-[#09332E] px-6 py-4 border-b border-emerald-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Cloud className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {lang === 'bn' ? 'ফায়ারবেস ক্লাউড ডাটা সিঙ্ক' : 'Firebase Cloud Sync'}
                <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  classic-fashion-pos
                </span>
              </h2>
              <p className="text-xs text-emerald-200/80">
                {lang === 'bn'
                  ? 'প্রেয়ার্স অ্যাপের সকল ডাটা ক্লাউড ফায়ারস্টোরে সেভ ও ব্যাকআপ'
                  : 'Save & backup all prayer app datasets in Cloud Firestore'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Banner */}
          <div className="bg-[#062420] border border-emerald-800/60 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">
                  {lang === 'bn' ? 'সর্বশেষ ক্লাউড সিঙ্কের সময়:' : 'Last Cloud Sync:'}
                </div>
                <div className="text-sm font-semibold text-emerald-200">
                  {formatLastSync(lastSync)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'ক্লাউড সংযুক্ত' : 'Cloud Connected'}</span>
            </div>
          </div>

          {/* Success Message Alert */}
          {syncResult?.success && (
            <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-4 text-emerald-200 flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-emerald-300 text-sm mb-1">
                  {lang === 'bn'
                    ? 'আলহামদুলিল্লাহ! সকল ডাটা ফায়ারবেসে সফলভাবে সেভ হয়েছে!'
                    : 'Alhamdulillah! All data saved successfully to Firebase!'}
                </div>
                <div>
                  {lang === 'bn'
                    ? `মোট ${syncResult.totalSyncedItems}+ টি রেকর্ড Firebase Firestore ক্লাউডে সংরক্ষিত হয়েছে।`
                    : `Total ${syncResult.totalSyncedItems}+ records secured in Firebase Firestore.`}
                </div>
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-rose-950/70 border border-rose-500/50 rounded-xl p-4 text-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-rose-300 text-sm mb-1">
                  {lang === 'bn' ? 'সিঙ্ক করতে সমস্যা হয়েছে' : 'Sync Issue'}
                </div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Datasets to be saved */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>{lang === 'bn' ? 'ফায়ারবেসে সংরক্ষিত ডেটাসেটসমূহ' : 'Firebase Cloud Datasets'}</span>
              <span className="text-[11px] text-amber-300 font-normal">
                {lang === 'bn' ? 'সম্পূর্ণ ও স্বয়ংক্রিয়' : 'Full & Realtime'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'নামাজের সময়সূচী' : 'Prayer Timetable'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {Object.keys(timetable).length} {lang === 'bn' ? 'দিনের ডাটা' : 'days recorded'}
                  </div>
                </div>
              </div>

              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'বিধানসভা ও অফসেট' : 'Constituency Offsets'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {Object.keys(locationOffsets).length} {lang === 'bn' ? 'টি নির্বাচনী এলাকা' : 'constituencies'}
                  </div>
                </div>
              </div>

              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'মসজিদ ও জামাত' : 'Mosque & Jamaat'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {mosqueName || (lang === 'bn' ? 'শিলচর কেন্দ্রীয় জামে মসজিদ' : 'Central Mosque')}
                  </div>
                </div>
              </div>

              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'ইমাম বায়োডাটা ও খেদমত' : 'Imam Profiles'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'আলিম ও মুহাদ্দিস তালিকা' : 'Verified scholars'}
                  </div>
                </div>
              </div>

              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <Plane className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'উমরাহ ও হজ্ব প্যাকেজ' : 'Umrah Packages'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'লাইসেন্সধারী ট্রাভেল কাফেলা' : 'Travel Agencies'}
                  </div>
                </div>
              </div>

              <div className="bg-[#082a25] border border-emerald-800/40 p-3 rounded-xl flex items-center gap-3">
                <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-white">
                    {lang === 'bn' ? 'ইসলামিক পাত্র-পাত্রী' : 'Islamic Matrimony'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'অভিভাবকের যোগাযোগসহ' : 'Grooms & Brides'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress List when saving */}
          {isSaving && progressItems.length > 0 && (
            <div className="bg-[#071f1b] border border-amber-500/30 rounded-xl p-4 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  {lang === 'bn' ? 'ফায়ারবেসে ডাটা পাঠানো হচ্ছে...' : 'Saving data to Firebase...'}
                </span>
              </div>
              <div className="space-y-1.5">
                {progressItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-emerald-950 last:border-0">
                    <span className="text-slate-300">
                      {lang === 'bn' ? item.nameBn : item.nameEn}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      {item.status === 'saving' && (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> {lang === 'bn' ? 'সেভ হচ্ছে...' : 'Saving...'}
                        </span>
                      )}
                      {item.status === 'saved' && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {item.count ? `(${item.count})` : ''} {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="text-slate-500">{lang === 'bn' ? 'অপেক্ষারত' : 'Waiting'}</span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-rose-400">{lang === 'bn' ? 'ত্রুটি' : 'Error'}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#072420] border-t border-emerald-800/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleFetchAll}
            disabled={isSaving || isFetching}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-700/60 text-emerald-200 hover:text-white hover:bg-emerald-900/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <CloudDownload className="w-4 h-4 text-emerald-400" />
            )}
            <span>{lang === 'bn' ? 'ফায়ারবেস থেকে রিলোড' : 'Fetch from Cloud'}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-all"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
            <button
              id="btn-save-all-to-firebase"
              onClick={handleSaveAll}
              disabled={isSaving || isFetching}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 text-emerald-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'bn' ? 'সেভ হচ্ছে...' : 'Saving to Cloud...'}</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'ফায়ারবেসে সব ডাটা সেভ করুন' : 'Save All Data to Firebase'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
