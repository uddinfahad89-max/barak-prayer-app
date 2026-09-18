import { MatrimonyBiodata, ImamBiodata, MosqueVacancy, UmrahPackage, AppLanguage } from '../types';

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

  // Umrah Packages & Travel Agencies
  'আল-হারামাইন ট্যুরস অ্যান্ড ট্রাভেলস (Al-Haramain Tours)': 'Al-Haramain Tours & Travels',
  'বরাক ভ্যালি হজ ও উমরাহ সার্ভিস (Barak Umrah Services)': 'Barak Valley Hajj & Umrah Services',
  'জমজম ইন্টারন্যাশনাল ট্রাভেলস (Zamzam Travels)': 'Zamzam International Travels',
  'বেঙ্গল ও নর্থ-ইস্ট কাফেলা ট্রাভেলস (Bengal Umrah Group)': 'Bengal & North-East Kafla Travels (Bengal Umrah Group)',
  'সোনাই রোড, শিলচর, আসাম (Silchar)': 'Sonai Road, Silchar, Assam',
  'স্টেশন রোড, করিমগঞ্জ, আসাম (Karimganj)': 'Station Road, Karimganj, Assam',
  'পল্টন বাজার, গুয়াহাটি (Guwahati) ও বদরপুর': 'Paltan Bazar, Guwahati & Badarpur',
  'পার্ক সার্কাস, কলকাতা (Kolkata) ও শিলচর যোগাযোগ কেন্দ্র': 'Park Circus, Kolkata & Silchar Contact Center',
  '১৫ দিনের বরকতময় রমজান উমরাহ কাফেলা ২০২৬': '15-Day Blessed Ramadan Umrah Caravan 2026',
  '২১ দিনের সুপার ডিলাক্স উমরাহ স্পেশাল প্যাকেজ': '21-Day Super Deluxe Umrah Special Package',
  '১৪ দিনের ইকোনমি সাশ্রয়ী উমরাহ কাফেলা': '14-Day Economy Budget Umrah Caravan',
  '১২ দিনের ভিআইপি ৫-স্টার উমরাহ এক্সক্লুসিভ': '12-Day VIP 5-Star Exclusive Umrah',
  'শিলচর (Silchar) / গুয়াহাটি': 'Silchar / Guwahati',
  'শিলচর / কলকাতা (Kolkata)': 'Silchar / Kolkata',
  'গুয়াহাটি (GAU) / শিলচর': 'Guwahati (GAU) / Silchar',
  'কলকাতা (CCU) / দিল্লি (DEL)': 'Kolkata (CCU) / Delhi (DEL)',
  'রমজান ২০২৬ (পবিত্র লাইলাতুল কদর ও শেষ দশক)': 'Ramadan 2026 (Laylatul Qadr & Last 10 Days)',
  'প্রতি মাসের ১৫ ও ২৮ তারিখ': '15th & 28th of every month',
  'আসন্ন শবে বরাত ও রজব কাফেলা': 'Upcoming Shab-e-Barat & Rajab Caravan',
  'প্রতি সপ্তাহে নিয়মিত ফ্লাইট': 'Regular Weekly Departures',
  'প্রতি সপ্তাহে নিয়মিত ফ্লাইট': 'Regular Weekly Departures',
  'হোটেল আনোয়ার আল দিয়াহ (৩ তারকা)': 'Hotel Anwar Al Diya (3-Star)',
  'হোটেল আনোয়ার আল দিয়াহ': 'Hotel Anwar Al Diya',
  'হোটেল দার আল তাকাওয়া (৩ তারকা)': 'Hotel Dar Al Taqwa (3-Star)',
  'হোটেল দার আল তাকাওয়া': 'Hotel Dar Al Taqwa',
  'হোটেল ফাহাদ গ্র্যান্ড (৪ তারকা)': 'Hotel Fahad Grand (4-Star)',
  'হোটেল ফাহাদ গ্র্যান্ড': 'Hotel Fahad Grand',
  'হোটেল রওজা ভিউ ইন্টারন্যাশনাল (৪ তারকা)': 'Hotel Rawdah View International (4-Star)',
  'হোটেল রওজা ভিউ ইন্টারন্যাশনাল': 'Hotel Rawdah View International',
  'হোটেল বরকত আল মাক্কি (ইকোনমি)': 'Hotel Barakat Al Makki (Economy)',
  'হোটেল বরকত আল মাক্ক (হকোনাম)': 'Hotel Barakat Al Makki (Economy)',
  'হোটেল মানারাত মদিনা': 'Hotel Manarat Madinah',
  'সুইসোটেল আল মাকাম / ক্লক টাওয়ার (৫ তারকা)': 'Swissôtel Al Maqam / Clock Tower (5-Star)',
  'সুইসোতেল আল মাকাম / ক্লক টাওয়ার (৫ তারকা)': 'Swissôtel Al Maqam / Clock Tower (5-Star)',
  'আনওয়ার আল মদিনা মোভেনপিক (৫ তারকা)': 'Anwar Al Madinah Mövenpick (5-Star)',
  'আনোয়ার আল মদিনা মোভেনপিক (৫ তারকা)': 'Anwar Al Madinah Mövenpick (5-Star)',
  'সৌদি উমরাহ ভিসা ও ইন্সুরেন্স': 'Saudi Umrah Visa & Health Insurance',
  'রিটার্ন এয়ার টিকিট (শিলচর/গুয়াহাটি-জেদ্দা)': 'Return Air Ticket (Silchar/Guwahati - Jeddah)',
  'মক্কা ও মদিনায় ৩-স্টার হোটেল': '3-Star Hotel in Makkah & Madinah',
  '৩ বেলা সুস্বাদু দেশি বুফে খাবার': '3 Times Daily Indian Buffet Meals',
  'মক্কা ও মদিনার ঐতিহাসিক স্থান জিয়ারত': 'Historic Ziyarat in Makkah & Madinah',
  'শীতাতপ নিয়ন্ত্রিত ভিআইপি বাসে যাতায়াত': 'Air-Conditioned VIP Bus Transport',
  'অভিজ্ঞ আলেম ও মুয়াল্লিম গাইড': 'Experienced Islamic Scholar & Guide',
  '৫ লিটার পবিত্র জমজম পানি উপহার': '5 Litres Holy Zamzam Water Gift',
  'উমরাহ কিট, ইহরাম ও ট্রাভেল ব্যাগ': 'Umrah Kit, Ihram & Travel Bag',
  'সৌদি আরব বায়োমেট্রিক ও ভিসা প্রসেসিং': 'Saudi Biometrics & Visa Processing',
  'আন্তর্জাতিক এয়ারলাইন্স টিকিট': 'International Airlines Flight Ticket',
  'হারাম শরীফের খুব কাছে ৪-স্টার হোটেল': '4-Star Hotel very close to Haram',
  '৩ বেলা দেশি ভাত, মাছ-মাংস ও নাস্তা': '3 Times Daily Indian Meals & Breakfast',
  'ঐতিহাসিক বদর প্রান্তর, উহুদ ও জাবালে নূর জিয়ারত': 'Ziyarat of historic Badr, Uhud & Jabal al-Noor',
  'মুয়াল্লিমের নেতৃত্বে তাওয়াফ ও সাঈ': 'Tawaf & Saee guided by experienced Muallim',
  '৫ লিটার খাঁটি জমজম পানি': '5 Litres Pure Zamzam Water',
  'লাগেজ ট্রলি ব্যাগ ও পাসপোর্ট পাউচ': 'Luggage Trolley Bag & Passport Pouch',
  'মক্কা-মদিনা রুটে হারামাইন হাই-স্পিড ট্রেন সুবিধা': 'Haramain High-Speed Bullet Train Experience',
  'উমরাহ ভিসা ও হেলথ ইন্সুরেন্স': 'Umrah Visa & Health Insurance',
  'উমরাহ ভিসা ও হেলথ ইন্স্যুরেন্স': 'Umrah Visa & Health Insurance',
  'রিটার্ন ফ্লাইটের টিকিট': 'Return Flight Air Tickets',
  'মক্কা ও মদিনা হোটেল শেয়ারিং': 'Sharing Hotel in Makkah & Madinah',
  'মক্কা ও মদিনা হোটেল শেয়ারিং': 'Sharing Hotel in Makkah & Madinah',
  '৩ বেলা বাংলা খাবার সরবরাহ': '3 Times Daily Meals',
  'মক্কার আরাফাত, মিনা, মুজদালিফা জিয়ারত': 'Ziyarat to Arafat, Mina & Muzdalifah',
  'মদিনার মসজিদে কুবা ও কেবলাতাইন জিয়ারত': 'Ziyarat to Masjid Quba & Qiblatain in Madinah',
  '২৪ ঘণ্টা বাস শাটল সার্ভিস ও গাইড': '24-Hour Shuttle Service & Guide',
  '৫ লিটার জমজম পানি গ্যারান্টিড': '5 Litres Zamzam Water Guaranteed',
  'মাল্টিপল এন্ট্রি ১ বছরের ট্যুরিস্ট/উমরাহ ভিসা': 'Multiple Entry 1-Year Tourist/Umrah Visa',
  'এমিরেটস বা সাউদিয়া এয়ারলাইন্স বিজনেস/ইকোনমি টিকিট': 'Emirates or Saudia Airlines Business/Economy Tickets',
  'এমিরেটস বা সাউদিয়া এয়ারলাইন্স বিজনেস/ইকোনমি টিকিট': 'Emirates or Saudia Airlines Business/Economy Tickets',
  'ক্লক টাওয়ার ও হারামের আঙিনায় ৫-স্টার লাক্সারি হোটেল': '5-Star Luxury Hotel at Clock Tower / Courtyard of Haram',
  'ক্লক টাওয়ার ও হারামের আঙিনায় ৫-স্টার লাক্সারি হোটেল': '5-Star Luxury Hotel at Clock Tower / Courtyard of Haram',
  '৫ তারকা হোটেল ইন্টারন্যাশনাল বুফে ব্রেকফাস্ট ও ডিনার': '5-Star Hotel International Buffet Breakfast & Dinner',
  'প্রাইভেট জিএমসি / লাক্সারি কারে বিমানবন্দর পিকআপ ও জিয়ারত': 'Private GMC / Luxury Car Airport Transfers & Ziyarat',
  'ভিআইপি হারামাইন বুলেট ট্রেন ফার্স্ট ক্লাস টিকিট': 'VIP Haramain High-Speed Train First Class Tickets',
  'বিশেষ মোয়াল্লিম ও সার্বক্ষণিক বাংলা/উর্দু দোভাষী': 'Personal Scholar Guide & Dedicated Interpreter',
  '৫ লিটার জমজম পানি ও এক্সক্লুসিভ উপহার সামগ্রী': '5 Litres Zamzam Water & Exclusive Gift Hamper',
  'উমরাহ ভিসা': 'Umrah Visa',
  'হোটেল': 'Hotel',
  'জিয়ারত': 'Ziyarat',
  'গুয়াহাটি': 'Guwahati',
  'কলকাতা': 'Kolkata',
  'দিল্লি': 'Delhi',
  'শীঘ্রই': 'Coming Soon',
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

  // Umrah Packages & Travel Agencies
  'আল-হারামাইন ট্যুরস অ্যান্ড ট্রাভেলস (Al-Haramain Tours)': 'الحرمین ٹورز اینڈ ٹریولز',
  'বরাক ভ্যালি হজ ও উমরাহ সার্ভিস (Barak Umrah Services)': 'بارک ویلی حج و عمرہ سروسز',
  'জমজম ইন্টারন্যাশনাল ট্রাভেলস (Zamzam Travels)': 'زم زم انٹرنیشنل ٹریولز',
  'বেঙ্গল ও নর্থ-ইস্ট কাফেলা ট্রাভেলস (Bengal Umrah Group)': 'بنگال و نارتھ ایسٹ قافلہ ٹریولز',
  'সোনাই রোড, শিলচর, আসাম (Silchar)': 'سونائی روڈ، سلچر، آسام',
  'স্টেশন রোড, করিমগঞ্জ, আসাম (Karimganj)': 'اسٹیشن روڈ، کریم گنج، آسام',
  'পল্টন বাজার, গুয়াহাটি (Guwahati) ও বদরপুর': 'پلٹن بازار، گوہاٹی اور بد رپور',
  'পার্ক সার্কাস, কলকাতা (Kolkata) ও শিলচর যোগাযোগ কেন্দ্র': 'پارک سرکس، کولکتہ اور سلچر رابطہ مرکز',
  '১৫ দিনের বরকতময় রমজান উমরাহ কাফেলা ২০২৬': '۱۵ روزہ مبارک رمضان عمرہ قافلہ ۲۰۲۶',
  '২১ দিনের সুপার ডিলাক্স উমরাহ স্পেশাল প্যাকেজ': '۲۱ روزہ سپر ڈیلکس عمرہ اسپیشل پیکیج',
  '১৪ দিনের ইকোনমি সাশ্রয়ী উমরাহ কাফেলা': '۱۴ روزہ معاشی کم خرچ عمرہ قافلہ',
  '১২ দিনের ভিআইপি ৫-স্টার উমরাহ এক্সক্লুসিভ': '۱۲ روزہ وی آئی پی ۵-اسٹار خصوصی عمرہ',
  'শিলচর (Silchar) / গুয়াহাটি': 'سلچر / گوہاٹی',
  'শিলচর / কলকাতা (Kolkata)': 'سلچر / کولکتہ',
  'গুয়াহাটি (GAU) / শিলচর': 'گوہاٹی / سلچر',
  'কলকাতা (CCU) / দিল্লি (DEL)': 'کولکتہ (CCU) / دہلی (DEL)',
  'রমজান ২০২৬ (পবিত্র লাইলাতুল কদর ও শেষ দশক)': 'رمضان ۲۰۲۶ (لیلۃ القدر اور آخری عشرہ)',
  'প্রতি মাসের ১৫ ও ২৮ তারিখ': 'ہر مہینے کی ۱۵ اور ۲۸ تاریخ',
  'আসন্ন শবে বরাত ও রজব কাফেলা': 'شب برات اور رجب کا خصوصی قافلہ',
  'প্রতি সপ্তাহে নিয়মিত ফ্লাইট': 'ہر ہفتے باقاعدہ پروازیں',
  'প্রতি সপ্তাহে নিয়মিত ফ্লাইট': 'ہر ہفتے باقاعدہ پروازیں',
  'হোটেল আনোয়ার আল দিয়াহ (৩ তারকা)': 'ہوٹل انوار الدیہ (۳-اسٹار)',
  'হোটেল আনোয়ার আল দিয়াহ': 'ہوٹل انوار الدیہ',
  'হোটেল দার আল তাকাওয়া (৩ তারকা)': 'ہوٹل دار التقویٰ (۳-اسটار)',
  'হোটেল দার আল তাকাওয়া': 'ہوٹل دار التقویٰ',
  'হোটেল ফাহাদ গ্র্যান্ড (৪ তারকা)': 'ہوٹل فہد گرینڈ (۴-اسটار)',
  'হোটেল ফাহাদ গ্র্যান্ড': 'ہوٹل فہد گرینڈ',
  'হোটেল রওজা ভিউ ইন্টারন্যাশনাল (৪ তারকা)': 'ہوٹل روضہ ویو انٹرنیشنل (۴-اسটار)',
  'হোটেল রওজা ভিউ ইন্টারন্যাশনাল': 'ہوٹل روضہ ویو انٹرنیشنل',
  'হোটেল বরকত আল মাক্কি (ইকোনমি)': 'ہوٹل برکت المکی (اکانومی)',
  'হোটেল বরকত আল মাক্ক (হকোনাম)': 'ہوٹل برکت المکی (اکانومی)',
  'হোটেল মানারাত মদিনা': 'ہوٹل منارات مدینہ',
  'সুইসোটেল আল মাকাম / ক্লক টাওয়ার (৫ তারকা)': 'سوئس ہوٹل المقام / کلاک ٹاور (۵-اسٹار)',
  'সুইসোতেল আল মাকাম / ক্লক টাওয়ার (৫ তারকা)': 'سوئس ہوٹل المقام / کلاک ٹاور (۵-اسটار)',
  'আনওয়ার আল মদিনা মোভেনপিক (৫ তারকা)': 'انوار المدینہ موون پک (۵-اسٹار)',
  'আনোয়ার আল মদিনা মোভেনপিক (৫ তারকা)': 'انوار المدینہ موون پک (۵-اسٹار)',
  'সৌদি উমরাহ ভিসা ও ইন্সুরেন্স': 'سعودی عمرہ ویزا اور انشورنس',
  'রিটার্ন এয়ার টিকিট (শিলচর/গুয়াহাটি-জেদ্দা)': 'ریٹرن ایئر ٹکٹ (سلچر/گوہاٹی تا جدہ)',
  'মক্কা ও মদিনায় ৩-স্টার হোটেল': 'مکہ اور مدینہ میں ۳-اسٹار ہوٹل',
  '৩ বেলা সুস্বাদু দেশি বুফে খাবার': 'تین وقت کا لذیذ دیسی بوفے کھانا',
  'মক্কা ও মদিনার ঐতিহাসিক স্থান জিয়ারত': 'مکہ و مدینہ کے تاریخی مقامات کی زیارت',
  'শীতাতপ নিয়ন্ত্রিত ভিআইপি বাসে যাতায়াত': 'ایئرکنڈیشنڈ وی آئی پی بس ٹرانسپورٹ',
  'অভিজ্ঞ আলেম ও মুয়াল্লিম গাইড': 'تجربہ کار عالم اور معلم گائیڈ',
  '৫ লিটার পবিত্র জমজম পানি উপহার': '۵ لیٹر آب زم زم ہدیہ',
  'উমরাহ কিট, ইহরাম ও ট্রাভেল ব্যাগ': 'عمرہ کٹ، احرام اور ٹریول بیگ',
  'সৌদি আরব বায়োমেট্রিক ও ভিসা প্রসেসিং': 'سعودی بایومیٹرک اور ویزا پروسیسنگ',
  'আন্তর্জাতিক এয়ারলাইন্স টিকিট': 'بین الاقوامی ایئرلائنز کا ٹکٹ',
  'হারাম শরীফের খুব কাছে ৪-স্টার হোটেল': 'حرم شریف کے قریب ۴-اسٹار ہوٹل',
  '৩ বেলা দেশি ভাত, মাছ-মাংস ও নাস্তা': 'تین وقت کا دیسی کھانا اور ناشتہ',
  'ঐতিহাসিক বদর প্রান্তর, উহুদ ও জাবালে নূর জিয়ারত': 'تاریخی بدر، احد اور جبل نور کی زیارت',
  'মুয়াল্লিমের নেতৃত্বে তাওয়াফ ও সাঈ': 'معلم کی زیر نگرانی طواف اور سعی',
  '৫ লিটার খাঁটি জমজম পানি': '۵ لیٹر خالص آب زم زم',
  'লাগেজ ট্রলি ব্যাগ ও পাসপোর্ট পাউচ': 'لگیج ٹرالی بیگ اور پاسپورٹ پاؤچ',
  'মক্কা-মদিনা রুটে হারামাইন হাই-স্পিড ট্রেন সুবিধা': 'حرمین ہائی اسپیڈ ٹرین کی سہولت',
  'উমরাহ ভিসা ও হেলথ ইন্সুরেন্স': 'عمرہ ویزا اور ہیلتھ انشورنس',
  'উমরাহ ভিসা ও হেলথ ইন্স্যুরেন্স': 'عمرہ ویزا اور ہیلتھ انشورنس',
  'রিটার্ন ফ্লাইটের টিকিট': 'ریٹرن فلائٹ ٹکٹ',
  'মক্কা ও মদিনা হোটেল শেয়ারিং': 'مکہ اور مدینہ میں شیئرنگ ہوٹل',
  'মক্কা ও মদিনা হোটেল শেয়ারিং': 'مکہ اور مدینہ میں شیئرنگ ہوٹل',
  '৩ বেলা বাংলা খাবার সরবরাহ': 'تین وقت کا کھانا',
  'মক্কার আরাফাত, মিনা, মুজদালিফা জিয়ারত': 'عرفات، منیٰ اور مزدلفہ کی زیارت',
  'মদিনার মসজিদে কুবা ও কেবলাতাইন জিয়ারত': 'مدینہ میں مسجد قباء اور قبلتین کی زیارت',
  '২৪ ঘণ্টা বাস শাটল সার্ভিস ও গাইড': '۲۴ گھنٹے شٹل بس سروس اور رہنمائی',
  '৫ লিটার জমজম পানি গ্যারান্টিড': '۵ لیٹر آب زم زم',
  'মাল্টিপল এন্ট্রি ১ বছরের ট্যুরিস্ট/উমরাহ ভিসা': 'ایک سال کا ملٹیپل انٹری عمرہ ویزا',
  'এমিরেটস বা সাউদিয়া এয়ারলাইন্স বিজনেস/ইকোনমি টিকিট': 'امارات یا سعودیہ ایئرلائنز بزنس/اکانومی ٹکٹ',
  'এমিরেটস বা সাউদিয়া এয়ারলাইন্স বিজনেস/ইকোনমি টিকিট': 'امارات یا سعودیہ ایئرلائنز بزنس/اکانومی ٹکٹ',
  'ক্লক টাওয়ার ও হারামের আঙিনায় ৫-স্টার লাক্সারি হোটেল': 'کلاک ٹاور اور حرم کے احاطے میں ۵-اسٹار لگژری ہوٹل',
  'ক্লক টাওয়ার ও হারামের আঙিনায় ৫-স্টার লাক্সারি হোটেল': 'کلاک ٹاور اور حرم کے احاطے میں ۵-اسٹار لگژری ہوٹل',
  '৫ তারকা হোটেল ইন্টারন্যাশনাল বুফে ব্রেকফাস্ট ও ডিনার': '۵-اسٹار ہوٹل بین الاقوامی بوفے ناشتہ اور ڈنر',
  'প্রাইভেট জিএমসি / লাক্সারি কারে বিমানবন্দর পিকআপ ও জিয়ারত': 'پرائیویٹ جی ایم سی لگژری کار ایئرپورٹ ٹرانسفر',
  'ভিআইপি হারামাইন বুলেট ট্রেন ফার্স্ট ক্লাস টিকিট': 'وی آئی پی حرمین بلٹ ٹرین فرسٹ کلاس ٹکٹ',
  'বিশেষ মোয়াল্লিম ও সার্বক্ষণিক বাংলা/উর্দু দোভাষী': 'خصوصی معلم اور مترجم کی سہولت',
  '৫ লিটার জমজম পানি ও এক্সক্লুসিভ উপহার সামগ্রী': '۵ لیٹر آب زم زم اور خصوصی تحائف',
  'উমরাহ ভিসা': 'عمرہ ویزا',
  'হোটেল': 'ہوٹل',
  'জিয়ারত': 'زیارت',
  'গুয়াহাটি': 'گوہاٹی',
  'কলকাতা': 'کولکتہ',
  'দিল্লি': 'دہلی',
  'শীঘ্রই': 'جلد ہی',
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

export function getUmrahDisplay(pkg: UmrahPackage, lang: AppLanguage | string = 'bn') {
  if (lang === 'bn') {
    return {
      companyName: pkg.companyName,
      officeLocation: pkg.officeLocation,
      packageTitle: pkg.packageTitle,
      departureCity: pkg.departureCity,
      departureMonthOrDate: pkg.departureMonthOrDate,
      makkahHotel: pkg.makkahHotel,
      madinahHotel: pkg.madinahHotel,
      inclusions: pkg.inclusions,
      description: pkg.description || '',
    };
  }

  const isEn = lang === 'en';
  const isUr = lang === 'ur';

  return {
    companyName:
      (isEn ? pkg.companyNameEn : isUr ? pkg.companyNameUr : undefined) ||
      translateText(pkg.companyName, lang),
    officeLocation:
      (isEn ? pkg.officeLocationEn : isUr ? pkg.officeLocationUr : undefined) ||
      translateText(pkg.officeLocation, lang),
    packageTitle:
      (isEn ? pkg.packageTitleEn : isUr ? pkg.packageTitleUr : undefined) ||
      translateText(pkg.packageTitle, lang),
    departureCity:
      (isEn ? pkg.departureCityEn : isUr ? pkg.departureCityUr : undefined) ||
      translateText(pkg.departureCity, lang),
    departureMonthOrDate:
      (isEn ? pkg.departureMonthOrDateEn : isUr ? pkg.departureMonthOrDateUr : undefined) ||
      translateText(pkg.departureMonthOrDate, lang),
    makkahHotel:
      (isEn ? pkg.makkahHotelEn : isUr ? pkg.makkahHotelUr : undefined) ||
      translateText(pkg.makkahHotel, lang),
    madinahHotel:
      (isEn ? pkg.madinahHotelEn : isUr ? pkg.madinahHotelUr : undefined) ||
      translateText(pkg.madinahHotel, lang),
    inclusions:
      (isEn ? pkg.inclusionsEn : isUr ? pkg.inclusionsUr : undefined) ||
      translateArray(pkg.inclusions, lang),
    description:
      (isEn ? pkg.descriptionEn : isUr ? pkg.descriptionUr : undefined) ||
      translateText(pkg.description, lang),
  };
}

