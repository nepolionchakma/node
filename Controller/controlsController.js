const prisma = require("../DB/db.config");
exports.getControles = async (req, res) => {
  try {
    const result = await prisma.controls.findMany({
      //sorting desc
      orderBy: {
        control_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueControle = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.controls.findUnique({
      where: {
        control_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Control not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createControle = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;
    const findExistControlName = await prisma.controls.findFirst({
      where: {
        control_name: data.control_name,
      },
    });
    if (!data.control_name) {
      return res.status(422).json({
        message: "Control name is Required",
      });
    } else if (findExistControlName) {
      return res.status(408).json({ message: "Control name already exist." });
    }
    const resultAll = await prisma.controls.findMany();
    const maxId = Math.max(...resultAll.map((item) => item.control_id));
    const dateToday = new Date().toLocaleDateString("en-CA");

    // Validation  End/---------------------------------/
    const result = await prisma.controls.create({
      data: {
        control_id: resultAll.length > 0 ? maxId + 1 : 19001,
        control_name: data.control_name,
        description: data.description,
        pending_results_count: data.pending_results_count,
        control_type: data.control_type,
        priority: data.priority,
        datasources: data.datasources,
        control_last_run: dateToday,
        control_last_updated: dateToday,
        status: data.status,
        state: data.state,
        result_investigator: data.result_investigator,
        authorized_data: data.authorized_data,
        revision: data.revision,
        revision_date: dateToday,
        created_by: data.created_by,
        created_date: dateToday,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateControle = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const findExistId = await prisma.controls.findFirst({
      where: {
        control_id: id,
      },
    });
    const findExistControlName = await prisma.controls.findFirst({
      where: {
        control_name: data.control_name,
      },
    });
    if (!findExistId) {
      return res.status(404).json({
        message: "Control not found",
      });
    }
    if (!data.control_name) {
      return res.status(422).json({
        message: "Control name is Required",
      });
    } else if (findExistControlName) {
      return res.status(408).json({ message: "Control name already exist." });
    }
    const dateToday = new Date().toLocaleDateString("en-CA");

    // Validation  End/---------------------------------/
    const result = await prisma.controls.update({
      where: {
        control_id: id,
      },
      data: {
        control_id: id,
        control_name: data.control_name,
        description: data.description,
        pending_results_count: data.pending_results_count,
        control_type: data.control_type,
        priority: data.priority,
        datasources: data.datasources,
        control_last_run: dateToday,
        control_last_updated: dateToday,
        status: data.status,
        state: data.state,
        result_investigator: data.result_investigator,
        authorized_data: data.authorized_data,
        revision: data.revision + 1,
        revision_date: dateToday,
        created_by: data.created_by,
        created_date: dateToday,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteControle = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findControleId = await prisma.controls.findUnique({
      where: {
        control_id: id,
      },
    });
    if (!findControleId)
      return res.status(404).json({ message: "Control not found." });

    // Validation  End/---------------------------------/
    await prisma.controls.delete({
      where: {
        control_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
