// @flow

/**
 *
 * @type {Dao}
 * Base Dao class that all dao's use
 */
module.exports = class Dao {
    pool: Object;
    constructor(pool: Object) {
        this.pool = pool;
    }

    query(sql: string, params: Array<any>, callback: any) {
        this.pool.getConnection((err, connection) => {
            if(err) {
                console.log(`[DataAccessObject]: ${err}`);
                callback(500, {error: 'connection error'});
            } else {
                connection.query(sql, params, (err, rows) => {
                    connection.release();
                    if(err) {
                        console.log(err);
                        callback(500, {error: err});
                    } else {
                        callback(200, rows);
                    }
                });
            }
        });
    }
};