const prisma = require("../DB/db.config");

/** create alerts */
exports.createAlert = async (req, res) => {
  try {
    const alertData = req.body;
    const { alert_name, description, created_by, last_updated_by } = alertData;
    const result = await prisma.def_alerts.create({
      data: {
        alert_name,
        description,
        created_by,
        last_updated_by,
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

/** update alert */
exports.updateAlert = async (req, res) => {
  try {
    const id = +req.params.alert_id;
    const alertData = req.body;
    const { alert_name, description, last_updated_by } = alertData;
    const result = await prisma.def_alerts.update({
      where: {
        alert_id: id,
      },
      data: {
        alert_name,
        description,
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
