import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type VisbilityState = {
  userSession: null | string;
};

const initialState: VisbilityState = {
  userSession: null,
};

const userSessionSlice = createSlice({
  name: "userSession",
  initialState,
  reducers: {
    setUserSession(state, action: PayloadAction<string | null>) {
      state.userSession = action.payload;
    },
  },
});

export const { setUserSession } = userSessionSlice.actions;

export default userSessionSlice.reducer;
