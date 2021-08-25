// @flow

import { RoleDAO } from "../dao/roleDao";

/**
 * Controller for receiving HTTP requests through the role endpoint
 */

const pool = require("../server");

const roleDao = new RoleDAO(pool);

const TAG = '[RoleController]';

/**
 * Calls roleDao to get all riders from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getAllRoles = (req, res, next) => {
    console.log(TAG, "GET-request: /role");
    roleDao.getRoles((err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls roleDao to get roles by event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getRoleByEvent = (req, res, next) => {
    console.log(TAG, "GET-request: /role/:eventId");
    roleDao.getRolesInEvent(req.params.eventId, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls roleDao to insert a new role connected to an event to the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.insertRole = (req, res, next) => {
    console.log(TAG, "POST-request: /role");
    roleDao.createRole(req.body.type, req.body.event, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls roleDao to connect a role to an event in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.addRoleToEvent = (req, res, next) => {
    console.log(TAG, "POST-request: /role/:eventId");
    roleDao.assignToEvent(req.body.role, req.body.event, req.body.count, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls roleDao to update the count of a rider in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateRoleCount = (req, res, next) => {
    console.log(TAG, "PUT-request: /role/:eventId");
    roleDao.updateRoleCount(req.body.role_id, req.body.event, req.body.count, (err, rows) => {
        res.send(rows);
    })
}
;
/**
 * Calls roleDao to remove a role from an event in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.removeRoleFromEvent = (req, res, next) => {
    console.log(TAG, "Got delete request from clint: /role/:roleId");
    roleDao.removeFromEvent(req.params.roleId, req.params.eventId, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls roleDao to remove a role from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteRole = (req, res, next) => {
    console.log(TAG, "DELETE-request: /role");
    roleDao.removeRole(req.params.roleId, (err, rows) => {
        res.send(rows);
    })
};