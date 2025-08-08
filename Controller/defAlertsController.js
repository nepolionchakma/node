const prisma = require("../DB/db.config");

/** create alerts */
exports.createAlert = async (req, res) => {
  try {
    const {
      alert_name,
      description,
      readers,
      notification_id,
      created_by,
      last_updated_by,
    } = req.body;
    const result = await prisma.def_alerts.create({
      data: {
        alert_name,
        description,
        readers,
        notification_id,
        created_by,
        last_updated_by,
      },
    });
    // add recepients
    await prisma.def_alert_recepients.create({
      data: {
        alert_id: result.alert_id,
        user_id: result.user_id,
        created_by: result.created_by,
        last_updated_by: result.last_updated_by,
      },
    });
    if (result) {
      return res.status(201).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get alerts */
exports.alerts = async (req, res) => {
  try {
    const alerts = await prisma.def_alerts.findMany({
      orderBy: {
        creation_date: "desc",
      },
    });

    return res.status(200).json(alerts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get alerts from view */
exports.getAlertsFromView = async (req, res) => {
  try {
    const alerts = await prisma.def_alerts_v.findMany({
      orderBy: {
        creation_date: "desc",
      },
    });

    return res.status(200).json(alerts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**get Total alerts from view */
exports.getTotalAlerts = async (req, res) => {
  const id = +req.params.user_id;

  try {
    const result = await prisma.def_alerts_v.findMany({
      where: {
        readers: {
          array_contains: id,
        },
      },
    });

    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get alerts from view pagination*/
exports.getAlertsFromViewPagination = async (req, res) => {
  const user_id = Number(req.params.user_id);
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const alerts = await prisma.def_alerts_v.findMany({
      take: limit,
      skip: offset,
      where: {
        user_id,
      },
      orderBy: {
        creation_date: "desc",
      },
    });

    return res.status(200).json(alerts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get Unique alert */
exports.getUniqueAlert = async (req, res) => {
  try {
    const id = +req.params.alert_id;
    const result = await prisma.def_alerts.findUnique({
      where: {
        alert_id: id,
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Alert not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
/** get Unique alert from view */
exports.getUniqueAlertFromView = async (req, res) => {
  try {
    const id = req.params.alert_id;
    const result = await prisma.def_alerts_v.findUnique({
      where: {
        alert_id: id,
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Alert not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** update alert */
exports.updateAlert = async (req, res) => {
  try {
    const id = Number(req.params.alert_id);
    const {
      alert_name,
      description,
      readers,
      notification_id,
      last_updated_by,
    } = req.body;
    const isAvailable = await prisma.def_alerts.findUnique({
      where: {
        alert_id: id,
      },
    });
    const result = await prisma.def_alerts.update({
      where: {
        alert_id: id,
      },
      data: {
        alert_name,
        description,
        readers: [...isAvailable.readers, readers],
        notification_id,
        last_updated_by,
        last_update_date: new Date(),
      },
    });
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** delete alert */
exports.removeAlert = async (req, res) => {
  const id = +req.params.alert_id;
  try {
    const result = await prisma.def_alerts.delete({
      where: {
        alert_id: id,
      },
    });
    if (result) {
      return res.status(200).json({ message: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
