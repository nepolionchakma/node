const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const prisma = require("../../DB/db.config");

exports.setupTotpMfa = async (userId, mfa_type) => {
  const secret = speakeasy.generateSecret({ name: "PRO-CG", length: 20 });

  const result = await prisma.def_user_mfas.create({
    // where: {
    //   user_id_mfa_type: { user_id: userId, mfa_type: mfa_type },
    // },
    // update: {
    //   mfa_secret: secret.base32,
    //   mfa_enabled: false,
    // },
    data: {
      user_id: userId,
      mfa_type: mfa_type,
      identifier: mfa_type,
      mfa_enabled: false,
      metadata: secret,
      mfa_secret: secret.base32,
    },
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  return { result, qrCode };
};

exports.upsertMfa = async (userId, mfa_type) => {
  const secret = speakeasy.generateSecret({ name: "PRO-CG", length: 20 });

  const result = await prisma.def_user_mfas.upsert({
    where: {
      user_id_mfa_type: { user_id: userId, mfa_type: mfa_type },
    },
    update: {
      mfa_secret: secret.base32,
      mfa_enabled: false,
    },
    data: {
      user_id: userId,
      mfa_type: mfa_type,
      identifier: mfa_type,
      mfa_enabled: false,
      metadata: secret,
      mfa_secret: secret.base32,
    },
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  return { result, qrCode };
};

exports.verifyTotp = (secret, token) =>
  speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
