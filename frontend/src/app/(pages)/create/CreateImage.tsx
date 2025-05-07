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
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">
                            Ảnh {index}:
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Image Placeholder */}
                            <div className="col-span-1 bg-gray-300 h-40 rounded-md"></div>

                            {/* Script and Prompt */}
                            <div className="col-span-2 flex flex-col gap-4">
                                <div>
                                    <p className="font-semibold text-gray-800">
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
                                    <p className="font-semibold text-gray-800">
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
                            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                                Tạo lại
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8">
                <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                    Lưu bản nháp
                </button>
                <button className="px-4 py-2 bg-black text-white rounded-md">
                    Tạo Video
                </button>
            </div>
        </div>
    );
}
