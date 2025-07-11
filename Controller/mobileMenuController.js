const prisma = require("../DB/db.config");

exports.getMobileMenu = async (req, res) => {
  try {
    const mobileMenu = await prisma.mobile_menu.findMany();

    return res.status(200).json(mobileMenu);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createMobileMenu = async (req, res) => {
  try {
    const { menu_code, menu_name, menu_desc, menu_structure } = req.body;
    const mobileMenu = await prisma.mobile_menu.findMany();
    const maxID =
      mobileMenu.length > 0
        ? Math.max(...mobileMenu.map((item) => item.menu_id)) + 1
        : 1;

    if (!menu_code || !menu_name || !menu_desc || !menu_structure) {
      return res.status(422).json({
        message: "menu_code, menu_name, menu_desc, menu_structure is required",
      });
    }

    await prisma.mobile_menu.create({
      data: {
        menu_id: maxID,
        menu_code: menu_code,
        menu_name: menu_name,
        menu_desc: menu_desc,
        menu_structure: menu_structure,
      },
    });

    return res
      .status(201)
      .json({ message: "The mobile menu added successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateMobileMenu = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { menu_code, menu_name, menu_desc, menu_structure } = req.body;
    const mobileMenu = await prisma.mobile_menu.findUnique({
      where: {
        menu_id: id,
      },
    });

    if (!mobileMenu) {
      return res.status(404).json({ message: "Mobile Menu not found" });
    }

    await prisma.mobile_menu.update({
      where: {
        menu_id: id,
      },
      data: {
        menu_code: menu_code,
        menu_name: menu_name,
        menu_desc: menu_desc,
        menu_structure: menu_structure,
      },
    });

    return res
      .status(200)
      .json({ message: "The mobile menu edited successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
