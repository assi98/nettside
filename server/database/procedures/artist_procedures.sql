/**
  Creates procedures related to the artist table
 */

/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS add_artist_to_event;
DROP PROCEDURE IF EXISTS create_artist_on_contact;
DROP PROCEDURE IF EXISTS delete_artist;
DROP PROCEDURE IF EXISTS get_all_artists;
DROP PROCEDURE IF EXISTS get_artist_by_id;
DROP PROCEDURE IF EXISTS get_artist_by_contact;
DROP PROCEDURE IF EXISTS get_artist_by_query;
DROP PROCEDURE IF EXISTS get_artist_by_search;
DROP PROCEDURE IF EXISTS get_artist_by_event;
DROP PROCEDURE IF EXISTS get_artist_by_contact;
DROP PROCEDURE IF EXISTS get_artist_by_user;
DROP PROCEDURE IF EXISTS get_artist_by_previous_contract;
DROP PROCEDURE IF EXISTS insert_artist;
DROP PROCEDURE IF EXISTS remove_artist_from_event;
DROP PROCEDURE IF EXISTS update_artist;
DROP PROCEDURE IF EXISTS add_artist_with_new_contract;

/**
  Inserts a new newArtist with contact information

  IN artist_name_in: Name of the newArtist
  IN first_name_in: First name of newArtist contact
  IN last_name_in: Last name of newArtist contact
  IN email_in: Email of newArtist contact
  IN phone_in: Phone number of newArtist contact
  OUT artist_id: New id if new artist, existing id if artist with this information already exists

  Issued by: insertArtist(artistName: string, firstName: string, lastName: string, email: string, phone: string)
 */
CREATE PROCEDURE insert_artist(IN artist_name_in VARCHAR(50), IN first_name_in VARCHAR(50), last_name_in VARCHAR(50),
                               IN email_in VARCHAR(50), IN phone_in VARCHAR(50), OUT artist_id INT)
proc_label:
BEGIN
  DECLARE contact_id_in INT;
  SET contact_id_in = (SELECT contact_id
                       FROM contact
                       WHERE first_name = first_name_in
                         AND last_name = last_name_in
                         AND phone = phone_in
                         AND email = email_in
                       LIMIT 1);
  IF (contact_id_in IS NOT NULL AND artist_name_in IN (SELECT artist_name FROM artist)) THEN
    SET artist_id = (SELECT a.artist_id
                     FROM artist a
                            JOIN contact c on a.contact = c.contact_id
                     WHERE a.artist_name = artist_name_in
                       AND c.first_name = first_name_in
                       AND c.last_name = last_name_in
                       AND email = email_in
                       AND phone = phone_in
                     LIMIT 1);
  ELSE
    IF (contact_id_in IS NULL) THEN
      INSERT INTO contact (first_name, last_name, email, phone)
      VALUES (first_name_in, last_name_in, email_in, phone_in);
      SET contact_id_in = LAST_INSERT_ID();
    END IF;

    INSERT INTO artist(artist_name, contact)
    VALUES (artist_name_in, contact_id_in);
    SET artist_id = LAST_INSERT_ID();
  END IF;
END;

/**
  Inserts a new artist on an existing contact.

  IN artist_name_in: Name of the artist
  IN contact_id_in: Id of the contact to bind to
 */
CREATE PROCEDURE create_artist_on_contact(IN artist_name_in VARCHAR(50), IN contact_id_in INT)
BEGIN
  INSERT INTO artist (artist_name, contact)
  VALUES (artist_name_in, contact_id_in);
END;

/**
  Updates an existing artist

  IN artist_id_in: Id of the artist
  IN artist_name_in: Name of the artist
  IN first_name_in: First name of artist contact
  IN last_name_in: Last name of artist contact
  IN email_in: Email of artist contact
  IN phone_in: Phone number of artist contact

  Issued by: insertArtist(artistName: string, firstName: string, lastName: string, email: string, phone: string)
 */
CREATE PROCEDURE update_artist(IN artist_id_in INT, IN artist_name_in VARCHAR(50), IN first_name_in VARCHAR(50),
                               last_name_in VARCHAR(50), IN email_in VARCHAR(50), IN phone_in VARCHAR(50))
BEGIN
  DECLARE contact_id_in INT;
  IF ((SELECT contact_id_in = contact_id
       FROM contact
       WHERE first_name = first_name_in
         AND last_name = last_name_in
       LIMIT 1) IS NOT NULL) THEN
    UPDATE contact
    SET first_name=first_name_in,
        last_name=last_name_in,
        email=email_in,
        phone=phone_in
    WHERE first_name = first_name_in
      AND last_name = last_name_in;
  ELSE
    INSERT INTO contact (first_name, last_name, email, phone)
    VALUES (first_name_in, last_name_in, email_in, phone_in);
    SET contact_id_in = LAST_INSERT_ID();
  END IF;

  UPDATE artist
  SET artist_name=artist_name_in,
      contact=contact_id_in
  WHERE artist_id = artist_id_in;
END;

/**
  Finds all artists that have previously been bound to a contact through an event and contract

  IN contact_id_in: Id of the contact to look at
 */
CREATE PROCEDURE get_artist_by_previous_contract(IN contact_id_in INT)
BEGIN
  SELECT a.artist_id, a.artist_name, c.contact_id, c.first_name, c.last_name, c.email, c.phone
  FROM artist a
         LEFT JOIN contact c ON a.contact = c.contact_id
         LEFT JOIN contract cr ON a.artist_id = cr.artist
         LEFT JOIN document d ON cr.document = d.document_id
         LEFT JOIN event e ON d.event = e.event_id
  WHERE e.organizer = contact_id_in;
END;

/**
  Deletes an existing artist

  IN artist_id_in: Id of the artist

  Issued by: deleteArtist(artistId: number)
 */
CREATE PROCEDURE delete_artist(IN artist_id_in INT)
BEGIN
  IF (artist_id_in NOT IN (SELECT artist FROM contract)) THEN
    DELETE FROM artist WHERE artist_id = artist_id_in;
  ELSE
    CALL raise(2002, 'Artist kan ikke slettes grunnet eksisterende tilknyttede dokumenter.');
  END IF;
END;

/**
  Get all artists from the database

  Issued by: getAllArtists()
 */
CREATE PROCEDURE get_all_artists()
BEGIN
  SELECT a.artist_id, a.artist_name, c.contact_id, c.first_name, c.last_name, c.email, c.phone
  FROM artist a
         JOIN contact c ON a.contact = c.contact_id;
END;

/**
  Get one artist from an id

  IN artist_id_in: Id of the artist

  Issued by: getAllArtists()
 */
CREATE PROCEDURE get_artist_by_id(IN artist_id_in INT)
BEGIN
  SELECT a.artist_id, a.artist_name, c.contact_id, c.first_name, c.last_name, c.email, c.phone
  FROM artist a
         JOIN contact c ON a.contact = c.contact_id
  WHERE a.artist_id = artist_id_in;
END;

/**
  Get artist from contact_id

  IN contact_id_in: Contact id

  Issued by: getArtistByContact(contactId: number)
 */
CREATE PROCEDURE get_artist_by_contact(IN contact_id_in INT)
BEGIN
  SELECT artist_id, artist_name
  FROM artist
  WHERE contact = contact_id_in;
END;

/**
  Get one newArtist from an id

  Issued by: getAllArtists()
 */
CREATE PROCEDURE get_artist_by_query(IN artist_name_in VARCHAR(50), IN first_name_in VARCHAR(50),
                                     last_name_in VARCHAR(50),
                                     IN email_in VARCHAR(50), IN phone_in VARCHAR(50))
BEGIN
  SELECT a.artist_id, a.artist_name, c.contact_id, c.first_name, c.last_name, c.email, c.phone
  FROM artist a
         JOIN contact c ON a.contact = c.contact_id
  WHERE (artist_name_in IS NULL OR a.artist_name LIKE CONCAT('%', artist_name_in, '%'))
    AND (first_name_in IS NULL OR c.first_name LIKE CONCAT('%', first_name_in, '%'))
    AND (last_name_in IS NULL OR c.last_name LIKE CONCAT('%', last_name_in, '%'))
    AND (email_in IS NULL OR c.email LIKE CONCAT('%', email_in, '%'))
    AND (phone_in IS NULL OR c.phone LIKE CONCAT('%', phone_in, '%'));
END;

/**
  Get one newArtist from an id

  Issued by: getAllArtists()
 */
CREATE PROCEDURE get_artist_by_search(IN search_string VARCHAR(100))
BEGIN
  SELECT a.artist_id, a.artist_name, c.contact_id, c.first_name, c.last_name, c.email, c.phone
  FROM artist a
         JOIN contact c ON a.contact = c.contact_id
  WHERE artist_name LIKE CONCAT('%', search_string, '%')
     OR first_name LIKE CONCAT('%', search_string, '%')
     OR last_name LIKE CONCAT('%', search_string, '%')
     OR email LIKE CONCAT('%', search_string, '%')
     OR phone LIKE CONCAT('%', search_string, '%');
END;

/**
  Adds a specific artist to an event

  IN artist_name_in: Name of the artist
  IN first_name_in: First name of artist contact person
  IN last_name_in: Last name of artist contact person
  IN email_in: Email contact of artist
  IN phone_in: Phone of artist
  IN document_id_in: Id of the document that represents the artist contract. This is also the binding to the event

  Issued by: addArtistToEvent(artistName: string, firstName: string, lastName: string, email: string, phone: string,
                              document: string)
 */
CREATE PROCEDURE add_artist_to_event(IN artist_name_in VARCHAR(50), IN first_name_in VARCHAR(50),
                                     IN last_name_in VARCHAR(50), IN email_in VARCHAR(50), IN phone_in VARCHAR(12),
                                     IN document_id_in INT)
BEGIN
  DECLARE artist_id_in INT;
  DECLARE event_id_in INT;
  CALL insert_artist(artist_name_in, first_name_in, last_name_in, email_in, phone_in, artist_id_in);

  INSERT INTO contract (artist, document)
  VALUES (artist_id_in, document_id_in);
END;

/**
  Posts an artist and a document, and connects them in contract

  IN artist_name_in: name of artist
  IN first_name_in: firstname of artist
  IN last_name_in: lastname of artist
  IN email_in_ the email of the artist
  IN phone_in: the phone number of the artist
  IN document_name_in: name of the document
  IN path_in: the path of the document
  IN event_id_in: the id of the event the document belongs to
 */
CREATE PROCEDURE add_artist_with_new_contract(IN artist_name_in VARCHAR(50), IN first_name_in VARCHAR(50),
                                              IN last_name_in VARCHAR(50), IN email_in VARCHAR(50),
                                              IN phone_in VARCHAR(12),
                                              IN document_name_in VARCHAR(100), IN event_id_in INT(11),
                                              IN path_in VARCHAR(500))
BEGIN
  DECLARE artist_id_in INT;
  DECLARE document_id_in INt;
  CALL insert_artist(artist_name_in, first_name_in, last_name_in, email_in, phone_in, artist_id_in);
  CALL add_document(document_id_in, document_name_in, path_in, event_id_in);

  INSERT INTO contract (artist, document)
  VALUES (artist_id_in, document_id_in);
END;

/**
  Fetch all artists attached to a specific event

  IN event_id_in: Id of event to fetch from

  Issued by: getArtistByEvent(eventId: number)
 */
CREATE PROCEDURE get_artist_by_event(IN event_id_in INT)
BEGIN
  SELECT a.artist_id,
         a.artist_name,
         c.contact_id,
         c.first_name,
         c.last_name,
         c.email,
         c.phone,
         u.user_id
  FROM artist a
         JOIN contact c ON a.contact = c.contact_id
         JOIN contract cr ON a.artist_id = cr.artist
         JOIN document d ON d.document_id = cr.document
         LEFT JOIN user u on c.contact_id = u.contact
  WHERE d.event = event_id_in;
END;

/**
  Fetches artists that are bound up to a user

  IN user_id_in: The user id of the user

  Issued by: getArtistByUser(userId: number)
 */
CREATE PROCEDURE get_artist_by_user(IN user_id_in INT)
BEGIN
  SELECT a.artist_id,
         a.artist_name,
         c.contact_id,
         c.first_name,
         c.last_name,
         c.email,
         c.phone,
         u.user_id
  FROM artist a
         LEFT JOIN contact c ON a.contact = c.contact_id
         LEFT JOIN user u on c.contact_id = u.contact
  WHERE u.user_id = user_id_in;
END;

/**
  Removes a specific artist from a specific event

  IN event_id_in: Event to delete from
  IN artist_id_in: Artist to delete

  Issued by: removeArtistFromEvent(eventId: number, artistId: number)
 */
CREATE PROCEDURE remove_artist_from_event(IN event_id_in INT, IN artist_id_in INT)
BEGIN
  DELETE
  FROM contract
  WHERE document IN (SELECT document_id FROM document WHERE event_id_in = event)
    AND artist_id_in = artist;
END;