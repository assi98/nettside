DROP PROCEDURE IF EXISTS create_one_ticket;
DROP PROCEDURE IF EXISTS update_one_ticket;
DROP PROCEDURE IF EXISTS select_one_ticket_byId;
DROP PROCEDURE IF EXISTS get_all_ticket;
DROP PROCEDURE IF EXISTS delete_one_ticket;

/**
  Inserts one ticket into the database

  IN title_in: title of the ticket type
  IN info_in: Description of the ticket type
  IN price_in: Price of the ticket type
  IN count_in: Amount of available tickets
  IN event_in: Event for the ticket

  Issued by: createOne(json: Object)
 */
CREATE PROCEDURE create_one_ticket(IN title_in VARCHAR(50), IN info_in longtext, IN price_in INT, IN count_in INT,
                                   IN event_in INT)
BEGIN
  insert into ticket (title, info, price, count, event)
  values (title_in, info_in, price_in, count_in, event_in);
END;

/**
  Update one ticket type

  IN title_in: New title of ticket
  IN info_in: New description of ticket
  IN price_in New price of ticket
  IN count_in: New count of ticket
  IN ticket_id_in: Id of the ticket to update

  Issued by: updateOneTicket(json: object)
 */
CREATE PROCEDURE update_one_ticket(IN title_in VARCHAR(50), IN info_in longtext, IN price_in integer,
                                   IN count_in integer, IN ticket_id_in integer)
BEGIN
  UPDATE ticket
  set title = title_in,
      info  = info_in,
      price = price_in,
      count = count_in
  WHERE ticket_id = ticket_id_in;
END;

/**
  Get one ticket by id

  IN ticket_id_in: Id of the ticket

  Issued by: getOne(ticket_id: number)
 */
CREATE PROCEDURE select_one_ticket_byId(IN ticket_id_in INT)
BEGIN
  SELECT * FROM ticket WHERE ticket_id = ticket_id_in;
END;

/**
  Get all tickets on an event

  IN event_id_in: Id of event

  Issued by: getAll(event: number)
 */
CREATE PROCEDURE get_all_ticket(IN event_id_in INT)
BEGIN
  SELECT t.ticket_id as ticket_id,
         t.title     as title,
         t.info      as info,
         t.price     as price,
         t.count     as count,
         t.event     as event
  FROM ticket t
         INNER JOIN event e on t.ticket_id = e.event_id
  WHERE t.event = event_id_in;
END;

/**
  Deletes one ticket by id

  IN ticket_id_in: Id of ticket

  Issued by: removeOneTicket(id: number)
 */
CREATE PROCEDURE delete_one_ticket(IN ticket_id_in INT)
BEGIN
  DELETE FROM ticket WHERE ticket_id = ticket_id_in;
END;
