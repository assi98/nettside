//flow

const mysql = require("mysql");
import {FileInfoDAO} from "../../src/dao/fileInfoDao.js";
const runSqlFile = require("../../src/dao/runSqlFile");
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

const fileInfoDao = new FileInfoDAO(pool);

beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/document_procedures.sql", pool, () => {
                runSqlFile("database/testData.sql", pool, done);
            })
        });
});

afterAll(() => {
    pool.end();
});

test("Add new document", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    fileInfoDao.postFileInfo(
        {"name": "Bob",
            "path": "Ross",
            "eventId": 1},
        callback);
});

test("Get one document from db by document id", done => {
    function callback(status, data) {
        console.log(
            'Test callback: status=${status}, data=${data}'
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].name).toBe("Bob");
        done();

    }
    fileInfoDao.getFileInfoById(5, callback);
});

test("Get one document from db by event id", done => {
    function callback(status, data) {
        console.log(
            'Test callback: status=${status}, data=${data}'
        );
        data = data[0];
        expect(data.length).toBe(4);
        expect(data[0].name).toBe("Carl");
        expect(data[3].name).toBe("Bob");
        done();

    }
    fileInfoDao.getFileInfoByEvent(1, callback);
});

test("Check if document name exist in db", done => {
    function callback(status, data) {
        console.log(
            'Test callback: status=${status}, data=${data}'
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].duplicate).toBe(1);
        done();

    }
    fileInfoDao.checkFileName(1, "Bob", callback);
});

test("Remove document from db", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    fileInfoDao.deleteFileInfo("Ross", callback);
});

test("Get one document from db by document id", done => {
    function callback(status, data) {
        console.log(
            'Test callback: status=${status}, data=${data}'
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].path).toBe("Barks");
        done();

    }
    fileInfoDao.getContractByArtistId(1, callback);
});