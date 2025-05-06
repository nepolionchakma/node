const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

// fetch all Models
exports.getDefAccessModels = async (req, res) => {
  try {
    const result = await axios.get(`${FLASK_ENDPOINT_URL}/def_access_models`);
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Model
exports.uniqueDefAccessModel = async (req, res) => {
  try {
    const model_id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_models/${model_id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "Manage Access Model not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create Model
exports.createDefAccessModel = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_models
`,
      data
    );
    if (result) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update Model
exports.updateDefAccessModel = async (req, res) => {
  try {
    const data = req.body;
    const model_id = req.params.id;
    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_access_models/${model_id}`,
      data
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// delete Model
exports.deleteDefAccessModel = async (req, res) => {
  try {
    const model_id = req.params.id;

    const result =
      await axios.delete(`${FLASK_ENDPOINT_URL}/def_access_models/${model_id}
`);
    console.log(result.data);
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
