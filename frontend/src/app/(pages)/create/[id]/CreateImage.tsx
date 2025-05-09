export default function CreateImage() {
    return (
        <div>
            {/* Image Sections */}
            <div className="flex flex-col gap-8">
                {[1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-md shadow-md"
                    >
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                            Ảnh {index}:
                        </h2>
                        <div className="grid grid-cols-3 gap-8">
                            {/* Image Placeholder */}
                            <div className="col-span-1 h-[100%] min-h-[200px] bg-gray-300 rounded-md"></div>

                            {/* Script and Prompt */}
                            <div className="col-span-2 text-2xl flex flex-col gap-4">
                                <div>
                                    <p className="font-semibold text-gray-800 text-xl">
                                        Script:
                                    </p>
                                    <p className="text-gray-600">
                                        Lorem ipsum arcu proin aliquam massa
                                        faucibus vitae dictum diam scelerisque
                                        lobortis elementum semper et morbi et
                                        tincidunt sed turpis.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-xl">
                                        Prompt (Description):
                                    </p>
                                    <p className="text-gray-600">
                                        Lorem ipsum arcu proin aliquam massa
                                        faucibus vitae dictum diam scelerisque
                                        lobortis elementum semper et morbi et
                                        tincidunt sed turpis.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Regenerate Button */}
                        <div className="flex justify-end mt-4">
                            <button className="px-4 py-4 cursor-pointer text-2xl bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                Tạo lại
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-8 my-10">
                <button className="px-4 cursor-pointer py-4 text-2xl bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                    Lưu bản nháp
                </button>
                <button className="px-4 cursor-pointer py-4 text-2xl bg-black text-white rounded-md hover:bg-gray-800">
                    Tạo Video
                </button>
            </div>
        </div>
    );
}
