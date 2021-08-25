//@flow

import {ArtistDAO} from "../dao/artistDao";
import {UserDAO} from "../dao/userDao";

/**
 * Controller for business logic before retrieving data through artistDao
 */

const pool = require("../server");
const artistDao = new ArtistDAO(pool);
const userDao = new UserDAO(pool);

const TAG = '[ArtistController]';

/**
 *calls artistDao to create a new artist in the database. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.insertArtist = (req, res, next) => {
    console.log(TAG, `POST-request: /api/artist`);
    if (req.body.userId) {
        userDao.getContact(req.body.userId, (err, contact) => {
            artistDao.createArtistOnContact(req.body.artistName,contact[0][0].contact_id, (err, rows) => {
                res.send(rows);
            });
        });
    } else {
        artistDao.insertArtist(req.body.artistName, req.body.firstName, req.body.lastName, req.body.email, req.body.phone, (err, rows) => {
            res.send(rows);
        });
    }
};


/**
 * calls artistDao to delete an artist from database. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteArtist = (req, res, next) => {
    console.log(TAG, `DELETE-request: /api/artist/${req.params.artistId}`);

    artistDao.deleteArtist(req.params.artistId,(err, rows) => {
        res.send(rows);
    });
};

/**
 * Calls artistDao to get artist from database, either through contract or search string. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getAllArtists = (req, res, next) => {
    console.log(TAG, `GET-request: /api/artist`);

    if (req.query.contact) {
        artistDao.getArtistByPreviousContract(req.query.contact, (err, rows) => {
            res.send(rows);
        });
    } else if (req.query.searchBar) {
        artistDao.getArtistBySearch(req.query.searchBar, (err, rows) => {
            res.send(rows);
        });
    } else {
        artistDao.getAllArtists((err, rows) => {
            res.send(rows);
        });
    }
};

/**
 * Calls artistDao to get artist by an artist id. returns rows from dao to service
 *
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getArtistById = (req, res, next) => {
    console.log(TAG, `GET-request: /api/artist/${req.params.artistId}`);

    artistDao.getArtistById(req.params.artistId, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls artistDao to get artist by a contact id. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getArtistByContact = (req, res, next) => {
    console.log(TAG, `GET-request: /api/artist/${req.params.contactId}`);

    artistDao.getArtistByContact(req.params.contactId, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls artistDao to get artist by a user id. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getArtistByUser = (req, res, next) => {
    console.log(TAG, `GET-request: /api/artist/user/${req.params.userId}`);

    artistDao.getArtistByUser(req.params.userId, (err, rows) => {
        res.send(rows);
    });
};

/**
 * Calls artistDao to get artists by an event id. returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getArtistByEvent = (req, res, next) => {
    console.log(TAG, `GET-request: /api/event/${req.params.eventId}/artist`);

    artistDao.getArtistByEvent(req.params.eventId, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls artistDao to post a new artist to database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.addArtistToEvent = (req, res, next) => {
    console.log(TAG, `GET-request: /api/event/${req.params.eventId}/artist`);

    artistDao.addArtistToEvent(req.body.artist_name, req.body.first_name, req.body.last_name, req.body.email,
                                req.body.phone, req.body.document_id, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls artistDao to remove an artist from the datbase. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.removeArtistFromEvent = (req, res, next) => {
    console.log(TAG, `DELETE-request: /api/event/${req.params.eventId}/artist/${req.params.artistId}`);

    artistDao.removeArtistFromEvent(req.params.eventId, req.params.artistId, (err, rows) => {
        res.send(rows);
    })
};

/**
 * Calls artistDao to post a new artist and document, connected through contract, to database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.addArtistWithNewContract = (req, res, next) => {
    console.log(TAG, `POST-request: /api/event/${req.params.eventId}/artist/contract`);
    let data = {
        "name": req.body.name,
        "eventId": req.params.eventId,
        "path": req.body.path,
        "artist_name": req.body.artist_name,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "phone": req.body.phone
    };
    artistDao.addArtistWithNewContract(data, (err, rows) => {
        res.send(rows);
    });
};