export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mPin: string; // 4 to 6 digit numeric security PIN
  phone?: string;
  district?: string;
  createdAt: string;
  lastLoginAt: string;
}

export type AuthMode = 'signup' | 'login' | 'profile' | 'forgot_pin';
