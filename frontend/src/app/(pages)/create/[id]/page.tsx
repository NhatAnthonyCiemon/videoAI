import React from "react";
import ContentPage from "./ContentPage";
import Header from "@/components/layout/header";
import { redirect } from "next/navigation";
import Video from "@/types/Video";
import videoClass from "../../../../lib/Video";

export const dynamic = "force-dynamic";

type PageProps = {
    params: { id: string };
};

async function Create({ params }: PageProps) {
    const { id } = await params;

    if (!id || id.length !== 10) {
        redirect("/");
    }
    let video: Video = await videoClass.generateVideo(id);
    return (
        <div className="relative">
            <Header />
            <ContentPage video={video} />
        </div>
    );
}

export default Create;
