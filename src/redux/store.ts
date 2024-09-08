import { configureStore } from "@reduxjs/toolkit";
import { orderAPI } from "./api/orderAPI";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { cartReducer } from "./reducer/cartReducer";
import { userReducer } from "./reducer/userReducer";
import { dashboardApi } from "./api/dashboardAPI";

export const server = import.meta.env.VITE_SERVER //backend server link

export const store = configureStore({
  reducer: {
    // userApi: userAPI.reducer,
    //same result of both just static name change krkay dynamic daaldiya hai
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware).concat(productAPI.middleware).concat(orderAPI.middleware).concat(dashboardApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
