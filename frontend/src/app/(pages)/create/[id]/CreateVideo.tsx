"use client";
import { Button } from "@/components/ui/button";
import Video from "@/types/Video";
import videoClass from "@/lib/Video";
import useOverlay from "@/hooks/useOverlay";
import DraftModal from "@/components/ui/DraftModal";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import fetchApi from "@/lib/api/fetch";
import APIResponse from "@/types/apiResponse";
import HttpMethod from "@/types/httpMethos";
import uploadMp3ToCloud from "@/lib/uploadMp3ToCloud";

import {
  Music_System,
  Sticker_System,
  Subtitle,
  Music,
  Sticker,
} from "@/types/Video";
import React, { useRef } from "react";

// Định nghĩa interface cho dữ liệu từ backend
interface BackendResponse {
  subtitles: Subtitle[];
  stickers: Sticker[];
  musics: Music[];
}

interface MusicResponse {
  data: { musics: Music_System[] } | null;
  mes: string;
  status: number;
}

interface StickerResponse {
  data: { stickers: Sticker_System[] } | null;
  mes: string;
  status: number;
}

interface EditDataResponse {
  data: BackendResponse | null;
  mes: string;
  status: number;
}

interface VideoData {
  url: string;
  durations: number[];
  durationAll: number;
}

function CreateVideo({
  videoData,
  setVideoData,
  isCreateAgain,
  setIsCreateAgain,
  setWhichActive,
  isPreparing,
  setIsPreparing,
  musics_sys,
  setMusics_sys,
  stickers_sys,
  setStickers_sys,

  subtitles,
  setSubtitles,
  musics,
  setMusics,
  stickers,
  setStickers,
}: {
  videoData: Video;
  setVideoData: (data: Video) => void;
  isCreateAgain: boolean;
  setIsCreateAgain: (value: boolean) => void;
  setWhichActive: (index: number) => void;
  isPreparing: boolean;
  setIsPreparing: (Active: boolean) => void;
  musics_sys: Music_System[] | null;
  setMusics_sys: (data: Music_System[]) => void;
  stickers_sys: Sticker_System[] | null;
  setStickers_sys: (data: Sticker_System[]) => void;

  subtitles: Subtitle[] | [];
  setSubtitles: (data: Subtitle[]) => void;
  musics: Music[] | [];
  setMusics: (data: Music[]) => void;
  stickers: Sticker[] | [];
  setStickers: (data: Sticker[]) => void;
}) {
  const { isModalOpen, openModal, closeModal } = useOverlay();
  const downloadRef = useRef<HTMLAnchorElement>(null);


  const handleCreateAgain = async () => {
    setIsCreateAgain(true);

    // === Upload mp3 lên cloud nếu có file local ===
    const image_video = [...videoData.image_video];
    console.log("image_video trước khi upload mp3:", image_video);
    for (let i = 0; i < image_video.length; i++) {
      const file = image_video[i].file_mp3;
      if (file && file instanceof File) {
        const url = await uploadMp3ToCloud(file);
        if (url) {
          image_video[i].url_mp3 = url; // Lưu url vào thay cho file
          //console.log(`Đã upload file mp3 cho ảnh ${i + 1}:`, image_video[i].url_mp3);
        } else {
          console.log(
            `Không thể upload file mp3 cho ảnh ${i + 1}, giữ nguyên file cũ.`
          );
          setIsPreparing(false);
          return;
        }
      }
    }
    // Cập nhật lại videoData với url mp3 mới
    setVideoData(videoClass.updateVideo(videoData, "image_video", image_video));

      // === Tiếp tục gọi API tạo video ===
    const res = await fetchApi<{
      url: string;
      durations: number[];
      durationAll: number;
      quality : string;
      bg_music: boolean;
      thumbnail: string;
    }>(`http://localhost:4000/content/createvideo`, HttpMethod.POST, {
      ...videoData,
      image_video, // Đảm bảo truyền image_video đã có url mp3
    });

    // Bây giờ TypeScript sẽ hiểu res.data.url là string
    if (res.mes === "success" && res.data) {
      const url = res.data.url || "";
      console.log("Video URL:", res.data);
      const newVideoData = videoClass.updateVideo(videoData, "url", url);
      const newVideoData2 = videoClass.updateVideo(newVideoData, "step", 2);
      setVideoData(newVideoData2);
      setIsCreateAgain(false);
    } else {
      throw new Error("Invalid response format");
    }
  };

  const handleGetData = async () => {
    setIsPreparing(true);
    setWhichActive(3);
    window.scrollTo({ top: 0, behavior: "smooth" });

        try {
            const [musicRes, stickerRes, editDataRes] = await Promise.all([
                fetchApi<MusicResponse["data"]>(
                    `http://localhost:4000/edit/music`,
                    HttpMethod.GET
                ),
                fetchApi<StickerResponse["data"]>(
                    `http://localhost:4000/edit/sticker`,
                    HttpMethod.GET
                ),
                fetchApi<EditDataResponse["data"]>(
                    `http://localhost:4000/edit/getdata/${videoData.id}`,
                    HttpMethod.GET
                ),
            ]);

      // Kiểm tra phản hồi từ API
      if (
        musicRes.mes !== "success" ||
        stickerRes.mes !== "success" ||
        editDataRes.mes !== "success"
      ) {
        throw new Error("Failed to load some of the resources.");
      }

      // Kiểm tra musicRes.data
      if (!musicRes.data) {
        throw new Error("Music data is null");
      }

      // Kiểm tra stickerRes.data
      if (!stickerRes.data) {
        throw new Error("Sticker data is null");
      }

      // Kiểm tra editDataRes.data
      if (!editDataRes.data) {
        throw new Error("Edit data is null");
      }

      // Cập nhật dữ liệu music_system và sticker_system
      setMusics_sys(musicRes.data.musics);
      setStickers_sys(stickerRes.data.stickers);

            // Dữ liệu từ backend
            const {
                subtitles: backendSubtitles,
                musics: backendMusics,
                stickers: backendStickers,
            } = editDataRes.data;

            // Cập nhật subtitles
            if (backendSubtitles.length > 0) {
                console.log("update sub");
                setSubtitles(backendSubtitles);
            } else {
                console.log("no sub");
            }

      // Cập nhật musics
      if (backendMusics.length > 0) {
        console.log("update mus", backendMusics);
        setMusics(backendMusics);
      } else {
        console.log("no mus");
      }
      // Cập nhật stickers
      if (backendStickers.length > 0) {
        console.log("update sub");
        setStickers(backendStickers);
      } else {
        console.log("no sti");
      }
      // Cập nhật videoData.step
      setVideoData({ ...videoData, step: 3 });
    } catch (err) {
      console.error("handleGetData error:", err);
    } finally {
      setIsPreparing(false);
    }
  };

  function formatDuration(seconds: number | undefined) {
    if (!seconds && seconds !== 0) return "";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(videoData.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Không thể tải video. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div className="flex mb-15 gap-[20px]">
        <div className="flex-grow flex items-center justify-center bg-[#171C31]">
          <video className="" controls src={videoData.url} />
        </div>
        <div className="w-[431px]">
          <h2 className="text-3xl font-bold">Video của bạn đã sẵn sàng</h2>
          <p className="text-2xl text-gray-500 mt-[10px]">
            Video của bạn đã sẵn sàng, bạn có thể xem trước, chỉnh sửa hoặc tải
            xuống.
          </p>
          <div className="grid grid-cols-2 gap-[10px] my-[20px]">
            <div className=" flex gap-[10px] items-center p-[10px] rounded-[10px] border border-[#A7A7A7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <div>
                <p className="text-2xl text-black mb-[10px]">Thời lượng</p>
                <p className="text-2xl text-[#696969]">
                  {formatDuration(videoData.duration)}
                </p>
              </div>
            </div>
            <div className=" flex gap-[10px] items-center p-[10px] rounded-[10px] border border-[#A7A7A7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>

              <div>
                <p className="text-2xl text-black mb-[10px]">Hình ảnh</p>
                <img className="" src={videoData.thumbnail} />
              </div>
            </div>
            <div className=" flex gap-[10px] items-center p-[10px] rounded-[10px] border border-[#A7A7A7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <div>
                <p className="text-2xl text-black mb-[10px]">Chất lượng</p>
                <p className="text-2xl text-[#696969]">{videoData.quality}</p>
              </div>
            </div>
            <div className=" flex gap-[10px] items-center p-[10px] rounded-[10px] border border-[#A7A7A7]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                />
              </svg>

              <div>
                <p className="text-2xl text-black mb-[10px]">Nhạc nền</p>
                <p className="text-2xl text-[#696969]">
                  {videoData.is_bg_music ? "Có" : "Không"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <Button
              onClick={handleCreateAgain}
              variant="outline"
              className="flex-1 cursor-pointer py-[20px] gap-[10px] items-center border-[#000000] rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>

              <p className="text-2xl text-black font-bold">Tạo lại</p>
            </Button>
            <Button
              variant="outline"
              onClick={openModal}
              className="flex-1 cursor-pointer gap-[10px] items-center border-[#000000] py-[20px] rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="size-9"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                />
              </svg>
              <p className="text-2xl text-black font-bold">Lưu bản nháp</p>
            </Button>
          </div>

          <Button
            onClick={() => {
              handleGetData();
            }}
            className="w-full cursor-pointer mt-[20px] bg-[#329F00] hover:bg-[#7caf64] gap-[10px] items-center py-[20px] rounded-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="size-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
            <p className="text-2xl text-white font-bold">Edit video</p>
          </Button>

          <Button
            className="w-full cursor-pointer mt-[20px] gap-[10px] items-center py-[20px] rounded-xl"
            onClick={handleDownload}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="size-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>

            <p className="text-2xl text-white font-bold">Download</p>
          </Button>
        </div>
      </div>
      <DraftModal
        videoData={videoData}
        setVideoData={setVideoData}
        open={isModalOpen}
        onClose={closeModal}
      />
      <LoadingOverlay isPreparing={isCreateAgain} />
      {!isCreateAgain && <LoadingOverlay isPreparing={isPreparing} />}
      {/* Thẻ a ẩn để download */}
      <a
        ref={downloadRef}
        href={videoData.url}
        download="video.mp4"
        //style={{ display: "none" }}
      />
    </div>
  );
}

export default CreateVideo;
