import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { MediaType } from "@/types";

export interface DataViewConfigState {
  searchTerm: string;
  limit: number;
  page: number;
  filter: { siteUrl: string | null; type: MediaType | null };
}

const initialState: DataViewConfigState = {
  searchTerm: "",
  limit: 10,
  page: 1,
  filter: { siteUrl: null, type: null },
};

export const dataViewConfigSlice = createSlice({
  name: "dataViewConfig",
  initialState,
  reducers: {
    setDataViewConfig(
      state,
      action: PayloadAction<Partial<DataViewConfigState>>
    ) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setDataViewConfig } = dataViewConfigSlice.actions;
export default dataViewConfigSlice.reducer;
export const dataViewConfigSelector = (state: RootState) =>
  state.dataViewConfig;
