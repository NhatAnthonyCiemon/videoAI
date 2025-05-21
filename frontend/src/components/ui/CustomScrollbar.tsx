"use client";
import { Scrollbar } from "react-scrollbars-custom";
import { ReactNode } from "react";

interface CustomScrollbarProps {
    children: ReactNode;
}

export default function CustomScrollbar({ children }: CustomScrollbarProps) {
    return (
        <Scrollbar
            style={{ height: "100vh" }}
            trackYProps={{
                style: { zIndex: 9999 },
            }}
            thumbYProps={{
                style: { zIndex: 10000 },
            }}
        >
            {children}
        </Scrollbar>
    );
}
