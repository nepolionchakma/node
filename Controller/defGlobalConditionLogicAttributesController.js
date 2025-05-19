const prisma = require("../DB/db.config");
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
// fetch
exports.getDefGlobalConditionLogicAttributes = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logic_attributes`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// lazyLoading
exports.lazyLoadingDefGlobalConditionLogicAttributes = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { startNumber, endNumber } = pageLimitData(page, limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logic_attributes`
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
exports.getUniqueDefGlobalConditionLogicAttribute = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logic_attributes/${id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "ManageGlobalConditionLogicArrtibute not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Create
exports.createDefGlobalConditionLogicAttribute = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logic_attributes`,
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
exports.updateDefGlobalConditionLogicAtrribute = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_global_condition_logic_attributes/${id}`,
      data
    );

    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertManageGlobalConditionLogicArrtibute = async (req, res) => {
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }
  const response =
    await prisma.manage_global_condition_logic_attributes.findMany();
  const id = Math.max(
    ...response.map((item) => item.manage_global_condition_logic_id)
  );
  const upsertResults = [];

  try {
    for (const item of data) {
      const result =
        await prisma.manage_global_condition_logic_attributes.upsert({
          where: { id: item.id },
          update: {
            manage_global_condition_logic_id:
              item.manage_global_condition_logic_id,
            widget_position: item.widget_position,
            widget_state: item.widget_state,
          },
          create: {
            id: item.id,
            manage_global_condition_logic_id:
              item.manage_global_condition_logic_id,
            widget_position: item.widget_position,
            widget_state: item.widget_state,
          },
        });
      upsertResults.push(result);
    }

    return res.status(200).json(upsertResults);
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteManageGlobalConditionLogicArrtibute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageGlobalConditionLogicArrtibuteId =
      await prisma.manage_global_condition_logic_attributes.findUnique({
        where: {
          id: id,
        },
      });
    if (!findManageGlobalConditionLogicArrtibuteId)
      return res
        .status(404)
        .json({ message: "ManageGlobalConditionLogicArrtibute not found." });

    // Validation  End/---------------------------------/
    const result = await prisma.manage_global_condition_logic_attributes.delete(
      {
        where: {
          id: id,
        },
      }
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
