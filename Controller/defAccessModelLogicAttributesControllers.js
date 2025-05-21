const prisma = require("../DB/db.config");
const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

// fetch access model attributes
exports.getDefAccessModelAttributes = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Atrribute
exports.getUniqueDefAccessModelAttribute = async (req, res) => {
  try {
    const attr_id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes/${attr_id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "ManageAccessModelAttribute not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create Attribute
exports.createDefAccessModelAttribute = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes`,
      data
    );

    if (result) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update Attribute
exports.updateDefAccessModelAttribute = async (req, res) => {
  try {
    const data = req.body;
    const attr_id = req.params.id;
    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes/${attr_id}`,
      data
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertDefAccessModelAttribute = async (req, res) => {
  const data = req.body;
  try {
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes/upsert
`,
      data
    );
    if (result) {
      return res.status(200).json(result.data);
    }
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};
// Delete attribute
exports.deleteDefAccessModelAttribute = async (req, res) => {
  try {
    const attr_id = req.params.id;

    await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes/${attr_id}`
    );
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* 
const prisma = require("../DB/db.config");
exports.getManageAccessModelAttributes = async (req, res) => {
  try {
    const result = await prisma.manage_access_model_logic_attributes.findMany({
      //sorting desc
      orderBy: {
        id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueManageAccessModelAttribute = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_model_logic_attributes.findUnique(
      {
        where: {
          id: Number(id),
        },
      }
    );
    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "ManageAccessModelAttribute not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createManageAccessModelAttribute = async (req, res) => {
  try {
    const response =
      await prisma.manage_access_model_logic_attributes.findMany();
    const id = Math.max(...response.map((item) => item.id));
    const data = req.body;
    const result = await prisma.manage_access_model_logic_attributes.create({
      data: {
        id: response.length > 0 ? id + 1 : 1,
        manage_access_model_logic_id: data.manage_access_model_logic_id,
        widget_position: data.widget_position,
        widget_state: data.widget_state,
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
exports.updateManageAccessModelAttribute = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);
    const findExistId =
      await prisma.manage_access_model_logic_attributes.findFirst({
        where: {
          id: id,
        },
      });

    if (!findExistId) {
      return res.status(404).json({
        message: "ManageAccessModelAttribute not found",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_model_logic_attributes.update({
      where: {
        id: id,
      },
      data: {
        id: id,
        manage_access_model_logic_id: data.manage_access_model_logic_id,
        widget_position: data.widget_position,
        widget_state: data.widget_state,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertManageAccessModelAttribute = async (req, res) => {
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }
  const response = await prisma.manage_access_model_logic_attributes.findMany();
  const id = Math.max(
    ...response.map((item) => item.manage_access_model_logic_id)
  );
  const upsertResults = [];

  try {
    for (const item of data) {
      const result = await prisma.manage_access_model_logic_attributes.upsert({
        where: { id: item.id },
        update: {
          manage_access_model_logic_id: item.manage_access_model_logic_id,
          widget_position: item.widget_position,
          widget_state: item.widget_state,
        },
        create: {
          id: item.id,
          manage_access_model_logic_id: item.manage_access_model_logic_id,
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
exports.deleteManageAccessModelAttribute = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessModelAttributeId =
      await prisma.manage_access_model_logic_attributes.findUnique({
        where: {
          id: id,
        },
      });
    if (!findManageAccessModelAttributeId)
      return res
        .status(404)
        .json({ message: "ManageAccessModelAttribute not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_access_model_logic_attributes.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

*/
