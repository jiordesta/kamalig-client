import { createSlice } from "@reduxjs/toolkit";
import { getFromStorage } from "../../../libs/storage";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";

export const Device = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
};

type ConfigState = {
  device: (typeof Device)[keyof typeof Device];
  isNavActive: boolean;
  products: any[];
  items: any[];
  shopOwners: any[];
  roles: any[];
};

const initialState: ConfigState = getFromStorage("config") || {
  device: Device.DESKTOP,
  isNavActive: true,
  products: [],
  items: [],
  shopOwners: [],
  roles: [],
};

export const getProductList = newAsyncThunk(
  "/config/fetchproductlist",
  ApiType.GET,
);

export const getItemList = newAsyncThunk("/config/fetchitemlist", ApiType.GET);
export const getShopOwners = newAsyncThunk(
  "/config/fetchshopowners",
  ApiType.GET,
);
export const getRoles = newAsyncThunk("/config/fetchroles", ApiType.GET);

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      state.device = action.payload ? Device.MOBILE : Device.DESKTOP;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(getItemList.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(getShopOwners.fulfilled, (state, action) => {
      state.shopOwners = action.payload;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
    });
  },
});

export const { setDevice } = configSlice.actions;

export default configSlice.reducer;
