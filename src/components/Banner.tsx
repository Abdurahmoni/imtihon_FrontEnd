"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useGetAllBannerQuery } from "@/api/bannerApi";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function Banner() {
    const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
    const { data: banner } = useGetAllBannerQuery([]);

    return (
        <div className="w-full cursor-pointer my-4 sm:my-6 md:my-8 lg:my-10 rounded-lg">
            <Carousel
                plugins={[plugin.current]}
                className="w-full relative touch-pan-y rounded-lg"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                    align: "start",
                }}
            >
                <CarouselContent>
                    {banner?.length > 0 &&
                        banner.map((item: any) => (
                            <CarouselItem
                                key={item.id}
                                className="w-full rounded-lg"
                            >
                                <Card className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] rounded-lg">
                                    <CardContent className="p-0 h-full rounded-lg">
                                        <img
                                            src={`http://localhost:3000/banners/${item.image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover object-center rounded-lg"
                                        />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                </CarouselContent>
                <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
                    <CarouselPrevious className="relative top-5 left-0 sm:left-2 md:left-4 pointer-events-auto" />
                    <CarouselNext className="relative top-5 right-0 sm:right-2 md:right-4 pointer-events-auto" />
                </div>
            </Carousel>
        </div>
    );
}
