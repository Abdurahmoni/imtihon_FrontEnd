"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useLoginMutation } from "@/api/authApi";
const useAuth = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userToken");
    }

    return null;
};

const FormSchema = z.object({
    email: z.string().email({ message: "Noto'g'ri email" }),
    password: z.string().min(6, {
        message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    }),
});

export default function LoginModal({
    isOpen,
    setIsOpen,
    setModal,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    setModal: (modal: boolean) => void;
}) {
    const isAuthenticated = useAuth();

    const [login] = useLoginMutation();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: any) {
        console.log("a", data);
        const malumot = await login(data).unwrap();

        localStorage.setItem("userToken", malumot.token.accsess);
        localStorage.setItem("refreshToken", malumot.token.refresh);
        localStorage.setItem("user", JSON.stringify(malumot.user));

        setIsOpen(false);
        window.location.href = "/";
    }
    console.log("\n", isAuthenticated);

    return (
        <AnimatePresence>
            {!isAuthenticated && isOpen && (
                <motion.div
                    className="fixed px-5 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) =>
                        e.target === e.currentTarget && setIsOpen(false)
                    }
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative"
                        initial={{ y: 70, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 70, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 bg-gray-200 rounded-full w-7 h-7 text-gray-600 hover:text-gray-900 flex items-center justify-center"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            Tizimga kirish
                        </h2>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Emailingiz"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parol</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Parolingiz"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full !mt-8 bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                    Kirish
                                </Button>
                            </form>
                            <div className="mt-4 flex text-xs sm:text-sm items-center justify-center">
                                <p> Hali ro'yxatdan o'tmaganmisiz?</p>
                                <button
                                    onClick={() => {
                                        setModal(true);
                                    }}
                                    className="text-teal-600 hover:text-teal-700"
                                >
                                    Ro'yxatdan o'tish
                                </button>
                            </div>
                        </Form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
