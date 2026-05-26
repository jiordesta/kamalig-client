import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllRestocks = newAsyncThunk("/restock/fetchall", ApiType.GET);
export const createRestock = newAsyncThunk("/restock/create", ApiType.POST);
export const updateRestock = newAsyncThunk("/restock/update", ApiType.PATCH);
export const deleteRestock = newAsyncThunk("/restock/delete", ApiType.DEL);

type RestockState = {
  restocks: any[];
  showLoading: boolean;
};

const initialState: RestockState = getFromStorage("restock") || {
  restocks: [],
  showLoading: false,
};

const restockSlice = createSlice({
  name: "restock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRestocks.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllRestocks.fulfilled, (state, action) => {
        state.restocks = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllRestocks.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = restockSlice.actions;

export default restockSlice.reducer;
