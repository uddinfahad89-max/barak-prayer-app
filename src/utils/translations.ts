import { AppLanguage, PrayerKey } from '../types';

export interface Translations {
  // Navigation
  home: string;
  prayers: string;
  quran: string;
  ummah: string;
  matrimony: string;

  // Header & Profile
  language: string;
  coins: string;
  notifications: string;
  giftClaimed: string;
  dailyStreak: string;
  premiumEnds: string;

  // Main Card
  next: string;
  sunriseAt: string;
  viewAllPrayers: string;
  detectLocation: string;
  detectingLocation: string;
  locationUpdated: string;
  remaining: string;
  hours: string;
  minutes: string;
  now: string;

  // Features
  features: string;
  qibla: string;
  duas: string;
  tasbih: string;
  inspiration: string;
  journal: string;
  mosque: string;
  imamPortal: string;
  imamPortalSubtitle: string;

  // Campaign & For You
  forYou: string;
  dailySadaqah: string;
  dailySadaqahSubtitle: string;
  hifzTracker: string;
  hifzSubtitle: string;
  jummahSadaqah: string;
  jummahSubtitle: string;
  donateNow: string;

  // Prayers List
  sehri_end: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;

  // Subtitles
  fajrSub: string;
  sunriseSub: string;
  dhuhrSub: string;
  asrSub: string;
  maghribSub: string;
  ishaSub: string;

  // Districts
  cachar: string;
  hailakandi: string;
  karimganj: string;
  allDistricts: string;

  // Settings & Actions
  settings: string;
  selectLocation: string;
  soundOn: string;
  soundOff: string;
  adhanAlarm: string;
  jamaatSettings: string;
  close: string;
  save: string;
  copied: string;
  copy: string;

  // Matrimony & Imam portal
  matrimonyPortalTitle: string;
  matrimonyPortalSubtitle: string;
  subtabMatrimony: string;
  subtabMosques: string;
  subtabImams: string;
  subtabMatrimonyDesc: string;
  subtabMosquesDesc: string;
  subtabImamsDesc: string;
  postMatrimonyBtn: string;
  postMosqueBtn: string;
  postImamBtn: string;
  searchMatrimonyPlaceholder: string;
  searchMosquesPlaceholder: string;
  searchImamsPlaceholder: string;
  filterAll: string;
  filterGroom: string;
  filterBride: string;
  filterAllDistricts: string;
  sortNewest: string;
  sortSalaryHigh: string;
  sortSalaryLow: string;
  newBadge: string;
  noDataFound: string;
  resetFilter: string;
  experienceAge: string;
  years: string;
  age: string;
  salaryHonorarium: string;
  contactWhatsApp: string;
  callDirect: string;
  viewDetails: string;

  // Umrah & Ummah
  umrahPortalTitle: string;
  umrahPortalSubtitle: string;
  umrahTab: string;
  duaWallTab: string;
  addUmrahPackage: string;

  // General & GPS
  changeLocation: string;
  detectedGps: string;
  detectedIp: string;
  barakValleyText: string;
  googleMethodText: string;
  createdBy: string;
  saveAndAlarm: string;
  stopAlarm: string;
  nowPlayingAzan: string;
  upcomingNext: string;
  inTime: string;
  silcharBase: string;
  arabicCalendar: string;
  installGuide: string;
  prayerTimetableTitle: string;
  barakConstituenciesSub: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    home: 'Home',
    prayers: 'Prayers',
    quran: 'Quran',
    ummah: 'Umrah',
    matrimony: 'Imam & Nikah',

    language: 'Language',
    coins: 'Coins',
    notifications: 'Notifications',
    giftClaimed: 'Daily Gift Claimed!',
    dailyStreak: 'Daily Streak',
    premiumEnds: 'Premium ends in 71 hours',

    next: 'Next',
    sunriseAt: 'Sunrise at',
    viewAllPrayers: 'View all prayer times',
    detectLocation: 'Detect Location',
    detectingLocation: 'Detecting GPS location...',
    locationUpdated: 'Location updated',
    remaining: 'remaining',
    hours: 'h',
    minutes: 'm',
    now: 'Now',

    features: 'Features',
    qibla: 'Qibla',
    duas: 'Duas',
    tasbih: 'Tasbih',
    inspiration: 'Inspiration',
    journal: 'Journal',
    mosque: 'Mosque',
    imamPortal: 'Imam Portal',
    imamPortalSubtitle: 'Imam Biodatas & Mosque Vacancies',

    forYou: 'For You',
    dailySadaqah: 'Daily Sadaqah & Charity',
    dailySadaqahSubtitle: 'Feed the hungry and support the needy',
    hifzTracker: 'Surah Memorization',
    hifzSubtitle: 'Track your daily Quran reading and revision',
    jummahSadaqah: 'Jummah Sadaqah',
    jummahSubtitle: 'Gain immense blessings with blessed Friday charity',
    donateNow: 'Donate Now',

    sehri_end: 'Sehri Ends / Fajr',
    sunrise: 'Sunrise (Ishraq)',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib (Iftar)',
    isha: 'Isha',

    fajrSub: 'Dawn prayer & start of fast',
    sunriseSub: 'Fajr ends, Ishraq begins',
    dhuhrSub: 'Midday prayer after Zawal',
    asrSub: 'Late afternoon prayer',
    maghribSub: 'Sunset prayer & Iftar fast break',
    ishaSub: 'Night prayer',

    cachar: 'Cachar',
    hailakandi: 'Hailakandi',
    karimganj: 'Karimganj',
    allDistricts: 'All Districts',

    settings: 'Settings',
    selectLocation: 'Select Constituency',
    soundOn: 'Adhan On',
    soundOff: 'Mute',
    adhanAlarm: 'Adhan Alarm',
    jamaatSettings: 'Mosque Jamaat Times',
    close: 'Close',
    save: 'Save',
    copied: 'Copied!',
    copy: 'Copy',

    matrimonyPortalTitle: 'Imam, Mosque & Matrimony Portal',
    matrimonyPortalSubtitle: 'Mosque vacancies, Imam biodatas & Shariah-compliant groom/bride matchmaking',
    subtabMatrimony: 'Matrimonial Profiles',
    subtabMosques: 'Mosque Vacancies',
    subtabImams: 'Imam Biodatas',
    subtabMatrimonyDesc: 'Shariah-compliant groom & bride profiles',
    subtabMosquesDesc: 'Job openings for Imams, Muazzins & Khateebs',
    subtabImamsDesc: 'Qualified Hafiz, Qari & Islamic scholars seeking positions',
    postMatrimonyBtn: '+ Submit Biodata',
    postMosqueBtn: '+ Post Mosque Vacancy',
    postImamBtn: '+ Submit Imam Biodata',
    searchMatrimonyPlaceholder: 'Search by name, occupation, education, area...',
    searchMosquesPlaceholder: 'Search by mosque name, area, post...',
    searchImamsPlaceholder: 'Search by Imam name, qualification, location...',
    filterAll: 'All',
    filterGroom: '🤵 Groom',
    filterBride: '👰 Bride',
    filterAllDistricts: 'All Areas / Districts',
    sortNewest: 'Newest First',
    sortSalaryHigh: 'Honorarium (High to Low)',
    sortSalaryLow: 'Honorarium (Low to High)',
    newBadge: 'NEW',
    noDataFound: 'No matching records found',
    resetFilter: 'Reset Filters',
    experienceAge: 'Experience & Age',
    years: 'years',
    age: 'Age',
    salaryHonorarium: 'Honorarium / Salary',
    contactWhatsApp: 'WhatsApp',
    callDirect: 'Call',
    viewDetails: 'View Details',

    umrahPortalTitle: 'Umrah Packages & Ummah Community',
    umrahPortalSubtitle: 'Direct booking with trusted Umrah travel agencies',
    umrahTab: 'Umrah Packages',
    duaWallTab: 'Ummah Dua Wall',
    addUmrahPackage: '+ Add Agency Package',

    changeLocation: 'Change Location',
    detectedGps: 'GPS Detected',
    detectedIp: 'Approx. Location',
    barakValleyText: 'Barak Valley',
    googleMethodText: 'Google Method',
    createdBy: 'Created by:',
    saveAndAlarm: 'Save & Set Alarm',
    stopAlarm: 'Stop',
    nowPlayingAzan: 'Adhan is playing...',
    upcomingNext: 'Upcoming Next',
    inTime: 'In',
    silcharBase: 'Silchar base',
    arabicCalendar: 'Hijri Calendar',
    installGuide: 'Install App',
    prayerTimetableTitle: 'Prayer & Fasting Timetable',
    barakConstituenciesSub: 'Barak Valley Constituencies: Cachar, Hailakandi & Karimganj (16 Constituencies)',
  },

  ur: {
    home: 'ہوم',
    prayers: 'نمازیں',
    quran: 'قرآن',
    ummah: 'عمرہ',
    matrimony: 'امام و نکاح',

    language: 'زبان',
    coins: 'سکے',
    notifications: 'اطلاعات',
    giftClaimed: 'روزانہ تحفہ موصول ہوا!',
    dailyStreak: 'مسلسل حاضری',
    premiumEnds: 'پریمیم 71 گھنٹوں میں ختم ہوگا',

    next: 'اگلی نماز',
    sunriseAt: 'طلوع آفتاب بوقت',
    viewAllPrayers: 'نماز کے تمام اوقات دیکھیں',
    detectLocation: 'مقام تلاش کریں',
    detectingLocation: 'جی پی ایس سے مقام معلوم کیا جا رہا ہے...',
    locationUpdated: 'مقام اپ ڈیٹ ہو گیا',
    remaining: 'باقی',
    hours: 'گھنٹے',
    minutes: 'منٹ',
    now: 'ابھی',

    features: 'خصوصیات',
    qibla: 'قبلہ',
    duas: 'دعائیں',
    tasbih: 'تسبیح',
    inspiration: 'ہدایت و حکمت',
    journal: 'روزنامچہ',
    mosque: 'مسجد',
    imamPortal: 'امام پورٹل',
    imamPortalSubtitle: 'ائمہ کرام کا بائیو ڈیٹا اور مسجد کی بھرتی',

    forYou: 'آپ کے لیے',
    dailySadaqah: 'روزانہ کا صدقہ و خیرات',
    dailySadaqahSubtitle: 'یتیموں، مسکینوں اور ضرورت مندوں کی امداد',
    hifzTracker: 'حفظ و تلاوت قرآن',
    hifzSubtitle: 'روزانہ تلاوت اور سورتوں کا جائزہ',
    jummahSadaqah: 'جمعہ کا صدقہ',
    jummahSubtitle: 'مبارک جمعہ پر غریبوں کی مدد اور اجر',
    donateNow: 'تعاون کریں',

    sehri_end: 'اختتام سحری / فجر',
    sunrise: 'طلوع آفتاب (اشراق)',
    dhuhr: 'ظہر',
    asr: 'عصر',
    maghrib: 'مغرب (افطار)',
    isha: 'عشاء',

    fajrSub: 'صبح کی نماز اور روزے کا آغاز',
    sunriseSub: 'فجر کا وقت ختم، اشراق شروع',
    dhuhrSub: 'زوال آفتاب کے بعد دوپہر کی نماز',
    asrSub: 'تیسرے پہر کی نماز',
    maghribSub: 'غروب آفتاب اور افطار کا وقت',
    ishaSub: 'رات کی نماز',

    cachar: 'کاچار',
    hailakandi: 'ہائلا کانڈی',
    karimganj: 'کریم گنج',
    allDistricts: 'تمام اضلاع',

    settings: 'ترتیبات',
    selectLocation: 'حلقہ منتخب کریں',
    soundOn: 'اذان جاری',
    soundOff: 'خاموش',
    adhanAlarm: 'اذان الارم',
    jamaatSettings: 'مسجد کے جماعت کے اوقات',
    close: 'بند کریں',
    save: 'محفوظ کریں',
    copied: 'کاپی ہو گیا!',
    copy: 'کاپی',

    matrimonyPortalTitle: 'امام، مسجد اور نکاح پورٹل',
    matrimonyPortalSubtitle: 'مسجد کی بھرتی، ائمہ کا بائیو ڈیٹا اور شرعی رشتے',
    subtabMatrimony: 'شرعی رشتے',
    subtabMosques: 'مسجد کی بھرتی',
    subtabImams: 'ائمہ بائیو ڈیٹا',
    subtabMatrimonyDesc: 'دیندار لڑکے اور لڑکیوں کے شرعی کوائف',
    subtabMosquesDesc: 'ائمہ کرام، مؤذنین اور خطباء کے لیے ملازمتیں',
    subtabImamsDesc: 'تجربہ کار حفاظ، قراء اور علمائے کرام کے کوائف',
    postMatrimonyBtn: '+ بائیو ڈیٹا شامل کریں',
    postMosqueBtn: '+ مسجد کا اشتہار دیں',
    postImamBtn: '+ امام بائیو ڈیٹا جمع کریں',
    searchMatrimonyPlaceholder: 'نام، پیشہ، تعلیم یا علاقے سے تلاش کریں...',
    searchMosquesPlaceholder: 'مسجد کے نام، علاقے یا عہدے سے تلاش کریں...',
    searchImamsPlaceholder: 'نام، قابلیت یا علاقے سے تلاش کریں...',
    filterAll: 'سب',
    filterGroom: '🤵 لڑکا',
    filterBride: '👰 لڑکی',
    filterAllDistricts: 'تمام اضلاع',
    sortNewest: 'تازہ ترین',
    sortSalaryHigh: 'مشاہرہ (زیادہ سے کم)',
    sortSalaryLow: 'مشاہرہ (کم سے زیادہ)',
    newBadge: 'نیا',
    noDataFound: 'کوئی ڈیٹا نہیں ملا',
    resetFilter: 'فلٹر ختم کریں',
    experienceAge: 'تجربہ اور عمر',
    years: 'سال',
    age: 'عمر',
    salaryHonorarium: 'ماہانہ مشاہرہ',
    contactWhatsApp: 'واٹس ایپ',
    callDirect: 'کال کریں',
    viewDetails: 'تفصیل دیکھیں',

    umrahPortalTitle: 'عمرہ پیکیجز اور امت پلیٹ فارم',
    umrahPortalSubtitle: 'معتبر ٹریول ایجنسیوں سے براہ راست رابطہ اور بکنگ',
    umrahTab: 'عمرہ پیکیجز',
    duaWallTab: 'دعائیہ دیوار',
    addUmrahPackage: '+ پیکیج شامل کریں',

    changeLocation: 'مقام تبدیل کریں',
    detectedGps: 'جی پی ایس سے معلوم شدہ',
    detectedIp: 'اندازاً مقام',
    barakValleyText: 'براک ویلی',
    googleMethodText: 'گوگل طریقہ',
    createdBy: 'تیار کردہ:',
    saveAndAlarm: 'محفوظ کریں اور الارم آن کریں',
    stopAlarm: 'روکیں',
    nowPlayingAzan: 'اذان جاری ہے...',
    upcomingNext: 'اگلی نماز',
    inTime: 'باقی',
    silcharBase: 'سلچر بنیادی وقت',
    arabicCalendar: 'ہجری کیلنڈر',
    installGuide: 'ایپ انسٹال کریں',
    prayerTimetableTitle: 'نماز و روزے کے اوقات',
    barakConstituenciesSub: 'براک ویلی کے حلقے: کاچار، ہائلا کانڈی اور کریم گنج (16 حلقے)',
  },

  bn: {
    home: 'হোম',
    prayers: 'নামাজ',
    quran: 'কুরআন',
    ummah: 'উমরাহ',
    matrimony: 'ইমাম ও নিকাহ',

    language: 'ভাষা',
    coins: 'কয়েন',
    notifications: 'বিজ্ঞপ্তি',
    giftClaimed: 'দৈনিক উপহার গ্রহণ করা হয়েছে!',
    dailyStreak: 'দৈনিক ধারা',
    premiumEnds: 'প্রিমিয়াম শেষ হতে ৭১ ঘণ্টা বাকি',

    next: 'পরবর্তী',
    sunriseAt: 'সূর্যোদয়',
    viewAllPrayers: 'সকল নামাজের সময়সূচি',
    detectLocation: 'লোকেশন সনাক্ত করুন',
    detectingLocation: 'জিপিএস দিয়ে লোকেশন খোঁজা হচ্ছে...',
    locationUpdated: 'লোকেশন আপডেট হয়েছে',
    remaining: 'বাকি',
    hours: 'ঘণ্টা',
    minutes: 'মিনিট',
    now: 'এখন',

    features: 'ফিচার্স',
    qibla: 'কিবলা',
    duas: 'দোয়া',
    tasbih: 'তসবীহ',
    inspiration: 'অনুপ্রেরণা',
    journal: 'জার্নাল',
    mosque: 'মসজিদ',
    imamPortal: 'ইমাম নিযুক্তি',
    imamPortalSubtitle: 'ইমাম সাহেবের বায়োডাটা ও মসজিদ কমিটির নিয়োগ',

    forYou: 'আপনার জন্য',
    dailySadaqah: 'দৈনিক দান ও সদকা',
    dailySadaqahSubtitle: 'অসহায় ও অভাবী মানুষের সহায়তা তহবিল',
    hifzTracker: 'হিফজ ও তিলাওয়াত',
    hifzSubtitle: 'দৈনিক কুরআন পাঠ ও মুখস্থ পর্যবেক্ষণ',
    jummahSadaqah: 'জুমার সদকা',
    jummahSubtitle: 'পবিত্র জুমার দিনে বরকতময় দান',
    donateNow: 'দান করুন',

    sehri_end: 'সেহরি শেষ / ফজর',
    sunrise: 'সূর্যোদয় (ইশরাক)',
    dhuhr: 'যোহর',
    asr: 'আসর',
    maghrib: 'মাগরিব (ইফতার)',
    isha: 'এশা',

    fajrSub: 'ভোরের সালাত ও রোজা শুরু',
    sunriseSub: 'ফজর শেষ, ইশরাক শুরু',
    dhuhrSub: 'দ্বিপ্রহরের সালাত',
    asrSub: 'বিকেলের সালাত',
    maghribSub: 'সূর্যাস্ত ও ইফতারের সময়',
    ishaSub: 'রাত্রিকালীন সালাত',

    cachar: 'ক্যাছাড়',
    hailakandi: 'হাইলাকান্দি',
    karimganj: 'করিমগঞ্জ',
    allDistricts: 'সকল জেলা',

    settings: 'সেটিংস',
    selectLocation: 'এলাকা নির্বাচন করুন',
    soundOn: 'আযান চালু',
    soundOff: 'মিউট',
    adhanAlarm: 'আযান এলার্ম',
    jamaatSettings: 'মসজিদের জামাত সময়',
    close: 'বন্ধ করুন',
    save: 'সংরক্ষণ করুন',
    copied: 'কপি হয়েছে!',
    copy: 'কপি',

    matrimonyPortalTitle: 'ইমাম, মসজিদ ও দ্বীনি পাত্র-পাত্রী পোর্টাল',
    matrimonyPortalSubtitle: 'মসজিদের নিয়োগ, ইমামদের বায়োডাটা ও দ্বীনি পাত্র-পাত্রীর খোঁজ',
    subtabMatrimony: 'দ্বীনি পাত্র-পাত্রী',
    subtabMosques: 'মসজিদ নিয়োগ',
    subtabImams: 'ইমাম বায়োডাটা',
    subtabMatrimonyDesc: 'পাত্র ও পাত্রীর শরীয়াহসম্মত ইসলামিক বায়োডাটা',
    subtabMosquesDesc: 'ইমাম, মুয়াজ্জিন ও খতীব নিয়োগের জন্য বিজ্ঞপ্তি',
    subtabImamsDesc: 'অভিজ্ঞ ও যোগ্য হাফেজ, কারী ও আলেমদের তথ্য',
    postMatrimonyBtn: '+ পাত্র/পাত্রীর বায়োডাটা দিন',
    postMosqueBtn: '+ মসজিদের নিয়োগ দিন',
    postImamBtn: '+ ইমাম বায়োডাটা দিন',
    searchMatrimonyPlaceholder: 'পাত্র/পাত্রীর নাম, পেশা, শিক্ষা, এলাকা দিয়ে খুঁজুন...',
    searchMosquesPlaceholder: 'মসজিদের নাম, এলাকা, পদবী দিয়ে খুঁজুন...',
    searchImamsPlaceholder: 'ইমামের নাম, শিক্ষাগত যোগ্যতা, এলাকা দিয়ে খুঁজুন...',
    filterAll: 'সবাই',
    filterGroom: '🤵 পাত্র',
    filterBride: '👰 পাত্রী',
    filterAllDistricts: 'সব এলাকা / জেলা',
    sortNewest: 'নতুনগুলো আগে',
    sortSalaryHigh: 'হাদিয়া (বেশি থেকে কম)',
    sortSalaryLow: 'হাদিয়া (কম থেকে বেশি)',
    newBadge: 'নতুন',
    noDataFound: 'কোন তথ্য পাওয়া যায়নি',
    resetFilter: 'ফিল্টার রিসেট করুন',
    experienceAge: 'অভিজ্ঞতা ও বয়স',
    years: 'বছর',
    age: 'বয়স',
    salaryHonorarium: 'মাসিক হাদিয়া',
    contactWhatsApp: 'হোয়াটসঅ্যাপ',
    callDirect: 'কল করুন',
    viewDetails: 'বিস্তারিত দেখুন',

    umrahPortalTitle: 'উমরাহ প্যাকেজ ও উম্মাহ প্ল্যাটফর্ম',
    umrahPortalSubtitle: 'উমরাহ ট্রাভেলস কোম্পানির প্যাকেজসমূহ ও এজেন্সির সাথে সরাসরি বুকিং',
    umrahTab: 'উমরাহ প্যাকেজ',
    duaWallTab: 'উম্মাহ দোয়া ওয়াল',
    addUmrahPackage: '+ এজেন্সির প্যাকেজ যোগ করুন',

    changeLocation: 'স্থান পরিবর্তন করুন',
    detectedGps: 'জিপিএস দ্বারা সনাক্তকৃত',
    detectedIp: 'আনুমানিক অবস্থান',
    barakValleyText: 'বরাক উপত্যকা',
    googleMethodText: 'গুগল পদ্ধতি',
    createdBy: 'অ্যাপটি তৈরি করেছেন:',
    saveAndAlarm: 'সেভ করুন ও অ্যালার্ম চালু করুন',
    stopAlarm: 'থামান',
    nowPlayingAzan: 'সুমধুর আযান চলছে...',
    upcomingNext: 'পরবর্তী নামাজ',
    inTime: 'আর বাকি',
    silcharBase: 'শিলচর মূল সময়',
    arabicCalendar: 'আরবী ক্যালেন্ডার',
    installGuide: 'ইনস্টল গাইড',
    prayerTimetableTitle: 'নামাজ ও রোজার স্থায়ী সময়সূচি',
    barakConstituenciesSub: 'ক্যাছাড়, হাইলাকান্দি ও করিমগঞ্জ • ১৬টি নির্বাচনী এলাকা',
  },
};

export const CONSTITUENCY_NAMES: Record<string, { en: string; ur: string; bn: string }> = {
  silchar: { en: 'Silchar', ur: 'سلچر', bn: 'শিলচর' },
  sonai: { en: 'Sonai', ur: 'سونائی', bn: 'সোনাই' },
  dholai: { en: 'Dholai', ur: 'ڈھولائی', bn: 'ধোলাই' },
  udharbond: { en: 'Udharbond', ur: 'ادھار بند', bn: 'উদারবন্দ' },
  lakhipur: { en: 'Lakhipur', ur: 'لکھی پور', bn: 'লক্ষীপুর' },
  barkhola: { en: 'Barkhola', ur: 'بارکھولا', bn: 'বারখলা' },
  katigorah: { en: 'Katigorah', ur: 'کاٹی گوڑہ', bn: 'কাটিগড়া' },
  hailakandi: { en: 'Hailakandi', ur: 'ہائلا کانڈی', bn: 'হাইলাকান্দি' },
  algapur: { en: 'Algapur', ur: 'الگا پور', bn: 'আলগাপুর' },
  katlicherra: { en: 'Katlicherra', ur: 'کاٹلی چھڑا', bn: 'কাটলীছড়া' },
  lala: { en: 'Lala', ur: 'لالا', bn: 'লালা' },
  karimganj_north: { en: 'Karimganj North', ur: 'کریم گنج شمالی', bn: 'করিমগঞ্জ উত্তর' },
  karimganj_south: { en: 'Karimganj South', ur: 'کریم گنج جنوبی', bn: 'করিমগঞ্জ দক্ষিণ' },
  badarpur: { en: 'Badarpur', ur: 'بدر پور', bn: 'বদরপুর' },
  patharkandi: { en: 'Patharkandi', ur: 'پتھر کانڈی', bn: 'পাথারকান্দি' },
  ratabari: { en: 'Ratabari', ur: 'راتا باڑی', bn: 'রাতাবাড়ী' },
};

export function getConstituencyName(id: string, lang: AppLanguage, fallback = ''): string {
  const item = CONSTITUENCY_NAMES[id];
  if (!item) return fallback || id;
  return item[lang] || item.en;
}

export const DISTRICT_NAMES: Record<string, { en: string; ur: string; bn: string }> = {
  cachar: { en: 'Cachar', ur: 'کاچار', bn: 'ক্যাছাড়' },
  hailakandi: { en: 'Hailakandi', ur: 'ہائلا کانڈی', bn: 'হাইলাকান্দি' },
  karimganj: { en: 'Karimganj', ur: 'کریم گنج', bn: 'করিমগঞ্জ' },
};

export function getDistrictName(district?: string | null, lang: AppLanguage | string = 'en'): string {
  if (!district) return '';
  const safeLang = (lang === 'ur' || lang === 'bn') ? lang : 'en';
  const key = String(district).toLowerCase().trim();
  if (DISTRICT_NAMES[key]) {
    return DISTRICT_NAMES[key][safeLang] || DISTRICT_NAMES[key].en;
  }
  return district;
}

export function getPrayerName(rawKey?: string | null, lang: AppLanguage | string = 'en'): string {
  if (!rawKey) return 'Fajr';
  const safeLang = (lang === 'ur' || lang === 'bn') ? lang : 'en';
  const t = TRANSLATIONS[safeLang];
  const key = String(rawKey).toLowerCase().trim();

  switch (key) {
    case 'sehri_end':
    case 'fajr':
      return safeLang === 'ur' ? 'فجر' : safeLang === 'bn' ? 'ফজর' : 'Fajr';
    case 'sunrise':
    case 'ishraq':
      return safeLang === 'ur' ? 'اشراق' : safeLang === 'bn' ? 'ইশরাক' : 'Sunrise';
    case 'dhuhr':
    case 'zuhr':
      return t.dhuhr;
    case 'asr':
      return t.asr;
    case 'maghrib':
      return t.maghrib;
    case 'isha':
      return t.isha;
    default:
      return rawKey;
  }
}
