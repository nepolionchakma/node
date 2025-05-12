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
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }

  try {
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_model_logic_attributes/upsert
`,
      data
    );

    console.log(result.data);
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
