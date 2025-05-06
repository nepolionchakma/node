const prisma = require("../DB/db.config");
const { default: axios } = require("axios");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

// fetch model logics
exports.getDefAccessModelLogics = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_model_logics`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Model logics
exports.getUniqueDefAccessModelLogic = async (req, res) => {
  try {
    const logic_id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_model_logics/${logic_id}`
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res
        .status(404)
        .json({ message: "ManageAccessModelLogic not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create Access Model Logic
exports.createDefAccessModelLogic = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_model_logics`,
      data
    );
    if (result) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update Access Model Logic
exports.updateDefAccessModelLogic = async (req, res) => {
  try {
    const data = req.body;
    const logic_id = req.params.id;
    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_access_model_logics/${logic_id}`,
      data
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// exports.upsertManageAccessModelLogic = async (req, res) => {
//   const data = req.body.upsertLogics || req.body;
//   if (!Array.isArray(data)) {
//     return res
//       .status(400)
//       .json({ error: "Invalid input: 'Data' should be an array" });
//   }
//   const response = await prisma.manage_access_model_logics.findMany();
//   const id = Math.max(
//     ...response.map((item) => item.manage_access_model_logic_id)
//   );
//   const upsertResults = [];
//   try {
//     for (const item of data) {
//       const {
//         manage_access_model_id,
//         filter,
//         object,
//         attribute,
//         condition,
//         value,
//       } = item;
//       const result = await prisma.manage_access_model_logics.upsert({
//         where: {
//           manage_access_model_logic_id: item.manage_access_model_logic_id,
//         },
//         update: {
//           manage_access_model_logic_id: item.manage_access_model_logic_id,
//           manage_access_model_id: manage_access_model_id,
//           filter: filter,
//           object: object,
//           attribute: attribute,
//           condition: condition,
//           value: value,
//         },
//         create: {
//           manage_access_model_logic_id: item.manage_access_model_logic_id,
//           manage_access_model_id: manage_access_model_id,
//           filter: filter,
//           object: object,
//           attribute: attribute,
//           condition: condition,
//           value: value,
//         },
//       });
//       upsertResults.push(result);
//       // console.log(result);
//     }
//     return res.status(200).json(upsertResults);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// Delete Model Logic
exports.deleteDefAccessModelLogic = async (req, res) => {
  try {
    const logic_id = req.params.id;
    await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_access_model_logics/${logic_id}`
    );
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
