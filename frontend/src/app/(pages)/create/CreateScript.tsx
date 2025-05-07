export default function CreateScript() {
    return (
        <div>
            <div className="flex flex-col gap-6 mw-[100%]">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Xu hướng (Optional)
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Tiktok", "Youtube", "Twitter", "Instagram"].map(
                                (platform) => (
                                    <button
                                        key={platform}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                    >
                                        {platform}
                                    </button>
                                )
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {[
                                "#DanceChallenge",
                                "#TiktokTrend",
                                "#CookingHack",
                                "#ViralSound",
                                "#MakeupTransformation",
                                "#FYP",
                            ].map((tag) => (
                                <button
                                    key={tag}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                                Từ khóa/ Xu hướng (Optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa, chủ đề hoặc ý tưởng cho video của bạn"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                    Sinh kịch bản AI
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                                Kịch bản video
                            </label>
                            <textarea
                                placeholder="text ..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Chọn giọng đọc AI (TTS)
                        </h2>
                        <div className="flex flex-col gap-4 mb-4">
                            {[1, 2, 3].map((voice) => (
                                <div
                                    key={voice}
                                    className="flex items-center gap-4 border border-gray-300 p-4 rounded-md hover:shadow-md"
                                >
                                    <input type="radio" name="voice" />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Name
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Nữ - Mô tả
                                        </p>
                                    </div>
                                    <button className="ml-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                        ▶
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                                Tốc độ giọng đọc
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2 text-gray-800">
                                Tone giọng
                            </label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                <option>Menu Label</option>
                            </select>
                        </div>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Nghe thử giọng đọc
                        </button>
                        <div className="mt-4 text-sm text-gray-500">
                            <p>Thời lượng: 00:00:00</p>
                            <p>Số từ: 10 từ</p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4">
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                        Lưu bản
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                        Tiếp tục tạo
                    </button>
                </div>
            </div>
        </div>
    );
}
