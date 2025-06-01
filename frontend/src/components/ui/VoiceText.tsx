import { useState, useRef } from "react";
import { getToken } from "@/lib/Token";
import HttpMethod from "@/types/httpMethos";
import { FaMicrophone } from "react-icons/fa";
import Video from "@/types/Video";
import videoClass from "@/lib/Video";
import APIResponse from "@/types/apiResponse";

export default function AudioRecorder({
    className = "",
    videoData,
    setVideoData,
    setDisabled,
    setIsLoading,
    
}: {
    className?: string;
    videoData: Video;
    setVideoData: (data: Video) => void;
    setDisabled: (disabled: boolean) => void;
    setIsLoading: (loading: boolean) => void;
}) {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const handleRecord = async () => {
        if (!isRecording) {
            setDisabled(true);
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                setDisabled(false);
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                chunksRef.current = [];
                mediaRecorder.ondataavailable = (e: BlobEvent) => {
                    chunksRef.current.push(e.data);
                };
                mediaRecorder.onstop = async () => {
                    setIsLoading(true);
                    const audioBlob = new Blob(chunksRef.current, {
                        type: "audio/webm",
                    });
                    chunksRef.current = [];
                    const formData = new FormData();
                    formData.append("file", audioBlob, "recording.webm");
                    try {
                        const response: APIResponse<string> = await fetch(
                            "http://localhost:4000/content/audio",
                            {
                                method: HttpMethod.POST,
                                headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                },
                                body: formData,
                            }
                        ).then((res) => res.json());
                        if (response.mes === "success") {
                            const audioUrl = response.data;
                            const newVideoData = videoClass.updateVideo(
                                videoData,
                                "keyword",
                                audioUrl || ""
                            );
                            setVideoData(newVideoData);
                            setDisabled(false);
                            setIsLoading(false);
                        } else {
                            console.error("Upload failed:", response.mes);
                            setDisabled(false);
                            setIsLoading(false);
                        }
                    } catch (err) {
                        console.error("Upload error:", err);
                        setDisabled(false);
                        setIsLoading(false);
                    }
                };
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err: any) {
                setDisabled(false);
                setIsLoading(false);
            }
        } else {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        }
    };

    return (
        <button
            onClick={handleRecord}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className={`
            p-2 rounded-[5px] mx-[5px] text-white transition-transform duration-200 cursor-pointer relative
            ${
                isRecording
                    ? "animate-pulse scale-125 ring-4 ring-red-400 ring-opacity-60 shadow-lg shadow-red-400"
                    : "hover:scale-105"
            }
            ${className}
        `}
            style={{
                transition: "box-shadow 0.3s, transform 0.3s",
            }}
        >
            <span
                className={`absolute inset-0 rounded-full pointer-events-none
                ${isRecording ? "animate-ping bg-red-400 opacity-40" : ""}
            `}
            />
            <FaMicrophone
                size={22}
                color={isRecording ? "#ef4444" : "#a3a3a3"}
                className="relative z-10"
            />
        </button>
    );
}
