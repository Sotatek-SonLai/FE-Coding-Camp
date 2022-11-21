import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthInterface } from "./auth.interface";

const initialState: AuthInterface = {
  accessToken: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
