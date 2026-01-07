const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const {
  JWT_SECRET_ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED_TIME,
  JWT_SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED_TIME,
  JWT_SECRET_MFA_TOKEN = "sdfhkhfsd",
  MFA_TOKEN_EXPIRED_TIME = "30m",
  MAILER_USER,
  MAILER_PASS,
} = require("../Variables/variables");
const { verifyTotp } = require("../Services/MFA/mfa_service");

dotenv.config();

//Generate access token and refresh token
const generateAccessTokenAndRefreshToken = (props) => {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIME,
  });
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIME,
  });
  return { accessToken, refreshToken };
};

const generateMfaToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_MFA_TOKEN, {
    expiresIn: MFA_TOKEN_EXPIRED_TIME,
  });
};

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user: MAILER_USER, // process.env.EMAIL_USER,
    pass: MAILER_PASS, // process.env.EMAIL_PASS,
  },
});

// Login
exports.login = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  //------------------ Verify password
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
  //-------------------------
  try {
    const userRecord = await prisma.def_users.findFirst({
      where: {
        OR: [{ email_address: user }, { user_name: user }],
      },
    });

    const userProfile = await prisma.def_access_profiles.findFirst({
      where: {
        profile_id: user,
      },
    });
    if (!userRecord && !userProfile) {
      res.status(404).json({ message: "Invalid User." });
    } else {
      const userId = userRecord?.user_id || userProfile?.user_id;

      const userCredential = await prisma.def_user_credentials.findFirst({
        where: {
          user_id: Number(userId),
        },
      });

      const passwordResult = await verifyPassword(
        userCredential.password,
        password
      );
      if (!passwordResult) {
        return res.status(401).json({ message: "Invalid Credentials." });
      }

      const mfaCheck = await prisma.def_user_mfas.findFirst({
        where: {
          user_id: Number(userId),
          mfa_enabled: true,
        },
      });
      // console.log(mfaCheck, "mfaCheck");
      if (mfaCheck?.mfa_enabled) {
        /* ---------- CHECK MFA ---------- */
        const mfaList = await prisma.def_user_mfas.findMany({
          where: {
            user_id: userRecord.user_id,
            mfa_enabled: true,
          },
        });
        /* ---------- MFA REQUIRED ---------- */
        if (mfaList.length > 0) {
          // console.log(mfaList, "mfaList");
          const mfaToken = generateMfaToken({
            user_id: userRecord.user_id,
            purpose: "MFA_LOGIN",
          });

          return res.status(200).json({
            mfa_required: true,
            mfa_token: mfaToken,
            mfa_methods: mfaList.map((m) => ({
              mfa_id: m.mfa_id,
              mfa_type: m.mfa_type,
            })),
            message: "MFA verification required",
          });
        }
        return;
        /* ---------- NO MFA → NORMAL LOGIN ---------- */
      }
      // console.log("break the wall");
      // const encryptedPassword = hashPassword(password);
      if (userCredential && passwordResult) {
        // if (userCredential && userCredential.password === encryptedPassword) {
        const { accessToken, refreshToken } =
          generateAccessTokenAndRefreshToken({
            isLoggedIn: true,
            user_id: Number(userId),
            sub: String(userId),
            // user_type: user.user_type,
            // user_name: user.user_name,
            // tenant_id: user.tenant_id,
            // profile_picture: user.profile_picture,
            // issuedAt: new Date(),
          });

        return res
          .status(200)
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
          })
          .json({
            isLoggedIn: true,
            user_id: Number(userId),
            // user_type: user.user_type,
            // user_name: user.user_name,
            // tenant_id: user.tenant_id,
            // profile_picture: user.profile_picture,
            access_token: accessToken,
            refresh_token: refreshToken,
            message: "Log in Successful.",
            // issuedAt: new Date(),
          });
      } else {
        return res.status(401).json({ message: "Invalid credential" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* -------- VERIFY MFA -------- */
exports.verifyMFALogin = async (req, res) => {
  // console.log("first");
  const mfa_token = req.body.mfa_token;
  const otp = req.body.otp;
  const mfa_id = Number(req.body.mfa_id);
  // console.log({ mfa_token, otp, mfa_id }, "MFA body 182 line");
  if (!mfa_token || !otp || !mfa_id)
    return res.status(400).json({ message: "Missing MFA data" });

  try {
    const decoded = jwt.verify(mfa_token, JWT_SECRET_MFA_TOKEN);
    // console.log(decoded, "decode 188 line");
    if (decoded.purpose !== "MFA_LOGIN")
      return res.status(403).json({ message: "Invalid MFA token" });

    const mfa = await prisma.def_user_mfas.findFirst({
      where: {
        mfa_id,
        user_id: decoded.user_id,
        mfa_enabled: true,
      },
    });
    // console.log(mfa, "mfa 199 line");
    if (!mfa) return res.status(404).json({ message: "MFA not found" });

    const valid = verifyTotp(mfa.mfa_secret, otp);
    // console.log(valid, "valid 203 line");
    if (!valid)
      return res.status(400).json({ message: "Invalid MFA TOTP code" });

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: decoded.user_id,
      sub: String(decoded.user_id),
      mfa_verified: true,
    });
    // console.log(
    //   accessToken,
    //   refreshToken,
    //   "accessToken and refreshToken 212 line"
    // );
    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .json({
        isLoggedIn: true,
        user_id: decoded.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
        message: "MFA verification successful",
      });
  } catch (err) {
    // console.log(err, "err line 234");
    return res.status(401).json({ message: "MFA token expired/invalid" });
  }
};

exports.sendEmailMfaCode = async (req, res) => {
  const { mfa_token } = req.body;

  const decoded = jwt.verify(mfa_token, JWT_SECRET_MFA_TOKEN);

  if (decoded.purpose !== "MFA_LOGIN")
    return res.status(403).json({ message: "Invalid token" });
  const user = await prisma.def_users.findUnique({
    where: {
      user_id: decoded.user_id,
    },
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  const otp = crypto.randomInt(100000, 999999);

  try {
    await prisma.def_user_mfa_email_codes.create({
      data: {
        user_id: decoded.user_id,
        otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Send email
    const mail = await transporter.sendMail({
      from: `"PROCG Team" <${MAILER_USER}>`,
      to: user.email_address,
      subject: "Your Login Verification Code",
      html: `<p>Hello,</p>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
            <p>Best regards,</p>
            <p>The PROCG Team</p>
            `,
    });
    console.log(mail, "mail sent");
    res
      .status(200)
      .json({ message: "OTP sent to email", email: user.email_address });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

exports.verifyEmailedMfaCode = async (req, res) => {
  const { mfa_token, otp } = req.body;

  const decoded = jwt.verify(mfa_token, JWT_SECRET_MFA_TOKEN);

  if (decoded.purpose !== "MFA_LOGIN")
    return res.status(403).json({ message: "Invalid token" });

  try {
    const storedCode = await prisma.def_user_mfa_email_codes.findFirst({
      where: {
        user_id: decoded.user_id,
        otp,
        expires_at: { gt: new Date() },
        is_validated: false,
      },
    });

    if (!storedCode) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: decoded.user_id,
      sub: String(decoded.user_id),
      mfa_verified: true,
    });

    await prisma.def_user_mfa_email_codes.update({
      where: { mfa_id: storedCode.mfa_id },
      data: {
        last_verified_at: new Date(),
        updated_at: new Date(),
        is_validated: true,
      },
    });

    return res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
      })
      .json({
        isLoggedIn: true,
        user_id: decoded.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
        message: "MFA verification successful",
      });
  } catch (err) {
    return res.status(401).json({ message: "MFA token expired/invalid" });
  }
};

// Logout
exports.logout = (req, res) => {
  try {
    return res
      .status(200)
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//User
exports.user = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// refresh token
exports.refreshToken = async (req, res) => {
  const refreshTokenValue =
    req.cookies?.refresh_token ||
    req.body?.refresh_token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!refreshTokenValue) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    jwt.verify(
      refreshTokenValue,
      JWT_SECRET_REFRESH_TOKEN,
      async (err, user) => {
        if (err) {
          //if token expired
          if (err.name === "TokenExpiredError") {
            return res
              .status(401)
              .clearCookie("access_token")
              .clearCookie("refresh_token")
              .json({ message: "Unauthorized Access: Token has expired" });
          }
          //if token is invalid
          return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        const response = await prisma.def_users.findUnique({
          where: {
            user_id: user?.user_id,
          },
        });
        if (!response) {
          return res
            .status(401)
            .json({ message: "Invalid or expired refresh token" });
        }
        // Generate new access token and refresh token
        const { accessToken, refreshToken } =
          generateAccessTokenAndRefreshToken({
            isLoggedIn: true,
            user_id: user.user_id,
            sub: String(user.user_id),
            // user_type: user.user_type,
            // user_name: user.user_name,
            // tenant_id: user.tenant_id,
            // profile_picture: user.profile_picture,
            // issuedAt: new Date(),
          });

        return res
          .status(200)
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: false,
          })
          .json({
            isLoggedIn: true,
            user_id: user.user_id,
            // user_type: user.user_type,
            // user_name: user.user_name,
            // tenant_id: user.tenant_id,
            // profile_picture: user.profile_picture,
            access_token: accessToken,
            refresh_token: refreshToken,
            // issuedAt: new Date(),
          });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Invalid or expired refresh token" });
  }
};

// exports.verifyToken = async (req, res) => {
//   const { token } = req.body;

//   try {
//     const decoded = jwtDecode(token);

//   } catch (error) {
//     console.error("Invalid token:", error);
//   }
// };

exports.verifyToken = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.decode(token);
    const user = await prisma.def_users.findFirst({
      where: {
        user_id: decoded.user_id,
        // user_name: decoded.user_name,
        // tenant_id: decoded.tenant_id,
        // user_type: decoded.user_type,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Token." });
    } else {
      const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
        isLoggedIn: true,
        user_id: user.user_id,
        sub: String(user.user_id),
        // user_type: user.user_type,
        // user_name: user.user_name,
        // tenant_id: user.tenant_id,
        // profile_picture: user.profile_picture,
        // issuedAt: new Date(),
      });

      return res
        .status(200)
        .cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .cookie("access_token", accessToken, {
          httpOnly: true,
          secure: false,
        })
        .json({
          isLoggedIn: true,
          user_id: user.user_id,
          // user_type: user.user_type,
          // user_name: user.user_name,
          // tenant_id: user.tenant_id,
          // profile_picture: user.profile_picture,
          access_token: accessToken,
          refresh_token: refreshToken,
          // issuedAt: new Date(),
        });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
