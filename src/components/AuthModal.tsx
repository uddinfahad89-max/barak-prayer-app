import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  LogOut,
  ShieldCheck,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { UserAccount, AuthMode } from '../types/auth';
import {
  registerWithEmailAndPin,
  loginWithEmailAndPin,
  updateUserPin,
  logoutUser,
} from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onUserChange: (user: UserAccount | null) => void;
  initialMode?: AuthMode;
  lang?: 'en' | 'bn' | 'ur';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  initialMode = 'signup',
  lang = 'bn',
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mPin, setMPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [district, setDistrict] = useState('Karimganj');
  const [phone, setPhone] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Forgot / Reset PIN fields
  const [resetEmail, setResetEmail] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // UI States
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode on initialMode change
  useEffect(() => {
    if (currentUser) {
      setMode('profile');
    } else {
      setMode(initialMode);
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, currentUser, isOpen]);

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!name.trim()) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter your full name'
          : lang === 'ur'
          ? 'براہ کرم اپنا پورا نام درج کریں'
          : 'দয়া করে আপনার নাম লিখুন'
      );
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter a valid email address'
          : lang === 'ur'
          ? 'براہ کرم درست ای میل پتہ درج کریں'
          : 'সঠিক ইমেইল এড্রেস প্রদান করুন'
      );
      return;
    }

    if (!/^\d{4,6}$/.test(mPin)) {
      setErrorMessage(
        lang === 'en'
          ? 'mPIN must be 4 to 6 numeric digits'
          : lang === 'ur'
          ? 'mPIN لازمی طور پر 4 سے 6 ہندسوں کا ہونا چاہئے'
          : 'mPIN অবশ্যই ৪ থেকে ৬ সংখ্যার নাম্বার হতে হবে'
      );
      return;
    }

    if (mPin !== confirmPin) {
      setErrorMessage(
        lang === 'en'
          ? 'mPIN and Confirm mPIN do not match'
          : lang === 'ur'
          ? 'mPIN اور تصدیقی mPIN مماثل نہیں ہیں'
          : 'mPIN এবং কনফার্ম mPIN দুটি মেলেনি'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerWithEmailAndPin({
        name,
        email,
        mPin,
        phone,
        district,
      });

      setIsSubmitting(false);
      if (res.success && res.user) {
        onUserChange(res.user);
        setSuccessMessage(
          lang === 'en'
            ? '🎉 Registration successful! Welcome to the Ummah portal.'
            : lang === 'ur'
            ? '🎉 رجسٹریشن کامیاب! پورٹل میں خوش آمدید۔'
            : '🎉 অভিনন্দন! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।'
        );
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!loginEmail.trim()) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter your registered email'
          : lang === 'ur'
          ? 'براہ کرم اپنا رجسٹرڈ ای میل درج کریں'
          : 'আপনার নিবন্ধিত ইমেইল লিখুন'
      );
      return;
    }

    if (!loginPin.trim()) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter your mPIN'
          : lang === 'ur'
          ? 'براہ کرم اپنا mPIN درج کریں'
          : 'আপনার গোপন mPIN লিখুন'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = loginWithEmailAndPin(loginEmail, loginPin);
      setIsSubmitting(false);

      if (res.success && res.user) {
        onUserChange(res.user);
        setSuccessMessage(
          lang === 'en'
            ? `Welcome back, ${res.user.name}!`
            : lang === 'ur'
            ? `خوش آمدید، ${res.user.name}!`
            : `স্বাগতম, ${res.user.name}! লগইন সফল হয়েছে।`
        );
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Login failed');
      }
    }, 400);
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMessage(
        lang === 'en'
          ? 'Please enter your registered email'
          : lang === 'ur'
          ? 'براہ کرم اپنا ای میل درج کریں'
          : 'আপনার নিবন্ধিত ইমেইল লিখুন'
      );
      return;
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      setErrorMessage(
        lang === 'en'
          ? 'New mPIN must be 4 to 6 numeric digits'
          : lang === 'ur'
          ? 'نیا mPIN 4 سے 6 ہندسوں کا ہونا چاہئے'
          : 'নতুন mPIN অবশ্যই ৪ থেকে ৬ সংখ্যার হতে হবে'
      );
      return;
    }

    if (newPin !== confirmNewPin) {
      setErrorMessage(
        lang === 'en'
          ? 'New mPIN and confirmation do not match'
          : lang === 'ur'
          ? 'نیا mPIN مماثل نہیں ہے'
          : 'নতুন mPIN এবং কনফার্ম mPIN মেলেনি'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = updateUserPin(resetEmail, newPin);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(
          lang === 'en'
            ? 'mPIN updated successfully! Please login with your new mPIN.'
            : lang === 'ur'
            ? 'mPIN کامیابی سے اپ ڈیٹ ہو گیا! براہ کرم لاگ ان کریں۔'
            : 'mPIN সফলভাবে পরিবর্তন হয়েছে! নতুন mPIN দিয়ে লগইন করুন।'
        );
        setLoginEmail(resetEmail);
        setLoginPin(newPin);
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Failed to update mPIN');
      }
    }, 400);
  };

  const handleLogout = () => {
    logoutUser();
    onUserChange(null);
    setMode('login');
    resetMessages();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#03221F] border border-emerald-800/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#03221F] via-[#09332E] to-[#03221F] border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E2A336]/20 border border-[#E2A336]/40 flex items-center justify-center text-[#E2A336]">
              {mode === 'profile' ? <User className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                {mode === 'signup' && (lang === 'en' ? 'New User Sign Up' : lang === 'ur' ? 'نیا صارف سائن اپ' : 'নতুন ব্যবহারকারী সাইন আপ')}
                {mode === 'login' && (lang === 'en' ? 'Login with mPIN' : lang === 'ur' ? 'mPIN کے ساتھ لاگ ان' : 'ইমেইল ও mPIN দিয়ে লগইন')}
                {mode === 'profile' && (lang === 'en' ? 'My User Profile' : lang === 'ur' ? 'میری پروفائل' : 'আমার একাউন্ট ও প্রোফাইল')}
                {mode === 'forgot_pin' && (lang === 'en' ? 'Reset mPIN' : lang === 'ur' ? 'mPIN دوبارہ ترتیب دیں' : 'mPIN রিসেট / পরিবর্তন')}
              </h2>
              <p className="text-[11px] text-emerald-300/80">
                {mode === 'signup' && (lang === 'en' ? 'Create an account with Email & 4-digit mPIN' : lang === 'ur' ? 'ای میل اور 4 ہندسوں والے mPIN کے ساتھ اکاؤنٹ بنائیں' : 'ইমেইল ও ৪ সংখ্যার গোপন mPIN দিয়ে একাউন্ট তৈরি করুন')}
                {mode === 'login' && (lang === 'en' ? 'Enter your registered email & mPIN' : lang === 'ur' ? 'اپنا رجسٹرڈ ای میل اور mPIN درج کریں' : 'আপনার নিবন্ধিত ইমেইল ও mPIN লিখুন')}
                {mode === 'profile' && (lang === 'en' ? 'Verified Member of Barak Valley Islamic Portal' : lang === 'ur' ? 'تصدیق شدہ ممبر' : 'বরাক ভ্যালি ইসলামিক পোর্টালের সদস্য')}
                {mode === 'forgot_pin' && (lang === 'en' ? 'Set a fresh 4-digit mPIN for your account' : lang === 'ur' ? 'نیا 4 ہندسوں والا mPIN سیٹ کریں' : 'আপনার একাউন্টের জন্য নতুন ৪ সংখ্যার mPIN দিন')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-400 hover:text-white hover:bg-emerald-900/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not logged in */}
        {!currentUser && (
          <div className="grid grid-cols-2 p-1.5 bg-[#09332E]/60 border-b border-emerald-900/60 gap-1.5">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                resetMessages();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#E2A336] text-[#03221F] shadow-xs'
                  : 'text-emerald-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Sign Up (New)' : lang === 'ur' ? 'سائن اپ (نیا)' : 'সাইন আপ (নতুন)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                resetMessages();
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#E2A336] text-[#03221F] shadow-xs'
                  : 'text-emerald-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Login' : lang === 'ur' ? 'لاگ ان' : 'লগইন'}</span>
            </button>
          </div>
        )}

        {/* Body Container */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/80 border border-rose-700/60 rounded-xl text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: SIGN UP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {lang === 'en' ? 'Full Name *' : lang === 'ur' ? 'پورا نام *' : 'আপনার পূর্ণ নাম *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Muhammad Fahad' : 'যেমন: মুহাম্মাদ ফাহাদ'}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {lang === 'en' ? 'Email Address *' : lang === 'ur' ? 'ای میل ایڈریس *' : 'ইমেইল এড্রেস *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              {/* mPIN and Confirm mPIN (Side by side) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-emerald-200">
                      {lang === 'en' ? '4-Digit mPIN *' : lang === 'ur' ? '4 ہندسوں کا mPIN *' : '৪ সংখ্যার mPIN *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-[10px] text-emerald-400 hover:text-white"
                    >
                      {showPin ? (
                        <EyeOff className="w-3.5 h-3.5 inline" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 inline" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#E2A336] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={mPin}
                      onChange={(e) => setMPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs tracking-widest font-mono text-center placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    {lang === 'en' ? 'Confirm mPIN *' : lang === 'ur' ? 'mPIN تصدیق کریں *' : 'পুনরায় mPIN দিন *'}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      required
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs tracking-widest font-mono text-center placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                    />
                  </div>
                </div>
              </div>

              {/* District & Phone (Optional) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    {lang === 'en' ? 'District / Area' : lang === 'ur' ? 'ضلع / علاقہ' : 'জেলা / এলাকা'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full pl-9 pr-2 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs focus:outline-hidden focus:border-[#E2A336]"
                    >
                      <option value="Karimganj">করিমগঞ্জ (Karimganj)</option>
                      <option value="Silchar">শিলচর (Silchar / Cachar)</option>
                      <option value="Hailakandi">হাইলাকান্দি (Hailakandi)</option>
                      <option value="Badarpur">বদরপুর (Badarpur)</option>
                      <option value="Patharkandi">পাথারকান্দি (Patharkandi)</option>
                      <option value="Other">অন্যান্য (Other)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    {lang === 'en' ? 'Mobile No. (Optional)' : lang === 'ur' ? 'موبائل نمبر (اختیاری)' : 'মোবাইল নম্বর (ঐচ্ছিক)'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                    />
                  </div>
                </div>
              </div>

              {/* Note on mPIN */}
              <div className="p-2.5 bg-black/30 rounded-xl border border-emerald-900/60 flex items-center gap-2 text-[11px] text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-[#E2A336] shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Your mPIN is your quick secret password. Remember it to log in easily.'
                    : lang === 'ur'
                    ? 'آپ کا mPIN آپ کا خفیہ پن کوڈ ہے۔ لاگ ان کرنے کے لیے اسے یاد رکھیں۔'
                    : 'আপনার ৪ সংখ্যার mPIN-টি যত্নসহকারে মনে রাখুন, পরবর্তীতে লগইন করতে এটি প্রয়োজন হবে।'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E2A336] to-[#c98e2a] text-[#03221F] font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? (lang === 'en' ? 'Registering...' : 'নিবন্ধন করা হচ্ছে...')
                    : (lang === 'en' ? 'Sign Up with Email & mPIN' : lang === 'ur' ? 'سائن اپ کریں' : 'ইমেইল ও mPIN দিয়ে সাইন আপ করুন')}
                </span>
              </button>

              {/* Switch to Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className="text-xs text-emerald-300 hover:text-[#E2A336] transition-colors"
                >
                  {lang === 'en'
                    ? 'Already have an account? Login here'
                    : lang === 'ur'
                    ? 'پہلے سے اکاؤنٹ ہے؟ یہاں لاگ ان کریں'
                    : 'আগে থেকেই একাউন্ট আছে? লগইন করুন'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {lang === 'en' ? 'Email Address' : lang === 'ur' ? 'ای میل ایڈریس' : 'আপনার ইমেইল এড্রেস'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              {/* mPIN */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-emerald-200">
                    {lang === 'en' ? 'Enter 4-Digit mPIN' : lang === 'ur' ? '4 ہندسوں کا mPIN درج کریں' : 'আপনার গোপন mPIN দিন'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[10px] text-emerald-400 hover:text-white"
                  >
                    {showPin ? (
                      <EyeOff className="w-3.5 h-3.5 inline" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 inline" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#E2A336] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-sm tracking-widest font-mono text-center placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(loginEmail);
                    setMode('forgot_pin');
                    resetMessages();
                  }}
                  className="text-[11px] text-amber-300 hover:underline"
                >
                  {lang === 'en' ? 'Forgot / Change mPIN?' : lang === 'ur' ? 'mPIN بھول گئے؟' : 'mPIN ভুলে গেছেন / পরিবর্তন করবেন?'}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E2A336] to-[#c98e2a] text-[#03221F] font-bold text-sm shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}
                <span>
                  {isSubmitting
                    ? (lang === 'en' ? 'Logging in...' : 'লগইন হচ্ছে...')
                    : (lang === 'en' ? 'Login with mPIN' : lang === 'ur' ? 'لاگ ان کریں' : 'mPIN দিয়ে লগইন করুন')}
                </span>
              </button>

              {/* Switch to Sign Up */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    resetMessages();
                  }}
                  className="text-xs text-emerald-300 hover:text-[#E2A336] transition-colors"
                >
                  {lang === 'en'
                    ? "Don't have an account? Sign Up for Free"
                    : lang === 'ur'
                    ? 'اکاؤنٹ نہیں ہے؟ مفت سائن اپ کریں'
                    : 'কোনো একাউন্ট নেই? নতুন একাউন্ট খুলুন'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT / RESET PIN */}
          {mode === 'forgot_pin' && (
            <form onSubmit={handleResetPin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-emerald-200 mb-1">
                  {lang === 'en' ? 'Registered Email' : lang === 'ur' ? 'رجسٹرڈ ای میل' : 'নিবন্ধিত ইমেইল এড্রেস'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    {lang === 'en' ? 'New 4-Digit mPIN' : lang === 'ur' ? 'نیا 4 ہندسوں کا mPIN' : 'নতুন ৪ সংখ্যার mPIN'}
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs tracking-widest font-mono text-center placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    {lang === 'en' ? 'Confirm New mPIN' : lang === 'ur' ? 'نیا mPIN تصدیق کریں' : 'পুনরায় নতুন mPIN'}
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2.5 bg-[#09332E] border border-emerald-700/60 rounded-xl text-white text-xs tracking-widest font-mono text-center placeholder:text-emerald-500/70 focus:outline-hidden focus:border-[#E2A336]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#E2A336] text-[#03221F] font-bold text-sm shadow-md hover:bg-[#c98e2a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{lang === 'en' ? 'Set New mPIN' : lang === 'ur' ? 'نیا mPIN سیٹ کریں' : 'নতুন mPIN সেট করুন'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetMessages();
                  }}
                  className="text-xs text-emerald-300 hover:text-white"
                >
                  {lang === 'en' ? 'Back to Login' : lang === 'ur' ? 'لاگ ان پر واپس جائیں' : 'লগইন-এ ফিরে যান'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: LOGGED IN USER PROFILE */}
          {mode === 'profile' && currentUser && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 bg-gradient-to-br from-[#09332E] to-[#042420] rounded-2xl border border-emerald-700/60 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#E2A336] text-[#03221F] font-black text-xl flex items-center justify-center shadow-md shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-white text-sm sm:text-base truncate">
                      {currentUser.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#E2A336]" />
                      <span>{lang === 'en' ? 'Verified Member' : 'ভেরিফায়েড সদস্য'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-emerald-300/80 truncate mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-amber-200/90 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#E2A336]" />
                    <span>{currentUser.district || 'Karimganj'}</span>
                  </p>
                </div>
              </div>

              {/* Account Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-[#09332E]/60 rounded-xl border border-emerald-800/40">
                  <span className="text-[10px] text-emerald-400/80 block">
                    {lang === 'en' ? 'Security PIN' : 'সুরক্ষা কোড'}
                  </span>
                  <span className="text-xs font-bold text-white tracking-widest font-mono">
                    •••• (mPIN Active)
                  </span>
                </div>
                <div className="p-3 bg-[#09332E]/60 rounded-xl border border-emerald-800/40">
                  <span className="text-[10px] text-emerald-400/80 block">
                    {lang === 'en' ? 'Member Since' : 'যোগদানের সময়'}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {new Date(currentUser.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(currentUser.email);
                    setMode('forgot_pin');
                    resetMessages();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#E2A336]" />
                  <span>{lang === 'en' ? 'Change mPIN' : 'গোপন mPIN পরিবর্তন করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/50 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Log Out' : 'লগআউট করুন'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#09332E] border-t border-emerald-800/60 flex items-center justify-between text-xs">
          <span className="text-[11px] text-emerald-400/80">
            🔒 {lang === 'en' ? 'Protected with 4-Digit mPIN' : '৪ সংখ্যার গোপন mPIN দ্বারা সুরক্ষিত'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
