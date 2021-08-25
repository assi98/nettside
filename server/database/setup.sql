DROP TABLE IF EXISTS rider;
DROP TABLE IF EXISTS contract;
DROP TABLE IF EXISTS document;
DROP TABLE IF EXISTS event_role;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS event_equipment;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS artist;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS contact;
DROP TABLE IF EXISTS category;

DROP PROCEDURE IF EXISTS raise;

CREATE TABLE contact
(
  contact_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NULL,
  email VARCHAR(50) NOT NULL,
  phone VARCHAR(12)
);

CREATE TABLE user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(256) NOT NULL,
  image    LONGBLOB,
  contact  INT          NOT NULL,
  CONSTRAINT user_fk1 FOREIGN KEY (contact) REFERENCES contact (contact_id)
);

CREATE TABLE artist
(
  artist_id   INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  artist_name VARCHAR(50)        NOT NULL,
  contact     INT                NOT NULL,
  CONSTRAINT artist_fk1 FOREIGN KEY (contact) REFERENCES contact (contact_id)
);

CREATE TABLE equipment
(
  equipment_id INT AUTO_INCREMENT PRIMARY KEY,
  item         VARCHAR(50) NOT NULL,
  organizer    INT         NOT NULL,
  CONSTRAINT equipment_fk1 FOREIGN KEY (organizer) REFERENCES contact (contact_id)
);

CREATE TABLE event
(
  event_id    INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(50)  NOT NULL,
  description LONGTEXT     NOT NULL,
  location    VARCHAR(100) NOT NULL,
  start_time  DATETIME     NOT NULL,
  end_time    DATETIME     NOT NULL,
  category    VARCHAR(50),
  capacity    INT          NOT NULL,
  organizer   INT          NOT NULL,
  cancelled   BOOLEAN      NOT NULL DEFAULT FALSE,
  image       VARCHAR(100) NOT NULL DEFAULT './files/default.png',
  CONSTRAINT event_fk1 FOREIGN KEY (organizer) REFERENCES contact (contact_id)
);

CREATE TABLE ticket
(
  ticket_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  title     VARCHAR(50)        NOT NULL,
  info      LONGTEXT           NOT NULL,
  price     INT                NOT NULL,
  count     INT                NOT NULL,
  event     INT                NOT NULL
);

CREATE TABLE event_equipment
(
  equipment INT NOT NULL,
  event     INT NOT NULL,
  amount    INT NOT NULL,
  CONSTRAINT event_equipment_pk PRIMARY KEY (equipment, event),
  CONSTRAINT event_equipment_fk1 FOREIGN KEY (equipment) REFERENCES equipment (equipment_id),
  CONSTRAINT event_equipment_fk2 FOREIGN KEY (event) REFERENCES event (event_id)
);

CREATE TABLE role
(
    role_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    type    VARCHAR(50)        NOT NULL,
    event   INT                NOT NULL,
    CONSTRAINT role_fk1 FOREIGN KEY (event) REFERENCES event (event_id)
);

CREATE TABLE event_role (
    role INT,
    event INT NOT NULL,
    count INT NOT NULL,
    CONSTRAINT event_role_pk PRIMARY KEY(role, event),
    CONSTRAINT event_role_fk1 FOREIGN KEY(role) REFERENCES role(role_id),
    CONSTRAINT event_role_fk2 FOREIGN KEY(event) REFERENCES event(event_id)
);

CREATE TABLE document (
  document_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  path        VARCHAR(500)           NOT NULL DEFAULT './files/error.txt',
  event       INT                NOT NULL,
  alt VARCHAR(50) NOT NULL DEFAULT 'it''sa me, Mario',
  name        VARCHAR(100)       NOT NULL,
  CONSTRAINT document_fk1 FOREIGN KEY (event) REFERENCES event (event_id)
);

CREATE TABLE contract
(
  artist   INT NOT NULL,
  document INT NOT NULL,
  CONSTRAINT contract_pk PRIMARY KEY (artist, document),
  CONSTRAINT contract_fk1 FOREIGN KEY (artist) REFERENCES artist (artist_id),
  CONSTRAINT contract_fk2 FOREIGN KEY (document) REFERENCES document (document_id)
);

CREATE TABLE rider
(
  rider_id    INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  description VARCHAR(100)       NOT NULL,
  document    INT                NOT NULL,
  CONSTRAINT rider_fk1 FOREIGN KEY (document) REFERENCES document (document_id)
);

CREATE TABLE category
(
  name VARCHAR(50) PRIMARY KEY
);

CREATE PROCEDURE `raise`(`errno` BIGINT UNSIGNED, `message` VARCHAR(256))
BEGIN
  SIGNAL SQLSTATE
    'ERR0R'
    SET
      MESSAGE_TEXT = `message`,
      MYSQL_ERRNO = `errno`;
END
