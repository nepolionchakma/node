const prisma = require("../DB/db.config");
const axios = require("axios");
const data = [
  {
    enterprise_name: "A",
    enterprise_type: "1",
    tenant_name: "TDDSA",
  },
  {
    enterprise_name: "B",
    enterprise_type: "2",
    tenant_name: "TDDSB",
  },
  {
    enterprise_name: "C",
    enterprise_type: "3",
    tenant_name: "TDDSC",
  },
];
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
exports.defTenantEnterpriseSetup = async (req, res) => {
  try {
    // const defTenants = await axios.get(`${process.env.FLASK_ENDPOINT_URL}/`);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.defTenantEnterpriseSetupLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  try {
    // const defTenants = await axios.get(`${process.env.FLASK_ENDPOINT_URL}/`);

    const { startNumber, endNumber } = pageLimitData(page, limit);
    const results = data.slice(startNumber, endNumber);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
