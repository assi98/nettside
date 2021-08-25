// @flow

const express = require("express");

const roleController = require("../controllers/role");

const router = express.Router();

// ROUTE: auth/id/:userId/role
router.get("/", roleController.getAllRoles);
router.delete("/:roleId", roleController.deleteRole);
router.post("/", roleController.insertRole);

module.exports = router;