"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchQuery } from "@/api/prodactApi";
import {
    useAddToWishListMutation,
    useDeleteWishListMutation,
} from "@/api/wishListApi";
import { useAddToCardMutation } from "@/api/addToCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useGetCategoriesQuery } from "@/api/categorieApi";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [addToCard] = useAddToCardMutation();
    const [searchResults, setSearchResults] = useState([]);
    const searchQuery = searchParams.get("query") || "";
    const { data: categories } = useGetCategoriesQuery([]);
    try {
        const { data: searchResult, refetch } = useSearchQuery(searchQuery);

   
    console.log(searchResults);

    useEffect(() => {
        if (searchResult) {
            console.log(searchResult);

            setSearchResults(searchResult);
        }
    }, [searchResult]);
    useEffect(() => {
        refetch(); // Har bir sahifa refresh bo'lganda qaytadan malumotlarni yuklash
    }, [searchQuery]);
     } catch (error) {
        console.log(error);
    }

    const reviewsFunc = (reviews: any) => {
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        return reviews.length ? (sum / reviews.length).toFixed(1) : "0";
    };

    const [user, setUser] = useState<any>(null);

    const minPrice =
        searchResults?.length > 0
            ? Math.min(...searchResults.map((item: any) => item.price))
            : 0;
    const maxPrice =
        searchResults?.length > 0
            ? Math.max(...searchResults.map((item: any) => item.price))
            : 1000000;

    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categories?.map((category: any) => category.name) || []
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
        }
    }, []);

    const [addToWishList] = useAddToWishListMutation();
    const [deleteWishList] = useDeleteWishListMutation();
    const handleWishlistToggle = async (
        productId: string,
        wishlistsLength: number
    ) => {
        if (wishlistsLength === 1) {
            await deleteWishList(productId).unwrap();
        } else {
            await addToWishList(productId).unwrap();
        }
        refetch();
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const filteredResults =
        searchResults &&
        searchResults.filter((item: any) => {
            return (
                item.price >= priceRange[0] &&
                item.price <= priceRange[1] &&
                selectedCategories.includes(item.category.name)
            );
        });

    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Filtrlar</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium mb-2">
                                    Narx oralig'i
                                </h3>
                                <input
                                    type="range"
                                    min={minPrice}
                                    max={maxPrice}
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            Number(e.target.value),
                                            priceRange[1],
                                        ])
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <input
                                    type="range"
                                    min={minPrice}
                                    max={maxPrice}
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Number(e.target.value),
                                        ])
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>
                                        {new Intl.NumberFormat("uz-UZ").format(
                                            priceRange[0]
                                        )}{" "}
                                        so'm
                                    </span>
                                    <span>
                                        {new Intl.NumberFormat("uz-UZ").format(
                                            priceRange[1]
                                        )}{" "}
                                        so'm
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">
                                    Kategoriyalar
                                </h3>
                                <div className="space-y-2">
                                    {categories?.map((category: any) => (
                                        <div
                                            key={category?.name}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                id={category?.name}
                                                type="checkbox"
                                                checked={selectedCategories.includes(
                                                    category?.name
                                                )}
                                                onChange={() =>
                                                    handleCategoryToggle(
                                                        category.name
                                                    )
                                                }
                                                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-md checked:bg-teal-600 checked:border-teal-500 transition-all duration-200 cursor-pointer"
                                            />
                                            <Label htmlFor={category?.name}>
                                                {category.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-3/4">
                    {filteredResults?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4">
                            {filteredResults?.map(
                                (item: any, index: number) => (
                                    <div
                                        className="flex flex-col rounded-xl border border-gray-200 overflow-hidden"
                                        key={index}
                                    >
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    handleWishlistToggle(
                                                        item.id,
                                                        item.wishlists.length
                                                    );
                                                    refetch();
                                                }}
                                                className="absolute top-2 right-2 z-10 p-1 bg-white bg-opacity-50 rounded-full transition-transform duration-200 active:scale-90"
                                            >
                                                <Image
                                                    src={
                                                        item.wishlists.length &&
                                                        item.wishlists[0]
                                                            .user_id ===
                                                            user?.id
                                                            ? "/saqlanganlarbg.svg"
                                                            : "/saqlanganlar.svg"
                                                    }
                                                    alt="wishlist"
                                                    width={24}
                                                    height={24}
                                                />
                                            </button>
                                            <Carousel className="w-full h-full bg-slate-100 aspect-square">
                                                <CarouselContent>
                                                    {item.image?.map(
                                                        (
                                                            img: string,
                                                            i: number
                                                        ) => (
                                                            <CarouselItem
                                                                key={i}
                                                            >
                                                                <div className="w-full h-full aspect-square ">
                                                                    <img
                                                                        src={`http://localhost:3000/product/${img}`}
                                                                        alt="product"
                                                                        className="w-full h-full object-cover rounded-t-lg"
                                                                    />
                                                                </div>
                                                            </CarouselItem>
                                                        )
                                                    )}
                                                </CarouselContent>
                                            </Carousel>
                                        </div>

                                        <div className="p-4 gap-3 flex flex-col  flex-grow">
                                            <h3 className="font-semibold line-clamp-2 h-12">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Image
                                                    src="/yuldischa.svg"
                                                    alt="rating"
                                                    width={15}
                                                    height={15}
                                                />
                                                <span>
                                                    {reviewsFunc(item.reviews)}
                                                </span>
                                                <span>
                                                    ({item.reviews.length} ta
                                                    sharh)
                                                </span>
                                            </div>
                                            <div className="mt-auto  flex justify-between items-center">
                                                <p className="font-bold">
                                                    {item.price} so'm
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        if (
                                                            !item.cartItems.some(
                                                                (i: any) =>
                                                                    i.user_id ===
                                                                    user?.id
                                                            )
                                                        ) {
                                                            addToCard({
                                                                product_id:
                                                                    item.id,
                                                            });
                                                            refetch();
                                                        }
                                                    }}
                                                    className="transition-transform duration-200 active:scale-90"
                                                >
                                                    <Image
                                                        src="/savatAddIcon.svg"
                                                        alt="add to cart"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10 text-lg">
                            Mahsulotlar topilmadi
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
