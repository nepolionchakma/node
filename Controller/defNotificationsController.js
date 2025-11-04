const prisma = require("../DB/db.config");

exports.getUniqueNotification = async (req, res) => {
  try {
    const { user_id, notification_id } = req.query;
    const result = await prisma.def_notifications_v.findFirst({
      where: {
        user_id: Number(user_id),
        notification_id,
      },
    });
    if (result) {
      return res.status(200).json({ result });
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
    const userId = Number(req.user.user_id);
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
        sender: Number(sender),
        recipients: recipients,
        subject: subject,
        notification_body: notification_body,
        status: status,
        parent_notification_id: parent_notification_id,
        involved_users: involved_users,
        action_item_id: action_item_id,
        alert_id: alert_id,
      },
    });
    if (result) {
      for (const user of involved_users) {
        await prisma.def_notification_holders.create({
          data: {
            notification_id: notification_id,
            user_id: Number(user),
            recipient: recipients.includes(user) ? true : false,
            reader: readers.includes(user) ? true : false,
            holder: holders.includes(user) ? true : false,
            recycle_bin: recycle_bin.includes(user) ? true : false,
            created_by: Number(userId),
            last_updated_by: Number(userId),
          },
        });
      }
      return res.status(201).json({ result, message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getReplyNotifications = async (req, res) => {
  try {
    const { parent_notification_id } = req.query;
    const result = await prisma.def_notifications_v.findMany({
      where: {
        parent_notification_id: parent_notification_id,
        holder: true,
        status: "SENT",
        user_id: {
          equals: prisma.def_notifications_v.fields.sender,
        },
      },
      orderBy: {
        creation_date: "desc",
      },
    });
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res.status(404).json({ message: "Notification not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecievedNotifications = async (req, res) => {
  const { user_id, page, limit } = req.query;
  try {
    const total = await prisma.def_notifications_v.count({
      where: {
        status: "SENT",
        user_id: Number(user_id),
        recipient: true,
        holder: true,
      },
    });

    if (page || limit) {
      const result = await prisma.def_notifications_v.findMany({
        where: {
          status: "SENT",
          user_id: Number(user_id),
          recipient: true,
          holder: true,
        },
        orderBy: {
          creation_date: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      return res.status(200).json({
        result,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } else {
      return res.status(200).json({
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSentNotifications = async (req, res) => {
  try {
    const { user_id, page, limit } = req.query;

    const total = await prisma.def_notifications_v.count({
      where: {
        status: "SENT",
        user_id: Number(user_id),
        sender: Number(user_id),
        holder: true,
      },
    });

    if (page || limit) {
      const result = await prisma.def_notifications_v.findMany({
        where: {
          status: "SENT",
          user_id: Number(user_id),
          sender: Number(user_id),
          holder: true,
        },
        orderBy: {
          creation_date: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      return res.status(200).json({
        result,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } else {
      return res.status(200).json({
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDraftNotifications = async (req, res) => {
  try {
    const { user_id, page, limit } = req.query;
    const total = await prisma.def_notifications_v.count({
      where: {
        status: "DRAFT",
        user_id: Number(user_id),
        sender: Number(user_id),
        holder: true,
      },
    });
    if (page || limit) {
      const result = await prisma.def_notifications_v.findMany({
        where: {
          status: "DRAFT",
          user_id: Number(user_id),
          sender: Number(user_id),
          holder: true,
        },
        orderBy: {
          creation_date: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      return res.status(200).json({
        result,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } else {
      return res.status(200).json({
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getRecycleBinNotifications = async (req, res) => {
  try {
    const { user_id, page, limit } = req.query;
    const total = await prisma.def_notifications_v.count({
      where: {
        user_id: Number(user_id),
        recycle_bin: true,
      },
    });
    if (page || limit) {
      const result = await prisma.def_notifications_v.findMany({
        where: {
          user_id: Number(user_id),
          recycle_bin: true,
        },
        orderBy: {
          creation_date: "desc",
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      return res.status(200).json({
        result,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } else {
      return res.status(200).json({
        total,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await prisma.def_notifications_v.findMany({
      where: {
        user_id: Number(user_id),
        reader: true,
        status: "SENT",
        holder: true,
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    if (result) {
      return res.status(200).json({ result });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateReaders = async (req, res) => {
  const { parent_notification_id, user_id } = req.query;

  try {
    const userId = Number(req.user.user_id);

    const messagesToUpdate = await prisma.def_notifications_v.findMany({
      where: {
        parent_notification_id: parent_notification_id,
        user_id: Number(user_id),
      },
    });

    for (const message of messagesToUpdate) {
      await prisma.def_notification_holders.update({
        where: {
          notification_id_user_id: {
            notification_id: message.notification_id,
            user_id: Number(user_id),
          },
        },
        data: {
          reader: false,
          last_update_date: new Date(),
          last_updated_by: Number(userId),
        },
      });
    }

    res.status(200).json({
      message: "Readers field updated successfully.",
      result: messagesToUpdate,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.moveToRecycleBin = async (req, res) => {
  const { notification_id, user_id } = req.query;

  try {
    const userId = Number(req.user.user_id);

    const messageToUpdate = await prisma.def_notification_holders.update({
      where: {
        notification_id_user_id: {
          notification_id: notification_id,
          user_id: Number(user_id),
        },
        holder: true,
      },
      data: {
        holder: false,
        recycle_bin: true,
        last_update_date: new Date(),
        last_updated_by: Number(userId),
      },
    });

    return res
      .status(200)
      .json({ message: "Moved to Recycle Bin.", result: messageToUpdate });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.restoreNotification = async (req, res) => {
  const { notification_id, user_id } = req.query;

  try {
    const userId = Number(req.user.user_id);

    const result = await prisma.def_notification_holders.update({
      where: {
        notification_id_user_id: {
          notification_id: notification_id,
          user_id: Number(user_id),
        },
        recycle_bin: true,
      },
      data: {
        recycle_bin: false,
        holder: true,
        last_update_date: new Date(),
        last_updated_by: Number(userId),
      },
    });

    return res.status(200).json({ result, message: "Notification Restored." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.removeFromRecycleBin = async (req, res) => {
  const { notification_id, user_id } = req.query;

  try {
    const userId = Number(req.user.user_id);

    const result = await prisma.def_notification_holders.update({
      where: {
        notification_id_user_id: {
          notification_id: notification_id,
          user_id: Number(user_id),
        },
        recycle_bin: true,
      },
      data: {
        recycle_bin: false,
        last_update_date: new Date(),
        last_updated_by: Number(userId),
      },
    });

    // if (result.holders.length === 0 && result.recycle_bin.length === 0) {
    //   targettedNotification.status = "DELETED";
    //   const res1 = await prisma.def_notifications.update({
    //     where: {
    //       notification_id: targettedNotification.notification_id,
    //     },
    //     data: targettedNotification,
    //   });

    //   return res
    //     .status(200)
    //     .json({ result: res1, message: "Notification Deleted." });
    // }

    return res.status(200).json({ result, message: "Notification Deleted." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.moveMultipleToRecycleBin = async (req, res) => {
  const { ids } = req.body;
  const { userId } = req.params;

  try {
    const user_id = Number(req.user.user_id);
    const result = await prisma.def_notification_holders.updateMany({
      where: {
        notification_id: { in: ids },
        user_id: Number(userId),
        holder: true,
      },
      data: {
        holder: false,
        recycle_bin: true,
        last_update_date: new Date(),
        last_updated_by: Number(user_id),
      },
    });

    res.status(200).json({ message: "Moved to Recycle Bin.", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.removeMultipleFromRecycleBin = async (req, res) => {
  const { ids } = req.body;
  const { userId } = req.params;
  const user_id = Number(req.user.user_id);

  try {
    const result = await prisma.def_notification_holders.update({
      where: {
        notification_id: { in: ids },
        user_id: Number(userId),
        holder: true,
        recycle_bin: true,
      },
      data: {
        recycle_bin: false,
        last_update_date: new Date(),
        last_updated_by: user_id,
      },
    });

    // for (const message of messagesToUpdate) {
    //   const updatedRecycle = message.recycle_bin.filter(
    //     (usr) => usr !== Number(userId)
    //   );

    //   const updatedMessage = await prisma.def_notifications.update({
    //     where: {
    //       notification_id: message.notification_id,
    //     },
    //     data: {
    //       recycle_bin: updatedRecycle,
    //     },
    //   });

    //   if (
    //     updatedMessage.holders.length === 0 &&
    //     updatedMessage.recycle_bin.length === 0
    //   ) {
    //     await prisma.def_notifications.update({
    //       where: {
    //         notification_id: updatedMessage.notification_id,
    //       },
    //       data: {
    //         status: "DELETED",
    //       },
    //     });
    //   }
    // }

    res.status(200).json({ message: "Notification Deleted.", result });
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
      parent_notification_id,
      involved_users = [],
      readers,
      holders,
      recycle_bin,
      action_item_id,
      alert_id,
    } = req.body;
    const { notificationId } = req.params;

    const userId = Number(req.user.user_id);
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
        sender: Number(sender),
        recipients: recipients,
        subject: subject,
        notification_body: notification_body,
        status: status,
        parent_notification_id: parent_notification_id,
        involved_users: involved_users,
        action_item_id: action_item_id,
        alert_id: alert_id,
      },
    });
    if (result && involved_users) {
      for (const user of involved_users) {
        await prisma.def_notification_holders.upsert({
          where: {
            notification_id_user_id: {
              notification_id: notificationId,
              user_id: Number(user),
            },
          },
          update: {
            recipient: recipients.includes(user) ? true : false,
            reader: readers.includes(user) ? true : false,
            holder: holders.includes(user) ? true : false,
            recycle_bin: recycle_bin.includes(user) ? true : false,
            last_update_date: new Date(),
            last_updated_by: Number(userId),
          },

          create: {
            notification_id: notificationId,
            user_id: Number(user),
            recipient: recipients.includes(user) ? true : false,
            reader: readers.includes(user) ? true : false,
            holder: holders.includes(user) ? true : false,
            recycle_bin: recycle_bin.includes(user) ? true : false,
            created_by: Number(userId),
            last_updated_by: Number(userId),
          },
        });
      }

      const existingHolders = await prisma.def_notification_holders.findMany({
        where: { notification_id: notificationId },
      });

      const toDelete = existingHolders.filter(
        (user) => !involved_users.includes(user.user_id)
      );

      if (toDelete.length > 0) {
        await prisma.def_notification_holders.deleteMany({
          where: {
            notification_id: notificationId,
            user_id: {
              in: toDelete.map((notification) => notification.user_id),
            },
          },
        });
      }
      return res.status(200).json({ result, message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const result = await prisma.def_notifications.delete({
      where: {
        notification_id: notificationId,
      },
    });

    // const childNotifications = await prisma.def_notifications.findMany({
    //   where: {
    //     parent_notification_id: notificationId,
    //   },
    // });

    // if (childNotifications.length > 1) {
    //   for (const notification of childNotifications) {
    //     await prisma.def_notifications.delete({
    //       where: {
    //         notification_id: notification.notification_id,
    //       },
    //     });
    //   }
    // } else {
    //   await prisma.def_notifications.delete({
    //     where: {
    //       notification_id: notificationId,
    //     },
    //   });
    // }
    if (result) {
      console.log(result);
      return res.status(200).json({ message: `Notification deleted.` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
