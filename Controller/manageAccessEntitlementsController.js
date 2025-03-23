const prisma = require("../DB/db.config");
const currentDate = new Date();
//Get Data
exports.getManageAccessEntitlements = async (req, res) => {
  try {
    const result = await prisma.manage_access_entitlements.findMany({
      //sorting desc
      orderBy: {
        entitlement_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Data
exports.getUniqueManageAccessEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.manage_access_entitlements.findUnique({
      where: {
        entitlement_id: Number(id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Data Source not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create Data
exports.createManageAccessEntitlement = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const data = req.body;
    //find max id and increment value
    const response = await prisma.manage_access_entitlements.findMany();
    const id =
      response.length > 0
        ? Math.max(...response.map((item) => item.entitlement_id)) + 1
        : 1086601;

    // Validation  START/---------------------------------/

    const findManageAccessEntitlementName =
      await prisma.manage_access_entitlements.findFirst({
        where: {
          entitlement_name: data.entitlement_name,
        },
      });
    if (findManageAccessEntitlementName)
      return res
        .status(408)
        .json({ message: "Entitlement Name already exist." });
    if (!data.entitlement_name || !data.description) {
      return res.status(422).json({
        message: "Entitlement name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_entitlements.create({
      data: {
        entitlement_id: id,
        entitlement_name: data.entitlement_name,
        description: data.description,
        comments: data.comments,
        status: data.status,
        effective_date: currentDate,
        revison: "0",
        revision_date: currentDate,
        created_on: currentDate,
        last_updated_on: currentDate,
        last_updated_by: data.last_updated_by,
        created_by: data.created_by,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update Data
exports.updateManageAccessEntitlement = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessEntitlement =
      await prisma.manage_access_entitlements.findUnique({
        where: {
          entitlement_id: id,
        },
      });
    const findExistName = await prisma.manage_access_entitlements.findFirst({
      where: {
        entitlement_name: data.entitlement_name,
      },
    });
    if (!findManageAccessEntitlement) {
      return res.status(404).json({ message: "Data Source Id not found." });
    } else if (!data.entitlement_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    } else if (findExistName) {
      return res
        .status(408)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.manage_access_entitlements.update({
      where: {
        entitlement_id: id,
      },
      data: {
        entitlement_id: id,
        entitlement_name: data.entitlement_name,
        description: data.description,
        comments: data.comments,
        status: data.status,
        effective_date: currentDate,
        revison: String(Number(findManageAccessEntitlement.revison) + 1),
        revision_date: currentDate,
        created_on: currentDate,
        last_updated_on: currentDate,
        last_updated_by: data.last_updated_by,
        created_by: data.created_by,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Delete Data
exports.deleteManageAccessEntitlement = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findManageAccessEntitlementId =
      await prisma.manage_access_entitlements.findUnique({
        where: {
          entitlement_id: id,
        },
      });
    if (!findManageAccessEntitlementId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    await prisma.manage_access_entitlements.delete({
      where: {
        entitlement_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// perPageManageAccessEntitlement Data
exports.getPerPageManageAccessEntitlement = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.manage_access_entitlements.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        entitlement_id: "desc",
      },
    });
    const totalCount = await prisma.manage_access_entitlements.count();
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
