//@flow

import {FileInfoDAO} from '../dao/fileInfoDao.js';

/**
 * Controller for receiving HTTP requests through the fileinfo endpoint
 */

const fs = require('fs');

const pool = require('../server.js');

const fileInfoDao = new FileInfoDAO(pool);

const TAG = '[FileInfoController]';

/**
 * Calls fileInfoDao to get a document by document id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getFileInfoById = (req, res, next) => {
    console.log(TAG, `GET-request: /file/info`);
    fileInfoDao.getFileInfoById((err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls fileInfoDao to get a document by an event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getFileInfoByEvent = (req, res, next) => {
    console.log(TAG, `GET-request: /file/info/:eventId`);
    fileInfoDao.getFileInfoByEvent(req.params.eventId, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls fileInfoDao to update the path of a document to the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.insertFileInfo = (req, res, next) => {
    console.log(TAG, `POST-request: /file/info`);
    fileInfoDao.insertFileInfo({"event": req.query.event, "name": req.body.name}, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls fileInfoDao to check if a document name already exists by an event id in the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.checkFileName = (req, res, next) => {
    console.log(TAG, 'POST-request: /file/check/:eventId');
    console.log(TAG, req.params.eventId);
    console.log(TAG, req.body.name);
    fileInfoDao.checkFileName(req.params.eventId, req.body.name, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Downloads a file from the server by a file path. Returns the downloaded file
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.downloadFile = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/download');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    res.download(path);
};

/**
 * Calls fileInfoDao to get a document path by an artist id from the database, and downloads a file from the server by the path. Returns the downloaded file
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.downloadContract = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/download/contract');
    fileInfoDao.getContractByArtistId(req.params.artistId, (err, rows) => {
        res.download(rows[0][0].path);
    })
};

/**
 * Reads the content of a text file from the server. Returns the content of the file
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getFileContent = (req, res, next) => {
    console.log(TAG, 'GET-request: /file/edit');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    fs.readFile(path, 'utf8', (err, rows) => {
        res.json(rows);
    });
};

exports.updateFileInfo = (req, res, next) => {
};

/**
 * Calls fileInfoDao to delete a document by a path from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteFileInfo = (req, res, next) => {
    console.log(TAG, 'DELETE-request: /file/delete');
    let path: string = Buffer.from(req.params.file, 'base64').toString();
    fileInfoDao.deleteFileInfo(path, (error, rows) => {
        if (error != 200) {
            console.log(TAG, error.message + " " + error);
            res.json(rows);
        } else {
            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err);
                    res.json(err);
                } else {
                    res.json(rows);
                }
            });
        }
    });
};