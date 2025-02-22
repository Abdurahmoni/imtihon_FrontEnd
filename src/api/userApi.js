import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
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
        getUser: builder.query({
            query: () => "/users",
        }),
        getOneUser: builder.query({
            query: () => "/users/getme",
        }),
        updateUser: builder.mutation({
            query: (credentials) => ({
                url: "/users",
                method: "PATCH",
                body: credentials,
            }),
        }),
    }),
});

export const { useGetUserQuery, useGetOneUserQuery, useUpdateUserMutation } = userApi;
