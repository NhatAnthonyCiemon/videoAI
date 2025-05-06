import { Trash2 } from "lucide-react";

const mockSubtitles = [
    {
        id: 1,
        text: "Figma ipsum edit subtract list background asset arrow figma arrow font star mask",
        start: "0:00:01",
        end: "0:00:10",
    },
    {
        id: 2,
        text: "Figma ipsum edit subtract list background asset arrow figma arrow font star mask",
        start: "0:00:01",
        end: "0:00:10",
    },
    {
        id: 3,
        text: "Figma ipsum edit subtract list background asset arrow figma arrow font star mask",
        start: "0:00:01",
        end: "0:00:10",
    },
    {
        id: 4,
        text: "Figma ipsum edit subtract list background asset arrow figma arrow font star mask",
        start: "0:00:01",
        end: "0:00:10",
    },
];

export default function SubtitleSetting() {
    return (
        <div className="bg-white overflow-y-auto space-y-2 border-r-1 h-full border-gray-700 p-4">
            <div className="flex justify-between items-center mb-2 p-2">
                <button className="text-xl font-medium border border-gray-700 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 curser-pointer">
                    + Phụ đề
                </button>
            </div>


            {mockSubtitles.map((sub) => (
                <div
                    key={sub.id}
                    className="p-2 flex"
                >
                    <div className="border rounded-md p-2 flex flex-col bg-gray-50">
                        <p className="text-xl text-gray-700">{sub.text}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2 ml-5 mr-3">
                        <button className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} color="black"/>
                        </button>
                    </div>
                    <div className="flex flex-col justify-between ml-2">
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sub.start}
                        </div>
                        <div className="min-h-3"></div>
                        <div className="flex-1 border rounded-md p-1 bg-gray-50 w-[52px] text-center flex items-center justify-center">
                            {sub.end}
                        </div>
                    </div>


                </div>
            ))}
        </div>
    );
}

