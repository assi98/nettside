/**
  Procedures related to the document table
 */


/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS get_document_by_id;
DROP PROCEDURE IF EXISTS get_document_by_event;
DROP PROCEDURE IF EXISTS check_document_name;
DROP PROCEDURE IF EXISTS delete_document;
DROP PROCEDURE IF EXISTS add_document;
DROP PROCEDURE IF EXISTS get_contract_by_artist_id;
/**
  Fetches one document based on an document_id

  IN document_id_in: Id of the document

  Issued by: getFileById(document_id: number)
 */

CREATE PROCEDURE get_document_by_id(IN document_id_in INT)
BEGIN
  SELECT * FROM document
  WHERE document_id = document_id_in;
END;

/**
  Fetches documents based on an event_id

  IN event_id_in: Id of the event

  Issued by: getFileByEvent(event: number)
 */

CREATE PROCEDURE get_document_by_event(IN event_id_in INT)
BEGIN
  SELECT document_id, name, path FROM document
  WHERE event = event_id_in;
END;

/**
  Fetches count of rows with name = file_name_in

  IN event_id_in: Id of the event
  IN file_name_in: document name we want to check

  Issued by: checkFileName(eventId: number, fileName: string)
 */

CREATE PROCEDURE check_document_name(IN event_id_in INT(11), IN file_name_in VARCHAR(100))
BEGIN
    SELECT EXISTS(SELECT * FROM document
    where name = file_name_in AND event = event_id_in) as duplicate;
END;

/**
  Deletes a document

  IN path_in: path of the file

  Issued by: deleteFileInfo(path: string)
 */
CREATE PROCEDURE delete_document(IN path_in VARCHAR(500))
BEGIN
    DELETE FROM document WHERE path = path_in;
END;

/**
  Adds a document

  IN document_id_in: id of document
  IN document_name_in: name of document
  IN event_id_in: event id of document
  IN path_in: path of the file

  Issued by: add_artist_with_new_contract
 */
CREATE PROCEDURE add_document(OUT document_id_in INT(11), IN document_name_in VARCHAR(100), IN path_in VARCHAR(500), IN event_id_in INT(11))
BEGIN
    INSERT INTO document (name, path, event)
    VALUES (document_name_in, path_in, event_id_in);
    SET document_id_in = LAST_INSERT_ID();
END;

/**
  Gets document path by artistId

  IN artist_id_in: id of artist

  Issued by: getContractByArtistId(artistId: number)
 */
CREATE PROCEDURE get_contract_by_artist_id(IN artist_id_in INT(11))
BEGIN
    SELECT path FROM document INNER JOIN contract ON (document.document_id = contract.document) INNER JOIN artist ON (contract.artist = artist.artist_id) WHERE artist_id = artist_id_in;
END;

