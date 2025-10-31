import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { UserProfile, Skill, Tag, PrivacySettings, ProfileUpdateRequest, SkillAddRequest } from '../../types/profile';

interface ProfileState {
  profile: UserProfile | null;
  skills: Skill[];
  tags: Tag[];
  privacySettings: PrivacySettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  skills: [],
  tags: [],
  privacySettings: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: number) => {
    const response = await apiClient.get(`/profiles/${userId}`);
    return response.data;
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, data }: { userId: number; data: ProfileUpdateRequest }) => {
    const response = await apiClient.put(`/profiles/${userId}`, data);
    return response.data;
  }
);

export const fetchSkills = createAsyncThunk(
  'profile/fetchSkills',
  async (userId: number) => {
    const response = await apiClient.get(`/profiles/${userId}/skills`);
    return response.data;
  }
);

export const addSkill = createAsyncThunk(
  'profile/addSkill',
  async ({ userId, skill }: { userId: number; skill: SkillAddRequest }) => {
    const response = await apiClient.post(`/profiles/${userId}/skills`, skill);
    return response.data;
  }
);

export const deleteSkill = createAsyncThunk(
  'profile/deleteSkill',
  async ({ userId, skillId }: { userId: number; skillId: number }) => {
    await apiClient.delete(`/profiles/${userId}/skills/${skillId}`);
    return skillId;
  }
);

export const fetchTags = createAsyncThunk(
  'profile/fetchTags',
  async (userId: number) => {
    const response = await apiClient.get(`/profiles/${userId}/tags`);
    return response.data;
  }
);

export const addTag = createAsyncThunk(
  'profile/addTag',
  async ({ userId, tag }: { userId: number; tag: { name: string } }) => {
    const response = await apiClient.post(`/profiles/${userId}/tags`, tag);
    return response.data;
  }
);

export const fetchPrivacySettings = createAsyncThunk(
  'profile/fetchPrivacySettings',
  async (userId: number) => {
    const response = await apiClient.get(`/profiles/${userId}/privacy`);
    return response.data;
  }
);

export const updatePrivacySettings = createAsyncThunk(
  'profile/updatePrivacySettings',
  async ({ userId, settings }: { userId: number; settings: Partial<PrivacySettings> }) => {
    const response = await apiClient.put(`/profiles/${userId}/privacy`, settings);
    return response.data;
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.skills = [];
      state.tags = [];
      state.privacySettings = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки профиля';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления профиля';
      })
      // Fetch Skills
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      })
      // Add Skill
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
      })
      // Delete Skill
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter(skill => skill.id !== action.payload);
      })
      // Fetch Tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      // Add Tag
      .addCase(addTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      // Fetch Privacy Settings
      .addCase(fetchPrivacySettings.fulfilled, (state, action) => {
        state.privacySettings = action.payload;
      })
      // Update Privacy Settings
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.privacySettings = action.payload;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;

