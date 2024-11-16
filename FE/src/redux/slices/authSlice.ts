import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../store";

export interface AuthState {
  username?: string | null;
  token: string;
}

const initialState: AuthState = {
  username: null,
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action: PayloadAction<AuthState>) {
      Object.assign(state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthState } = authSlice.actions;

export default authSlice.reducer;
export const authSelector = (state: RootState) => state.auth;
