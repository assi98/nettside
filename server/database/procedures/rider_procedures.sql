/**
 Delete all procedures for recreation
*/
DROP PROCEDURE IF EXISTS post_rider;
DROP PROCEDURE IF EXISTS get_rider;
DROP PROCEDURE IF EXISTS get_all_riders;
DROP PROCEDURE IF EXISTS update_rider;
DROP PROCEDURE IF EXISTS delete_rider;
DROP PROCEDURE IF EXISTS delete_all_riders;

/**
  Inserts a new rider

  IN description_in: Name of the equipment
  IN document_in: id of the document the rider is attached to

  Issued by: postRider(data: Object)
 */
CREATE PROCEDURE post_rider(IN description_in VARCHAR(100), IN document_in INT(11))
BEGIN
    INSERT INTO rider (description, document)
    VALUES (description_in, document_in);
END;

/**
  fetches rider based on an id

  IN id_in: Name of the equipment

  Issued by: getRider(id: number)
 */
CREATE PROCEDURE get_rider(IN id_in INT(11))
BEGIN
    SELECT * FROM rider WHERE rider_id = id_in;
END;

/**
  fetches all riders based on a document id

  IN document_id_in: Name of the equipment

  Issued by: getAllRider(document: number)
 */
CREATE PROCEDURE get_all_riders(IN document_id_in INT(11))
BEGIN
    SELECT * FROM rider WHERE document = document_id_in;
END;

/**
  Updates existing rider registered on a document

  IN rider_id_in: Id of the rider
  IN description_in: new description for rider

  Issued by: updateRider(description: string, id: number)
 */
CREATE PROCEDURE update_rider(IN description_in VARCHAR(100), IN rider_id_in INT(11))
BEGIN
    UPDATE rider SET description=description_in WHERE rider_id = rider_id_in;
END;

/**
  Deletes a rider based on an id

  IN rider_id_in: Id of the rider

  Issued by: deleteRider(id: number)
 */
CREATE PROCEDURE delete_rider(IN rider_id_in INT(11))
BEGIN
    DELETE FROM rider WHERE rider_id=rider_id_in;
END;

/**
  Deletes all riders based on a document id

  IN document_id_in: Id of the rider

  Issued by: deleteAllRiders(document: number)
 */
CREATE PROCEDURE delete_all_riders(IN document_id_in INT(11))
BEGIN
    DELETE FROM rider WHERE document=document_id_in;
END;
