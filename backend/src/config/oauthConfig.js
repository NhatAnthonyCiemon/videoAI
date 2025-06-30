import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const youtubeOauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || "http://localhost:4000/auth/youtube/callback"
);

const facebookOauthConfig = {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || "http://localhost:4000/auth/facebook/callback",
    pageId: process.env.FACEBOOK_PAGE_ID,
    scope: ["read_insights", "publish_video", "pages_manage_metadata", "pages_read_user_content", "pages_manage_engagement", "pages_manage_posts", "pages_read_engagement", "pages_show_list"],
};

export default {
    youtube: youtubeOauth2Client,
    facebook: facebookOauthConfig,
};