import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { DEFAULT_TIMETABLE, DEFAULT_LOCATION_OFFSETS, DISTRICTS_DATA, LOCATION_DETAILS } from '../data/defaultData';
import { DEFAULT_IMAM_BIODATAS, DEFAULT_MOSQUE_VACANCIES } from '../data/defaultImamData';
import { DEFAULT_UMRAH_PACKAGES } from '../data/defaultUmrahPackages';
import { DEFAULT_MATRIMONY_BIODATAS } from '../data/defaultMatrimonyData';
import { ALL_INDIA_LOCATIONS } from '../data/allIndiaLocations';
import { LocationOffsets, TimetableData } from '../types';

export interface SyncProgressItem {
  id: string;
  nameBn: string;
  nameEn: string;
  status: 'pending' | 'saving' | 'saved' | 'error';
  count?: number;
  message?: string;
}

export interface SyncResult {
  success: boolean;
  timestamp: string;
  totalSyncedItems: number;
  details: Record<string, number>;
  error?: string;
}

const STORAGE_LAST_SYNC_KEY = 'app_firebase_last_sync_time';

export const getLastSyncTime = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_LAST_SYNC_KEY);
  } catch {
    return null;
  }
};

export const setLastSyncTime = (timestamp: string) => {
  try {
    localStorage.setItem(STORAGE_LAST_SYNC_KEY, timestamp);
  } catch {
    // ignore
  }
};

/**
 * Save all prayer application datasets into Firebase Cloud Firestore
 */
export async function saveAllPrayerAppDataToFirebase(
  customData?: {
    locationOffsets?: LocationOffsets;
    timetable?: TimetableData;
    mosqueName?: string;
    jamaatTimes?: Record<string, string>;
    playAzanOnJamaat?: boolean;
    hijriAdjustment?: number;
  },
  onProgress?: (items: SyncProgressItem[]) => void
): Promise<SyncResult> {
  const progress: SyncProgressItem[] = [
    { id: 'timetable', nameBn: '৩৬৫ দিনের নামাজের সময়সূচী (Prayer Timetable)', nameEn: '365-Day Prayer Timetable', status: 'pending' },
    { id: 'locations', nameBn: 'বরাক উপত্যকা ও অল ইন্ডিয়া লোকেশন অফসেট', nameEn: 'Barak Valley & All-India Locations', status: 'pending' },
    { id: 'mosque', nameBn: 'মসজিদ ও জামাতের নামাজের সময়সূচী', nameEn: 'Mosque & Jamaat Settings', status: 'pending' },
    { id: 'imams', nameBn: 'ইমাম বায়োডাটা ও খেদমত বিবরণী', nameEn: 'Imam Biodatas', status: 'pending' },
    { id: 'vacancies', nameBn: 'মসজিদে ইমাম নিয়োগ বিজ্ঞপ্তি', nameEn: 'Mosque Vacancies', status: 'pending' },
    { id: 'umrah', nameBn: 'উমরাহ ও হজ্ব ট্রাভেল প্যাকেজ', nameEn: 'Umrah & Hajj Packages', status: 'pending' },
    { id: 'matrimony', nameBn: 'ইসলামিক পাত্র-পাত্রী মেট্রিমনি তথ্য', nameEn: 'Islamic Matrimony Profiles', status: 'pending' },
  ];

  const updateProgress = (id: string, status: SyncProgressItem['status'], count?: number, message?: string) => {
    const item = progress.find((p) => p.id === id);
    if (item) {
      item.status = status;
      if (count !== undefined) item.count = count;
      if (message !== undefined) item.message = message;
      if (onProgress) onProgress([...progress]);
    }
  };

  const details: Record<string, number> = {};
  let totalCount = 0;

  try {
    // 1. Prayer Timetable (Full 365 Days)
    updateProgress('timetable', 'saving');
    const activeTimetable = customData?.timetable || DEFAULT_TIMETABLE;
    const timetableDates = Object.keys(activeTimetable);
    
    // Save timetable overview and full dataset
    await setDoc(
      doc(db, 'prayer_timetables', 'silchar_authentic_base'),
      {
        datasetId: 'silchar_base_365',
        title: 'Authentic Barak Valley 365-Day Prayer Timetable',
        totalDays: timetableDates.length,
        data: activeTimetable,
        updatedAt: serverTimestamp(),
        syncIsoTime: new Date().toISOString(),
      },
      { merge: true }
    );
    details['prayer_timetable_days'] = timetableDates.length;
    totalCount += timetableDates.length;
    updateProgress('timetable', 'saved', timetableDates.length);

    // 2. Locations, Districts, and Offsets
    updateProgress('locations', 'saving');
    const activeOffsets = customData?.locationOffsets || DEFAULT_LOCATION_OFFSETS;
    await setDoc(
      doc(db, 'app_locations', 'barak_valley_offsets'),
      {
        title: 'Barak Valley Constituencies & Minutes Offset',
        districts: DISTRICTS_DATA,
        offsets: activeOffsets,
        locationDetails: LOCATION_DETAILS,
        totalConstituencies: Object.keys(activeOffsets).length,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    await setDoc(
      doc(db, 'app_locations', 'all_india_cities'),
      {
        title: 'All India Major Cities Coordinates for Google Method',
        totalCities: ALL_INDIA_LOCATIONS.length,
        cities: ALL_INDIA_LOCATIONS,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    const locCount = Object.keys(activeOffsets).length + ALL_INDIA_LOCATIONS.length;
    details['locations_total'] = locCount;
    totalCount += locCount;
    updateProgress('locations', 'saved', locCount);

    // 3. Mosque & Jamaat Settings
    updateProgress('mosque', 'saving');
    const mosquePayload = {
      mosqueName: customData?.mosqueName || localStorage.getItem('mosqueName') || 'শিলচর কেন্দ্রীয় জামে মসজিদ',
      jamaatTimes: customData?.jamaatTimes || (() => {
        try {
          return JSON.parse(localStorage.getItem('jamaatTimes') || '{}');
        } catch {
          return { Fajr: '05:00', Dhuhr: '13:00', Asr: '16:30', Maghrib: '17:35', Isha: '19:45' };
        }
      })(),
      playAzanOnJamaat: customData?.playAzanOnJamaat ?? (localStorage.getItem('playAzanOnJamaat') !== 'false'),
      hijriAdjustment: customData?.hijriAdjustment ?? parseInt(localStorage.getItem('hijriAdjustment') || '0', 10),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'mosque_settings', 'active_settings'), mosquePayload, { merge: true });
    details['mosque_settings'] = 1;
    totalCount += 1;
    updateProgress('mosque', 'saved', 1);

    // 4. Imams Biodatas
    updateProgress('imams', 'saving');
    let localImams = DEFAULT_IMAM_BIODATAS;
    try {
      const saved = localStorage.getItem('imam_biodatas_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) localImams = parsed;
      }
    } catch {
      // ignore
    }

    // Save batch for Imams
    const imamsBatch = writeBatch(db);
    for (const imam of localImams) {
      const docRef = doc(db, 'imams', imam.id);
      imamsBatch.set(docRef, { ...imam, syncedAt: serverTimestamp() }, { merge: true });
    }
    await imamsBatch.commit();
    details['imams'] = localImams.length;
    totalCount += localImams.length;
    updateProgress('imams', 'saved', localImams.length);

    // 5. Mosque Vacancies
    updateProgress('vacancies', 'saving');
    let localVacancies = DEFAULT_MOSQUE_VACANCIES;
    try {
      const saved = localStorage.getItem('mosque_vacancies_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) localVacancies = parsed;
      }
    } catch {
      // ignore
    }

    const vacanciesBatch = writeBatch(db);
    for (const vac of localVacancies) {
      const docRef = doc(db, 'mosque_vacancies', vac.id);
      vacanciesBatch.set(docRef, { ...vac, syncedAt: serverTimestamp() }, { merge: true });
    }
    await vacanciesBatch.commit();
    details['mosque_vacancies'] = localVacancies.length;
    totalCount += localVacancies.length;
    updateProgress('vacancies', 'saved', localVacancies.length);

    // 6. Umrah & Hajj Packages
    updateProgress('umrah', 'saving');
    let localPackages = DEFAULT_UMRAH_PACKAGES;
    try {
      const saved = localStorage.getItem('umrah_packages_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) localPackages = parsed;
      }
    } catch {
      // ignore
    }

    const packagesBatch = writeBatch(db);
    for (const pkg of localPackages) {
      const docRef = doc(db, 'umrah_packages', pkg.id);
      packagesBatch.set(docRef, { ...pkg, syncedAt: serverTimestamp() }, { merge: true });
    }
    await packagesBatch.commit();
    details['umrah_packages'] = localPackages.length;
    totalCount += localPackages.length;
    updateProgress('umrah', 'saved', localPackages.length);

    // 7. Matrimony Profiles
    updateProgress('matrimony', 'saving');
    let localMatrimonials = DEFAULT_MATRIMONY_BIODATAS;
    try {
      const saved = localStorage.getItem('matrimony_biodatas_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) localMatrimonials = parsed;
      }
    } catch {
      // ignore
    }

    const matrimonyBatch = writeBatch(db);
    for (const mat of localMatrimonials) {
      const docRef = doc(db, 'matrimony_profiles', mat.id);
      matrimonyBatch.set(docRef, { ...mat, syncedAt: serverTimestamp() }, { merge: true });
    }
    await matrimonyBatch.commit();
    details['matrimony_profiles'] = localMatrimonials.length;
    totalCount += localMatrimonials.length;
    updateProgress('matrimony', 'saved', localMatrimonials.length);

    // 8. Overall App Metadata & Last Sync Time
    const nowIso = new Date().toISOString();
    await setDoc(
      doc(db, 'app_sync_meta', 'sync_summary'),
      {
        appName: 'Barak Valley Islamic Authentic Prayers App',
        projectId: 'classic-fashion-pos',
        lastSyncedAt: serverTimestamp(),
        lastSyncIso: nowIso,
        totalItems: totalCount,
        details,
        status: 'synced_successfully',
      },
      { merge: true }
    );

    setLastSyncTime(nowIso);

    return {
      success: true,
      timestamp: nowIso,
      totalSyncedItems: totalCount,
      details,
    };
  } catch (err: unknown) {
    console.error('Error saving all prayer app data to Firebase:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown Firestore sync error';
    return {
      success: false,
      timestamp: new Date().toISOString(),
      totalSyncedItems: totalCount,
      details,
      error: errorMessage,
    };
  }
}

/**
 * Fetch and merge saved prayer data from Firebase Firestore
 */
export async function fetchAllDataFromFirebase(): Promise<{
  timetable?: TimetableData;
  locationOffsets?: LocationOffsets;
  mosqueSettings?: {
    mosqueName: string;
    jamaatTimes: Record<string, string>;
    playAzanOnJamaat: boolean;
    hijriAdjustment: number;
  };
  imamsCount?: number;
  packagesCount?: number;
  matrimonialsCount?: number;
}> {
  const result: {
    timetable?: TimetableData;
    locationOffsets?: LocationOffsets;
    mosqueSettings?: {
      mosqueName: string;
      jamaatTimes: Record<string, string>;
      playAzanOnJamaat: boolean;
      hijriAdjustment: number;
    };
    imamsCount?: number;
    packagesCount?: number;
    matrimonialsCount?: number;
  } = {};

  try {
    // 1. Timetable
    const ttSnap = await getDoc(doc(db, 'prayer_timetables', 'silchar_authentic_base'));
    if (ttSnap.exists()) {
      const data = ttSnap.data();
      if (data?.data) {
        result.timetable = data.data as TimetableData;
      }
    }

    // 2. Location Offsets
    const locSnap = await getDoc(doc(db, 'app_locations', 'barak_valley_offsets'));
    if (locSnap.exists()) {
      const data = locSnap.data();
      if (data?.offsets) {
        result.locationOffsets = data.offsets as LocationOffsets;
      }
    }

    // 3. Mosque Settings
    const mosqueSnap = await getDoc(doc(db, 'mosque_settings', 'active_settings'));
    if (mosqueSnap.exists()) {
      const data = mosqueSnap.data();
      result.mosqueSettings = {
        mosqueName: data.mosqueName || '',
        jamaatTimes: data.jamaatTimes || {},
        playAzanOnJamaat: data.playAzanOnJamaat !== false,
        hijriAdjustment: data.hijriAdjustment || 0,
      };
    }

    // 4. Collection item counts
    const imamsSnap = await getDocs(collection(db, 'imams'));
    result.imamsCount = imamsSnap.size;

    const pkgsSnap = await getDocs(collection(db, 'umrah_packages'));
    result.packagesCount = pkgsSnap.size;

    const matSnap = await getDocs(collection(db, 'matrimony_profiles'));
    result.matrimonialsCount = matSnap.size;

    return result;
  } catch (err) {
    console.warn('Could not fetch from Firebase:', err);
    return result;
  }
}
