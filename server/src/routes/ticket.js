// @flow

const express = require('express');

const ticketController = require('../controllers/ticket');

const router = express.Router();

// ROUTE: auth/id/:userId/ticket
router.get("/ticket/:ticketId", ticketController.getTicketById);
router.post("/ticket", ticketController.insertTicket);
router.put("/ticket/:ticketId", ticketController.updateTicket);
router.delete("/ticket/:ticketId", ticketController.deleteTicket);
module.exports = router;
