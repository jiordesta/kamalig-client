import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllStocks = newAsyncThunk("/stock/fetchall", ApiType.GET);
export const fetchStockFlow = newAsyncThunk("/stock/flow", ApiType.GET);
export const setStockAsOutOfStock = newAsyncThunk(
  "/stock/setoutstock",
  ApiType.DEL,
);

type StockState = {
  stocks: any[];
  showLoading: boolean;
};

const initialState: StockState = getFromStorage("stock") || {
  stocks: [],
  showLoading: false,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStocks.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllStocks.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = stockSlice.actions;

export default stockSlice.reducer;
