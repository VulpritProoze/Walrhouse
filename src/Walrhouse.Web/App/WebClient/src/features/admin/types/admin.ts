export type UserStatus = 'active' | 'whitelisted' | 'blacklisted' | 'suspended';

export interface AdminUser {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  roles: string[];
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface IpRecord {
  ip: string;
  userId?: string;
  userName?: string;
  lastSeen: string;
  requestCount: number;
  status: 'allowed' | 'flagged' | 'blocked';
  country?: string;
}

export interface CreateUserPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  roles: string[];
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
}
