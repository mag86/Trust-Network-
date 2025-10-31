import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { Task, TaskCreateRequest, TaskSearchRequest, Bid, BidCreateRequest } from '../../types/task';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category?: string;
    minCredit?: number;
    maxCredit?: number;
    status?: string;
    radius?: number;
    lat?: number;
    lon?: number;
  };
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  bids: [],
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
export const searchTasks = createAsyncThunk(
  'task/searchTasks',
  async (searchParams: TaskSearchRequest) => {
    const response = await apiClient.get('/tasks/search', { params: searchParams });
    return response.data;
  }
);

export const fetchTask = createAsyncThunk(
  'task/fetchTask',
  async (taskId: number) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async ({ userId, task }: { userId: number; task: TaskCreateRequest }) => {
    const response = await apiClient.post('/tasks', task, {
      params: { userId },
    });
    return response.data;
  }
);

export const fetchBids = createAsyncThunk(
  'task/fetchBids',
  async (taskId: number) => {
    const response = await apiClient.get(`/tasks/${taskId}/bids`);
    return response.data;
  }
);

export const createBid = createAsyncThunk(
  'task/createBid',
  async ({ taskId, userId, bid }: { taskId: number; userId: number; bid: BidCreateRequest }) => {
    const response = await apiClient.post(`/tasks/${taskId}/bids`, bid, {
      params: { userId },
    });
    return response.data;
  }
);

export const selectExecutor = createAsyncThunk(
  'task/selectExecutor',
  async ({ taskId, creatorId, executorId }: { taskId: number; creatorId: number; executorId: number }) => {
    const response = await apiClient.post(`/tasks/${taskId}/select-executor`, null, {
      params: { creatorId, executorId },
    });
    return response.data;
  }
);

export const completeTask = createAsyncThunk(
  'task/completeTask',
  async ({ taskId, executorId }: { taskId: number; executorId: number }) => {
    const response = await apiClient.post(`/tasks/${taskId}/complete-by-executor`, null, {
      params: { executorId },
    });
    return response.data;
  }
);

export const confirmTask = createAsyncThunk(
  'task/confirmTask',
  async ({ taskId, creatorId }: { taskId: number; creatorId: number }) => {
    const response = await apiClient.post(`/tasks/${taskId}/confirm-by-creator`, null, {
      params: { creatorId },
    });
    return response.data;
  }
);

export const cancelTask = createAsyncThunk(
  'task/cancelTask',
  async ({ taskId, userId }: { taskId: number; userId: number }) => {
    const response = await apiClient.post(`/tasks/${taskId}/cancel`, null, {
      params: { userId },
    });
    return response.data;
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
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
      // Search Tasks
      .addCase(searchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.content || action.payload || [];
        if (action.payload.total !== undefined) {
          state.pagination.total = action.payload.total;
        }
      })
      .addCase(searchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка поиска задач';
      })
      // Fetch Task
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка создания задачи';
      })
      // Fetch Bids
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.bids = action.payload || [];
      })
      // Create Bid
      .addCase(createBid.fulfilled, (state, action) => {
        state.bids.push(action.payload);
      })
      // Select Executor
      .addCase(selectExecutor.fulfilled, (state, action) => {
        if (state.selectedTask) {
          state.selectedTask.status = 'IN_PROGRESS';
          state.selectedTask.executorId = action.payload.executorId;
        }
        const taskIndex = state.tasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
      })
      // Complete Task
      .addCase(completeTask.fulfilled, (state, action) => {
        if (state.selectedTask) {
          state.selectedTask.status = 'COMPLETED';
        }
      })
      // Confirm Task
      .addCase(confirmTask.fulfilled, (state, action) => {
        if (state.selectedTask) {
          state.selectedTask.status = 'COMPLETED';
        }
      })
      // Cancel Task
      .addCase(cancelTask.fulfilled, (state, action) => {
        if (state.selectedTask) {
          state.selectedTask.status = 'CANCELLED';
        }
        const taskIndex = state.tasks.findIndex(t => t.id === action.payload.id);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload;
        }
      });
  },
});

export const { clearError, setSelectedTask, setFilters, clearFilters, setPage } = taskSlice.actions;
export default taskSlice.reducer;

