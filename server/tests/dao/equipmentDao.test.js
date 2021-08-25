// @flow

const mysql = require("mysql");
import {EquipmentDAO} from "../../src/dao/equipmentDao";
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

const equipmentDao = new EquipmentDAO(pool);

beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/equipment_procedures.sql", pool, () => {
                runSqlFile("database/testData.sql", pool, done);
            })
        });
});

afterAll(() => {
    pool.end();
});

test("Get all equipment from database", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(4);
        expect(data[0].item).toBe("Trommesett");
        expect(data[1].item).toBe("Gitarforsterker");
        expect(data[2].item).toBe("Bassforsterker");
        expect(data[3].item).toBe("XLR-kabel");
        done();
    }
    equipmentDao.getAllEquipment(callback);
});

test("Get one equipment from database by id", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].item).toBe("Gitarforsterker");
        done();
    }
    equipmentDao.getEquipmentById(2, callback);
});

test("Get one equipment from database by name", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].equipment_id).toBe(4);
        done();
    }
    equipmentDao.getEquipmentByName("XLR-kabel", callback);
});

test("Add new equipment", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.insertEquipment("Mikrofonstativ", 1, callback);
});

test("Delete equipment", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.deleteEquipment(5, callback);
});

test("Get equipment by event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(4);
        done();
    }
    equipmentDao.getEquipmentByEvent(1, callback);
});

test("Add equipment to event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.addEquipmentToEvent(2, "Bassforsterker", 1, callback);
});

test("Add existing equipment to event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.addEquipmentToEvent(1, "Bassforsterker", 3, callback);
});

test("Add new equipment to event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.addEquipmentToEvent(2, "3/4 Jack", 3, callback);
});

test("Remove equipment from event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.removeEquipmentFromEvent(1, 2, callback);
});

test("Update equipment on event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    equipmentDao.updateEquipmentOnEvent(2, 4, 9, callback);
});

test("Update non-existing equipment on event", done =>  {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(0);
        done();
    }
    equipmentDao.updateEquipmentOnEvent(2, 2, 9, callback);
});
