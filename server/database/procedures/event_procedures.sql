/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS get_event_by_id;
DROP PROCEDURE IF EXISTS get_event_by_name;
DROP PROCEDURE IF EXISTS get_all_events;
DROP PROCEDURE IF EXISTS create_event;
DROP PROCEDURE IF EXISTS get_event_by_month;
DROP PROCEDURE IF EXISTS get_events_by_cancelled;
DROP PROCEDURE IF EXISTS cancel_event_by_id;
DROP PROCEDURE IF EXISTS get_cancelled_event_email_info;
DROP PROCEDURE IF EXISTS delete_event;
DROP PROCEDURE IF EXISTS delete_events_by_end_time;
DROP PROCEDURE IF EXISTS get_event_by_id_update;
DROP PROCEDURE IF EXISTS get_document_by_event;
DROP PROCEDURE IF EXISTS get_events_by_user;
DROP PROCEDURE IF EXISTS get_last_events_by_user;
DROP PROCEDURE IF EXISTS get_events_by_end_time_user;
DROP PROCEDURE IF EXISTS get_all_events_by_input;
DROP PROCEDURE IF EXISTS get_categories;
DROP PROCEDURE IF EXISTS get_frontpage_events;
DROP PROCEDURE IF EXISTS get_events_by_username;
DROP PROCEDURE IF EXISTS get_events_by_artist;
DROP PROCEDURE IF EXISTS post_image_to_event;
DROP PROCEDURE IF EXISTS get_events_by_artist;

CREATE PROCEDURE get_event_by_id(IN event_id_in int)
BEGIN
    SELECT event_id, title, description, location, cancelled, DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time, DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i') as end_time, category, capacity, organizer, cancelled, image FROM event where event_id = event_id_in;
END;

/**
  Get event by name
 */
CREATE PROCEDURE get_event_by_name(IN event_name_in VARCHAR(100))
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time,
         DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i")   as end_time,
         category,
         capacity,
         organizer,
         cancelled
  from event
  where title = event_name_in;
end;



/**
  get all event by
 */
CREATE PROCEDURE get_all_events()
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time,
         DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i')   as end_time,
         capacity,
         organizer,
         category,
         image
  FROM event;
END;

/**
  Fetch frontpage events

  Issued by: getFrontpageEvents()
 */

CREATE PROCEDURE get_frontpage_events()
BEGIN
    SELECT event_id,
           title,
           description,
           location,
           DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time,
            category, organizer, image FROM event
    WHERE cancelled = 0 ORDER BY start_time LIMIT 9;
END;



/**
  get events by month
 */
CREATE PROCEDURE get_event_by_month(IN event_month_in int)
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         DATE_FORMAT(start_time, "%a %e.%m.%Y %H:%i") as start_time,
         DATE_FORMAT(end_time, "%a %e.%m.%Y %H:%i")   as end_time,
         category,
         capacity,
         organizer,
         cancelled
  from event
  where MONTH(start_time) = event_month_in;
end;

/**
  insert a new event in table
 */
CREATE PROCEDURE create_event(IN event_title_in VARCHAR(50), event_description_in VARCHAR(500),
                              event_location_in VARCHAR(100), event_start_time_in DATETIME, event_end_time_in DATETIME,
                              event_category_in VARCHAR(50), event_capacity_in int, event_organizer_in int, event_image_in VARCHAR(100))
BEGIN
  DECLARE contact_id_in INT;
  SET contact_id_in = (SELECT contact_id FROM contact LEFT JOIN user u on contact.contact_id = u.contact
                       WHERE u.user_id=event_organizer_in LIMIT 1);
  INSERT INTO event (event_id, title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
  VALUES (DEFAULT, event_title_in, event_description_in, event_location_in, event_start_time_in, event_end_time_in,
          event_category_in, event_capacity_in, contact_id_in, DEFAULT, event_image_in);
end;

/**

  Fetch cancelled events

  Issued by: getCanceledEvents()
 */

CREATE PROCEDURE get_events_by_cancelled(IN cancelled_in BIT)
BEGIN
  SELECT * FROM event WHERE cancelled = cancelled_in;
END;

/**

 */
CREATE PROCEDURE get_events_by_user(IN user_id_in INT)
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time,
         DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i')   as end_time,
         category,
         cancelled,
         capacity,
         organizer
  FROM event
  WHERE organizer = user_id_in AND cancelled = 0;
END;

CREATE PROCEDURE get_last_events_by_user(IN user_id_in INT)
BEGIN
    SELECT event_id, title, description, location, DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time, DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i') as end_time, category, capacity, organizer FROM event WHERE organizer = user_id_in ORDER BY event_id DESC LIMIT 1;
END;
/**
  Cancel event based on an id

  IN event_id_in: Id of the event

  Issued by: cancelEvent(eventId: number)
 */

CREATE PROCEDURE cancel_event_by_id(IN event_id_in INT)
BEGIN
  UPDATE event SET cancelled = 1 WHERE event_id = event_id_in;
END;

/**
  Fetch cancelled event information

  IN event_id_in: Id of the event

  Issued by: getCancelledEventInfo(eventId: number)
 */
CREATE PROCEDURE get_cancelled_event_email_info(IN event_id_in INT)
BEGIN
  SELECT event.event_id,
         CONCAT(first_name, ' ', last_name)            as name,
         email,
         title,
         location,
         DATE_FORMAT(start_time, '%a %e.%m.%Y, %H:%i') as start_time
  FROM contact
         INNER JOIN event ON contact.contact_id = event.organizer
  WHERE cancelled = 1
    AND event_id = event_id_in;
END;

/**
  Get event by id for event update
 */

CREATE PROCEDURE get_event_by_id_update(IN event_id_in INT)
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         start_time,
         end_time,
         category,
         capacity,
         organizer,
         cancelled,
         image
  FROM event
  where event_id = event_id_in;
end;

/**
    MOVE THIS TO DOCUMENT AFTER A WHILE!!!!!!!!!!
 */
CREATE PROCEDURE get_document_by_event(IN event_id_in INT)
BEGIN
  SELECT document_id, name FROM document WHERE event = event_id_in;
END;

/**
  Deletes an event

  IN event_id_in: Id of the event

  Issued by: deleteEvent(eventId: number)
 */
CREATE PROCEDURE delete_event(IN event_id_in INT)
BEGIN
  DELETE FROM event WHERE event_id = event_id_in;
END;

/**
  Deletes events based on end time


 */
CREATE PROCEDURE delete_events_by_end_time(IN user_id_in INT)
BEGIN

  DELETE rider
  FROM rider
         INNER JOIN document d on rider.document = d.document_id
         INNER JOIN event e2 on d.event = e2.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE contract
  FROM contract
         INNER JOIN document ON contract.document = document.document_id
         INNER JOIN event e3 on document.event = e3.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE document
  FROM document
         INNER JOIN event e4 on document.event = e4.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE event_role
  FROM event_role
         INNER JOIN event e on event_role.event = e.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE role
  FROM role
         INNER JOIN event e5 on role.event = e5.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE event_equipment
  FROM event_equipment
         INNER JOIN event e6 on event_equipment.event = e6.event_id
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;

  DELETE
  FROM event
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;
END;

/**
  Get ended events on a specific user
 */
CREATE PROCEDURE get_events_by_end_time_user(IN user_id_in INT)
BEGIN
  SELECT event_id,
         title,
         description,
         location,
         DATE_FORMAT(start_time, '%e.%m.%Y %H:%i')  as start_time,
         DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i') as end_time,
         category,
         capacity,
         organizer
  FROM event
  WHERE DATEDIFF(CURRENT_DATE, DATE_FORMAT(end_time, '%Y-%m-%e')) > 7
    AND organizer = user_id_in;
END;

CREATE PROCEDURE get_all_events_by_input(IN input_in VARCHAR(40))
BEGIN
  SELECT event_id, title, DATE_FORMAT(start_time, '%e.%m.%Y %H:%i') as start_time, image
  FROM event
  WHERE UPPER(title) LIKE CONCAT('%', input_in, '%');
END;
/**
  Get all categories
 */
CREATE PROCEDURE get_categories()
BEGIN
  SELECT name FROM category;
END;
/**
  Get all events made by user
 */
CREATE PROCEDURE get_events_by_username(IN username_in VARCHAR(50))
BEGIN
  SELECT event_id, title, DATE_FORMAT(start_time, '%e.%m.%Y %H:%i') as start_time
  FROM event e
         JOIN contact c ON e.organizer = c.contact_id
         JOIN user u ON c.contact_id = u.contact
  WHERE u.username = username_in;
END;

CREATE PROCEDURE post_image_to_event(IN image_in VARCHAR(100), IN event_id_in INT(11))
BEGIN
    UPDATE event SET image = image_in WHERE event_id = event_id_in;
END;
/**
  Gets all events bound to an artist by a contract
 */
CREATE PROCEDURE get_events_by_artist(IN artist_id_in INT)
BEGIN
  SELECT event_id, title, description, location, DATE_FORMAT(start_time, '%a %e.%m.%Y %H:%i') as start_time, DATE_FORMAT(end_time, '%a %e.%m.%Y %H:%i') as end_time, category, capacity, organizer
  FROM event e
  LEFT JOIN document d ON e.event_id = d.event
  LEFT JOIN contract c ON d.document_id = c.document
  LEFT JOIN artist a ON c.artist = a.artist_id
  WHERE a.artist_id=artist_id_in;
END;