const { default: axios } = require("axios");
const prisma = require("../DB/db.config");
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

// get Data
exports.getDefAccessPointsElements = async (req, res) => {
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements`
    );
    return res.status(200).json(result.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// lazy loading
exports.lazyLoadingDefAccessPointElements = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const { startNumber, endNumber } = pageLimitData(page, limit);
  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements`,
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

// Search
exports.getSearchAccessPointElementsLazyLoading = async (req, res) => {
  const { page, limit } = req.params;
  const { element_name } = req.query;

  try {
    const response = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements/search/${page}/${limit}?element_name=${element_name}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    return res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get Unique
exports.getUniqueDefAccessPointElement = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await axios.get(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements/${id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result) {
      return res.status(200).json(result.data);
    } else {
      return res.status(404).json({ message: "Data Source not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// create Data
exports.createDefAccessPointElement = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const result = await axios.post(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements`,
      data,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`,
        },
      }
    );
    if (result.data) {
      return res.status(201).json(result.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// update
exports.updateDefAccessPointElement = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;

    const result = await axios.put(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements/${id}`,
      data,
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

//Delete AccessPointsEntitlement
exports.deleteDefAccessPointElement = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await axios.delete(
      `${FLASK_ENDPOINT_URL}/def_access_point_elements/${id}`,
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

// get Data AccessPointsById
exports.filterAccessPointsById = async (req, res) => {
  const { accessPointsId } = req.query;

  const stringArray = accessPointsId.split(",");
  const ids = stringArray.map(Number);

  const page = parseInt(req.params.page) || 1;
  const limit = parseInt(req.params.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    const datasources = await prisma.def_data_sources.findMany();
    const accessPoints = await prisma.def_access_point_elements.findMany({
      where: {
        def_access_point_id: {
          in: ids,
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        def_access_point_id: "desc",
      },
    });
    //merge accessPoints and datasources
    const combainedData = accessPoints.map((accessPoint) => {
      const dataSource = datasources.find(
        (dataSource) =>
          dataSource.def_data_source_id === accessPoint.def_data_source_id
      );
      return {
        ...accessPoint,
        dataSource,
      };
    });
    // console.log(combainedData, "combainedData");
    res.status(200).json(combainedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get Data Access points for delete
exports.filterAccessPointsByIdDelete = async (req, res) => {
  const { accessPoint } = req.query;
  console.log("207");
  const stringArray = accessPoint.split(",");
  const ids = stringArray.map(Number);

  try {
    const datasources = await prisma.def_data_sources.findMany();
    const accessPoints = await prisma.def_access_point_elements.findMany({
      where: {
        def_access_point_id: {
          in: ids,
        },
      },
      orderBy: {
        def_access_point_id: "desc",
      },
    });
    //merge accessPoints and datasources
    const combainedData = accessPoints.map((accessPoint) => {
      const dataSource = datasources.find(
        (dataSource) =>
          dataSource.def_data_source_id === accessPoint.def_data_source_id
      );
      return {
        ...accessPoint,
        dataSource,
      };
    });
    // console.log(combainedData, "combainedData");
    res.status(200).json(combainedData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Update AccessPointsEntitlement
// exports.updateAccessPointsEntitlement = async (req, res) => {
//   try {
//     const data = req.body;
//     const id = Number(req.params.id);

//     // Validation  START/---------------------------------/
//     const findExistName = await prisma.access_points_elements.findFirst({
//       where: {
//         element_name: data.element_name,
//       },
//     });
//     if (!data.element_name || !data.description) {
//       return res.status(422).json({
//         message: "Element name and description is Required",
//       });
//     } else if (findExistName) {
//       return res.status(408).json({ message: "Element name already exist." });
//     }
//     // Validation  End/---------------------------------/
//     const result = await prisma.access_points_elements.update({
//       where: {
//         access_point_id: id,
//       },
//       data: {
//         element_name: data.element_name,
//         description: data.description,
//         platform: data.platform,
//         element_type: data.element_type,
//         access_control: data.access_control,
//         change_control: data.change_control,
//         audit: data.audit,
//         created_by: data.created_by,
//         created_on: currentDate,
//         last_updated_by: data.last_updated_by,
//         last_updated_on: currentDate,
//         data_sources: {
//           connect: { data_source_id: data.data_source_id },
//         },
//       },
//     });
//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// exports.upsertAccessPointsEntitlement = async (req, res) => {
//   const data = req.body.upsertAttributes || req.body;

//   if (!Array.isArray(data)) {
//     return res
//       .status(400)
//       .json({ error: "Invalid input: 'Data' should be an array" });
//   }

//   const upsertResults = [];
//   const currentDate = new Date(); // Ensure currentDate is defined

//   try {
//     for (const item of data) {
//       const dataSourceId = item.data_source_id;
//       const response = await prisma.access_points_elements.findMany();
//       const id =
//         response.length > 0
//           ? Math.max(...response.map((elem) => elem.access_point_id)) + 1
//           : 1;

//       const result = await prisma.access_points_elements.upsert({
//         where: { access_point_id: item.access_point_id },
//         update: {
//           element_name: item.element_name,
//           description: item.description,
//           platform: item.platform,
//           element_type: item.element_type,
//           access_control: item.access_control,
//           change_control: item.change_control,
//           audit: item.audit,
//           created_by: item.created_by,
//           created_on: currentDate,
//           last_updated_by: item.last_updated_by,
//           last_updated_on: currentDate,
//           data_sources: {
//             connect: dataSourceId
//               ? { data_source_id: dataSourceId }
//               : undefined,
//           },
//         },
//         create: {
//           access_point_id: id,
//           element_name: item.element_name,
//           description: item.description,
//           platform: item.platform,
//           element_type: item.element_type,
//           access_control: item.access_control,
//           change_control: item.change_control,
//           audit: item.audit,
//           created_by: item.created_by,
//           created_on: currentDate,
//           last_updated_by: item.last_updated_by,
//           last_updated_on: currentDate,
//           data_sources: {
//             connect: dataSourceId
//               ? { data_source_id: dataSourceId }
//               : undefined,
//           },
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
// perPageAccesspoints Data
// exports.getPerPageAccessPoints = async (req, res) => {
//   const page = Number(req.params.page);
//   const limit = Number(req.params.limit);
//   const offset = (page - 1) * limit;
//   try {
//     const results = await prisma.access_points_elements.findMany({
//       take: limit,
//       skip: offset,
//       orderBy: {
//         access_point_id: "desc",
//       },
//     });
//     const totalCount = await prisma.access_points_elements.count();
//     const totalPages = Math.ceil(totalCount / limit);

//     return res.status(200).json({
//       results,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
//Get Unique Data
// exports.getUniqueAccessPointsEntitlement = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const result = await prisma.access_points_elements.findUnique({
//       where: {
//         access_point_id: Number(id),
//       },
//     });
//     if (result) {
//       return res.status(200).json(result);
//     } else {
//       return res.status(404).json({ message: "Data Source not found." });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
//Create User
