import { configureStore } from "@reduxjs/toolkit";
import { imagesReducer } from "./action"; // Correct the import path
import authReducer from "./loginAction";

const store = configureStore({
  reducer: {
    auth: authReducer,
    images: imagesReducer, // Add the images reducer here
  },
});

export default store;
