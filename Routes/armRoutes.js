const Router = require("express");
const armControllers = require("../Controller/armController");

const router = Router();
// Execution Methods
router.get("/show-execution-methods", armControllers.showExecutionMethods);
router.get(
  "/show-execution-methods/:page/:limit",
  armControllers.showExecutionMethodsLazyLoading
);
router.post("/create-execution-method", armControllers.createExecutionMethod);
router.put(
  "/update-execution-method/:internal_execution_method",
  armControllers.updateExecutionMethod
);
router.delete(
  "/delete-execution-method/:internal_execution_method",
  armControllers.deleteExecutionMethod
);

// Register/Edit Asynchronous Tasks
router.get("/def_async_tasks", armControllers.getARMTasks);
router.get(
  "/def_async_tasks/:page/:limit",
  armControllers.getARMTasksLazyLoading
);
router.get(
  "/def_async_tasks/search/:page/:limit",
  armControllers.getSearchARMTasksLazyLoading
);
router.get("/show-task/:task_name", armControllers.getARMTask);
router.post("/register-task", armControllers.registerARMTask);
router.put("/edit-task/:task_name", armControllers.editARMTask);
router.put("/cancel-task/:task_name", armControllers.cancelARMTask);

// Task Params
router.get("/task-params/:task_name", armControllers.getUserTaskNameParams);
router.get(
  "/task-params/:task_name/:page/:limit",
  armControllers.getTaskParamsLazyLoading
);
router.post("/add-task-params/:task_name", armControllers.addTaskParams);
router.put(
  "/update-task-params/:task_name/:def_param_id",
  armControllers.updateTaskParams
);
router.delete(
  "/delete-task-params/:task_name/:def_param_id",
  armControllers.deleteTaskParams
);

module.exports = router;
