-- CreateTable
CREATE TABLE "def_api_endpoint_roles" (
    "api_endpoint_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "def_api_endpoint_roles_pkey" PRIMARY KEY ("api_endpoint_id","role_id")
);

-- CreateTable
CREATE TABLE "def_api_endpoints" (
    "api_endpoint_id" INTEGER NOT NULL,
    "api_endpoint" TEXT,
    "parameter1" TEXT,
    "parameter2" TEXT,
    "method" TEXT,
    "privilege_id" INTEGER,

    CONSTRAINT "def_api_endpoints_pkey" PRIMARY KEY ("api_endpoint_id")
);

-- CreateTable
CREATE TABLE "def_job_titles" (
    "job_title_id" INTEGER NOT NULL,
    "job_title_name" TEXT,

    CONSTRAINT "def_job_titles_pkey" PRIMARY KEY ("job_title_id")
);

-- CreateTable
CREATE TABLE "def_persons" (
    "user_id" INTEGER NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "job_title" TEXT,

    CONSTRAINT "def_persons_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "def_privileges" (
    "privilege_id" INTEGER NOT NULL,
    "privilege_name" TEXT,

    CONSTRAINT "def_privileges_pkey" PRIMARY KEY ("privilege_id")
);

-- CreateTable
CREATE TABLE "def_roles" (
    "role_id" INTEGER NOT NULL,
    "role_name" TEXT,

    CONSTRAINT "def_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "def_tenant_enterprise_setup" (
    "tenant_id" INTEGER NOT NULL,
    "enterprise_name" TEXT,
    "enterprise_type" TEXT,

    CONSTRAINT "def_tenant_enterprise_setup_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "def_tenants" (
    "tenant_id" INTEGER NOT NULL,
    "tenant_name" TEXT,

    CONSTRAINT "def_tenants_pkey" PRIMARY KEY ("tenant_id")
);

-- CreateTable
CREATE TABLE "def_user_credentials" (
    "user_id" INTEGER NOT NULL,
    "password" TEXT,

    CONSTRAINT "def_user_credentials_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "def_user_granted_privileges" (
    "user_id" INTEGER NOT NULL,
    "privilege_id" INTEGER NOT NULL,

    CONSTRAINT "def_user_granted_privileges_pkey" PRIMARY KEY ("user_id","privilege_id")
);

-- CreateTable
CREATE TABLE "def_user_granted_roles" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "def_user_granted_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "def_user_types" (
    "user_type_id" INTEGER NOT NULL,
    "user_type_name" TEXT,

    CONSTRAINT "def_user_types_pkey" PRIMARY KEY ("user_type_id")
);

-- CreateTable
CREATE TABLE "def_users" (
    "user_id" INTEGER NOT NULL,
    "user_name" TEXT,
    "user_type" TEXT,
    "email_addresses" JSONB,
    "created_by" INTEGER,
    "created_on" TEXT,
    "last_updated_by" INTEGER,
    "last_updated_on" TEXT,
    "tenant_id" INTEGER,

    CONSTRAINT "def_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "data_source_id" INTEGER NOT NULL,
    "datasource_name" TEXT,
    "description" TEXT,
    "application_type" TEXT,
    "application_type_version" TEXT,
    "last_access_synchronization_date" TEXT,
    "last_access_synchronization_status" TEXT,
    "last_transaction_synchronization_date" TEXT,
    "last_transaction_synchronization_status" TEXT,
    "default_datasource" TEXT,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("data_source_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sender" TEXT,
    "recivers" JSONB,
    "subject" TEXT,
    "body" TEXT,
    "date" TIMESTAMPTZ(6),
    "status" TEXT,
    "parentid" TEXT,
    "involvedusers" JSONB,
    "readers" JSONB,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manage_access_entitlements" (
    "entitlement_id" INTEGER NOT NULL,
    "entitlement_name" TEXT NOT NULL,
    "description" TEXT,
    "comments" TEXT,
    "status" TEXT NOT NULL,
    "effective_date" TEXT NOT NULL,
    "revison" INTEGER,
    "revision_date" TEXT,
    "created_on" TEXT,
    "last_updated_on" TEXT,
    "last_updated_by" TEXT,
    "created_by" TEXT,

    CONSTRAINT "manage_access_entitlements_pkey" PRIMARY KEY ("entitlement_id")
);

-- CreateTable
CREATE TABLE "access_points_elements" (
    "id" INTEGER NOT NULL,
    "entitlement_id" INTEGER NOT NULL,
    "element_name" TEXT,
    "description" TEXT,
    "datasource" TEXT,
    "platform" TEXT,
    "element_type" TEXT,
    "access_control" TEXT,
    "change_control" TEXT,
    "audit" TEXT,

    CONSTRAINT "access_points_entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manage_global_condition_logic_attributes" (
    "id" INTEGER NOT NULL,
    "manage_global_condition_logic_id" INTEGER NOT NULL,
    "widget_position" INTEGER,
    "widget_state" INTEGER,

    CONSTRAINT "manage_global_condition_logic_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manage_global_condition_logics" (
    "manage_global_condition_logic_id" INTEGER NOT NULL,
    "manage_global_condition_id" INTEGER NOT NULL,
    "object" TEXT,
    "attribute" TEXT,
    "condition" TEXT,
    "value" TEXT,

    CONSTRAINT "manage_global_condition_logic_pkey" PRIMARY KEY ("manage_global_condition_logic_id")
);

-- CreateTable
CREATE TABLE "manage_global_conditions" (
    "manage_global_condition_id" INTEGER NOT NULL,
    "name" TEXT,
    "datasource" TEXT,
    "description" TEXT,
    "status" TEXT,

    CONSTRAINT "manage_global_condition_pkey" PRIMARY KEY ("manage_global_condition_id")
);

-- CreateTable
CREATE TABLE "manage_access_models" (
    "manage_access_model_id" INTEGER NOT NULL,
    "model_name" TEXT,
    "description" TEXT,
    "type" TEXT,
    "run_status" TEXT,
    "state" TEXT,
    "last_run_date" TEXT,
    "created_by" TEXT,
    "last_updated_by" TEXT,
    "last_updated_date" TEXT,
    "revision" INTEGER,
    "revision_date" TEXT,

    CONSTRAINT "manage_access_models_pkey" PRIMARY KEY ("manage_access_model_id")
);

-- CreateTable
CREATE TABLE "manage_access_model_logics" (
    "manage_access_model_logic_id" INTEGER NOT NULL,
    "manage_access_model_id" INTEGER NOT NULL,
    "filter" TEXT,
    "object" TEXT,
    "attribute" TEXT,
    "condition" TEXT,
    "value" TEXT,

    CONSTRAINT "manage_access_model_logics_pkey" PRIMARY KEY ("manage_access_model_logic_id")
);

-- CreateTable
CREATE TABLE "manage_access_model_logic_attributes" (
    "id" INTEGER NOT NULL,
    "manage_access_model_logic_id" INTEGER NOT NULL,
    "widget_position" INTEGER,
    "widget_state" INTEGER,

    CONSTRAINT "manage_access_model_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "def_api_endpoints_api_endpoint_parameter1_parameter2_method_key" ON "def_api_endpoints"("api_endpoint", "parameter1", "parameter2", "method");

-- AddForeignKey
ALTER TABLE "def_api_endpoint_roles" ADD CONSTRAINT "def_api_endpoint_roles_api_endpoint_id_fkey" FOREIGN KEY ("api_endpoint_id") REFERENCES "def_api_endpoints"("api_endpoint_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_api_endpoint_roles" ADD CONSTRAINT "def_api_endpoint_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "def_roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_user_granted_privileges" ADD CONSTRAINT "def_user_granted_privileges_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "def_privileges"("privilege_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_user_granted_privileges" ADD CONSTRAINT "def_user_granted_privileges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "def_users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_user_granted_roles" ADD CONSTRAINT "def_user_granted_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "def_roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_user_granted_roles" ADD CONSTRAINT "def_user_granted_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "def_users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "def_users" ADD CONSTRAINT "def_users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "def_tenants"("tenant_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
