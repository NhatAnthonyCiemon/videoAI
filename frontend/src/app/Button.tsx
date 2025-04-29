"use client";
import { useState } from "react";
import Z from "./Z";
export default function Button() {
    const [data, setData] = useState("123");
    return (
        <>
            <button className="bg-blue-500 text-white p-2 rounded-md">
                Click me
            </button>
        </>
    );
}
