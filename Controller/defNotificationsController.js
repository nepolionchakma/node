const prisma = require("../DB/db.config");

exports.getAllNotification = async (req, res) => {
  try {
    const notifications = await prisma.def_notifications.findMany({
      orderBy: {
        creation_date: "desc",
      },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUniqueNotification = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.def_notifications.findUnique({
      where: {
        notification_id: id,
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Message not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  let message = "";

  try {
    const {
      notification_id,
      notification_type,
      sender,
      recipients,
      subject,
      notification_body,
      status,
      parent_notification_id,
      involved_users,
      readers,
      holders,
      recycle_bin,
      action_item_id,
      alert_id,
    } = req.body;
    if (status === "SENT") {
      message = "Notification Sent";
    } else if (status === "DRAFT") {
      message = "Notification saved to Drafts";
    }
    const result = await prisma.def_notifications.create({
      data: {
        notification_id: notification_id,
        notification_type: notification_type,
        sender: sender,
        recipients: recipients,
        subject: subject,
        notification_body: notification_body,
        status: status,
        parent_notification_id: parent_notification_id,
        involved_users: involved_users,
        readers: readers,
        holders: holders,
        recycle_bin: recycle_bin,
        action_item_id: action_item_id,
        alert_id: alert_id,
      },
    });
    if (result) {
      return res.status(201).json({ result, message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateNotification = async (req, res) => {
  let message = "";
  try {
    const {
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
    } = req.body;
    const { notificationId } = req.params;
    if (status === "SENT") {
      message = "Notification Sent";
    } else if (status === "DRAFT") {
      message = "Notification saved to Drafts";
    }

    const result = await prisma.def_notifications.update({
      where: {
        notification_id: notificationId,
      },

      data: {
        notification_id: notificationId,
        notification_type: notification_type,
        sender: sender,
        recipients: recipients,
        subject: subject,
        notification_body: notification_body,
        status: status,
        parent_notification_id: parent_notification_id,
        involved_users: involved_users,
        readers: readers,
        holders: holders,
        recycle_bin: recycle_bin,
        action_item_id: action_item_id,
        alert_id: alert_id,
        creation_date,
      },
    });
    if (result) {
      return res.status(200).json({ result, message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const childNotifications = await prisma.def_notifications.findMany({
      where: {
        parent_notification_id: notificationId,
      },
    });

    if (childNotifications.length > 1) {
      for (const notification of childNotifications) {
        await prisma.def_notifications.delete({
          where: {
            notification_id: notification.notification_id,
          },
        });
      }
    } else {
      await prisma.def_notifications.delete({
        where: {
          notification_id: notificationId,
        },
      });
    }

    return res.status(200).json({ message: `Notification deleted.` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReplyNotifications = async (req, res) => {
  try {
    const { parentId, userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        parent_notification_id: parentId,
        holders: {
          array_contains: Number(userId),
        },
        status: "SENT",
      },
      orderBy: {
        creation_date: "desc",
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Notification not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecievedNotifications = async (req, res) => {
  try {
    const { userId, page, limit } = req.params;
    const pageNumber = parseInt(page);

    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.def_notifications.findMany({
      where: {
        status: "SENT",
        recipients: {
          array_contains: Number(userId),
        },
        holders: {
          array_contains: Number(userId),
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    if (result) {
      const limitedMessages = result.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalRecievedNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await prisma.def_notifications.findMany({
      where: {
        recipients: {
          array_contains: Number(userId),
        },
        status: "SENT",
        holders: {
          array_contains: Number(userId),
        },
      },
    });

    if (result) {
      return res.status(200).json({ total: result.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSentNotifications = async (req, res) => {
  try {
    const { userId, page, limit } = req.params;
    const pageNumber = parseInt(page);

    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.def_notifications.findMany({
      where: {
        sender: Number(userId),
        status: "SENT",
        holders: {
          array_contains: Number(userId),
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    if (result) {
      const limitedMessages = result.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalSentNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        sender: Number(userId),
        status: "SENT",
        holders: {
          array_contains: Number(userId),
        },
      },
    });

    if (result) {
      return res.status(200).json({ total: result.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDraftNotifications = async (req, res) => {
  try {
    const { userId, page, limit } = req.params;
    const pageNumber = parseInt(page);

    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.def_notifications.findMany({
      where: {
        sender: Number(userId),
        status: "DRAFT",
        holders: {
          array_contains: Number(userId),
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    if (result) {
      const limitedMessages = result.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalDraftNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        sender: Number(userId),
        status: "DRAFT",
        holders: {
          array_contains: Number(userId),
        },
      },
    });

    if (result) {
      return res.status(200).json({ total: result.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecycleBinNotifications = async (req, res) => {
  try {
    const { userId, page, limit } = req.params;
    const pageNumber = parseInt(page);

    let startNumber = 0;
    const endNumber = pageNumber * limit;
    if (pageNumber > 1) {
      const pageInto = pageNumber - 1;
      startNumber = pageInto * limit;
    }
    const result = await prisma.def_notifications.findMany({
      where: {
        recycle_bin: {
          array_contains: Number(userId),
        },
      },
    });

    if (result) {
      const limitedMessages = result.slice(startNumber, endNumber);
      return res.status(200).json(limitedMessages);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getTotalRecycleBinNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        recycle_bin: {
          array_contains: Number(userId),
        },
      },
    });
    if (result) {
      return res.status(200).json({ total: result.length });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        readers: {
          array_contains: Number(userId),
        },
        status: "SENT",
        holders: {
          array_contains: Number(userId),
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateReaders = async (req, res) => {
  const { parentId, userId } = req.params;

  try {
    const messagesToUpdate = await prisma.def_notifications.findMany({
      where: {
        parent_notification_id: parentId,
      },
    });

    for (const message of messagesToUpdate) {
      const updatedReaders = message.readers.filter(
        (reader) => reader !== Number(userId)
      );
      await prisma.def_notifications.update({
        where: {
          notification_id: message.notification_id,
        },
        data: {
          readers: updatedReaders,
        },
      });
    }

    res.status(200).json({ message: "Readers field updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.moveToRecycleBin = async (req, res) => {
  const { notificationId, userId } = req.params;

  try {
    const messagesToUpdate = await prisma.def_notifications.findUnique({
      where: {
        notification_id: notificationId,
        holders: {
          array_contains: Number(userId),
        },
      },
    });
    messagesToUpdate.holders = messagesToUpdate.holders.filter(
      (holder) => holder !== Number(userId)
    );

    messagesToUpdate.recycle_bin.push(Number(userId));

    await prisma.def_notifications.update({
      where: {
        notification_id: notificationId,
      },
      data: messagesToUpdate,
    });

    return res.status(200).json({ message: "Moved to Recycle Bin." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.restoreNotification = async (req, res) => {
  const { notificationId, userId } = req.params;

  try {
    const messagesToUpdate = await prisma.def_notifications.findUnique({
      where: {
        notification_id: notificationId,
        recycle_bin: {
          array_contains: Number(userId),
        },
      },
    });
    messagesToUpdate.recycle_bin = messagesToUpdate.recycle_bin.filter(
      (usr) => usr !== Number(userId)
    );

    messagesToUpdate.holders.push(Number(userId));

    const result = await prisma.def_notifications.update({
      where: {
        notification_id: notificationId,
      },
      data: messagesToUpdate,
    });

    return res.status(200).json({ result, message: "Notification Restored." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.removeFromRecycleBin = async (req, res) => {
  const { notificationId, userId } = req.params;

  try {
    const targettedNotification = await prisma.def_notifications.findUnique({
      where: {
        notification_id: notificationId,
        recycle_bin: {
          array_contains: Number(userId),
        },
      },
    });

    targettedNotification.recycle_bin =
      targettedNotification.recycle_bin.filter(
        (recycleuser) => recycleuser !== Number(userId)
      );
    const result = await prisma.def_notifications.update({
      where: {
        notification_id: targettedNotification.notification_id,
      },
      data: targettedNotification,
    });

    if (result.holders.length === 0 && result.recycle_bin.length === 0) {
      targettedNotification.status = "DELETED";
      const res1 = await prisma.def_notifications.update({
        where: {
          notification_id: targettedNotification.notification_id,
        },
        data: targettedNotification,
      });

      return res
        .status(200)
        .json({ result: res1, message: "Notification Deleted." });
    }

    return res.status(200).json({ result, message: "Notification Deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.moveMultipleToRecycleBin = async (req, res) => {
  const { ids } = req.body;
  const { userId } = req.params;

  try {
    const messagesToUpdate = await prisma.def_notifications.findMany({
      where: {
        notification_id: { in: ids },
      },
    });

    for (const message of messagesToUpdate) {
      const updatedHolders = message.holders.filter(
        (usr) => usr !== Number(userId)
      );
      const recyclbin = message.recycle_bin;

      await prisma.def_notifications.update({
        where: {
          notification_id: message.notification_id,
        },
        data: {
          holders: updatedHolders,
          recycle_bin: [Number(userId), ...recyclbin],
        },
      });
    }

    res.status(200).json({ message: "Moved to Recycle Bin." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.moveMultipleFromRecycleBin = async (req, res) => {
  const { ids } = req.body;
  const { userId } = req.params;

  try {
    const messagesToUpdate = await prisma.def_notifications.findMany({
      where: {
        notification_id: { in: ids },
      },
    });

    for (const message of messagesToUpdate) {
      const updatedRecycle = message.recycle_bin.filter(
        (usr) => usr !== Number(userId)
      );

      const updatedMessage = await prisma.def_notifications.update({
        where: {
          notification_id: message.notification_id,
        },
        data: {
          recycle_bin: updatedRecycle,
        },
      });

      if (
        updatedMessage.holders.length === 0 &&
        updatedMessage.recycle_bin.length === 0
      ) {
        await prisma.def_notifications.update({
          where: {
            notification_id: updatedMessage.notification_id,
          },
          data: {
            status: "DELETED",
          },
        });
      }
    }

    res.status(200).json({ message: "Notification Deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
