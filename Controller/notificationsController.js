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

exports.getReplyNotifications = async (req, res) => {
  try {
    const { parentId, userId } = req.params;
    const result = await prisma.def_notifications.findMany({
      where: {
        parent_notification_id: parentId,
        holders: {
          array_contains: Number(userId),
        },
        status: "Sent",
      },
      orderBy: {
        creation_date: "desc",
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "MessageID not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
