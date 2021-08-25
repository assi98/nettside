//@flow

import {TicketDAO} from '../dao/ticketDao.js';

/**
 * Controller for receiving HTTP requests through the ticket endpoint
 */

const pool = require('../server.js');

const ticketDao = new TicketDAO(pool);

const TAG = '[TicketController]';

/**
 * Calls ticketDao to insert a ticket into the database.Returns response and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.insertTicket = (req, res, next) => {
    console.log(TAG, "POST-request: /ticket");
    ticketDao.getAll(req.body.event, (status, tickets) => {
        console.log(TAG, tickets[0]);
        let unique = true;
        if(tickets[0]) {
            tickets[0].map(t => {
                console.log(TAG, req.body.title);
                if(t.title === req.body.title) {
                    unique = false;
                }
            });
            if(unique) {
                ticketDao.createOne(req.body, (status, data) => {
                    res.status(status);
                    res.json(data);
                });
            } else {
                console.log(TAG, "duplicate ticket");
                res.json({error: "Duplicate ticket"});
            }
        } else {
            res.json({error: "Server error"});
        }
    });
};

/**
 * Calls ticketDao to get tickets by an event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getAllTickets = (req, res, next) => {
    console.log(TAG, `GET-request: /ticket`);
    ticketDao.getAll(req.params.eventId,(err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls ticketDao to get ticket by ticket id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getTicketById = (req, res, next) => {
    console.log(TAG, `GET-request: /ticket/${req.params.ticketId}`);
    ticketDao.getOne(req.params.ticketId,(err, rows) => {
        res.json(rows);
    });
};

/**
 * Calls ticketDao to update a ticket in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateTicket = (req, res, next) => {
    console.log(TAG, "PUT-request: /ticket/:id");
    ticketDao.updateOneTicket(req.body, (err, rows) => {
        res.json(rows);
    });
};

/**
 * Calls ticketDao to delete a ticket from the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteTicket = (req, res, next) => {
    console.log(TAG, `DELETE-request: /ticket/${req.params.ticketId}`);
    ticketDao.removeOneTicket(Number.parseInt(req.params.ticketId),(status, data) => {
        res.status(status);
        res.json(data);
    });
};
