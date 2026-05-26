"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

//  Rename the original component to an "Inner" component
function SortDropdownInner() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;

        // Clone the current URL parameters (like location, checkin, checkout)
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (newSort) {
            current.set("sort", newSort);
        } else {
            current.delete("sort");
        }

        // Push the new URL to trigger a server refresh with the new sort order
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    };

    return (
        <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-semibold text-slate-600">
                Sort by:
            </label>
            <select
                id="sort"
                onChange={handleSortChange}
                defaultValue={searchParams.get("sort") || ""}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500 text-black shadow-sm"
            >
                <option value="">Recommended</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </div>
    );
}

// Export a wrapper component with Suspense
export default function SortDropdown() {
    return (
        // Added a small placeholder so the UI doesn't jump while loading
        <Suspense fallback={<div className="h-9 w-48 bg-gray-100 rounded-lg animate-pulse border border-gray-200"></div>}>
            <SortDropdownInner />
        </Suspense>
    );
}