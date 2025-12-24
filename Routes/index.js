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
// const messagesRoutes = require("../Routes/messagesRoutes");
const defnotificationsRoutes = require("../Routes/defNotificationRoutes");
const defDataSourcesRoutes = require("./defDataSourcesRoutes");
const defAccessEntitlementsRoutes = require("./defAccessEntitlementsRoutes");
const defAccessEntitlementElementsRoutes = require("../Routes/defAccessEntitlementElementsRoutes");
const defAccessPointsElementsRoutes = require("./defAccessPointElementsRoutes");
const defCombinedUserRoutes = require("../Routes/defCombinedUserRoutes");
const defGlobalConditionsRoutes = require("./defGlobalConditionsRoutes");
const defGlobalConditionsLogicsRoutes = require("./defGlobalConditionLogicsRoutes");
const defGlobalConditionsLogicAttributesRoutes = require("./defGlobalConditionLogicAttributesRoutes");
const defAccessModelsRoutes = require("./defAccessModelsRoutes");
const defAccessModelLogicsRoutes = require("./defAccessModelLogicsRoutes");
const defAccessModelLogicAttributesRoutes = require("./defAccessModelLogicAttributesRoutes");
const defControlesRoutes = require("./defControlsRoutes");
const defLinkedDevicesRoutes = require("./defLinkedDevicesRoutes");
const defArmRoutes = require("./defArmRoutes");
const defAsynchronousRequestsAndTaskSchedulesRoutes = require("./defAsynchronousRequestsAndTaskSchedulesRoutes");
const pushNotificationRoutes = require("./pushNotificationRoutes");
const orchestrationStudioRoutes = require("./orchestrationStudioRoutes");
const defAccessProfileRoutes = require("./defAccessProfileRoutes");
const defMobileMenuRoutes = require("./defMobileMenuRoutes");
const defTenantEnterpriseSetupRoutes = require("./defEnterprisesRoutes");
const testRoutes = require("./testRoutes");
const defAlertsRoutes = require("./defAlertsRoutes");
// const defRecepientsRoutes = require("./defAlertRecepientsRoutes");
const newUserInvitationRoutes = require("./newUserInvitationRoutes");
const forgotPasswordRoutes = require("./forgotPasswordRequestsRoutes");
const openbaoRoutes = require("./openbaoRoutes");
const grantedRolesPrevilegesRoutes = require("./defUserGrantedRolesPrevilegesRoutes");
const mfaRoutes = require("./mfaRoutes");

routes.use(cookieParser());
routes.use("/push-notification", pushNotificationRoutes);
routes.use("/login", authentication);
routes.use("/logout", authentication);
routes.use("/qr-code", authentication);
routes.use("/forgot_password_request", forgotPasswordRoutes);

// Verify user - middleware
routes.use(verifyUser);

//  After verify user
routes.use("/auth", authentication);
routes.use("/persons", defPersonsRoutes);
routes.use("/users", defUsersRoutes);
routes.use("/def_user_credentials", defUserCredentialsRoutes);
routes.use("/access-profiles", defAccessProfileRoutes);
routes.use("/combined-user", defCombinedUserRoutes);

// routes.use("/messages", messagesRoutes);
routes.use("/notifications", defnotificationsRoutes);
routes.use("/def-data-sources", defDataSourcesRoutes);

// Manage Access Entitlements
routes.use("/def-access-entitlements", defAccessEntitlementsRoutes);
routes.use("/access-entitlement-elements", defAccessEntitlementElementsRoutes);
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
routes.use("/controls", defControlesRoutes);
routes.use("/devices", defLinkedDevicesRoutes);

// ARM Task
routes.use("/arm-tasks", defArmRoutes);
routes.use(
  "/asynchronous-requests-and-task-schedules",
  defAsynchronousRequestsAndTaskSchedulesRoutes
);

// Orchestration Studio
routes.use("/orchestration-studio-process", orchestrationStudioRoutes);

//Mobile Menu
routes.use("/mobile-menu", defMobileMenuRoutes);

// Manage_Tenancy_And_Def_Tenant_Enterprise_Setup
routes.use("/def-tenants", defTenantsRoutes);
routes.use("/def-tenant-enterprise-setup", defTenantEnterpriseSetupRoutes);

//Test
routes.use("/test", testRoutes);

// alerts
routes.use("/alerts", defAlertsRoutes);

// recepients
// routes.use("/recepients", defRecepientsRoutes);

// openbao
routes.use("/openbao", openbaoRoutes);

// new user invitation
routes.use("/invitation", newUserInvitationRoutes);

// granted roles and previleges
routes.use("/def_user_granted_roles_previleges", grantedRolesPrevilegesRoutes);

routes.use("/mfa", mfaRoutes);

module.exports = routes;
