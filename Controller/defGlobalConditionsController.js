const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;
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
