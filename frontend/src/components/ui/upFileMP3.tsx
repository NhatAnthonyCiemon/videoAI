import React, { useState } from 'react';

interface Mp3UploaderProps {
  onUpload?: (file: File) => void;
  urlMp3?: string | null;
}

const Mp3Uploader: React.FC<Mp3UploaderProps> = ({ onUpload, urlMp3 }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'audio/mpeg') {
      setFile(selectedFile);
      if (onUpload) onUpload(selectedFile);
    } else {
      alert('Chỉ chấp nhận file MP3!');
    }
  };

  return (
    <form className="space-y-4 p-4 border rounded shadow-md w-full max-w-l mx-auto">
      <label className="block">
        <span className="text-gray-700 font-medium">Chọn file MP3:</span>
        <input
          type="file"
          accept=".mp3"
          onChange={handleChange}
          className="mt-2 block w-full file:mr-4 file:py-2 file:px-4 file:border file:rounded file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </label>

      {/* Nếu đã có url mp3 từ backend, hiện audio  */}
      {urlMp3 && !file && (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={urlMp3} type="audio/mpeg" />
            Trình duyệt không hỗ trợ phát âm thanh.
          </audio>
        </div>
      )}

      {/* Nếu đã chọn file mới, ưu tiên phát file mới */}
      {file && (
        <div>
          <audio controls className="mt-2 w-full">
            <source src={URL.createObjectURL(file)} type="audio/mpeg" />
            Trình duyệt không hỗ trợ phát âm thanh.
          </audio>
        </div>
      )}
    </form>
  );
};

export default Mp3Uploader;
