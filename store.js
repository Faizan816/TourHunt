import { configureStore } from "@reduxjs/toolkit";
import tourReducer from "./tourSlice";
import accommodationSlice from "./accommodationSlice";
import transportSlice from "./transportSlice";
import budgetSlice from "./budgetSlice";
import communitySlice from "./communitySlice";

// Define your initial state
const initialState = {
  isLoggedIn: false,
};

// Define your reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, isLoggedIn: false };
    default:
      return state;
  }
};

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: reducer,
    tour: tourReducer,
    accommodation: accommodationSlice,
    transport: transportSlice,
    budget: budgetSlice,
    community: communitySlice,
  },
});

export default store;
