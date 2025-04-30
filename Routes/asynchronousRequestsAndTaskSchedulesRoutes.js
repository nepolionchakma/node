const Router = require("express");
const asynchronousRequestsAndTaskSchedulesController = require("../Controller/asynchronousRequestsAndTaskSchedulesController");

const router = Router();

router.get(
  "/:task_name/:def_param_id",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedule
);
router.get(
  "/view-requests",
  asynchronousRequestsAndTaskSchedulesController.getViewRequests
);
router.get(
  "/view-requests/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getViewRequestsLazyLoading
);

//V1 API replace to main
router.get(
  "/task-schedules",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedules
);
router.get(
  "/task-schedules/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedulesLazyLoading
);
router.post(
  "/create-task-schedule",
  asynchronousRequestsAndTaskSchedulesController.createTaskSchedule
);
router.put(
  "/update-task-schedule/:task_name",
  asynchronousRequestsAndTaskSchedulesController.updateTaskSchedule
);
router.put(
  "/cancel-task-schedule/:task_name",
  asynchronousRequestsAndTaskSchedulesController.cancelTaskSchedule
);

module.exports = router;
