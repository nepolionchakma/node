const prisma = require("../DB/db.config");
const { default: axios } = require("axios");
const { FLASK_ENDPOINT_URL } = require("../Variables/variables");

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

exports.getDefTenants = async (req, res) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  try {
    const defTenants = await axios.get(`${FLASK_ENDPOINT_URL}/tenants`, {
      headers: {
        Authorization:
          authorizationHeader ?? `Bearer ${req.cookies.access_token}`,
      },
    });

    return res.status(200).json(defTenants.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.uniqueDefTenant = async (req, res) => {
  try {
    const tenantId = Number(req.params.id);

    const findDefTenant = await await axios.get(
      `${FLASK_ENDPOINT_URL}/tenants/${tenantId}`
    );

    if (!findDefTenant) {
      return res.status(404).json({ message: "Tenant is not found" });
    }

    return res.status(200).json(findDefTenant);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.defTenantWithLazyLoading = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_tenants/${page}/${limit}`,
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

exports.defTenantSearchWithLazyLoading = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { tenant_name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_tenants/search/${page}/${limit}?tenant_name=${tenant_name}`,
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

exports.createDefTenant = async (req, res) => {
  try {
    const tenant_name = req.body;

    const createDefTenant = await axios.post(
      `${FLASK_ENDPOINT_URL}/tenants`,
      tenant_name
    );

    if (createDefTenant.status === 201) {
      return res.status(201).json({ message: "Created Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDefTenant = async (req, res) => {
  try {
    const defTenantId = Number(req.params.id);
    const defTenantUpdateData = req.body;

    const createDefTenant = await axios.put(
      `${FLASK_ENDPOINT_URL}/tenants/${defTenantId}`,
      defTenantUpdateData
    );

    if (createDefTenant.status === 200) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefTenant = async (req, res) => {
  try {
    const defTenantID = Number(req.params.id);

    const findDefTenant = await axios.delete(
      `${FLASK_ENDPOINT_URL}/tenants/${defTenantID}`
    );
    if (findDefTenant.status === 200) {
      return res.status(200).json({ message: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// exports.upsertDefTenant = async (req, res) => {
//   const data = req.body.upsertAttributes || req.body;

//   if (!Array.isArray(data)) {
//     return res
//       .status(400)
//       .json({ error: "Invalid input: 'Data' should be an array" });
//   }

//   const upsertResults = [];

//   try {
//     for (const item of data) {
//       const result = await prisma.def_tenants.upsert({
//         where: { tenant_id: item.tenant_id },
//         update: {
//           tenant_id: data.tenant_id,
//           tenant_name: item.tenant_name,
//         },
//         create: {
//           tenant_name: item.tenant_name,
//         },
//       });
//       upsertResults.push(result);
//     }

//     return res.status(200).json(upsertResults);
//   } catch (error) {
//     console.error("Error in upsert operation:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };
