import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import {
  UserLocation,
  LocationUpdateRequest,
  GeoPrivacySettings,
  GeoZone,
  NearbySearchRequest,
  NearbyUser,
} from '../../types/geolocation';

interface GeolocationState {
  currentLocation: UserLocation | null;
  nearbyUsers: NearbyUser[];
  privacySettings: GeoPrivacySettings | null;
  zones: GeoZone[];
  isLoading: boolean;
  error: string | null;
  isTracking: boolean;
}

const initialState: GeolocationState = {
  currentLocation: null,
  nearbyUsers: [],
  privacySettings: null,
  zones: [],
  isLoading: false,
  error: null,
  isTracking: false,
};

// Async thunks
export const fetchLocation = createAsyncThunk(
  'geolocation/fetchLocation',
  async (userId: number) => {
    const response = await apiClient.get(`/locations/${userId}`);
    return response.data;
  }
);

export const updateLocation = createAsyncThunk(
  'geolocation/updateLocation',
  async ({ userId, location }: { userId: number; location: LocationUpdateRequest }) => {
    const response = await apiClient.put(`/locations/${userId}`, location);
    return response.data;
  }
);

export const searchNearbyUsers = createAsyncThunk(
  'geolocation/searchNearbyUsers',
  async (request: NearbySearchRequest) => {
    const response = await apiClient.post('/geo/search/nearby-users', request);
    return response.data;
  }
);

export const fetchPrivacySettings = createAsyncThunk(
  'geolocation/fetchPrivacySettings',
  async (userId: number) => {
    const response = await apiClient.get(`/geo/privacy/${userId}`);
    return response.data;
  }
);

export const updatePrivacySettings = createAsyncThunk(
  'geolocation/updatePrivacySettings',
  async ({ userId, settings }: { userId: number; settings: Partial<GeoPrivacySettings> }) => {
    const response = await apiClient.put(`/geo/privacy/${userId}`, settings);
    return response.data;
  }
);

export const fetchZones = createAsyncThunk(
  'geolocation/fetchZones',
  async (userId: number) => {
    const response = await apiClient.get(`/geo/zones/${userId}`);
    return response.data;
  }
);

export const createZone = createAsyncThunk(
  'geolocation/createZone',
  async ({ userId, zone }: { userId: number; zone: Partial<GeoZone> }) => {
    const response = await apiClient.post(`/geo/zones/${userId}`, zone);
    return response.data;
  }
);

export const deleteZone = createAsyncThunk(
  'geolocation/deleteZone',
  async ({ zoneId, userId }: { zoneId: number; userId: number }) => {
    await apiClient.delete(`/geo/zones/${zoneId}`, { params: { userId } });
    return zoneId;
  }
);

const geolocationSlice = createSlice({
  name: 'geolocation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<UserLocation | null>) => {
      state.currentLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Location
      .addCase(fetchLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLocation = action.payload;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки локации';
      })
      // Update Location
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.currentLocation = action.payload;
      })
      // Search Nearby Users
      .addCase(searchNearbyUsers.fulfilled, (state, action) => {
        state.nearbyUsers = action.payload || [];
      })
      // Fetch Privacy Settings
      .addCase(fetchPrivacySettings.fulfilled, (state, action) => {
        state.privacySettings = action.payload;
      })
      // Update Privacy Settings
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.privacySettings = action.payload;
      })
      // Fetch Zones
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload || [];
      })
      // Create Zone
      .addCase(createZone.fulfilled, (state, action) => {
        state.zones.push(action.payload);
      })
      // Delete Zone
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.zones = state.zones.filter(zone => zone.id !== action.payload);
      });
  },
});

export const { clearError, setTracking, setCurrentLocation } = geolocationSlice.actions;
export default geolocationSlice.reducer;

