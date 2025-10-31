import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { CreditBalance, Transaction, TransferRequest } from '../../types/credit';

interface CreditState {
  balance: CreditBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

const initialState: CreditState = {
  balance: null,
  transactions: [],
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
export const fetchBalance = createAsyncThunk(
  'credit/fetchBalance',
  async (userId: number) => {
    const response = await apiClient.get(`/credits/${userId}/balance`);
    return response.data;
  }
);

export const fetchTransactions = createAsyncThunk(
  'credit/fetchTransactions',
  async ({ userId, page = 0, size = 20 }: { userId: number; page?: number; size?: number }) => {
    const response = await apiClient.get(`/credits/${userId}/transactions`, {
      params: { page, size },
    });
    return response.data;
  }
);

export const createTransfer = createAsyncThunk(
  'credit/createTransfer',
  async ({ userId, transfer }: { userId: number; transfer: TransferRequest }) => {
    const response = await apiClient.post(`/credits/${userId}/transfer`, transfer);
    return response.data;
  }
);

const creditSlice = createSlice({
  name: 'credit',
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
      // Fetch Balance
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки баланса';
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = Array.isArray(action.payload) ? action.payload : action.payload.content || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки транзакций';
      })
      // Create Transfer
      .addCase(createTransfer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновить баланс после перевода
        if (state.balance) {
          state.balance.availableBalance -= (action.payload.amount + (action.payload.fee || 0));
        }
        // Добавить транзакцию в начало списка
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка перевода';
      });
  },
});

export const { clearError, setFilters, clearFilters, setPage } = creditSlice.actions;
export default creditSlice.reducer;

