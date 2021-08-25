//@flow

import { RiderDAO } from "../dao/riderDao.js";

/**
 * Controller for receiving HTTP requests through the riders endpoint
 */

const pool = require("../server.js");

const riderDao = new RiderDAO(pool);

const TAG = '[RiderController]';

/**
 * Calls riderDao to post a rider to the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.postRider = (req, res, next) => {
    console.log(TAG, `POST-request: /api/rider`);
    riderDao.postRider(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
};

/**
 * Calls riderDao to get a rider by rider id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getRider = (req, res, next) => {
    console.log(TAG, `GET-request: /rider/one/${req.params.rider_id}`);
    riderDao.getRider(req.params.rider_id, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls riderDao to get riders by a document id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getAllRiders = (req, res, next) => {
    console.log(TAG, `GET-request: /rider/all/${req.params.document}`);
    console.log(TAG, "DETTE ER DOCUMENT ID!!!!!!!: " + req.params.document);
    riderDao.getAllRiders(Number.parseInt(req.params.document), (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls riderDao to update an rider in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateRider = (req, res, next) => {
    console.log(TAG, `PUT-request: /api/rider/${req.params.rider_id}`);
    riderDao.updateRider(req.body,(err, rows) => {
        res.json(rows);
    });
};

/**
 * Calls riderDao to delete a rider by rider id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteRider = (req, res, next) => {
    console.log(TAG, `DELETE-request: /api/rider/one/${req.params.rider_id}`);

    riderDao.deleteRider(req.params.rider_id,(err, rows) => {
        res.send(rows);
    });
};

/**
 * Calls riderDao to delete riders by a document id in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteAllRiders = (req, res, next) => {
    console.log(TAG, `DELETE-request: /api/rider/all/${req.params.document}`);

    riderDao.deleteAllRiders(req.params.document,(err, rows) => {
        res.send(rows);
    });
};