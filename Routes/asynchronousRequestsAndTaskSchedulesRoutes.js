const Router = require("express");
const asynchronousRequestsAndTaskSchedulesController = require("../Controller/asynchronousRequestsAndTaskSchedulesController");

const router = Router();

router.get(
  "/",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedules
);
router.get(
  "/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedulesLazyLoading
);
router.get(
  "/:task_name/:arm_param_id",
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
router.post(
  "/create-task-schedule",
  asynchronousRequestsAndTaskSchedulesController.createTaskSchedule
);
router.put(
  "/update-task-schedule/:task_name/:redbeat_schedule_name",
  asynchronousRequestsAndTaskSchedulesController.updateTaskSchedule
);
router.put(
  "/cancel-task-schedule/:task_name/:redbeat_schedule_name",
  asynchronousRequestsAndTaskSchedulesController.cancelTaskSchedule
);

//V1 API
router.get(
  "/task-schedules",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedulesV1
);
router.get(
  "/task-schedules/:page/:limit",
  asynchronousRequestsAndTaskSchedulesController.getTaskSchedulesLazyLoadingV1
);
router.post(
  "/create-task-schedule-v1",
  asynchronousRequestsAndTaskSchedulesController.createTaskScheduleV1
);
router.put(
  "/update-task-schedule-v1/:task_name",
  asynchronousRequestsAndTaskSchedulesController.updateTaskScheduleV1
);
router.put(
  "/cancel-task-schedule-v1/:task_name",
  asynchronousRequestsAndTaskSchedulesController.cancelTaskScheduleV1
);
module.exports = router;
