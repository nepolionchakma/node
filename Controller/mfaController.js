const prisma = require("../DB/db.config");
const { setupTotpMfa, verifyTotp } = require("../Services/MFA/mfa_service");
const crypto = require("crypto");

exports.getMFAList = async (req, res) => {
  try {
    const mfaList = await prisma.def_user_mfas.findMany({
      where: {
        user_id: req.user.user_id,
        // mfa_enabled: true,
        is_validated: true,
      },
    });
    // console.log(mfaList, "mfalist");
    return res.status(200).json({ result: mfaList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.checkIsMFAEnabled = async (req, res) => {
  try {
    const mfa = await prisma.def_user_mfas.findFirst({
      where: { user_id: req.user.user_id, mfa_enabled: true },
    });
    if (mfa) return res.status(200).json({ result: mfa, mfa_enabled: true });
  } catch (error) {
    return res.status(500).json({ error: error.message, mfa_enabled: false });
  }
};

exports.setupTOTP = async (req, res) => {
  const { mfa_type } = req.body;
  const user_id = req.user.user_id;
  try {
    const data = await setupTotpMfa(user_id, mfa_type);
    // console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// exports.upsertMFA = async (req, res) => {
//   const { mfa_id, mfa_type } = req.body;
//   try {
//   } catch (error) {}
// };

exports.verifyOTP = async (req, res) => {
  const { otp, mfa_id, mfa_type, identifier } = req.body;

  const mfa = await prisma.def_user_mfas.findFirst({
    where: { user_id: req.user.user_id, mfa_id, mfa_type },
  });

  if (!mfa) return res.status(404).json({ message: "MFA record not found" });

  const valid = verifyTotp(mfa.mfa_secret, otp);

  if (!valid) {
    await prisma.def_user_mfas.update({
      where: { mfa_id: mfa.mfa_id },
      data: {
        failed_attempts: mfa.failed_attempts + 1,
      },
    });
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const updatedMFA = await prisma.def_user_mfas.update({
    where: { mfa_id: mfa.mfa_id },
    data: {
      mfa_enabled: true,
      is_primary: true,
      is_validated: true,
      identifier,
      last_verified_at: new Date(),
    },
  });

  return res.status(200).json({ result: updatedMFA, message: "MFA enabled" });
};

exports.checkPassword = async (req, res) => {
  const { password } = req.body;

  const verifyPassword = (storedData, password) => {
    return new Promise((resolve, reject) => {
      const [, digest, iterations, salt, storedHash] = storedData.split(/[:$]/);

      const iterationsNumber = parseInt(iterations, 10);

      crypto.pbkdf2(
        password,
        salt,
        iterationsNumber,
        32,
        digest,
        (err, derivedKey) => {
          if (err) return reject(err);

          const isMatch = storedHash === derivedKey.toString("hex");
          resolve(isMatch);
        }
      );
    });
  };

  try {
    const userCredential = await prisma.def_user_credentials.findFirst({
      where: { user_id: req.user.user_id },
    });

    const passwordResult = await verifyPassword(
      userCredential.password,
      password
    );
    if (!passwordResult) {
      return res.status(401).json({ message: "Invalid Credentials." });
    }

    return res
      .status(200)
      .json({ message: "Password matched", is_valid_password: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.switchMFA = async (req, res) => {
  const { mfa_id, mfa_enabled } = req.body;
  const user_id = req.user.user_id;
  try {
    const mfa = await prisma.def_user_mfas.update({
      where: { user_id, mfa_id },
      data: {
        mfa_enabled,
        updated_at: new Date(),
      },
    });
    if (mfa)
      return res
        .status(200)
        .json({ message: `MFA ${mfa_enabled ? "Enabled" : "Disabled"}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteMFA = async (req, res) => {
  const { mfa_id } = req.body;
  try {
    const mfa = await prisma.def_user_mfas.delete({
      where: { user_id: req.user.user_id, mfa_id },
    });
    if (mfa)
      return res.status(200).json({ message: "MFA record has been deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
