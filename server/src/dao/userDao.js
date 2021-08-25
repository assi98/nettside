// @flow

const Dao = require("./dao.js");

export class UserDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    /**
     * Gets username by id
     * @param userId            id of user
     * @param callback
     */
    getUsername(userId: number, callback: (status: string, data: string) => void){
        let values = [userId];
        super.query("CALL get_username(?)",
            values,
            callback);
    }

    /**
     * Checks if username is already registered
     * @param username          username to be checked
     * @param callback
     */
    checkUsername(username: string, callback: (status: string, data: string) => void){
        let values = [username];
        super.query("CALL check_username(?)",
            values,
            callback);
    }

    /**
     * Gets password by username
     * @param username          username to get password from
     * @param callback
     */
    getPassword(username: string, callback: (status: string, data: string) => void){
        let values = [username];
        super.query("CALL get_password(?)",
            values,
            callback);
    }

    /**
     * Gets user by username
     * @param username          username to get user from
     * @param callback
     */
    getUser(username: string, callback: (status: string, data: string) => void){
        let values = [username];
        super.query("CALL get_user(?)",
            values,
            callback);
    }

    /**
     * Check and verify username
     * @param username          username to check and verify
     * @param callback
     */
    checkAndVerifyArtistUsername(username: string, callback: (status: string, data: string) => void) {
        let values = [username];
        super.query("CALL check_and_verify_artist_username(?)",
            values,
            callback);
    }

    /**
     * Gets an user by id
     * @param userId            id of user
     * @param callback
     */
    getUserById(userId: number, callback: (status: string, data: string) => void){
        let values = [userId];
        super.query("CALL get_user_by_id(?)",
            values,
            callback);
    }

    /**
     * Gets a contact by id
     * @param user_id           id of user
     * @param callback
     */
    getContact(user_id: number, callback: (status: string, data: string) => void){
        let values = [user_id];
        super.query("CALL get_contact(?)",
            values,
            callback);
    }

    /**
     * Gets an user by artist Id
     * @param artistId          id of artist
     * @param callback
     */
    getUserByArtist(artistId: number, callback: (status: string, data: string) => void) {
        let values = [artistId];
        super.query("CALL get_user_by_artist(?)",
            values,
            callback);
    }

    /**
     * Inserts a new user into the database
     * @param data              contains username, and password for user
     * @param contactId         id of contact
     * @param callback
     */
    postUser(data: Object, contactId: number, callback: (status: string, data: string) => void){
        let values = [data.username, data.password, contactId];
        super.query("CALL post_user(?,?,?)",
            values,
            callback);
    }

    //<DO NOT TOUCH>
    /**
     * Inserts a contact into the database
     * @param data              contains all contact info
     * @param callback
     */
    postContact(data, callback: ()=>void) {
        let first_name = data.first_name;
        let last_name = data.last_name;
        let email = data.email;
        let phone = data.phone;
        super.query(
            "INSERT INTO contact(contact_id, first_name, last_name, email, phone) VALUES(default,?,?,?,?)",
            [first_name, last_name, email, phone],
            callback
        );
    }
    //</DO NOT TOUCH>

    /**
     * Updates contact by id
     * @param contactId         id of contact
     * @param data              contains new info about the contact
     * @param callback
     */
    updateContact(contactId: number, data: Object, callback: (status: string, data: string) => void){
        let values = [contactId, data.first_name, data.last_name, data.email, data.phone];
        super.query("CALL put_contact(?,?,?,?,?)",
            values,
            callback);
    }

    /**
     * Updates password by id
     * @param userId            id of user
     * @param hash              hashed password
     * @param callback
     */
    updatePassword(userId: number, hash: string, callback: (status: string, data: string) => void){
        let values = [userId, hash];
        super.query("CALL put_password(?,?)",
            values,
            callback);
    }

    /**
     * Gets username by contact id
     * @param contactId         id of contact
     * @param callback
     */
    getOrganizerUsername(contactId: number, callback: (status: string, data: string) => void){
        let value = [contactId];
        super.query("CALL get_organizer_username(?)", value, callback);
    }
}
