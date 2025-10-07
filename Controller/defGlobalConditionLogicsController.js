// const prisma = require("../DB/db.config");

const { default: axios } = require("axios");
const { FLASK_ENDPOINT_URL } = require("../Variables/variables");

const pageLimitData = (page, limit) => {
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  let startNumber = 0;
  const endNumber = pageNumber * limitNumber;
  if (pageNumber > 1) {
    const pageInto = pageNumber - 1;
    startNumber = pageInto * limitNumber;
  }
  return { startNumber, endNumber };
};

// fetch logics
exports.getDefGlobalConditionLogics = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// lazyLoading
exports.lazyLoadingDefGlobalConditionLogics = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { startNumber, endNumber } = pageLimitData(page, limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics`
    );

    const results = response.data.slice(startNumber, endNumber);
    const totalPages = Math.ceil(response.data.length / limit);
    return res.status(200).json({
      results,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// fetch logic with id
exports.getUniqueDefGlobalConditionLogic = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics/${id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "ManageGlobalConditionLogic not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create Logic
exports.createDefGlobalConditionLogic = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics`,
      data
    );
    if (result) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update logic
exports.updateDefGlobalConditionLogic = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics/${id}`,
      data
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Upsert logic
exports.upsertDefGlobalConditionLogic = async (req, res) => {
  const data = req.body;

  try {
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics/upsert`,
      data
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// delete logic
exports.deleteDefGlobalConditionLogic = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logics/${id}`
    );
    if (result.data) {
      return res.status(200).json({ result: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/*
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
*/
