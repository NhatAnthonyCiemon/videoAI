import nodemailer from "nodemailer";
const GMAIL_EMAIL = process.env.GOOGLE_MAIL; // Email Gmail của bạn
const GMAIL_APP_PASSWORD = process.env.GOOGLE_PASS; // App Password của Gmail

const routehttp = process.env.PUBLIC_ROUTE || "http://localhost:4000/";

// Hàm tạo transporter cho Gmail
function createTransporter() {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Sử dụng dịch vụ Gmail
        auth: {
            user: GMAIL_EMAIL,
            pass: GMAIL_APP_PASSWORD, // Sử dụng App Password
        },
    });
    return transporter;
}

// Hàm gửi email xác minh
async function sendEmail(email, token) {
    const transporter = createTransporter();
    const mailOptions = {
        from: `Dự án VIDEO AI <${GMAIL_EMAIL}>`,
        to: email,
        subject: "Verify your email",
        text: "Click the link below to verify your email",
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                <h2 style="color: #007BFF;">Chào mừng bạn đến với Dự án VIDEO AI!</h2>
                <p>Nhấn vào nút bên dưới để xác thực email của bạn và bắt đầu trải nghiệm các dịch vụ tuyệt vời.</p>
                <a href='${routehttp}auth/verify/${token}' 
                   style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Xác Thực Email
                </a>
                <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
                    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
                </p>
            </div>
            <footer style="margin-top: 20px; text-align: center; font-size: 0.8em; color: #777;">
                <p>&copy; 2024 Dự án VIDEO AI. Tất cả các quyền được bảo lưu.</p>
                <p>Email: ${GMAIL_EMAIL}</p>
            </footer>
        </div>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

// Hàm gửi email đặt lại mật khẩu
async function sendResetPassword(email, token) {
    const transporter = createTransporter();
    const mailOptions = {
        from: `Dự án WEB Bán Hàng <${GMAIL_EMAIL}>`,
        to: email,
        subject: "Reset your password",
        text: "Click the link below to reset your password",
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-radius: 8px; border: 1px solid #ddd;">
                <h2 style="color: #007BFF;">Yêu cầu đặt lại mật khẩu</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn. Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                <a href='${routehttp}auth/reset/${token}' 
                   style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Đặt Lại Mật Khẩu
                </a>
                <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
                    Liên kết sẽ hết hạn sau 24 giờ.
                </p>
            </div>
            <footer style="margin-top: 20px; text-align: center; font-size: 0.8em; color: #777;">
                <p>&copy; 2024 Dự án WEB Bán Hàng. Tất cả các quyền được bảo lưu.</p>
                <p>Email: ${GMAIL_EMAIL}</p>
            </footer>
        </div>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
    }
}

export { sendEmail, sendResetPassword };
