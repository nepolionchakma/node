const prisma = require("../DB/db.config");
const nodemailer = require("nodemailer");
// const axios = require("axios");
const jwt = require("jsonwebtoken");

const CryptoJS = require("crypto-js");

const {
  JWT_SECRET_ACCESS_TOKEN,
  REACT_ENDPOINT_URL,
  CRYPTO_SECRET_KEY,
  MAILER_USER,
  MAILER_PASS,
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
    user: MAILER_USER, // process.env.EMAIL_USER,
    pass: MAILER_PASS, // process.env.EMAIL_PASS, // generated pass
  },
});

exports.createRequest = async (req, res) => {
  try {
    const { user_name, email_address, tenant_id, job_title, validity } =
      req.body;

    if (!user_name || !email_address || !tenant_id || !job_title) {
      return res.status(400).json({
        error: "Username, Email, Tenant ID, and Job Title are required.",
      });
    }

    const userInfo = await prisma.def_users_v.findFirst({
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

    if (!userInfo) {
      return res.status(400).json({
        message: "Invalid input.",
      });
    }

    const props = {
      user_id: Number(userInfo.user_id),
      sub: String(userInfo.user_id),
    };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: validity,
    });

    const encryptedToken = encrypt(token);

    const newRequest = await prisma.forgot_password_requests.create({
      data: {
        request_by: userInfo.user_id,
        email: userInfo.email_address,
        temporary_password: Math.floor(10000000 + Math.random() * 90000000),
        access_token: encryptedToken,
        created_by: Number(userInfo.user_id),
        last_updated_by: Number(userInfo.user_id),
      },
    });

    if (newRequest) {
      const encryptedRequesId = encrypt(newRequest.request_id.toString());
      const encryptedUserId = encrypt(userInfo.user_id.toString());

      const setPasswordLink = `${REACT_ENDPOINT_URL}/reset-password/${encryptedRequesId}/${encryptedUserId}/${encryptedToken}`;

      if (email_address) {
        await transporter.sendMail({
          from: `"PROCG Team" <${MAILER_USER}>`,
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

exports.verifyRequest = async (req, res) => {
  try {
    const { request_id, token } = req.query;
    if (!token || typeof token !== "string") {
      return res
        .status(200)
        .json({ valid: false, message: "Token is missing" });
    }

    jwt.verify(token, JWT_SECRET_ACCESS_TOKEN, async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Unauthorized Access: Token has expired",
            valid: false,
          });
        }
        //if token is invalid
        return res
          .status(403)
          .json({ message: "Forbidden: Invalid token", valid: false });
      }

      const request = await prisma.forgot_password_requests.findFirst({
        where: {
          request_id: Number(request_id),
          request_by: user.user_id,
        },
      });

      if (!request) {
        return res
          .status(200)
          .json({ valid: false, message: "No request found" });
      } else {
        return res.status(200).json({
          valid: true,
          message: "The request is valid",
          result: request,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, valid: false });
  }
};
