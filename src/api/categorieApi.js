import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categorieApi = createApi({
    reducerPath: "categorieApi",
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
        addCategory: builder.mutation({
            query: (credentials) => ({
                url: "/categories",
                method: "POST",
                body: credentials,
            }),
        }),
        getCategories: builder.query({
            query: () => "/categories",
        }),
        deleteCategory: builder.mutation({
            query: (cartId) => ({
                url: "/categories/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
        updateCategory: builder.mutation({
            query: (credentials) => ({
                url: "/categories/" + credentials.id,
                method: "PATCH",
                body: credentials,
            }),
        }),
    }),
});

export const {
    useAddCategoryMutation,
    useGetCategoriesQuery,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
} = categorieApi;
