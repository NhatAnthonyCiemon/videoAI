import User from "./service.js";
import Crypto from "../../utils/crypto.js";
import passport from "../../config/passport.js";
import { sendEmail, sendResetPassword } from "../../utils/sendVerify.js";
import jwt from "jsonwebtoken";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// const {
//     createResponse,
//     createErrorResponse,
// } = require("../../utils/responseAPI.js");
import {
    createResponse,
    createErrorResponse,
} from "../../utils/responseAPI.js";
const authController = {
    signupLocal: async (req, res) => {
        const { email, username, password } = req.body;
        try {
            const existUser = await User.findUserByEmail(email);
            if (existUser) {
                console.log("Lỗi 3");
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
                console.log("Lỗi 2");
                res.json(createErrorResponse(400, "User not created"));
            }
            await sendEmail(email, Token);
            res.status(200).json(
                createResponse(200, "success", {
                    user_id: user.id,
                })
            );
        } catch (error) {
            console.log("Lỗi 1", error);
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
            if (user.is_verify === false) {
                return res.json(createErrorResponse(400, "Email not verified"));
            }
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username,
                image: user.image,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "10s",
            });
            res.json(
                createResponse(200, "success", {
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        image: user.image,
                    },
                })
            );
        } catch (error) {
            console.log("error", error);
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
                    username: user.username,
                    image: user.image,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "10d",
                });
                return res.redirect(
                    `http://localhost:3000/auth-success?token=${token}`
                );
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
                    username: user.username,
                    image: user.image,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "10d",
                });
                return res.redirect(
                    `http://localhost:3000/auth-success?token=${token}`
                );
            }
        )(req, res);
    },
    sendResetPassword: async (req, res) => {
        const email = req.body.email;
        const user = await User.findUserByEmail(email);
        try {
            if (!user) {
                return res
                    .status(400)
                    .json(createErrorResponse(400, "Email not found"));
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            await sendResetPassword(email, token);
            res.status(200).json(
                createResponse(200, "success", "Check your email")
            );
        } catch (err) {
            console.log(err);
            res.status(500).json(createErrorResponse(500, "An error occurred"));
        }
    },
    resetPassword: async (req, res) => {
        const token = req.params.token;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.getUserById(decode.id);
            if (!user) {
                return res.send("Token not found");
            }
            res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background: #f3f4f6;
            font-family: Arial, sans-serif;
        }
        .w-full {
            width: 100%;
        }
        .max-w-md {
            max-width: 28rem;
        }
        .mx-auto {
            margin-left: auto;
            margin-right: auto;
        }
        .p-6 {
            padding: 1.5rem;
        }
        .form_inner {
            padding: 20px 0;
            border-radius: 0.25rem;
            background: #fff;
            box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
            border: 2px solid #a5b4fc;
            margin-top: 1.75rem;
            margin-bottom: 1.75rem;
        }
        .form_wrap {
            padding: 1rem;
            background: #fff;
            border-radius: 0.5rem;
        }
        .mb-1 {
            margin-bottom: 1.25rem;
        }
        .text-xl {
            font-size: 1.25rem;
        }
        .font-bold {
            font-weight: bold;
        }
        .text-gray-900 {
            color: #111827;
        }
        .form_label {
            display: block;
            margin-bottom: 10px;
            font-weight: 500;
            color: #4b5563;
            margin-top: 30px;
        }
        .form__group {
            position: relative;
            margin-bottom: 32px !important;
        }
        input.input {
            background: #f9fafb;
            border: 1px solid #d1d5db;
            color: #111827;
            font-size: 1rem;
            border-radius: 0.5rem;
            width: 94%;
            padding: 0.625rem;
            margin-bottom: 0.25rem;
            outline: none;
            transition: border 0.2s;
        }
        input.input:focus {
            border-color: #6366f1;
        }
        #submit {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            background: #3b82f6;
            color: #fff;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        }
        #submit:hover {
            background: #2563eb;
        }
        .error {
            position: absolute;
            color: red;
            font-size: 0.8rem;
            visibility: hidden;
            opacity: 0;
            bottom: -25px;
            left: 0;
        }
        .error_password {
            bottom: -42px;
        }
        .error_true {
            visibility: visible;
            opacity: 1;
        }
        .annouce_verify-wrap {
            display: flex;
            justify-content: center;
            padding: 20px 10px;
            position: absolute;
            visibility: hidden;
            opacity: 0;
            gap: 20px;
            border-radius: 0.25rem;
            align-items: center;
            margin-top: 1rem;
            background-color: #ecdecb;
        }
        .annouce_verify-wrap_true {
            transition: 1s;
            visibility: visible;
            opacity: 1;
            position: relative;
        }
        .annouce_warning-img {
            width: 50px;
        }
        .annouce_verify {
            font-size: 1rem;
            color: #5a3e07;
        }
    </style>
</head>
<body>
<section class="w-full max-w-md mx-auto p-6">
    <div class="form_inner">
        <div class="form_wrap">
            <h2 class="mb-1 text-xl font-bold text-gray-900">
                Change Password
            </h2>
            <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                <div class="form__group">
                    <label for="password" class="form_label block mb-2 text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        class="input"
                        required
                    >
                    <p class="error error_password">Err: </p>
                </div>
                <div class="form__group" style="margin-top: 30px;">
                    <label for="confirm-password" class="form_label block mb-2 text-sm font-medium">Confirm password</label>
                    <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="••••••••"
                        class="input"
                        required
                    >
                    <p class="error error_confirm-password">Err: </p>
                </div>
                <button
                    type="submit"
                    id="submit"
                >Reset password</button>
                <div class="annouce_verify-wrap">
                    <p class="annouce_verify"></p>
                </div>
            </form>
        </div>
    </div>
</section>
<script>
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btn_submit = document.getElementById("submit");
const error_password = document.querySelector(".error_password");
const error_confirm = document.querySelector(".error_confirm-password");
const annouce_verify_wrap = document.querySelector(".annouce_verify-wrap");
const annouce_verify = document.querySelector(".annouce_verify");

function validateFormBlank() {
    return password.value !== "" && confirmPassword.value !== "";
}
function validatePassword(passwordValue) {
    return passwordValue.length > 6;
}
function validatePasswordMatch(passwordValue, confirmPasswordValue) {
    return passwordValue === confirmPasswordValue;
}

password.addEventListener("input", () => {
    error_password.innerHTML = "";
    error_password.classList.remove("error_true");
});
confirmPassword.addEventListener("input", () => {
    error_confirm.innerHTML = "";
    error_confirm.classList.remove("error_true");
});

btn_submit.addEventListener("click", async (e) => {
    e.preventDefault();
    btn_submit.disabled = true;
    if (password.value === "") {
        error_password.innerHTML = "Password is required";
        error_password.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    if (!validatePassword(password.value)) {
        error_password.innerHTML =
            "Password must be at least 6 characters long";
        error_password.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    if (confirmPassword.value === "") {
        error_confirm.innerHTML = "Confirm password is required";
        error_confirm.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    if (!validatePasswordMatch(password.value, confirmPassword.value)) {
        error_confirm.innerHTML = "Password does not match";
        error_confirm.classList.add("error_true");
        btn_submit.disabled = false;
        return;
    }
    // Lấy token từ url nếu cần, ví dụ: /reset-password/:token
    const token = window.location.pathname.split("/")[3];
    try {
        const response = await fetch("/auth/updatepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password: password.value,
                token: token,
            }),
        });
        const data = await response.json();
        if (data.error) {
            annouce_verify_wrap.classList.add("annouce_verify-wrap_true");
            annouce_verify.innerHTML = "Have an error occurred";
        } else {
            annouce_verify.innerHTML = "Password updated successfully";
            annouce_verify_wrap.classList.add("annouce_verify-wrap_true");
            annouce_verify_wrap.style.backgroundColor = "#cbecd0";
        }
    } catch (err) {
        annouce_verify_wrap.classList.add("annouce_verify-wrap_true");
        annouce_verify.innerHTML = "Have an error occurred";
    }
    btn_submit.disabled = false;
});
</script>
</body>
</html>`);
        } catch (err) {
            console.log(err);
            return res.send("Token invalid");
        }
    },
    updatePassword: async (req, res) => {
        console.log("Update password");
        const { password, token } = req.body;
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            const user = await User.getUserById(decode.id);
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            await User.updatePassword(user.id, password);
            res.status(200).json({ message: "Password updated" });
        } catch (err) {
            console.log(err);
            res.status(500).send("An error occurred");
        }
    },
};

export default authController;
