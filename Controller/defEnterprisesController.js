const prisma = require("../DB/db.config");
const axios = require("axios");

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
  try {
    // const defTenants = await axios.get(`${process.env.FLASK_ENDPOINT_URL}/`);
    const result = await prisma.def_tenant_enterprise_setup.findMany({
      orderBy: {
        tenant_id: "desc",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.uniqueDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);

  try {
    // const defTenants = await axios.get(`${process.env.FLASK_ENDPOINT_URL}/`);
    const result = await prisma.def_tenant_enterprise_setup.findUnique({
      where: {
        tenant_id,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// exports.defTenantEnterpriseSetupLazyLoading = async (req, res) => {
//   const { page, limit } = req.params;
//   try {
//     // const defTenants = await axios.get(`${process.env.FLASK_ENDPOINT_URL}/`);

//     const { startNumber, endNumber } = pageLimitData(page, limit);
//     const results = data.slice(startNumber, endNumber);
//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

exports.lazyLoadingDefEnterprise = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.def_tenant_enterprise_setup.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        tenant_id: "desc",
      },
    });
    const totalCount = await prisma.def_tenant_enterprise_setup.count();
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      results,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createDefEnterprise = async (req, res) => {
  const { enterprise_name, enterprise_type } = req.body;
  try {
    const maxTenantId = await prisma.def_tenant_enterprise_setup.aggregate({
      _max: {
        tenant_id: true,
      },
    });
    const tenant_id = maxTenantId._max.tenant_id + 1;
    await prisma.def_tenant_enterprise_setup.create({
      data: { tenant_id, enterprise_name, enterprise_type },
    });
    return res.status(200).json({ message: "Created Successfully." });
  } catch (error) {
    console.log(error);
  }
};
exports.updateDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);
  const { enterprise_name, enterprise_type } = Number(req.body);
  try {
    const isExist = await prisma.def_tenant_enterprise_setup.findFirst({
      where: {
        tenant_id,
      },
    });
    if (!isExist) {
      return res.status(404).json({ message: "Not found." });
    }
    await prisma.def_tenant_enterprise_setup.update({
      where: {
        tenant_id,
      },
      data: {
        enterprise_name,
        enterprise_type,
      },
    });
    return res.status(200).json({ message: "Updated Successfully." });
  } catch (error) {
    console.log(error);
  }
};
exports.deleteDefEnterprise = async (req, res) => {
  const tenant_id = Number(req.params.tenant_id);
  try {
    const isExist = await prisma.def_tenant_enterprise_setup.findFirst({
      where: {
        tenant_id,
      },
    });
    if (!isExist) {
      return res.status(404).json({ message: "Enterprise not found." });
    }
    await prisma.def_tenant_enterprise_setup.delete({
      where: {
        tenant_id,
      },
    });
    return res.status(200).json({ message: "Deleted Successfully." });
  } catch (error) {
    console.log(error);
  }
};
