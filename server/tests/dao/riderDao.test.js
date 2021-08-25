// @flow
const mysql = require("mysql");
import {RiderDAO} from "../../src/dao/riderDao";
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

const riderDao = new RiderDAO(pool);

beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/rider_procedures.sql", pool, () => {
                runSqlFile("database/testData.sql", pool, done);
            })
        });
});

afterAll(() => {
    pool.end();
});

test("Add new rider", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    riderDao.postRider({
        "description": "Mathias stalker meg",
        "document": 1
    }, callback);
});

test("Get one rider from database by id", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].description).toBe("Mathias må ha tre kameler og syv geiter");
        done();
    }
    riderDao.getRider(1, callback);
});

test("Get riders from database by document id", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(3);
        expect(data[0].description).toBe("Mathias må ha tre kameler og syv geiter");
        expect(data[1].description).toBe("Mathias må ha en full size yobama statue");
        expect(data[2].description).toBe("Mathias har problemer, han trenger hjelp");
        done();
    }
    riderDao.getAllRiders(2, callback);
});

test("Update rider", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    riderDao.updateRider({description : 'var egentlig syv kameler', rider_id : 1}, callback);
});

test("Remove a rider by id", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    riderDao.deleteRider(4, callback);
});

test("Remove all riders by a document id", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(3);
        done();
    }
    riderDao.deleteAllRiders(2, callback);
});
