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

// Lazy loading
exports.lazyLoadingDefAccessEntitlement = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    const results = response.data.slice(startNumber, endNumber);
    const totalPages = Math.ceil(response.data.length / limit);
    return res.status(200).json({
      results,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Get Data
exports.getDefAccessEntitlements = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Data
exports.getUniqueDefAccessEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements/${id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res.status(404).json({ message: "not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create Data
exports.createDefAccessEntitlement = async (req, res) => {
  try {
    const data = req.body;
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result) {
      return res.status(201).json({
        message: "Entitlement created successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Update Data
exports.updateDefAccessEntitlement = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result) {
      return res.status(201).json({ message: "Updated Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Delete Data
exports.deleteDefAccessEntitlement = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_access_entitlements/${id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result) {
      return res.status(200).json({ result: "Deleted Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/*
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
    const data = req.body;
    //find max id and increment value
    const maxUserIDResult = await prisma.manage_access_entitlements.aggregate({
      _max: {
        entitlement_id: true,
      },
    });

    const id = maxUserIDResult._max.entitlement_id + 1;

    // Validation  START/---------------------------------/
    const findManageAccessEntitlementName =
      await prisma.manage_access_entitlements.findFirst({
        where: {
          entitlement_name: data.entitlement_name,
        },
      });

    if (findManageAccessEntitlementName) {
      return res.status(200).json({
        message: "Entitlement name already exist.",
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
      return res.status(201).json({
        message: "Entitlement created successfully.",
      });
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
    } else if (findExistName && findExistName.entitlement_id !== id) {
      return res
        .status(200)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    await prisma.manage_access_entitlements.update({
      where: {
        entitlement_id: id,
      },
      data: {
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
    return res.status(201).json({ message: "Updated Successfully" });
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
*/
