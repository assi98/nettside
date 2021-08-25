/**
  Procedures related to the equipment table
 */


/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS insert_equipment;
DROP PROCEDURE IF EXISTS delete_equipment;
DROP PROCEDURE IF EXISTS get_all_equipment;
DROP PROCEDURE IF EXISTS get_equipment_by_id;
DROP PROCEDURE IF EXISTS get_equipment_by_name;
DROP PROCEDURE IF EXISTS get_equipment_by_event;
DROP PROCEDURE IF EXISTS get_equipment_by_organizer;
DROP PROCEDURE IF EXISTS add_equipment_to_event;
DROP PROCEDURE IF EXISTS remove_equipment_from_event;
DROP PROCEDURE IF EXISTS update_equipment_on_event;

/**
  Inserts a new piece of equipment

  IN item_in: Name of the equipment

  Issued by: insertEquipment(name: string)
 */
CREATE PROCEDURE insert_equipment(IN item_in VARCHAR(50), IN user_id_in INT)
BEGIN
  INSERT INTO equipment (item, organizer)
  VALUES (item_in, user_id_in);
END;

/**
  Deletes a piece of equipment

  IN equipment_id: Id of the equipment

  Issued by: deleteEquipment(equipmentId: number)
 */
CREATE PROCEDURE delete_equipment(IN equipment_id_in INT)
BEGIN
  DELETE FROM equipment WHERE equipment_id=equipment_id_in;
END;

/**
  Fetches all equipment

  Issued by: getAllEquipment()
 */
CREATE PROCEDURE get_all_equipment()
BEGIN
  SELECT equipment_id, item FROM equipment;
END;

CREATE PROCEDURE get_equipment_by_organizer(IN user_id_in INT)
BEGIN
  SELECT equipment_id, item FROM equipment
  WHERE organizer=user_id_in;
END;

/**
  Fetches equipment based on an id

  IN equipment_id_in: Id of the equipment

  Issued by: getEquipmentById(equipmentId: number)
 */
CREATE PROCEDURE get_equipment_by_id(IN equipment_id_in INT)
BEGIN
  SELECT equipment_id, item FROM equipment WHERE equipment_id=equipment_id_in;
END;

/**
  Fetches equipment based on name search

  IN equipment_name_in: Name of the equipment

  Issued by: getEquipmentByName(name: string)
 */

CREATE PROCEDURE get_equipment_by_name(IN equipment_name_in VARCHAR(50))
BEGIN
  SELECT equipment_id, item FROM equipment WHERE item LIKE CONCAT('%', equipment_name_in, '%');
END;

/**
  Fetches equipment based on an event id

  IN event_id_in: Id of the event

  Issued by: getEquipmentByEvent(event: number)
 */

CREATE PROCEDURE get_equipment_by_event(IN event_id_in INT)
BEGIN
  SELECT ee.event, ee.equipment, e.item, ee.amount FROM equipment e
                                                          JOIN event_equipment ee on e.equipment_id = ee.equipment
  WHERE ee.event = event_id_in;
END;

/**
  Adds a piece of equipment to an event. If the piece is already registered to this event, add to the amount

  IN event_id_in: Id of the event
  IN item_in: Name of the equipment
  IN amount_in: Amount of this equipment

  Issued by: addEquipmentToEvent(event: number, item: string, amount: number)
 */

CREATE PROCEDURE add_equipment_to_event(IN event_id_in INT, IN item_in VARCHAR(50), IN amount_in INT)
BEGIN
  DECLARE equipment_id_in INT;
  DECLARE user_id_in INT;
  SET user_id_in = (SELECT organizer FROM event WHERE event_id=event_id_in LIMIT 1);
  SET equipment_id_in = IFNULL((SELECT equipment_id FROM equipment WHERE item=item_in AND organizer=user_id_in LIMIT 1), 0);
  IF (equipment_id_in = 0) THEN
    CALL insert_equipment(item_in, user_id_in);
    SET equipment_id_in = LAST_INSERT_ID();
  END IF;
  IF ((SELECT COUNT(*) FROM event_equipment WHERE equipment=equipment_id_in AND event=event_id_in) = 0) THEN
    INSERT INTO event_equipment (equipment, event, amount)
    VALUES (equipment_id_in, event_id_in, amount_in);
  ELSE
    UPDATE event_equipment SET amount=(amount+amount_in) WHERE equipment=equipment_id_in AND event = event_id_in;
  END IF;
END;

/**
  Removes a piece of equipment from an event

  IN event_id_in: Id of the event
  IN equipment_id_in: Id of the equipment

  Issued by: removeEquipmentFromEvent(event: number, equipment: number)
 */
CREATE PROCEDURE remove_equipment_from_event(IN event_id_in INT, IN equipment_id_in INT)
BEGIN
  DELETE FROM event_equipment WHERE event=event_id_in AND equipment=equipment_id_in;
END;

/**
  Updates existing equipment registered on an event

  IN event_id_in: Id of the event
  IN equipment_id_in: Id of the equipment
  IN amount_in: Amount to update to

  Issued by: updateEquipmentOnEvent(event: number, equipment: number, amount: number)
 */
CREATE PROCEDURE update_equipment_on_event(IN event_id_in INT, IN equipment_id_in INT, IN amount_in INT)
BEGIN
  UPDATE event_equipment SET amount=amount_in WHERE event=event_id_in AND equipment=equipment_id_in;
END;
