const Router = require("express");
const defGrantedRolesPrevileges = require("../Controller/defUserGrantedRolesPrevilegesController");

const router = Router();

router.get("/", defGrantedRolesPrevileges.getGrantedRolesPrevileges);

module.exports = router;
