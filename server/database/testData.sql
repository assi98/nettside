SET FOREIGN_KEY_CHECKS=0;
DELETE FROM event_equipment;
DELETE FROM equipment;
DELETE FROM event;
DELETE FROM user;
DELETE FROM contact;
DELETE FROM document;
DELETE FROM category;
DELETE FROM artist;
SET FOREIGN_KEY_CHECKS=1;

INSERT INTO contact(contact_id, first_name, last_name, email, phone) VALUES(default, 'Mario', 'Bros', 'its@me', '01001010');
INSERT INTO user(user_id, username, password, image, contact) VALUES(DEFAULT, 'Mario', '$2a$10$58.k1W9JZcldkAaL8RHYx.xBcg7CCFFLUej4BXTxlVYgMHAOQz.2C', '', 1);
INSERT INTO contact(contact_id, first_name, last_name, email, phone) VALUES(default, 'cheez', 'Doodles', 'doodle@cheez', '01001010');
INSERT INTO user(user_id, username, password, image, contact) VALUES(DEFAULT, 'cheezDoodles', '$2a$10$58.k1W9JZcldkAaL8RHYx.xBcg7CCFFLUej4BXTxlVYgMHAOQz.2C', '', 2);
INSERT INTO contact (first_name, last_name, email, phone) VALUES ('Mia', 'Fornes', 'mia@test.com', 12345678);
INSERT INTO user (username, password, image, contact) VALUES ('miafornes', 'passord', 'bilde', 3);
INSERT INTO contact(first_name, last_name, email, phone)
VALUES ('Geir', 'Lippestad', 'geir@lips.no', '12345678');

INSERT INTO artist(artist_id, artist_name, contact)
VALUES (DEFAULT, 'Geir Lippestad', 4);
INSERT INTO artist(artist_id, artist_name, contact)
VALUES (DEFAULT, 'Svein Blipp', 3);

INSERT INTO event (title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
VALUES ('EM Håndball', 'EM i håndball 2020', 'Trondheim Spektrum', '2020-01-09 12:06:00', '2020-01-09 12:06:00', 'Sport', 7000, 1, 0, 'ah ye');
INSERT INTO event (title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
VALUES ('Konsert', 'Konsertbeskrivelse', 'Samfundet', '2020-01-16 09:00:27', '2020-01-16 09:00:27', 'Kategori', 200, 1, 0, DEFAULT);
INSERT INTO event (title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
VALUES ('Konsert m/ ballonger', 'Konsertbeskrivelse', 'Trondheim', '2020-01-16 09:00:27', '2020-01-16 09:00:27', 'Kategori', 200, 3, 1, 'hola');
INSERT INTO event (title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
VALUES ('Loppemarked', 'Loppemarked for inntekt til klassetur', 'Trondheim', '2020-01-16 09:00:27', '2020-01-16 09:00:27', 'Kategori', 200, 1, 0, 'yeye');
INSERT INTO event (title, description, location, start_time, end_time, category, capacity, organizer, cancelled, image)
VALUES ('Party', 'beskrivelse yo', 'Trondheim', '2020-05-10 02:12:54', '2020-05-21 20:43:19', 'Party', 50, 1,0, DEFAULT);

INSERT INTO equipment (item, organizer)
VALUES ('Trommesett',1);
INSERT INTO equipment (item, organizer)
VALUES ('Gitarforsterker',1);
INSERT INTO equipment (item, organizer)
VALUES ('Bassforsterker',1);
INSERT INTO equipment (item, organizer)
VALUES ('XLR-kabel', 1);

INSERT INTO event_equipment (event, equipment, amount)
VALUES (1, 1, 1);
INSERT INTO event_equipment (event, equipment, amount)
VALUES (1, 2, 2);
INSERT INTO event_equipment (event, equipment, amount)
VALUES (1, 3, 1);
INSERT INTO event_equipment (event, equipment, amount)
VALUES (1, 4, 4);
INSERT INTO event_equipment (event, equipment, amount)
VALUES (2, 4, 8);

INSERT INTO document (document_id, name, path, event) VALUES (DEFAULT, 'Carl', 'Barks', 1);
insert into ticket (title, info, price, count, event) values ( 'enTittel',  'enInfo_in',  1, 1, 1);
insert into ticket (title, info, price, count, event) values ( 'andreTittel',  'andreInfo_in',  2, 2, 1);

INSERT INTO role (role_id, type, event) VALUES (DEFAULT, 'Bartender', 1);
INSERT INTO role (role_id, type, event) VALUES (DEFAULT, 'Lydtekniker', 1);
INSERT INTO role (role_id, type, event) VALUES (DEFAULT, 'Dorvakt', 1);
INSERT INTO event_role (role, event, count) VALUES (1, 1, 2);
INSERT INTO event_role (role, event, count) VALUES (2, 1, 1);
INSERT INTO event_role (role, event, count) VALUES (3, 1, 3);

INSERT INTO document (document_id, name, path, event)
VALUES (DEFAULT, 'thrud', 'thrud', 1);
INSERT INTO document (document_id, name, path, event)
VALUES (DEFAULT, 'faor', 'faor', 1);
INSERT INTO document (document_id, name, path, event)
VALUES (DEFAULT, 'lmao', 'lmao', 5);

INSERT INTO contract (artist, document)
VALUES (1, 1);

INSERT INTO rider (description, document)
VALUES ('Mathias må ha tre kameler og syv geiter', 2);
INSERT INTO rider (description, document)
VALUES ('Mathias må ha en full size yobama statue', 2);
INSERT INTO rider (description, document)
VALUES ('Mathias har problemer, han trenger hjelp', 2);
INSERT INTO rider (description, document)
VALUES ('Magnus trenger ikke noe, han er ikke kravstor', 1);

INSERT INTO category VALUES('Konsert');
INSERT INTO category VALUES('Festival');
INSERT INTO category VALUES('Party');
INSERT INTO category VALUES('Karneval');
INSERT INTO category VALUES('Høytids-sammenkomst');