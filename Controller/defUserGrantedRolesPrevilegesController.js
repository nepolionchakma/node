const prisma = require("../DB/db.config");

exports.getGrantedRolesPrevileges = async (req, res) => {
  const { tenant_id, page, limit } = req.query;

  try {
    if (tenant_id) {
      const total = await prisma.def_user_granted_roles_privileges_v.count({
        where: {
          tenant_id: Number(tenant_id),
        },
      });
      const grantedRolesPrevileges =
        await prisma.def_user_granted_roles_privileges_v.findMany({
          where: {
            tenant_id: Number(tenant_id),
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        });
      if (grantedRolesPrevileges) {
        return res
          .status(200)
          .json({
            result: grantedRolesPrevileges,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
          });
      }
    }

    const total = await prisma.def_user_granted_roles_privileges_v.count();
    const grantedRolesPrevileges =
      await prisma.def_user_granted_roles_privileges_v.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
    if (grantedRolesPrevileges) {
      return res
        .status(200)
        .json({
          result: grantedRolesPrevileges,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
