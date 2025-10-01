const prisma = require("../DB/db.config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail", // or SES/SendGrid
  auth: {
    user: "nepolion.datafluent.team@gmail.com", // process.env.EMAIL_USER,
    pass: "qgpx iwbl xozo tbjg", // process.env.EMAIL_PASS, // generated pass
  },
});

const verifyInvitation = async (token) => {
  if (!token || typeof token !== "string") {
    return { valid: false, message: "Token missing" };
  }

  const invite = await prisma.def_invitation.findUnique({ where: { token } });

  if (!invite) {
    return { valid: false, message: "Invalid invite" };
  }

  if (invite.expires_at < new Date()) {
    await prisma.def_invitation.update({
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

    const existInvitaion = await prisma.def_invitation.findFirst({
      where: { invited_email },
    });

    if (existInvitaion && existInvitaion.expires_at > new Date()) {
      return res.status(200).json({ message: "Invited email already exists" });
    }

    await prisma.def_invitation.create({
      data: { invited_by, invited_email, token, status: "pending" },
    });

    const inviteLink = `https://procg.datafluent.team/invite?token=${token}`;

    // --- Send Email ---
    if (invited_email) {
      const res = await transporter.sendMail({
        from: `"MyApp"`,
        to: invited_email,
        subject: "You’re Invited to MyApp 🚀",
        html: `<p>Hello,</p>
               <p>You have been invited to join MyApp.</p>
               <p><a href="${inviteLink}">Click here to accept invite</a></p>
               <p>This link will expire in 5 days.</p>`,
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

    res.status(201).json({ success: true, inviteLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.invitaionViaLink = async (req, res) => {
  try {
    const { invited_by, invited_email } = req.body;
    if (!invited_by && !invited_email) {
      return res
        .status(400)
        .json({ error: "inviter_User ID and Invited Email required" });
    }
    const token = crypto.randomUUID();

    const existInvitaion = await prisma.def_invitation.findFirst({
      where: { invited_email },
    });

    if (existInvitaion && existInvitaion.expires_at > new Date()) {
      await prisma.def_invitation.update({
        where: { token },
        data: { status: "expired" },
      });
      return res.status(200).json({ message: "Invited email already exists" });
    }

    // store in DB
    await prisma.def_invitation.create({
      data: { invited_by, invited_email, token, status: "pending" },
    });

    // generate link
    const inviteLink = `https://procg.datafluent.team/invite?token=${token}`;

    return res.status(201).json({ success: true, inviteLink });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.verifyInvitation = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ valid: false, message: "Token missing" });
    }

    const invite = await prisma.def_invitation.findFirst({ where: { token } });
    if (!invite) {
      return res.status(404).json({ valid: false, message: "Invalid invite" });
    }

    if (invite.expires_at < new Date()) {
      await prisma.def_invitation.update({
        where: { token },
        data: { status: "expired" },
      });
      return res.status(400).json({ valid: false, message: "Invite expired" });
    }

    if (invite.status === "pending") {
      return res.status(200).json({
        valid: true,
        invited_by: invite.invited_by,
        invited_email: invite.invited_email,
        message: "Invitation is valid",
        // phone: invite.phone,
      });
    }
    if (invite.status === "accepted") {
      return res.status(200).json({
        valid: false,
        message: "Invitation already accepted",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, message: "Server error" });
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
      email_addresses,
      created_by, //invite user id
      last_updated_by, //invite user id
      tenant_id,
      first_name,
      middle_name,
      last_name,
      job_title,
      password,
    } = req.body;

    const invite = await verifyInvitation(token);

    if (!invite.valid) {
      return res.status(400).json({ message: invite.message });
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
          user_name,
          user_type,
          email_addresses,
          created_by,
          last_updated_by,
          tenant_id,
          profile_picture,
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

    await prisma.def_invitation.update({
      where: { token },
      data: { status: "accepted" },
    });

    return res.status(201).json({ message: "Invitation accepted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
