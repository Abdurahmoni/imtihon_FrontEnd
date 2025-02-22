import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000",
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
        ordersPost: builder.mutation({
            query: (credentials) => ({
                url: "/orders",
                method: "POST",
                body: credentials,
            }),
        }),
        getOrders: builder.query({
            query: () => "/orders/getme",
        }),
        deleteOrders: builder.mutation({
            query: (cartId) => ({
                url: "/orders/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
        updateOrders: builder.mutation({
            query: (credentials) => ({
                url: "/orders/" + credentials.id,
                method: "PATCH",
                body: credentials,
            }),
        }),
    }),
});

export const {
    useOrdersPostMutation,
    useGetOrdersQuery,
    useDeleteOrdersMutation,
    useUpdateOrdersMutation,
} = ordersApi;
