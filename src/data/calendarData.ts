import { TimetableData } from '../types';

export interface CalendarMonthData {
  monthIndex: number; // 0 to 11
  nameEn: string;
  nameBn: string;
  headerColor: string;
  entries: {
    day: number;
    sehri_end: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  }[];
}

export const YEARLY_CALENDAR_MONTHS: CalendarMonthData[] = [
  {
    monthIndex: 0,
    nameEn: 'JANUARY',
    nameBn: 'জানুয়ারী',
    headerColor: 'bg-rose-700',
    entries: [
      { day: 1, sehri_end: '04:37', sunrise: '06:03', dhuhr: '11:22', asr: '03:05', maghrib: '04:44', isha: '06:02' },
      { day: 3, sehri_end: '04:38', sunrise: '06:04', dhuhr: '11:23', asr: '03:06', maghrib: '04:45', isha: '06:03' },
      { day: 5, sehri_end: '04:38', sunrise: '06:04', dhuhr: '11:24', asr: '03:08', maghrib: '04:47', isha: '06:04' },
      { day: 7, sehri_end: '04:39', sunrise: '06:05', dhuhr: '11:25', asr: '03:09', maghrib: '04:48', isha: '06:06' },
      { day: 9, sehri_end: '04:39', sunrise: '06:05', dhuhr: '11:26', asr: '03:10', maghrib: '04:49', isha: '06:07' },
      { day: 11, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:26', asr: '03:12', maghrib: '04:51', isha: '06:08' },
      { day: 13, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:27', asr: '03:13', maghrib: '04:52', isha: '06:10' },
      { day: 15, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:28', asr: '03:15', maghrib: '04:54', isha: '06:11' },
      { day: 17, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:29', asr: '03:16', maghrib: '04:55', isha: '06:12' },
      { day: 19, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:29', asr: '03:18', maghrib: '04:57', isha: '06:14' },
      { day: 21, sehri_end: '04:40', sunrise: '06:05', dhuhr: '11:30', asr: '03:19', maghrib: '04:58', isha: '06:15' },
      { day: 23, sehri_end: '04:40', sunrise: '06:04', dhuhr: '11:30', asr: '03:21', maghrib: '05:00', isha: '06:16' },
      { day: 25, sehri_end: '04:40', sunrise: '06:04', dhuhr: '11:31', asr: '03:22', maghrib: '05:01', isha: '06:17' },
      { day: 27, sehri_end: '04:39', sunrise: '06:03', dhuhr: '11:31', asr: '03:24', maghrib: '05:03', isha: '06:19' },
      { day: 29, sehri_end: '04:39', sunrise: '06:02', dhuhr: '11:32', asr: '03:25', maghrib: '05:04', isha: '06:20' },
      { day: 31, sehri_end: '04:38', sunrise: '06:02', dhuhr: '11:32', asr: '03:27', maghrib: '05:06', isha: '06:21' },
    ],
  },
  {
    monthIndex: 1,
    nameEn: 'FEBRUARY',
    nameBn: 'ফেব্রুয়ারী',
    headerColor: 'bg-fuchsia-700',
    entries: [
      { day: 1, sehri_end: '04:38', sunrise: '06:01', dhuhr: '11:32', asr: '03:27', maghrib: '05:06', isha: '06:22' },
      { day: 3, sehri_end: '04:37', sunrise: '06:00', dhuhr: '11:32', asr: '03:29', maghrib: '05:08', isha: '06:23' },
      { day: 5, sehri_end: '04:37', sunrise: '05:59', dhuhr: '11:33', asr: '03:30', maghrib: '05:09', isha: '06:24' },
      { day: 7, sehri_end: '04:36', sunrise: '05:58', dhuhr: '11:33', asr: '03:31', maghrib: '05:11', isha: '06:25' },
      { day: 9, sehri_end: '04:35', sunrise: '05:57', dhuhr: '11:33', asr: '03:33', maghrib: '05:12', isha: '06:26' },
      { day: 11, sehri_end: '04:34', sunrise: '05:56', dhuhr: '11:33', asr: '03:34', maghrib: '05:13', isha: '06:27' },
      { day: 13, sehri_end: '04:32', sunrise: '05:55', dhuhr: '11:33', asr: '03:35', maghrib: '05:15', isha: '06:29' },
      { day: 15, sehri_end: '04:31', sunrise: '05:53', dhuhr: '11:33', asr: '03:36', maghrib: '05:16', isha: '06:30' },
      { day: 17, sehri_end: '04:30', sunrise: '05:52', dhuhr: '11:33', asr: '03:37', maghrib: '05:17', isha: '06:31' },
      { day: 19, sehri_end: '04:29', sunrise: '05:50', dhuhr: '11:33', asr: '03:38', maghrib: '05:18', isha: '06:32' },
      { day: 21, sehri_end: '04:28', sunrise: '05:49', dhuhr: '11:32', asr: '03:39', maghrib: '05:19', isha: '06:33' },
      { day: 23, sehri_end: '04:26', sunrise: '05:47', dhuhr: '11:32', asr: '03:40', maghrib: '05:21', isha: '06:34' },
      { day: 25, sehri_end: '04:24', sunrise: '05:45', dhuhr: '11:32', asr: '03:41', maghrib: '05:22', isha: '06:35' },
      { day: 27, sehri_end: '04:23', sunrise: '05:44', dhuhr: '11:32', asr: '03:42', maghrib: '05:23', isha: '06:36' },
      { day: 29, sehri_end: '04:21', sunrise: '05:42', dhuhr: '11:31', asr: '03:43', maghrib: '05:24', isha: '06:37' },
    ],
  },
  {
    monthIndex: 2,
    nameEn: 'MARCH',
    nameBn: 'মার্চ',
    headerColor: 'bg-purple-700',
    entries: [
      { day: 1, sehri_end: '04:21', sunrise: '05:42', dhuhr: '11:31', asr: '03:43', maghrib: '05:24', isha: '06:37' },
      { day: 3, sehri_end: '04:19', sunrise: '05:40', dhuhr: '11:31', asr: '03:43', maghrib: '05:25', isha: '06:38' },
      { day: 5, sehri_end: '04:18', sunrise: '05:38', dhuhr: '11:30', asr: '03:44', maghrib: '05:26', isha: '06:39' },
      { day: 7, sehri_end: '04:16', sunrise: '05:36', dhuhr: '11:30', asr: '03:45', maghrib: '05:27', isha: '06:40' },
      { day: 9, sehri_end: '04:14', sunrise: '05:34', dhuhr: '11:29', asr: '03:45', maghrib: '05:28', isha: '06:41' },
      { day: 11, sehri_end: '04:12', sunrise: '05:32', dhuhr: '11:29', asr: '03:46', maghrib: '05:29', isha: '06:41' },
      { day: 13, sehri_end: '04:10', sunrise: '05:30', dhuhr: '11:28', asr: '03:47', maghrib: '05:30', isha: '06:42' },
      { day: 15, sehri_end: '04:08', sunrise: '05:28', dhuhr: '11:28', asr: '03:47', maghrib: '05:31', isha: '06:43' },
      { day: 17, sehri_end: '04:06', sunrise: '05:26', dhuhr: '11:27', asr: '03:48', maghrib: '05:31', isha: '06:44' },
      { day: 19, sehri_end: '04:04', sunrise: '05:24', dhuhr: '11:27', asr: '03:48', maghrib: '05:32', isha: '06:45' },
      { day: 21, sehri_end: '04:01', sunrise: '05:22', dhuhr: '11:26', asr: '03:48', maghrib: '05:33', isha: '06:46' },
      { day: 23, sehri_end: '03:59', sunrise: '05:20', dhuhr: '11:25', asr: '03:49', maghrib: '05:34', isha: '06:47' },
      { day: 25, sehri_end: '03:57', sunrise: '05:18', dhuhr: '11:25', asr: '03:49', maghrib: '05:35', isha: '06:48' },
      { day: 27, sehri_end: '03:55', sunrise: '05:16', dhuhr: '11:24', asr: '03:49', maghrib: '05:36', isha: '06:49' },
      { day: 29, sehri_end: '03:53', sunrise: '05:14', dhuhr: '11:24', asr: '03:50', maghrib: '05:37', isha: '06:50' },
      { day: 31, sehri_end: '03:51', sunrise: '05:12', dhuhr: '11:23', asr: '03:50', maghrib: '05:37', isha: '06:51' },
    ],
  },
  {
    monthIndex: 3,
    nameEn: 'APRIL',
    nameBn: 'এপ্রিল',
    headerColor: 'bg-amber-800',
    entries: [
      { day: 1, sehri_end: '03:49', sunrise: '05:11', dhuhr: '11:23', asr: '03:50', maghrib: '05:38', isha: '06:52' },
      { day: 3, sehri_end: '03:47', sunrise: '05:09', dhuhr: '11:22', asr: '03:50', maghrib: '05:39', isha: '06:53' },
      { day: 5, sehri_end: '03:45', sunrise: '05:07', dhuhr: '11:22', asr: '03:51', maghrib: '05:40', isha: '06:54' },
      { day: 7, sehri_end: '03:43', sunrise: '05:05', dhuhr: '11:21', asr: '03:51', maghrib: '05:40', isha: '06:55' },
      { day: 9, sehri_end: '03:40', sunrise: '05:03', dhuhr: '11:20', asr: '03:51', maghrib: '05:41', isha: '06:56' },
      { day: 11, sehri_end: '03:38', sunrise: '05:01', dhuhr: '11:20', asr: '03:51', maghrib: '05:42', isha: '06:57' },
      { day: 13, sehri_end: '03:36', sunrise: '04:59', dhuhr: '11:19', asr: '03:51', maghrib: '05:43', isha: '06:58' },
      { day: 15, sehri_end: '03:34', sunrise: '04:57', dhuhr: '11:19', asr: '03:52', maghrib: '05:44', isha: '07:00' },
      { day: 17, sehri_end: '03:32', sunrise: '04:55', dhuhr: '11:18', asr: '03:52', maghrib: '05:45', isha: '07:01' },
      { day: 19, sehri_end: '03:30', sunrise: '04:54', dhuhr: '11:18', asr: '03:52', maghrib: '05:46', isha: '07:02' },
      { day: 21, sehri_end: '03:27', sunrise: '04:52', dhuhr: '11:18', asr: '03:52', maghrib: '05:47', isha: '07:03' },
      { day: 23, sehri_end: '03:25', sunrise: '04:50', dhuhr: '11:17', asr: '03:52', maghrib: '05:47', isha: '07:04' },
      { day: 25, sehri_end: '03:23', sunrise: '04:48', dhuhr: '11:17', asr: '03:53', maghrib: '05:48', isha: '07:06' },
      { day: 27, sehri_end: '03:21', sunrise: '04:47', dhuhr: '11:16', asr: '03:53', maghrib: '05:49', isha: '07:07' },
      { day: 29, sehri_end: '03:19', sunrise: '04:45', dhuhr: '11:16', asr: '03:53', maghrib: '05:50', isha: '07:08' },
      { day: 30, sehri_end: '03:18', sunrise: '04:45', dhuhr: '11:16', asr: '03:53', maghrib: '05:51', isha: '07:09' },
    ],
  },
  {
    monthIndex: 4,
    nameEn: 'MAY',
    nameBn: 'মে',
    headerColor: 'bg-teal-700',
    entries: [
      { day: 1, sehri_end: '03:17', sunrise: '04:44', dhuhr: '11:16', asr: '03:53', maghrib: '05:51', isha: '07:10' },
      { day: 3, sehri_end: '03:16', sunrise: '04:42', dhuhr: '11:16', asr: '03:53', maghrib: '05:52', isha: '07:11' },
      { day: 5, sehri_end: '03:14', sunrise: '04:41', dhuhr: '11:15', asr: '03:54', maghrib: '05:53', isha: '07:13' },
      { day: 7, sehri_end: '03:12', sunrise: '04:40', dhuhr: '11:15', asr: '03:54', maghrib: '05:54', isha: '07:14' },
      { day: 9, sehri_end: '03:10', sunrise: '04:38', dhuhr: '11:15', asr: '03:54', maghrib: '05:55', isha: '07:15' },
      { day: 11, sehri_end: '03:09', sunrise: '04:37', dhuhr: '11:15', asr: '03:54', maghrib: '05:56', isha: '07:17' },
      { day: 13, sehri_end: '03:07', sunrise: '04:36', dhuhr: '11:15', asr: '03:55', maghrib: '05:57', isha: '07:18' },
      { day: 15, sehri_end: '03:06', sunrise: '04:35', dhuhr: '11:15', asr: '03:55', maghrib: '05:58', isha: '07:20' },
      { day: 17, sehri_end: '03:04', sunrise: '04:34', dhuhr: '11:15', asr: '03:55', maghrib: '05:59', isha: '07:21' },
      { day: 19, sehri_end: '03:03', sunrise: '04:33', dhuhr: '11:15', asr: '03:56', maghrib: '06:00', isha: '07:22' },
      { day: 21, sehri_end: '03:02', sunrise: '04:32', dhuhr: '11:15', asr: '03:56', maghrib: '06:01', isha: '07:24' },
      { day: 23, sehri_end: '03:01', sunrise: '04:32', dhuhr: '11:15', asr: '03:56', maghrib: '06:02', isha: '07:25' },
      { day: 25, sehri_end: '03:00', sunrise: '04:31', dhuhr: '11:15', asr: '03:57', maghrib: '06:03', isha: '07:27' },
      { day: 27, sehri_end: '02:59', sunrise: '04:30', dhuhr: '11:16', asr: '03:57', maghrib: '06:04', isha: '07:28' },
      { day: 29, sehri_end: '02:58', sunrise: '04:30', dhuhr: '11:16', asr: '03:57', maghrib: '06:05', isha: '07:29' },
      { day: 31, sehri_end: '02:57', sunrise: '04:30', dhuhr: '11:16', asr: '03:58', maghrib: '06:06', isha: '07:30' },
    ],
  },
  {
    monthIndex: 5,
    nameEn: 'JUNE',
    nameBn: 'জুন',
    headerColor: 'bg-cyan-700',
    entries: [
      { day: 1, sehri_end: '02:57', sunrise: '04:29', dhuhr: '11:16', asr: '03:58', maghrib: '06:06', isha: '07:31' },
      { day: 3, sehri_end: '02:56', sunrise: '04:29', dhuhr: '11:17', asr: '03:59', maghrib: '06:07', isha: '07:33' },
      { day: 5, sehri_end: '02:56', sunrise: '04:29', dhuhr: '11:17', asr: '03:59', maghrib: '06:08', isha: '07:33' },
      { day: 7, sehri_end: '02:56', sunrise: '04:29', dhuhr: '11:17', asr: '03:59', maghrib: '06:09', isha: '07:34' },
      { day: 9, sehri_end: '02:55', sunrise: '04:29', dhuhr: '11:18', asr: '04:00', maghrib: '06:10', isha: '07:35' },
      { day: 11, sehri_end: '02:55', sunrise: '04:29', dhuhr: '11:18', asr: '04:00', maghrib: '06:11', isha: '07:36' },
      { day: 13, sehri_end: '02:55', sunrise: '04:29', dhuhr: '11:18', asr: '04:01', maghrib: '06:11', isha: '07:37' },
      { day: 15, sehri_end: '02:55', sunrise: '04:29', dhuhr: '11:19', asr: '04:01', maghrib: '06:12', isha: '07:38' },
      { day: 17, sehri_end: '02:55', sunrise: '04:29', dhuhr: '11:19', asr: '04:02', maghrib: '06:12', isha: '07:38' },
      { day: 19, sehri_end: '02:55', sunrise: '04:30', dhuhr: '11:20', asr: '04:02', maghrib: '06:13', isha: '07:39' },
      { day: 21, sehri_end: '02:56', sunrise: '04:30', dhuhr: '11:20', asr: '04:03', maghrib: '06:13', isha: '07:40' },
      { day: 23, sehri_end: '02:56', sunrise: '04:30', dhuhr: '11:21', asr: '04:03', maghrib: '06:14', isha: '07:40' },
      { day: 25, sehri_end: '02:56', sunrise: '04:31', dhuhr: '11:21', asr: '04:04', maghrib: '06:14', isha: '07:40' },
      { day: 27, sehri_end: '02:56', sunrise: '04:31', dhuhr: '11:21', asr: '04:04', maghrib: '06:14', isha: '07:40' },
      { day: 29, sehri_end: '02:57', sunrise: '04:32', dhuhr: '11:22', asr: '04:04', maghrib: '06:15', isha: '07:40' },
      { day: 30, sehri_end: '02:57', sunrise: '04:32', dhuhr: '11:22', asr: '04:04', maghrib: '06:15', isha: '07:40' },
    ],
  },
  {
    monthIndex: 6,
    nameEn: 'JULY',
    nameBn: 'জুলাই',
    headerColor: 'bg-sky-700',
    entries: [
      { day: 1, sehri_end: '02:59', sunrise: '04:33', dhuhr: '11:22', asr: '04:05', maghrib: '06:15', isha: '07:40' },
      { day: 3, sehri_end: '03:00', sunrise: '04:33', dhuhr: '11:23', asr: '04:05', maghrib: '06:15', isha: '07:40' },
      { day: 5, sehri_end: '03:01', sunrise: '04:34', dhuhr: '11:23', asr: '04:05', maghrib: '06:15', isha: '07:40' },
      { day: 7, sehri_end: '03:02', sunrise: '04:35', dhuhr: '11:23', asr: '04:05', maghrib: '06:15', isha: '07:40' },
      { day: 9, sehri_end: '03:03', sunrise: '04:36', dhuhr: '11:24', asr: '04:06', maghrib: '06:14', isha: '07:39' },
      { day: 11, sehri_end: '03:04', sunrise: '04:37', dhuhr: '11:24', asr: '04:06', maghrib: '06:14', isha: '07:39' },
      { day: 13, sehri_end: '03:05', sunrise: '04:37', dhuhr: '11:24', asr: '04:06', maghrib: '06:14', isha: '07:38' },
      { day: 15, sehri_end: '03:06', sunrise: '04:38', dhuhr: '11:24', asr: '04:06', maghrib: '06:13', isha: '07:37' },
      { day: 17, sehri_end: '03:08', sunrise: '04:39', dhuhr: '11:25', asr: '04:06', maghrib: '06:13', isha: '07:36' },
      { day: 19, sehri_end: '03:09', sunrise: '04:40', dhuhr: '11:25', asr: '04:06', maghrib: '06:12', isha: '07:35' },
      { day: 21, sehri_end: '03:10', sunrise: '04:41', dhuhr: '11:25', asr: '04:06', maghrib: '06:12', isha: '07:34' },
      { day: 23, sehri_end: '03:11', sunrise: '04:42', dhuhr: '11:25', asr: '04:06', maghrib: '06:11', isha: '07:33' },
      { day: 25, sehri_end: '03:13', sunrise: '04:43', dhuhr: '11:25', asr: '04:06', maghrib: '06:10', isha: '07:32' },
      { day: 27, sehri_end: '03:14', sunrise: '04:44', dhuhr: '11:25', asr: '04:05', maghrib: '06:09', isha: '07:31' },
      { day: 29, sehri_end: '03:15', sunrise: '04:45', dhuhr: '11:25', asr: '04:05', maghrib: '06:08', isha: '07:29' },
      { day: 31, sehri_end: '03:16', sunrise: '04:46', dhuhr: '11:25', asr: '04:05', maghrib: '06:07', isha: '07:28' },
    ],
  },
  {
    monthIndex: 7,
    nameEn: 'AUGUST',
    nameBn: 'আগস্ট',
    headerColor: 'bg-indigo-700',
    entries: [
      { day: 1, sehri_end: '03:17', sunrise: '04:46', dhuhr: '11:25', asr: '04:04', maghrib: '06:06', isha: '07:27' },
      { day: 3, sehri_end: '03:19', sunrise: '04:47', dhuhr: '11:25', asr: '04:04', maghrib: '06:05', isha: '07:25' },
      { day: 5, sehri_end: '03:20', sunrise: '04:48', dhuhr: '11:25', asr: '04:03', maghrib: '06:04', isha: '07:24' },
      { day: 7, sehri_end: '03:21', sunrise: '04:49', dhuhr: '11:24', asr: '04:03', maghrib: '06:03', isha: '07:22' },
      { day: 9, sehri_end: '03:23', sunrise: '04:50', dhuhr: '11:24', asr: '04:02', maghrib: '06:01', isha: '07:20' },
      { day: 11, sehri_end: '03:24', sunrise: '04:51', dhuhr: '11:24', asr: '04:01', maghrib: '06:00', isha: '07:18' },
      { day: 13, sehri_end: '03:25', sunrise: '04:52', dhuhr: '11:24', asr: '04:01', maghrib: '05:58', isha: '07:16' },
      { day: 15, sehri_end: '03:27', sunrise: '04:53', dhuhr: '11:23', asr: '04:00', maghrib: '05:57', isha: '07:14' },
      { day: 17, sehri_end: '03:28', sunrise: '04:53', dhuhr: '11:23', asr: '03:59', maghrib: '05:55', isha: '07:12' },
      { day: 19, sehri_end: '03:29', sunrise: '04:54', dhuhr: '11:22', asr: '03:58', maghrib: '05:53', isha: '07:10' },
      { day: 21, sehri_end: '03:30', sunrise: '04:55', dhuhr: '11:22', asr: '03:57', maghrib: '05:51', isha: '07:08' },
      { day: 23, sehri_end: '03:31', sunrise: '04:56', dhuhr: '11:21', asr: '03:56', maghrib: '05:50', isha: '07:06' },
      { day: 25, sehri_end: '03:33', sunrise: '04:57', dhuhr: '11:21', asr: '03:55', maghrib: '05:48', isha: '07:04' },
      { day: 27, sehri_end: '03:34', sunrise: '04:58', dhuhr: '11:20', asr: '03:53', maghrib: '05:46', isha: '07:02' },
      { day: 29, sehri_end: '03:35', sunrise: '04:58', dhuhr: '11:20', asr: '03:52', maghrib: '05:44', isha: '06:59' },
      { day: 31, sehri_end: '03:36', sunrise: '04:59', dhuhr: '11:19', asr: '03:51', maghrib: '05:42', isha: '06:57' },
    ],
  },
  {
    monthIndex: 8,
    nameEn: 'SEPTEMBER',
    nameBn: 'সেপ্টেম্বর',
    headerColor: 'bg-emerald-700',
    entries: [
      { day: 1, sehri_end: '03:36', sunrise: '04:59', dhuhr: '11:19', asr: '03:50', maghrib: '05:41', isha: '06:56' },
      { day: 3, sehri_end: '03:37', sunrise: '05:00', dhuhr: '11:18', asr: '03:49', maghrib: '05:39', isha: '06:54' },
      { day: 5, sehri_end: '03:38', sunrise: '05:01', dhuhr: '11:18', asr: '03:47', maghrib: '05:37', isha: '06:51' },
      { day: 7, sehri_end: '03:39', sunrise: '05:02', dhuhr: '11:17', asr: '03:46', maghrib: '05:35', isha: '06:49' },
      { day: 9, sehri_end: '03:40', sunrise: '05:02', dhuhr: '11:16', asr: '03:45', maghrib: '05:33', isha: '06:47' },
      { day: 11, sehri_end: '03:41', sunrise: '05:03', dhuhr: '11:16', asr: '03:43', maghrib: '05:31', isha: '06:44' },
      { day: 13, sehri_end: '03:42', sunrise: '05:04', dhuhr: '11:15', asr: '03:41', maghrib: '05:29', isha: '06:42' },
      { day: 15, sehri_end: '03:43', sunrise: '05:05', dhuhr: '11:14', asr: '03:40', maghrib: '05:26', isha: '06:40' },
      { day: 17, sehri_end: '03:44', sunrise: '05:05', dhuhr: '11:13', asr: '03:38', maghrib: '05:24', isha: '06:37' },
      { day: 19, sehri_end: '03:45', sunrise: '05:06', dhuhr: '11:13', asr: '03:37', maghrib: '05:22', isha: '06:35' },
      { day: 21, sehri_end: '03:46', sunrise: '05:07', dhuhr: '11:12', asr: '03:35', maghrib: '05:20', isha: '06:33' },
      { day: 23, sehri_end: '03:46', sunrise: '05:07', dhuhr: '11:11', asr: '03:33', maghrib: '05:18', isha: '06:31' },
      { day: 25, sehri_end: '03:47', sunrise: '05:08', dhuhr: '11:11', asr: '03:32', maghrib: '05:16', isha: '06:28' },
      { day: 27, sehri_end: '03:48', sunrise: '05:09', dhuhr: '11:10', asr: '03:30', maghrib: '05:14', isha: '06:26' },
      { day: 29, sehri_end: '03:49', sunrise: '05:10', dhuhr: '11:09', asr: '03:28', maghrib: '05:11', isha: '06:24' },
      { day: 30, sehri_end: '03:49', sunrise: '05:10', dhuhr: '11:09', asr: '03:27', maghrib: '05:10', isha: '06:23' },
    ],
  },
  {
    monthIndex: 9,
    nameEn: 'OCTOBER',
    nameBn: 'অক্টোবর',
    headerColor: 'bg-rose-800',
    entries: [
      { day: 1, sehri_end: '03:50', sunrise: '05:10', dhuhr: '11:09', asr: '03:26', maghrib: '05:09', isha: '06:22' },
      { day: 3, sehri_end: '03:51', sunrise: '05:11', dhuhr: '11:08', asr: '03:25', maghrib: '05:07', isha: '06:20' },
      { day: 5, sehri_end: '03:51', sunrise: '05:12', dhuhr: '11:07', asr: '03:23', maghrib: '05:05', isha: '06:18' },
      { day: 7, sehri_end: '03:52', sunrise: '05:13', dhuhr: '11:07', asr: '03:21', maghrib: '05:03', isha: '06:16' },
      { day: 9, sehri_end: '03:53', sunrise: '05:14', dhuhr: '11:06', asr: '03:20', maghrib: '05:01', isha: '06:14' },
      { day: 11, sehri_end: '03:54', sunrise: '05:15', dhuhr: '11:06', asr: '03:18', maghrib: '04:59', isha: '06:12' },
      { day: 13, sehri_end: '03:55', sunrise: '05:15', dhuhr: '11:05', asr: '03:16', maghrib: '04:57', isha: '06:10' },
      { day: 15, sehri_end: '03:55', sunrise: '05:16', dhuhr: '11:05', asr: '03:15', maghrib: '04:56', isha: '06:08' },
      { day: 17, sehri_end: '03:56', sunrise: '05:17', dhuhr: '11:04', asr: '03:13', maghrib: '04:54', isha: '06:07' },
      { day: 19, sehri_end: '03:57', sunrise: '05:18', dhuhr: '11:04', asr: '03:12', maghrib: '04:52', isha: '06:05' },
      { day: 21, sehri_end: '03:58', sunrise: '05:19', dhuhr: '11:03', asr: '03:10', maghrib: '04:50', isha: '06:04' },
      { day: 23, sehri_end: '03:59', sunrise: '05:20', dhuhr: '11:03', asr: '03:09', maghrib: '04:49', isha: '06:02' },
      { day: 25, sehri_end: '04:00', sunrise: '05:21', dhuhr: '11:03', asr: '03:07', maghrib: '04:47', isha: '06:01' },
      { day: 27, sehri_end: '04:01', sunrise: '05:23', dhuhr: '11:03', asr: '03:06', maghrib: '04:45', isha: '05:59' },
      { day: 29, sehri_end: '04:02', sunrise: '05:24', dhuhr: '11:02', asr: '03:04', maghrib: '04:44', isha: '05:58' },
      { day: 31, sehri_end: '04:02', sunrise: '05:25', dhuhr: '11:02', asr: '03:03', maghrib: '04:43', isha: '05:57' },
    ],
  },
  {
    monthIndex: 10,
    nameEn: 'NOVEMBER',
    nameBn: 'নভেম্বর',
    headerColor: 'bg-violet-800',
    entries: [
      { day: 1, sehri_end: '04:03', sunrise: '05:25', dhuhr: '11:02', asr: '03:03', maghrib: '04:42', isha: '05:56' },
      { day: 3, sehri_end: '04:04', sunrise: '05:27', dhuhr: '11:02', asr: '03:01', maghrib: '04:41', isha: '05:55' },
      { day: 5, sehri_end: '04:05', sunrise: '05:29', dhuhr: '11:02', asr: '03:00', maghrib: '04:39', isha: '05:54' },
      { day: 7, sehri_end: '04:06', sunrise: '05:30', dhuhr: '11:02', asr: '02:59', maghrib: '04:38', isha: '05:53' },
      { day: 9, sehri_end: '04:07', sunrise: '05:30', dhuhr: '11:02', asr: '02:58', maghrib: '04:37', isha: '05:52' },
      { day: 11, sehri_end: '04:08', sunrise: '05:32', dhuhr: '11:03', asr: '02:57', maghrib: '04:36', isha: '05:52' },
      { day: 13, sehri_end: '04:10', sunrise: '05:33', dhuhr: '11:03', asr: '02:56', maghrib: '04:35', isha: '05:51' },
      { day: 15, sehri_end: '04:11', sunrise: '05:34', dhuhr: '11:03', asr: '02:55', maghrib: '04:34', isha: '05:50' },
      { day: 17, sehri_end: '04:12', sunrise: '05:36', dhuhr: '11:04', asr: '02:55', maghrib: '04:34', isha: '05:50' },
      { day: 19, sehri_end: '04:13', sunrise: '05:37', dhuhr: '11:04', asr: '02:54', maghrib: '04:33', isha: '05:50' },
      { day: 21, sehri_end: '04:14', sunrise: '05:39', dhuhr: '11:04', asr: '02:54', maghrib: '04:33', isha: '05:49' },
      { day: 23, sehri_end: '04:15', sunrise: '05:40', dhuhr: '11:05', asr: '02:54', maghrib: '04:32', isha: '05:49' },
      { day: 25, sehri_end: '04:17', sunrise: '05:42', dhuhr: '11:05', asr: '02:53', maghrib: '04:32', isha: '05:49' },
      { day: 27, sehri_end: '04:18', sunrise: '05:43', dhuhr: '11:06', asr: '02:53', maghrib: '04:32', isha: '05:49' },
      { day: 29, sehri_end: '04:19', sunrise: '05:44', dhuhr: '11:07', asr: '02:53', maghrib: '04:32', isha: '05:49' },
      { day: 30, sehri_end: '04:20', sunrise: '05:45', dhuhr: '11:07', asr: '02:53', maghrib: '04:32', isha: '05:49' },
    ],
  },
  {
    monthIndex: 11,
    nameEn: 'DECEMBER',
    nameBn: 'ডিসেম্বর',
    headerColor: 'bg-slate-700',
    entries: [
      { day: 1, sehri_end: '04:20', sunrise: '05:46', dhuhr: '11:07', asr: '02:53', maghrib: '04:32', isha: '05:49' },
      { day: 3, sehri_end: '04:22', sunrise: '05:47', dhuhr: '11:08', asr: '02:53', maghrib: '04:32', isha: '05:50' },
      { day: 5, sehri_end: '04:23', sunrise: '05:49', dhuhr: '11:09', asr: '02:53', maghrib: '04:32', isha: '05:50' },
      { day: 7, sehri_end: '04:24', sunrise: '05:50', dhuhr: '11:10', asr: '02:54', maghrib: '04:33', isha: '05:51' },
      { day: 9, sehri_end: '04:25', sunrise: '05:51', dhuhr: '11:11', asr: '02:54', maghrib: '04:33', isha: '05:51' },
      { day: 11, sehri_end: '04:26', sunrise: '05:53', dhuhr: '11:12', asr: '02:55', maghrib: '04:33', isha: '05:52' },
      { day: 13, sehri_end: '04:28', sunrise: '05:54', dhuhr: '11:13', asr: '02:55', maghrib: '04:34', isha: '05:52' },
      { day: 15, sehri_end: '04:29', sunrise: '05:55', dhuhr: '11:13', asr: '02:56', maghrib: '04:35', isha: '05:53' },
      { day: 17, sehri_end: '04:30', sunrise: '05:56', dhuhr: '11:14', asr: '02:57', maghrib: '04:36', isha: '05:54' },
      { day: 19, sehri_end: '04:31', sunrise: '05:57', dhuhr: '11:15', asr: '02:57', maghrib: '04:36', isha: '05:55' },
      { day: 21, sehri_end: '04:32', sunrise: '05:58', dhuhr: '11:16', asr: '02:58', maghrib: '04:37', isha: '05:56' },
      { day: 23, sehri_end: '04:33', sunrise: '05:59', dhuhr: '11:17', asr: '02:59', maghrib: '04:38', isha: '05:57' },
      { day: 25, sehri_end: '04:34', sunrise: '06:00', dhuhr: '11:18', asr: '03:00', maghrib: '04:39', isha: '05:58' },
      { day: 27, sehri_end: '04:35', sunrise: '06:01', dhuhr: '11:19', asr: '03:02', maghrib: '04:41', isha: '05:59' },
      { day: 29, sehri_end: '04:36', sunrise: '06:02', dhuhr: '11:20', asr: '03:02', maghrib: '04:42', isha: '06:00' },
      { day: 31, sehri_end: '04:36', sunrise: '06:03', dhuhr: '11:21', asr: '03:04', maghrib: '04:43', isha: '06:01' },
    ],
  },
];

/**
 * Builds the comprehensive 365-day dictionary from the printed table.
 * Each entry covers its listed day and the subsequent day (e.g. day 1 covers 1 & 2),
 * matching the authentic calendar chart methodology.
 */
export function buildFullYearTimetable(): TimetableData {
  const table: TimetableData = {};

  YEARLY_CALENDAR_MONTHS.forEach((m) => {
    const monthNum = String(m.monthIndex + 1).padStart(2, '0');
    const entries = m.entries;

    // Number of days in this month (handling leap years up to 29 in Feb)
    const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m.monthIndex];

    for (let day = 1; day <= maxDays; day++) {
      // Find the entry that governs this day:
      // Search for exact match or the latest entry whose day <= current day
      let matchingEntry = entries[0];
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].day <= day) {
          matchingEntry = entries[i];
        } else {
          break;
        }
      }

      const dayNum = String(day).padStart(2, '0');
      const key = `${monthNum}-${dayNum}`;

      table[key] = {
        sehri_end: matchingEntry.sehri_end,
        sunrise: matchingEntry.sunrise,
        dhuhr: matchingEntry.dhuhr,
        asr: matchingEntry.asr,
        maghrib: matchingEntry.maghrib,
        isha: matchingEntry.isha,
      };
    }
  });

  return table;
}

export const CALENDAR_POSTER_META = {
  titleBn: 'শিলচর ও তার পার্শ্ববর্তী এলাকার জন্য',
  titleEn: 'For Silchar and Surrounding Areas',
  offsets: [
    { labelBn: 'বাড়াতে হবে: করিমগঞ্জ', labelEn: 'Karimganj', offsetVal: '+২ মিনিট (+2 min)' },
    { labelBn: 'কমাতে হবে: হায়লাকান্দি, লালা, বদরপুর, কালাইন', labelEn: 'Hailakandi, Lala, Badarpur, Kalain', offsetVal: '-১ মিনিট (-1 min)' },
    { labelBn: 'কমাতে হবে: আইজল', labelEn: 'Aizawl', offsetVal: '-৩ মিনিট (-3 min)' },
  ],
  publisher: 'Star Book House, N.S. Road, Hailakandi, Assam',
  contacts: ['9401927069', '9854438467'],
  notesBn: [
    'সতর্কতামূলক নোট: উপরোক্ত সময় তালিকায় সাবধানতার জন্য সুবহে সাদেকের সময়টি পাঁচ (৫) মিনিট পূর্বেই নির্ধারণ করা হয়েছে। তাই এসময়ের পাঁচ মিনিট পর ফজরের নামাজের আজান দেবেন।',
    'সূর্যোদয়ের সময় থেকে ২০ মিনিট পর্যন্ত যেকোন প্রকার নামাজ পড়া মকরূহ।',
    'জওয়ালের আরম্ভ হইতে জোহর আরম্ভ হওয়ার পূর্ব পর্যন্ত নামাজ পড়া মকরূহ (জওয়ালের মকরূহ হওয়ার ২৩ মিনিট পূর্ব পর্যন্ত নামাজ পড়া মকরূহ)।',
    'মাগরিবের ওয়াক্ত হওয়ার সাথে সাথে ইফতার করা মোস্তাহাব।',
  ],
};
