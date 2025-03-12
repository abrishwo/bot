import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchActiveLotteries } from './lotteriesAPI';

export interface Lottery {
  id: string;
  name: string;
  prize: string;
  ticketPrice: number;
  imageUrl: string;
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

export const getLotteries = createAsyncThunk<
  Lottery[], // The type of the successful response
  void,      // Argument passed to the thunk (none in this case)
  { rejectValue: string } // Error type
>(
  'lotteries/fetchActiveLotteries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchActiveLotteries(); // This should return Lottery[]
      return response;
    } catch (error: unknown) {
      let message = 'Unknown error occurred';
      if (error instanceof Error) {
        message = error.message;
      }
      // Return the error message using rejectWithValue
      return rejectWithValue(message); // Ensure the error is a string
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
