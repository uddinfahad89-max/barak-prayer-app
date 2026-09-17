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
  maritalStatusEn?: string;
  qualification: string; // e.g., 'দাওরায়ে হাদীস (টাইটেল) ও হিফজ'
  qualificationEn?: string;
  institution: string; // e.g., 'দারুল উলুম বাঁশকান্দি / দেওবন্দ'
  institutionEn?: string;
  experienceYears: number;
  currentLocation: string; // e.g., 'সোনাই, কাছাড়'
  currentLocationEn?: string;
  preferredLocation: string; // e.g., 'বরাক উপত্যকা / শিলচর'
  preferredLocationEn?: string;
  expectedSalary: number; // in INR (₹)
  skills: string[];
  skillsEn?: string[];
  facilitiesDemanded: string[];
  facilitiesDemandedEn?: string[];
  contactPhone: string;
  whatsappNumber: string;
  bioNotes: string;
  bioNotesEn?: string;
  fullNameEn?: string;
  titleEn?: string;
  createdAt: number;
  isVerified?: boolean;
  isCustomSubmission?: boolean;
}

export interface MosqueVacancy {
  id: string;
  mosqueName: string;
  mosqueNameEn?: string;
  area: string; // e.g., 'তারাপুর, শিলচর'
  areaEn?: string;
  district: string; // e.g., 'কাছাড়, আসাম'
  districtEn?: string;
  position: string; // e.g., 'পেশ ইমাম ও খতীব'
  positionEn?: string;
  requiredQualification: string; // e.g., 'হাফেজ ও দাওরায়ে হাদিস'
  requiredQualificationEn?: string;
  experienceRequired: string; // e.g., '২+ বছরের অভিজ্ঞতা'
  experienceRequiredEn?: string;
  offeredSalary: number; // in INR (₹)
  facilitiesOffered: string[];
  facilitiesOfferedEn?: string[];
  responsibilities: string[];
  responsibilitiesEn?: string[];
  joiningDeadline: string; // e.g., 'অবিলম্বে'
  joiningDeadlineEn?: string;
  contactPerson: string; // e.g., 'হাজী নুরুল ইসলাম (সাধারণ সম্পাদক)'
  contactPersonEn?: string;
  contactPhone: string;
  whatsappNumber: string;
  description?: string;
  descriptionEn?: string;
  createdAt: number;
  isCustomSubmission?: boolean;
}

export interface MatrimonyBiodata {
  id: string;
  type: 'groom' | 'bride'; // পাত্র (Groom) নাকি পাত্রী (Bride)
  codeName: string; // e.g., 'B-101' বা নাম
  codeNameEn?: string;
  codeNameUr?: string;
  fullName: string;
  fullNameEn?: string;
  fullNameUr?: string;
  age: number;
  height: string; // e.g., "5' 8\"", "5' 2\""
  complexion: string; // e.g., 'ফর্সা', 'উজ্জ্বল শ্যামলা'
  complexionEn?: string;
  complexionUr?: string;
  maritalStatus: 'অবিবাহিত' | 'ডিভোর্সড' | 'বিধবা' | 'বিপত্নীক';
  maritalStatusEn?: string;
  maritalStatusUr?: string;
  education: string; // e.g., 'বি.এসসি কম্পিউটার সায়েন্স' / 'ফাযিল ও আলেমা'
  educationEn?: string;
  educationUr?: string;
  profession: string; // e.g., 'সরকারি শিক্ষক', 'সফটওয়্যার ইঞ্জিনিয়ার', 'মাদ্রাসা শিক্ষিকা', 'গৃহিণী'
  professionEn?: string;
  professionUr?: string;
  monthlyIncome?: string; // e.g., '₹৪৫,০০০ / মাস'
  monthlyIncomeEn?: string;
  monthlyIncomeUr?: string;
  religiousPractices: string[]; // e.g., '৫ ওয়াক্ত নামাজি', 'সুন্নতি দাড়ি', 'সম্পূর্ণ পর্দনশীন (নিকাব)'
  religiousPracticesEn?: string[];
  religiousPracticesUr?: string[];
  fatherOccupation: string;
  fatherOccupationEn?: string;
  fatherOccupationUr?: string;
  district: string; // e.g., 'কাছাড়', 'করিমগঞ্জ', 'হাইলাকান্দি'
  districtEn?: string;
  districtUr?: string;
  area: string; // e.g., 'শিলচর শহর', 'বদরপুর'
  areaEn?: string;
  areaUr?: string;
  familyType: string; // e.g., 'দ্বীনদার সুন্নি পরিবার'
  familyTypeEn?: string;
  familyTypeUr?: string;
  partnerExpectations: string; // প্রত্যাশিত জীবনসঙ্গীর গুণাবলী
  partnerExpectationsEn?: string;
  partnerExpectationsUr?: string;
  guardianRelation: string; // e.g., 'পিতা', 'অভিভাবক (বড় ভাই)'
  guardianRelationEn?: string;
  guardianRelationUr?: string;
  guardianPhone: string;
  whatsappNumber: string;
  bioNotes: string;
  bioNotesEn?: string;
  bioNotesUr?: string;
  createdAt: number;
  isVerified?: boolean;
  isCustomSubmission?: boolean;
}


