const prisma = require("../DB/db.config");

/** create alerts */
exports.createAlert = async (req, res) => {
  const userId = Number(req.user.user_id);
  try {
    const { alert_name, description, recepients, notification_id, status } =
      req.body;

    let message = "";
    if (status === "SENT") {
      message = "Alert Sent";
    } else {
      message = "Alert saved to Drafts";
    }

    const result = await prisma.def_alerts.create({
      data: {
        alert_name,
        description,
        notification_id,
        created_by: userId,
        last_updated_by: userId,
      },
    });
    if (result) {
      for (const recepient of recepients) {
        await prisma.def_alert_recepients.create({
          data: {
            alert_id: result.alert_id,
            user_id: recepient,
            acknowledge: false,
            created_by: userId,
            last_updated_by: userId,
          },
        });
      }
      await prisma.def_notifications.update({
        where: {
          notification_id: result.notification_id,
        },
        data: {
          alert_id: result.alert_id,
        },
      });
      return res.status(201).json({ result, message });
    }

    // add recepients

    if (result) {
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get alerts from view pagination*/
exports.getAlerts = async (req, res) => {
  const { user_id, page, limit, alert_id } = req.query;

  try {
    const totalUnacknowledged = await prisma.def_alerts_v.findMany({
      where: {
        user_id: Number(user_id),
        acknowledge: false,
        notification_status: "SENT",
      },
    });
    const totalUnacknowledgedCount = await prisma.def_alerts_v.count({
      where: {
        user_id: Number(user_id),
        acknowledge: false,
        notification_status: "SENT",
      },
    });
    const total = await prisma.def_alerts_v.count({
      where: {
        user_id: Number(user_id),
        notification_status: "SENT",
      },
    });

    if (alert_id) {
      const result = await prisma.def_alerts.findFirst({
        where: {
          alert_id: Number(alert_id),
        },
      });
      return res.status(200).json({ result });
    }

    if (page && limit) {
      const result = await prisma.def_alerts_v.findMany({
        where: {
          user_id: Number(user_id),
          notification_status: "SENT",
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
        total: totalUnacknowledgedCount,
        result: totalUnacknowledged,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** update alert */
exports.updateAlert = async (req, res) => {
  const userId = Number(req.user.user_id);
  const alert_id = Number(req.params.alert_id);
  const { alert_name, description, recipients = [], status } = req.body;
  try {
    let message = "";
    if (status === "SENT") {
      message = "Alert Sent";
    } else {
      message = "Alert saved to Drafts";
    }
    // Update alert info
    const result = await prisma.def_alerts.update({
      where: { alert_id },
      data: {
        alert_name,
        description,
        last_updated_by: userId,
      },
    });

    if (result && recipients) {
      for (const user of recipients) {
        await prisma.def_alert_recepients.upsert({
          where: {
            alert_id_user_id: {
              alert_id: alert_id,
              user_id: Number(user),
            },
          },
          update: {
            last_update_date: new Date(),
            last_updated_by: Number(userId),
          },

          create: {
            alert_id: alert_id,
            user_id: user,
            acknowledge: false,
            created_by: Number(userId),
            last_updated_by: Number(userId),
          },
        });
      }

      const existingRecipients = await prisma.def_alert_recepients.findMany({
        where: { alert_id: alert_id },
      });

      const toDelete = existingRecipients.filter(
        (user) => !recipients.includes(user.user_id)
      );
      console.log(toDelete);
      if (toDelete.length > 0) {
        await prisma.def_alert_recepients.deleteMany({
          where: {
            alert_id: alert_id,
            user_id: { in: toDelete.map((alert) => alert.user_id) },
          },
        });
      }
      return res.status(200).json({ result, message });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

/** delete alert */
exports.removeAlert = async (req, res) => {
  const id = +req.params.alert_id;
  try {
    const deleteAlertsAssignment = await prisma.def_alert_recepients.deleteMany(
      {
        where: {
          alert_id: id,
        },
      }
    );
    if (deleteAlertsAssignment) {
      const result = await prisma.def_alerts.delete({
        where: {
          alert_id: id,
        },
      });
      if (result) {
        await prisma.def_notifications.updateMany({
          where: {
            notification_id: result.notification_id,
          },
          data: {
            alert_id: null,
          },
        });
        return res.status(200).json({ message: "Deleted Successfully" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** update recepient */
exports.updateAcknowledge = async (req, res) => {
  try {
    const userId = Number(req.user.user_id);
    const { alert_id, user_id } = req.params;
    const { acknowledge } = req.body;
    const result = await prisma.def_alert_recepients.update({
      where: {
        alert_id_user_id: {
          alert_id: Number(alert_id),
          user_id: Number(user_id),
        },
      },
      data: {
        last_updated_by: userId,
        last_update_date: new Date(),
        acknowledge,
      },
    });
    if (result) {
      return res.status(200).json({ result, message: "Alert acknowledged." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get alerts from view */
// exports.getAlertsFromView = async (req, res) => {
//   try {
//     const alerts = await prisma.def_alerts_v.findMany({
//       orderBy: {
//         creation_date: "desc",
//       },
//     });

//     return res.status(200).json(alerts);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

/** get Unique alert */
// exports.getUniqueAlert = async (req, res) => {
//   try {
//     const id = +req.params.alert_id;
//     const result = await prisma.def_alerts.findUnique({
//       where: {
//         alert_id: id,
//       },
//     });
//     if (result) {
//       return res.status(200).json(result);
//     } else {
//       return res.status(404).json({ message: "Alert not found." });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

/** get Unique alert from view */
// exports.getUniqueAlertFromView = async (req, res) => {
//   try {
//     const id = req.params.alert_id;
//     const result = await prisma.def_alerts_v.findUnique({
//       where: {
//         alert_id: id,
//       },
//     });
//     if (result) {
//       return res.status(200).json(result);
//     } else {
//       return res.status(404).json({ message: "Alert not found." });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

/** get alerts */
// exports.getAlerts = async (req, res) => {
//   try {
//     const alerts = await prisma.def_alerts.findMany({
//       orderBy: {
//         creation_date: "desc",
//       },
//     });

//     return res.status(200).json(alerts);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

/**get Total alerts from view */
// exports.getTotalAlerts = async (req, res) => {
//   const id = +req.params.user_id;

//   try {
//     const result = await prisma.def_alerts_v.findMany({
//       where: {
//         user_id: id,
//         acknowledge: false,
//         notification_status: "SENT",
//       },
//     });

//     if (result) {
//       return res.status(200).json(result);
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
