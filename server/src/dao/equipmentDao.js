// @flow

const Dao = require("./dao.js");

export class EquipmentDAO extends Dao {
    constructor(pool) {
        super(pool);
    }

    /**
     * Inserts a new piece of equipment
     * @param name              name of equipment
     * @param userId            id of user the equipment will be bound to
     * @param callback
     */
    insertEquipment(name: string, userId: number, callback: (status: string, data: string) => void) {
        let values = [name, userId];
        super.query("CALL insert_equipment(?, ?)",
            values,
            callback);
    }

    /**
     * Deletes a specified piece of equipment
     * @param equipmentId       id of equipment to be deleted
     * @param callback
     */
    deleteEquipment(equipmentId: number, callback: (status: string, data: string) => void) {
        let values = [equipmentId];
        super.query("CALL delete_equipment(?)",
            values,
            callback);
    }

    /**
     * Fetches all equipment in the database
     * @param callback
     */
    getAllEquipment(callback: (status: string, data: string) => void) {
        super.query("CALL get_all_equipment()",
                [],
                callback);
    }

    /**
     * Get one piece of equipment by id
     * @param equipment_id      id of equipment
     * @param callback
     */
    getEquipmentById(equipment_id: number, callback: (status: string, data: string) => void) {
        let values = [equipment_id];
        super.query("CALL get_equipment_by_id(?)",
                values,
                callback);
    }

    /**
     * Get equipment by a name search
     * @param name              name to search for
     * @param callback
     */
    getEquipmentByName(name: string, callback: (status: string, data: string) => void) {
        let values = [name];
        super.query("CALL get_equipment_by_name(?)",
                values,
                callback);
    }

    /**
     * Get equipment by an event
     * @param event             event to get equipment from
     * @param callback
     */
    getEquipmentByEvent(event: number, callback: (status: string, data: string) => void) {
        let values = [event];
        super.query("CALL get_equipment_by_event(?)",
            values,
            callback);
    }

    /**
     * Adds a new equipment to an event
     * @param event             event to add equipment to
     * @param item              name of equipment
     * @param amount            amount of this equipment to add
     * @param callback
     */
    addEquipmentToEvent(event: number, item: string, amount: number, callback: (status: string, data: string) => void) {
        let values = [event, item, amount];
        super.query("CALL add_equipment_to_event(?, ?, ?)",
            values,
            callback);
    }

    /**
     * Removes an equipment from an event
     * @param event             event to remove equipment from
     * @param equipment         id of equipment to remove
     * @param callback
     */
    removeEquipmentFromEvent(event: number, equipment: number, callback: (status: string, data: string) => void) {
        let values = [event, equipment];
        super.query("CALL remove_equipment_from_event(?, ?)",
            values,
            callback);
    }

    /**
     * Updates the amount of an equipment to an event
     * @param event             event to update
     * @param equipment         id of equipment to update
     * @param amount            amount of this equipment to add
     * @param callback
     */
    updateEquipmentOnEvent(event: number, equipment: number, amount: number, callback: (status: string, data: string) => void) {
        let values = [event, equipment, amount];
        super.query("CALL update_equipment_on_event(?, ?, ?)",
            values,
            callback);
    }
}
