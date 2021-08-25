//@flow

const express = require("express");

const contactController = require("../controllers/contact");
const eventController = require("../controllers/event");
const artistController = require("../controllers/artist");
const ticketController = require("../controllers/ticket");
const userController = require("../controllers/user");
const fileInfoController = require("../controllers/fileInfo");

const router = express.Router();

// ROUTE: api
router.get("/event", eventController.getEvents);
router.get("/event/:eventId/artist", artistController.getArtistByEvent);
router.get("/event/:eventId", eventController.getEventById);
router.get("/event/:event_id/edit", eventController.getEventByIdUpdate);
router.get("/event/search/:input", eventController.getEventByInput);
router.post("/contactUs", contactController.contactUs);
router.get("/categories", eventController.getCategories);
router.get("/user/:userId/event", eventController.getEventByUser);
router.get("/user/:userId/event/last", eventController.getLastEventByUser);
router.get("/user/:userId/event/ended", eventController.getEndedEventsByUser);
router.get("/event/:eventId/ticket", ticketController.getAllTickets);
router.get("/event/organizer/:contactId", userController.getOrganizerUsername);
router.get("/event/search/user/:username", eventController.getEventsByUsername);
router.get("/file/download/:file", fileInfoController.downloadFile);
router.get("/file/download/contract/:artistId", fileInfoController.downloadContract);

module.exports = router;
