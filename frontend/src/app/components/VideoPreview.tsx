import { Play } from "lucide-react";

export default function VideoPreview() {
    const content =
        "Figma ipsum export pencil scrolling edit ellipse bullet edit hand blur text mask opacity layout blur shadow union layout star device effect prototype fill auto rectangle list component frame ellipse strikethrough bold align figma select slice pencil vertical main bullet arrange arrange plugin frame vector edit rotate scrolling invite connection plugin plugin main project boolean asset pixel invite bullet vector stroke device opacity object figjam clip text image text inspect object edit italic vector bold effect scale invite rectangle pen underline vertical scrolling draft main line flatten reesizing layout duplicate overflow invite figjam layer asset subtract move export italic vector.";

    return (
        <div className="flex-1 flex flex-col pt-5 px-4 py-6">
            <div className="w-full bg-black flex justify-center overflow-hidden rounded-lg shadow relative">
                <video
                    src="/sample.mp4"
                    className="w-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>

                <p className="absolute bottom-7 justify-center text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                    Subtitle here...
                </p>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Play size={40} className="text-white opacity-60" />
                </div>
            </div>

            <div className="w-full mt-4">
                <div className="flex items-center gap-2">
                    <Play size={24} className="text-blue-600" />
                    <span className="text-base">0:00</span>
                    <span>/</span>
                    <span className="text-base">0:30</span>
                    <input type="range" className="flex-1" />
                </div>
            </div>

            <p className="mt-5 text-2xl font-semibold">Transcript</p>
            <p className="text-xl text-gray-700">{content}</p>
        </div>
    );
}
