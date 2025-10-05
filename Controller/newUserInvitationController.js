const prisma = require("../DB/db.config");
const nodemailer = require("nodemailer");
const axios = require("axios");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const baseUrl = "https://procg.datafluent.team/invitation";
const user = "nepolion.datafluent.team@gmail.com";
const pass = "qgpx iwbl xozo tbjg";

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;
const INVITATION_ACCESS_TOKEN_EXPIRED_TIME =
  process.env.INVITATION_ACCESS_TOKEN_EXPIRED_TIME;

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user, // process.env.EMAIL_USER,
    pass, // process.env.EMAIL_PASS, // generated pass
  },
});

exports.invitaionViaEmail = async (req, res) => {
  try {
    const { invited_by, email } = req.body;

    if (!invited_by && !email) {
      return res
        .status(400)
        .json({ error: "Inviter User ID and Invited Email required" });
    }

    const isAlreadyExistEmail = await prisma.def_users.findFirst({
      where: {
        email_addresses: {
          array_contains: email,
        },
      },
    });
    if (isAlreadyExistEmail) {
      return res
        .status(200)
        .json({ message: "This email user already exists." });
    }

    // const token = crypto.randomUUID();

    const props = { user_id: Number(invited_by) };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: INVITATION_ACCESS_TOKEN_EXPIRED_TIME,
    });

    const existInvitaion = await prisma.new_user_invitations.findFirst({
      where: { email, status: "pending", type: "email" },
    });

    if (existInvitaion && existInvitaion.expires_at > new Date()) {
      return res.status(200).json({
        invited_by: existInvitaion.invited_by,
        invitation_link: `${baseUrl}?token=${existInvitaion.token}`,
        message: "The invitation email already exists",
      });
    } else if (existInvitaion && existInvitaion.expires_at < new Date()) {
      await prisma.new_user_invitations.update({
        where: { user_invitation_id: existInvitaion.user_invitation_id },
        data: {
          status: "expired",
        },
      });
    }

    const newInvitation = await prisma.new_user_invitations.create({
      data: {
        invited_by,
        email,
        token,
        status: "pending",
        type: "email",
      },
    });

    const inviteLink = `${baseUrl}/${newInvitation.user_invitation_id}/${token}`;

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
               <p>Please note, this link will expire in 5 days.</p>
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

exports.invitaionViaLink = async (req, res) => {
  try {
    const { invited_by } = req.body;

    if (!invited_by) {
      return res.status(400).json({ error: "inviter_User ID is required" });
    }

    const props = { user_id: Number(invited_by) };
    const token = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: INVITATION_ACCESS_TOKEN_EXPIRED_TIME,
    });

    const invitedLink = await prisma.new_user_invitations.findFirst({
      where: { invited_by, status: "pending", type: "link" },
    });

    if (invitedLink && invitedLink.expires_at > new Date()) {
      return res.status(200).json({
        invitation_link: `${baseUrl}/${invitedLink.user_invitation_id}/${token}`,
        message: "Already, you have a generated invitation link",
      });
    } else if (invitedLink && invitedLink.expires_at < new Date()) {
      await prisma.new_user_invitations.update({
        where: { user_invitation_id: invitedLink.user_invitation_id },
        data: {
          status: "expired",
        },
      });
    }

    // store in DB
    const createdInvitation = await prisma.new_user_invitations.create({
      data: { invited_by, token, status: "pending", type: "link" },
    });

    // generated link
    const inviteLink = `${baseUrl}/${createdInvitation.user_invitation_id}/${token}`;

    return res.status(201).json({
      success: true,
      invitation_link: inviteLink,
      message: "The invitation link was generated successfully",
    });
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
          token,
        },
      });

      if (!isInvited) {
        return res
          .status(200)
          .json({ valid: false, message: "No invitation found" });
      } else if (isInvited.status === "expired") {
        return res
          .status(200)
          .json({ valid: false, message: "The invitation has expired" });
      } else if (isInvited.status === "accepted") {
        return res.status(200).json({
          valid: false,
          message: "The invitation has already been accepted",
        });
      } else if (
        isInvited.status === "pending" &&
        isInvited.expires_at < new Date()
      ) {
        await prisma.new_user_invitations.update({
          where: { user_invitation_id: isInvited.user_invitation_id },
          data: { status: "expired" },
        });
        return res
          .status(200)
          .json({ valid: false, message: "The invitation has expired" });
      } else if (
        isInvited.status === "pending" &&
        isInvited.expires_at > new Date()
      ) {
        return res.status(200).json({
          valid: true,
          invited_by: isInvited.invited_by,
          email: isInvited.email,
          type: isInvited.type,
          invitation_link: `${baseUrl}/${isInvited.user_invitation_id}/${token}`,
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
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 201) {
      await prisma.new_user_invitations.update({
        where: { user_invitation_id: Number(user_invitation_id) },
        data: {
          registered_user_id: res.data.user_id,
          status: "accepted",
          accepted_at: new Date(),
        },
      });

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
