// src/Toolkit/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice.js";
import productsReducer from "./Slices/ProductSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
    },
});