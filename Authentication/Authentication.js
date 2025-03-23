const prisma = require("../DB/db.config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN;
const ACCESS_TOKEN_EXPIRED_TIME = process.env.ACCESS_TOKEN_EXPIRED_TIME;
const REFRESH_TOKEN_EXPIRED_TIME = process.env.REFRESH_TOKEN_EXPIRED_TIME;

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

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
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
    const user = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: email,
        },
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
    } else {
      const userCredential = await prisma.def_user_credentials.findUnique({
        where: {
          user_id: user.user_id,
        },
      });
      const passwordResult = await verifyPassword(
        userCredential.password,
        password
      );
      if (!passwordResult) {
        return res.status(401).json({ message: "Invalid password." });
      }
      console.log({ passwordResult });
      // const encryptedPassword = hashPassword(password);
      if (userCredential && passwordResult) {
        // if (userCredential && userCredential.password === encryptedPassword) {
        const { accessToken, refreshToken } =
          generateAccessTokenAndRefreshToken({
            isLoggedIn: true,
            user_id: user.user_id,
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            profile_picture: user.profile_picture,
            issuedAt: new Date(),
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
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            profile_picture: user.profile_picture,
            access_token: accessToken,
            refresh_token: refreshToken,
            issuedAt: new Date(),
          });
      } else {
        return res.status(401).json({ message: "Invalid credential" });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            profile_picture: user.profile_picture,
            issuedAt: new Date(),
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
            user_type: user.user_type,
            user_name: user.user_name,
            tenant_id: user.tenant_id,
            profile_picture: user.profile_picture,
            access_token: accessToken,
            refresh_token: refreshToken,
            issuedAt: new Date(),
          });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Invalid or expired refresh token" });
  }
};
