import { createSlice } from "@reduxjs/toolkit";

export const transportSlice = createSlice({
  name: "transport",
  initialState: {
    transportData: null,
  },
  reducers: {
    setTransportData: (state, action) => {
      state.transportData = action.payload;
    },
  },
});

export const { setTransportData } = transportSlice.actions;

export default transportSlice.reducer;
