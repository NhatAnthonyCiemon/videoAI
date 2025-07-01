import express from "express";
import route from "./routers/index.js";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./config/passport.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(passport.initialize());
app.use(cors());
app.use(express.static("./src/public"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Create HTTP server
const server = http.createServer(app);
// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

route(app);

// Middleware handle errors
server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});

export default app;
export { io };
