const { Redis } = require("ioredis");
const prisma = require("../../DB/db.config");
let users = {};

const url = process.env.VALKEY_HOST;

const pub = new Redis(url);
const sub = new Redis(url);

const socket = (io) => {
  // Subscribe to Redis
  sub.subscribe("NOTIFICATION-MESSAGES");
  sub.on("message", (channel, message) => {
    if (channel === "NOTIFICATION-MESSAGES") {
      const newMessage = JSON.parse(message);
      newMessage.recipients.forEach((reciver) => {
        io.to(Number(reciver)).emit("receivedMessage", newMessage);
      });
    }
  });

  // Middleware
  io.use((socket, next) => {
    const key = Number(socket.handshake.query.key);
    const device_id = Number(socket.handshake.query.device_id);

    if (!key || key === 0 || !device_id || device_id === 0) {
      return;
    } else {
      socket.join(key);
      console.log(`User ${socket.id} joined room ${key}`);
      if (!users[key]) {
        users[key] = [];
      }
      users[key].push(socket.id);
      next();
    }
  });

  // Event Handlers
  io.on("connection", async (socket) => {
    socket.on("sendMessage", async ({ notificationId, sender }) => {
      const notification = await prisma.def_notifications.findUnique({
        where: {
          notification_id: notificationId,
        },
      });
      if (notification) {
        io.to(Number(sender)).emit("sentMessage", notification);
        await pub.publish(
          "NOTIFICATION-MESSAGES",
          JSON.stringify(notification)
        );
      }
    });

    socket.on("sendDraft", async ({ notificationId, sender }) => {
      const notification = await prisma.def_notifications.findUnique({
        where: {
          notification_id: notificationId,
        },
      });
      io.to(Number(sender)).emit("draftMessage", notification);
    });

    socket.on("draftMsgId", ({ notificationId, sender }) => {
      io.to(Number(sender)).emit("draftMessageId", notificationId);
    });

    socket.on("read", ({ parentID, sender }) => {
      io.to(Number(sender)).emit("sync", parentID);
    });

    socket.on("deleteMessage", ({ notificationId, sender }) => {
      io.to(Number(sender)).emit("deletedMessage", notificationId);
    });

    socket.on("restoreMessage", ({ notificationId, sender }) => {
      io.to(Number(sender)).emit("restoreMessage", notificationId);
    });

    socket.on("multipleDelete", ({ ids, user }) => {
      for (const id of ids) {
        io.to(Number(user)).emit("deletedMessage", id);
      }
    });

    // Device Action
    socket.on("addDevice", async ({ deviceId, userId }) => {
      const device = await prisma.linked_devices.findUnique({
        where: {
          id: deviceId,
          user_id: userId,
        },
      });
      if (device) {
        io.to(Number(user)).emit("addDevice", device);
      }
    });

    socket.on("inactiveDevice", ({ inactiveDevices, userId }) => {
      for (const device of inactiveDevices) {
        io.to(Number(userId)).emit("inactiveDevice", device);
      }
    });

    socket.on("SendAlert", async ({ alertId, recipients, isAcknowledge }) => {
      try {
        for (const recipient of recipients) {
          const alert = await prisma.def_alerts_v.findUnique({
            where: {
              user_id_alert_id: {
                user_id: recipient,
                alert_id: alertId,
              },
            },
          });

          if (alert) {
            io.to(Number(recipient)).emit("SentAlert", {
              alert,
              isAcknowledge,
            });
          }
        }
      } catch (error) {
        console.error("Error sending alert:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      for (const key in users) {
        users[key] = users[key].filter((id) => id !== socket.id);
        if (users[key].length === 0) {
          delete users[key];
        }
      }
    });
    // manage offline devices
    const device_id = Number(socket.handshake.query.device_id);
    const user = Number(socket.handshake.query.key);
    try {
      if (!device_id || device_id === 0) return;
      const device = await prisma.linked_devices.findUnique({
        where: {
          id: device_id,
        },
      });

      if (device.is_active === 0) {
        io.to(user).emit("inactiveDevice", device);
      }
    } catch (error) {
      console.log("Error finding device", device_id);
    }
  });
};
module.exports = socket;
