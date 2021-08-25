// @flow

//TODO skrive test for get event by id
const mysql = require("mysql");
import {EventDAO} from "../../src/dao/eventDao.js";
const runSqlFile = require("../../src/dao/runSqlFile.js");
const config = require("../../src/controllers/configuration.js");

// Create pool for test database
let database: {} = config.getTestingDatabase();
let pool = mysql.createPool({
    connectionLimit: 1,
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database,
    debug: false,
    multipleStatements: true
});

const eventDao = new EventDAO(pool);
beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/event_procedures.sql", pool, () => {
                runSqlFile("database/testData.sql", pool,() => {
                    runSqlFile("database/procedures/event_edit_procedures.sql", pool, done)
                });
            })
        });
});

afterAll(() => {
    pool.end();
});

test("Get all events", done => {
   function callback(status, data) {
       console.log(
           `Test callback: status=${status}, data=${data}`
       );
       data = data[0];
       expect(data.length).toBe(5);
       done();
   }
   eventDao.getAllEvents(callback);
});

test("Get frontpage events", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(4);

        done();
    }
    eventDao.getFrontpageEvents(callback);
});

test("get not-cancelled events from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        data = data[0];
        expect(data.length).toBe(4);
        done();
    }
    eventDao.getEventsByCancelled(false, callback);
});

test("get cancelled events from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].title).toBe('Konsert m/ ballonger');
        expect(data[0].description).toBe('Konsertbeskrivelse');
        expect(data[0].location).toBe('Trondheim');
        expect(data[0].organizer).toBe(3);
        done();
    }
    eventDao.getEventsByCancelled(true, callback);
});

test("get events on a user from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        data = data[0];
        expect(data.length).toBe(4);
        done();
    }
    eventDao.getEventByUser(1, callback);
});

test("get ended events by a user from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        data = data[0];
        expect(data.length).toBe(3);
        done();
    }
    eventDao.getEndedEventsByUser(1, callback);
});

test("create event", done => {
    function callback(status, data) {
        console.log(`Test callback: status=${status}, data=${data}`);
        expect(data.affectedRows).toEqual(1);
        done();
    }
    eventDao.createEvent({
            "title": "test.js",
            "description": "description",
            "location": "homepage.js",
            "start_time": "2020-01-01",
            "end_time": "2020-01-01",
            "category": "homepage.js",
            "capacity": "100",
            "organizer": "1",
            "cancelled": "0",
            "image": "hey"
        },
        callback);
});

test("update event", done => {
    function callback(status, data) {
        console.log(`Test callback: status=${status}, data=${data}`);
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.updateEvent(4, {
        "title": "Test00",
        "description": "Test00description",
        "location": "homepage.js",
        "start_time": "2020-01-01",
        "end_time": "2020-01-01",
        "category": "homepage.js",
        "capacity": "100",
        "organizer": "1",
        "event_id": "4"
    }, callback);
});

test("get new event details by id", done => {
    function callback(status, data) {
        console.log(`Test callback: status=${status}, data=${data}`);
        data = data[0];
        expect(data.length).toBe(6);
        expect(data[3].title).toBe("Test00");
        expect(data[3].description).toBe("Test00description");
        done();
    }
    eventDao.getAllEvents(callback);
});

test("cancel event from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.cancelEvent(2, callback);
});

test("get cancelled event information", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].title).toBe('Konsert m/ ballonger');
        expect(data[0].name).toBe('Mia Fornes');
        expect(data[0].email).toBe('mia@test.com');
        done();
    }
    eventDao.getCancelledEventInfo(3, callback);
});

test("search for event by title with string", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(2);
        expect(data[0].title).toBe('Konsert');
        expect(data[1].title).toBe('Konsert m/ ballonger');
        done();
    }
    eventDao.getEventByInput('kon', callback);
});

test("get all categories in database", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(5);
        expect(data[0].name).toBe('Festival');
        expect(data[1].name).toBe('Høytids-sammenkomst');
        expect(data[2].name).toBe('Karneval');
        expect(data[3].name).toBe('Konsert');
        expect(data[4].name).toBe('Party');
        done();
    }
    eventDao.getCategories(callback);
});

test('get events made by user', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(5);
        expect(data[0].title).toBe('EM Håndball');
        expect(data[1].title).toBe('Konsert');
        expect(data[2].title).toBe('Test00');
        expect(data[3].title).toBe('Party');
        expect(data[4].title).toBe('test.js');
        done();
    }
    eventDao.getEventsByUsername('Mario', callback);
});

test('get event by id', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data[0].title).toBe('Party');
        done();
    }
    eventDao.getEventById(5, callback);
});
/*
test('get event by name', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data[0].description).toBe('beskrivelse yo');
        expect(data[0].location).toBe('Trondheim');
        done();
    }
    eventDao.getEventByName('Party', callback());
});*/

test('get document by event', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data[0].name).toBe('lmao');
        done();
    }
    eventDao.getDocumentByEvent(5, callback);
});

test('update event title', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.updateEventTitle({title: 'Porty'}, 5, callback)
});

test('update event description', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.updateEventDescription({description: 'yo beskrivelse'}, 5, callback);
});

test('update event', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.updateEventLocation({location: 'Oslo'}, 5, callback);
});

test('update event category', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.updateEventCategory({category: 'Karneval'}, 5, callback);
});

test('update event capacity', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1)
        done();
    }
    eventDao.updateEventCapacity({capacity: 69}, 5, callback);
});

test('Get events bound to an artist', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].title).toBe('EM Håndball');
        done();
    }
    eventDao.getEventsByArtist(1, callback);
});

test('post image to event', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    eventDao.postImageToEvent({image: '123.png', eventId: 5}, callback)
});

test('get event by id update', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data[0].title).toBe('Porty');
        done();
    }
    eventDao.getEventByIdUpdate(5, callback);
});

test('get last event made by organizer', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data[0].title).toBe('test.js');
        done();
    }
    eventDao.getLastEventByUser(1, callback)
});

test("delete_ ended event from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status = " + status + ", data = " + JSON.stringify(data)
        );
        //TODO change end_time in setup.sql
        expect(data.affectedRows).toBe(4);
        done();
    }
    eventDao.deleteEventsByEndTime(1, callback);
});

/*
test('deletes event from database', done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(7);
        done();
    }
    eventDao.deleteEvent(5, callback);
});*/