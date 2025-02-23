"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function NotFoundPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
}

function PageContent() {
    const searchParams = useSearchParams();
    return <div>Search Params: {searchParams.toString()}</div>;
}
