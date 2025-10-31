import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { TrustScore, Review, ReviewCreateRequest, Badge } from '../../types/reputation';

interface ReputationState {
  trustScore: TrustScore | null;
  reviews: Review[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  filters: {
    rating?: number;
    dateFrom?: string;
    dateTo?: string;
  };
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

const initialState: ReputationState = {
  trustScore: null,
  reviews: [],
  badges: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 0,
    size: 20,
    total: 0,
  },
};

// Async thunks
export const fetchTrustScore = createAsyncThunk(
  'reputation/fetchTrustScore',
  async (userId: number) => {
    const response = await apiClient.get(`/trust-score/${userId}`);
    return response.data;
  }
);

export const recalculateTrustScore = createAsyncThunk(
  'reputation/recalculateTrustScore',
  async (userId: number) => {
    const response = await apiClient.post(`/trust-score/${userId}/recalculate`);
    return response.data;
  }
);

export const fetchReviews = createAsyncThunk(
  'reputation/fetchReviews',
  async ({ userId, page = 0, size = 20 }: { userId: number; page?: number; size?: number }) => {
    const response = await apiClient.get(`/reviews/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  }
);

export const createReview = createAsyncThunk(
  'reputation/createReview',
  async ({ authorId, targetUserId, review }: { authorId: number; targetUserId: number; review: ReviewCreateRequest }) => {
    const response = await apiClient.post('/reviews', review, {
      params: { authorId, targetUserId },
    });
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  'reputation/updateReview',
  async ({ reviewId, authorId, review }: { reviewId: number; authorId: number; review: Partial<ReviewCreateRequest> }) => {
    const response = await apiClient.put(`/reviews/${reviewId}`, review, {
      params: { authorId },
    });
    return response.data;
  }
);

export const fetchBadges = createAsyncThunk(
  'reputation/fetchBadges',
  async (userId: number) => {
    const response = await apiClient.get(`/badges/user/${userId}`);
    return response.data;
  }
);

export const checkBadges = createAsyncThunk(
  'reputation/checkBadges',
  async (userId: number) => {
    const response = await apiClient.post(`/badges/user/${userId}/check`);
    return response.data;
  }
);

const reputationSlice = createSlice({
  name: 'reputation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trust Score
      .addCase(fetchTrustScore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrustScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trustScore = action.payload;
      })
      .addCase(fetchTrustScore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки Trust Score';
      })
      // Recalculate Trust Score
      .addCase(recalculateTrustScore.fulfilled, (state, action) => {
        state.trustScore = action.payload;
      })
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = Array.isArray(action.payload) ? action.payload : action.payload.content || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки отзывов';
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания отзыва';
      })
      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      // Fetch Badges
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload || [];
      })
      // Check Badges
      .addCase(checkBadges.fulfilled, (state, action) => {
        // Обновить список бейджей если получены новые
        if (Array.isArray(action.payload)) {
          state.badges = action.payload;
        }
      });
  },
});

export const { clearError, setFilters, clearFilters, setPage } = reputationSlice.actions;
export default reputationSlice.reducer;

