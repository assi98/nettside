// @flow

import {EventDAO} from "../dao/eventDao";
import {UserDAO} from "../dao/userDao";
import {Email} from "../email";

/**
 * Controller for receiving HTTP requests through the event endpoint
 */

const pool = require("../server");

const eventDao = new EventDAO(pool);
const userDao = new UserDAO(pool);
const emailService = new Email();

const TAG = '[EventController]';


/**
 * Calls eventDao to get events by a search string, get cancelled events, get events by artistDao or get front page events from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEvents = (req, res, next) => {
    console.log(TAG, `GET-request: /event`);
    if (req.query.name) {
        eventDao.getEventByName(req.query.name, (err, rows) => {
            res.json(rows);
        })
        /*} else if (req.query.eventId){
            eventDao.getEventById(req.query.name, (err, rows) => {
                res.json(rows);
            })*/
    } else if (req.query.cancelled) {
        let cancelled = (req.query.cancelled === "true");
        eventDao.getEventsByCancelled(cancelled, (err, rows) => {
            res.json(rows);
        })
    } else if (req.query.artistId) {
        eventDao.getEventsByArtist(req.query.artistId, (err, rows) => {
            res.json(rows);
        })
    } else {
        eventDao.getFrontpageEvents((err, [rows]) => {
            res.json(rows);
        })
    }
};

/**
 * Calls eventDao to get a document by event id from database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getDocumentByEvent = (req, res, next) => {
    console.log(TAG, `GET-request: /event/${req.param.s.eventId}/document`);
    eventDao.getDocumentByEvent(req.params.eventId, (err, rows) => {
       res.json(rows);
    });
};

/**
 * Calls eventDao to insert a new event to the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.insertEvent = (req, res, next) => {
    console.log(TAG, `POST-request: /event`);
    eventDao.createEvent(req.body,(status, data) => {

        res.status(status);
        res.json(data);
    });
};

/**
 * Calls eventDao to get an event by an event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventById = (req, res, next) => {
    console.log(TAG, `GET-request: /event/${req.params.eventId}` );

    eventDao.getEventById(req.params.eventId, (err, [rows]) => {
        res.json(rows)
    })
};
/**
 * Calls eventDao to get an event by an user id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventByUser = (req, res, next) => {
    console.log(TAG, 'GET-request: (getEventByUser');
    userDao.getContact(req.params.userId, (err, [rows]) => {
        console.log(TAG, rows);
        if(rows[0]) {
            if(rows[0].contact_id) {
                console.log(TAG, "tralala:" + rows[0].contact_id);
                eventDao.getEventByUser(rows[0].contact_id, (err, [rows2]) => {
                    res.json(rows2)
                })
            }
        }
    })
};

/**
 * Calls eventDao to get the latest event by an user id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getLastEventByUser = (req, res, next) => {
    console.log(TAG, 'GET-request: getLastEventByUser');
    userDao.getContact(req.params.userId, (err, [rows]) => {
        console.log(TAG, rows);
        if(rows[0]) {
            if(rows[0].contact_id) {
                console.log(TAG, "tralala:" + rows[0].contact_id);
                eventDao.getLastEventByUser(rows[0].contact_id, (err, [rows2]) => {
                    res.json(rows2)
                })
            }
        }
    })
};

/**
 * Calls eventDao to get ended events by an user id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEndedEventsByUser = (req, res, next) => {
    console.log(TAG, 'GET-request:');
    userDao.getContact(req.params.userId, (err, [rows]) => {
        console.log(TAG, rows);
        if(rows[0]) {
            if(rows[0].contact_id) {
                eventDao.getEndedEventsByUser(rows[0].contact_id, (err, [rows]) => {
                    res.json(rows)
                })
            }
        }
    })
};

/**
 * Calls eventDao to get the info of a cancelled event by event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventEmail = (req, res, next) => {
    console.log(TAG, `GET-request: /event/${req.params.eventId}/email` );

    eventDao.getCancelledEventInfo(req.params.eventId, (err, rows) => {
        res.json(rows);
    });
};

/**
 * Calls eventDao to delete an event by an event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteEvent = (req, res, next) => {

    console.log(TAG, `DELETE-request:: /event/${req.params.eventId}/delete`);

    eventDao.deleteEvent(req.params.event, (err, rows) => {
        res.json(rows);
    });

};

/**
 * Calls eventDao to delete all ended events more than one week old by an user id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.deleteEventByEndTime = (req, res, next) => {

    console.log(TAG, `DELETE-request:: /event/user/${req.params.contact_id}/ended`);

    userDao.getContact(req.params.userId, (err, [rows]) => {
        console.log(TAG, rows);
        if(rows[0]) {
            if(rows[0].contact_id) {
                eventDao.deleteEventsByEndTime(rows[0].contact_id, (err, rows) => {
                    res.send(rows);
                });
            }
        }
    });

};

/**
 * Calls eventDao to cancel an event by an event id in the database. Returns status from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.cancelEvent = (req, res, next) => {

    console.log(TAG, `PUT-request: /event/${req.params.eventId}/cancel`);

    try {

        eventDao.cancelEvent(req.params.eventId, (status, data) => {

            if(status === 200) {
                console.log(TAG, "cancelEvent = OK");

                eventDao.getCancelledEventInfo(req.params.eventId, (status, data) => {

                    if(status === 200 && data[0].length > 0) {
                        console.log(TAG, "getCancelledEventInfo = OK");

                        let eventId = data[0][0].event_id;
                        let emailList = [data[0][0].email];
                        let name = data[0][0].name;
                        let eventTitle = data[0][0].title;
                        let eventLocation = data[0][0].location;
                        let eventTime = data[0][0].start_time;

                        //console.log(TAG, emailList);
                        emailService.cancelledNotification(emailList, eventId, eventTitle, name, eventLocation, eventTime);

                        res.status(status);

                    } else {
                        console.log(TAG, "Failed to send email");
                    }
                });

            } else {
                console.log(TAG, "");
            }

        });
    } catch (e) {
        console.log(TAG, e);
    }
};

/**
 * Calls eventDao to get events by a search string from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventByInput = (req, res, next) => {
    console.log(TAG, "getEventByInput");
    console.log(TAG, `GET-request: event/search/${req.params.input}`);
    console.log(TAG, "input controller " + req.params.input);

    eventDao.getEventByInput(req.params.input, (err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls eventDao to get an event for editing by an event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventByIdUpdate = (req, res, next) => {
    console.log(TAG, `GET-request: /event/edit/${req.params.event_id}` );

    eventDao.getEventByIdUpdate(req.params.event_id, (err, rows) => {
        res.json(rows)
    })
};

/**
 * Calls eventDao to update the title of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateTitle = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventTitle(req.params.title, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the description of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateDescription = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventDescription(req.params.description, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the location of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateLocation = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventLocation(req.params.location, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the start time of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateStartTime = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventStartTime(req.params.start_time, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the end time of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateEndTime = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventEndTime(req.params.end_time, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the category of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateCategory = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventCategory(req.params.category, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update the capacity of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateCapacity = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEventCapacity(req.params.capacity, (status, data) => {
        res.status(status);
        res.json(data);
    })
};

/**
 * Calls eventDao to update an event of an event by an event id in the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.updateEvent = (req, res, next) => {
    console.log(TAG, "PUT-request:");
    eventDao.updateEvent(req.params.event_id, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    })
};
/**
 * Calls eventDao to insert an event into the database. Returns status and data from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.createEvent = (req, res, next) => {
    console.log(TAG, "POST-request:");
    eventDao.createEvent(req.body,(status, data) => {
        res.status(status);
        res.json(data);
    })
};
/**
 * Calls eventDao to get documents by event id from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getDocumentByEvent = (req, res, next) => {
    console.log(TAG, `GET-request:: /event/${req.params.eventId}/document`);

    eventDao.getDocumentByEvent(req.params.eventId, (err, rows) => {
        res.json(rows);
    });
};

/**
 * Calls eventDao to get all categories from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getCategories = (req, res, next) => {
    console.log(TAG, 'GET-request:: /categories');
    eventDao.getCategories((err, rows) => {
        res.json(rows);
    })
};

/**
 * Calls eventDao to get events by an username from the database. Returns rows from dao to service
 * @param req       request from service
 * @param res       response to service
 * @param next      next function
 */
exports.getEventsByUsername = (req, res, next) => {
    console.log(TAG, 'GET-request:: event/search/username')
    eventDao.getEventsByUsername(req.params.username, (err, rows) => {
        res.json(rows);
    })
};