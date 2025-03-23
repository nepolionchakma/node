const prisma = require("../DB/db.config");

exports.getDefProcesses = async (req, res) => {
  try {
    const response = await prisma.def_processes.findMany({
      orderBy: {
        process_id: "desc",
      },
    });
    // console.log(response, "response");
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getDefProcess = async (req, res) => {
  const { process_name } = req.params;
  try {
    const response = await prisma.def_processes.findFirst({
      where: {
        process_name,
      },
    });
    // console.log(response, "response");
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createDefProcess = async (req, res) => {
  try {
    const { process_id, process_name, process_structure } = req.body;
    await prisma.def_processes.create({
      data: { process_id, process_name, process_structure },
    });
    return res.status(201).json({ message: "Process created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateDefProcess = async (req, res) => {
  try {
    // console.log("first");
    const { process_id } = req.params;
    const { process_structure } = req.body;
    // console.log(process_id, process_structure, "process_id,process_structure");
    await prisma.def_processes.update({
      where: { process_id: Number(process_id) },
      data: { process_structure },
    });
    return res.status(200).json({ message: "Process updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateDefProcessName = async (req, res) => {
  try {
    const { process_id } = req.params;
    const { process_name } = req.body;
    await prisma.def_processes.update({
      where: { process_id: Number(process_id) },
      data: { process_name },
    });
    return res
      .status(200)
      .json({ message: "Process name updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDefProcess = async (req, res) => {
  try {
    const { process_id } = req.params;
    await prisma.def_processes.delete({
      where: { process_id: Number(process_id) },
    });
    return res.status(200).json({ message: "Process deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
