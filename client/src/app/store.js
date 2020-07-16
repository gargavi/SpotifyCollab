import { configureStore } from '@reduxjs/toolkit'; 
import loginReducer from "../components/login/loginSlice";
import mainReducer from "../components/main/mainSlice";
import queueReducer from "../components/queue/queueSlice"; 

export default configureStore({
  reducer: {
    login: loginReducer, 
    main: mainReducer, 
    queue: queueReducer
  },
});
