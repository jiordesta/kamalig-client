import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const register = newAsyncThunk("/auth/register", ApiType.POST);
export const login = newAsyncThunk("/auth/login", ApiType.POST);
export const authenticate = newAsyncThunk("/auth", ApiType.GET);

type AuthenticationState = {
  token: string;
  user: any;
  isAuthenticating: boolean;
};

const initialState: AuthenticationState = getFromStorage("auth") || {
  token: null,
  user: null,
  isAuthenticating: false,
};

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.user = null;
    },
    reset: () => {
      localStorage.clear();
      // window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(authenticate.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(authenticate.rejected, (state) => {
        state.isAuthenticating = false;
      });
  },
});

export const { logout, reset } = authenticationSlice.actions;

export default authenticationSlice.reducer;
