import { configureStore } from '@reduxjs/toolkit';

import loginReducer from "../components/login/loginSlice";
import mainReducer from "../components/main/mainSlice";
export default configureStore({
  reducer: {
    login: loginReducer, 
    main: mainReducer
  },
});
