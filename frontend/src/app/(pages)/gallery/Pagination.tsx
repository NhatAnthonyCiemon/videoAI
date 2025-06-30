"use client";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
function Pagination({
    onPageChange,
    curpage,
    totalPages,
}: {
    onPageChange: (page: number) => void;
    curpage: number;
    totalPages: number;
}) {
    const classActive = "bg-black text-white";
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const renderPage: (string | number)[] = [];
    if (totalPages > 8) {
        if (curpage >= totalPages - 2 || curpage <= 4) {
            renderPage.push(1, 2, 3, 4);
            renderPage.push("...");
            renderPage.push(totalPages - 2, totalPages - 1, totalPages);
        } else {
            renderPage.push(1, 2, "...");
            renderPage.push(curpage - 1, curpage, curpage + 1, "...");
            renderPage.push(totalPages - 1, totalPages);
        }
    } else {
        renderPage.push(...pages);
    }
    return (
        <div className="flex  justify-center items-center gap-2 mt-[40px]">
            <Button
                variant="outline"
                onClick={() => onPageChange(1)}
                className="text-2xl py-[18px] min-w-[100px] rounded-[5px] gap-2 hover:bg-black hover:text-white"
            >
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
                        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                    />
                </svg>
                First
            </Button>
            <Button
                variant="outline"
                onClick={() => {
                    if (curpage > 1) {
                        onPageChange(curpage - 1);
                    }
                }}
                disabled={curpage === 1}
                className="text-2xl rounded-[5px] py-[18px] min-w-[100px] gap-2 hover:bg-black hover:text-white"
            >
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
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                </svg>
                Back
            </Button>
            {renderPage.map((page, index) => {
                if (typeof page === "number") {
                    return (
                        <Button
                            key={`page-${page}`}
                            variant="outline"
                            onClick={() => onPageChange(page)}
                            className={clsx(
                                "rounded-[5px] py-[18px] text-2xl gap-2 hover:bg-black hover:text-white",
                                page === curpage && classActive
                            )}
                        >
                            {page}
                        </Button>
                    );
                } else {
                    return (
                        <Button
                            key={`ellipsis-${index}`}
                            variant="outline"
                            className="text-2xl rounded-[5px] py-[18px] gap-2"
                        >
                            {page}
                        </Button>
                    );
                }
            })}
            <Button
                variant="outline"
                onClick={() => {
                    if (curpage < totalPages) {
                        onPageChange(curpage + 1);
                    }
                }}
                disabled={curpage === totalPages}
                className="text-2xl rounded-[5px] py-[18px] min-w-[100px] gap-2 hover:bg-black hover:text-white"
            >
                Next
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
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                </svg>
            </Button>
            <Button
                variant="outline"
                onClick={() => onPageChange(totalPages)}
                className="text-2xl rounded-[5px] py-[18px] min-w-[100px] gap-2 hover:bg-black hover:text-white"
            >
                Last
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
                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                    />
                </svg>
            </Button>
        </div>
    );
}

export default Pagination;
