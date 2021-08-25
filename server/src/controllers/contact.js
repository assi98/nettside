// @flow

import {Email} from "../email";

/**
 * Controller for receiving HTTP requests through the email endpoint
 */

const pool = require("../server.js");
const emailService = new Email();

const TAG = '[ContactController]';

/**
 * Calls emailService to send an email to the operators of the web site
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.contactUs = (req, res, next) => {

    console.log(TAG, 'POST-request: /contactUs')
    emailService.contactUs(req.body.email, req.body.name, req.body.subject, req.body.content);

};