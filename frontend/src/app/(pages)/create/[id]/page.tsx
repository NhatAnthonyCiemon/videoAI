import React from "react";
import ContentPage from "./ContentPage";
import Header from "@/components/layout/header";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
    params: { id: string };
};

async function Create({ params }: PageProps) {
    const { id } = await params;

    if (!id || id.length !== 10) {
        redirect("/");
    }
    return (
        <div className="relative">
            <Header />
            <ContentPage />
        </div>
    );
}

export default Create;
