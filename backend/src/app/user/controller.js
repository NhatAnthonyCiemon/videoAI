//const User = require("./service");
import User from "./service.js";
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";
const userController = {
    getUser: async (req, res) => {
        if (!req.user) {
            console.log("User not found", req.user);
            res.json(createErrorResponse(401, "Unauthorized"));
        } else {
            console.log("User data retrieved successfully", req.user);
            res.json(
                createResponse(200, "success", {
                    id: req.user.id,
                    email: req.user.email,
                    username: req.user.username,
                    image: req.user.image,
                })
            );
        }
    },
};

export default userController;
