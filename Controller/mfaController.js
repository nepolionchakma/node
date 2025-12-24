const prisma = require("../DB/db.config");
const currentDate = new Date().toLocaleString();
const { FLASK_ENDPOINT_URL } = require("../Variables/variables");
const { setupTotpMfa, verifyTotp } = require("../Services/MFA/mfa_service");

exports.setupTOTP = async (req, res) => {
  const { mfa_type } = req.body;
  try {
    const data = await setupTotpMfa(req.user.user_id, mfa_type);
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

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

  res.status(200).json({ message: "MFA enabled" });
};
