const prisma = require("../DB/db.config");
exports.getManageAccessModels = async (req, res) => {
  try {
    const result = await prisma.manage_access_models.findMany({
      //sorting desc
      orderBy: {
        manage_access_model_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageAccessModel = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_models.findUnique({
      where: {
        manage_access_model_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "Manage Access Model not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageAccessModel = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;
    const findExistModelName = await prisma.manage_access_models.findFirst({
      where: {
        model_name: data.model_name,
      },
    });
    if (!data.model_name) {
      return res.status(422).json({
        message: "model name is Required",
      });
    } else if (findExistModelName) {
      return res.status(408).json({ message: "Model name already exist." });
    }
    const resultAll = await prisma.manage_access_models.findMany();
    const maxId = Math.max(
      ...resultAll.map((item) => item.manage_access_model_id)
    );
    const dateToday = new Date().toLocaleDateString("en-CA");

    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_models.create({
      data: {
        manage_access_model_id: resultAll.length > 0 ? maxId + 1 : 1,
        model_name: data.model_name,
        description: data.description,
        type: data.type,
        run_status: data.run_status,
        state: data.state,
        last_run_date: dateToday,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
        last_updated_date: dateToday,
        revision: 0,
        revision_date: dateToday,
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
exports.updateManageAccessModel = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const findExistId = await prisma.manage_access_models.findFirst({
      where: {
        manage_access_model_id: id,
      },
    });
    const findExistModelName = await prisma.manage_access_models.findFirst({
      where: {
        model_name: data.model_name,
      },
    });
    if (!findExistId) {
      return res.status(404).json({
        message: "Manage Access Model not found",
      });
    }
    if (!data.model_name) {
      return res.status(422).json({
        message: "Manage Access Model name is Required",
      });
    } else if (findExistModelName) {
      return res
        .status(408)
        .json({ message: "Manage Access Model name already exist." });
    }
    const dateToday = new Date().toLocaleDateString("en-CA");

    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_models.update({
      where: {
        manage_access_model_id: id,
      },
      data: {
        manage_access_model_id: id,
        model_name: data.model_name,
        description: data.description,
        type: data.type,
        run_status: data.run_status,
        state: data.state,
        last_run_date: dateToday,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
        last_updated_date: dateToday,
        revision: findExistId.revision + 1,
        revision_date: dateToday,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.deleteManageAccessModel = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessModelId =
      await prisma.manage_access_models.findUnique({
        where: {
          manage_access_model_id: id,
        },
      });
    if (!findManageAccessModelId)
      return res
        .status(404)
        .json({ message: "Manage Access Model not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_access_models.delete({
      where: {
        manage_access_model_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
