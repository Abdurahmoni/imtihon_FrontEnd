"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { MapPin, CreditCard, Truck, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useOrdersPostMutation } from "@/api/ordersApi";
import { useAddOrderMutation } from "@/api/addressesApi";
import { Textarea } from "@/components/ui/textarea";
import { useAddReviewMutation } from "@/api/reviewsApi";

interface FormData {
    street: string;
    city: string;
    state: string;
    paymentMethod: string;
    deliveryMethod: string;
    cardType: string;
    cardNumber: string;
    expirationDate: string;
    cvv: string;
}

interface ProductRating {
    productId: string;
    rating: number;
    comment: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [formData, setFormData] = useState<FormData>({
        street: "",
        city: "",
        state: "",
        paymentMethod: "cash",
        deliveryMethod: "standard",
        cardType: "HUMO",
        cardNumber: "",
        expirationDate: "",
        cvv: "",
    });
    const [ordersPost] = useOrdersPostMutation();
    const [addOrder] = useAddOrderMutation();
    const [addReview] = useAddReviewMutation();
    const [productRatings, setProductRatings] = useState<ProductRating[]>([]);
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        const productsParam = searchParams.get("products");
        if (productsParam) {
            const parsedProducts = JSON.parse(productsParam);
            setProducts(parsedProducts);
            setProductRatings(
                parsedProducts.map((item: any) => ({
                    productId: item.product.id,
                    rating: 0,
                    comment: "",
                }))
            );
        } else {
            const storedProducts = localStorage.getItem("selectedProducts");
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                setProducts(parsedProducts);
                setProductRatings(
                    parsedProducts.map((item: any) => ({
                        productId: item.product.id,
                        rating: 0,
                        comment: "",
                    }))
                );
            }
        }
    }, [searchParams]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const calculateTotal = () => {
        return products.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );
    };

    const handleRatingChange = (productId: string, rating: number) => {
        setProductRatings((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, rating } : item
            )
        );
    };

    const handleCommentChange = (productId: string, comment: string) => {
        setProductRatings((prev) =>
            prev.map((item) =>
                item.productId === productId ? { ...item, comment } : item
            )
        );
    };

    const handleSubmitOrder = async () => {
        const requiredFields = ["street", "city", "state"] as const;
        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            alert("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }

        if (formData.paymentMethod === "card") {
            const cardFields = ["cardNumber", "expirationDate", "cvv"] as const;
            const emptyCardFields = cardFields.filter(
                (field) => !formData[field]
            );
            if (emptyCardFields.length > 0) {
                alert("Iltimos, karta ma'lumotlarini to'ldiring");
                return;
            }
        }

        const orderDetails = {
            ...formData,
            products,
            total:
                calculateTotal() +
                (formData.deliveryMethod === "express" ? 25000 : 0),
            ratings: productRatings,
        };
        const { data } = await ordersPost(orderDetails);
        const orderId = data.id;

        await addOrder({
            id: orderId,
            street: formData.street,
            city: formData.city,
            state: formData.state,
        });
        productRatings.forEach(async (rating) => {
            await addReview({
                product_id: rating.productId,
                rating: rating.rating,
                comment: rating.comment,
            });
        });
        alert("Buyurtmangiz qabul qilindi!");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Buyurtma berish
                </h1>
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <MapPin className="h-5 w-5 text-teal-600" />
                                <CardTitle>Yetkazib berish manzili</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="street">
                                        Ko'cha/Mahalla
                                    </Label>
                                    <Input
                                        id="street"
                                        placeholder="Masalan: Tadbirkor ko'chasi"
                                        value={formData.street}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "street",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Tuman</Label>
                                        <Input
                                            id="city"
                                            placeholder="Masalan: Yangiqo'rg'on"
                                            value={formData.city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="state">Viloyat</Label>
                                        <Input
                                            id="state"
                                            placeholder="Masalan: Farg'ona"
                                            value={formData.state}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "state",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <CreditCard className="h-5 w-5 text-teal-600" />
                                <CardTitle>To'lov usuli</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={formData.paymentMethod}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "paymentMethod",
                                            value
                                        )
                                    }
                                    className="grid gap-4"
                                >
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <RadioGroupItem
                                            value="cash"
                                            id="cash"
                                        />
                                        <Label
                                            htmlFor="cash"
                                            className="flex-1"
                                        >
                                            Naqd pul orqali
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <RadioGroupItem
                                            value="card"
                                            id="card"
                                        />
                                        <Label
                                            htmlFor="card"
                                            className="flex-1"
                                        >
                                            Karta orqali
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {formData.paymentMethod === "card" && (
                                    <div className="mt-4 space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cardType">
                                                Karta turi
                                            </Label>
                                            <Input
                                                id="cardType"
                                                value={formData.cardType}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "cardType",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cardNumber">
                                                Karta raqami
                                            </Label>
                                            <Input
                                                id="cardNumber"
                                                placeholder="9860 1234 5678 9012"
                                                value={formData.cardNumber}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "cardNumber",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="expirationDate">
                                                    Amal qilish muddati
                                                </Label>
                                                <Input
                                                    id="expirationDate"
                                                    placeholder="MM/YY"
                                                    value={
                                                        formData.expirationDate
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "expirationDate",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input
                                                    id="cvv"
                                                    type="password"
                                                    placeholder="***"
                                                    value={formData.cvv}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "cvv",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Truck className="h-5 w-5 text-teal-600" />
                                <CardTitle>Yetkazib berish usuli</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={formData.deliveryMethod}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "deliveryMethod",
                                            value
                                        )
                                    }
                                    className="grid gap-4"
                                >
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <RadioGroupItem
                                            value="standard"
                                            id="standard"
                                        />
                                        <Label
                                            htmlFor="standard"
                                            className="flex-1"
                                        >
                                            Standart yetkazib berish
                                            <p className="text-sm text-muted-foreground">
                                                2-3 kun
                                            </p>
                                        </Label>
                                        <span className="font-semibold">
                                            Bepul
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-lg p-4">
                                        <RadioGroupItem
                                            value="express"
                                            id="express"
                                        />
                                        <Label
                                            htmlFor="express"
                                            className="flex-1"
                                        >
                                            Tezkor yetkazib berish
                                            <p className="text-sm text-muted-foreground">
                                                1 kun
                                            </p>
                                        </Label>
                                        <span className="font-semibold">
                                            25,000 so'm
                                        </span>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Star className="h-5 w-5 text-teal-600" />
                                <CardTitle>Mahsulotlarni baholash</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {products.map((item, index) => (
                                    <div key={index} className="mb-6 last:mb-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <img
                                                src={`https://desirable-stillness-production.up.railway.app/product/${item.product.image[0]}`}
                                                alt={item.product.name}
                                                width={50}
                                                height={50}
                                                className="rounded-md object-cover"
                                            />
                                            <h3 className="font-semibold">
                                                {item.product.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-6 w-6 cursor-pointer ${
                                                        star <=
                                                        productRatings[index]
                                                            .rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        handleRatingChange(
                                                            item.product.id,
                                                            star
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <Textarea
                                            placeholder="Izoh qoldiring (ixtiyoriy)"
                                            value={
                                                productRatings[index].comment
                                            }
                                            onChange={(e) =>
                                                handleCommentChange(
                                                    item.product.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="sticky top-4">
                            <CardHeader className="flex flex-row items-center gap-2">
                                <Package className="h-5 w-5 text-teal-600" />
                                <CardTitle>Buyurtma ma'lumotlari</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {products.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <img
                                            src={`https://desirable-stillness-production.up.railway.app/product/${item.product.image[0]}`}
                                            alt={item.product.name}
                                            width={50}
                                            height={50}
                                            className="rounded-md object-cover"
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold line-clamp-1 text-sm">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Miqdor: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-medium">
                                            {item.product.price * item.quantity}{" "}
                                            so'm
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Mahsulotlar jami:
                                    </span>
                                    <span>{calculateTotal()} so'm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Yetkazib berish:
                                    </span>
                                    <span>
                                        {formData.deliveryMethod === "express"
                                            ? "25,000 so'm"
                                            : "Bepul"}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Jami:</span>
                                    <span>
                                        {calculateTotal() +
                                            (formData.deliveryMethod ===
                                            "express"
                                                ? 25000
                                                : 0)}{" "}
                                        so'm
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-teal-600 hover:bg-teal-700"
                                    onClick={handleSubmitOrder}
                                >
                                    Buyurtmani tasdiqlash
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
