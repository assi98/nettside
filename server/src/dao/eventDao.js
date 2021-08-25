// @flow

const Dao = require('./dao.js');

export class EventDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    /**
     * Inserts a new event into the database
     * @param json              contains all information needed to create an event
     * @param callback
     */
    createEvent(json: Object, callback: (status: string, data: string) => void) {
        let newEvent = [json.title, json.description, json.location, json.start_time, json.end_time, json.category, json.capacity, json.organizer, json.image];
        console.log('event', newEvent);
        super.query("CALL create_event(?,?,?,?,?,?,?,?,?)", newEvent, callback)
    }

    /**
     * Retrieves all events from the database
     * @param callback
     */
    getAllEvents(callback: (status: string, data: string) => void) {
        super.query("CALL get_all_events", [], callback);
    }

    /**
     * Gets all events meant to be displayed on the front page
     * @param callback
     */
    getFrontpageEvents(callback: (status: string, data: string) => void) {
        super.query("CALL get_frontpage_events", [], callback);
    }

    //TODO lage query i db
    //TODO lage test
    /**
     * Get events by a search
     * @param input             text that will be searched for
     * @param callback
     */
    getEventByInput(input: string, callback: (status: string, data: string) => void) {
        let values = [input];
        super.query("CALL get_all_events_by_input(?)", values, callback);
    }

    /**
     * Gets one event by id
     * @param eventId           id of event
     * @param callback
     */
    getEventById(eventId: number, callback: (status: string, data:string) => void) {
        let values = [eventId];
        super.query("CALL get_event_by_id(?)", values, callback);
    }

    /**
     * Gets one event by id UPDATE
     * @param event_id          id of event
     * @param callback
     */
    getEventByIdUpdate(event_id: number, callback: (status: string, data:string) => void) {
        let values = [event_id];
        super.query("CALL get_event_by_id_update(?)", values, callback);
    }

    /**
     * Gets event by its title
     * @param name              title of event
     * @param callback
     */
    getEventByName(name: string, callback: (status: string, data: string) => void) {
        let values = [name];
        super.query("CALL get_event_by_name(?)", values, callback);
    }

    /**
     * Gets events made by an user
     * @param organizer         id of the user
     * @param callback
     */
    getEventByUser(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL get_events_by_user(?)",
            values,
            callback);
    }

    /**
     * Gets the last event made by an user
     * @param organizer         id of the user
     * @param callback
     */
    getLastEventByUser(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL get_last_events_by_user(?)",
            values,
            callback);
    }

    /**
     * Gets all finished events by user
     * @param organizer         id of the user
     * @param callback
     */
    getEndedEventsByUser(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL get_events_by_end_time_user(?)",
            values,
            callback);
    }

    /**
     * Gets all cancelled events
     * @param cancelled         whether event is cancelled or not
     * @param callback
     */
    getEventsByCancelled(cancelled: boolean, callback: (status: string, data: string) => void) {
        let values = [cancelled];
        super.query("CALL get_events_by_cancelled(?)",
            values,
            callback);
    }

    /**
     * Deletes an event by id
     * @param event_id          id of event
     * @param callback
     */
    deleteEvent(event_id: number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL delete_event(?)",
            values,
            callback);
    }

    /**
     * Deletes events by that are 1 week old
     * @param organizer         id of user
     * @param callback
     */
    deleteEventsByEndTime(organizer: number, callback: (status: string, data: string) => void) {
        let values = [organizer];
        super.query("CALL delete_events_by_end_time(?)",
            values,
            callback);
    }

    /**
     * Cancels event by id
     * @param event_id          id of event to be cancelled
     * @param callback
     */
    cancelEvent(event_id : number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL cancel_event_by_id(?)",
            values,
            callback);
    }

    /**
     * Gets documents bound to an event
     * @param event_id          id of event
     * @param callback
     */
    getDocumentByEvent(event_id: number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL get_document_by_event(?)",
            values,
            callback);
    }

    /**
     * Gets cancelled event info
     * @param event_id          id of event
     * @param callback
     */
    getCancelledEventInfo(event_id: number, callback: (status: string, data: string) => void) {
        let values = [event_id];
        super.query("CALL get_cancelled_event_email_info(?)",
            values,
            callback);
    }

    /**
     * Updates event by id
     * @param event_id          id of event
     * @param json              contains all new info that event will be updated with
     * @param callback
     */
    updateEvent(event_id: number, json: Object, callback: (status: string, data: string) => void) {
        let eventUpdate = [json.title, json.description, json.location, json.start_time, json.end_time, json.category, json.capacity, json.organizer, json.event_id];
        console.log("Updated entire event: ", eventUpdate);
        super.query("CALL update_event(?,?,?,?,?,?,?,?,?)", eventUpdate, callback);

    }

    /**
     * Updates title of an event
     * @param json              new title
     * @param event_id          id of event
     * @param callback
     */
    updateEventTitle(json: Object, event_id: number, callback: (status: string, data: string) => void ) {
        let newTitle = [json.title, event_id];
        console.log("new title: ", newTitle);
        super.query("CALL update_event_title(?, ?)", newTitle, callback);
    }

    /**
     * Updates description of an event
     * @param json              new description
     * @param event_id          id of event
     * @param callback
     */
    updateEventDescription(json: Object, event_id: number, callback: (status: string, data: string) => void) {
        let newDescription = [json.description, event_id];
        console.log("New description: ", newDescription);
        super.query("CALL update_event_description(?, ?)", newDescription, callback);
    }

    /**
     * Updates the location of an event
     * @param json              new location
     * @param event_id          id of event
     * @param callback
     */
    updateEventLocation(json: Object, event_id: number, callback: (status: string, data: string) => void) {
        let newLocation = [json.location, event_id];
        console.log("New location: ", newLocation);
        super.query("CALL update_event_location(?, ?)", newLocation, callback);
    }

    /**
     * Updates the category of an event
     * @param json              new category
     * @param event_id          id of event
     * @param callback
     */
    updateEventCategory(json: Object, event_id: number, callback: (status: string, data: string) => void) {
        let newCategory = [json.category, event_id];
        console.log("New Category: ", newCategory);
        super.query("CALL update_event_category(?, ?)", newCategory, callback);
    }

    /**
     * Updates capacity of an event
     * @param json              new capacity
     * @param event_id          id of event
     * @param callback
     */
    updateEventCapacity(json: Object, event_id: number, callback: (status: string, data: string) => void) {
        let newCapacity = [json.capacity, event_id];
        console.log("New capacity: ", newCapacity);
        super.query("CALL update_event_capacity(?, ?)", newCapacity, callback);
    }

    /**
     * Gets all categories in database
     * @param callback
     */
    getCategories(callback: (status: string, data: string) => void) {
        super.query("CALL get_categories()", [], callback);
    }

    /**
     * Gets events made by username
     * @param username          username to search by
     * @param callback
     */
    getEventsByUsername(username: string, callback: (status: string, data:string) => void) {
        let user = [username];
        super.query("CALL get_events_by_username(?)", user, callback);
    }

    /**
     * Posts an image to an event
     * @param data              contains image and id of event
     * @param callback
     */
    postImageToEvent(data, callback: (status: string, data: string) => void) {
        let values = [data.image, data.eventId];
        super.query("CALL post_image_to_event(?,?)",
            values,
            callback);
    }

    /**
     * Gets all events one artist is attending
     * @param artistId          id of artist
     * @param callback
     */
    getEventsByArtist(artistId: string, callback: (status: string, data: string) => void) {
        let values = [artistId];
        super.query("CALL get_events_by_artist(?)",
            values,
            callback);
    }
}