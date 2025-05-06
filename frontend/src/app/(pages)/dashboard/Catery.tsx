"use client";
import { Button } from "@/components/ui/button";
import CategorySelect from "./CaterySelect";

type HandleSelect<T> = {
    [key: string]: (params: T) => void;
};

const objectHandleSelect: HandleSelect<string> = {
    xuly: (params: string) => {
        console.log(params);
    },
    xuly2: (params: string) => {
        console.log(params);
    },
};
function Catery() {
    return (
        <div className="flex mt-[40px] items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-9"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                />
            </svg>
            <p className="text-2xl mx-[15px]">Lọc:</p>
            <CategorySelect
                className="ml-[15px]"
                categories={[
                    "Tất cả danh mục",
                    "Thể thao",
                    "Giải trí",
                    "Kinh doanh",
                ]}
                selectedCategory="Tất cả danh mục"
                onSelect={objectHandleSelect.xuly}
            />
            <CategorySelect
                className="ml-[15px]"
                categories={["Mới nhất", "Cũ nhất"]}
                selectedCategory="Mới nhất"
                onSelect={objectHandleSelect.xuly2}
            />
            <CategorySelect
                className="ml-[15px]"
                categories={["Hoàn thiện", "Chưa hoàn thiện"]}
                selectedCategory="Hoàn thiện"
                onSelect={objectHandleSelect.xuly2}
            />
            <Button className="ml-auto text-2xl py-[25px] cursor-pointer self-stretch !px-[30px]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-9"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Tạo video mới
            </Button>
        </div>
    );
}

export default Catery;
