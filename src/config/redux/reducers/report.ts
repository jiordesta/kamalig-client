import { createSlice } from "@reduxjs/toolkit";
import { ApiType, newAsyncThunk } from "../../newAsyncThunk";
import { getFromStorage } from "../../../libs/storage";

export const fetchAllReports = newAsyncThunk("/report/fetchall", ApiType.GET);
export const createReport = newAsyncThunk("/report/create", ApiType.POST);
export const displayReport = newAsyncThunk("/report/display", ApiType.GET);
type ReportState = {
  reports: any[];
  showLoading: boolean;
};

const initialState: ReportState = getFromStorage("report") || {
  stocks: [],
  showLoading: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReports.pending, (state) => {
        state.showLoading = true;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.reports = action.payload;
        state.showLoading = false;
      })
      .addCase(fetchAllReports.rejected, (state) => {
        state.showLoading = false;
      });
  },
});

export const {} = reportSlice.actions;

export default reportSlice.reducer;
