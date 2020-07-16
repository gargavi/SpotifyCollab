import { createSlice } from '@reduxjs/toolkit';

export const queueSlice = createSlice({
  name: 'main',
  initialState: {
    songName: "Nothing", 
    songImage: "",
    queue: []
  },
  reducers: {
    setSongName: (state, action) => {
        state.songName = action.payload.song;
        state.songImage =  action.payload.img.url;
    },
    goNextQueue: (state, action) => { 
      if (state.queue.length > 0 && state.queue[0].name == action.payload.song) { 
        state.queue = state.queue.slice(1)
      }
      state.songName = action.payload.song; 
      state.songImage = action.payload.img.url
    }, 
    addSong: (state, action) => { 
      state.queue.push(action.payload); 
    },
  },
});

export const {setSongName, goNextQueue, addSong, setSongImage} = queueSlice.actions;


export default queueSlice.reducer;
