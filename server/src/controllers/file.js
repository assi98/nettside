//@flow

import {FileInfoDAO} from '../dao/fileInfoDao.js';

/**
 * Controller for receiving HTTP requests through the file endpoint
 */

const fileInfoController = require("./fileInfo");
const fs = require('fs');
const multer = require('multer');

const pool = require('../server.js');

const TAG = '[FileController]';


const fileInfoDao = new FileInfoDAO(pool);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

const upload = multer({
    storage,
    limits: 1024 * 1024 * 5
});

module.exports = {
    upload
};



// Håndterer login og sender JWT-token tilbake som JSON
exports.download = async (req, res, next) => {

};

exports.upload = (req, res, next) => {
    console.log(TAG, `POST-request: /file/upload/${req.params.eventId}`);
    let data = {
        "name": req.body.name,
        "eventId": req.params.eventId,
        "path": req.body.path
    };
    let result = res;
    console.log(TAG, req.body.name);
    fileInfoDao.postFileInfo(data, (err, res) => {
        try {
            result.send(req.file);
        }catch(err) {
            result.send(400);
        }
    });
};

exports.update = (req, res, next) => {

};

exports.delete = (req, res, next) => {

};