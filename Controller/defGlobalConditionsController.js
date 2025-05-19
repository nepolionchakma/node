const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

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

exports.getDefGlobalConditions = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_conditions`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// lazy loading
exports.lazyLoadingDefGlobalConditions = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { startNumber, endNumber } = pageLimitData(page, limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_conditions`
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

//Get Unique
exports.getUniqueDefGlobalCondition = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_conditions/${id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "Def Global Condition Data not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createDefGlobalCondition = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_global_conditions`,
      data
    );
    if (result) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateDefGlobalCondition = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_global_conditions/${id}`,
      data
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefGlobalCondition = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_global_conditions/${id}`
    );
    if (result) {
      return res.status(200).json({ result: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* 
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
        .status(409)
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
        message: "Name and description is Required",
      });
    } else if (findExistName) {
      return res.status(409).json({ message: "Name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_conditions.update({
      where: {
        manage_global_condition_id: id,
      },
      data: {
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
*/
