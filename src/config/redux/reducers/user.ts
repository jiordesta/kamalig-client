import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllUsers = newAsyncThunk("/user/fetchall", ApiType.GET);
export const createUser = newAsyncThunk("/user/create", ApiType.POST);
export const updateUser = newAsyncThunk("/user/update", ApiType.PATCH);
export const deleteUser = newAsyncThunk("/user/delete", ApiType.DEL);

type UserState = {
  users: any[];
  showLoading: boolean;
};

const initialState: UserState = getFromStorage("user") || {
  users: [],
  showLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
