const prisma = require("../DB/db.config");
const currentDate = new Date().toLocaleString();

exports.getDefUsers = async (req, res) => {
  try {
    const result = await prisma.def_users.findMany({
      //sorting desc
      orderBy: {
        user_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique User
exports.getUniqueDefUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await prisma.def_users.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createDefUser = async (req, res) => {
  const profile_picture = "uploads/profiles/default/profile.jpg";
  try {
    // Validation  START/---------------------------------/
    const user_data = req.body;
    const users = await prisma.def_users.findMany();
    //generate max id
    const id =
      users.length > 0 ? Math.max(...users.map((item) => item.user_id)) + 1 : 1;
    const findDefUserName = await prisma.def_users.findFirst({
      where: {
        user_name: user_data.user_name,
      },
    });
    if (findDefUserName)
      return res.status(408).json({ message: "User Name already exist." });
    if (!user_data.user_name || !user_data.user_type) {
      return res.status(422).json({
        message: "user_name, user_type is Required",
      });
    }
    // Validation  End/---------------------------------/
    const result = await prisma.def_users.create({
      data: {
        user_id: id,
        user_name: user_data.user_name,
        user_type: user_data.user_type,
        email_addresses: user_data.email_addresses,
        created_by: user_data.created_by,
        created_on: currentDate,
        last_updated_by: user_data.last_updated_by,
        last_updated_on: currentDate,
        tenant_id: user_data.tenant_id,
        profile_picture: profile_picture,
      },
    });
    if (result) {
      return res.status(201).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Update User
exports.updateDefUser = async (req, res) => {
  try {
    const user_data = req.body;
    const user_id = Number(req.params.user_id);

    // Validation  START/---------------------------------/
    const findDefUserId = await prisma.def_users.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!findDefUserId)
      return res.status(404).json({ message: "User Id not found." });

    if (!user_data.user_name || !user_data.user_type) {
      return res.status(422).json({
        message: "user_name, user_type is Required",
      });
    }

    // Validation  End/---------------------------------/
    const result = await prisma.def_users.update({
      where: {
        user_id: user_id,
      },
      data: {
        user_name: user_data.user_name,
        user_type: user_data.user_type,
        email_addresses: user_data.email_addresses,
        created_by: user_data.created_by,
        created_on: currentDate,
        last_updated_by: user_data.last_updated_by,
        last_updated_on: currentDate,
        tenant_id: user_data.tenant_id,
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefUser = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);

    // Validation  START/---------------------------------/
    const findDefUserId = await prisma.def_users.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (!findDefUserId)
      return res.status(404).json({ message: "User not found." });

    // Validation  End/---------------------------------/
    await prisma.def_users.delete({
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).json({ result: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// perPageUsers Data
exports.perPageUsers = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const offset = (page - 1) * limit;
  try {
    const results = await prisma.def_users.findMany({
      take: limit,
      skip: offset,
    });
    const totalCount = await prisma.def_users.count();
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
