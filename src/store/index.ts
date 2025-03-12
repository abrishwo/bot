import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import lotteriesReducer from '../features/lotteries/lotteriesSlice';
// import ticketsReducer from '../features/tickets/ticketsSlice';

export const store = configureStore({
  reducer: {
    lotteries: lotteriesReducer,
    // tickets: ticketsReducer,
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
