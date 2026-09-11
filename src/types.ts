export type PrayerKey = 'sehri_end' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimetableItem {
  sehri_end: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type TimetableData = Record<string, PrayerTimetableItem>;

export type LocationOffsets = Record<string, number>;

export interface LocationMeta {
  id: string;
  name: string;
  nameBn?: string;
  district: string;
  districtBn?: string;
  state: string;
  offset: number;
  description?: string;
  isCustom?: boolean;
}

export interface ConstituencyItem {
  id: string;
  name_bn: string;
  name_en?: string;
  offset_minutes: number;
}

export interface DistrictItem {
  district_bn: string;
  district_en: string;
  constituencies: ConstituencyItem[];
}

export interface JamaatTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface PrayerDisplayInfo {
  key: PrayerKey;
  label: string;
  arabicName: string;
  baseTime: string; // Original base time for Silchar
  adjustedTime: string; // After offset applied
  adjustedTime24: string; // 24-hour string (HH:MM)
  adjustedMinutes: number; // Minutes from midnight (0-1439)
  isNext: boolean;
  isCurrent: boolean;
  isSpecialFasting?: boolean; // Sehri end or Maghrib (Iftar)
}
