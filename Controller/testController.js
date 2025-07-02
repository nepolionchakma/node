const prisma = require("../DB/db.config");

//Departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await prisma.departments.findMany();
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUniqueDepartment = async (req, res) => {
  const departmentID = Number(req.params.id);
  try {
    const department = await prisma.departments.findUnique({
      where: {
        department_id: departmentID,
      },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  const { department_name } = req.body;

  try {
    if (!department_name) {
      return res.status(422).json({ message: "Department name is required" });
    }

    const newDepartment = await prisma.departments.create({
      data: {
        department_name: department_name,
      },
    });

    return res.status(201).json(newDepartment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const departmentID = Number(req.params.id);
  const { department_name } = req.body;

  try {
    const department = await prisma.departments.findUnique({
      where: {
        department_id: departmentID,
      },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (!department_name) {
      return res.status(422).json({ message: "Department name is required" });
    }

    const updatedDepartment = await prisma.departments.update({
      where: {
        department_id: departmentID,
      },
      data: {
        department_name: department_name,
      },
    });

    return res.status(200).json(updatedDepartment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const departmentID = Number(req.params.id);

    const department = await prisma.departments.findUnique({
      where: {
        department_id: departmentID,
      },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    await prisma.departments.delete({
      where: {
        department_id: departmentID,
      },
    });

    return res.status(200).json({ result: "Department deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Employees
exports.getEmployess = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany();
    return res.status(200).json(employees);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUniqueEmployee = async (req, res) => {
  const employeeID = Number(req.params.id);
  try {
    const employee = await prisma.employees.findUnique({
      where: {
        employee_id: employeeID,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Department not found" });
    }

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  const { job_title, department, employee_name, position } = req.body;

  try {
    if (!job_title || !department || !employee_name) {
      return res.status(422).json({
        message: "Job title, employee name and department is required",
      });
    }

    const newEmployee = await prisma.employees.create({
      data: {
        job_title: job_title,
        department: department,
        employee_name: employee_name,
        position: position,
      },
    });

    return res.status(201).json(newEmployee);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const employeeID = Number(req.params.id);
  const { job_title, department, employee_name, position } = req.body;

  try {
    const employee = await prisma.employees.findUnique({
      where: {
        employee_id: employeeID,
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!job_title || !department || !employee_name) {
      return res.status(422).json({
        message: "Job title, employee name and department is required",
      });
    }

    const updatedEmployee = await prisma.employees.update({
      where: {
        employee_id: employeeID,
      },
      data: {
        job_title: job_title,
        department: department,
        employee_name: employee_name,
        position: position,
      },
    });

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.upsertEmployeeById = async (req, res) => {
  const employee_id = Number(req.params.id);
  const { job_title, department, employee_name, position } = req.body;

  try {
    const result = await prisma.employees.upsert({
      where: { employee_id },
      update: {
        job_title,
        department,
        employee_name,
        position,
      },
      create: {
        job_title,
        department,
        employee_name,
        position,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.upsertEmployee = async (req, res) => {
  const data = req.body.upsertAttributes || req.body;

  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "Invalid input: 'Data' should be an array" });
  }

  const upsertResults = [];

  try {
    for (const item of data) {
      const result = await prisma.employees.upsert({
        where: { employee_id: item.employee_id },
        update: {
          employee_id: data.employee_id,
          job_title: item.job_title,
          department: item.department,
          employee_name: item.employee_name,
          position: item.position,
        },
        create: {
          job_title: item.job_title,
          department: item.department,
          employee_name: item.employee_name,
          position: item.position,
        },
      });
      upsertResults.push(result);
    }

    return res.status(200).json(upsertResults);
  } catch (error) {
    console.error("Error in upsert operation:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employeeID = Number(req.params.id);

    const employee = await prisma.employees.findUnique({
      where: {
        employee_id: employeeID,
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await prisma.employees.delete({
      where: {
        employee_id: employeeID,
      },
    });

    return res.status(200).json({ result: "Employee deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
