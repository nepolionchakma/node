const prisma = require("../DB/db.config");
const crypto = require("crypto");
const { default: axios } = require("axios");

const { FLASK_ENDPOINT_URL } = require("../Variables/variables");
//------------Hash Password Start

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
//-------------------------Hash Password End

exports.resetForgotPassword = async (req, res) => {
  const user_id = Number(req.params.user_id);
  const { request_id, temporary_password, password } = req.body;
  const userId = Number(req.user.user_id);

  //Check temporary password
  const isValidRequest = await prisma.forgot_password_requests.findFirst({
    where: {
      request_id: Number(request_id),
      request_by: userId,
      temporary_password: Number(temporary_password),
    },
  });

  if (!isValidRequest) {
    return res.status(400).json({
      isSuccess: false,
      message: "Invalid temporary password.",
    });
  }
  // verify user
  const user = await prisma.def_user_credentials.findUnique({
    where: {
      user_id: user_id,
    },
  });

  try {
    if (user) {
      const newPassword = await prisma.def_user_credentials.update({
        where: {
          user_id: Number(user_id),
        },
        data: {
          password: await hashPassword(password),
          last_update_date: new Date(),
          last_updated_by: userId,
        },
      });

      if (newPassword) {
        await prisma.forgot_password_requests.update({
          where: {
            request_id: Number(request_id),
            request_by: userId,
            temporary_password: Number(temporary_password),
          },
          data: {
            is_valid: false,
            last_updated_by: userId,
            last_updated_date: new Date(),
          },
        });

        return res
          .status(200)
          .json({ isSuccess: true, message: "Password updated successfully." });
      }
    }
  } catch (error) {
    return res.status(500).json({ isSuccess: false, error: error.message });
  }
};

exports.getDefUserCredentials = async (req, res) => {
  try {
    const result = await prisma.def_user_credentials.findMany({
      orderBy: {
        user_id: "desc",
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Get Unique defUserCredentials
exports.getUniqueDefUserCredentials = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: Number(user_id),
      },
    });
    if (result) {
      return res.status(200).json({ result });
    } else {
      return res.status(404).json({ message: "User Credentials not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
//Create User
exports.createDefUserCredential = async (req, res) => {
  try {
    // Validation  START/---------------------------------/
    const user_data = req.body;
    const DefUsers = await prisma.def_user_credentials.findMany();
    const id =
      DefUsers.length > 0
        ? Math.max(...DefUsers.map((item) => item.user_id)) + 1
        : 1;
    const result = await prisma.def_user_credentials.create({
      data: {
        user_id: id,
        password: await hashPassword(user_data.password),
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const user_id = Number(req.params.user_id);
  const data = req.body;

  // verify user
  const findDefUserId = await prisma.def_user_credentials.findUnique({
    where: {
      user_id: user_id,
    },
  });

  try {
    if (findDefUserId) {
      const result = await axios.put(
        `${FLASK_ENDPOINT_URL}/reset_user_password`,
        data
      );
      if (result.status === 200) {
        return res.status(200).json({ message: "Password reset successful" });
      }
    }
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ message: "Invalid old password" });
    }
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDefUserCredential = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const findDefUserId = await prisma.def_user_credentials.findUnique({
      where: {
        user_id: user_id,
      },
    });
    if (findDefUserId) {
      await prisma.def_user_credentials.delete({
        where: {
          user_id: user_id,
        },
      });
      return res.status(200).json({ result: "Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Def User Credential not found." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
