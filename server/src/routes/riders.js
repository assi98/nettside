// @flow

const express = require("express");

const riderController = require("../controllers/riders");

const router = express.Router();

// ROUTE: auth/id/:userId/riders
router.post("/", riderController.postRider);
router.get("/one/:rider_id", riderController.getRider);
router.get("/all/:document", riderController.getAllRiders);
router.put("/:rider_id", riderController.updateRider);
router.delete("/one/:rider_id", riderController.deleteRider);
router.delete("/all/:document", riderController.deleteAllRiders);

module.exports = router;