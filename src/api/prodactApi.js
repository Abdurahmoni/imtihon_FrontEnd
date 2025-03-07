import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Search } from "lucide-react";

export const prodactApi = createApi({
    reducerPath: "prodactApi",
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
        getAllProdact: builder.query({
            query: () => "/products",
        }),
        getOneProdact: builder.query({
            query: (prodactId) => ({
                url: "/products/" + prodactId,
            }),
        }),
        getFilterProdact: builder.query({
            query: (prodactId) => ({
                url: "/products/filter/" + prodactId,
            }),
        }),
        search: builder.query({
            query: (name) => ({
                url: "/products/search/" + name,
            }),
        }),
    }),
});

export const {
    useGetAllProdactQuery,
    useGetOneProdactQuery,
    useGetFilterProdactQuery,
    useSearchQuery,
} = prodactApi;
