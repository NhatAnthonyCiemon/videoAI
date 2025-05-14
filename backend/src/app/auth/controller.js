import User from "./service.js";
import Crypto from "../../utils/crypto.js";
import passport from "../../config/passport.js";
import { sendEmail } from "../../utils/sendVerify.js";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const {
    createResponse,
    createErrorResponse,
} = require("../../utils/responseAPI.js");
const authController = {
    signupLocal: async (req, res) => {
        const { email, username, password } = req.body;
        try {
            const existUser = await User.findUserByEmail(email);
            if (existUser) {
                res.json(createErrorResponse(400, "Email already taken"));
            }
            const Token = Crypto.generateToken();
            const user = await User.createUserLocal(
                email,
                username,
                password,
                Token
            );
            if (!user) {
                res.json(createErrorResponse(400, "User not created"));
            }
            await sendEmail(email, Token);
            res.status(200).json(
                createResponse(200, "User created", {
                    user_id: user.id,
                })
            );
        } catch (error) {
            res.status(400).json(createErrorResponse(400, error.message));
        }
    },
    verify: async (req, res) => {
        const Token = req.params.token;
        const user = await User.verifyUser(Token);
        if (!user) {
            return res.send("Token not found");
        }
        res.redirect(FRONTEND_URL);
    },
    loginLocal: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findUserByEmailAndPassWord(email, password);
            if (!user) {
                return res.json(
                    createErrorResponse(400, "Invalid email or password")
                );
            }
            const payload = {
                id: user.id,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "10d",
            });
            res.json(
                createResponse(200, "Login successful", {
                    token: token,
                })
            );
        } catch (error) {
            res.status(400).json(createErrorResponse(400, error.message));
        }
    },
    googleSignup: (req, res) => {
        return passport.authenticate("google", {
            scope: ["profile", "email"],
        })(req, res);
    },
    githubSignup: (req, res) => {
        return passport.authenticate("github", {
            scope: ["user:email"],
        })(req, res);
    },
    googleCallBack: (req, res) => {
        passport.authenticate(
            "google",
            {
                failureRedirect: "/auth/login",
            },
            (err, user, info) => {
                if (err) {
                    return res.json(createErrorResponse(400, "Login failed"));
                }
                if (!user) {
                    return res.json(createErrorResponse(400, "User not found"));
                }
                // Nếu xác thực thành công, sử dụng req.login để lưu thông tin người dùng vào session
                const payload = {
                    id: user.id,
                    email: user.email,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "10d",
                });
                // res.json(
                //     createResponse(200, "Login successful", {
                //         token: token,
                //     })
                // );
                //code sau khi code frontend
            }
        )(req, res);
    },
    githubCallBack: (req, res) => {
        passport.authenticate(
            "github",
            {
                failureRedirect: "/auth/login",
            },
            (err, user, info) => {
                if (err) {
                    return res.json(createErrorResponse(400, "Login failed"));
                }
                if (!user) {
                    return res.json(createErrorResponse(400, "User not found"));
                }
                const payload = {
                    id: user.id,
                    email: user.email,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "10d",
                });
                // res.json(
                //     createResponse(200, "Login successful", {
                //         token: token,
                //     })
                // );
                //code sau khi code frontend
            }
        )(req, res);
    },
};

export default authController;
