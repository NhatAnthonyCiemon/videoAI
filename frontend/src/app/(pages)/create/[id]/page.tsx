import ContentPage from "./ContentPage";
import Header from "@/components/layout/header";
import { redirect } from "next/navigation";
import Video from "@/types/Video";
import videoClass from "../../../../lib/Video";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type PageProps = {
    params: { id: string };
};

async function Create({ params }: PageProps) {
    const { id } = await params;
    if (!id || id.length !== 10) {
        redirect("/");
    }
    const cookieStore = await cookies();
    let token = cookieStore.get("access_token")?.value as string;

    if (!token) {
        redirect("/");
    }
    let video: Video | null = await videoClass.generateVideo(id, token);
    if (!video) {
        redirect("/");
    }
    try {
        return (
            <div className="relative">
                <Header />
                <ContentPage video={video} />
            </div>
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                redirect("/logout");
            } else {
                console.log("Error: ", error);
            }
        }
    }
}

export default Create;
