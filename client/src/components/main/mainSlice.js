import { createSlice } from '@reduxjs/toolkit';

export const mainSlice = createSlice({
  name: 'main',
  initialState: {
    value: 0
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload; 
    },
  },
});

export const {} = mainSlice.actions;


export default mainSlice.reducer;
