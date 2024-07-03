import { createSlice } from "@reduxjs/toolkit";

export const accommodationSlice = createSlice({
  name: "accommodation",
  initialState: {
    accommodationData: null,
  },
  reducers: {
    setAccommodationData: (state, action) => {
      state.accommodationData = action.payload;
    },
  },
});

export const { setAccommodationData } = accommodationSlice.actions;

export default accommodationSlice.reducer;
