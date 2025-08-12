const prisma = require("../DB/db.config");

/** create recepients */
exports.createRecepients = async (req, res) => {
  try {
    const { alert_id, user_id, created_by, last_updated_by } = req.body;
    const result = await prisma.def_alert_recepients.create({
      data: {
        alert_id,
        user_id,
        created_by,
        last_updated_by,
        acknowledge: false,
      },
    });
    if (result) {
      return res.status(201).json({ result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get recepients */
exports.recepients = async (req, res) => {
  try {
    const result = await prisma.def_alert_recepients.findMany({
      orderBy: {
        creation_date: "desc",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** get Unique recepient */
exports.getUniqueRecepient = async (req, res) => {
  try {
    const { alert_id, user_id } = req.params;

    const result = await prisma.def_alert_recepients.findUnique({
      where: {
        alert_id_user_id: {
          alert_id: +alert_id,
          user_id: +user_id,
        },
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Recepient not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** update recepient */
exports.updateRecepient = async (req, res) => {
  try {
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
        last_updated_by: Number(user_id),
        acknowledge,
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
exports.removeRecepient = async (req, res) => {
  const { alert_id, user_id } = req.params;
  try {
    const result = await prisma.def_alert_recepients.delete({
      where: {
        alert_id_user_id: {
          alert_id,
          user_id,
        },
      },
    });
    if (result) {
      return res.status(200).json({ message: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
