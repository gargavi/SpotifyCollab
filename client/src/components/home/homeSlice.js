import { createSlice } from '@reduxjs/toolkit';

export const homeSlice = createSlice({
  name: 'login',
  initialState: {
    users: []
  },
  reducers: {
    addUser: (state, action) => { 
        users.push(action.payload); 
    }
  },
});

export const {addUser } = homeSlice.actions;


export default homeSlice.reducer;
