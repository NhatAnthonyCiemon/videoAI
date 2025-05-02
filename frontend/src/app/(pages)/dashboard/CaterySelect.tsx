"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function CategorySelect({
    categories,
    selectedCategory,
    className,
    onSelect,
}: {
    categories: string[];
    selectedCategory: string;
    onSelect: any;
    className?: string;
}) {
    return (
        <div className={className}>
            <Select onValueChange={onSelect}>
                <SelectTrigger
                    className=" !text-black !w-[250px] border-[#000] !h-[50px] py-5 text-2xl focus:outline-none focus-visible:outline-none 
             focus:ring-0 focus-visible:ring-0 
             ring-0 shadow-none"
                >
                    <SelectValue placeholder={selectedCategory} />
                </SelectTrigger>

                <SelectContent className="p-0">
                    {categories.map((category) => (
                        <SelectItem
                            key={category}
                            value={category}
                            className="py-4 px-3 text-2xl"
                        >
                            {category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default CategorySelect;
