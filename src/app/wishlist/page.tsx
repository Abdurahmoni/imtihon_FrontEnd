"use client";
import { useGetAllProdactQuery } from "@/api/prodactApi";
import {
    useGetWishListQuery,
    useDeleteWishListMutation,
} from "@/api/wishListApi";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAddToCardMutation } from "@/api/addToCard";

export default function WishlistPage() {
    const { data: wishList, refetch: refetchWishList } = useGetWishListQuery(
        []
    );
    const { data: prodact, refetch } = useGetAllProdactQuery([]);
    const [deleteWishList] = useDeleteWishListMutation();
    const [addToCard] = useAddToCardMutation();
    const [user, setUser] = useState<any>(null);

    const filteredProducts = prodact?.filter((item: any) =>
        wishList?.some((wish: any) => wish.product.id === item.id)
    );

    const handleRemoveFromWishlist = async (productId: string) => {
        await deleteWishList(productId).unwrap();
        refetch();
        refetchWishList();
    };

    useEffect(() => {
        refetch();
        refetchWishList();
        if (typeof window !== "undefined") {
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
        }
    }, [refetch, refetchWishList]);

    const reviewsFunc = (reviews: any) => {
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        return reviews.length ? (sum / reviews.length).toFixed(1) : "0";
    };

    return (
        <div className=" mt-10 mb-24">
            {filteredProducts?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map((item: any) => (
                        <Link href={`/prodact/${item.id}`} key={item.id}>
                            <div
                                key={item.id}
                                className="flex flex-col rounded-xl border border-gray-200 overflow-hidden"
                            >
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveFromWishlist(item.id);
                                        }}
                                        className="absolute top-2 right-2 z-10 p-1 bg-white bg-opacity-50 rounded-full transition-transform duration-200 active:scale-90"
                                    >
                                        <Image
                                            src="/saqlanganlarbg.svg"
                                            alt="wishlist"
                                            width={24}
                                            height={24}
                                        />
                                    </button>

                                    <Carousel className="w-full aspect-square">
                                        <CarouselContent>
                                            {item.image?.map(
                                                (img: string, i: number) => (
                                                    <CarouselItem key={i}>
                                                        <div className="w-full aspect-square ">
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

                                <div className="p-4 flex flex-col gap-2 flex-grow">
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
                                    <div className="mt-auto pt-4 flex justify-between items-center">
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
                                                            i.user_id ===
                                                            user?.id
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
            ) : (
                <div className="mt-20 flex flex-col items-center justify-center text-center">
                    <Image
                        src="/saqlanganlarNotFund.png"
                        alt="no-wishlist"
                        width={150}
                        height={150}
                    />
                    <h1 className="text-xl sm:text-2xl font-bold mt-4">
                        Sizga yoqqanini qo'shing
                    </h1>
                    <p className="mt-2 max-w-md">
                        Bosh sahifaga o'ting va mahsulotdagi ♡ belgisini bosing
                    </p>
                    <Link href="/">
                        <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                            Bosh sahifaga o'tish
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
