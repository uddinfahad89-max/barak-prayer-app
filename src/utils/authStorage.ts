import { UserAccount } from '../types/auth';

const STORAGE_USERS_KEY = 'app_registered_users_v1';
const STORAGE_CURRENT_USER_KEY = 'app_current_user_v1';

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch {
    // ignore
  }
}

export function registerWithEmailAndPin(params: {
  name: string;
  email: string;
  mPin: string;
  phone?: string;
  district?: string;
}): { success: boolean; error?: string; user?: UserAccount } {
  const { name, email, mPin, phone, district } = params;

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedPin = mPin.trim();

  if (!trimmedName) {
    return { success: false, error: 'দয়া করে আপনার নাম লিখুন (Please enter your name)' };
  }

  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return { success: false, error: 'সঠিক ইমেইল এড্রেস প্রদান করুন (Please enter a valid email address)' };
  }

  if (!/^\d{4,6}$/.test(trimmedPin)) {
    return { success: false, error: 'mPIN অবশ্যই ৪ থেকে ৬ সংখ্যার নাম্বার হতে হবে (mPIN must be 4 to 6 digits)' };
  }

  const existingUsers = getStoredUsers();
  const existing = existingUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (existing) {
    return {
      success: false,
      error: 'এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট খোলা আছে। দয়া করে লগইন করুন (Email already registered. Please login)',
    };
  }

  const newUser: UserAccount = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmedName,
    email: trimmedEmail,
    mPin: trimmedPin,
    phone: phone?.trim() || '',
    district: district?.trim() || 'Karimganj',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  const updatedList = [newUser, ...existingUsers];
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

export function loginWithEmailAndPin(
  email: string,
  mPin: string
): { success: boolean; error?: string; user?: UserAccount } {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPin = mPin.trim();

  if (!trimmedEmail) {
    return { success: false, error: 'দয়া করে আপনার ইমেইল লিখুন (Please enter your email)' };
  }

  if (!trimmedPin) {
    return { success: false, error: 'দয়া করে আপনার গোপন mPIN লিখুন (Please enter your mPIN)' };
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

  if (!user) {
    return {
      success: false,
      error: 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। দয়া করে সাইন আপ করুন (No account found with this email. Please sign up)',
    };
  }

  if (user.mPin !== trimmedPin) {
    return {
      success: false,
      error: 'ভুল mPIN! দয়া করে সঠিক mPIN লিখুন (Incorrect mPIN. Please try again)',
    };
  }

  const updatedUser = {
    ...user,
    lastLoginAt: new Date().toISOString(),
  };

  const updatedList = users.map((u) => (u.id === user.id ? updatedUser : u));
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
  } catch {
    // ignore
  }

  setCurrentUser(updatedUser);
  return { success: true, user: updatedUser };
}

export function updateUserPin(
  email: string,
  newPin: string
): { success: boolean; error?: string } {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPin = newPin.trim();

  if (!/^\d{4,6}$/.test(trimmedPin)) {
    return { success: false, error: 'নতুন mPIN অবশ্যই ৪ থেকে ৬ সংখ্যার হতে হবে (New mPIN must be 4 to 6 digits)' };
  }

  const users = getStoredUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === trimmedEmail);

  if (userIndex === -1) {
    return { success: false, error: 'একাউন্ট পাওয়া যায়নি (User not found)' };
  }

  users[userIndex].mPin = trimmedPin;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }

  const current = getCurrentUser();
  if (current && current.email.toLowerCase() === trimmedEmail) {
    current.mPin = trimmedPin;
    setCurrentUser(current);
  }

  return { success: true };
}

export function logoutUser(): void {
  setCurrentUser(null);
}
