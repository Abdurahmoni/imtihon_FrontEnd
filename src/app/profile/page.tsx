"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/api/userApi";
import { useGetOrdersQuery } from "@/api/ordersApi";
import Link from "next/link";

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState("orders");
    const { data: profile, refetch } = useGetOneUserQuery([]);
    const { data: orders, refetch: refetchOrders } = useGetOrdersQuery([]);
    const [updateUser] = useUpdateUserMutation();
    const [profileData, setProfileData] = useState({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        email: "",
        phone: "",
    });

    const [saveUser, setSaveUser] = useState(false);

    useEffect(() => {
        if (profile) {
            setProfileData({
                first_name: profile.first_name,
                last_name: profile.last_name,
                date_of_birth: profile.date_of_birth || undefined,
                gender: profile.gender,
                email: profile.email,
                phone: profile.phone,
            });
        }
    }, [profile]);

    useEffect(() => {
        refetchOrders();
    }, []);

    const handleInputChange = (field: any, value: any) => {
        setSaveUser(true);
        setProfileData((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleSave = async () => {
        try {
            const updatedUser = await updateUser(profileData).unwrap();
            localStorage.setItem("user", JSON.stringify(updatedUser));
            await refetch();
            setSaveUser(false);
        } catch (error) {
            console.error(
                "Foydalanuvchi ma'lumotlarini yangilashda xatolik:",
                error
            );
        }
    };

    return (
        <div className="py-8">
            <h1 className="text-2xl font-semibold mb-6">
                {profile?.first_name} {profile?.last_name}
            </h1>
            <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <button
                            onClick={() => setActiveSection("orders")}
                            className={cn(
                                "text-left",
                                activeSection === "orders"
                                    ? "font-medium bg-gray-200 p-3 rounded-md"
                                    : "text-muted-foreground p-3 rounded-md"
                            )}
                        >
                            Buyurtmalarim
                        </button>
                        <button
                            onClick={() => setActiveSection("profile")}
                            className={cn(
                                "text-left",
                                activeSection === "profile"
                                    ? "font-medium bg-gray-200 p-3 rounded-md"
                                    : "text-muted-foreground p-3 rounded-md"
                            )}
                        >
                            Ma'lumotlarim
                        </button>
                    </div>
                </div>

                <div className="font-medium text-sm">
                    {activeSection === "orders" ? (
                        <div>
                            <Tabs defaultValue="active">
                                <div className="mb-6">
                                    <TabsList className="w-full justify-start bg-transparent gap-2">
                                        <TabsTrigger
                                            value="all"
                                            className={cn(
                                                "rounded-full px-5 py-2",
                                                "data-[state=active]:bg-teal-600 data-[state=active]:text-white",
                                                "data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-black"
                                            )}
                                        >
                                            Barcha buyurtmalar
                                        </TabsTrigger>

                                        <TabsTrigger
                                            value="active"
                                            className={cn(
                                                "rounded-full px-5 py-2",
                                                "data-[state=active]:bg-teal-600 data-[state=active]:text-white",
                                                "data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-black"
                                            )}
                                        >
                                            Faol
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="all" className="mt-4">
                                    {orders?.length === 0 ? (
                                        <div className="flex flex-col border border-gray-300 items-center justify-center py-12 text-center">
                                            <h3 className="text-2xl font-semibold    mb-2">
                                                Hech narsa yo'q
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Sizda faol buyurtma mavjud emas!
                                                <br />
                                                Barcha kerakli narsalarni topish
                                                uchun qidirishdan foydalaning!
                                            </p>
                                            <Link
                                                className="bg-teal-600 mt-4 text-white py-2 px-5 rounded-lg hover:bg-teal-700"
                                                href="/"
                                            >
                                                Xaridlarni boshlash
                                            </Link>
                                            <Link
                                                href="/"
                                                className="mt-2  border-gray-300 hover:border-b"
                                            >
                                                Bosh sahifaga qaytish
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 border border-gray-300">
                                            {orders?.map((order: any) => (
                                                <div key={order.id}>
                                                    <div className="space-y-4 py-4">
                                                        <div className="flex justify-between px-6 items-start border-b pb-4 w-full">
                                                            <h3 className="font-bold text-lg">
                                                                Buyurtma ID
                                                                raqami{" "}
                                                                {order.id}
                                                            </h3>
                                                        </div>
                                                        <div className="grid gap-2 text-sm px-6">
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold text-gray-500 text-sm">
                                                                    Holat:
                                                                </span>
                                                                <span className="bg-gray-100 px-2 py-1 rounded font-semibold opacity-80">
                                                                    {
                                                                        order.status
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold text-gray-500 text-sm">
                                                                    Umumiy
                                                                    summa:
                                                                </span>
                                                                <span className="font-semibold opacity-80">
                                                                    {
                                                                        order.total_price
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold text-gray-500 text-sm">
                                                                    Topshirish
                                                                    punkti:
                                                                </span>
                                                                <span className="font-semibold opacity-80">
                                                                    {
                                                                        order
                                                                            .address
                                                                            ?.city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        order
                                                                            .address
                                                                            ?.state
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <Accordion
                                                            type="single"
                                                            collapsible
                                                        >
                                                            <div className="space-y-2 px-6">
                                                                <div className="flex justify-between">
                                                                    <span className="font-semibold text-gray-500 text-sm">
                                                                        Buyurtma
                                                                        sanasi:
                                                                    </span>
                                                                    <span className="font-semibold opacity-80">
                                                                        {new Date(
                                                                            order.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="font-semibold text-gray-500 text-sm">
                                                                        Buyurtma
                                                                        qiymati:
                                                                    </span>
                                                                    <span className="font-semibold opacity-80">
                                                                        {
                                                                            order.total_price
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Accordion>

                                                        <div className="border border-gray-200 w-full"></div>

                                                        <Accordion
                                                            type="single"
                                                            collapsible
                                                        >
                                                            <AccordionItem
                                                                className="px-6 flex flex-col gap-5"
                                                                value="products"
                                                                style={{
                                                                    border: "none",
                                                                }}
                                                            >
                                                                <AccordionTrigger className="p-0">
                                                                    {
                                                                        order
                                                                            .orderItems
                                                                            .length
                                                                    }{" "}
                                                                    mahsulot
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    {order.orderItems.map(
                                                                        (
                                                                            item: any
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                className="flex justify-between py-2"
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        item.quantity
                                                                                    }

                                                                                    x
                                                                                    Product
                                                                                </span>
                                                                                <span>
                                                                                    {
                                                                                        item.total_price
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="active" className="mt-4">
                                    {orders &&
                                    orders.filter(
                                        (order: any) =>
                                            order.status !== "qabul qilindi" &&
                                            order.status !== "bekor qilindi"
                                    ).length === 0 ? (
                                        <div className="flex flex-col border border-gray-300 items-center justify-center py-12 text-center">
                                            <h3 className="text-2xl font-semibold mb-2">
                                                Hech narsa yo'q
                                            </h3>
                                            <p className="text-muted-foreground mb-4">
                                                Sizda faol buyurtma mavjud emas!
                                                <br />
                                                Barcha kerakli narsalarni topish
                                                uchun qidirishdan foydalaning!
                                            </p>
                                            <Link
                                                className="bg-teal-600 mt-4 text-white py-2 px-5 rounded-lg hover:bg-teal-700"
                                                href="/"
                                            >
                                                Xaridlarni boshlash
                                            </Link>
                                            <Link
                                                href="/"
                                                className="mt-2  border-gray-300 hover:border-b"
                                            >
                                                Bosh sahifaga qaytish
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 border border-gray-300">
                                            {orders
                                                ?.filter(
                                                    (order: any) =>
                                                        order.status !==
                                                            "qabul qilindi" &&
                                                        order.status !==
                                                            "bekor qilindi"
                                                )
                                                .map((order: any) => (
                                                    <div key={order.id}>
                                                        <div className="space-y-4 py-4">
                                                            <div className="flex justify-between px-6 items-start border-b pb-4 w-full">
                                                                <h3 className="font-bold text-lg">
                                                                    Buyurtma ID
                                                                    raqami{" "}
                                                                    {order.id}
                                                                </h3>
                                                            </div>
                                                            <div className="grid gap-2 text-sm px-6">
                                                                <div className="flex justify-between">
                                                                    <span className="font-semibold text-gray-500 text-sm">
                                                                        Holat:
                                                                    </span>
                                                                    <span className="bg-gray-100 px-2 py-1 rounded font-semibold opacity-80">
                                                                        {
                                                                            order.status
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="font-semibold text-gray-500 text-sm">
                                                                        Umumiy
                                                                        summa:
                                                                    </span>
                                                                    <span className="font-semibold opacity-80">
                                                                        {
                                                                            order.total_price
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="font-semibold text-gray-500 text-sm">
                                                                        Topshirish
                                                                        punkti:
                                                                    </span>
                                                                    <span className="font-semibold opacity-80">
                                                                        {
                                                                            order
                                                                                .address
                                                                                ?.city
                                                                        }
                                                                        ,{" "}
                                                                        {
                                                                            order
                                                                                .address
                                                                                ?.state
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <Accordion
                                                                type="single"
                                                                collapsible
                                                            >
                                                                <div className="space-y-2 px-6">
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold text-gray-500 text-sm">
                                                                            Buyurtma
                                                                            sanasi:
                                                                        </span>
                                                                        <span className="font-semibold opacity-80">
                                                                            {new Date(
                                                                                order.createdAt
                                                                            ).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="font-semibold text-gray-500 text-sm">
                                                                            Buyurtma
                                                                            qiymati:
                                                                        </span>
                                                                        <span className="font-semibold opacity-80">
                                                                            {
                                                                                order.total_price
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </Accordion>

                                                            <div className="border border-gray-200 w-full"></div>

                                                            <Accordion
                                                                type="single"
                                                                collapsible
                                                            >
                                                                <AccordionItem
                                                                    className="px-6 flex flex-col gap-5"
                                                                    value="products"
                                                                    style={{
                                                                        border: "none",
                                                                    }}
                                                                >
                                                                    <AccordionTrigger className="p-0">
                                                                        {
                                                                            order
                                                                                .orderItems
                                                                                .length
                                                                        }{" "}
                                                                        mahsulot
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        {order.orderItems.map(
                                                                            (
                                                                                item: any
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        item.id
                                                                                    }
                                                                                    className="flex justify-between py-2"
                                                                                >
                                                                                    <span>
                                                                                        {
                                                                                            item.quantity
                                                                                        }{" "}
                                                                                        x
                                                                                        Product
                                                                                    </span>
                                                                                    <span>
                                                                                        {
                                                                                            item.total_price
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="space-y-6 border border-gray-200 p-6 ">
                            <h1 className="text-2xl font-semibold">
                                Mening ma'lumotlarim
                            </h1>
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2 ">
                                    <div className="grid gap-2 ">
                                        <Label htmlFor="first_name">
                                            Familiya
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            value={profileData.first_name}
                                            className="rounded-xl h-12 text-xl p-4"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            Ism
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            value={profileData.last_name}
                                            className="rounded-xl h-12 text-xl p-4"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Tug'ilgan sana</Label>
                                        <Popover>
                                            <PopoverTrigger
                                                className="h-12 rounded-xl text-md"
                                                asChild
                                            >
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !profileData.date_of_birth &&
                                                            "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {profileData.date_of_birth
                                                        ? format(
                                                              profileData.date_of_birth,
                                                              "PPP"
                                                          )
                                                        : "kk/oo/yyyy"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        profileData.date_of_birth
                                                            ? new Date(
                                                                  profileData.date_of_birth
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        handleInputChange(
                                                            "date_of_birth",
                                                            date?.toISOString()
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="gender"
                                            className="text-sm font-medium"
                                        >
                                            Jins
                                        </Label>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() =>
                                                    handleInputChange(
                                                        "gender",
                                                        "male"
                                                    )
                                                }
                                                className={cn(
                                                    "px-4 py-2 rounded-lg border transition-all",
                                                    profileData.gender ===
                                                        "male"
                                                        ? "bg-teal-600 text-white border-teal-600"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                Erkak
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleInputChange(
                                                        "gender",
                                                        "female"
                                                    )
                                                }
                                                className={cn(
                                                    "px-4 py-2 rounded-lg border transition-all",
                                                    profileData.gender ===
                                                        "female"
                                                        ? "bg-teal-600 text-white border-teal-600"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                )}
                                            >
                                                Ayol
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Elektron pochta
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Elektron pochta"
                                            value={profileData.email}
                                            className="rounded-xl h-12 text-md"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">
                                            Telefon raqami
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="flex">
                                            <div className="flex items-center border rounded-l px-3 bg-muted">
                                                +998
                                            </div>
                                            <Input
                                                id="phone"
                                                type="text"
                                                value={profileData.phone}
                                                placeholder="Telefon raqami"
                                                className="rounded-l-none rounded-r-xl h-12 text-md"
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button
                                        onClick={() => {
                                            localStorage.clear();
                                            window.location.href = "/";
                                        }}
                                        className="w-40 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all shadow-md"
                                    >
                                        <LogOutIcon className="w-5 h-5" />
                                        <span>Tizimdan chiqish</span>
                                    </Button>
                                    {saveUser && (
                                        <div className="flex gap-4">
                                            <button
                                                type="reset"
                                                onClick={() => {
                                                    setProfileData({
                                                        first_name:
                                                            profile.first_name,
                                                        last_name:
                                                            profile.last_name,
                                                        date_of_birth:
                                                            profile.date_of_birth ||
                                                            undefined,
                                                        gender: profile.gender,
                                                        email: profile.email,
                                                        phone: profile.phone,
                                                    });
                                                    setSaveUser(false);
                                                }}
                                                className="border px-4 py-2 rounded-lg hover:bg-gray-200"
                                            >
                                                Bekor qilish
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={handleSave}
                                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                                            >
                                                Saqlash
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
