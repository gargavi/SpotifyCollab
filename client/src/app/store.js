import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import loginReducer from "../components/login/loginSlice";
import mainReducer from "../components/main/mainSlice";
export default configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer, 
    main: mainReducer
  },
});
