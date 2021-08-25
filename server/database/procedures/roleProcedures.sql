DROP PROCEDURE IF EXISTS get_all_roles;
DROP PROCEDURE IF EXISTS get_roles_in_event;
DROP PROCEDURE IF EXISTS set_role;
DROP PROCEDURE IF EXISTS assign_to_event;
DROP PROCEDURE IF EXISTS remove_from_event;
DROP PROCEDURE IF EXISTS remove_role;
DROP PROCEDURE IF EXISTS update_role_count;
/**
  returns all staff-types
 */

CREATE PROCEDURE get_all_roles()
BEGIN
    SELECT role_id, type, event FROM role;
END;

/**
  Returns staff currently assigned to event

  IN event_in: Id of the event
 */

CREATE PROCEDURE get_roles_in_event(IN event_in INT)
BEGIN
    SELECT role_id, type, count, er.event FROM role r JOIN event_role er on r.role_id = er.role WHERE er.event=event_in;
END;

/**
  Sets staff role
 */

CREATE PROCEDURE set_role(IN type_in VARCHAR(50), IN event_id_in INT)
BEGIN
    INSERT INTO role(type, event) VALUES (type_in, event_id_in);
END;

/**
  Assigns staff to event
 */

CREATE PROCEDURE assign_to_event(IN role_in INT, IN event_in INT, IN count_in INT)
BEGIN
    INSERT INTO event_role(role, event, count) VALUES (role_in, event_in, count_in);
END;

/**
  Removes staff from event
 */

CREATE PROCEDURE remove_from_event(IN role_in INT, IN event_in INT)
BEGIN
    DELETE FROM event_role WHERE role = role_in AND event = event_in;
    /*UPDATE role SET event = NULL WHERE role_id = role_id_in AND event = event_id_in;*/
END;

/**
  Removes role from list
 */

CREATE PROCEDURE remove_role(IN role_id_in INT)
BEGIN
    DELETE FROM role WHERE role_id = role_id_in;
END;

/**
  Updates number of specified role
 */

CREATE PROCEDURE update_role_count(IN role_id_in INT, IN event_in INT, IN count_in INT)
BEGIN
    UPDATE event_role SET count=count_in WHERE role=role_id_in AND event=event_in;
END;
