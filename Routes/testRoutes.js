const Router = require("express");
const testController = require("../Controller/testController");
const router = Router();

//Departments
router.get("/departments", testController.getDepartments);
router.get("/departments/:id", testController.getUniqueDepartment);
router.post("/departments", testController.createDepartment);
router.put("/departments/:id", testController.updateDepartment);
router.delete("/departments/:id", testController.deleteDepartment);

//Employees
router.get("/employees", testController.getEmployess);
router.get("/employees/:id", testController.getUniqueEmployee);
router.post("/employees", testController.createEmployee);
router.put("/employees/:id", testController.updateEmployee);
router.delete("/employees/:id", testController.deleteEmployee);

module.exports = router;
