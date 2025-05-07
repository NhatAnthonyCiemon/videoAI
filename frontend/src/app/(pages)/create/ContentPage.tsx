"use client";
import React from "react";
import CreateImage from "./CreateImage";
import CreateScript from "./CreateScript";
import CreateVideo from "./CreateVideo";
import CreateTop from "./CreateTop";
function ContentPage() {
    const [whichActive, setWhichActive] = React.useState(0);
    return (
        <div className="w-[1280px] mx-auto overflow-hidden">
            <CreateTop
                whichActive={whichActive}
                setWhichActive={setWhichActive}
            />
            {whichActive === 0 && <CreateScript />}
            {whichActive === 1 && <CreateImage />}
            {whichActive === 2 && <CreateVideo />}
        </div>
    );
}

export default ContentPage;
