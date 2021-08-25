//@flow
import {TicketDAO} from "../../src/dao/ticketDao"

let mysql = require("mysql");
const runsqlfile = require("../../src/dao/runSqlFile.js");
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

let ticketDao = new TicketDAO(pool);

beforeAll(done => {
    runsqlfile("database/setup.sql",
    pool,() =>{
        runsqlfile("database/procedures/ticket_procedures.sql", pool, () => {
          runsqlfile("database/testData.sql", pool, done);
         });
    });
});

afterAll(() => {
    pool.end();
});


test("get all ticket from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(2);
        done();
    }
    ticketDao.getAll(1,callback);
});



test("get one ticket from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );

        data = data[0];
        expect(data.length).toBe(1);
        expect(data[0].title).toBe('enTittel');
        expect(data[0].event).toBe(1);
        done();
    }
    ticketDao.getOne(1, callback);
});



test("add ticket to db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    ticketDao.createOne(
        {title: 'tredjendreTittel', info: 'TredjeInfo_in', price: 3, count: 3, event: 2},
        callback
    );
});



test("update one ticket from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data.length=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    ticketDao.updateOneTicket({ticket_id: '2',title: 'endreTittel', info: 'endreInfo_in', price: 99, count: 99}, callback);
});



test("remove one ticket from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    ticketDao.removeOneTicket(2, callback);
});







