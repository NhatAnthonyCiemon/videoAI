import passport from "../config/passport.js";
import { createErrorResponse } from "../utils/responseAPI.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// ========== AUTH MIDDLEWARE ==========
const isAuthenticated = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if (!user) {
            res.status(401).json(createErrorResponse(401, "Unauthorized"));
            return;
        }
        req.user = user;
        next();
    })(req, res, next);
};

// ========== MULTER CONFIG ==========
const uploadPath = path.resolve("uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `recording-${Date.now()}.webm`;
        cb(null, uniqueName);
    },
});

const uploadAudio = multer({ storage }).single("file");

// ========== EXPORT ==========
const middleware = {
    isAuthenticated,
    uploadAudio,
};

export default middleware;
