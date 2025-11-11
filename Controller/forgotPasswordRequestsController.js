const prisma = require("../DB/db.config");
const nodemailer = require("nodemailer");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const user = "nepolion.datafluent.team@gmail.com";
const pass = "qgpx iwbl xozo tbjg";
const CryptoJS = require("crypto-js");

const {
  JWT_SECRET_ACCESS_TOKEN,
  REACT_ENDPOINT_URL,
  CRYPTO_SECRET_KEY,
  ACCESS_TOKEN_EXPIRED_TIME,
} = require("../Variables/variables");

const encrypt = (value) => {
  if (typeof value !== "string") {
    throw new Error("Value must be a string to encrypt");
  }

  // Encrypt
  const ciphertext = CryptoJS.AES.encrypt(value, CRYPTO_SECRET_KEY).toString();

  // Make it URL-safe
  return encodeURIComponent(ciphertext);
};

const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user, // process.env.EMAIL_USER,
    pass, // process.env.EMAIL_PASS, // generated pass
  },
});

exports.createRequest = async (req, res) => {
  try {
    const { user_name, email_address, tenant_id, job_title } = req.body;

    if (!user_name || !email_address || !tenant_id || !job_title) {
      return res.status(400).json({
        error: "Username, Email, Tenant ID, and Job Title are required.",
      });
    }

    const user = await prisma.def_users_v.findFirst({
      where: {
        user_name: {
          equals: user_name,
          mode: "insensitive", // 👈 makes it case-insensitive
        },
        email_address,
        tenant_id: Number(tenant_id),
        job_title,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid input.",
      });
    }

    const props = { user_id: Number(user.user_id), sub: String(user.user_id) };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: ACCESS_TOKEN_EXPIRED_TIME,
    });

    const encryptedToken = encrypt(token);

    const newRequest = await prisma.forgot_password_requests.create({
      data: {
        request_by: user.user_id,
        email: user.email_address,
        temporary_password: Math.floor(10000000 + Math.random() * 90000000),
        access_token: encryptedToken,
        created_by: Number(user.user_id),
        last_updated_by: Number(user.user_id),
      },
    });

    if (newRequest) {
      const encryptedRequesId = encrypt(newRequest.request_id.toString());
      const encryptedUserId = encrypt(user.user_id.toString());

      const setPasswordLink = `${REACT_ENDPOINT_URL}/reset-password/${encryptedRequesId}/${encryptedUserId}/${encryptedToken}`;

      if (email_address) {
        await transporter.sendMail({
          from: `"PROCG Team" <${user}>`,
          to: email_address,
          subject: "You’re invited to reset your password",
          html: `<p>Hello,</p>
               <p>The temporary password is: ${newRequest.temporary_password}</p>
               <p>Use the temporary password to reset your password.</p>
               <p>Click the link below to reset your password</p>
               <p><a href="${setPasswordLink}">Click Here</a></p>
               <p>Best regards,</p>
               <p>The PROCG Team</p>
               `,
        });
      }

      res.status(201).json({
        success: true,
        message: "Please check your email to reset your password.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
