import { MatrimonyBiodata, ImamBiodata, MosqueVacancy, AppLanguage } from '../types';

// Translation dictionary for common Bengali phrases to English & Urdu
const TRANSLATION_MAP_EN: Record<string, string> = {
  // Matrimony Titles & Codes
  'পাত্র-১০১ (সফটওয়্যার ইঞ্জিনিয়ার)': 'Groom-101 (Software Engineer)',
  'পাত্রী-২০১ (আলেমা ও এম.এ)': 'Bride-201 (Alimah & M.A)',
  'পাত্র-১০২ (সরকারি শিক্ষক ও হাফেজ)': 'Groom-102 (Govt Teacher & Hafiz)',
  'পাত্রী-২০২ (চিকিৎসক - MBBS)': 'Bride-202 (Doctor - MBBS)',
  'পাত্র-১০৩ (আলেম ও জামে মসজিদের খতীব)': 'Groom-103 (Alim & Jamia Mosque Khatib)',

  // Names
  'মোহাম্মদ তানভীর চৌধুরী': 'Mohammad Tanvir Choudhury',
  'ফাতেমা তুজ জোহরা': 'Fatema Tuz Zohra',
  'হাফেজ সাব্বির আহমেদ লস্কর': 'Hafiz Sabbir Ahmed Laskar',
  'ডা. নাজিয়া সুলতানা বড়ভুইয়া': 'Dr. Nazia Sultana Barbhuiya',
  'মাওলানা মুফতী উমর ফারুক মাজহারভী': 'Mawlana Mufti Umar Farooq Mazharvi',

  // Complexion
  'উজ্জ্বল ফর্সা': 'Very Fair',
  'ফর্সা ও সুশ্রী': 'Fair & Graceful',
  'উজ্জ্বল শ্যামলা': 'Bright Wheatish',
  'ফর্সা': 'Fair',
  'শ্যামলা': 'Wheatish',

  // Marital Status
  'অবিবাহিত': 'Unmarried (Single)',
  'বিবাহিত': 'Married',
  'ডিভোর্সড': 'Divorced',
  'বিধবা': 'Widow',
  'বিপত্নীক': 'Widower',

  // Districts & Areas
  'কাছাড়': 'Cachar',
  'করিমগঞ্জ': 'Karimganj',
  'হাইলাকান্দি': 'Hailakandi',
  'শিলচর': 'Silchar',
  'তারাপুর, শিলচর শহর': 'Tarapur, Silchar Town',
  'সোনাই রোড, রাঙ্গিরখাড়ি, শিলচর': 'Sonai Road, Rangirkhari, Silchar',
  'সোনাই রোড, রাঙ্গিরখাড়ি, শিলচর': 'Sonai Road, Rangirkhari, Silchar',
  'বদরপুর ঘাট, করিমগঞ্জ': 'Badarpur Ghat, Karimganj',
  'হাইলাকান্দি টাউন, ওয়ার্ড নং ৪': 'Hailakandi Town, Ward 4',
  'উধারবন্দ, কাছাড়': 'Udharbond, Cachar',
  'সোনাই, কাছাড়': 'Sonai, Cachar',
  'বদরপুর, করিমগঞ্জ': 'Badarpur, Karimganj',
  'লালা, হাইলাকান্দি': 'Lala, Hailakandi',
  'তারাপুর শিববাড়ি রোড': 'Tarapur Shivbari Road',
  'মেইন রোড, পুরাতন বাজার': 'Main Road, Old Market',
  'কলেজ রোড, শান্তিনগর': 'College Road, Shantinagar',
  'শিলচর, কাছাড়': 'Silchar, Cachar',
  'করিমগঞ্জ, আসাম': 'Karimganj, Assam',
  'হাইলাকান্দি, আসাম': 'Hailakandi, Assam',
  'শিলচর শহর / বরাক উপত্যকার যেকোনো এলাকা': 'Silchar Town / Any area in Barak Valley',
  'করিমগঞ্জ / শিলচর / হাইলাকান্দি': 'Karimganj / Silchar / Hailakandi',
  'হাইলাকান্দি / শিলচর / আসাম': 'Hailakandi / Silchar / Assam',

  // Education
  'বি.টেক (কম্পিউটার সায়েন্স), এনআইটি শিলচর': 'B.Tech (Computer Science), NIT Silchar',
  'দাওরায়ে হাদীস (টাইটেল পাস) এবং এম.এ (আরবি সাহিত্য, আসাম বিশ্ববিদ্যালয়)': 'Dawrah-e-Hadith (Title Pass) & M.A (Arabic Lit, Assam Univ)',
  'দাওরায়ে হাদীস (টাইটেল পাস) এবং এম.এ (আরবি সাহিত্য, আসাম বিশ্ববিদ্যালয়)': 'Dawrah-e-Hadith (Title Pass) & M.A (Arabic Lit, Assam Univ)',
  '৩০ পারা হিফজুল কুরআন ও বি.এসসি (গণিত), বি.এড': '30 Para Hafiz-ul-Quran & B.Sc (Maths), B.Ed',
  'এমবিবিএস (MBBS), শিলচর মেডিকেল কলেজ': 'MBBS, Silchar Medical College',
  'দাওরায়ে হাদীস (দারুল উলুম দেওবন্দ) ও ক্বিরাত কোর্স': 'Dawrah-e-Hadith (Darul Uloom Deoband) & Qirat Course',

  // Profession
  'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার (আইটি কোম্পানি)': 'Senior Software Engineer (IT Company)',
  'দ্বীনি বালিকা মাদ্রাসার শিক্ষিকা': 'Teacher at Islamic Girls Madrasa',
  'সহকারী শিক্ষক (সরকারি হাইস্কুল)': 'Assistant Teacher (Govt High School)',
  'রেসিডেন্ট ডাক্তার (সিভিল হাসপাতাল)': 'Resident Doctor (Civil Hospital)',
  'জামে মসজিদের সম্মানিত খতীব ও মাদ্রাসা মুহতামিম': 'Khatib of Jamia Mosque & Madrasa Principal',

  // Monthly Income
  '₹৮৫,০০০ / মাস': '₹85,000 / month',
  '₹২০,০০০ / মাস': '₹20,000 / month',
  '₹৫৫,০০০ / মাস': '₹55,000 / month',
  '₹৬৫,০০০ / মাস': '₹65,000 / month',
  '₹২৫,০০০ / মাস': '₹25,000 / month',

  // Religious Practices
  '৫ ওয়াক্ত জামাতে নামাজ': '5 Daily Prayers with Jamaat',
  '৫ ওয়াক্ত নামাজি': '5 Daily Prayers Practicing',
  '৫ ওয়াক্ত নামাজি': '5 Daily Prayers Practicing',
  'সুন্নতি দাড়ি': 'Sunnah Beard',
  'সুন্নতি দাঁড়ি': 'Sunnah Beard',
  'কুরআন তিলাওয়াত': 'Daily Quran Recitation',
  'হালাল উপার্জনে যত্নশীল': 'Strictly Mindful of Halal Earning',
  'সম্পূর্ণ পর্দনশীন (নিকাব ও বোরকা)': 'Full Purdah (Niqab & Abaya)',
  'সম্পূর্ণ পর্দানশীন (নিকাব ও বোরকা)': 'Full Purdah (Niqab & Abaya)',
  'সহীহ তাজবীদ সহ কুরআন শিক্ষা': 'Quran Recitation with Tajweed',
  'সুন্নতি চালচলন': 'Sunnah Lifestyle & Manners',
  'তারাবীহ ইমামতি': 'Taraweeh Imam Experience',
  'ইসলামিক জীবনযাপন': 'Committed Islamic Living',
  'হিজাব ও শালীন পোশাক পরিধানকারী': 'Observes Hijab & Modest Attire',
  'ইসলামিক নীতিতে বিশ্বাসী': 'Strong Islamic Moral Ethics',
  'কুরআন ও হাদিসের পূর্ণ অনুসারী': 'Firm Adherent to Quran & Sunnah',
  'সুন্নতি জীবন': 'Devoted Sunnah Lifestyle',
  'খুতবা ও ওয়াজ নসিহত': 'Inspiring Khutbah & Preaching',

  // Family Type & Father Occupation
  'দ্বীনদার ও শিক্ষিত সম্ভ্রান্ত পরিবার': 'Pious, educated and noble family',
  'দ্বীনদার সুন্নি আলিম পরিবার': 'Religious Sunni Alim family',
  'সুশিক্ষিত দ্বীনদার পরিবার': 'Well-educated pious family',
  'উচ্চ শিক্ষিত সম্ভ্রান্ত পরিবার': 'Highly educated aristocratic family',
  'খাঁটি দ্বীনদার আলেম খান্দান': 'Purely religious Islamic scholar lineage',
  'অবসরপ্রাপ্ত সরকারি উচ্চ বিদ্যালয়ের প্রধান শিক্ষক': 'Retired Govt High School Headmaster',
  'ব্যবসায়ী (শিলচর বড় বাজার)': 'Businessman (Silchar Big Bazaar)',
  'ব্যবসায়ী': 'Businessman',
  'অবসরপ্রাপ্ত যুগ্ম সচিব (আসাম সরকার)': 'Retired Joint Secretary (Govt of Assam)',
  'মরহুম পীর সাহেব / আলেম পরিবার': 'Late Pir Saheb / Islamic Scholar Family',

  // Expectations
  'নামাজি, দ্বীনদার, নম্রভাষী ও পর্দানশীন সুশিক্ষিতা পাত্রী কাম্য। পারিবারিকভাবে বিয়ে সম্পন্ন করতে আগ্রহী।':
    'Looking for a practicing, modest, well-mannered and educated pious bride. Seeking traditional family-based marriage.',
  'হালাল উপার্জনকারী, ৫ ওয়াক্ত নামাজি, বদভ্যাসমুক্ত দ্বীনদার পাত্র। আলেম বা সাধারণ শিক্ষিত হলেও দ্বীনকে প্রাধান্য দেন এমন পাত্র পছন্দ।':
    'Seeking a halal-earning, practicing Muslim groom free from bad habits. Alim or conventionally educated who prioritizes Deen.',
  'কমপক্ষে স্নাতক বা সমমানের শিক্ষিতা, পর্দনশীন ও শ্বশুর-শাশুড়িকে শ্রদ্ধা করার মানসিকতাসম্পন্ন দ্বীনদার মেয়ে।':
    'At least graduate or equivalent, practicing purdah, respectful to elders and family-oriented pious bride.',
  'সমমানের পেশাজীবী (ডাক্তার / ইঞ্জিনিয়ার / সরকারি কর্মকর্তা / সফল ব্যবসায়ী), নামাজি, ভদ্র ও দ্বীনদার পাত্র কাম্য।':
    'Equivalent professional (Doctor / Engineer / Govt Officer / Successful Businessman), practicing, courteous and pious groom.',
  'দ্বীনী শিক্ষায় শিক্ষিত (আলেমা / হাফেজা) অথবা দ্বীনের প্রতি প্রচণ্ড অনুরাগ আছে এমন সাধারণ শিক্ষিতা পর্দানশীন পাত্রী।':
    'Religiously educated (Alimah / Hafizah) or conventionally educated with deep love for Islamic teachings and purdah.',

  // Guardians
  'পিতা (হাজী রফিকুল চৌধুরী)': 'Father (Haji Rafiqul Choudhury)',
  'পিতা (মাওলানা আব্দুল বারী)': 'Father (Mawlana Abdul Bari)',
  'বড় ভাই (ইঞ্জিনিয়ার কবির লস্কর)': 'Elder Brother (Engr. Kabir Laskar)',
  'পিতা (ডা. ফখরুল ইসলাম)': 'Father (Dr. Fakhrul Islam)',
  'মামা (মাওলানা কামরুল হুদা)': 'Maternal Uncle (Mawlana Kamrul Huda)',

  // Bio Notes
  'পরিবারের সবাই দ্বীনদার ও সুন্নতের পাবন্দ। পাত্র বিনয়ী, অধূমপায়ী এবং কোনো অনৈসলামিক কার্যকলাপে লিপ্ত নয়।':
    'Family adheres strictly to Sunnah. The groom is polite, non-smoker, and free from un-Islamic activities.',
  'পাত্রী অত্যন্ত ভদ্র, ঘরোয়া কাজে পারদর্শী এবং দ্বীনি তাহযীব-তামাদ্দুনে বড় হওয়া। পাত্রের পরিবারে দ্বীনি পরিবেশ থাকা জরুরি।':
    'The bride is courteous, skilled in domestic duties, raised in Islamic culture. Islamic atmosphere in groom family required.',
  'পাত্র মিষ্টভাষী, সামাজিক ও দ্বীনি কার্যকলাপে সক্রিয়। নিজের বাড়ি ও পরিবারিক অবস্থা আলহামদুলিল্লাহ সচ্ছল।':
    'The groom is sweet-spoken, active in religious and social events. Own house and financially well-off Alhamdulillah.',
  'মেয়ে চিকিৎসা পেশার সাথে সাথে ঘরে পর্দা ও শালীনতা রক্ষা করে চলেন। উভয় পরিবারের সম্মতি সাপেক্ষে যোগাযোগ করা যাবে।':
    'Alongside medical profession, she maintains modesty and purdah. Contact welcome subject to mutual family consent.',
  'সুন্নতি আদর্শ অনুযায়ী সহজ-সরল ও মোহরানা শরীয়াহসম্মতভাবে সম্পন্ন করার নিয়ত রয়েছে।':
    'Intends to complete marriage simply and with Shariah-compliant Mahr according to Sunnah.',

  // Imam Data
  'মাওলানা হাফেজ আব্দুল্লাহ মজুমদার': 'Mawlana Hafiz Abdullah Majumdar',
  'মুফতী শামসুল হুদা লস্কর': 'Mufti Shamsul Huda Laskar',
  'হাফেজ কারী ইমরান হোসেন বড়ভুইয়া': 'Hafiz Qari Imran Hossain Barbhuiya',
  'হাফেজ ও মাওলানা': 'Hafiz & Mawlana',
  'মুফতী ও মুহাদ্দিস': 'Mufti & Muhaddith',
  'হাফেজ ও আন্তর্জাতিক ক্বারী': 'Hafiz & International Qari',
  'দাওরায়ে হাদীস (টাইটেল) ও ৩০ পারা হিফজুল কুরআন': 'Dawrah-e-Hadith (Title) & 30 Para Hafiz-ul-Quran',
  'দাওরায়ে হাদীস ও ইফতা (ফতোয়া বিভাগ সমাপ্ত)': 'Dawrah-e-Hadith & Ifta (Completed Fatwa Course)',
  'হাফেজে কুরআন ও সাবআ কিরাত কোর্স': 'Hafiz-e-Quran & Saba Qirat Course',
  'দারুল উলুম বাঁশকান্দি, আসাম': 'Darul Uloom Banskandi, Assam',
  'দারুল উলুম দেওবন্দ, ইউপি': 'Darul Uloom Deoband, UP',
  'আল জামিয়াতুল ইসলামিয়া রামপুর, আসাম': 'Al Jamiatul Islamia Rampur, Assam',

  // Imam Skills
  '৫ ওয়াক্ত সহীহ নামাজ ইমামতি': '5 Daily Prayers Correct Imamat',
  'জুমআর আকর্ষণীয় খুতবা ও বয়ান': 'Inspiring Friday Khutbah & Speech',
  'শিশুদের নূরানী কায়দা ও নাজেরা পাঠদান': 'Noorani Qaida & Nazera Teaching for Kids',
  'সহীহ ক্বিরাত ও তাজবীদ': 'Authentic Qirat & Tajweed',
  'দৈনন্দিন প্রয়োজনীয় মাসআলা-মাসায়েল সমাধান': 'Resolving Everyday Fiqh Questions',
  'খতীব ও উচ্চমানের তাফসীর পেশ': 'Khatib & High Quality Tafseer Delivery',
  'শরীয়াহ মোতাবেক ফতোয়া ও পারিবারিক সালিশী সমাধান': 'Shariah Fatwas & Family Arbitration',
  'কুরআন ও হাদিসের দারস প্রদান': 'Conducting Quran & Hadith Study Circles',
  'যুবসমাজকে বিপথগামী থেকে ফেরাতে যুব মজলিস পরিচালনা': 'Youth Mentorship & Islamic Guidance',
  'মধুর সুরে তারাবীহ ও ইমামতি': 'Melodious Taraweeh & Imamat',
  'হিফজখানা বা মক্তব শিক্ষকতা': 'Hifz Madrasa or Maktab Teaching',
  'উর্দু ও বাংলা বয়ান': 'Urdu & Bengali Speeches',
  'আজান ও মুয়াজ্জিনির সুন্দর তারান্নুম': 'Beautiful Adhan & Tarannum',

  // Facilities
  'পৃথক থাকার ঘর': 'Separate living quarters',
  'খাবার সুব্যবস্থা': 'Good food arrangements',
  'বিদ্যুৎ ও পানি': 'Electricity & running water',
  'পরিবার নিয়ে থাকার ব্যবস্থা অথবা একক কামরা': 'Family accommodation or single room',
  'বিদ্যুৎ ও ওয়াইফাই': 'Electricity & Wi-Fi',
  'একক কামরা': 'Single private room',
  'খাবারের সুব্যবস্থা': 'Arranged meals',

  // Mosque Vacancies
  'বায়তুস সালাম জামে মসজিদ': 'Baytus Salam Jamia Mosque',
  'মদিনা জামে মসজিদ ও মক্তব': 'Madina Jamia Mosque & Maktab',
  'নুরানী জামে মসজিদ': 'Noorani Jamia Mosque',
  'পেশ ইমাম ও খতীব': 'Pesh Imam & Khatib',
  'হাফেজ সাহেব (ইমামতি ও হিফজ শিক্ষক)': 'Hafiz Saheb (Imamat & Hifz Teacher)',
  'পেশ ইমাম ও মক্তব পরিচালক': 'Pesh Imam & Maktab Director',
  'দাওরায়ে হাদীস পাশ ও সুন্নতের পাবন্দ আলেম (হিফজ থাকলে অগ্রাধিকার)':
    'Dawrah-e-Hadith passed, Sunnah-observing Alim (Hafiz preferred)',
  'পূর্ণ কুরআন হাফেজ ও সুমধুর ক্বিরাত': 'Complete Quran Hafiz with melodious Qirat',
  'দাওরায়ে হাদীস বা আলিম ও নূরানী প্রশিক্ষণপ্রাপ্ত': 'Dawrah-e-Hadith or Alim with Noorani Training',
  'কমপক্ষে ২-৩ বছরের অভিজ্ঞতা': 'At least 2-3 years experience',
  'নতুন হলেও চলবে (তাজবীদ মজবুত হতে হবে)': 'Freshers welcome (must have strong Tajweed)',
  '১ বছরের অভিজ্ঞতা কাম্য': '1 year experience preferred',
  'অবিলম্বে': 'Immediately',
  'অবিলম্বে / আগামী মাসের ১ তারিখের মধ্যে': 'Immediately / by 1st of next month',
  'আগামী ১৫ দিনের মধ্যে': 'Within next 15 days',
  'আগামী মাসের ১৫ তারিখ': 'By 15th of next month',
  'আলহাজ্ব মাওলানা নজরুল ইসলাম (সভাপতি)': 'Alhaj Mawlana Nazrul Islam (President)',
  'মুহাম্মাদ জসিম উদ্দিন (সেক্রেটারি)': 'Muhammad Jasim Uddin (Secretary)',
  'হাজী রফিক আহমেদ লস্কর (মুতাওয়াল্লী)': 'Haji Rafiq Ahmed Laskar (Mutawalli)',
};

const TRANSLATION_MAP_UR: Record<string, string> = {
  // Matrimony Titles & Codes
  'পাত্র-১০১ (সফটওয়্যার ইঞ্জিনিয়ার)': 'دولہا-۱۰۱ (سافٹ ویئر انجینئر)',
  'পাত্রী-২০১ (আলেমা ও এম.এ)': 'دلہن-۲۰۱ (عالمہ و ایم اے)',
  'পাত্র-১০২ (সরকারি শিক্ষক ও হাফেজ)': 'دولہا-۱۰۲ (سرکاری استاد و حافظ)',
  'পাত্রী-২০২ (চিকিৎসক - MBBS)': 'دلہن-۲۰২ (ڈاکٹر - ایم بی بی ایس)',
  'পাত্র-১০৩ (আলেম ও জামে মসজিদের খতীব)': 'دولہا-۱۰৩ (عالم و جامع مسجد خطیب)',

  // Names
  'মোহাম্মদ তানভীর চৌধুরী': 'محمد تنویر چودھری',
  'ফাতেমা তুজ জোহরা': 'فاطمۃ الزہراء',
  'হাফেজ সাব্বির আহমেদ লস্কর': 'حافظ شبیر احمد لشکر',
  'ডা. নাজিয়া সুলতানা বড়ভুইয়া': 'ڈاکٹر نازیہ سلطانہ بڑبھوئیہ',
  'মাওলানা মুফতী উমর ফারুক মাজহারভী': 'مولانا مفتی عمر فاروق مظاہری',

  // Complexion
  'উজ্জ্বল ফর্সা': 'انتہائی گورا',
  'ফর্সা ও সুশ্রী': 'گورا اور خوبصورت',
  'উজ্জ্বল শ্যামলা': 'کھلتا گندمی',
  'ফর্সা': 'گورا',
  'শ্যামলা': 'گندمی',

  // Marital Status
  'অবিবাহিত': 'غیر شادی شدہ',
  'বিবাহিত': 'شادی شدہ',
  'ডিভোর্সড': 'مطلقہ / طلاق یافتہ',
  'বিধবা': 'بیوہ',
  'বিপত্নীক': 'رنڈوا',

  // Districts & Areas
  'কাছাড়': 'کچحار',
  'করিমগঞ্জ': 'کریم گنج',
  'হাইলাকান্দি': 'ہائلہ کاندی',
  'শিলচর': 'سلچر',
  'তারাপুর, শিলচর শহর': 'تاراپور، سلچر شہر',
  'সোনাই রোড, রাঙ্গিরখাড়ি, শিলচর': 'سونائی روڈ، رنگیرکھاڑی، سلچر',
  'সোনাই রোড, রাঙ্গিরখাড়ি, শিলচর': 'سونائی روڈ، رنگیرکھاڑی، سلچر',
  'বদরপুর ঘাট, করিমগঞ্জ': 'بدر پور گھاٹ، کریم گنج',
  'হাইলাকান্দি টাউন, ওয়ার্ড নং ৪': 'ہائلہ کاندی ٹاؤن، وارڈ ۴',
  'উধারবন্দ, কাছাড়': 'ادھار بند، کچحار',
  'সোনাই, কাছাড়': 'سونائی، کچحার',
  'বদরপুর, করিমগঞ্জ': 'بدر پور، کریم گنج',
  'লালা, হাইলাকান্দি': 'لالا، ہائلہ کاندی',
  'তারাপুর শিববাড়ি রোড': 'تاراپور شیو باڑی روڈ',
  'মেইন রোড, পুরাতন বাজার': 'مین روڈ، پرانا بازار',
  'কলেজ রোড, শান্তিনগর': 'کالج روڈ، شانتی نگر',
  'শিলচর, কাছাড়': 'سلچر، کچحار',
  'করিমগঞ্জ, আসাম': 'کریم گنج، آسام',
  'হাইলাকান্দি, আসাম': 'ہائلہ کاندی، آسام',
  'শিলচর শহর / বরাক উপত্যকার যেকোনো এলাকা': 'سلچر شہر / وادی بارک کا کوئی بھی علاقہ',
  'করিমগঞ্জ / শিলচর / হাইলাকান্দি': 'کریم گنج / سلچر / ہائلہ کاندی',
  'হাইলাকান্দি / শিলচর / আসাম': 'ہائلہ کاندی / سلچر / آسام',

  // Education
  'বি.টেক (কম্পিউটার সায়েন্স), এনআইটি শিলচর': 'بی ٹیک (کمپیوٹر سائنس)، این آئی ٹی سلچر',
  'দাওরায়ে হাদীস (টাইটেল পাস) এবং এম.এ (আরবি সাহিত্য, আসাম বিশ্ববিদ্যালয়)': 'دورۂ حدیث و ایم اے (عربی ادب)',
  'দাওরায়ে হাদীস (টাইটেল পাস) এবং এম.এ (আরবি সাহিত্য, আসাম বিশ্ববিদ্যালয়)': 'دورۂ حدیث و ایم اے (عربی ادب)',
  '৩০ পারা হিফজুল কুরআন ও বি.এসসি (গণিত), বি.এড': '۳۰ پارہ حفظ القرآن و بی ایس سی، بی ایڈ',
  'এমবিবিএস (MBBS), শিলচর মেডিকেল কলেজ': 'ایم بی بی ایس، سلچر میڈیکل کالج',
  'দাওরায়ে হাদীস (দারুল উলুম দেওবন্দ) ও ক্বিরাত কোর্স': 'دورۂ حدیث (دارالعلوم دیوبند) و قرأت کورس',

  // Profession
  'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার (আইটি কোম্পানি)': 'سینئر سافٹ ویئر انجینئر',
  'দ্বীনি বালিকা মাদ্রাসার শিক্ষিকা': 'دینی گرلز مدرسہ کی معلّمہ',
  'সহকারী শিক্ষক (সরকারি হাইস্কুল)': 'معاون استاد (سرکاری ہائی اسکول)',
  'রেসিডেন্ট ডাক্তার (সিভিল হাসপাতাল)': 'ریزیڈنٹ ڈاکٹر (سول ہسپتال)',
  'জামে মসজিদের সম্মানিত খতীব ও মাদ্রাসা মুহতামিম': 'جامع مسجد کے خطیب و مدرسہ مہتمم',

  // Monthly Income
  '₹৮৫,০০০ / মাস': '₹۸۵,۰۰۰ / ماہانہ',
  '₹২০,০০০ / মাস': '₹۲۰,۰۰۰ / ماہانہ',
  '₹৫৫,০০০ / মাস': '₹۵۵,۰۰۰ / ماہانہ',
  '₹৬৫,০০০ / মাস': '₹۶۵,۰۰۰ / ماہانہ',
  '₹২৫,০০০ / মাস': '₹۲۵,۰۰۰ / ماہانہ',

  // Religious Practices
  '৫ ওয়াক্ত জামাতে নামাজ': '۵ وقت باجماعت نماز',
  '৫ ওয়াক্ত নামাজি': '۵ وقت نمازی',
  '৫ ওয়াক্ত নামাজি': '۵ وقت نمازی',
  'সুন্নতি দাড়ি': 'سنت داڑھی',
  'সুন্নতি দাঁড়ি': 'سنت داڑھی',
  'কুরআন তিলাওয়াত': 'روزانہ تلاوت قرآن',
  'হালাল উপার্জনে যত্নশীল': 'حلال رزق کا خاص اہتمام',
  'সম্পূর্ণ পর্দনশীন (নিকাব ও বোরকা)': 'مکمل باپردہ (نقاب و برقع)',
  'সম্পূর্ণ পর্দানশীন (নিকাব ও বোরকা)': 'مکمل باپردہ (نقاب و برقع)',
  'সহীহ তাজবীদ সহ কুরআন শিক্ষা': 'تجوید کے ساتھ قرآن کی تعلیم',
  'সুন্নতি চালচলন': 'سنت کے مطابق معمولات',
  'তারাবীহ ইমামতি': 'تراویح کی امامت',
  'ইসলামিক জীবনযাপন': 'اسلامی طرز زندگی',
  'হিজাব ও শালীন পোশাক পরিধানকারী': 'حجاب اور باحیا لباس',
  'ইসলামিক নীতিতে বিশ্বাসী': 'اسلامی اخلاق و کردار',
  'কুরআন ও হাদিসের পূর্ণ অনুসারী': 'قرآن و سنت کی پابند',
  'সুন্নতি জীবন': 'سنت نبوی پر عمل پیرا',
  'খুতবা ও ওয়াজ নসিহত': 'پرتاثیر خطبات و بیانات',

  // Family Type & Father Occupation
  'দ্বীনদার ও শিক্ষিত সম্ভ্রান্ত পরিবার': 'دیندار، تعلیم یافتہ معزز گھرانہ',
  'দ্বীনদার সম্ভ্রান্ত সুন্নি পরিবার': 'دیندار معزز سنی خاندان',
  'শিক্ষিত দ্বীনদার পরিবার': 'تعلیم یافتہ اور دیندار خاندان',
  'অবসরপ্রাপ্ত সরকারি কর্মচারী': 'ریٹائرڈ سرکاری ملازم',
  'সম্মানিত মাদ্রাসার প্রিন্সিপাল (মুহতামিম)': 'محترم پرنسپل (مہتمم مدرسہ)',
  'অবসরপ্রাপ্ত সরকারি কর্মকর্তা': 'ریٹائرڈ سرکاری افسر',
  'ব্যবসা (কাপড়ের পাইকারি ব্যবসায়ী)': 'کاروبار (کپڑوں کے تاجر)',
  'মার্কেট ব্যবসায়ী': 'مارکیٹ تاجر',

  // Expectations
  'দ্বীনদার, নামাজি ও শালীন পাত্রী কাম্য। পর্দা বজায় রাখতে আগ্রহী ও পরিবারে মিলেমিশে থাকতে পারা।':
    'دیندار، باحیا، پردہ دار اور خاندانی اقدار کا احترام کرنے والی شریک حیات۔',
  'নেককার, সুন্নতের পাবন্দ ও হালাল উপার্জনে বিশ্বস্ত বর কাম্য। আলেম বা ধার্মিক চাকরিজীবী হলে উত্তম।':
    'نیک سیرت، سنت کے پابند، حلال روزی کمانے والے دیندار دولہا۔',
  'দ্বীনি মূল্যবোধসম্পন্ন, নামাজি ও মার্জিত স্বভাবের উপযুক্ত পাত্রী। শিক্ষকতা বা শিক্ষা প্রসারে যুক্ত হলে অগ্রাধিকার।':
    'دیندار، سنجیدہ اور خوش اخلاق رشتہ درکار ہے۔',
  'উচ্চশিক্ষিত বা পেশাজীবী, তবে সর্বোপরি দ্বীনদার ও আল্লাহভীরু পাত্র কাম্য। কোনো প্রকার যৌতুক বা অনৈতিক দাবি গ্রহণযোগ্য নয়।':
    'تعلیم یافتہ یا پیشہ ور، دیندار اور متقی دولہا۔ جہیز کی کوئی شرط نہیں۔',
  'দ্বীনদার, পরহেজগার ও আলেম পরিবারের সুশীল পাত্রী যিনি ইসলামিক গৃহস্থালী পরিচালনায় উৎসাহী।':
    'دیندار اور پرہیزگار خاتون جو اسلامی ماحول میں گھر سنبھال سکیں۔',

  // Imams
  'হাফেজ ও মাওলানা': 'حافظ و مولانا',
  'মুফতী ও শায়খুল হাদিস': 'مفتی و شیخ الحدیث',
  'হাফেজ ও কারী': 'حافظ و قاری',
  'দাওরায়ে হাদীস ও তাফসীর বিভাগ, দারুল উলুম বাঁশকান্দি': 'دورۂ حدیث، دارالعلوم بانس کنڈی',
  'দারুল উলুম দেওবন্দ (হিফজ ও ইফতা)': 'دارالعلوم دیوبند (حفظ و افتاء)',
  'মাদ্রাসায়ে আলিয়া, করিমগঞ্জ': 'مدرسہ عالیہ، کریم گنج',
  'সহীহ ক্বিরাত ও তাজবীদ': 'تجوید و قرأت',
  'দৈনন্দিন প্রয়োজনীয় মাসআলা-মাসায়েল সমাধান': 'مسائل شرعیہ کا حل',
  'খতীব ও উচ্চমানের তাফসীর পেশ': 'خطیب و بہترین تفسیری بیان',
  'শরীয়াহ মোতাবেক ফতোয়া ও পারিবারিক সালিশী সমাধান': 'فتاویٰ اور عائلی ثالثی',
  'কুরআন ও হাদিসের দারস প্রদান': 'درس قرآن و حدیث',
  'যুবসমাজকে বিপথগামী থেকে ফেরাতে যুব মজলিস পরিচালনা': 'نوجوانوں کی اسلامی تربیت',
  'মধুর সুরে তারাবীহ ও ইমামতি': 'خوش الحانی کے ساتھ امامت و تراویح',
  'হিফজখানা বা মক্তব শিক্ষকতা': 'حفظ و مکتب تدریس',
  'উর্দু ও বাংলা বয়ান': 'اردو اور بنگلہ بیانات',
  'আজান ও মুয়াজ্জিনির সুন্দর তারান্নুম': 'خوبصورت اذان و ترنم',

  // Facilities
  'পৃথক থাকার ঘর': 'الگ رہائشی کمرہ',
  'খাবার সুব্যবস্থা': 'کھانے کا بہترین انتظام',
  'বিদ্যুৎ ও পানি': 'بجلی اور پانی کی سہولت',
  'পরিবার নিয়ে থাকার ব্যবস্থা অথবা একক কামরা': 'فیملی یا سنگل رہائش',
  'বিদ্যুৎ ও ওয়াইফাই': 'بجلی اور وائی فائی',
  'একক কামরা': 'الگ کمرہ',
  'খাবারের সুব্যবস্থা': 'کھانے کا انتظام',

  // Mosque Vacancies
  'বায়তুস সালাম জামে মসজিদ': 'بیت السلام جامع مسجد',
  'মদিনা জামে মসজিদ ও মক্তব': 'مدینہ جامع مسجد و مکتب',
  'নুরানী জামে মসজিদ': 'نورانی جامع مسجد',
  'পেশ ইমাম ও খতীব': 'پیشہ ور امام و خطیب',
  'হাফেজ সাহেব (ইমামতি ও হিফজ শিক্ষক)': 'حافظ صاحب (امامت و تدریس)',
  'পেশ ইমাম ও মক্তব পরিচালক': 'پیش امام و نگراں مکتب',
  'দাওরায়ে হাদীস পাশ ও সুন্নতের পাবন্দ আলেম (হিফজ থাকলে অগ্রাধিকার)': 'دورۂ حدیث پاس، متبع سنت عالم',
  'পূর্ণ কুরআন হাফেজ ও সুমধুর ক্বিরাত': 'مکمل حافظ قرآن بمع خوش الحانی',
  'দাওরায়ে হাদীস বা আলিম ও নূরানী প্রশিক্ষণপ্রাপ্ত': 'دورۂ حدیث یا عالم، نورانی تربیت یافتہ',
  'কমপক্ষে ২-৩ বছরের অভিজ্ঞতা': 'کم از کم ۲-۳ سال کا تجربہ',
  'নতুন হলেও চলবে (তাজবীদ মজবুত হতে হবে)': 'نئے امیدوار بھی اہل ہیں (مضبوط تجوید ضروری)',
  '১ বছরের অভিজ্ঞতা কাম্য': '۱ سال کا تجربہ مطلوب',
  'অবিলম্বে': 'فوری طور پر',
  'অবিলম্বে / আগামী মাসের ১ তারিখের মধ্যে': 'فوری طور پر / آئندہ ماہ کی یکم تاریخ تک',
  'আগামী ১৫ দিনের মধ্যে': 'اگلے ۱۵ دنوں کے اندر',
  'আগামী মাসের ১৫ তারিখ': 'اگلے ماہ کی ۱۵ تاریخ تک',
  'আলহাজ্ব মাওলানা নজরুল ইসলাম (সভাপতি)': 'الحاج مولانا نذر الاسلام (صدر)',
  'মুহাম্মাদ জসিম উদ্দিন (সেক্রেটারি)': 'محمد جاسم الدین (سیکریٹری)',
  'হাজী রফিক আহমেদ লস্কর (মুতাওয়াল্লী)': 'حاجی رفیق احمد لشکر (متولی)',
};

export function translateText(text: string | undefined, lang: AppLanguage | string = 'bn'): string {
  if (!text) return '';
  if (lang === 'bn') return text;
  const trimmed = text.trim();
  if (lang === 'en') {
    return TRANSLATION_MAP_EN[trimmed] || text;
  }
  if (lang === 'ur') {
    return TRANSLATION_MAP_UR[trimmed] || TRANSLATION_MAP_EN[trimmed] || text;
  }
  return text;
}

export function translateArray(arr: string[] | undefined, lang: AppLanguage | string = 'bn'): string[] {
  if (!arr) return [];
  if (lang === 'bn') return arr;
  return arr.map((item) => translateText(item, lang));
}

// Localized helper for MatrimonyBiodata
export function getMatrimonyDisplay(mat: MatrimonyBiodata, lang: AppLanguage | string = 'bn') {
  if (lang === 'bn') {
    return {
      codeName: mat.codeName,
      fullName: mat.fullName,
      complexion: mat.complexion,
      maritalStatus: mat.maritalStatus,
      education: mat.education,
      profession: mat.profession,
      monthlyIncome: mat.monthlyIncome,
      religiousPractices: mat.religiousPractices,
      district: mat.district,
      area: mat.area,
      fatherOccupation: mat.fatherOccupation,
      familyType: mat.familyType,
      partnerExpectations: mat.partnerExpectations,
      guardianRelation: mat.guardianRelation,
      bioNotes: mat.bioNotes,
    };
  }

  // English or Urdu localization
  const isEn = lang === 'en';
  return {
    codeName: (isEn ? mat.codeNameEn : mat.codeNameUr) || translateText(mat.codeName, lang),
    fullName: (isEn ? mat.fullNameEn : mat.fullNameUr) || translateText(mat.fullName, lang),
    complexion: (isEn ? mat.complexionEn : mat.complexionUr) || translateText(mat.complexion, lang),
    maritalStatus: (isEn ? mat.maritalStatusEn : mat.maritalStatusUr) || translateText(mat.maritalStatus, lang),
    education: (isEn ? mat.educationEn : mat.educationUr) || translateText(mat.education, lang),
    profession: (isEn ? mat.professionEn : mat.professionUr) || translateText(mat.profession, lang),
    monthlyIncome: (isEn ? mat.monthlyIncomeEn : mat.monthlyIncomeUr) || translateText(mat.monthlyIncome, lang),
    religiousPractices:
      (isEn ? mat.religiousPracticesEn : mat.religiousPracticesUr) ||
      translateArray(mat.religiousPractices, lang),
    district: (isEn ? mat.districtEn : mat.districtUr) || translateText(mat.district, lang),
    area: (isEn ? mat.areaEn : mat.areaUr) || translateText(mat.area, lang),
    fatherOccupation:
      (isEn ? mat.fatherOccupationEn : mat.fatherOccupationUr) || translateText(mat.fatherOccupation, lang),
    familyType: (isEn ? mat.familyTypeEn : mat.familyTypeUr) || translateText(mat.familyType, lang),
    partnerExpectations:
      (isEn ? mat.partnerExpectationsEn : mat.partnerExpectationsUr) ||
      translateText(mat.partnerExpectations, lang),
    guardianRelation:
      (isEn ? mat.guardianRelationEn : mat.guardianRelationUr) || translateText(mat.guardianRelation, lang),
    bioNotes: (isEn ? mat.bioNotesEn : mat.bioNotesUr) || translateText(mat.bioNotes, lang),
  };
}

// Localized helper for ImamBiodata
export function getImamDisplay(imam: ImamBiodata, lang: AppLanguage | string = 'bn') {
  if (lang === 'bn') {
    return {
      fullName: imam.fullName,
      title: imam.title,
      qualification: imam.qualification,
      institution: imam.institution,
      currentLocation: imam.currentLocation,
      preferredLocation: imam.preferredLocation,
      skills: imam.skills,
      facilitiesDemanded: imam.facilitiesDemanded,
      bioNotes: imam.bioNotes,
      maritalStatus: imam.maritalStatus,
    };
  }

  const isEn = lang === 'en';
  return {
    fullName: (isEn ? imam.fullNameEn : undefined) || translateText(imam.fullName, lang),
    title: (isEn ? imam.titleEn : undefined) || translateText(imam.title, lang),
    qualification: (isEn ? imam.qualificationEn : undefined) || translateText(imam.qualification, lang),
    institution: (isEn ? imam.institutionEn : undefined) || translateText(imam.institution, lang),
    currentLocation: (isEn ? imam.currentLocationEn : undefined) || translateText(imam.currentLocation, lang),
    preferredLocation: (isEn ? imam.preferredLocationEn : undefined) || translateText(imam.preferredLocation, lang),
    skills: (isEn ? imam.skillsEn : undefined) || translateArray(imam.skills, lang),
    facilitiesDemanded: (isEn ? imam.facilitiesDemandedEn : undefined) || translateArray(imam.facilitiesDemanded, lang),
    bioNotes: (isEn ? imam.bioNotesEn : undefined) || translateText(imam.bioNotes, lang),
    maritalStatus: (isEn ? imam.maritalStatusEn : undefined) || translateText(imam.maritalStatus, lang),
  };
}

// Localized helper for MosqueVacancy
export function getMosqueDisplay(vac: MosqueVacancy, lang: AppLanguage | string = 'bn') {
  if (lang === 'bn') {
    return {
      mosqueName: vac.mosqueName,
      area: vac.area,
      district: vac.district,
      position: vac.position,
      requiredQualification: vac.requiredQualification,
      experienceRequired: vac.experienceRequired,
      facilitiesOffered: vac.facilitiesOffered,
      responsibilities: vac.responsibilities,
      joiningDeadline: vac.joiningDeadline,
      contactPerson: vac.contactPerson,
      description: vac.description,
    };
  }

  const isEn = lang === 'en';
  return {
    mosqueName: (isEn ? vac.mosqueNameEn : undefined) || translateText(vac.mosqueName, lang),
    area: (isEn ? vac.areaEn : undefined) || translateText(vac.area, lang),
    district: (isEn ? vac.districtEn : undefined) || translateText(vac.district, lang),
    position: (isEn ? vac.positionEn : undefined) || translateText(vac.position, lang),
    requiredQualification:
      (isEn ? vac.requiredQualificationEn : undefined) || translateText(vac.requiredQualification, lang),
    experienceRequired:
      (isEn ? vac.experienceRequiredEn : undefined) || translateText(vac.experienceRequired, lang),
    facilitiesOffered:
      (isEn ? vac.facilitiesOfferedEn : undefined) || translateArray(vac.facilitiesOffered, lang),
    responsibilities:
      (isEn ? vac.responsibilitiesEn : undefined) || translateArray(vac.responsibilities, lang),
    joiningDeadline:
      (isEn ? vac.joiningDeadlineEn : undefined) || translateText(vac.joiningDeadline, lang),
    contactPerson:
      (isEn ? vac.contactPersonEn : undefined) || translateText(vac.contactPerson, lang),
    description: (isEn ? vac.descriptionEn : undefined) || translateText(vac.description, lang),
  };
}
