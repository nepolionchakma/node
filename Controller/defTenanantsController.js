const prisma = require("../DB/db.config");

exports.defTenants = async (req, res) => {
  try {
    const defTenants = await prisma.def_tenants.findMany({
      //sorting desc
      orderBy: {
        tenant_id: "desc",
      },
    });

    return res.status(200).json(defTenants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.uniqueDefTenant = async (req, res) => {
  try {
    const tenantId = Number(req.params.id);

    const findDefTenant = await prisma.def_tenants.findUnique({
      where: {
        tenant_id: tenantId,
      },
    });

    if (!findDefTenant) {
      return res.status(404).json({ message: "Tenant is not found" });
    }

    return res.status(200).json(findDefTenant);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createDefTenant = async (req, res) => {
  try {
    const defTenantData = req.body;

    const findDefTenats = await prisma.def_tenants.findFirst({
      where: {
        tenant_name: defTenantData.tenant_name,
      },
    });

    if (findDefTenats) {
      return res.status(408).json({ message: "Tenant already exist" });
    }

    const newDefTenant = await prisma.def_tenants.create({
      data: {
        tenant_name: defTenantData.tenant_name,
      },
    });

    return res.status(201).json(newDefTenant);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefTenant = async (req, res) => {
  try {
    const defTenantID = Number(req.params.id);

    const findDefTenant = await prisma.def_tenants.findUnique({
      where: {
        tenant_id: defTenantID,
      },
    });

    if (!findDefTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const relatedUsers = await prisma.def_users.findMany({
      where: {
        tenant_id: defTenantID,
      },
    });

    if (relatedUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete tenant; there are related users." });
    }

    await prisma.def_tenants.delete({
      where: {
        tenant_id: defTenantID,
      },
    });

    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDefTenant = async (req, res) => {
  try {
    const defTenantId = Number(req.params.id);
    const defTenantData = req.body;

    const findDefTenant = await prisma.def_tenants.findUnique({
      where: {
        tenant_id: defTenantId,
      },
    });

    if (!findDefTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    if (!defTenantData.tenant_name) {
      return res.status(422).json({ message: "Tenant_name is required" });
    }

    const updatedDefTenant = await prisma.def_tenants.update({
      where: {
        tenant_id: defTenantId,
      },
      data: {
        tenant_name: defTenantData.tenant_name,
      },
    });

    return res.status(201).json({ updatedDefTenant });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertDefTenant = async (req, res) => {
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }

  const upsertResults = [];

  try {
    for (const item of data) {
      const result = await prisma.def_tenants.upsert({
        where: { tenant_id: item.tenant_id },
        update: {
          tenant_id: data.tenant_id,
          tenant_name: item.tenant_name,
        },
        create: {
          tenant_name: item.tenant_name,
        },
      });
      upsertResults.push(result);
    }

    return res.status(200).json(upsertResults);
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};
