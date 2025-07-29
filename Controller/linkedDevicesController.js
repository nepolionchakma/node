const prisma = require("../DB/db.config");

exports.getDevices = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await prisma.linked_devices.findMany({
      where: {
        user_id: Number(user_id),
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// add device
exports.addDevice = async (req, res) => {
  const { user_id, deviceInfo, signon_audit } = req.body;

  try {
    const device = await prisma.linked_devices.findFirst({
      where: {
        user_id: Number(user_id),
        device_type: deviceInfo.device_type,
        browser_name: deviceInfo.browser_name,
        os: deviceInfo.os,
        ip_address: deviceInfo.ip_address,
      },
    });

    if (!device) {
      const result = await prisma.linked_devices.create({
        data: {
          user_id: Number(user_id),
          device_type: deviceInfo.device_type,
          browser_name: deviceInfo.browser_name,
          browser_version: deviceInfo.browser_version,
          os: deviceInfo.os,
          user_agent: deviceInfo.user_agent,
          is_active: deviceInfo.is_active,
          ip_address: deviceInfo.ip_address,
          location: deviceInfo.location,
          signon_audit: [signon_audit],
          signon_id: signon_audit.signon_id,
        },
      });
      return res.status(201).json(result);
    }

    const deviceToUpdate = await prisma.linked_devices.findUnique({
      where: {
        id: device.id,
        user_id: Number(user_id),
        ip_address: deviceInfo.ip_address,
      },
    });

    const result = await prisma.linked_devices.update({
      where: {
        id: deviceToUpdate.id,
      },
      data: {
        user_id: Number(user_id),
        device_type: deviceInfo.device_type,
        browser_name: deviceInfo.browser_name,
        browser_version: deviceInfo.browser_version,
        os: deviceInfo.os,
        user_agent: deviceInfo.user_agent,
        is_active: deviceInfo.is_active,
        ip_address: deviceInfo.ip_address,
        location: deviceInfo.location,
        signon_audit: [...deviceToUpdate.signon_audit, signon_audit],
        signon_id: signon_audit.signon_id,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Something went wrong adding device" });
  }
};

// inactivate device
exports.inactiveDevice = async (req, res) => {
  const { user_id, id } = req.params;
  const { is_active } = req.body;

  try {
    // Find the existing device
    const device = await prisma.linked_devices.findUnique({
      where: {
        id: Number(id),
        user_id: Number(user_id),
      },
    });

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Update the signon_audit entry
    const updatedAudit = device.signon_audit.map((audit) => {
      if (audit.signon_id === device.signon_id) {
        return {
          ...audit,
          logout: new Date(), // update logout
        };
      }
      return audit;
    });

    // Update device in DB
    const result = await prisma.linked_devices.update({
      where: {
        id: Number(id),
      },
      data: {
        is_active,
        signon_audit: updatedAudit,
      },
    });
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong updating the device",
    });
  }
};

//logout from all devices
exports.logoutFromDevices = async (req, res) => {
  const { user_id } = req.params;
  const { is_active } = req.body;

  try {
    const logoutTime = new Date();

    const devices = await prisma.linked_devices.findMany({
      where: {
        user_id: Number(user_id),
      },
    });

    if (devices.length === 0) {
      return res.status(200).json({ message: "Device not found" });
    }

    const updatedDevices = await Promise.all(
      devices.map(async (device) => {
        if (!device.signon_audit || !Array.isArray(device.signon_audit)) return;

        // Update only the matching audit object
        const updatedAudit = device.signon_audit.map((entry) => {
          if (entry.signon_id === device.signon_id) {
            return {
              ...entry,
              logout: logoutTime,
            };
          }
          return entry;
        });

        return prisma.linked_devices.update({
          where: { id: device.id },
          data: {
            is_active: is_active,
            signon_audit: updatedAudit,
          },
        });
      })
    );

    return res.status(200).json({
      message: "Sign out from all devices successfully",
      updatedCount: updatedDevices.filter(Boolean).length,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong signing out devices" });
  }
};

exports.getUniqueDevice = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const device = await prisma.linked_devices.findUnique({
      where: {
        id: deviceId,
      },
    });
    if (device) {
      return res.status(200).json(device);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
