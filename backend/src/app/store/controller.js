const store = require("./service");

const storeController = {
    saveFullContentData: async (req, res) => {
        const { id, user_id, name, category, step, content, keyword } =
            req.body;
        if (
            !id ||
            !user_id ||
            !name ||
            !category ||
            step === undefined ||
            !content ||
            !keyword
        ) {
            console.log("Missing required fields");
            return res.status(400).json({
                mes: "Missing required fields",
                status: false,
                data: null,
            });
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
                keyword
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
        } = req.body;
        if (
            !id ||
            !user_id ||
            !name ||
            !category ||
            step === undefined ||
            !content ||
            !keyword ||
            image_video === undefined
        ) {
            console.log("Missing required fields");
            return res.status(400).json({
                mes: "Missing required fields",
                status: false,
                data: null,
            });
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
                keyword,
                image_video
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

module.exports = storeController;
