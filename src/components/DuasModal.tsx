import React, { useState } from 'react';
import { X, Copy, Check, Search, BookOpen } from 'lucide-react';
import { AppLanguage } from '../types';

interface DuasModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
}

interface DuaItem {
  id: string;
  category: { en: string; ur: string; bn: string };
  title: { en: string; ur: string; bn: string };
  arabic: string;
  pronunciation: { en: string; ur: string; bn: string };
  meaning: { en: string; ur: string; bn: string };
  reference: { en: string; ur: string; bn: string };
}

const DUAS_DATABASE: DuaItem[] = [
  {
    id: 'sleep-wake',
    category: { en: 'Daily', ur: 'روزمرہ', bn: 'দৈনন্দিন' },
    title: {
      en: 'Upon Waking Up from Sleep',
      ur: 'نیند سے بیدار ہونے کی دعا',
      bn: 'ঘুম থেকে জাগ্রত হওয়ার দোয়া',
    },
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    pronunciation: {
      en: 'Alhamdu lillahil-ladhi ahyana ba’da ma amatana wa ilayhin-nushoor.',
      ur: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
      bn: 'আলহামদু লিল্লাহিল্লাজি আহ্ইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশুর।',
    },
    meaning: {
      en: 'All praise is for Allah Who gave us life after having taken it from us and unto Him is the resurrection.',
      ur: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے (سلانے) کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔',
      bn: 'সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদেরকে মৃত্যু (ঘুম)-র পর পুনরায় জীবন দান করলেন এবং তাঁরই কাছে সকলের পুনরুত্থান।',
    },
    reference: {
      en: 'Sahih al-Bukhari: 6312',
      ur: 'صحیح بخاری: 6312',
      bn: 'সহিহ বুখারি: ৬৩১২',
    },
  },
  {
    id: 'fasting-iftar',
    category: { en: 'Fasting', ur: 'روزہ', bn: 'রোজা' },
    title: {
      en: 'Sunnah Dua at Iftar (Breaking the Fast)',
      ur: 'افطار کے وقت کی مسنون دعا',
      bn: 'ইফতারের সুন্নত দোয়া',
    },
    arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
    pronunciation: {
      en: 'Dhahaba adh-dhama’u wabtallatil-’urooqu wa thabatal-ajru in sha Allah.',
      ur: 'ذہب الظمأ وابتلت العروق وثبت الأجر إن شاء الله',
      bn: 'যাহাবাজ জামা’উ, ওয়াবতাল্লাতিল উরূক, ওয়া সাবাতাল আজরু ইনশাআল্লাহ।',
    },
    meaning: {
      en: 'The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.',
      ur: 'پیاس چلی گئی، رگیں تر ہو گئیں اور اجر ثابت ہو گیا اگر اللہ نے چاہا۔',
      bn: 'পিপাসা দূর হলো, শিরা-উপশিরা সিক্ত হলো এবং আল্লাহর ইচ্ছায় প্রতিদান নিশ্চিত হলো।',
    },
    reference: {
      en: 'Sunan Abi Dawud: 2357',
      ur: 'سنن ابو داؤد: 2357',
      bn: 'সুনানে আবু দাউদ: ২৩৫৭',
    },
  },
  {
    id: 'sehri-niyyat',
    category: { en: 'Fasting', ur: 'روزہ', bn: 'রোজা' },
    title: {
      en: 'Intention (Niyyah) for Fasting',
      ur: 'روزے کی نیت اور دعا',
      bn: 'রোজার নিয়ত ও দোয়া',
    },
    arabic: 'نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ',
    pronunciation: {
      en: 'Nawaytu an asooma ghadan min shahri Ramadan al-mubaraki fardan laka ya Allah.',
      ur: 'نویت ان اصوم غدا من شہر رمضان المبارک فرضا لک یا اللہ',
      bn: 'নাওয়াইতু আন আসুমা গাদাম মিন শাহরি রামাদানাল মুবারাকি ফারদাল্লাকা ইয়া আল্লাহ।',
    },
    meaning: {
      en: 'O Allah! I intend to observe the obligatory fast tomorrow in the blessed month of Ramadan for Your pleasure.',
      ur: 'اے اللہ! میں کل کے لیے ماہِ رمضان المبارک کے فرض روزے کی تیرے لیے نیت کرتا ہوں۔',
      bn: 'হে আল্লাহ! আমি আগামীকাল পবিত্র মাহে রমজানের তোমার সন্তুষ্টির উদ্দেশ্যে ফরজ রোজা রাখার দৃঢ় সংকল্প করলাম।',
    },
    reference: {
      en: 'Islamic Fiqh Jurisprudence',
      ur: 'کتب فقہ اسلامی',
      bn: 'ইসলামিক ফিকহ সংকলন',
    },
  },
  {
    id: 'protection-distress',
    category: { en: 'Protection', ur: 'حفاظت', bn: 'বিপদ-আপদ' },
    title: {
      en: 'Dua for Protection from All Harm',
      ur: 'ہر قسم کے شر اور نقصان سے حفاظت کی دعا',
      bn: 'বিপদ-আপদ ও অনিষ্ট থেকে বাঁচার দোয়া',
    },
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    pronunciation: {
      en: 'Bismillahil-ladhi la yadurru ma’as-mihi shay’un fil-ardi wala fis-sama’i, wa huwas-Sami’ul-’Aleem.',
      ur: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم',
      bn: 'বিসমিল্লাহিল্লাজি লা ইয়াদুররু মা’আসমিহি শাইয়ুন ফিল আরদি ওয়ালা ফিস-সামা’ই, ওয়াহুয়াস সামিউল আলিম।',
    },
    meaning: {
      en: 'In the Name of Allah, with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
      ur: 'اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی اور وہی خوب سننے والا جاننے والا ہے۔',
      bn: 'আল্লাহর নামে, যাঁর নামের বরকতে আসমান ও জমিনের কোনো কিছুই অনিষ্ট সাধন করতে পারে না; তিনি সর্বশ্রোতা, সর্বজ্ঞ।',
    },
    reference: {
      en: 'Jami’ at-Tirmidhi: 3310',
      ur: 'جامع ترمذی: 3310',
      bn: 'সুনানে তিরমিজি: ৩৩১০',
    },
  },
  {
    id: 'forgiveness-sayyidul',
    category: { en: 'Forgiveness', ur: 'مغفرت', bn: 'মাগফিরাত' },
    title: {
      en: 'Sayyidul Istighfar (Master of Forgiveness)',
      ur: 'سید الاستغفار (استغفار کی سب سے افضل دعا)',
      bn: 'সাইয়্যিদুল ইস্তিগফার (শ্রেষ্ঠ ক্ষমাপ্রার্থনা)',
    },
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    pronunciation: {
      en: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana ‘abduka, wa ana ‘ala ‘ahdika wa wa’dika mastata’tu, a’udhu bika min sharri ma sana’tu, aboo’u laka bini’matika ‘alayya, wa aboo’u bidhambi faghfir li fa’innahu la yaghfirudh-dhunooba illa ant.',
      ur: 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك...',
      bn: 'আল্লাহুম্মা আনতা রব্বি লা ইলাহা ইল্লা আনতা, খালাকতানি ওয়া আনা আবদুকা, ওয়া আনা আলা আহদিকা ওয়া ওয়া’দিকা মাস্তাত্বা’তু, আউজু বিকা মিন শাররি মা সানা’তু, আবূউ লাকা বিনি’মাতিকা আলাইয়্যা, ওয়া আবূউ বিজাম্বি ফাগফিরলি, ফাইন্নাহু লা ইয়াগফিরুজ জুনুবা ইল্লা আনতা।',
    },
    meaning: {
      en: 'O Allah, You are my Lord! None has the right to be worshipped but You. You created me and I am Your slave, and I am faithful to my covenant and my promise as much as I can. I seek refuge in You from all the evil I have done. I acknowledge before You all the blessings You have bestowed upon me, and I confess to You all my sins. So I entreat You to forgive me, for nobody can forgive sins except You.',
      ur: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں اور تیرے عہد اور وعدے پر جہاں تک مجھ سے ہو سکے قائم ہوں۔ میں نے جو برائیاں کیں ان کے شر سے تیری پناہ مانگتا ہوں۔ اپنے اوپر تیری نعمتوں کا اعتراف کرتا ہوں اور اپنے گناہوں کا اعتراف کرتا ہوں۔ پس مجھے بخش دے، یقیناً تیرے سوا گناہوں کو کوئی نہیں بخش سکتا۔',
      bn: 'হে আল্লাহ! আপনি আমার রব, আপনি ছাড়া সত্য কোনো মাবুদ নেই। আপনি আমাকে সৃষ্টি করেছেন, আর আমি আপনার বান্দা। আমি আমার সাধ্যমতো আপনার অঙ্গীকার ও প্রতিশ্রুতিতে অবিচল আছি। আমার কৃতকর্মের অনিষ্ট থেকে আপনার আশ্রয় চাই। আমার ওপর আপনার নিয়ামত স্বীকার করছি এবং আমার গুনাহ স্বীকার করছি। অতএব আমাকে ক্ষমা করুন, কেননা আপনি ছাড়া গুনাহ ক্ষমা করার কেউ নেই।',
    },
    reference: {
      en: 'Sahih al-Bukhari: 6306',
      ur: 'صحیح بخاری: 6306',
      bn: 'সহিহ বুখারি: ৬৩০৬',
    },
  },
  {
    id: 'mosque-enter',
    category: { en: 'Prayer', ur: 'نماز', bn: 'নামাজ' },
    title: {
      en: 'Dua When Entering the Mosque',
      ur: 'مسجد میں داخل ہونے کی دعا',
      bn: 'মসজিদে প্রবেশের দোয়া',
    },
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    pronunciation: {
      en: 'Allahumma-ftah lee abwaba rahmatik.',
      ur: 'اللهم افتح لي أبواب رحمتك',
      bn: 'আল্লাহুম্মাফ তাহলী আবওয়াবা রহমাতিকা।',
    },
    meaning: {
      en: 'O Allah, open the gates of Your mercy for me.',
      ur: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
      bn: 'হে আল্লাহ! আমার জন্য আপনার রহমতের দুয়ারসমূহ উন্মুক্ত করে দিন।',
    },
    reference: {
      en: 'Sahih Muslim: 713',
      ur: 'صحیح مسلم: 713',
      bn: 'সহিহ মুসলিম: ৭১৩',
    },
  },
];

export const DuasModal: React.FC<DuasModalProps> = ({ isOpen, onClose, lang = 'en' }) => {
  const [selectedCatKey, setSelectedCatKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: lang === 'ur' ? 'تمام دعائیں' : lang === 'bn' ? 'সব দোয়া' : 'All Duas' },
    { key: 'Fasting', label: lang === 'ur' ? 'روزہ' : lang === 'bn' ? 'রোজা' : 'Fasting' },
    { key: 'Daily', label: lang === 'ur' ? 'روزمرہ' : lang === 'bn' ? 'দৈনন্দিন' : 'Daily' },
    { key: 'Protection', label: lang === 'ur' ? 'حفاظت' : lang === 'bn' ? 'বিপদ-আপদ' : 'Protection' },
    { key: 'Forgiveness', label: lang === 'ur' ? 'مغفرت' : lang === 'bn' ? 'মাগফিরাত' : 'Forgiveness' },
    { key: 'Prayer', label: lang === 'ur' ? 'نماز' : lang === 'bn' ? 'নামাজ' : 'Prayer' },
  ];

  const filteredDuas = DUAS_DATABASE.filter((d) => {
    const matchCat = selectedCatKey === 'all' || d.category.en === selectedCatKey;
    const title = d.title[lang] || d.title.en;
    const meaning = d.meaning[lang] || d.meaning.en;
    const q = searchQuery.toLowerCase();
    const matchQuery =
      !searchQuery ||
      title.toLowerCase().includes(q) ||
      meaning.toLowerCase().includes(q) ||
      d.arabic.includes(searchQuery);
    return matchCat && matchQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modalTitle =
    lang === 'ur'
      ? 'مسنون دعائیں اور مناجات'
      : lang === 'bn'
      ? 'মাসনূন দোয়া ও মোনাজাত (Duas)'
      : 'Authentic Masnoon Duas';

  const modalSubtitle =
    lang === 'ur'
      ? 'حصن المسلم اور احادیث صحیحہ سے منتخب دعائیں'
      : lang === 'bn'
      ? 'হিসনুল মুসলিম ও সহিহ হাদিস থেকে সংগৃহীত প্রয়োজনীয় দোয়াসমূহ'
      : 'Essential prayers compiled from Hisnul Muslim and authentic Hadith';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#09332E] border border-[#E2A336]/30 text-white w-full max-w-xl max-h-[90vh] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${lang === 'ur' ? 'left-4' : 'right-4'} p-2 rounded-full text-[#90A8A3] hover:text-white hover:bg-white/10 transition-colors`}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🤲</span>
          <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
        </div>
        <p className="text-xs text-[#90A8A3] mb-4">{modalSubtitle}</p>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search
            className={`w-4 h-4 text-[#90A8A3] absolute top-1/2 -translate-y-1/2 ${
              lang === 'ur' ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'ur'
                ? 'دعا تلاش کریں (عنوان، معنی یا عربی)...'
                : lang === 'bn'
                ? 'দোয়া খুঁজুন (নাম বা অর্থ দিয়ে)...'
                : 'Search duas (title or meaning)...'
            }
            className={`w-full bg-[#03221F] border border-white/10 rounded-xl py-2 text-sm text-white placeholder-[#90A8A3] focus:outline-none focus:border-[#E2A336] ${
              lang === 'ur' ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCatKey(cat.key)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
                selectedCatKey === cat.key
                  ? 'bg-[#E2A336] text-[#03221F] font-bold shadow'
                  : 'bg-white/5 text-[#90A8A3] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Duas List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredDuas.length === 0 ? (
            <div className="text-center py-10 text-[#90A8A3] text-sm">
              {lang === 'ur' ? 'کوئی دعا نہیں ملی' : lang === 'bn' ? 'কোনো দোয়া পাওয়া যায়নি' : 'No duas found'}
            </div>
          ) : (
            filteredDuas.map((dua) => (
              <div
                key={dua.id}
                className="bg-[#03221F] border border-white/10 rounded-xl p-4 hover:border-[#E2A336]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#E2A336] bg-[#E2A336]/10 px-2 py-0.5 rounded-md">
                    {dua.category[lang] || dua.category.en}
                  </span>
                  <button
                    onClick={() => handleCopy(`${dua.arabic}\n\n${dua.meaning[lang]}`, dua.id)}
                    className="flex items-center gap-1 text-[11px] text-[#90A8A3] hover:text-white transition-colors"
                  >
                    {copiedId === dua.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">
                          {lang === 'ur' ? 'کاپی شدہ' : lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{lang === 'ur' ? 'کاپی' : lang === 'bn' ? 'কপি' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mb-2">{dua.title[lang] || dua.title.en}</h3>

                {/* Arabic */}
                <div
                  dir="rtl"
                  className="bg-black/30 rounded-lg p-3 text-right font-serif text-lg text-[#E2A336] leading-loose mb-2 border border-white/5"
                >
                  {dua.arabic}
                </div>

                {/* Pronunciation / Transliteration */}
                <p className="text-xs text-stone-300 italic mb-2">
                  <span className="font-semibold text-[#90A8A3] not-italic">
                    {lang === 'ur' ? 'تلفظ: ' : lang === 'bn' ? 'উচ্চারণ: ' : 'Pronunciation: '}
                  </span>
                  {dua.pronunciation[lang] || dua.pronunciation.en}
                </p>

                {/* Meaning */}
                <p className="text-xs text-[#90A8A3] leading-relaxed mb-2">
                  <span className="font-semibold text-white">
                    {lang === 'ur' ? 'ترجمہ: ' : lang === 'bn' ? 'অর্থ: ' : 'Meaning: '}
                  </span>
                  {dua.meaning[lang] || dua.meaning.en}
                </p>

                {/* Reference */}
                <div className="text-[10px] text-[#90A8A3]/70 pt-2 border-t border-white/5">
                  {dua.reference[lang] || dua.reference.en}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
