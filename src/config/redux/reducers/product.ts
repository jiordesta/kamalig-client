import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllProducts = newAsyncThunk("/product/fetchall", ApiType.GET);
export const createProduct = newAsyncThunk("/product/create", ApiType.POST);
export const updateProduct = newAsyncThunk("/product/update", ApiType.PATCH);
export const deleteProduct = newAsyncThunk("/product/delete", ApiType.DEL);

type ProductState = {
  products: any[];
  showLoading: boolean;
};

const initialState: ProductState = getFromStorage("product") || {
  products: [],
  showLoading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = productSlice.actions;

export default productSlice.reducer;
