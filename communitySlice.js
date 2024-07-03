import { createSlice } from "@reduxjs/toolkit";

export const communitySlice = createSlice({
  name: "communities",
  initialState: {
    communities: [
      {
        id: 0,
        name: "Faizan Community",
        users: [
          {
            id: 0,
            username: "Faizan",
            email: "faizan@gmail.com",
            password: "123",
            role: "admin",
            messages: [
              {
                message: "Hello, I am new to community...",
                time: "2:54 PM",
                date: "2024/2/9",
              },
              {
                message: "I wanted to make some research about a place.",
                time: "2:57 PM",
                date: "2024/2/9",
              },
            ],
          },
          {
            id: 1,
            username: "Ali",
            email: "ali@gmail.com",
            password: "456",
            role: "user",
            messages: [
              {
                message: "Okay. So what you want to know?",
                time: "2:55 PM",
                date: "2024/2/9",
              },
              {
                message: "I see. Well then start asking your questions.",
                time: "2:59 PM",
                date: "2024/2/9",
              },
            ],
          },
        ],
      },
    ],
  },
  reducers: {
    setCommunity: (state, action) => {
      state.community = action.payload;
    },
  },
});

export const { setCommunity } = communitySlice.actions;

export default communitySlice.reducer;
