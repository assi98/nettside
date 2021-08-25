// @flow

/**
 * Class for running SQL scripts
 */

const mysql = require("mysql");
const fs = require("fs");
/**
 * Method that runs setup files for testing
 * @param filename              name of files
 * @param pool                  connection pool
 * @param done
 */
module.exports = function run(filename, pool, done) {
    console.log("runsqlfile: reading file " + filename);
    let sql = fs.readFileSync(filename, "utf8");
    pool.getConnection((err, connection) => {
        if (err) {
            console.log("runsqlfile: error connecting");
            done();
        } else {
            connection.query(sql, (err, rows) => {
                connection.release();
                if (err) {
                    console.log(err);
                    done();
                } else {
                    done();
                }
            });
        }
    });
};
