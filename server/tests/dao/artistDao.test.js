// @flow

const mysql = require("mysql");
import {ArtistDAO} from "../../src/dao/artistDao";
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

const artistDao = new ArtistDAO(pool);

beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/artist_procedures.sql", pool, () => {
                runSqlFile("database/procedures/document_procedures.sql", pool, () => {
                    runSqlFile("database/testData.sql", pool, done);
                });

            })
        });
});

afterAll(() => {
    pool.end();
});

test("Get all artists from database", done => {
   function callback(status, data) {
       console.log(
           `Test callback: status=${status}, data=${data}`
       );

       data = data[0];
       expect(data.length).toBe(2);
       expect(data[0].artist_name).toBe("Geir Lippestad");
       expect(data[0].first_name).toBe("Geir");
       expect(data[1].artist_name).toBe("Svein Blipp");
       expect(data[1].first_name).toBe("Mia");
       done();
   }
   artistDao.getAllArtists(callback);
});

test("Get one new Artist from database by id", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].artist_name).toBe("Geir Lippestad");
        expect(data[0].first_name).toBe("Geir");
        done();
    }
    artistDao.getArtistById(1, callback);
});

test("Get artists from database by search #1", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        data = data[0];
        expect(data.length).toBe(2);
        done();
    }
    artistDao.getArtistBySearch("lipp", callback);
});

test("Get artists from database by search #2", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        data = data[0];
        expect(data.length).toBe(1);
        done();
    }
    artistDao.getArtistBySearch("Ge", callback);
});

test("Get artists from database by eventId", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].artist_name).toBe("Geir Lippestad");
        done();
    }
    artistDao.getArtistByEvent(1, callback);
});

test("Insert new newArtist", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        expect(data.affectedRows).toBe(1);
        done();
    }
    artistDao.insertArtist("Bob Dylling", "Bob", "Dylling", "bob@d.no", "56723456", callback);
});

test("Insert new newArtist with existing contact", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        expect(data.affectedRows).toBe(1);
        done();
    }
    artistDao.insertArtist("Svigers Eraller Verst", "Geir", "Lippestad", "geir@lips.no", "12345678", callback);
});

test("Add an artist to an event", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        expect(data.affectedRows).toBe(1);
        done();
    }
    artistDao.addArtistToEvent("Ok Go", "Ok", "Go", "ok.go@oh.no", "12345678", 1, callback);
});

test("Remove artist from an event", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        expect(data.affectedRows).toBe(1);
        done();
    }
    artistDao.removeArtistFromEvent(1, 5, callback);
});

test("Insert new artist with a new document and contract", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );

        expect(data.affectedRows).toBe(1);
        done();
    }

    artistDao.addArtistWithNewContract({
        "artist_name": "Bobern",
        "first_name": "Bob",
        "last_name": "Ross",
        "email": "b@b.com",
        "phone": "12345678",
        "name": "yaas.txt",
        "eventId": 1,
        "path": "./files/1------yaas.txt"
    }, callback);
});


test("Create artist on Contact", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    artistDao.createArtistOnContact('Mario', 1, callback);
});


test("getArtistByPreviousContract", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + JSON.stringify(data)
        );

        data = data[0];
        expect(data.length).toBeGreaterThanOrEqual(1);
        done();
    }
    artistDao.getArtistByPreviousContract(1, callback);
});






test("get artist by contact", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + JSON.stringify(data)
        );

        data = data[0];
        expect(data.length).toBeGreaterThanOrEqual(0);
        done();
    }
    artistDao.getArtistByContact(1, callback);
});





test("get artist by user", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + JSON.stringify(data)
        );

        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].first_name).toBe('Mario');

        done();
    }
    artistDao.getArtistByUser(1, callback);
});


test("remove one artist from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    artistDao.deleteArtist(2, callback);
});










