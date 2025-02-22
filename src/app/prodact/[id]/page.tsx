"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGetOneProdactQuery } from "@/api/prodactApi";
import {
    useAddToWishListMutation,
    useDeleteWishListMutation,
} from "@/api/wishListApi";
import { useAddToCardMutation } from "@/api/addToCard";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Truck, CreditCard, RotateCcw } from "lucide-react";
import Image from "next/image";

interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: "male" | "female";
    date_of_birth: string | null;
    address_id: number | null;
    role: "customer" | "admin" | "seller";
    is_active: boolean;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
    password?: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const { data: product, refetch } = useGetOneProdactQuery(id);
    const [addToWishList] = useAddToWishListMutation();
    const [deleteWishList] = useDeleteWishListMutation();
    const [addToCard] = useAddToCardMutation();
    const [selectedImage, setSelectedImage] = useState(0);

    const [user, setUser] = useState<UserProfile | null>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        }
    }, []);

    const handleWishlistToggle = async () => {
        if (!user) return alert("Iltimos, avval tizimga kiring!");

        try {
            if (
                product?.wishlists.length &&
                product.wishlists.some((w: any) => w.user_id === user?.id)
            ) {
                await deleteWishList(product.id).unwrap();
            } else {
                await addToWishList(product.id).unwrap();
            }
            refetch();
        } catch (error) {
            console.error("Xatolik yuz berdi:", error);
        }
    };

    const reviewsFunc = (reviews: any) => {
        let sum = 0;
        for (let i = 0; i < reviews.length; i++) {
            sum += reviews[i].rating;
        }
        return reviews.length ? (sum / reviews.length).toFixed(1) : "0";
    };

    if (!product) {
        return <div>Loading...</div>;
    }
    console.log(product.wishlists);

    return (
        <div className="mt-10">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="relative aspect-square bg-white rounded-lg  overflow-hidden">
                        <img
                            src={`http://localhost:3000/product/${product.image[selectedImage]}`}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto ">
                        {product.image?.map((img: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                                    selectedImage === index
                                        ? "border-indigo-600"
                                        : "border-gray-200"
                                }`}
                            >
                                <img
                                    src={`http://localhost:3000/product/${img}`}
                                    alt={`${product.name} thumbnail ${
                                        index + 1
                                    }`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                            star <=
                                            Math.round(
                                                Number(
                                                    reviewsFunc(product.reviews)
                                                )
                                            )
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {reviewsFunc(product.reviews)} (
                                {product.reviews.length} sharh)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold">
                                {product.price.toLocaleString()} so'm
                            </span>
                        </div>

                        <div className="flex flex-col   gap-4">
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWishlistToggle();
                                    }}
                                    className="absolute top-4 right-0 z-50 p-2 bg-white border border-gray-300 rounded-lg "
                                >
                                    <Image
                                        src={
                                            product.wishlists.length &&
                                            product.wishlists.some(
                                                (w: any) =>
                                                    w.user_id === user?.id
                                            )
                                                ? "/saqlanganlarbg.svg"
                                                : "/saqlanganlar.svg"
                                        }
                                        alt="wishlist"
                                        width={19}
                                        height={19}
                                    />
                                </button>
                            </div>

                            <Button
                                onClick={() => {
                                    if (
                                        !product.cartItems.some(
                                            (i: any) => i.user_id === user?.id
                                        )
                                    ) {
                                        addToCard({ product_id: product.id });
                                        refetch();
                                    }
                                }}
                                className="w-11/12 bg-teal-600 hover:bg-teal-700"
                            >
                                Savatga qo'shish
                            </Button>
                        </div>

                        <div className="space-y-4 pt-4">
                            <Card>
                                <CardContent className="p-4 flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            Yetkazib berish 1 kundan boshlab
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Behi buyurtmalarni topshirish
                                            punktida yoki kuryer orqali
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <h3 className="font-semibold mb-1">
                                            Qulay usulda xavfsiz to'lov
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Karta orqali, naqd pulda
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sharhlar</h2>
                <div className="grid gap-6">
                    {product.reviews.map((review: any, index: number) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${
                                                    star <= review.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-700">
                                    {review.comment}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
