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

// utils/timeUtils.ts
const parseValidityToMs = (validity) => {
  // if (typeof validity === "number") return validity * 1000; // already seconds

  const match = /^(\d+)([mhdw])$/.exec(validity.trim().toLowerCase());
  if (!match) {
    throw new Error(
      "Invalid user_invitation_validity format. Use like '15m', '2h', '3d', '1w'."
    );
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  const multipliers = {
    m: 60 * 1000, // minutes → ms
    h: 60 * 60 * 1000, // hours → ms
    d: 24 * 60 * 60 * 1000, // days → ms
    w: 7 * 24 * 60 * 60 * 1000, // weeks → ms
  };

  return value * multipliers[unit];
};

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user, // process.env.EMAIL_USER,
    pass, // process.env.EMAIL_PASS, // generated pass
  },
});

exports.invitationViaEmail = async (req, res) => {
  try {
    const { invited_by, email, tenant_id, user_invitation_validity } = req.body;

    if (!invited_by && !email) {
      return res
        .status(400)
        .json({ error: "Inviter User ID and Invited Email required" });
    }

    const isAlreadyExistEmail = await prisma.def_users.findFirst({
      where: {
        email_address: email,
      },
    });
    const isAlreadyExistProfile = await prisma.def_access_profiles.findFirst({
      where: {
        profile_id: email,
      },
    });
    if (isAlreadyExistEmail || isAlreadyExistProfile) {
      return res
        .status(200)
        .json({ message: "This email user already exists." });
    }

    // const token = crypto.randomUUID();

    const props = { user_id: Number(invited_by), sub: String(invited_by) };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: user_invitation_validity,
    });

    const existInvitaion = await prisma.new_user_invitations.findFirst({
      where: { email, status: "PENDING", type: "EMAIL" },
    });

    if (existInvitaion && existInvitaion.expires_at > new Date()) {
      return res.status(200).json({
        invited_by: existInvitaion.invited_by,
        invitation_link: `${REACT_ENDPOINT_URL}/invitation?token=${existInvitaion.token}`,
        message: "The invitation email already exists",
      });
    } else if (existInvitaion && existInvitaion.expires_at < new Date()) {
      await prisma.new_user_invitations.update({
        where: { user_invitation_id: existInvitaion.user_invitation_id },
        data: {
          status: "EXPIRED",
        },
      });
    }

    const newInvitation = await prisma.new_user_invitations.create({
      data: {
        invited_by,
        email,
        token: encrypt(token),
        status: "PENDING",
        type: "EMAIL",
        expires_at: new Date(
          Date.now() + parseValidityToMs(user_invitation_validity)
        ),
      },
    });

    const encryptedInvitationId = encrypt(
      newInvitation.user_invitation_id.toString()
    );

    const encryptedTenantId = encrypt(tenant_id.toString());
    const encryptedToken = encrypt(token);
    const inviteLink = `${REACT_ENDPOINT_URL}/invitation/${encryptedInvitationId}/${encryptedTenantId}/${encryptedToken}`;
    // const inviteLink = `${REACT_ENDPOINT_URL}/invitation/${newInvitation.user_invitation_id}/${token}`;

    // --- Send Email ---
    if (email) {
      const res = await transporter.sendMail({
        from: `"PROCG Team" <${user}>`,
        to: email,
        subject: "You’re Invited to join PROCG",
        html: `<p>Hello,</p>
               <p>We are excited to invite you to join PROCG App!</p>
               <p>Click the link below to accept your invitation and get started:</p>
               <p><a href="${inviteLink}">Click here to register a user</a></p>
               <p>Please note, this link will expire in 1 hour.</p>
               <p>To downlod the mobile app</p>
                <p>
                  Android:
                  <a
                    className="text-blue-600 underline"
                    href="https://play.google.com/store/apps/details?id=gov.bbg.voa
"
                  >
                    PROCG Onboarding App
                  </a>
                </p>
                <p>
                  IOS:
                  <a
                    className="text-blue-600 underline"
                    href="https://apps.apple.com/app/myapp/id123456789"
                  >
                    PROCG Onboarding App
                  </a>
                </p>
               <p>We look forward to having you on board!</p>
               <p>Best regards,</p>
               <p>The PROCG Team</p>
               `,
      });
      // console.log(res, "res");
    }

    // --- Send SMS ---
    // if (phone) {
    //   await twilioClient.messages.create({
    //     body: `You’ve been invited to MyApp. Open this link: ${inviteLink}`,
    //     from: process.env.TWILIO_PHONE, // your Twilio number
    //     to: phone,
    //   });
    // }

    res.status(201).json({
      success: true,
      invitation_link: inviteLink,
      message: "The invitation was sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, message: "Something went wrong" });
  }
};

exports.invitationViaLink = async (req, res) => {
  try {
    const { invited_by, tenant_id, user_invitation_validity } = req.body;

    if (!invited_by) {
      return res.status(400).json({ error: "inviter_User ID is required" });
    }

    const props = { user_id: Number(invited_by), sub: String(invited_by) };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: user_invitation_validity,
    });

    // const invitedLink = await prisma.new_user_invitations.findFirst({
    //   where: { invited_by, status: "PENDING", type: "LINK" },
    // });

    // if (invitedLink && invitedLink.expires_at > new Date()) {
    //   return res.status(200).json({
    //     invitation_link: `${REACT_ENDPOINT_URL}/${invitedLink.user_invitation_id}/${token}`,
    //     message: "Already, you have a generated invitation link",
    //   });
    // } else if (invitedLink && invitedLink.expires_at < new Date()) {
    //   await prisma.new_user_invitations.update({
    //     where: { user_invitation_id: invitedLink.user_invitation_id },
    //     data: {
    //       status: "EXPIRED",
    //     },
    //   });
    // }

    // store in DB
    const encryptedToken = encrypt(token);
    const createdInvitation = await prisma.new_user_invitations.create({
      data: {
        invited_by,
        token: encryptedToken,
        status: "PENDING",
        type: "LINK",
        expires_at: new Date(
          Date.now() + parseValidityToMs(user_invitation_validity)
        ),
      },
    });

    if (createdInvitation) {
      const encryptedInvitationId = encrypt(
        createdInvitation.user_invitation_id.toString()
      );
      const encryptedTenantId = encrypt(tenant_id.toString());

      const inviteLink = `${REACT_ENDPOINT_URL}/invitation/${encryptedInvitationId}/${encryptedTenantId}/${encryptedToken}`;

      // generated link
      //  const inviteLink = `${REACT_ENDPOINT_URL}/invitation/${createdInvitation.user_invitation_id}/${token}`;

      return res.status(201).json({
        success: true,
        invitation_link: inviteLink,
        message: "The invitation link was generated successfully",
      });
    }
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyInvitation = async (req, res) => {
  try {
    const { user_invitation_id, token } = req.query;
    if (!token || typeof token !== "string") {
      return res
        .status(200)
        .json({ valid: false, message: "Token is missing" });
    }

    jwt.verify(token, JWT_SECRET_ACCESS_TOKEN, async (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized Access: Token has expired" });
        }
        //if token is invalid
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      const isInvited = await prisma.new_user_invitations.findFirst({
        where: {
          user_invitation_id: Number(user_invitation_id),
          invited_by: user.user_id,
        },
      });

      if (!isInvited) {
        return res
          .status(200)
          .json({ valid: false, message: "No invitation found" });
      } else if (isInvited.status === "EXPIRED") {
        return res.status(200).json({
          valid: false,
          status: isInvited.status,
          message: "The invitation has expired",
        });
      } else if (isInvited.status === "ACCEPTED") {
        return res.status(200).json({
          valid: false,
          status: isInvited.status,
          message: "The invitation has already been accepted",
        });
      } else if (
        isInvited.status === "PENDING" &&
        isInvited.expires_at < new Date()
      ) {
        await prisma.new_user_invitations.update({
          where: { user_invitation_id: isInvited.user_invitation_id },
          data: { status: "EXPIRED" },
        });
        return res
          .status(200)
          .json({ valid: false, message: "The invitation has expired" });
      } else if (
        isInvited.status === "PENDING" &&
        isInvited.expires_at > new Date()
      ) {
        return res.status(200).json({
          valid: true,
          invited_by: isInvited.invited_by,
          email: isInvited.email,
          type: isInvited.type,
          status: isInvited.status,
          invitation_link: `${REACT_ENDPOINT_URL}/invitation/${isInvited.user_invitation_id}/${token}`,
          message: "The invitation link is valid",
        });
      }
    });
  } catch (err) {
    console.error(err);
    res
      .status(200)
      .json({ valid: false, message: "Server error or invalid token" });
  }
};

// before accept invitaion verify the invitaion then accept invitaion
// response status 200 and valid: true then accept invitaion

exports.acceptInvitaion = async (req, res) => {
  try {
    const { user_invitation_id, token } = req.body;
    const {
      user_name,
      user_type,
      email,
      created_by, //invite user id
      last_updated_by, //invite user id
      tenant_id,
      first_name,
      middle_name,
      last_name,
      job_title,
      password,
    } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Token is missing" });
    } else if (!user_invitation_id) {
      return res.status(400).json({ message: "Invitation ID is missing" });
    }

    const res = await axios.post(
      `${FLASK_ENDPOINT_URL}/users`,
      {
        user_type,
        user_name,
        email_addresses: [email],
        created_by,
        last_updated_by,
        tenant_id,
        first_name,
        middle_name,
        last_name,
        job_title,
        password,
        user_invitation_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 201) {
      return res.status(201).json({
        message:
          "The invitation was accepted, and the user was created successfully",
      });
    } else {
      return res
        .status(400)
        .json({ message: "The invitation could not be accepted" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
