import { PrayerKey, PrayerTimetableItem, PrayerDisplayInfo } from '../types';
import { PRAYER_METADATA } from '../data/defaultData';

/**
 * Converts HH:MM string to total minutes from midnight.
 * Recognizes that Asr, Maghrib, Isha expressed as "03:05", "04:44", "06:02" are PM (12h).
 */
export function parseTimeToMinutes(timeStr: string, prayerKey: PrayerKey): number {
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  let hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);

  // If already > 12, it's 24-hour format
  if (hour < 12) {
    if (prayerKey === 'asr' || prayerKey === 'maghrib' || prayerKey === 'isha') {
      hour += 12;
    } else if (prayerKey === 'dhuhr' && hour < 10) {
      // In case Dhuhr is written as 01:15 PM instead of 11:22 AM
      hour += 12;
    }
  }

  return (hour * 60 + minute + 1440) % 1440;
}

/**
 * Formats minutes from midnight to HH:mm (24-hour)
 */
export function minutesTo24H(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Formats minutes from midnight to hh:mm AM/PM (12-hour)
 */
export function minutesTo12H(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  let hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
}

/**
 * Applies location offset (in minutes) to a base prayer time.
 */
export function applyOffset(baseTimeStr: string, prayerKey: PrayerKey, offsetMinutes: number): {
  minutes: number;
  time12: string;
  time24: string;
} {
  const baseMinutes = parseTimeToMinutes(baseTimeStr, prayerKey);
  const adjustedMinutes = (baseMinutes + offsetMinutes + 1440) % 1440;
  return {
    minutes: adjustedMinutes,
    time12: minutesTo12H(adjustedMinutes),
    time24: minutesTo24H(adjustedMinutes),
  };
}

/**
 * Solar calculation for Silchar (Lat: 24.833, Long: 92.779, Timezone: 5.5)
 * Used as high-accuracy astronomical fallback for dates not in explicit timetable.
 */
export function calculateAstronomicalTimes(date: Date, asrSchool: 'hanafi' | 'shafii' = 'hanafi'): PrayerTimetableItem {
  const lat = 24.8333 * (Math.PI / 180);
  const lng = 92.7789;
  const tz = 5.5; // Indian Standard Time (IST)

  // Day of year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Solar declination & Equation of Time (Fourier approximation)
  const b = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b); // in minutes
  const declination = 23.45 * Math.sin(b) * (Math.PI / 180); // in radians

  // Solar Noon (transit) in hours
  // Standard meridian for IST is 82.5° E
  const timeCorrection = (82.5 - lng) * 4; // minutes difference from IST meridian
  const solarNoonMinutes = 12 * 60 + timeCorrection - eot;

  // Hour angle calculation helper
  const getHourAngle = (angleDeg: number) => {
    const angleRad = angleDeg * (Math.PI / 180);
    const cosHA = (Math.sin(angleRad) - Math.sin(lat) * Math.sin(declination)) / (Math.cos(lat) * Math.cos(declination));
    if (cosHA > 1 || cosHA < -1) return null;
    return Math.acos(cosHA) * (180 / Math.PI); // in degrees
  };

  // Sunrise / Sunset: sun center is -0.833°
  const haSun = getHourAngle(-0.833) || 90;
  const sunMinutes = haSun * 4; // 1 degree = 4 minutes

  // Fajr: angle is -18°
  const haFajr = getHourAngle(-18) || 105;
  const fajrMinutes = haFajr * 4;

  // Isha: angle is -18° (or -17.5°)
  const haIsha = getHourAngle(-17.5) || 105;
  const ishaMinutes = haIsha * 4;

  // Asr: shadow length
  const noonSunAltitude = Math.asin(Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination));
  const factor = asrSchool === 'hanafi' ? 2 : 1;
  const asrSunAltitude = Math.atan(1 / (factor + Math.tan(Math.abs(lat - declination))));
  const haAsr = getHourAngle(asrSunAltitude * (180 / Math.PI)) || 45;
  const asrMinutes = haAsr * 4;

  // Calculate times
  const sehriEndMin = Math.round(solarNoonMinutes - fajrMinutes);
  const sunriseMin = Math.round(solarNoonMinutes - sunMinutes);
  const dhuhrMin = Math.round(solarNoonMinutes);
  const asrMin = Math.round(solarNoonMinutes + asrMinutes);
  const maghribMin = Math.round(solarNoonMinutes + sunMinutes);
  const ishaMin = Math.round(solarNoonMinutes + ishaMinutes);

  return {
    sehri_end: minutesTo24H(sehriEndMin),
    sunrise: minutesTo24H(sunriseMin),
    dhuhr: minutesTo24H(dhuhrMin),
    asr: minutesTo24H(asrMin),
    maghrib: minutesTo24H(maghribMin),
    isha: minutesTo24H(ishaMin),
  };
}

/**
 * Formats a Date object into "MM-DD" format.
 */
export function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * Resolves prayer times for a specific date:
 * checks timetable overrides first, then falls back to astronomical calculation.
 */
export function getBasePrayerTimesForDate(
  date: Date,
  timetable: Record<string, PrayerTimetableItem>,
  asrSchool: 'hanafi' | 'shafii' = 'hanafi'
): PrayerTimetableItem {
  const key = formatDateKey(date);
  if (timetable[key]) {
    return timetable[key];
  }
  return calculateAstronomicalTimes(date, asrSchool);
}

/**
 * Computes all prayer display infos with offset, active state, and next prayer state.
 */
export function computeDayPrayerTimes(
  baseItem: PrayerTimetableItem,
  offsetMinutes: number,
  currentMinutesNow: number,
  use24Hour: boolean
): {
  prayers: PrayerDisplayInfo[];
  nextPrayer: PrayerDisplayInfo;
  currentPrayer: PrayerDisplayInfo | null;
  minutesToNext: number;
} {
  const prayers: PrayerDisplayInfo[] = PRAYER_METADATA.map((meta) => {
    const baseTime = baseItem[meta.key];
    const offsetRes = applyOffset(baseTime, meta.key, offsetMinutes);
    return {
      key: meta.key,
      label: meta.label,
      arabicName: meta.arabicName,
      baseTime,
      adjustedTime: use24Hour ? offsetRes.time24 : offsetRes.time12,
      adjustedTime24: offsetRes.time24,
      adjustedMinutes: offsetRes.minutes,
      isNext: false,
      isCurrent: false,
      isSpecialFasting: meta.isSpecialFasting,
    };
  });

  // Sort prayers by adjusted minutes to determine order
  const sorted = [...prayers].sort((a, b) => a.adjustedMinutes - b.adjustedMinutes);

  // Find next upcoming prayer today
  let next = sorted.find((p) => p.adjustedMinutes > currentMinutesNow);
  let minutesToNext = 0;

  if (next) {
    minutesToNext = next.adjustedMinutes - currentMinutesNow;
  } else {
    // If all prayers today have passed, next is tomorrow's first prayer (Sehri End)
    next = sorted[0];
    minutesToNext = (1440 - currentMinutesNow) + next.adjustedMinutes;
  }

  // Find current prayer window
  let currentPrayer: PrayerDisplayInfo | null = null;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].adjustedMinutes <= currentMinutesNow) {
      currentPrayer = sorted[i];
      break;
    }
  }

  // Mark flags in original prayer order
  prayers.forEach((p) => {
    p.isNext = p.key === next!.key;
    p.isCurrent = currentPrayer ? p.key === currentPrayer.key : false;
  });

  return {
    prayers,
    nextPrayer: next,
    currentPrayer,
    minutesToNext,
  };
}
