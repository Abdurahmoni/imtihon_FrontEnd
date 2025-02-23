import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishListApi = createApi({
    reducerPath: "wishListApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://desirable-stillness-production.up.railway.app",
        prepareHeaders: (headers, { getState }) => {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("userToken");
                if (token) {
                    headers.set("authorization", `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        addToWishList: builder.mutation({
            query: (prodactId) => ({
                url: "/wishlist/" + prodactId,
                method: "POST",
                body: prodactId,
            }),
        }),
        getWishList: builder.query({
            query: () => "/wishlist",
        }),
        deleteWishList: builder.mutation({
            query: (prodactId) => ({
                url: "/wishlist/" + prodactId,
                method: "DELETE",
                body: prodactId,
            }),
        }),
    }),
});

export const {
    useAddToWishListMutation,
    useGetWishListQuery,
    useDeleteWishListMutation,
} = wishListApi;
