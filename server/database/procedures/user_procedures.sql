/**
  Delete all procedures for recreation
 */
DROP PROCEDURE IF EXISTS post_contact;
DROP PROCEDURE IF EXISTS post_user;
DROP PROCEDURE IF EXISTS get_username;
DROP PROCEDURE IF EXISTS get_password;
DROP PROCEDURE IF EXISTS get_user;
DROP PROCEDURE IF EXISTS get_user_by_id;
DROP PROCEDURE IF EXISTS check_username;
DROP PROCEDURE IF EXISTS get_contact;
DROP PROCEDURE IF EXISTS put_contact;
DROP PROCEDURE IF EXISTS put_password;
DROP PROCEDURE IF EXISTS check_and_verify_artist_username;
DROP PROCEDURE IF EXISTS get_user_by_artist;
DROP PROCEDURE IF EXISTS get_organizer_username;

/**
  Inserts a new contact

  IN email_in: the contacts email
  In first_name_in: the contacts first name
  IN last_name_in: the contacts last name
  In phone_in: the contacts phone number

  Issued by: postContact(data: Object)
 */
CREATE PROCEDURE post_contact(IN email_in VARCHAR(50), IN first_name_in VARCHAR(50), IN last_name_in VARCHAR(50), IN phone_in VARCHAR(12))
BEGIN
    INSERT INTO contact(email, first_name, last_name, phone)
    VALUES (email_in, first_name_in, last_name_in, phone_in);
END;


/**
  Inserts a new user

  IN username_in: the users username
  IN password_in: the users hashed password
  IN contact_id_in: id to the users contact information

  Issued by: postUser(data: Object)
 */



CREATE PROCEDURE post_user(IN username_in VARCHAR(50), IN password_in VARCHAR(256), IN contact_id_in int(11))
BEGIN
    INSERT INTO user(username, password, contact)
    VALUES(username_in, password_in, contact_id_in);
END;


/**
  Fetches username based on an id

  IN user_id_in: Id of the user

  Issued by: getUsername(userId: number)
 */

CREATE PROCEDURE get_username(IN user_id_in INT(11))
BEGIN
    SELECT username FROM user WHERE user_id=user_id_in;
END;

/**
  Fetches count of a username in the user table

  IN username_in: username being counted

  Issued by: checkUsername(username: string)
 */


CREATE PROCEDURE check_username(IN username_in VARCHAR(50))
BEGIN
    SELECT COUNT(*) AS count FROM user WHERE username=username_in;
END;

/**
  Fetches hashed password based on username

  IN username_in: username of the user

  Issued by: getPassword(username: string)
 */

CREATE PROCEDURE get_password(IN username_in VARCHAR(50))
BEGIN
    SELECT password FROM user WHERE username=username_in;
END;

/**
  Fetches contact

  IN user_id_in: id of the user

  Issued by: getContact(user_id: number)
 */

CREATE PROCEDURE get_contact(IN user_id_in INT(11))
BEGIN

    SELECT contact_id, first_name, last_name, email, phone FROM user LEFT JOIN contact ON user.contact=contact.contact_id WHERE user_id=user_id_in;
END;

CREATE PROCEDURE get_user_by_artist(IN artist_id_in INT(11))
BEGIN
    SELECT * FROM user RIGHT JOIN contact ON user.contact = contact.contact_id
    LEFT JOIN artist a on contact.contact_id = a.contact
    WHERE a.artist_id = artist_id_in;
END;

/**
  Fetches a user based on username

  IN username_in: username of the user

  Issued by: getUser(username: string)
 */

CREATE PROCEDURE get_user(IN username_in VARCHAR(50))
BEGIN
    SELECT * FROM user RIGHT JOIN contact ON user.contact = contact.contact_id
    WHERE user.username=username_in;
END;

CREATE PROCEDURE check_and_verify_artist_username(IN username_in VARCHAR(50))
BEGIN
    WHILE (username_in IN (SELECT username FROM user WHERE user.username=username_in)) DO
        SET username_in = CONCAT(username_in, FLOOR(RAND()*999));
    END WHILE;

    SELECT username_in;
END;

/**
  Fetches a user based on user_id

  IN user_id_in: username of the user

  Issued by: getUserById(userId: number)
 */

CREATE PROCEDURE get_user_by_id(IN user_id_in INT(11))
BEGIN
    SELECT * FROM user RIGHT JOIN contact ON user.contact = contact.contact_id
    WHERE user.user_id=user_id_in;
END;

/**
  Updates a contact

  IN contact_id_in: id of contact

  IN first_name_in: first name of contact

  IN last_name_in: last name of contact

  IN email_in: email of contact

  IN phone_in: phone of contact


  Issued by: updateContact(contactId: number, data: Object)
 */

CREATE PROCEDURE put_contact(IN contact_id_in INT(11), IN first_name_in VARCHAR(50), IN last_name_in VARCHAR(50), IN email_in VARCHAR(50), IN phone_in VARCHAR(12))
BEGIN
    UPDATE contact set first_name = first_name_in, last_name = last_name_in, email = email_in, phone = phone_in
    WHERE contact_id = contact_id_in;
END;

/**
  Updates a password

  IN user_id_in: id of the user

  IN password_in: new password hash of the user

  Issued by: updatePassword(contactId: number, hash: string)
 */

CREATE PROCEDURE put_password(IN user_id_in INT(11), IN password_in VARCHAR(256))
BEGIN
    UPDATE user set password = password_in
    WHERE user_id = user_id_in;
END;

/**
  Gets username by organizer
 */

CREATE PROCEDURE get_organizer_username(IN organizer_in INT)
BEGIN
     SELECT username FROM user u LEFT JOIN contact c ON u.contact = c.contact_id WHERE organizer_in = c.contact_id;
END;