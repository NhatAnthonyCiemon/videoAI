"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
    search: string;
    category: string;
    sort: string;
    status: string;
    suggestions: string[];
    setSearch: (value: string) => void;
    setCategory: (value: string) => void;
    setSort: (value: string) => void;
    setStatus: (value: string) => void;
    setSuggestions: (value: string[]) => void;
}

const FilterContext = createContext<FilterState | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Tất cả danh mục");
    const [sort, setSort] = useState("Mới nhất");
    const [status, setStatus] = useState("Hoàn thiện");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    return (
        <FilterContext.Provider
            value={{
                search,
                category,
                sort,
                status,
                suggestions,
                setSearch,
                setCategory,
                setSort,
                setStatus,
                setSuggestions,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export function useFilter() {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
}