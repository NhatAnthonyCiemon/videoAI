"use client";
import React from "react";
import CreateImage from "./CreateImage";
import CreateScript from "./CreateScript";
import CreateVideo from "./CreateVideo";
import CreateTop from "./CreateTop";
import { ContentGenerate } from "@/types/contentGenerate";
function ContentPage() {
    React.useEffect(() => {
        document.documentElement.classList.add("scrollbar-gutter-stable");
        return () => {
            document.documentElement.classList.remove(
                "scrollbar-gutter-stable"
            );
        };
    }, []);

    const [whichActive, setWhichActive] = React.useState(0);
    const [whichStep, setWhichStep] = React.useState(0);
    const [contentVideo, setContentVideo] = React.useState<ContentGenerate>({
        fullContent: "",
        keyword: "",
        arrayContent: [],
    });
    return (
        <div className="w-[1280px] mx-auto overflow-hidden">
            <CreateTop
                whichActive={whichActive}
                setWhichActive={setWhichActive}
                whichStep={whichStep}
            />
            {whichActive === 0 && whichStep >= 0 && (
                <CreateScript
                    whichStep={whichStep}
                    setWhichStep={setWhichStep}
                    setWhichActive={setWhichActive}
                    contentVideo={contentVideo}
                    setContentVideo={setContentVideo}
                />
            )}
            {whichActive === 1 && whichStep >= 1 && (
                <CreateImage
                    whichStep={whichStep}
                    setWhichStep={setWhichStep}
                />
            )}
            {whichActive === 2 && whichStep >= 2 && (
                <CreateVideo
                    whichStep={whichStep}
                    setWhichStep={setWhichStep}
                />
            )}
        </div>
    );
}

export default ContentPage;
