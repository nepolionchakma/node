const axios = require("axios");
const wrapperURL = "http://129.146.53.68:5000/access_profiles";
exports.getAccessProfiles = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await axios.get(`${wrapperURL}/${user_id}`);

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createProfile = async (req, res) => {
  const data = req.body;
  const { user_id } = req.params;
  try {
    const response = await axios.post(`${wrapperURL}/${user_id}`, data);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${wrapperURL}/${user_id}/${serial_number}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  try {
    const response = await axios.delete(
      `${wrapperURL}/${user_id}/${serial_number}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
