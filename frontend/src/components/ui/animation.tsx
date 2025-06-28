import React, { useEffect, useRef, useState } from "react";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

interface AnimationSelectorProps {
  video: any;
  index: number;
  onChangeAnim: (animValue: number) => void;
}

const AnimationSelector: React.FC<AnimationSelectorProps> = ({
  video,
  index,
  onChangeAnim,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [url, setUrl] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchApi<{}>(
        "http://localhost:4000/anim",
        HttpMethod.GET
      );
      if (
        res.mes === "success" &&
        Array.isArray(res.data) &&
        res.data.length > 0
      ) {
        setData(res.data);
        if (video && video.image_video && video.image_video[index].anim) {
          const found = res.data.find(
            (item: any) => item.id_anim === video.image_video[index].anim
          );
          setSelected(found ? found.name : String(res.data[0].name));
          setUrl(found ? found.url_anim : res.data[0].url_anim);
        } else {
          setSelected(String(res.data[0].name));
          onChangeAnim(res.data[0].id_anim);
          setUrl(res.data[0].url_anim);
        }
        console.log("Animations fetched successfully", res.data);
      } else {
        setData([]);
        setSelected("");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (videoRef.current && url) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [url]);

  return (
    <div className="mx-auto mt-8 p-4 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Chọn Animation</h2>

      <select
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          const found = data.find((item: any) => item.name === e.target.value);
          if (found) {
            setUrl(found.url_anim);
            onChangeAnim(found.id_anim); // Gọi callback để cập nhật anim
          }
        }}
      >
        {data.map((item: any) => (
          <option key={item.id_anim} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      <h2 className="text-xl font-semibold text-gray-800">
        Xem trước animation
      </h2>

      <video
        ref={videoRef}
        width="320"
        height="240"
        controls
        src={url}
        className="rounded-lg border border-gray-300"
      />
    </div>
  );
};

export default AnimationSelector;
