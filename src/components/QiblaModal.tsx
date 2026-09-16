import React, { useState, useEffect } from 'react';
import { Compass, X, Navigation, MapPin, CheckCircle2 } from 'lucide-react';
import { calculateQiblaBearing, calculateDistanceToMakkah } from '../utils/geoDetect';
import { AppLanguage } from '../types';

interface QiblaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLat?: number | null;
  userLon?: number | null;
  userCity?: string;
  lang?: AppLanguage;
}

export const QiblaModal: React.FC<QiblaModalProps> = ({
  isOpen,
  onClose,
  userLat,
  userLon,
  userCity,
  lang = 'en',
}) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSupport, setHasCompassSupport] = useState<boolean>(false);

  // Default coordinates to Silchar / Barak Valley if user GPS not provided
  const lat = userLat || 24.8333;
  const lon = userLon || 92.7789;

  const qiblaAngle = calculateQiblaBearing(lat, lon);
  const distanceKm = calculateDistanceToMakkah(lat, lon);

  // Device orientation listener for physical mobile devices
  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOrientation = (e: any) => {
      let compassHeading: number | null = null;
      if (e.webkitCompassHeading !== undefined) {
        // iOS
        compassHeading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / standard
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null) {
        setDeviceHeading(Math.round(compassHeading));
        setHasCompassSupport(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // The needle should point towards (qiblaAngle - deviceHeading)
  const needleRotation = (qiblaAngle - deviceHeading + 360) % 360;
  const isAligned = Math.abs(needleRotation) < 5 || Math.abs(needleRotation - 360) < 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E2A336]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-6 h-6 text-[#E2A336]" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            {lang === 'ur' ? 'قبلہ کمپاس' : lang === 'bn' ? 'ক্বিবলা কম্পাস (Qibla)' : 'Qibla Direction Compass'}
          </h2>
        </div>
        <p className="text-xs text-[#90A8A3] mb-6 text-center">
          {lang === 'ur' ? 'مکہ مکرمہ، خانہ کعبہ کی سمت کی درست رہنمائی' : lang === 'bn' ? 'পবিত্র কাবা শরীফ (মক্কা মুকাররমা)-এর সঠিক দিকনির্দেশনা' : 'Accurate direction towards the Holy Kaaba in Makkah'}
        </p>

        {/* Compass Dial */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#0C3E37] shadow-inner flex items-center justify-center">
            {/* Degree ticks */}
            <div className="absolute inset-2 rounded-full border border-white/10" />
            <div className="absolute inset-4 rounded-full border border-dashed border-[#E2A336]/20" />

            {/* Cardinal Marks */}
            <span className="absolute top-2 text-xs font-bold text-[#E2A336]">N (0°)</span>
            <span className="absolute right-2 text-xs font-semibold text-[#90A8A3]">E (90°)</span>
            <span className="absolute bottom-2 text-xs font-semibold text-[#90A8A3]">S (180°)</span>
            <span className="absolute left-2 text-xs font-semibold text-[#90A8A3]">W (270°)</span>
          </div>

          {/* Rotating Dial / Needle */}
          <div
            className="w-48 h-48 relative flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${needleRotation}deg)` }}
          >
            {/* Kaaba Direction Indicator */}
            <div className="absolute -top-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-[#E2A336] text-[#03221F] font-bold text-xs flex items-center justify-center shadow-lg border border-yellow-200 animate-pulse">
                🕋
              </div>
              <div className="w-0.5 h-16 bg-gradient-to-b from-[#E2A336] to-transparent" />
            </div>

            {/* Center Pivot */}
            <div className="w-12 h-12 rounded-full bg-[#03221F] border-2 border-[#E2A336] flex items-center justify-center shadow-md z-10">
              <Navigation className="w-6 h-6 text-[#E2A336]" />
            </div>

            {/* South Indicator */}
            <div className="absolute -bottom-1 flex flex-col items-center">
              <div className="w-0.5 h-12 bg-gradient-to-t from-red-500/60 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-red-400" />
            </div>
          </div>
        </div>

        {/* Alignment Status */}
        <div className="mt-4 flex items-center gap-2">
          {isAligned ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'ur' ? 'آپ بالکل درست سمتِ قبلہ پر ہیں!' : lang === 'bn' ? 'আপনি ক্বিবলার সঠিক অভিমুখে আছেন!' : 'You are directly facing the Holy Qibla!'}
              </span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white/5 text-[#90A8A3] text-xs">
              {lang === 'ur' ? 'درست سمت کے لیے فون گھمائیں' : lang === 'bn' ? 'মোবাইল ঘুরিয়ে তীরচিহ্ন সোজা করুন' : 'Rotate phone until arrow aligns with Kaaba'}
            </div>
          )}
        </div>

        {/* Angle and Details Info Cards */}
        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          <div className="bg-[#03221F] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-[11px] text-[#90A8A3] block mb-0.5">
              {lang === 'ur' ? 'زاویۂ قبلہ' : lang === 'bn' ? 'ক্বিবলার কোণ' : 'Qibla Bearing'}
            </span>
            <span className="text-xl font-extrabold text-[#E2A336]">{qiblaAngle}°</span>
            <span className="text-[10px] text-[#90A8A3] block mt-0.5">
              {lang === 'ur' ? 'شمال تا مغرب-جنوب' : lang === 'bn' ? 'উত্তর থেকে পশ্চিম-দক্ষিণ' : 'North to West-South'}
            </span>
          </div>

          <div className="bg-[#03221F] p-3 rounded-xl border border-white/5 text-center">
            <span className="text-[11px] text-[#90A8A3] block mb-0.5">
              {lang === 'ur' ? 'مکہ کا فاصلہ' : lang === 'bn' ? 'মক্কার দূরত্ব' : 'Distance to Makkah'}
            </span>
            <span className="text-xl font-extrabold text-white">
              {lang === 'bn' ? distanceKm.toLocaleString('bn-BD') : distanceKm.toLocaleString('en-US')}
            </span>
            <span className="text-[10px] text-[#90A8A3] block mt-0.5">
              {lang === 'ur' ? 'کلومیٹر' : lang === 'bn' ? 'কিলোমিটার' : 'km'}
            </span>
          </div>
        </div>

        {/* Location Footer Note */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#90A8A3]">
          <MapPin className="w-3.5 h-3.5 text-[#E2A336]" />
          <span>
            {lang === 'ur' ? 'مقام: ' : lang === 'bn' ? 'আপনার বর্তমান স্থান: ' : 'Your location: '}
            <strong className="text-white">{userCity || (lang === 'ur' ? 'موجودہ مقام' : lang === 'bn' ? 'শনাক্তকৃত অবস্থান' : 'Detected location')}</strong>
          </span>
        </div>

        {!hasCompassSupport && (
          <p className="text-[10px] text-amber-300/70 mt-2 text-center">
            *মোবাইল ডিভাইসে কম্পাস সেন্সর সক্রিয় থাকলে সুঁই স্বয়ংক্রিয়ভাবে দিক পরিবর্তন করবে।
          </p>
        )}
      </div>
    </div>
  );
};
