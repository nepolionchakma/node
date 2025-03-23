const prisma = require("../DB/db.config");
exports.getManageGlobalConditionLogics = async (req, res) => {
  try {
    const result = await prisma.manage_global_condition_logics.findMany({
      //sorting desc
      orderBy: {
        manage_global_condition_logic_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageGlobalConditionLogic = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_global_condition_logics.findUnique({
      where: {
        manage_global_condition_logic_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "ManageGlobalConditionLogic not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageGlobalConditionLogic = async (req, res) => {
  try {
    const response = await prisma.manage_global_condition_logics.findMany();
    const id = Math.max(
      ...response.map((item) => item.manage_global_condition_logic_id)
    );
    // Validation  START/---------------------------------/
    const data = req.body;
    const findExistObject =
      await prisma.manage_global_condition_logics.findFirst({
        where: {
          object: data.object,
        },
      });
    if (!data.object) {
      return res.status(422).json({
        message: "ManageGlobalCondition object is Required",
      });
    } else if (findExistObject) {
      return res.status(408).json({ message: "Object already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_condition_logics.create({
      data: {
        manage_global_condition_logic_id: response.length > 0 ? id + 1 : 1,
        manage_global_condition_id: data.manage_global_condition_id,
        object: data.object,
        attribute: data.attribute,
        condition: data.condition,
        value: data.value,
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
exports.updateManageGlobalConditionLogic = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const findExistId = await prisma.manage_global_condition_logics.findFirst({
      where: {
        manage_global_condition_logic_id: id,
      },
    });
    const findExistObject =
      await prisma.manage_global_condition_logics.findFirst({
        where: {
          object: data.object,
        },
      });
    if (!findExistId) {
      return res.status(404).json({
        message: "ManageGlobalConditionLogic not found",
      });
    }
    if (!data.object) {
      return res.status(422).json({
        message: "ManageGlobalConditionLogic object is Required",
      });
    } else if (findExistObject) {
      return res
        .status(408)
        .json({ message: "ManageGlobalConditionLogic Object already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_condition_logics.update({
      where: {
        manage_global_condition_logic_id: id,
      },
      data: {
        manage_global_condition_logic_id: id,
        manage_global_condition_id: data.manage_global_condition_id,
        object: data.object,
        attribute: data.attribute,
        condition: data.condition,
        value: data.value,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertManageGlobalConditionLogic = async (req, res) => {
  const data = req.body.upsertLogics || req.body;
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }
  const response = await prisma.manage_global_condition_logics.findMany();
  const id = Math.max(
    ...response.map((item) => item.manage_global_condition_logic_id)
  );
  const upsertResults = [];
  try {
    for (const item of data) {
      const result = await prisma.manage_global_condition_logics.upsert({
        where: {
          manage_global_condition_logic_id:
            item.manage_global_condition_logic_id,
        },
        update: {
          manage_global_condition_logic_id:
            item.manage_global_condition_logic_id,
          manage_global_condition_id: item.manage_global_condition_id,
          object: item.object,
          attribute: item.attribute,
          condition: item.condition,
          value: item.value,
        },
        create: {
          manage_global_condition_logic_id:
            item.manage_global_condition_logic_id,
          manage_global_condition_id: item.manage_global_condition_id,
          object: item.object,
          attribute: item.attribute,
          condition: item.condition,
          value: item.value,
        },
      });
      upsertResults.push(result);
      // console.log(result);
    }
    return res.status(200).json(upsertResults);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteManageGlobalConditionLogic = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageGlobalConditionLogicId =
      await prisma.manage_global_condition_logics.findUnique({
        where: {
          manage_global_condition_logic_id: id,
        },
      });
    if (!findManageGlobalConditionLogicId)
      return res
        .status(404)
        .json({ message: "ManageGlobalConditionLogic not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_global_condition_logics.delete({
      where: {
        manage_global_condition_logic_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
