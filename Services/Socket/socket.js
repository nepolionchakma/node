const { Redis } = require("ioredis");

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
      newMessage.recivers.forEach((reciver) => {
        io.to(reciver.name).emit("receivedMessage", newMessage);
      });
    }
  });

  // Middleware
  io.use((socket, next) => {
    const key = socket.handshake.query.key;

    if (!key || key === "undefined") {
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
  io.on("connection", (socket) => {
    socket.on(
      "sendMessage",
      async ({
        id,
        sender,
        recivers,
        subject,
        body,
        date,
        status,
        parentid,
        involvedusers,
        readers,
        holders,
        recyclebin,
      }) => {
        await pub.publish(
          "NOTIFICATION-MESSAGES",
          JSON.stringify({ id, sender, subject, date, parentid, recivers })
        );

        io.to(sender.name).emit("sentMessage", {
          id,
          sender,
          recivers,
          subject,
          body,
          date,
          status,
          parentid,
          involvedusers,
          readers,
          holders,
          recyclebin,
        });
      }
    );

    socket.on(
      "sendDraft",
      ({
        id,
        sender,
        recivers,
        subject,
        body,
        date,
        status,
        parentid,
        involvedusers,
        readers,
        holders,
        recyclebin,
      }) => {
        io.to(sender.name).emit("draftMessage", {
          id,
          sender,
          recivers,
          subject,
          body,
          date,
          status,
          parentid,
          involvedusers,
          readers,
          holders,
          recyclebin,
        });
      }
    );

    socket.on("draftMsgId", ({ id, user }) => {
      io.to(user).emit("draftMessageId", id);
    });

    socket.on("read", ({ id, user }) => {
      io.to(user).emit("sync", id);
    });

    socket.on("deleteMessage", ({ id, user }) => {
      io.to(user).emit("deletedMessage", id);
    });

    socket.on("restoreMessage", ({ id, user }) => {
      io.to(user).emit("restoreMessage", id);
    });

    socket.on("multipleDelete", ({ ids, user }) => {
      for (const id of ids) {
        io.to(user).emit("deletedMessage", id);
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
        io.to(user).emit("addDevice", {
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
      if (Array.isArray(data)) {
        for (const device of data) {
          io.to(user).emit("inactiveDevice", device);
        }
      } else {
        console.error("Expected an array, but got:", data);
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
  });
};
module.exports = socket;
