// const store = require("./service");

import store from "./service.js";
const storeController = {
    saveFullContentData: async (req, res) => {
        const {
            id,
            user_id,
            name,
            category,
            step,
            content,
            keyword,
            voice_info,
        } = req.body;
        if (
            !id ||
            !user_id ||
            !name ||
            !category ||
            step === undefined ||
            !content ||
            !voice_info
        ) {
            console.log("Missing required fields in saveFullContentData");
            return res.status(400).json({
                mes: "Missing required fields",
                status: false,
                data: null,
            });
        }
        let newkeyword = keyword;
        if (!keyword) {
            newkeyword = "";
        }
        try {
            const user = await store.findUserId(user_id);
            if (!user) {
                return res.status(404).json({
                    mes: "User not found",
                    status: false,
                    data: null,
                });
            }
            if (id.length != 10) {
                return res.status(400).json({
                    mes: "ID must be 10 characters long",
                    status: false,
                    data: null,
                });
            }
            const result = await store.saveData(
                id,
                user_id,
                name,
                category,
                step,
                content,
                newkeyword,
                voice_info
            );
            if (!result) {
                return res.status(500).json({
                    mes: "Error saving data",
                    status: false,
                    data: null,
                });
            }
            return res.status(200).json({
                mes: "success",
                status: true,
                data: id,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mes: "Error saving data",
                status: false,
                data: null,
            });
        }
    },
    saveImage: async (req, res) => {
        const {
            id,
            user_id,
            name,
            category,
            step,
            content,
            keyword,
            image_video,
            voice_info,
        } = req.body;
        if (
            !id ||
            !user_id ||
            !name ||
            !category ||
            step === undefined ||
            !content ||
            image_video === undefined ||
            !voice_info
        ) {
            console.log("Missing required in saveImage");
            return res.status(400).json({
                mes: "Missing required fields",
                status: false,
                data: null,
            });
        }
        let newkeyword = keyword;
        if (!keyword) {
            newkeyword = "";
        }
        try {
            const user = await store.findUserId(user_id);
            if (!user) {
                return res.status(404).json({
                    mes: "User not found",
                    status: false,
                    data: null,
                });
            }
            if (id.length != 10) {
                return res.status(400).json({
                    mes: "ID must be 10 characters long",
                    status: false,
                    data: null,
                });
            }
            const result = await store.saveDataWithImage(
                id,
                user_id,
                name,
                category,
                step,
                content,
                newkeyword,
                image_video,
                voice_info
            );
            if (!result) {
                return res.status(500).json({
                    mes: "Error saving data",
                    status: false,
                    data: null,
                });
            }
            return res.status(200).json({
                mes: "success",
                status: true,
                data: id,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mes: "Error saving data",
                status: false,
                data: null,
            });
        }
    },
    saveVideo: async (req, res) => {
        const {
            id,
            user_id,
            name,
            category,
            step,
            content,
            keyword,
            image_video = [],
            voice_info,
            url,
            is_custom_voice,
            duration,
            thumbnail,
            quality,
            is_bg_music,
        } = req.body;
        console.log("Dữ liệu tuyền đi :", req.body);
        console.log("Saving video with the following details:");
        console.log("Duration:", duration);
        console.log("Thumbnail:", thumbnail);
        console.log("Quality:", quality);
        console.log("is_bg_music:", is_bg_music);
           

        console.log("calll")
        if (
            !id ||
            !user_id ||
            !name ||
            !category ||
            step === undefined ||
            !content ||
            image_video === undefined ||
            !voice_info ||
            !url 
        ) {
            console.log("Missing required fields in saveVideo");
            return res.status(400).json({
                mes: "Missing required fields",
                status: false,
                data: null,
            });
        }

        let newkeyword = keyword;
        if (!keyword) {
            newkeyword = "";
        }

        try {
            const user = await store.findUserId(user_id);
            if (!user) {
                return res.status(404).json({
                    mes: "User not found",
                    status: false,
                    data: null,
                });
            }
            if (id.length != 10) {
                return res.status(400).json({
                    mes: "ID must be 10 characters long",
                    status: false,
                    data: null,
                });
            }
           
            const result = await store.saveDataWithVideo(
                id,
                user_id,
                name,
                category,
                step,
                content,
                newkeyword,
                image_video,
                voice_info,
                url,
                is_custom_voice,
                duration,
                thumbnail,
                quality,
                is_bg_music
            );
            
            if (!result) {
                return res.status(500).json({
                    mes: "Error saving data",
                    status: false,
                    data: null,
                });
            }
            return res.status(200).json({
                mes: "success",
                status: true,
                data: id,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mes: "Error saving data",
                status: false,
                data: null,
            });
        }
    },
};

export default storeController;
