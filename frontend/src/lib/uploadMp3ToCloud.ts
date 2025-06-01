const uploadMp3ToCloud = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "minh123"); // Thay bằng preset của bạn

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dasqsts9r/video/upload", // Thay bằng cloud name của bạn
      {
        method: "POST",
        body: formData,
      }
    );
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Lỗi upload:", err);
    return null;
  }
};

export default uploadMp3ToCloud;