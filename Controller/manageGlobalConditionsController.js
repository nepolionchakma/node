const prisma = require("../DB/db.config");
exports.getManageGlobalConditions = async (req, res) => {
  try {
    const result = await prisma.manage_global_conditions.findMany({
      //sorting desc
      orderBy: {
        manage_global_condition_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageGlobalCondition = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_global_conditions.findUnique({
      where: {
        manage_global_condition_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "Manage Global Condition Data not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageGlobalCondition = async (req, res) => {
  try {
    const response = await prisma.manage_global_conditions.findMany();
    const id = Math.max(
      ...response.map((item) => item.manage_global_condition_id)
    );
    console.log(response);
    console.log(id);
    // Validation  START/---------------------------------/
    const data = req.body;

    const findManageGlobalCondition =
      await prisma.manage_global_conditions.findFirst({
        where: {
          name: data.name,
        },
      });
    if (findManageGlobalCondition)
      return res
        .status(408)
        .json({ message: "ManageGlobalCondition Name already exist." });
    if (!data.name) {
      return res.status(422).json({
        message: "ManageGlobalCondition name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_conditions.create({
      data: {
        manage_global_condition_id: response.length > 0 ? id + 1 : 1,
        name: data.name,
        datasource: data.datasource,
        description: data.description,
        status: data.status,
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
exports.updateManageGlobalCondition = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findExistId = await prisma.manage_global_conditions.findFirst({
      where: {
        manage_global_condition_id: id,
      },
    });
    const findExistName = await prisma.manage_global_conditions.findFirst({
      where: {
        name: data.name,
      },
    });
    if (!findExistId) {
      return res.status(404).json({
        message: "ManageGlobalCondition not found",
      });
    }
    if (!data.name || !data.description) {
      return res.status(422).json({
        message: "ManageGlobalCondition name and description is Required",
      });
    }
    // else if (findExistName) {
    //   return res
    //     .status(408)
    //     .json({ message: "ManageGlobalCondition name already exist." });
    // }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_conditions.update({
      where: {
        manage_global_condition_id: id,
      },
      data: {
        manage_global_condition_id: id,
        name: data.name,
        datasource: data.datasource,
        description: data.description,
        status: data.status,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteManageGlobalCondition = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageGlobalConditionId =
      await prisma.manage_global_conditions.findUnique({
        where: {
          manage_global_condition_id: id,
        },
      });
    if (!findManageGlobalConditionId)
      return res
        .status(404)
        .json({ message: "ManageGlobalCondition data not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_global_conditions.delete({
      where: {
        manage_global_condition_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
