import { authApi } from "@/api/authApi";
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "@/api/userApi";
import { bannerApi } from "@/api/bannerApi";
import { prodactApi } from "@/api/prodactApi";
import { addToCardApi } from "@/api/addToCard";
import { wishListApi } from "@/api/wishListApi";
import { categorieApi } from "@/api/categorieApi";
import { ordersApi } from "@/api/ordersApi";
import { addressesApi } from "@/api/addressesApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [bannerApi.reducerPath]: bannerApi.reducer,
        [prodactApi.reducerPath]: prodactApi.reducer,
        [addToCardApi.reducerPath]: addToCardApi.reducer,
        [wishListApi.reducerPath]: wishListApi.reducer,
        [categorieApi.reducerPath]: categorieApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [addressesApi.reducerPath]: addressesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(bannerApi.middleware)
            .concat(prodactApi.middleware)
            .concat(addToCardApi.middleware)
            .concat(wishListApi.middleware)
            .concat(categorieApi.middleware)
            .concat(ordersApi.middleware)
            .concat(addressesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
