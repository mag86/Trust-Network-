import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';

interface AuthState {
  user: { id: number; email: string } | null;
  tokens: { accessToken: string; refreshToken: string } | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }
);

export const logout = createAsyncThunk('auth/logout', async (refreshToken: string) => {
  await apiClient.post('/auth/logout', null, {
    params: { refreshToken },
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: number; email: string } | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { id: action.payload.userId, email: action.payload.email };
        state.tokens = {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

