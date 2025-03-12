import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchActiveLotteries } from './lotteriesAPI';

// Define your Lottery type
export interface Lottery {
  id: string;
  name: string;
  prize: string;
  ticketPrice: number;
  active: boolean;
  drawDate: string;
}

interface LotteriesState {
  items: Lottery[];
  loading: boolean;
  error: string | null;
}

const initialState: LotteriesState = {
  items: [],
  loading: false,
  error: null,
};

// ✅ createAsyncThunk
export const getLotteries = createAsyncThunk<
  Lottery[], // return type
  void,      // argument
  { rejectValue: string } // thunkAPI types
>(
  'lotteries/fetchActiveLotteries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchActiveLotteries(); // ✅ returns Lottery[]
      return response;
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      // ✅ rejectWithValue returns early
    //   return rejectWithValue(message);

    return "test data for rejectWithValue function"
    }
  }
);

const lotteriesSlice = createSlice({
  name: 'lotteries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLotteries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLotteries.fulfilled, (state, action: PayloadAction<Lottery[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getLotteries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch lotteries';
      });
  },
});

export default lotteriesSlice.reducer;
