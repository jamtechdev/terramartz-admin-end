import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './slices/kyc.slice';

export const store = configureStore({
  reducer: {
    kyc: kycReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;