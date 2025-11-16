const prisma = require("../DB/db.config");

exports.getGrantedRolesPrevileges = async (req, res) => {
  const { tenant_id } = req.query;

  try {
    if (tenant_id) {
      const grantedRolesPrevileges =
        await prisma.def_user_granted_roles_previleges_v.findMany({
          where: {
            tenant_id: Number(tenant_id),
          },
        });
      if (grantedRolesPrevileges) {
        return res.status(200).json({ result: grantedRolesPrevileges });
      }
    }

    const grantedRolesPrevileges =
      await prisma.def_user_granted_roles_previleges_v.findMany();
    if (grantedRolesPrevileges) {
      return res.status(200).json({ result: grantedRolesPrevileges });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
