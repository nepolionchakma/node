const axios = require("axios");
const { FLASK_ENDPOINT_URL } = require("../Variables/variables");

// Get Data
exports.getAccessProfiles = async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/access_profiles/${user_id}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create Data
exports.createProfile = async (req, res) => {
  const data = req.body;
  const { user_id } = req.params;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/access_profiles/${user_id}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Data
exports.updateProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  const data = req.body;
  try {
    const response = await axios.put(
      `${FLASK_ENDPOINT_URL}/access_profiles/${user_id}/${serial_number}`,
      data
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Data
exports.deleteProfile = async (req, res) => {
  const { user_id, serial_number } = req.params;
  try {
    const response = await axios.delete(
      `${FLASK_ENDPOINT_URL}/access_profiles/${user_id}/${serial_number}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
