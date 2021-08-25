//@flow

const express = require("express");

const equipmentController = require("../controllers/equipment");

const router = express.Router();

// ROUTE: auth/id/:userId/equipment
router.get("/", equipmentController.getEquipmentByQuery);
router.get("/:eventId", equipmentController.getEquipmentByQuery);
router.post("/", equipmentController.insertEquipment);
router.delete("/:equipmentId", equipmentController.deleteEquipment);
router.get("/:equipmentId", equipmentController.getEquipmentById);

module.exports = router;
