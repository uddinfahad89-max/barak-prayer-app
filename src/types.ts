export type PrayerKey = 'sehri_end' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type AppLanguage = 'en' | 'ur' | 'bn';

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
  nameUr?: string;
  district: string;
  districtBn?: string;
  state: string;
  offset: number;
  description?: string;
  isCustom?: boolean;
  isBarakValley?: boolean;
  lat?: number;
  lon?: number;
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

export type UmrahCategory = 'economy' | 'deluxe' | 'vip' | 'ramadan';

export interface UmrahPackage {
  id: string;
  companyName: string;
  licenseNumber?: string;
  contactPhone: string;
  whatsappNumber: string;
  officeLocation: string;
  packageTitle: string;
  pricePerPerson: number; // in INR (₹)
  sharingType?: 'quad' | 'triple' | 'double' | 'any';
  category: UmrahCategory;
  durationDays: number;
  departureCity: string;
  departureMonthOrDate: string;
  makkahHotel: string;
  makkahDistanceMeters: number;
  madinahHotel: string;
  madinahDistanceMeters: number;
  inclusions: string[];
  description?: string;
  createdAt: number;
  isVerified?: boolean;
  isCustomSubmission?: boolean;
}

export interface ImamBiodata {
  id: string;
  fullName: string;
  title: string; // e.g., 'হাফেজ ও মাওলানা', 'মুফতী', 'কারী'
  age: number;
  maritalStatus: 'বিবাহিত' | 'অবিবাহিত';
  qualification: string; // e.g., 'দাওরায়ে হাদীস (টাইটেল) ও হিফজ'
  institution: string; // e.g., 'দারুল উলুম বাঁশকান্দি / দেওবন্দ'
  experienceYears: number;
  currentLocation: string; // e.g., 'সোনাই, কাছাড়'
  preferredLocation: string; // e.g., 'বরাক উপত্যকা / শিলচর'
  expectedSalary: number; // in INR (₹)
  skills: string[];
  facilitiesDemanded: string[];
  contactPhone: string;
  whatsappNumber: string;
  bioNotes: string;
  createdAt: number;
  isVerified?: boolean;
  isCustomSubmission?: boolean;
}

export interface MosqueVacancy {
  id: string;
  mosqueName: string;
  area: string; // e.g., 'তারাপুর, শিলচর'
  district: string; // e.g., 'কাছাড়, আসাম'
  position: string; // e.g., 'পেশ ইমাম ও খতীব'
  requiredQualification: string; // e.g., 'হাফেজ ও দাওরায়ে হাদিস'
  experienceRequired: string; // e.g., '২+ বছরের অভিজ্ঞতা'
  offeredSalary: number; // in INR (₹)
  facilitiesOffered: string[];
  responsibilities: string[];
  joiningDeadline: string; // e.g., 'অবিলম্বে'
  contactPerson: string; // e.g., 'হাজী নুরুল ইসলাম (সাধারণ সম্পাদক)'
  contactPhone: string;
  whatsappNumber: string;
  description?: string;
  createdAt: number;
  isCustomSubmission?: boolean;
}

