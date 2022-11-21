import { combineReducers } from "@reduxjs/toolkit";
import walletReducer from "./wallet/wallet.slice";
import authReducer from "./auth/auth.slice";

const rootReducer = combineReducers({
  wallet: walletReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
