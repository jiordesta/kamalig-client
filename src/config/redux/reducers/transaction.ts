import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllTransactions = newAsyncThunk(
  "/transaction/fetchall",
  ApiType.GET,
);
export const createTransaction = newAsyncThunk(
  "/transaction/create",
  ApiType.POST,
);
export const updateTransaction = newAsyncThunk(
  "/transaction/update",
  ApiType.PATCH,
);
export const deleteTransaction = newAsyncThunk(
  "/transaction/delete",
  ApiType.DEL,
);
export const fetchTransactionItems = newAsyncThunk(
  "/transaction/fetchitems",
  ApiType.GET,
);

type TransactionState = {
  transactions: any[];
  showLoading: boolean;
};

const initialState: TransactionState = getFromStorage("transaction") || {
  transactions: [],
  showLoading: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTransactions.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllTransactions.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = transactionSlice.actions;

export default transactionSlice.reducer;
