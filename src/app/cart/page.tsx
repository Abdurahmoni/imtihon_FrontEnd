"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    useGetCardQuery,
    useUpdateCardMutation,
    useDeleteCardMutation,
} from "@/api/addToCard";
import { useGetAllProdactQuery } from "@/api/prodactApi";
import { Button } from "@/components/ui/button";
import OrdersPage from "../orders/page";

const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
];

export default function CartPage() {
    const { data: card, refetch } = useGetCardQuery([]);
    const { data: prodact, refetch: refetchProdact } = useGetAllProdactQuery(
        []
    );
    const [updateCard] = useUpdateCardMutation();
    const [deleteCard] = useDeleteCardMutation();
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const today = new Date();
    today.setDate(today.getDate() + 1);
    const day = today.getDate();
    const month = months[today.getMonth()];

    useEffect(() => {
        if (card) {
            const total = card.reduce(
                (sum: number, item: any) =>
                    selectedItems.includes(item.id)
                        ? sum + item.product.price * item.quantity
                        : sum,
                0
            );
            setTotalPrice(total);
        }
    }, [card, selectedItems]);
    useEffect(() => {
        refetch();
        refetchProdact();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteCard(id).unwrap();
        setSelectedItems(selectedItems.filter((item) => item !== id));
        refetch();
    };

    const handleCountChange = async (id: string, newCount: number) => {
        if (newCount >= 0) {
            await updateCard({ id: id, quantity: newCount }).unwrap();
            refetch();
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedItems(card?.map((item: any) => item.id) || []);
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // const handleOrder = () => {
    const selectedProducts = card?.filter((item: any) =>
        selectedItems.includes(item.id)
    );

    useEffect(() => {
        if (selectedProducts?.length > 0) {
            localStorage.setItem(
                "selectedProducts",
                JSON.stringify(selectedProducts)
            );
        }
    }, [selectedProducts]);

    useEffect(() => {
        const savedProducts = localStorage.getItem("selectedProducts");
        if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            setSelectedItems(parsedProducts.map((item: any) => item.id));
        }
    }, []);

    // console.log("Selected products for order:", selectedProducts);
    // };

    if (!card || card.length === 0) {
        return (
            <div className="mt-20 flex flex-col items-center justify-center px-4">
                <Image
                    src="/savatcha.svg"
                    alt="savatcha"
                    width={120}
                    height={120}
                />
                <h1 className="text-2xl font-bold text-center mt-4">
                    Savatingiz hozircha bo'sh
                </h1>
                <p className="mt-2 text-center">
                    Bosh sahifadan boshlang — kerakli tovarni qidiruv orqali
                    topishingiz yoki to'plamlarni ko'rishingiz mumkin
                </p>
                <Link href="/">
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                        Bosh sahifaga o'tish
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mb-20 mx-auto mt-10 px-4 py-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between gap-2 w-full pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <input
                                    id="selectAll"
                                    type="checkbox"
                                    checked={
                                        selectedItems.length === card.length
                                    }
                                    onChange={handleSelectAll}
                                    className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-md checked:bg-teal-600 checked:border-teal-500 transition-all duration-200 cursor-pointer"
                                />
                                <label
                                    htmlFor="selectAll"
                                    className="text-sm sm:text-md cursor-pointer"
                                >
                                    Barcha tovarlar
                                </label>
                            </div>
                            <div className="text-sm text-gray-500">
                                Yetkazib berishning eng yaqin sanasi:{" "}
                                <span className="font-semibold border p-1 border-teal-500 text-teal-500">{`${day}-${month}`}</span>
                            </div>
                        </div>
                        {card.map((item: any) => {
                            const product = prodact?.find(
                                (p: any) => p.id === item.product_id
                            );
                            return (
                                <div
                                    key={item.id}
                                    className="py-4 border-b last:border-b-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(
                                                item.id
                                            )}
                                            onChange={() =>
                                                handleSelectItem(item.id)
                                            }
                                            className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-md checked:bg-teal-600 checked:border-teal-500 transition-all duration-200 cursor-pointer"
                                        />
                                        <div className="flex-shrink-0">
                                            <img
                                                src={`https://desirable-stillness-production.up.railway.app/product/${item.product.image[0]}`}
                                                alt="product"
                                                className="w-16 h-16 object-cover object-center rounded-md"
                                            />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h2 className="font-semibold text-sm sm:text-base line-clamp-1">
                                                {product?.name}
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
                                                {product?.description}
                                            </p>
                                            <p className="text-xs sm:text-sm mt-1">
                                                <span className="text-gray-500">
                                                    Sotuvchi:{" "}
                                                </span>
                                                {product?.store?.name ||
                                                    "Noma'lum sotuvchi"}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-auto">
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Yo'q qilish
                                            </button>
                                            <p className="font-medium text-sm sm:text-base">
                                                {item.product.price} so'm
                                            </p>
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() =>
                                                        handleCountChange(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="px-2 py-1 text-sm sm:text-base"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 py-1 text-xs sm:text-sm">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleCountChange(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="px-2 py-1 text-sm sm:text-base"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="border border-gray-200 rounded-lg p-4 sticky top-20">
                        <h2 className="text-xl font-semibold mb-4">
                            Buyurtma jami
                        </h2>
                        <div className="flex justify-between mb-2">
                            <span>Mahsulotlar ({selectedItems.length}):</span>
                            <span>{totalPrice} so'm</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Yetkazib berish:</span>
                            <span>Bepul</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Jami:</span>
                            <span>{totalPrice} so'm</span>
                        </div>
                        <Link href="/orders">
                            <Button
                                className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
                                disabled={selectedItems.length === 0}
                            >
                                Buyurtma berish
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
