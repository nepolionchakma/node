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
    socket.on(
      "sendMessage",
      async ({
        notification_id,
        notification_type,
        sender,
        recipients,
        subject,
        notification_body,
        status,
        creation_date,
        parent_notification_id,
        involved_users,
        readers,
        holders,
        recycle_bin,
        action_item_id,
        alert_id,
      }) => {
        console.log(
          "recieving event sendMessage in server",
          notification_id,
          sender
        );
        await pub.publish(
          "NOTIFICATION-MESSAGES",

          JSON.stringify({
            notification_id,
            sender,
            subject,
            creation_date,
            parent_notification_id,
            recipients,
          })
        );

        io.to(Number(sender)).emit("sentMessage", {
          notification_id,
          notification_type,
          sender,
          recipients,
          subject,
          notification_body,
          status,
          creation_date,
          parent_notification_id,
          involved_users,
          readers,
          holders,
          recycle_bin,
          action_item_id,
          alert_id,
        });
      }
    );

    socket.on(
      "sendDraft",
      ({
        notification_id,
        notification_type,
        sender,
        recipients,
        subject,
        notification_body,
        status,
        creation_date,
        parent_notification_id,
        involved_users,
        readers,
        holders,
        recycle_bin,
        action_item_id,
        alert_id,
      }) => {
        io.to(Number(sender)).emit("draftMessage", {
          notification_id,
          notification_type,
          sender,
          recipients,
          subject,
          notification_body,
          status,
          creation_date,
          parent_notification_id,
          involved_users,
          readers,
          holders,
          recycle_bin,
          action_item_id,
          alert_id,
        });
      }
    );

    socket.on("draftMsgId", ({ id, user }) => {
      io.to(Number(user)).emit("draftMessageId", id);
    });

    socket.on("read", ({ id, user }) => {
      io.to(Number(user)).emit("sync", id);
    });

    socket.on("deleteMessage", ({ id, user }) => {
      io.to(Number(user)).emit("deletedMessage", id);
    });

    socket.on("restoreMessage", ({ id, user }) => {
      io.to(Number(user)).emit("restoreMessage", id);
    });

    socket.on("multipleDelete", ({ ids, user }) => {
      for (const id of ids) {
        io.to(Number(user)).emit("deletedMessage", id);
      }
    });

    // Device Action
    socket.on(
      "addDevice",
      ({
        id,
        user_id,
        device_type,
        browser_name,
        browser_version,
        os,
        user_agent,
        added_at,
        is_active,
        ip_address,
        location,
        user,
        signon_audit,
      }) => {
        io.to(Number(user)).emit("addDevice", {
          id,
          user_id,
          device_type,
          browser_name,
          browser_version,
          os,
          user_agent,
          added_at,
          is_active,
          ip_address,
          location,
          user,
          signon_audit,
        });
      }
    );

    socket.on("inactiveDevice", ({ data, user }) => {
      for (const device of data) {
        io.to(Number(user)).emit("inactiveDevice", device);
      }
    });

    socket.on("SendAlert", async ({ alertId, recipients }) => {
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
          console.log(alert, "'SendAlert' socket event.");
          if (alert) {
            io.to(Number(recipient)).emit("SentAlert", alert);
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
