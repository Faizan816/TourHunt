import { createSlice } from "@reduxjs/toolkit";

export const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    tourPackageBudget: 0,
    accommodationBudget: 0,
    transportBudget: 0,
    restaurantBudget: 0,
  },
  reducers: {
    setTourPackageBudget: (state, action) => {
      state.tourPackageBudget = action.payload;
    },
    setAccommodationBudget: (state, action) => {
      state.accommodationBudget = action.payload;
    },
    setTransportBudget: (state, action) => {
      state.transportBudget = action.payload;
    },
    setRestaurantBudget: (state, action) => {
      state.restaurantBudget = action.payload;
    },
  },
});

export const {
  setTourPackageBudget,
  setAccommodationBudget,
  setTransportBudget,
  setRestaurantBudget,
} = budgetSlice.actions;

export default budgetSlice.reducer;
