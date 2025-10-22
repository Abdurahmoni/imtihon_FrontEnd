import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentCartApi = createApi({
    reducerPath: "paymentCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://imtihonbackend-production-235e.up.railway.app",
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
                url: "/payment-card",
                method: "POST",
                body: credentials,
            }),
        }),
        getCard: builder.query({
            query: () => "/payment-card",
        }),
        deleteCard: builder.mutation({
            query: (cartId) => ({
                url: "/payment-card/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
        updateCard: builder.mutation({
            query: (credentials) => ({
                url: "/payment-card/" + credentials.id,
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
} = paymentCartApi;
