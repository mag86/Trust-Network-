// Типы для модуля геолокации

export type LocationAccuracy = 'HIGH' | 'MEDIUM' | 'LOW' | 'CITY';
export type LocationSource = 'GPS' | 'WIFI' | 'CELL_TOWER' | 'IP';
export type LocationVisibility = 'EXACT' | 'APPROXIMATE' | 'CITY_ONLY' | 'HIDDEN';
export type ZoneType = 'HOME' | 'WORK' | 'PUBLIC' | 'UNKNOWN';

export interface UserLocation {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: LocationAccuracy;
  source: LocationSource;
  address?: string;
  city?: string;
  district?: string;
  updatedAt: string;
  lastActiveAt: string;
}

export interface LocationUpdateRequest {
  latitude: number;
  longitude: number;
  accuracy: LocationAccuracy;
  source: LocationSource;
  address?: string;
  city?: string;
  district?: string;
}

export interface GeoPrivacySettings {
  id: number;
  userId: number;
  visibility: LocationVisibility;
  sharingRule: 'ALL' | 'FRIENDS' | 'NONE';
  showOnlyWhenOnline: boolean;
  hideWhenInactive: boolean;
  inactivityMinutes?: number;
}

export interface GeoZone {
  id: number;
  userId: number;
  name: string;
  type: ZoneType;
  centerLatitude: number;
  centerLongitude: number;
  radiusMeters: number;
  visibilityInZone: LocationVisibility;
  createdAt: string;
}

export interface NearbySearchRequest {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  limit?: number;
  page?: number;
}

export interface NearbyUser {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: LocationAccuracy;
  distance: number;
  address?: string;
}

