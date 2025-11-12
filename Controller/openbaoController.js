const axios = require("axios");

// Vault server URL and token
const VAULT_ADDR = process.env.VAULT_ADDR;
const VAULT_TOKEN = process.env.VAULT_TOKEN;

exports.getSecretsEngines = async (req, res) => {
  try {
    const response = await axios.get(`${VAULT_ADDR}/v1/sys/mounts`, {
      headers: {
        "X-Vault-Token": VAULT_TOKEN,
      },
    });

    const secretEngines = response.data;
    console.log("Secrets Engines:", secretEngines);
    return res.status(200).json(secretEngines);
  } catch (error) {
    console.error("Error getting secrets engines:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// 1. Create KV Secrets Engine
exports.createSecretsEngine = async (req, res) => {
  const engineConfig = req.body;
  try {
    const response = await axios.post(
      `${VAULT_ADDR}/v1/sys/mounts/${engineConfig.engine_name}`,
      engineConfig.data,
      {
        headers: {
          "X-Vault-Token": VAULT_TOKEN,
        },
      }
    );

    console.log("Secrets engine created:", response);
    return res
      .status(201)
      .json({ message: "Secrets engine created successfully" });
  } catch (error) {
    console.error(
      "Failed to create secrets engine:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: error.message });
  }
};

// 2. Store Secret
exports.storeSecret = async (req, res) => {
  const secretData = req.body;
  try {
    const response = await axios.post(
      `${VAULT_ADDR}/v1/${secretData.engine_name}/${secretData.secret_name}`,
      secretData.data,
      {
        headers: {
          "X-Vault-Token": VAULT_TOKEN,
        },
      }
    );

    console.log("Secret stored successfully:", response);
    return res.status(201).json({ message: "Secret stored successfully" });
  } catch (error) {
    console.error(
      "Failed to store secret:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSecretsEngine = async (req, res) => {
  const engineConfig = req.body; // Data sent in the request body
  console.log("Engine Config:", engineConfig);

  if (
    !engineConfig ||
    !engineConfig.engine_name ||
    !engineConfig.data ||
    !engineConfig.data.config
  ) {
    return res
      .status(400)
      .json({ error: "Invalid payload. Missing engine_name or config." });
  }

  try {
    // Send a PUT request to Vault to update the engine configuration
    const response = await axios.put(
      `${VAULT_ADDR}/v1/sys/mounts/${engineConfig.engine_name}`, // Path to update engine
      engineConfig.data, // Data containing the configuration to update
      {
        headers: {
          "X-Vault-Token": VAULT_TOKEN,
        },
      }
    );

    // Log and return the response from Vault
    console.log("Secrets engine updated:", response);
    return res
      .status(200)
      .json({ message: "Secrets engine updated successfully" });
  } catch (error) {
    console.error(
      "Failed to update secrets engine:",
      error.response ? error.response.data : error.message
    );
    return res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
};

exports.updateSecret = async (req, res) => {
  const secretData = req.body;
  try {
    const response = await axios.put(
      `${VAULT_ADDR}/v1/${secretData.engine_name}/${secretData.secret_name}`,
      secretData.data,
      {
        headers: {
          "X-Vault-Token": VAULT_TOKEN,
        },
      }
    );

    console.log("Secret updated successfully:", response);
    return res.status(200).json({ message: "Secret updated successfully" });
  } catch (error) {
    console.error(
      "Failed to update secret:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: error.message });
  }
};

exports.getLatestSecret = async (req, res) => {
  const { engine } = req.query;
  try {
    const response = await axios.get(`${VAULT_ADDR}/v1/sys/mounts/${engine}`, {
      headers: {
        "X-Vault-Token": VAULT_TOKEN,
      },
    });

    console.log("Latest Secret:", response);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Failed to retrieve secret:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ error: error.message });
  }
};

// exports.deleteEngine = async (req, res) => {
//   const { engine, secret } = req.query;
//   try {
//     if (engine && !secret) {
//       const response = await axios.delete(
//         `${VAULT_ADDR}/v1/sys/mounts/${engine}`,
//         {
//           headers: {
//             "X-Vault-Token": VAULT_TOKEN,
//           },
//         }
//       );
//       console.log("Secrets engine deleted:", response.data);
//       return res.status(200).json(response.data);
//     }
//     if (engine && secret) {
//       const response = await axios.delete(
//         `${VAULT_ADDR}/v1/${engine}/destroy/${secret}`,
//         {
//           headers: {
//             "X-Vault-Token": VAULT_TOKEN, // Vault token for authentication
//           },
//         }
//       );
//       console.log("Secret deleted:", response);
//       return res.status(200).json(response.data);
//     }
//   } catch (error) {
//     console.error(
//       "Failed to delete secrets engine:",
//       error.response ? error.response.data : error.message
//     );
//     return res.status(500).json({ error: error.message });
//   }
// };
