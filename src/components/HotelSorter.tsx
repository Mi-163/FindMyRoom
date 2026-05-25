"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortDropdown() {
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