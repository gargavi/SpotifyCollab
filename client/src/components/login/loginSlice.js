import { createSlice, findNonSerializableValue } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    name: "",
    room: "",
    code: "", 
    admin: false, 
    users: [], 
    access_token: ""
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
    setUsers: (state, action) => { 
      state.users = action.payload
    }, 
    setAccess: (state, action) => { 
      state.access_token = action.payload; 
    }
  },
});

export const {setName, setRoom, setCode, makeAdmin, setUsers, setAccess} = loginSlice.actions;


export default loginSlice.reducer;
