const { default: axios } = require("axios");
const prisma = require("../DB/db.config");
const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;
//get Data
exports.getAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.findMany({
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

//Search LazyLoading
exports.searchLazyLoadingAccessEntitilementElement = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { entitlement_name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements/search/${page}/${limit}?entitlement_name= ${entitlement_name}`,
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

// create Data
exports.createAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.create({
      data: req.body,
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get unique Data
exports.getUniqueAccessEntitlementElement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_entitlement_elements.findMany({
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

//Delete Data
exports.deleteAccessEntitlementElement = async (req, res) => {
  const { entitlementId, accessPointId } = req.params;

  try {
    const deletedRecord = await prisma.access_entitlement_elements.deleteMany({
      where: {
        entitlement_id: Number(entitlementId),
        access_point_id: Number(accessPointId),
      },
    });

    if (deletedRecord.count > 0) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting record" });
  } finally {
  }
};

// perPageAccessEntitlementElement Data
exports.getPerPageAccessEntitlementElement = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.access_entitlement_elements.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        entitlement_id: "desc",
      },
    });
    const totalCount = await prisma.access_entitlement_elements.count();
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

/*
const prisma = require("../DB/db.config");
//get Data
exports.getAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.findMany({
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

// create Data
exports.createAccessEntitlementElement = async (req, res) => {
  try {
    const result = await prisma.access_entitlement_elements.create({
      data: req.body,
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get unique Data
exports.getUniqueAccessEntitlementElement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.access_entitlement_elements.findMany({
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

//Delete Data
exports.deleteAccessEntitlementElement = async (req, res) => {
  const { entitlementId, accessPointId } = req.params;

  try {
    const deletedRecord = await prisma.access_entitlement_elements.deleteMany({
      where: {
        entitlement_id: Number(entitlementId),
        access_point_id: Number(accessPointId),
      },
    });

    if (deletedRecord.count > 0) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting record" });
  } finally {
  }
};

// perPageAccessEntitlementElement Data
exports.getPerPageAccessEntitlementElement = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.access_entitlement_elements.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        entitlement_id: "desc",
      },
    });
    const totalCount = await prisma.access_entitlement_elements.count();
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
*/
