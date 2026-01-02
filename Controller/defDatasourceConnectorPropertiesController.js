const prisma = require("../DB/db.config");

exports.getUniqueProperty = async (req, res) => {
  const { def_data_source_id } = req.query;

  try {
    const result = await prisma.def_datasource_connector_properties.findFirst({
      where: {
        def_data_source_id: Number(def_data_source_id),
      },
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "No datasource connector properties found." });
    }

    return res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createProperties = async (req, res) => {
  const userId = Number(req.user.user_id);

  try {
    const {
      def_data_source_id,
      database_type,
      host_name,
      service_name,
      port,
      username,
      password,
    } = req.body;

    const result = await prisma.def_datasource_connector_properties.create({
      data: {
        def_data_source_id,
        database_type,
        host_name,
        service_name,
        port,
        username,
        password,
        created_by: userId,
        creation_date: new Date(),
        last_updated_by: userId,
        last_update_date: new Date(),
      },
    });

    if (result) {
      return res.status(201).json({ result, message: "Added Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProperties = async (req, res) => {
  const userId = Number(req.user.user_id);

  try {
    const {
      def_data_source_id,
      database_type,
      host_name,
      service_name,
      port,
      username,
      password,
    } = req.body;

    const { def_property_id } = req.query;

    const result = await prisma.def_datasource_connector_properties.update({
      where: {
        def_property_id: Number(def_property_id),
      },
      data: {
        def_data_source_id,
        database_type,
        host_name,
        service_name,
        port,
        username,
        password,
        last_updated_by: userId,
        last_update_date: new Date(),
      },
    });

    if (result) {
      return res.status(200).json({ result, message: "Edited Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
