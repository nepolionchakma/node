const prisma = require("../DB/db.config");
const crypto = require("crypto");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
dotenv.config();

const FLASK_ENDPOINT_URL = process.env.FLASK_ENDPOINT_URL;

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");
    const iterations = 600000;
    const keyLength = 32;
    const digest = "sha256";

    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) return reject(err);

        const formattedHash = `pbkdf2:${digest}:${iterations}$${salt}$${derivedKey.toString(
          "hex"
        )}`;
        resolve(formattedHash);
      }
    );
  });
};

exports.createCombinedUser = async (req, res) => {
  try {
    const combinedUserData = req.body;
    const currentTime = new Date();
    const profile_picture = {
      original: "uploads/profiles/default/profile.jpg",
      thumbnail: "uploads/profiles/default/thumbnail.jpg",
    };
    const maxUserIDResult = await prisma.def_users.aggregate({
      _max: {
        user_id: true,
      },
    });

    const maxID = maxUserIDResult._max.user_id + 1;

    if (combinedUserData.user_type === "person") {
      await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: combinedUserData.user_name,
          user_type: combinedUserData.user_type,
          email_addresses: combinedUserData.email_addresses,
          created_by: combinedUserData.created_by,
          created_on: currentTime.toLocaleString(),
          last_updated_by: combinedUserData.last_updated_by,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: combinedUserData.tenant_id,
          profile_picture: profile_picture,
        },
      });

      await prisma.def_persons.create({
        data: {
          user_id: maxID,
          first_name: combinedUserData.first_name,
          middle_name: combinedUserData.middle_name,
          last_name: combinedUserData.last_name,
          job_title: combinedUserData.job_title,
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: await hashPassword(combinedUserData.password),
        },
      });
    }

    if (combinedUserData.user_type !== "person") {
      await prisma.def_users.create({
        data: {
          user_id: maxID,
          user_name: combinedUserData.user_name,
          user_type: combinedUserData.user_type,
          email_addresses: combinedUserData.email_addresses,
          created_by: combinedUserData.created_by,
          created_on: currentTime.toLocaleString(),
          last_updated_by: combinedUserData.last_updated_by,
          last_updated_on: currentTime.toLocaleString(),
          tenant_id: combinedUserData.tenant_id,
        },
      });

      await prisma.def_user_credentials.create({
        data: {
          user_id: maxID,
          password: await hashPassword(combinedUserData.password),
        },
      });
    }

    if (!combinedUserData.user_name || !combinedUserData.user_type) {
      return res.status(422).json({
        message: "user_name, user_type is Required",
      });
    } else {
      return res.status(201).json({
        message: "User Recod Created",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCombinedUsers = async (req, res) => {
  const { page, limit } = req.params;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  let startNumber = 0;
  const endNumber = pageNumber * limitNumber;
  if (pageNumber > 1) {
    const pageInto = pageNumber - 1;
    startNumber = pageInto * limitNumber;
  }
  try {
    const users = await prisma.def_users.findMany({
      orderBy: {
        user_id: "desc",
      },
    });

    const persons = await prisma.def_persons.findMany();

    const combinedUsers = users.map((user) => {
      const person = persons.find((p) => p.user_id === user.user_id);

      return {
        ...user,
        ...person,
      };
    });

    const response = combinedUsers.slice(startNumber, endNumber);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUsersView = async (req, res) => {
  try {
    const users = await prisma.def_users_v.findMany({
      orderBy: {
        user_id: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await prisma.def_users_v.findUnique({
      where: {
        user_id: Number(id),
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
// combined users get with page and limit
exports.getUsersWithPageAndLimit = async (req, res) => {
  const page = Number(req.params.page);
  const limit = Number(req.params.limit);
  const offset = (page - 1) * limit;
  try {
    const users = await prisma.def_users_v.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        user_id: "desc",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const {
      user_name,
      email_addresses,
      first_name,
      middle_name,
      last_name,
      job_title,
      password,
    } = req.body;
    const id = Number(req.params.id);
    const hashPassword = (password) => {
      return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex");
        const iterations = 600000;
        const keyLength = 32;
        const digest = "sha256";

        crypto.pbkdf2(
          password,
          salt,
          iterations,
          keyLength,
          digest,
          (err, derivedKey) => {
            if (err) return reject(err);

            const formattedHash = `pbkdf2:${digest}:${iterations}$${salt}$${derivedKey.toString(
              "hex"
            )}`;
            resolve(formattedHash);
          }
        );
      });
    };

    // Validate user ID
    const findDefUserId = await prisma.def_users.findUnique({
      where: { user_id: id },
    });

    if (!findDefUserId) {
      return res.status(404).json({ message: "User ID not found." });
    }

    // Update user with profile picture and thumbnail
    await prisma.def_users.update({
      where: { user_id: id },
      data: {
        user_name: user_name || findDefUserId.user_name,
        email_addresses: email_addresses || findDefUserId.email_addresses,
      },
    });

    await prisma.def_persons.update({
      where: { user_id: id },
      data: {
        first_name: first_name || findDefUserId.first_name,
        middle_name: middle_name || findDefUserId.middle_name,
        last_name: last_name || findDefUserId.last_name,
        job_title: job_title || findDefUserId.job_title,
      },
    });

    if (password.length > 0) {
      await prisma.def_user_credentials.update({
        where: { user_id: id },
        data: {
          password: await hashPassword(password),
        },
      });
    }
    return res.status(200).json({ message: "Updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: error.message });
  }
};

// exports.updateUser = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded." });
//     }

//     const filePath = req.file.path.replace(/\\/g, "/");
//     const thumbnailPath = req.file.thumbnailPath.replace(/\\/g, "/");

//     const { user_name, email_addresses, first_name, last_name } = req.body;
//     const id = Number(req.params.id);

//     // Validate user ID
//     const findDefUserId = await prisma.def_users.findUnique({
//       where: { user_id: id },
//     });

//     if (!findDefUserId) {
//       return res.status(404).json({ message: "User ID not found." });
//     }

//     // Update user with profile picture and thumbnail
//     await prisma.def_users.update({
//       where: { user_id: id },
//       data: {
//         user_name: user_name || findDefUserId.user_name,
//         email_addresses: email_addresses || findDefUserId.email_addresses,
//         profile_picture: {
//           original: filePath || findDefUserId.profile_picture,
//           thumbnail: thumbnailPath || findDefUserId.profile_thumbnail,
//         },
//       },
//     });

//     await prisma.def_persons.update({
//       where: { user_id: id },
//       data: {
//         first_name: first_name || findDefUserId.first_name,
//         last_name: last_name || findDefUserId.last_name,
//       },
//     });

//     return res.status(200).json({ message: "Updated successfully." });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

//Flask API Wrapper

exports.getFlaskCombinedUser = async (req, res) => {
  const response = await axios.get(`${FLASK_ENDPOINT_URL}/users`);
  return res.status(200).json(response.data);
};

exports.createFlaskCombinedUser = async (req, res) => {
  const data = req.body;

  try {
    await axios.post(`${FLASK_ENDPOINT_URL}/users`, data);
    return res.status(201).json({ message: "Record inserted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.path.replace(/\\/g, "/");
    const thumbnailPath = req.file.thumbnailPath
      ? req.file.thumbnailPath.replace(/\\/g, "/")
      : null;

    // Validate user ID
    const findDefUserId = await prisma.def_users.findUnique({
      where: { user_id: Number(id) },
    });

    if (!findDefUserId) {
      return res.status(404).json({ message: "User ID not found." });
    }

    // Update user with profile picture and thumbnail
    await prisma.def_users.update({
      where: { user_id: Number(id) },
      data: {
        profile_picture: {
          original: filePath || findDefUserId.profile_picture,
          thumbnail: thumbnailPath || findDefUserId.profile_thumbnail,
        },
      },
    });

    return res
      .status(200)
      .json({ message: "Profile image updated successfully." });
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.status(500).json({ error: error.message });
  }
};
