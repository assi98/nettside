// @flow

const Dao = require("./dao.js");

export class FileInfoDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    /**
     * Gets one document by document id
     * @param document_id       id of document
     * @param callback
     */
    getFileInfoById(document_id: number, callback: (status: string, data: string) => void) {
        let values = [document_id];
        super.query("CALL get_document_by_id(?)",
            values,
            callback);
    }

    /**
     * Gets all documents by event id
     * @param event             id of event
     * @param callback
     */
    getFileInfoByEvent(event: number, callback: (status: string, data: string) => void) {
        let values = [event];
        super.query("CALL get_document_by_event(?)",
            values,
            callback);
    }

    /**
     * Checks if a document name exist in db
     * @param eventId           id of event
     * @param fileName          name of file
     * @param callback
     */
    checkFileName(eventId: number, fileName: string, callback: (status: string, data: string) => void) {
        let values = [eventId, fileName];
        console.log("SE PÅ DENNE DATAN!!!!: " + eventId);
        super.query("CALL check_document_name(?,?)",
            values,
            callback);
    }

    /**
     * Fetches all contracts by an artist id
     * @param artistId          id of artist
     * @param callback
     */
    getContractByArtistId(artistId: number, callback: (status: string, data: string) => void){
        let values = [artistId];
        super.query("CALL get_contract_by_artist_id(?)",
            values,
            callback);
    }

    /**
     * Posts a document to the database
     * @param data              contains name, path and id of event
     * @param callback
     */
    //<DO NOT TOUCH>
    postFileInfo(data, callback: ()=>void) {
        console.log("data.name: " + data.name);
        console.log("data.eventId: " + data.eventId);
        super.query(
            "INSERT INTO document(document_id, name, path, event) VALUES(default,?,?,?)",
            [data.name, data.path, data.eventId],
            callback
        );
    }

    /**
     * Deletes a document from the db
     * @param path              path of the document
     * @param callback
     */
    //</DO NOT TOUCH
    deleteFileInfo(path: string, callback: (status: string, data: string) => void){
        let values = [path];
        super.query("CALL delete_document(?)",
            values,
            callback);
    }
    //</DO NOT TOUCH>

}