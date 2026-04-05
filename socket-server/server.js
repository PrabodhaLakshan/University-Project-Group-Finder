const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Socket server is running");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_group", (groupId) => {
        const roomName = `group:${groupId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined ${roomName}`);
    });

    socket.on("send_message", ({ groupId, message }) => {
        const roomName = `group:${groupId}`;
        io.to(roomName).emit("receive_message", message);
    });

    socket.on("delete_message", ({ groupId, messageId }) => {
        const roomName = `group:${groupId}`;
        io.to(roomName).emit("message_deleted", { messageId });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.post("/internal/emit-group-message", (req, res) => {
    try {
        const { groupId, message } = req.body || {};

        if (!groupId || !message) {
            return res.status(400).json({
                success: false,
                message: "groupId and message are required",
            });
        }

        const roomName = `group:${groupId}`;
        io.to(roomName).emit("receive_message", message);

        return res.json({ success: true });
    } catch (error) {
        console.error("Internal emit group message error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to emit group message",
        });
    }
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Socket server running on http://localhost:${PORT}`);
});
