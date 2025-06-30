"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import Notification2 from "@/components/ui/Notification2";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import SharePlatformPopup from "@/components/ui/SharePlatformPopup";
import fetchApi from "@/lib/api/fetch";
import HttpMethod from "@/types/httpMethos";

interface VideoPopupProps {
    id: string;
    url: string;
    subtitle: string;
    onClose: () => void;
    fromHome?: boolean; 
    fromGallery?: boolean;
}

interface CheckYoutubeResponse {
    isAuthenticated: boolean;
}

interface CheckFacebookResponse {
    isAuthenticated: boolean;
}

interface YoutubeAuthResponse {
    authUrl: string;
}

interface FacebookAuthResponse {
    authUrl: string;
}

interface ShareUrlResponse {
    url_youtube: string | null;
    url_facebook: string | null;
}

interface SocialMetricsResponse {
    youtube: { views: number; likes: number } | null;
    facebook: { views: number; likes: number } | null;
}

export default function VideoPopup({ id, url, subtitle, onClose, fromHome = false, fromGallery = false }: VideoPopupProps) {
    const [socialMetrics, setSocialMetrics] = useState<SocialMetricsResponse>({
        facebook: null,
        youtube: null,
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [showNot, setShowNot] = useState(false);
    const [mes, setMes] = useState("");
    const [isLoad, setIsLoad] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<
        "youtube" | "facebook" | null
    >(null);
    const [shareUrls, setShareUrls] = useState<ShareUrlResponse | null>(null);

    const fetchSocialMetrics = async () => {
        try {
            const res = await fetchApi<SocialMetricsResponse>(
                `http://localhost:4000/share/metrics/${id}`,
                HttpMethod.GET
            );
            if (res.mes === "success" && res.status === 200 && res.data) {
                setSocialMetrics(res.data);
            } else {
                setSocialMetrics({
                    facebook: null,
                    youtube: null,
                });
            }
        } catch (error) {
            console.error("Error fetching social metrics:", error);
            setSocialMetrics({
                facebook: null,
                youtube: null,
            });
        }
    };

    const fetchShareUrls = async () => {
        try {
            const res = await fetchApi<ShareUrlResponse>(
                `http://localhost:4000/share/get/${id}`,
                HttpMethod.GET
            );
            if (res.mes === "success" && res.status === 200) {
                setShareUrls(res.data || null);
            } else {
                setShareUrls(null);
            }
        } catch (error) {
            console.error("Error fetching share URLs:", error);
            setShareUrls(null);
        }
    };

    useEffect(() => {
        fetchSocialMetrics();
        fetchShareUrls();
    }, [id]);

    const handleShareToPlatform = async (platform: "youtube" | "facebook") => {
        const shareUrl = shareUrls?.[`url_${platform}`];

        // Logic khi mở từ trang Home
        if (fromHome || fromGallery) {
            if (shareUrl) {
                window.open(shareUrl, "_blank");
            } else {
                setShowNot(true);
                setMes(`Video chưa được chia sẻ trên ${platform.charAt(0).toUpperCase() + platform.slice(1)}.`);
            }
            return;
        }

        // Logic hiện tại cho các trang khác
        if (shareUrl) {
            window.open(shareUrl, "_blank");
            return;
        }

        if (platform === "youtube") {
            try {
                setIsLoad(true);
                const res = await fetchApi<CheckYoutubeResponse>(
                    "http://localhost:4000/auth/youtube/check",
                    HttpMethod.GET
                );
                setIsLoad(false);
                if (!res.data?.isAuthenticated) {
                    const authRes = await fetchApi<YoutubeAuthResponse>(
                        "http://localhost:4000/auth/youtube",
                        HttpMethod.GET
                    );
                    if (authRes.data?.authUrl) {
                        const authWindow = window.open(authRes.data.authUrl, "_blank", "width=600,height=600");
                        if (!authWindow) {
                            setShowNot(true);
                            setMes("Không thể mở cửa sổ xác thực. Vui lòng cho phép cửa sổ bật lên.");
                            return;
                        }
                        const checkWindowClosed = setInterval(() => {
                            if (authWindow.closed) {
                                clearInterval(checkWindowClosed);
                                checkAuthStatus("youtube");
                            }
                        }, 1000);
                    } else {
                        throw new Error("Không nhận được URL xác thực");
                    }
                } else {
                    setSelectedPlatform(platform);
                    setShowSharePopup(true);
                }
            } catch (error: any) {
                setIsLoad(false);
                setShowNot(true);
                setMes("Lỗi kiểm tra xác thực YouTube: " + (error.message || "Không xác định"));
            }
        } else if (platform === "facebook") {
            try {
                setIsLoad(true);
                const res = await fetchApi<CheckFacebookResponse>(
                    "http://localhost:4000/auth/facebook/check",
                    HttpMethod.GET
                );
                setIsLoad(false);
                if (!res.data?.isAuthenticated) {
                    const authRes = await fetchApi<FacebookAuthResponse>(
                        "http://localhost:4000/auth/facebook",
                        HttpMethod.GET
                    );
                    if (authRes.data?.authUrl) {
                        const authWindow = window.open(authRes.data.authUrl, "_blank", "width=600,height=600");
                        if (!authWindow) {
                            setShowNot(true);
                            setMes("Không thể mở cửa sổ xác thực. Vui lòng cho phép cửa sổ bật lên.");
                            return;
                        }
                        const checkWindowClosed = setInterval(() => {
                            if (authWindow.closed) {
                                clearInterval(checkWindowClosed);
                                checkAuthStatus("facebook");
                            }
                        }, 1000);
                    } else {
                        throw new Error("Không nhận được URL xác thực");
                    }
                } else {
                    setSelectedPlatform(platform);
                    setShowSharePopup(true);
                }
            } catch (error: any) {
                setIsLoad(false);
                setShowNot(true);
                setMes("Lỗi kiểm tra xác thực Facebook: " + (error.message || "Không xác định"));
            }
        }
    };

    const checkAuthStatus = async (platform: "youtube" | "facebook") => {
        try {
            setIsLoad(true);
            const res = await fetchApi<CheckYoutubeResponse | CheckFacebookResponse>(
                `http://localhost:4000/auth/${platform}/check`,
                HttpMethod.GET
            );
            setIsLoad(false);
            if (res.data?.isAuthenticated) {
                setSelectedPlatform(platform);
                setShowSharePopup(true);
            } else {
                setShowNot(true);
                setMes(`Xác thực ${platform} không thành công. Vui lòng thử lại.`);
            }
        } catch (error: any) {
            setIsLoad(false);
            setShowNot(true);
            setMes(`Lỗi kiểm tra xác thực ${platform}: ` + (error.message || "Không xác định"));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="flex max-w-[90vw] max-h-[90vh] w-full h-full bg-black rounded-xl shadow-lg gap-4 p-4 relative">
                <Button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-transparent hover:bg-white/10 text-4xl z-50 rounded-sm"
                    aria-label="Close video"
                >
                    ×
                </Button>

                <div className="flex-[7] flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    {url.includes("youtube") ? (
                        <iframe
                            src={url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={url}
                            controls
                            autoPlay={false}
                            className="w-full h-full object-contain bg-black"
                        />
                    )}
                </div>

                <div className="flex flex-col flex-[3] gap-4">
                    <div className="flex-1 p-6 overflow-y-auto text-white text-xl leading-relaxed rounded-lg border border-white/20">
                        <h2 className="mb-4 font-semibold text-2xl">Subtitle:</h2>
                        <p className="whitespace-pre-line">{subtitle}</p>
                    </div>

                    <div className="flex flex-row justify-between items-center gap-4 p-4 px-20 w-full">
                        <div className="flex flex-col items-center gap-2">
                            <Button
                                onClick={() => handleShareToPlatform("facebook")}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-50 h-14 rounded-lg"
                                aria-label="Share on Facebook"
                            >
                                <FaFacebook className="size-8" />
                                <span className="text-xl">Facebook</span>
                            </Button>
                            <span className="text-xl text-white text-center">
                                {socialMetrics.facebook ? `${socialMetrics.facebook.views} views` : "- views"}<br />
                                {socialMetrics.facebook ? `${socialMetrics.facebook.likes} likes` : "- likes"}
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Button
                                onClick={() => handleShareToPlatform("youtube")}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 w-50 h-14 rounded-lg"
                                aria-label="Share on YouTube"
                            >
                                <FaYoutube className="size-8" />
                                <span className="text-xl">Youtube</span>
                            </Button>
                            <span className="text-xl text-white text-center">
                                {socialMetrics.youtube ? `${socialMetrics.youtube.views} views` : "- views"}<br />
                                {socialMetrics.youtube ? `${socialMetrics.youtube.likes} likes` : "- likes"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <LoadingOverlay isPreparing={isLoad} message="Đang xử lý..." />

            {showNot && (
                <Notification2
                    isOpen={showNot}
                    message={mes}
                    onClose={() => {
                        setShowNot(false);
                        document.body.style.overflow = "auto";
                    }}
                />
            )}

            {showSharePopup && selectedPlatform && (
                <SharePlatformPopup
                    videoId={id}
                    platform={selectedPlatform}
                    videoUrl={url}
                    onClose={() => {
                        setShowSharePopup(false);
                        fetchShareUrls();
                        fetchSocialMetrics();
                    }}
                />
            )}
        </div>
    );
}