const prisma = require("../DB/db.config");
exports.getManageAccessModelLogics = async (req, res) => {
  try {
    const result = await prisma.manage_access_model_logics.findMany({
      //sorting desc
      orderBy: {
        manage_access_model_logic_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageAccessModelLogic = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_model_logics.findUnique({
      where: {
        manage_access_model_logic_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "ManageAccessModelLogic not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageAccessModelLogic = async (req, res) => {
  try {
    const response = await prisma.manage_access_model_logics.findMany();
    const id = Math.max(
      ...response.map((item) => item.manage_access_model_logic_id)
    );
    // Validation  START/---------------------------------/
    const data = req.body;
    const findExistObject = await prisma.manage_access_model_logics.findFirst({
      where: {
        object: data.object,
      },
    });
    if (!data.object) {
      return res.status(422).json({
        message: "ManageAccessModel object is Required",
      });
    } else if (findExistObject) {
      return res.status(408).json({ message: "Object already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_model_logics.create({
      data: {
        manage_access_model_logic_id: response.length > 0 ? id + 1 : 1,
        manage_access_model_id: data.manage_access_model_id,
        filter: data.filter,
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
exports.updateManageAccessModelLogic = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const findExistId = await prisma.manage_access_model_logics.findFirst({
      where: {
        manage_access_model_logic_id: id,
      },
    });
    const findExistObject = await prisma.manage_access_model_logics.findFirst({
      where: {
        object: data.object,
      },
    });
    if (!findExistId) {
      return res.status(404).json({
        message: "ManageAccessModelLogic not found",
      });
    }
    if (!data.object) {
      return res.status(422).json({
        message: "ManageAccessModelLogic object is Required",
      });
    } else if (findExistObject) {
      return res
        .status(408)
        .json({ message: "ManageAccessModelLogic Object already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_model_logics.update({
      where: {
        manage_access_model_logic_id: id,
      },
      data: {
        manage_access_model_logic_id: id,
        manage_access_model_id: data.manage_access_model_id,
        filter: data.filter,
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
exports.upsertManageAccessModelLogic = async (req, res) => {
  const data = req.body.upsertLogics || req.body;
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }
  const response = await prisma.manage_access_model_logics.findMany();
  const id = Math.max(
    ...response.map((item) => item.manage_access_model_logic_id)
  );
  const upsertResults = [];
  try {
    for (const item of data) {
      const {
        manage_access_model_id,
        filter,
        object,
        attribute,
        condition,
        value,
      } = item;
      const result = await prisma.manage_access_model_logics.upsert({
        where: {
          manage_access_model_logic_id: item.manage_access_model_logic_id,
        },
        update: {
          manage_access_model_logic_id: item.manage_access_model_logic_id,
          manage_access_model_id: manage_access_model_id,
          filter: filter,
          object: object,
          attribute: attribute,
          condition: condition,
          value: value,
        },
        create: {
          manage_access_model_logic_id: item.manage_access_model_logic_id,
          manage_access_model_id: manage_access_model_id,
          filter: filter,
          object: object,
          attribute: attribute,
          condition: condition,
          value: value,
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

exports.deleteManageAccessModelLogic = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessModelLogicId =
      await prisma.manage_access_model_logics.findUnique({
        where: {
          manage_access_model_logic_id: id,
        },
      });
    if (!findManageAccessModelLogicId)
      return res
        .status(404)
        .json({ message: "ManageAccessModelLogic not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_access_model_logics.delete({
      where: {
        manage_access_model_logic_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
