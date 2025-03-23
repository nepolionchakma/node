const prisma = require("../DB/db.config");
// generate date
const currentDate = new Date();
// const date = () => {
//   const time = new Date().toLocaleTimeString();
//   const currentDate = new Date().toLocaleDateString();
//   const date = `${currentDate}, ${time}`;
//   return date;
// };
//Get Datasources
exports.getDataSources = async (req, res) => {
  try {
    const result = await prisma.data_sources.findMany({
      //sorting desc
      orderBy: {
        data_source_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique Datasource
exports.getUniqueDataSource = async (req, res) => {
  try {
    const data_source_id = req.params.id;
    const result = await prisma.data_sources.findUnique({
      where: {
        data_source_id: Number(data_source_id),
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
//Create Datasource
exports.createDataSource = async (req, res) => {
  try {
    const data = req.body;
    //find max id and increment value
    const response = await prisma.data_sources.findMany();
    const id =
      response.length > 0
        ? Math.max(...response.map((item) => item.data_source_id)) + 1
        : 1;

    // Validation  START/---------------------------------/
    const findDataSourceName = await prisma.data_sources.findFirst({
      where: {
        datasource_name: data.datasource_name,
      },
    });
    if (findDataSourceName)
      return res
        .status(408)
        .json({ message: "Data Source Name already exist." });
    if (!data.datasource_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.data_sources.create({
      data: {
        data_source_id: id,
        datasource_name: data.datasource_name,
        description: data.description,
        application_type: data.application_type,
        application_type_version: data.application_type_version,
        last_access_synchronization_date: currentDate,
        last_access_synchronization_status:
          data.last_access_synchronization_status,
        last_transaction_synchronization_date: currentDate,
        last_transaction_synchronization_status:
          data.last_transaction_synchronization_status,
        default_datasource: data.default_datasource,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update Datasource
exports.updateDataSource = async (req, res) => {
  try {
    const data = req.body;
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findDataSource = await prisma.data_sources.findUnique({
      where: {
        data_source_id: id,
      },
    });
    const findExistName = await prisma.data_sources.findFirst({
      where: { datasource_name: data.datasource_name },
    });
    if (!findDataSource) {
      return res.status(404).json({ message: "Data Source Id not found." });
    } else if (!data.datasource_name || !data.description) {
      return res.status(422).json({
        message: "data source name and description is Required",
      });
    } else if (findExistName) {
      return res
        .status(408)
        .json({ message: "Data Source name already exist." });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.data_sources.update({
      where: {
        data_source_id: id,
      },
      data: {
        datasource_name: data.datasource_name,
        description: data.description,
        application_type: data.application_type,
        application_type_version: data.application_type_version,
        last_access_synchronization_date: currentDate,
        last_access_synchronization_status:
          data.last_access_synchronization_status,
        last_transaction_synchronization_date: currentDate,
        last_transaction_synchronization_status:
          data.last_transaction_synchronization_status,
        default_datasource: data.default_datasource,
        created_by: data.created_by,
        last_updated_by: data.last_updated_by,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// Delete Datasource
exports.deleteDataSource = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validation  START/---------------------------------/
    const findDataSourceId = await prisma.data_sources.findUnique({
      where: {
        data_source_id: id,
      },
    });
    if (!findDataSourceId)
      return res.status(404).json({ message: "Data Source not found." });

    // Validation  End/---------------------------------/
    await prisma.data_sources.delete({
      where: {
        data_source_id: id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// perPageDataSources Data
exports.getPerPageDataSources = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.data_sources.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        data_source_id: "desc",
      },
    });
    const totalCount = await prisma.data_sources.count();
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
exports.filterAccessPointsById = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const idsParam = req.query.ids;
  const stringArray = idsParam.split(",");
  const ids = stringArray.map(Number);
  try {
    const accessPoints = await prisma.access_points_elements.findMany({
      where: {
        access_point_id: {
          in: ids,
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        access_point_id: "desc",
      },
    });
    res.status(200).json(accessPoints);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while querying the database." });
  }
};
