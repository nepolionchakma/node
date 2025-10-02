const prisma = require("../DB/db.config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const baseUrl = "https://procg.datafluent.team/invitation";
const user = "nepolion.datafluent.team@gmail.com";
const pass = "qgpx iwbl xozo tbjg";

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user, // process.env.EMAIL_USER,
    pass, // process.env.EMAIL_PASS, // generated pass
  },
});

const verifyInvitation = async (token) => {
  if (!token || typeof token !== "string") {
    return { valid: false, message: "Token missing" };
  }

  const invite = await prisma.def_invitations.findUnique({ where: { token } });

  if (!invite) {
    return { valid: false, message: "Invalid invite" };
  }

  if (invite.expires_at < new Date()) {
    await prisma.def_invitations.update({
      where: { token },
      data: { status: "expired" },
    });
    return { valid: false, message: "Invite expired" };
  }

  return {
    valid: true,
    invited_by: invite.invited_by,
    invited_email: invite.invited_email,
    message: "Invitation link is valid",
  };
};

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(8).toString("hex");
    const iterations = 600000;
    const keyLength = 32;
    const digest = "sha256";

    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) return reject(err);

        const formattedHash = `pbkdf2:${digest}:${iterations}$${salt}$${derivedKey.toString(
          "hex"
        )}`;
        resolve(formattedHash);
      }
    );
  });
};

// SMS setup (Twilio)
// const twilioClient = twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

exports.invitaionViaEmail = async (req, res) => {
  try {
    const { invited_by, invited_email } = req.body;

    if (!invited_by && !invited_email) {
      return res
        .status(400)
        .json({ error: "Inviter User ID and Invited Email required" });
    }

    const token = crypto.randomUUID();
    // const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const existInvitaion = await prisma.def_invitations.findFirst({
      where: { invited_email, status: "pending" },
    });

    if (existInvitaion && existInvitaion.expires_at > new Date()) {
      return res.status(200).json({
        invited_by: existInvitaion.invited_by,
        invitation_link: `${baseUrl}?token=${existInvitaion.token}`,
        message: "The invitation email already exists",
      });
    }
    if (existInvitaion && existInvitaion.expires_at < new Date()) {
      await prisma.def_invitations.update({
        where: { id: existInvitaion.id },
        data: {
          status: "expired",
        },
      });
    }

    await prisma.def_invitations.create({
      data: {
        invited_by,
        invited_email,
        token,
        status: "pending",
        type: "email",
      },
    });

    const inviteLink = `${baseUrl}?token=${token}`;

    // --- Send Email ---
    if (invited_email) {
      const res = await transporter.sendMail({
        from: `"PROCG Team" <${user}>`,
        to: invited_email,
        subject: "You’re Invited to join PROCG",
        html: `<p>Hello,</p>
               <p>We are excited to invite you to join PROCG App!</p>
               <p>Click the link below to accept your invitation and get started:</p>
               <p><a href="${inviteLink}">Click here to accept invite</a></p>
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
      message: "The invitation sent successfully",
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
    const token = crypto.randomUUID();

    const invitedLinks = await prisma.def_invitations.findFirst({
      where: { invited_by, status: "pending" },
    });

    if (invitedLinks && invitedLinks.expires_at > new Date()) {
      return res.status(200).json({
        invitation_link: `${baseUrl}?token=${invitedLinks.token}`,
        message: "Already you have a generated invitation link",
      });
    }

    if (invitedLinks && invitedLinks.expires_at < new Date()) {
      await prisma.def_invitations.update({
        where: { id: invitedLinks.id },
        data: {
          status: "expired",
        },
      });
    }

    // store in DB
    await prisma.def_invitations.create({
      data: { invited_by, token, status: "pending", type: "link" },
    });

    // generate link
    const inviteLink = `${baseUrl}?token=${token}`;

    return res.status(201).json({
      success: true,
      invitation_link: inviteLink,
      message: "The invitation link generated successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyInvitation = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(200).json({ valid: false, message: "Token missing" });
    }

    const invite = await prisma.def_invitations.findFirst({ where: { token } });
    if (!invite) {
      return res
        .status(200)
        .json({ valid: false, message: "No invitation found" });
    }

    if (invite.status === "expired") {
      return res
        .status(200)
        .json({ valid: false, message: "The invitation has expired" });
    }
    if (invite.status === "accepted") {
      return res.status(200).json({
        valid: false,
        message: "The invitation has already been accepted",
      });
    }

    if (invite.status === "pending" && invite.expires_at < new Date()) {
      await prisma.def_invitations.update({
        where: { token },
        data: { status: "expired" },
      });
      return res
        .status(200)
        .json({ valid: false, message: "The invitation has expired" });
    }

    if (invite.status === "pending" && invite.expires_at > new Date()) {
      return res.status(200).json({
        valid: true,
        invited_by: invite.invited_by,
        invited_email: invite.invited_email,
        type: invite.type,
        invitation_link: `${baseUrl}?token=${invite.token}`,
        message: "The invitation link is valid",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(200).json({ valid: false, message: "Server error" });
  }
};

// before accept invitaion verify the invitaion then accept invitaion
// response status 200 and valid: true then accept invitaion

exports.acceptInvitaion = async (req, res) => {
  try {
    const { token } = req.query;
    const {
      user_name,
      user_type,
      created_by, //invite user id
      last_updated_by, //invite user id
      tenant_id,
      first_name,
      middle_name,
      last_name,
      job_title,
      password,
    } = req.body;

    // const invite = await verifyInvitation(token);

    // if (!invite.valid) {
    //   return res.status(400).json({ message: invite.message });
    // }
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Token missing" });
    }
    const tokenEmail = await prisma.def_invitations.findFirst({
      where: { token },
    });

    const usernameAndEmailCheck = await prisma.def_users.findFirst({
      where: {
        OR: [
          { user_name: user_name },
          { email_addresses: { array_contains: tokenEmail.invited_email } },
        ],
      },
    });

    if (usernameAndEmailCheck) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const profile_picture = {
      original: "uploads/profiles/default/profile.jpg",
      thumbnail: "uploads/profiles/default/thumbnail.jpg",
    };
    const maxUserIDResult = await prisma.def_users.aggregate({
      _max: {
        user_id: true,
      },
    });

    const maxId = maxUserIDResult._max.user_id + 1;
    const [user, person, credentials] = await Promise.all([
      prisma.def_users.create({
        data: {
          user_id: maxId,
          user_name,
          user_type,
          email_addresses: [tokenEmail.invited_email],
          created_by,
          last_updated_by,
          tenant_id,
          profile_picture,
          created_on: new Date().toString(),
          last_updated_on: new Date().toString(),
        },
      }),
      prisma.def_persons.create({
        data: {
          user_id: maxId,
          first_name,
          middle_name,
          last_name,
          job_title,
        },
      }),
      prisma.def_user_credentials.create({
        data: {
          user_id: maxId,
          password: await hashPassword(password),
        },
      }),
    ]);

    await prisma.def_invitations.update({
      where: { token },
      data: { status: "accepted" },
    });

    return res.status(201).json({
      message: "The invitation accepted and user created successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
