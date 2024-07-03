import { createSlice } from "@reduxjs/toolkit";

export const tourSlice = createSlice({
  name: "tour",
  initialState: {
    tourData: null,
  },
  reducers: {
    setTourData: (state, action) => {
      state.tourData = action.payload;
    },
  },
});

export const { setTourData } = tourSlice.actions;

export default tourSlice.reducer;
