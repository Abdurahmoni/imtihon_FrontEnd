"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import ModalManager from "./modals/ModalManager";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/api/categorieApi";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
    const { data: fetchedCategories } = useGetCategoriesQuery([]);
    const [categories, setCategories] = useState([{ name: "Barchasi", id: 0 }]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const searchParams = useSearchParams();
    const searchText = searchParams.get("query");

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("userToken")) {
                const storedUser: any = localStorage.getItem("user");
                setUser(JSON.parse(storedUser));
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        }
    }, []);

    useEffect(() => {
        if (fetchedCategories) {
            setCategories([{ name: "Barchasi", id: 0 }, ...fetchedCategories]);
        }
    }, [fetchedCategories]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="mt-5 flex flex-col gap-5">
            <div className="flex gap-4 max-sm:flex-col items-center">
                <div className="w-full flex max-sm:justify-center items-center">
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="Vercel Logo"
                            width={250}
                            height={20}
                            className="cursor-pointer object-contain object-center"
                        />
                    </Link>
                </div>

                <div className="w-full max-sm:max-w-80 h-10 flex items-center relative">
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-md focus:outline-none focus:border-2 rounded-lg w-full p-2 md:p-2.5 md:pr-8 pr-8"
                        placeholder="Qidiruv"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 sm:top-3"
                    >
                        <Image
                            src="/search.svg"
                            alt="Search Icon"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                        />
                    </button>
                </div>

                <div className="col-span-1  fixed bottom-0 w-full h-20 400 z-50   hidden max-sm:block ">
                    <div className="fixed bottom-0 left-0   h-20 right-0 bg-white rounded-xl border-t border-gray-300 shadow-md  flex justify-between items-center">
                        <Link className="h-full w-full" href="/">
                            <button className="flex  gap-2 w-full h-full  flex-col items-center justify-center text-gray-900 text-sm">
                                <img
                                    src="/home.svg"
                                    alt="Home"
                                    className="w-6 h-6"
                                />
                                <span>Bosh sahifa</span>
                            </button>
                        </Link>

                        <Link className="h-full w-full" href="/wishlist">
                            <button className="flex  gap-2 w-full h-full  flex-col items-center justify-center text-gray-900 text-sm">
                                <img
                                    src="/saqlanganlar.svg"
                                    alt="Saved"
                                    className="w-6 h-6"
                                />
                                <span>Saqlanganlar</span>
                            </button>
                        </Link>

                        <Link className="h-full w-full" href="/cart">
                            <button className="flex  gap-2 w-full h-full  flex-col items-center justify-center text-gray-900 text-sm">
                                <img
                                    src="/savat.svg"
                                    alt="Cart"
                                    className="w-6 h-6"
                                />
                                <span>Savat</span>
                            </button>
                        </Link>
                        <Link
                            className="h-full w-full"
                            href={isActive ? "/profile" : "/"}
                        >
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex  gap-2 w-full h-full  flex-col items-center justify-center text-gray-900 text-sm"
                            >
                                <img
                                    src="/user.svg"
                                    alt="User"
                                    className="w-6 h-6"
                                />
                                <span>
                                    {isActive ? user?.last_name : "Kirish"}
                                </span>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="flex gap-2 max-sm:hidden">
                    <Link href={isActive ? "/profile" : "/"}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg hover:bg-[#DEE0E5] w-10 md:w-full md:px-5 p-2.5 flex items-center justify-center gap-2"
                        >
                            <img
                                src="/user.svg"
                                alt="User Icon"
                                className="w-5 h-5" 
                            />
                            <span className="hidden md:inline">
                                {isActive ? user?.last_name : "Kirish"}
                            </span>
                        </button>
                    </Link>
                    <Link href="/wishlist">
                        <button className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg hover:bg-[#DEE0E5] w-10 md:w-[150px] md:px-5 p-2.5 flex items-center justify-center gap-2">
                            <img
                                src="/saqlanganlar.svg"
                                alt="Saved Icon"
                                className="w-5 h-5"
                            />
                            <span className="hidden md:inline">
                                Saqlanganlar
                            </span>
                        </button>
                    </Link>

                    <Link href="/cart">
                        <button className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg hover:bg-[#DEE0E5] w-10 md:w-[120px] md:px-5 p-2.5 flex items-center justify-center gap-2">
                            <img
                                src="/savat.svg"
                                alt="Cart Icon"
                                className="w-5 h-5"
                            />
                            <span className="hidden md:inline">Savat</span>
                        </button>
                    </Link>
                </div>
            </div>

            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full pb-3 border-b border-gray-300"
            >
                <CarouselContent className="px-5">
                    {categories?.map((item: any) => (
                        <Link
                            key={item.id}
                            href={`/?category_id=${item.id}`}
                            className="text-gray-900 text-md rounded-lg hover:bg-[#DEE0E5] min-w-[100px] p-2.5 flex items-center justify-center gap-2"
                        >
                            {item.name}
                        </Link>
                    ))}
                </CarouselContent>
            </Carousel>

            {isModalOpen && (
                <ModalManager isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            )}
        </div>
    );
}
