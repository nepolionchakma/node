const Router = require("express");
const cookieParser = require("cookie-parser");
const verifyUser = require("../Middleware/verifyUser");

const routes = Router();

// routes
const defPersonsRoutes = require("../Routes/defPersonsRoutes");
const defUsersRoutes = require("../Routes/defUsersRoutes");
const defTenantsRoutes = require("../Routes/defTenantsRoutes");
const defUserCredentialsRoutes = require("../Routes/defUserCredentialsRoutes");
const authentication = require("../Routes/authenticationRoutes");
const messagesRoutes = require("../Routes/messagesRoutes");
const notificationsRoutes = require("../Routes/notificationRoutes");
const defDataSourcesRoutes = require("./defDataSourcesRoutes");
const defAccessEntitlementsRoutes = require("./defAccessEntitlementsRoutes");
const accessEntitlementElementsRoutes = require("../Routes/accessEntitlementElementsRoutes");
const defAccessPointsElementsRoutes = require("./defAccessPointElementsRoutes");
const combinedUserRoutes = require("../Routes/combinedUserRoutes");
const defGlobalConditionsRoutes = require("./defGlobalConditionsRoutes");
const defGlobalConditionsLogicsRoutes = require("./defGlobalConditionLogicsRoutes");
const defGlobalConditionsLogicAttributesRoutes = require("./defGlobalConditionLogicAttributesRoutes");
const defAccessModelsRoutes = require("./defAccessModelsRoutes");
const defAccessModelLogicsRoutes = require("./defAccessModelLogicsRoutes");
const defAccessModelLogicAttributesRoutes = require("./defAccessModelLogicAttributesRoutes");
const controlesRoutes = require("./controlsRoutes");
const linkedDevicesRoutes = require("./linkedDevicesRoutes");
const armRoutes = require("./armRoutes");
const asynchronousRequestsAndTaskSchedulesRoutes = require("./asynchronousRequestsAndTaskSchedulesRoutes");
const pushNotificationRoutes = require("./pushNotificationRoutes");
const orchestrationStudioRoutes = require("./orchestrationStudioRoutes");
const accessProfileRoutes = require("./accessProfileRoutes");
const mobileMenuRoutes = require("./mobileMenuRoutes");
const defTenantEnterpriseSetupRoutes = require("./defEnterprisesRoutes");
const testRoutes = require("./testRoutes");
const alertsRoutes = require("./defAlertsRoutes");
const recepientsRoutes = require("./defAlertRecepientsRoutes");

routes.use(cookieParser());
routes.use("/push-notification", pushNotificationRoutes);
routes.use("/login", authentication);
routes.use("/logout", authentication);
routes.use("/qr-code", authentication);

// Verify user - middleware
routes.use(verifyUser);

//  After verify user
routes.use("/auth", authentication);
routes.use("/persons", defPersonsRoutes);
routes.use("/users", defUsersRoutes);
routes.use("/user-credentials", defUserCredentialsRoutes);
routes.use("/access-profiles", accessProfileRoutes);
routes.use("/combined-user", combinedUserRoutes);

routes.use("/messages", messagesRoutes);
routes.use("/notifications", notificationsRoutes);
routes.use("/def-data-sources", defDataSourcesRoutes);

// Manage Access Entitlements
routes.use("/def-access-entitlements", defAccessEntitlementsRoutes);
routes.use("/access-entitlement-elements", accessEntitlementElementsRoutes);
routes.use("/def-access-point-elements", defAccessPointsElementsRoutes);

// Condition section
routes.use("/def-global-conditions", defGlobalConditionsRoutes);
routes.use("/def-global-condition-logics", defGlobalConditionsLogicsRoutes);
routes.use(
  "/def-global-condition-logic-attributes",
  defGlobalConditionsLogicAttributesRoutes
);

// Access model section
routes.use("/def-access-models", defAccessModelsRoutes);
routes.use("/def-access-model-logics", defAccessModelLogicsRoutes);
routes.use(
  "/def-access-model-logic-attributes",
  defAccessModelLogicAttributesRoutes
);

// Control section
routes.use("/controls", controlesRoutes);
routes.use("/devices", linkedDevicesRoutes);

// ARM Task
routes.use("/arm-tasks", armRoutes);
routes.use(
  "/asynchronous-requests-and-task-schedules",
  asynchronousRequestsAndTaskSchedulesRoutes
);

// Orchestration Studio
routes.use("/orchestration-studio-process", orchestrationStudioRoutes);

//Mobile Menu
routes.use("/mobile-menu", mobileMenuRoutes);

// Manage_Tenancy_And_Def_Tenant_Enterprise_Setup
routes.use("/def-tenants", defTenantsRoutes);
routes.use("/def-tenant-enterprise-setup", defTenantEnterpriseSetupRoutes);

//Test
routes.use("/test", testRoutes);

// alerts
routes.use("/alerts", alertsRoutes);

// recepients
routes.use("/recepients", recepientsRoutes);

module.exports = routes;
