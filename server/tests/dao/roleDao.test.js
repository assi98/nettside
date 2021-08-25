// @flow

const mysql = require("mysql");
import {RoleDAO} from "../../src/dao/roleDAO.js";
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

const roleDao = new RoleDAO(pool);

beforeAll(done => {
    runSqlFile("database/setup.sql",
        pool, () => {
            runSqlFile("database/procedures/roleProcedures.sql", pool, () => {
                runSqlFile("database/testData.sql", pool, done);
            })
        });
});

afterAll(() => {
    pool.end();
});

test("Get all roles from database", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(3);
        expect(data[0].type).toBe("Bartender");
        expect(data[1].type).toBe("Lydtekniker");
        expect(data[2].type).toBe("Dorvakt");
        done();
    }
    roleDao.getRoles(callback);
});

test("Get amount of roles in event from database", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        data = data[0];
        expect(data.length).toBe(3);
        expect(data[0].role_id).toBe(1);
        expect(data[0].count).toBe(2);
        expect(data[1].role_id).toBe(2);
        expect(data[1].count).toBe(1);
        expect(data[2].role_id).toBe(3);
        expect(data[2].count).toBe(3);
        done();
    }
    roleDao.getRolesInEvent(1, callback);
});

test("Create role", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    roleDao.createRole("Lystekniker", 2, callback);
});

test("Add role to event", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    roleDao.assignToEvent(4, 2, 1, callback);
});

test("Remove role from event", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    roleDao.removeFromEvent(1, 1, callback);
});

test("Remove role", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    roleDao.removeRole(1, callback);
});

test("Update amount of a role event", done => {
    function callback(status, data) {
        console.log(
            `Test callback: status=${status}, data=${data}`
        );
        expect(data.affectedRows).toBe(1);
        done();
    }
    roleDao.updateRoleCount(4, 2, 2, callback);
});



