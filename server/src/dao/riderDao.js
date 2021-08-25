// @flow

const Dao = require("./dao.js");

export class RiderDAO extends Dao{
    constructor(pool) {
        super(pool);
    }

    /**
     * Inserts a new rider to the database
     * @param json              contains description and the document to be added
     * @param callback
     */
    postRider(json: Object, callback: (status: string, data: string) => void){
        let values = [json.description, json.document];
        super.query("CALL post_rider(?,?)",
            values,
            callback);
    }

    /**
     * Gets a rider by id
     * @param id                id of rider
     * @param callback
     */
    getRider(id: number, callback: (status: string, data: string) => void){
        let values = [id];
        super.query("CALL get_rider(?)",
            values,
            callback);
    }

    /**
     * Gets riders by document id
     * @param document          id of document
     * @param callback
     */
    getAllRiders(document: number, callback: (status: string, data: string) => void){
        let values = [document];
        super.query("CALL get_all_riders(?)",
            values,
            callback);
    }

    /**
     * Updates a rider by id
     * @param json              contains new description and id of rider
     * @param callback
     */
    updateRider(json: Object, callback: (status: string, data: string) => void){
        let values = [json.description, json.rider_id];
        super.query("CALL update_rider(?,?)",
            values, callback);
    }

    /**
     * Deletes a rider by id
     * @param id                id of rider
     * @param callback
     */
    deleteRider(id: number, callback: (status: string, data: string) => void){
        let values = [id];
        super.query("CALL delete_rider(?)",
            values,
            callback);
    }

    /**
     * Deletes all riders by document id
     * @param document          id of document
     * @param callback
     */
    deleteAllRiders(document: number, callback: (status: string, data: string) => void){
        let values = [document];
        super.query("CALL delete_all_riders(?)",
            values,
            callback);
    }
}