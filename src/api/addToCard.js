import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addToCardApi = createApi({
    reducerPath: "addToCardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:4000",
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
        addToCard: builder.mutation({
            query: (credentials) => ({
                url: "/cart-items",
                method: "POST",
                body: credentials,
            }),
        }),
        getCard: builder.query({
            query: () => "/cart-items",
        }),
        deleteCard: builder.mutation({
            query: (cartId) => ({
                url: "/cart-items/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
        updateCard: builder.mutation({
            query: (credentials) => ({
                url: "/cart-items/" + credentials.id,
                method: "PATCH",
                body: credentials,
            }),
        }),
    }),
});

export const {
    useAddToCardMutation,
    useGetCardQuery,
    useDeleteCardMutation,
    useUpdateCardMutation,
} = addToCardApi;
