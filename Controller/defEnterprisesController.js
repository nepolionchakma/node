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
exports.getDefEnterprise = async (req, res) => {
  console.log(req.cookies.access_token);
  try {
    const result = await axios.get(`${FLASK_ENDPOINT_URL}/get_enterprises`, {
      headers: {
        Authorization: `Bearer ${req.cookies.access_token}`,
      },
    });

    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.uniqueDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);

  console.log(tenant_id, "result.data");
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/get_enterprise/${tenant_id}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }
};

exports.lazyLoadingDefEnterprise = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_tenant_enterprise_setup/${page}/${limit}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.searchLazyLoadingDefEnterprise = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { enterprise_name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_tenant_enterprise_setup/search/${page}/${limit}?enterprise_name=${enterprise_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    console.log(response);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);
  const data = req.body;
  try {
    const response = await axios.post(
      `${FLASK_ENDPOINT_URL}/create_enterprise/${tenant_id}`,
      data
    );

    if (response.status === 201) {
      return res.status(201).json(response.data);
    } else {
      return res.status(404).json({ message: "Tenancy not found." });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);
  try {
    const response = await axios.delete(
      `${FLASK_ENDPOINT_URL}/delete_enterprise/${tenant_id}`
    );
    console.log(response.data, response.status, "response.data");
    if (response.status === 200) {
      return res.status(200).json({ message: "Deleted Successfully." });
    } else {
      return res.status(404).json({ message: "Enterprise not found." });
    }
  } catch (error) {
    console.log(error);
  }
};

// exports.updateDefEnterprise = async (req, res) => {
//   const tenant_id = Number(req.params.tenant_id);
//   const data = req.body;
//   try {
//     const response = await axios.put(
//       `${FLASK_ENDPOINT_URL}/update_enterprise/${tenant_id}`,
//       data
//     );

//     if (response.status === 200) {
//       return res.status(200).json(response.data);
//     } else {
//       return res.status(404).json({ message: "Enterprise not found." });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
