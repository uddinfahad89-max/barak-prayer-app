import React from 'react';
import { ShieldCheck, AlertTriangle, Smartphone, CheckCircle2, Download, X, HelpCircle } from 'lucide-react';

interface InstallHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa?: () => void;
  canInstallPwa?: boolean;
}

export const InstallHelpModal: React.FC<InstallHelpModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  canInstallPwa,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center border border-emerald-700">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">অ্যাপ ডাউনলোড ও নিরাপত্তা নির্দেশিকা</h3>
              <p className="text-xs text-emerald-300/80">"Risky App / Android:Evo-gen" সমাধানের সহজ উপায়</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-700 text-sm">
          {/* Quick Explanation */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-amber-900 text-xs sm:text-sm">
                কেন "Risky App (Android:Evo-gen)" লেখা আসে?
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                এটি কোনো ক্ষতিকারক সফটওয়্যার বা ভাইরাস নয়। গুগল প্লে স্টোরের বাইরে থেকে যখন কোনো নতুন বা টেস্ট APK ডাউনলোড করা হয়, তখন ফোনের অ্যান্টিভাইরাস (Xiaomi, Oppo, Vivo, Avast) অপরিচিত ফাইল পেয়ে স্বয়ংক্রিয়ভাবে সতর্কতামূলকভাবে <strong>"Evo-gen" (Generic Heuristic)</strong> ট্যাগ দেয়।
              </p>
            </div>
          </div>

          {/* Solution 1 */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
            <div className="flex items-start gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ১
              </span>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Add to allowlist (অনুমতি দিন)</h5>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  আপনার ফোনের স্ক্রিনে যখন সতর্কবার্তা আসবে, সেখানে নিচে থাকা <strong>"Add to allowlist"</strong> (হোয়াইটলিস্টে যোগ করুন) অপশনে ক্লিক করুন। তাহলে ফোন এটিকে নিরাপদ হিসেবে গ্রহণ করবে এবং স্বাভাবিকভাবে চলবে।
                </p>
              </div>
            </div>
          </div>

          {/* Solution 2 - Recommended PWA */}
          <div className="border border-emerald-300 rounded-xl p-4 bg-emerald-50/70">
            <div className="flex items-start gap-2.5 mb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                ২
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-emerald-950 text-sm">সবচেয়ে সেরা উপায়: ব্রাউজার থেকে সরাসরি ইনস্টল</h5>
                  <span className="bg-emerald-700 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">প্রস্তাবিত</span>
                </div>
                <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                  কোনো ঝুঁকিপূর্ণ APK ফাইল ছাড়াই সরাসরি গুগল ক্রোম (Google Chrome) ব্রাউজার দিয়ে অ্যাপটি ১ ক্লিকে আপনার ফোনে ইনস্টল করতে পারেন:
                </p>
              </div>
            </div>

            <ol className="list-decimal list-inside space-y-1.5 text-xs text-emerald-950 ml-2 mt-2 bg-white/80 p-3 rounded-lg border border-emerald-200">
              <li>মোবাইল ব্রাউজারে ডানদিকের উপরে <strong>তিনটি ডট (⋮)</strong> বাটনে চাপুন।</li>
              <li>মেনু থেকে <strong>"Add to Home screen"</strong> অথবা <strong>"Install app" (অ্যাপ ইনস্টল করুন)</strong> চাপুন।</li>
              <li>অ্যাপটি আপনার ফোনের হোম স্ক্রিনে অফিশিয়াল অ্যাপের মতো তৈরি হয়ে যাবে এবং অফলাইনেও চলবে!</li>
            </ol>

            {canInstallPwa && onInstallPwa && (
              <button
                onClick={() => {
                  onInstallPwa();
                  onClose();
                }}
                className="mt-3 w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Smartphone className="w-4 h-4 text-amber-300" />
                এখনই ১-ক্লিকে ফোনে ইনস্টল করুন (PWA)
              </button>
            )}
          </div>

          {/* Security Guarantee */}
          <div className="flex items-center gap-2 text-xs text-stone-500 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>এই অ্যাপ্লিকেশনে কোনো বিজ্ঞাপন, ক্ষতিকারক কোড বা অননুমোদিত ডেটা কালেকশন নেই।</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg transition-colors"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
