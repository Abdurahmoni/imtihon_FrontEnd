"use client";

import { useState, useEffect } from "react";
import {
    useGetAllProdactQuery,
    useGetFilterProdactQuery,
} from "@/api/prodactApi";
import {
    useAddToWishListMutation,
    useDeleteWishListMutation,
} from "@/api/wishListApi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useAddToCardMutation } from "@/api/addToCard";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Product() {
    const [addToWishList] = useAddToWishListMutation();
    const [deleteWishList] = useDeleteWishListMutation();
    const [addToCard] = useAddToCardMutation();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id");

    const [categorieId, setCategorieId] = useState(categoryId || 0);

    const { data: product, refetch } = useGetFilterProdactQuery(categorieId);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const value = searchParams.get("category_id");
            setCategorieId(value || 0);
            refetch();
        }
    }, [searchParams.get("category_id")]);

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

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
        }
    }, []);

    const reviewsFunc = (reviews: any) => {
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        return reviews.length ? (sum / reviews.length).toFixed(1) : "0";
    };

    return (
        <div className="mb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {product?.map((item: any, index: number) => (
                    <Link href={`/prodact/${item.id}`} key={index}>
                        <div
                            className="flex flex-col rounded-xl border border-gray-200 overflow-hidden"
                            key={index}
                        >
                            <div className="relative ">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWishlistToggle(
                                            item.id,
                                            item.wishlists.length
                                        );
                                    }}
                                    className="absolute top-2 right-2 z-50 p-1 bg-white bg-opacity-50 rounded-full transition-transform duration-200 active:scale-90"
                                >
                                    <Image
                                        src={
                                            item.wishlists.length &&
                                            item.wishlists[0].user_id ===
                                                user?.id
                                                ? "/saqlanganlarbg.svg"
                                                : "/saqlanganlar.svg"
                                        }
                                        alt="wishlist"
                                        width={24}
                                        height={24}
                                    />
                                </button>

                                <Carousel className="w-full   bg-slate-100 aspect-square">
                                    <CarouselContent>
                                        {item.image?.map(
                                            (img: string, i: number) => (
                                                <CarouselItem key={i}>
                                                    <div className="w-full h-full aspect-square ">
                                                        <img
                                                            src={`http://localhost:3000/product/${img}`}
                                                            alt="product"
                                                            className="w-full h-full  object-cover rounded-t-lg"
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
                                    <span>{reviewsFunc(item.reviews)}</span>
                                    <span>
                                        ({item.reviews.length} ta sharh)
                                    </span>
                                </div>
                                <div className="mt-auto  flex justify-between items-center">
                                    <p className="font-bold">
                                        {item.price} so'm
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (
                                                !item.cartItems.some(
                                                    (i: any) =>
                                                        i.user_id === user?.id
                                                )
                                            ) {
                                                addToCard({
                                                    product_id: item.id,
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
