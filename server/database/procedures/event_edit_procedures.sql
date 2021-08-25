/**
  Drop all procedures for recreation
 */
DROP PROCEDURE IF EXISTS update_event_title;
DROP PROCEDURE IF EXISTS update_event_location;
DROP PROCEDURE IF EXISTS update_event_description;
DROP PROCEDURE IF EXISTS update_event_start_time;
DROP PROCEDURE IF EXISTS update_event_end_time;
DROP PROCEDURE IF EXISTS update_event_category;
DROP PROCEDURE IF EXISTS update_event_capacity;
DROP PROCEDURE IF EXISTS update_event;

/**
  Update event title

  IN event_title_in: the new event title
  IN event_id_in: the id of the event

  Issued by: UpdateEventTitle(json: Object, event_id: number)
 */
CREATE PROCEDURE update_event_title(IN event_title_in varchar(50), event_id_in int)
BEGIN
    UPDATE event SET title = event_title_in WHERE event_id = event_id_in;
END;

/*
 Update event location
 */

 Create PROCEDURE update_event_location(IN event_location_in varchar(100), event_id_in int)
 BEGIN
     UPDATE event SET location = event_location_in WHERE event_id = event_id_in;
 end;

/*
 Update event description
 */
 CREATE PROCEDURE update_event_description(IN event_description_in longtext, event_id_in int)
 BEGIN
     UPDATE event SET description = event_description_in WHERE event_id = event_id_in;
 end;

/*
 Update event start time
 */

 CREATE PROCEDURE update_event_start_time(IN event_start_time_in DATETIME, event_id_in int)
 BEGIN
     UPDATE event SET start_time = event_start_time_in WHERE event_id = event_id_in;
 end;

/*
 Update event end time
 */

 CREATE PROCEDURE update_event_end_time(IN event_end_time_in DATETIME, event_id_in int)
 BEGIN
     UPDATE event SET end_time = event_end_time_in WHERE event_id = event_id_in;
 end;
/*
 Update event category
 */

 CREATE PROCEDURE update_event_category(IN event_category_in VARCHAR(50), event_id_in int)
 BEGIN
     UPDATE event SET category = event_category_in WHERE event_id = event_id_in;
 end;

/*
 Update Event capacity
 */

 CREATE PROCEDURE update_event_capacity(IN event_capacity_in int, event_id_in int)
 BEGIN
     UPDATE event SET capacity = event_capacity_in WHERE event_id = event_id_in;
 end;

/*
Update entire event
 */

 CREATE PROCEDURE update_event(IN event_title_in VARCHAR(50),
 event_description_in VARCHAR(500), event_location_in VARCHAR(100),
 event_start_time_in DATETIME, event_end_time_in DATETIME,
 event_category_in VARCHAR(50), event_capacity_in int,
 event_organizer_in int, event_id_in int)
BEGIN
    UPDATE event SET title = event_title_in,
                     description = event_description_in,
                     location = event_location_in,
                     start_time = event_start_time_in,
                     end_time = event_end_time_in,
                     category = event_category_in,
                     capacity = event_capacity_in,
                     organizer = event_organizer_in
    WHERE event_id = event_id_in;
end;