import { Server } from "socket.io";

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role;

    if (userId) {
      socket.join(`user:${userId}`);
    }
    if (role === "admin") {
      socket.join("admin");
    }

    socket.join("all");

    socket.on("disconnect", () => {});
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export async function emitNotification(notification) {
  if (!io) return;

  const payload = {
    _id: notification._id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    action: notification.action,
    relatedUser: notification.relatedUser,
    relatedBook: notification.relatedBook,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };

  if (notification.isGlobal) {
    io.to("all").emit("notification", payload);
  }
  if (notification.targetRole === "admin") {
    io.to("admin").emit("notification", payload);
  }
  if (notification.targetRole === "user" && notification.user) {
    io.to(`user:${notification.user}`).emit("notification", payload);
  }
  if (notification.user) {
    io.to(`user:${notification.user}`).emit("notification", payload);
  }
}
