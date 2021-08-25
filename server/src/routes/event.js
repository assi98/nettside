//@flow

const express = require("express");

const eventController = require("../controllers/event");
const equipmentController = require("../controllers/equipment");
const artistController = require("../controllers/artist");
const roleController = require("../controllers/role");
const fileInfoController = require("../controllers/fileInfo");

const router = express.Router();

// ROUTE: auth/id/:userId/event
router.get("/:eventId/email", eventController.getEventEmail);
router.get("/:eventId/document", eventController.getDocumentByEvent);
router.get("/:eventId/role", roleController.getRoleByEvent);
router.post("/", eventController.insertEvent);
router.post("/:eventId/equipment", equipmentController.addEquipmentToEvent);
router.post("/:eventId/artist", artistController.addArtistToEvent);
router.post("/:eventId/role", roleController.addRoleToEvent);
router.delete("/:eventId/equipment/:equipmentId", equipmentController.removeEquipmentFromEvent);
router.delete("/:eventId/artist/:artistId", artistController.removeArtistFromEvent);
router.delete("/:eventId/role/:roleId", roleController.removeRoleFromEvent);
router.put("/:eventId/equipment/:equipmentId", equipmentController.updateEquipmentOnEvent);
router.put("/:eventId/cancel", eventController.cancelEvent);
router.put("/:eventId/role", roleController.updateRoleCount);
router.get("/:eventId/getFileInfo", fileInfoController.getFileInfoByEvent);
router.post("/:eventId/checkFileName", fileInfoController.checkFileName);
//router.delete("/:eventId", eventController.deleteEvent);
router.put("/:event_id/edit", eventController.updateEvent);
//router.post("/new", eventController.createEvent);
module.exports = router;
