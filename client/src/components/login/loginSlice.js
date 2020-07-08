import { createSlice, findNonSerializableValue } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    name: "",
    room: "",
    code: "", 
    admin: false, 
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload; 
    },
    setRoom: (state, action) => {
      state.room = action.payload; 
    },
    setCode: (state, action) => { 
      state.code = action.payload; 
    }, 
    makeAdmin: (state, action) => { 
      state.admin = action.payload
    }, 
  },
});

export const {setName, setRoom, setCode, makeAdmin } = loginSlice.actions;


export default loginSlice.reducer;
