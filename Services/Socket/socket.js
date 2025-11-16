const { Redis } = require("ioredis");
const prisma = require("../../DB/db.config");
const { VALKEY_HOST } = require("../../Variables/variables");
let users = {};
let devices = {};

const pub = new Redis(VALKEY_HOST);
const sub = new Redis(VALKEY_HOST);

const socket = (io) => {
  // Subscribe to Redis
  sub.subscribe("NOTIFICATION-MESSAGES");
  sub.on("message", (channel, message) => {
    if (channel === "NOTIFICATION-MESSAGES") {
      const newMessage = JSON.parse(message);
      // console.log(newMessage, "16");
      io.to(Number(newMessage.user_id)).emit("receivedMessage", newMessage);
    }
  });

  // Middleware
  io.use(async (socket, next) => {
    const key = Number(socket.handshake.query.key);
    const device_id = Number(socket.handshake.query.device_id);

    if (!key || key === 0 || !device_id || device_id === 0) {
      return;
    } else {
      socket.join(key);

      if (!users[key]) {
        users[key] = [];
      }
      if (!devices[device_id]) {
        devices[device_id] = [];
      }
      users[key].push(socket.id);
      devices[device_id].push(socket.id);
      next();
      console.log(
        `user ${device_id} connected in ${key} with socket id ${socket.id}`
      );
      // const device = await prisma.def_linked_devices.findFirst({
      //   where: {
      //     id: device_id,
      //     user_id: key,
      //   },
      // });

      // if (device) {
      //   const currentSignon = device.signon_audit.find(
      //     (item) => item.signon_id === device.signon_id
      //   );

      //   const session = currentSignon.session_log;
      //   const updatedAudit = device.signon_audit.map((entry) => {
      //     if (entry.signon_id === device.signon_id) {
      //       return {
      //         ...entry,
      //         session_log: [
      //           {
      //             connect_time: new Date(),
      //             session_id: socket.id,
      //           },
      //           ...session,
      //         ],
      //       };
      //     }
      //     return entry;
      //   });

      //   const connectedDevice = await prisma.def_linked_devices.update({
      //     where: { id: device.id },
      //     data: {
      //       signon_audit: updatedAudit,
      //       is_online: true,
      //     },
      //   });

      //   io.to(Number(device.user_id)).emit("addDevice", connectedDevice);
      // }
    }
  });

  // Event Handlers
  io.on("connection", async (socket) => {
    socket.on(
      "sendMessage",
      async ({ notificationId, sender, recipients, type }) => {
        const notification = await prisma.def_notifications_v.findFirst({
          where: {
            notification_id: notificationId,
            user_id: Number(sender),
            sender: Number(sender),
          },
        });

        if (notification) {
          io.to(Number(sender)).emit("sentMessage", { notification, type });
        }

        for (const recipient of recipients) {
          const recievedNotification =
            await prisma.def_notifications_v.findFirst({
              where: {
                notification_id: notificationId,
                user_id: Number(recipient),
                recipient: true,
              },
            });

          await pub.publish(
            "NOTIFICATION-MESSAGES",
            JSON.stringify(recievedNotification)
          );
        }
      }
    );

    socket.on("sendDraft", async ({ notificationId, sender, type }) => {
      const notification = await prisma.def_notifications_v.findFirst({
        where: {
          notification_id: notificationId,
          user_id: Number(sender),
          sender: Number(sender),
          status: "DRAFT",
        },
      });
      io.to(Number(sender)).emit("draftMessage", { notification, type });
    });

    // socket.on("draftMsgId", ({ notificationId, sender }) => {
    //   io.to(Number(sender)).emit("draftMessageId", notificationId);
    // });

    socket.on("read", ({ parentID, sender }) => {
      io.to(Number(sender)).emit("sync", parentID);
    });

    socket.on("deleteMessage", async ({ notificationId, sender, type }) => {
      const notification = await prisma.def_notifications_v.findFirst({
        where: {
          user_id: Number(sender),
          notification_id: notificationId,
        },
      });
      io.to(Number(sender)).emit("deletedMessage", { notification, type });
    });

    socket.on("restoreMessage", async ({ notificationId, sender, type }) => {
      const notification = await prisma.def_notifications_v.findFirst({
        where: {
          user_id: Number(sender),
          notification_id: notificationId,
        },
      });

      io.to(Number(sender)).emit("restoreMessage", { notification, type });
    });

    socket.on("multipleDelete", async ({ ids, user, type }) => {
      for (const id of ids) {
        const notification = await prisma.def_notifications_v.findFirst({
          where: {
            user_id: Number(user),
            notification_id: id,
          },
        });
        io.to(Number(user)).emit("deletedMessage", { notification, type });
      }
    });

    // Device Action
    socket.on("addDevice", async ({ deviceId, userId }) => {
      const device = await prisma.def_linked_devices.findFirst({
        where: {
          id: deviceId,
          user_id: Number(userId),
        },
      });
      if (device) {
        io.to(Number(user)).emit("addDevice", device);
      }
    });

    socket.on("inactiveDevice", async ({ inactiveDevices, userId }) => {
      for (const item of inactiveDevices) {
        const device = await prisma.def_linked_devices.findFirst({
          where: {
            id: item.id,
            user_id: Number(userId),
          },
        });
        io.to(Number(userId)).emit("inactiveDevice", device);
      }
    });

    socket.on("SendAlert", async ({ alertId, recipients, isAcknowledge }) => {
      try {
        for (const recipient of recipients) {
          const alert = await prisma.def_alerts_v.findFirst({
            where: {
              user_id: Number(recipient),
              alert_id: Number(alertId),
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

    socket.on("disconnect", async () => {
      for (const deviceId in devices) {
        if (devices[deviceId].includes(socket.id)) {
          console.log(`user ${socket.id} device Id ${deviceId} disconnected `);

          const device = await prisma.def_linked_devices.findFirst({
            where: {
              id: Number(deviceId),
            },
          });

          if (device && device.signon_audit) {
            const audit = device.signon_audit;

            const updatedAudit = audit.map((entry) => {
              if (entry.signon_id === device.signon_id) {
                entry.session_log = entry.session_log.map((session) => {
                  if (session.session_id === socket.id) {
                    return {
                      ...session,
                      disconnect_time: new Date(),
                    };
                  }
                  return session;
                });
              }
              return entry;
            });

            const disconnectedDevice = await prisma.def_linked_devices.update({
              where: { id: device.id },
              data: { signon_audit: updatedAudit, is_online: false },
            });

            io.to(Number(device.user_id)).emit(
              "inactiveDevice",
              disconnectedDevice
            );
          }
        }
      }

      for (const key in users) {
        if (users[key].includes(socket.id)) {
          console.log(`user ${socket.id} disconnected from key ${key}`);
        }
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
      const device = await prisma.def_linked_devices.findFirst({
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
