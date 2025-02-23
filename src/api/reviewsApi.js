import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewsApi = createApi({
    reducerPath: "reviewsApi",
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
        addReview: builder.mutation({
            query: (credentials) => ({
                url: "/reviews",
                method: "POST",
                body: credentials,
            }),
        }),
        getReviews: builder.query({
            query: () => "/reviews",
        }),
        deleteReview: builder.mutation({
            query: (cartId) => ({
                url: "/reviews/" + cartId,
                method: "DELETE",
                body: cartId,
            }),
        }),
    }),
});

export const {
    useAddReviewMutation,
    useGetReviewsQuery,
    useDeleteReviewMutation,
} = reviewsApi;
