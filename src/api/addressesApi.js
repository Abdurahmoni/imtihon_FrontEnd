import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const addressesApi = createApi({
    reducerPath: "addressesApi",
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
        addOrder: builder.mutation({
            query: (credentials) => ({
                url: "/addresses/order/" + credentials.id,
                method: "POST",
                body: credentials,
            }),
        }),
        addUser: builder.mutation({
            query: (credentials) => ({
                url: "/addresses/user/" + credentials.id,
                method: "POST",
                body: credentials,
            }),
        }),
        getAllAddress: builder.query({
            query: () => "/addresses",
        }),
        deleteAddress: builder.mutation({
            query: (cartId) => ({
                url: "/addresses/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
        updateAddress: builder.mutation({
            query: (credentials) => ({
                url: "/addresses/" + credentials.id,
                method: "PATCH",
                body: credentials,
            }),
        }),
    }),
});

export const {
    useAddOrderMutation,
    useAddUserMutation,
    useGetAllAddressQuery,
    useDeleteAddressMutation,
    useUpdateAddressMutation,
} = addressesApi;
