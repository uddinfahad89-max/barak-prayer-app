/**
 * Comprehensive Hijri (Arabic / Islamic) Calendar Utility
 * Supports lunar calculations, moon-sighting adjustments, Bengali & Arabic transliterations,
 * and key Islamic events (Ashura, Ramadan, Eid, Ayyam al-Beed, etc.).
 */

export interface HijriDate {
  day: number;
  monthIndex: number; // 0 to 11
  monthNameEn: string;
  monthNameAr: string;
  monthNameBn: string;
  year: number;
  formattedEn: string;
  formattedAr: string;
  formattedBn: string;
  specialEvent?: string;
  isAyyamAlBeed?: boolean;
}

export interface IslamicMonthInfo {
  index: number; // 0 to 11
  nameEn: string;
  nameAr: string;
  nameBn: string;
  descriptionBn: string;
  isSacred: boolean; // 4 sacred months in Islam (Muharram, Rajab, Dhu al-Qi'dah, Dhu al-Hijjah)
}

export const ISLAMIC_MONTHS: IslamicMonthInfo[] = [
  {
    index: 0,
    nameEn: 'Muharram',
    nameAr: 'مُحَرَّم',
    nameBn: 'মুহররম',
    descriptionBn: 'হিজরি বর্ষের প্রথম ও অন্যতম সম্মানিত (হারাম) মাস। এ মাসে আশুরার রোজা রয়েছে।',
    isSacred: true,
  },
  {
    index: 1,
    nameEn: 'Safar',
    nameAr: 'صَفَر',
    nameBn: 'সফর',
    descriptionBn: 'হিজরি বর্ষের দ্বিতীয় মাস।',
    isSacred: false,
  },
  {
    index: 2,
    nameEn: "Rabi' al-Awwal",
    nameAr: 'رَبِيع الأَوَّل',
    nameBn: 'রবিউল আউয়াল',
    descriptionBn: 'হিজরি বর্ষের তৃতীয় মাস; প্রিয় নবীজি (সা.)-এর পবিত্র জন্ম ও ওফাতের মাস।',
    isSacred: false,
  },
  {
    index: 3,
    nameEn: "Rabi' al-Thani",
    nameAr: 'رَبِيع الآخِر',
    nameBn: 'রবিউস সানি',
    descriptionBn: 'হিজরি বর্ষের চতুর্থ মাস।',
    isSacred: false,
  },
  {
    index: 4,
    nameEn: 'Jumada al-Ula',
    nameAr: 'جُمَادَى الأُولَى',
    nameBn: 'জমাদিউল আউয়াল',
    descriptionBn: 'হিজরি বর্ষের পঞ্চম মাস।',
    isSacred: false,
  },
  {
    index: 5,
    nameEn: 'Jumada al-Akhirah',
    nameAr: 'جُمَادَى الآخِرَة',
    nameBn: 'জমাদিউস সানি',
    descriptionBn: 'হিজরি বর্ষের ষষ্ঠ মাস।',
    isSacred: false,
  },
  {
    index: 6,
    nameEn: 'Rajab',
    nameAr: 'رَجَب',
    nameBn: 'রজব',
    descriptionBn: 'চারটি সম্মানিত (হারাম) মাসের অন্যতম। এ মাসে পবিত্র মেরাজ সংঘটিত হয়েছিল।',
    isSacred: true,
  },
  {
    index: 7,
    nameEn: "Sha'ban",
    nameAr: 'شَعْبَان',
    nameBn: 'শাবান',
    descriptionBn: 'রমজানের প্রস্তুতি ও ইবাদতের বরকতময় মাস। এ মাসে শবে বরাত রয়েছে।',
    isSacred: false,
  },
  {
    index: 8,
    nameEn: 'Ramadan',
    nameAr: 'رَمَضَان',
    nameBn: 'রমজান',
    descriptionBn: 'কোরআন নাযিলের পবিত্র মাস; সিয়াম সাধনা ও রহমত-মাগফিরাত-নাজাতের মাস।',
    isSacred: false,
  },
  {
    index: 9,
    nameEn: 'Shawwal',
    nameAr: 'شَوَّال',
    nameBn: 'শাওয়াল',
    descriptionBn: '১ম দিন ঈদুল ফিতর এবং এ মাসে ছয় রোজার বিশেষ ফজিলত রয়েছে।',
    isSacred: false,
  },
  {
    index: 10,
    nameEn: "Dhu al-Qa'dah",
    nameAr: 'ذُو القَعْدَة',
    nameBn: 'জ্বিলকদ',
    descriptionBn: 'চারটি সম্মানিত মাসের একটি এবং হজের প্রথম প্রস্তুতি মাস।',
    isSacred: true,
  },
  {
    index: 11,
    nameEn: 'Dhu al-Hijjah',
    nameAr: 'ذُو الحِجَّة',
    nameBn: 'জ্বিলহজ্জ',
    descriptionBn: 'পবিত্র হজ্জ ও ঈদুল আজহার মাস। প্রথম ১০ দিনের ইবাদতের অতুলনীয় মর্যাদা রয়েছে।',
    isSacred: true,
  },
];

// Special events key: "monthIndex-day" (e.g. "0-10" = 10 Muharram)
export const SPECIAL_ISLAMIC_EVENTS: Record<string, { titleBn: string; titleEn: string; type: 'eid' | 'fasting' | 'blessed' }> = {
  '0-1': { titleBn: 'পবিত্র হিজরি নববর্ষ', titleEn: 'Islamic New Year', type: 'blessed' },
  '0-9': { titleBn: 'তাসুআ (আশুরার পূর্ব রোজা)', titleEn: 'Tasu’a Fast', type: 'fasting' },
  '0-10': { titleBn: 'পবিত্র আশুরা (বিশেষ রোজা)', titleEn: 'Day of Ashura', type: 'fasting' },
  '2-12': { titleBn: 'ঈদে মিলাদুন্নবী (সা.)', titleEn: 'Mawlid an-Nabi', type: 'blessed' },
  '6-27': { titleBn: 'পবিত্র শবে মেরাজ', titleEn: 'Laylat al-Miraj', type: 'blessed' },
  '7-15': { titleBn: 'পবিত্র শবে বরাত', titleEn: 'Shab-e-Barat (Laylat al-Bara’at)', type: 'blessed' },
  '8-1': { titleBn: 'পবিত্র মাহে রমজান শুরু', titleEn: 'First Day of Ramadan', type: 'fasting' },
  '8-17': { titleBn: 'ঐতিহাসিক বদর দিবস', titleEn: 'Battle of Badr', type: 'blessed' },
  '8-21': { titleBn: 'লাইলাতুল কদর অন্বেষণ', titleEn: 'Odd Nights of Qadr', type: 'blessed' },
  '8-23': { titleBn: 'লাইলাতুল কদর অন্বেষণ', titleEn: 'Odd Nights of Qadr', type: 'blessed' },
  '8-25': { titleBn: 'লাইলাতুল কদর অন্বেষণ', titleEn: 'Odd Nights of Qadr', type: 'blessed' },
  '8-27': { titleBn: 'পবিত্র লাইলাতুল কদর (সম্ভাব্য)', titleEn: 'Laylat al-Qadr', type: 'blessed' },
  '8-29': { titleBn: 'লাইলাতুল কদর অন্বেষণ', titleEn: 'Odd Nights of Qadr', type: 'blessed' },
  '9-1': { titleBn: 'পবিত্র ঈদুল ফিতর', titleEn: 'Eid al-Fitr', type: 'eid' },
  '9-2': { titleBn: 'শাওয়ালের ৬ রোজা শুরু', titleEn: 'Six Fasts of Shawwal', type: 'fasting' },
  '10-1': { titleBn: 'হজের মাসসমূহ', titleEn: 'Months of Hajj', type: 'blessed' },
  '11-1': { titleBn: 'জ্বিলহজ্জের প্রথম দশক শুরু', titleEn: 'First 10 Days of Dhul Hijjah', type: 'blessed' },
  '11-8': { titleBn: 'ইয়াওমুত তারবিয়া (হজের সূচনা)', titleEn: 'Day of Tarwiyah', type: 'blessed' },
  '11-9': { titleBn: 'ইয়াওমে আরাফাহ (আরাফাহর রোজা)', titleEn: 'Day of Arafah', type: 'fasting' },
  '11-10': { titleBn: 'পবিত্র ঈদুল আজহা (কোরবানি)', titleEn: 'Eid al-Adha', type: 'eid' },
  '11-11': { titleBn: 'আইয়ামে তাশরিক (১ম দিন)', titleEn: 'Ayyam at-Tashreeq 1', type: 'blessed' },
  '11-12': { titleBn: 'আইয়ামে তাশরিক (২য় দিন)', titleEn: 'Ayyam at-Tashreeq 2', type: 'blessed' },
  '11-13': { titleBn: 'আইয়ামে তাশরিক (৩য় দিন)', titleEn: 'Ayyam at-Tashreeq 3', type: 'blessed' },
};

/**
 * Converts English digits to Bengali numerals
 */
export function toBengaliNumerals(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

/**
 * Converts English digits to Eastern Arabic numerals
 */
export function toArabicNumerals(num: number | string): string {
  const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (digit) => arDigits[parseInt(digit, 10)]);
}

/**
 * আজকের সঠিক ইংরেজি তারিখ (দিন-মাস) যেমন: 11-09
 */
export function getTodayFormattedDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}`;
}

/**
 * সঠিক হিজরি (আরবি) তারিখ পাওয়ার নিয়ম
 */
export function getDynamicHijriDate(date: Date = new Date(), adjustmentDays: number = 0): string {
  const h = calculateHijriFromDate(date, adjustmentDays);
  return h.formattedBn;
}

/**
 * Astronomical Julian Day calculation
 */
function getJulianDay(date: Date): number {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate() + (date.getHours() - 12) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

/**
 * Kuwaiti / Umm al-Qura standard algorithm for converting Julian Day to Hijri date.
 * Allows adjustment offset (usually 0, -1, or +1 day depending on local moon sighting).
 */
export function calculateHijriFromDate(date: Date, adjustmentDays: number = 0): HijriDate {
  // Apply adjustment (e.g. +1 or -1 day for subcontinent lunar sighting)
  const adjustedDate = new Date(date.getTime() + adjustmentDays * 24 * 60 * 60 * 1000);

  // Try standard Intl if available for Islamic calendar
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    const parts = formatter.formatToParts(adjustedDate);
    let hDay = 1;
    let hMonth = 1;
    let hYear = 1448;

    for (const part of parts) {
      if (part.type === 'day') hDay = parseInt(part.value, 10);
      if (part.type === 'month') hMonth = parseInt(part.value, 10);
      if (part.type === 'year') hYear = parseInt(part.value, 10);
    }

    const monthIndex = (hMonth - 1 + 12) % 12;
    const monthMeta = ISLAMIC_MONTHS[monthIndex];

    const eventKey = `${monthIndex}-${hDay}`;
    const specialEvent = SPECIAL_ISLAMIC_EVENTS[eventKey]?.titleBn;
    const isAyyamAlBeed = hDay >= 13 && hDay <= 15;

    // সঠিক ও পরিচ্ছন্ন হিজরি বাংলা তারিখ
    const cleanHijriBn = `${toBengaliNumerals(hDay)} ${monthMeta.nameBn} ${toBengaliNumerals(hYear)} হিজরী`;

    return {
      day: hDay,
      monthIndex,
      monthNameEn: monthMeta.nameEn,
      monthNameAr: monthMeta.nameAr,
      monthNameBn: monthMeta.nameBn,
      year: hYear,
      formattedEn: `${hDay} ${monthMeta.nameEn} ${hYear} AH`,
      formattedAr: `${toArabicNumerals(hDay)} ${monthMeta.nameAr} ${toArabicNumerals(hYear)} هـ`,
      formattedBn: cleanHijriBn,
      specialEvent,
      isAyyamAlBeed,
    };
  } catch {
    // Mathematical algorithm fallback
    const jd = Math.floor(getJulianDay(adjustedDate)) + 0.5;
    const l = Math.floor(jd - 1948440) + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
      Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 =
      l2 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    const m = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * m) / 24);
    const year = 30 * n + j - 30;
    const monthIndex = (m - 1 + 12) % 12;
    const monthMeta = ISLAMIC_MONTHS[monthIndex];

    const eventKey = `${monthIndex}-${day}`;
    const specialEvent = SPECIAL_ISLAMIC_EVENTS[eventKey]?.titleBn;
    const isAyyamAlBeed = day >= 13 && day <= 15;

    return {
      day,
      monthIndex,
      monthNameEn: monthMeta.nameEn,
      monthNameAr: monthMeta.nameAr,
      monthNameBn: monthMeta.nameBn,
      year,
      formattedEn: `${day} ${monthMeta.nameEn} ${year} AH`,
      formattedAr: `${toArabicNumerals(day)} ${monthMeta.nameAr} ${toArabicNumerals(year)} هـ`,
      formattedBn: `${toBengaliNumerals(day)} ${monthMeta.nameBn} ${toBengaliNumerals(year)} হিজরী`,
      specialEvent,
      isAyyamAlBeed,
    };
  }
}

/**
 * Generate all 29 or 30 days of a specific Hijri month and year
 */
export interface HijriDayCell {
  hijriDay: number;
  hijriMonthIndex: number;
  hijriYear: number;
  gregorianDate: Date;
  dayOfWeekBn: string;
  dayOfWeekShortEn: string;
  specialEvent?: { titleBn: string; titleEn: string; type: 'eid' | 'fasting' | 'blessed' };
  isAyyamAlBeed: boolean;
  isToday: boolean;
  isSelectedDate: boolean;
}

const WEEKDAYS_BN = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function generateHijriMonthDays(
  targetHijriYear: number,
  targetHijriMonthIndex: number,
  selectedDate: Date,
  adjustmentDays: number = 0
): HijriDayCell[] {
  const today = new Date();
  const currentHijri = calculateHijriFromDate(selectedDate, adjustmentDays);

  // Offset difference in lunar months (~29.53059 days)
  const monthDiff =
    (targetHijriYear - currentHijri.year) * 12 + (targetHijriMonthIndex - currentHijri.monthIndex);
  
  // Calculate approximate Day 1 anchor
  const curMonthDay1Time = selectedDate.getTime() - (currentHijri.day - 1) * 24 * 60 * 60 * 1000;
  const approxDay1Time = curMonthDay1Time + monthDiff * 29.53059 * 24 * 60 * 60 * 1000;

  // Search around approxDay1Time to find exact Day 1
  let startGregorian: Date | null = null;

  for (let offset = -15; offset <= 15; offset++) {
    const testDate = new Date(approxDay1Time + offset * 24 * 60 * 60 * 1000);
    const h = calculateHijriFromDate(testDate, adjustmentDays);
    if (h.year === targetHijriYear && h.monthIndex === targetHijriMonthIndex && h.day === 1) {
      startGregorian = testDate;
      break;
    }
  }

  // Wider search fallback if needed
  if (!startGregorian) {
    for (let offset = -45; offset <= 45; offset++) {
      const testDate = new Date(approxDay1Time + offset * 24 * 60 * 60 * 1000);
      const h = calculateHijriFromDate(testDate, adjustmentDays);
      if (h.year === targetHijriYear && h.monthIndex === targetHijriMonthIndex && h.day === 1) {
        startGregorian = testDate;
        break;
      }
    }
  }

  if (!startGregorian) {
    startGregorian = new Date(approxDay1Time);
  }

  const cells: HijriDayCell[] = [];

  for (let d = 0; d < 32; d++) {
    const currDate = new Date(
      startGregorian.getFullYear(),
      startGregorian.getMonth(),
      startGregorian.getDate() + d,
      12,
      0,
      0
    );
    const h = calculateHijriFromDate(currDate, adjustmentDays);

    // Stop when rolled into next month
    if (h.monthIndex !== targetHijriMonthIndex) {
      break;
    }

    const eventKey = `${h.monthIndex}-${h.day}`;
    const specialEvent = SPECIAL_ISLAMIC_EVENTS[eventKey];
    const isToday =
      currDate.getFullYear() === today.getFullYear() &&
      currDate.getMonth() === today.getMonth() &&
      currDate.getDate() === today.getDate();
    const isSelected =
      currDate.getFullYear() === selectedDate.getFullYear() &&
      currDate.getMonth() === selectedDate.getMonth() &&
      currDate.getDate() === selectedDate.getDate();

    cells.push({
      hijriDay: h.day,
      hijriMonthIndex: h.monthIndex,
      hijriYear: h.year,
      gregorianDate: currDate,
      dayOfWeekBn: WEEKDAYS_BN[currDate.getDay()],
      dayOfWeekShortEn: WEEKDAYS_EN[currDate.getDay()],
      specialEvent,
      isAyyamAlBeed: h.day >= 13 && h.day <= 15,
      isToday,
      isSelectedDate: isSelected,
    });
  }

  return cells;
}
