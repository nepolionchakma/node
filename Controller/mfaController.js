const prisma = require("../DB/db.config");
const { setupTotpMfa, verifyTotp } = require("../Services/MFA/mfa_service");

exports.getMFAList = async (req, res) => {
  try {
    const mfaList = await prisma.def_user_mfas.findMany({
      where: { user_id: req.user.user_id, mfa_enabled: true },
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
  try {
    const data = await setupTotpMfa(req.user.user_id, mfa_type);
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

exports.verify = async (req, res) => {
  const { otp, mfa_id, mfa_type } = req.body;

  const mfa = await prisma.def_user_mfas.findFirst({
    where: { user_id: req.user.user_id, mfa_id, mfa_type },
  });

  if (!mfa) return res.status(404).json({ message: "MFA not found" });

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

  await prisma.def_user_mfas.update({
    where: { mfa_id: mfa.mfa_id },
    data: {
      mfa_enabled: true,
      is_primary: true,
      last_verified_at: new Date(),
    },
  });

  return res.status(200).json({ message: "MFA enabled" });
};

exports.deleteMFA = async (req, res) => {
  const { mfa_id } = req.body;
  try {
    const mfa = await prisma.def_user_mfas.delete({
      where: { user_id: req.user.user_id, mfa_id },
    });
    if (mfa) return res.status(200).json({ message: "MFA deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
