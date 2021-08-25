//@flow

import {UserDAO} from "../dao/userDao";
import {ArtistDAO} from "../dao/artistDao";
import {Email} from "../email";

/**
 * Controller for receiving HTTP requests through the user endpoint
 * @type {{listen?: *}}
 */

const pool = require("../server");
const fs = require('fs');

const email = new Email();

const userDao = new UserDAO(pool);
const artistDao = new ArtistDAO(pool);

const TAG = '[UserController]';

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

class User {
    user_id: number;
    username: string;
    password: string;
    image: any;
    contact_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;

    constructor(user_id: number, username: string, password: string, image: any, contact_id: number, first_name: string, last_name: string, email: string, phone: string) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.image = image;
        this.contact_id = contact_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
    }
}

let privateKey = fs.readFileSync('./src/private.txt', 'utf8');

const signOptions = {
    expiresIn:  "30M",
    algorithm:  "RS256"
};

/**
 *Is the function for login. Check if the different user input is valid. If valid user gets logged in if not it
 * return an error
 * @param bool return the information regarding the login.
 * @param username is te username of the user
 * @param res response to service
 */


function login(bool: boolean, username: string, res: Response) {
    if (bool) {
        console.log(TAG, "Brukernavn & passord ok");
        let token = jwt.sign({ username: username}, privateKey, signOptions);

        userDao.getUser(username, (err, user) => {
            artistDao.getArtistByContact(user[0][0].contact_id, (err, artist) => {
                if(artist[0][0] != null) {
                    if(artist[0][0].artist_id != null) {
                        res.json({
                            user: {
                                "user_id": user[0][0].user_id,
                                "username": user[0][0].username,
                                "contact_id": user[0][0].contact_id,
                                "image": user[0][0].image,
                                "first_name": user[0][0].first_name,
                                "last_name": user[0][0].last_name,
                                "email": user[0][0].email,
                                "phone": user[0][0].phone
                            },
                            artist: {
                                "artist_id": artist[0][0].artist_id,
                                "artist_name": artist[0][0].artist_name
                            },
                            token: token });
                    } else {
                        res.json({
                            user: {
                                "user_id": user[0][0].user_id,
                                "username": user[0][0].username,
                                "contact_id": user[0][0].contact_id,
                                "image": user[0][0].image,
                                "first_name": user[0][0].first_name,
                                "last_name": user[0][0].last_name,
                                "email": user[0][0].email,
                                "phone": user[0][0].phone
                            },
                            artist: {
                                "artist_id": null,
                                "artist_name": null
                            },
                            token: token });
                    }
                } else {
                    res.json({
                        user: {
                            "user_id": user[0][0].user_id,
                            "username": user[0][0].username,
                            "contact_id": user[0][0].contact_id,
                            "image": user[0][0].image,
                            "first_name": user[0][0].first_name,
                            "last_name": user[0][0].last_name,
                            "email": user[0][0].email,
                            "phone": user[0][0].phone
                        },
                        artist: {
                            "artist_id": null,
                            "artist_name": null
                        },
                        token: token });
                }
            });
        });


    } else {
        console.log(TAG, "Passord IKKE ok");
        res.json({ error: "Not authorized" });
    }
}


/**
 * This methode takes in all user information check if user name is valid.(canot be equal to another allready in the database) and if it is it sends
 * you to the validation methode for passwords
 * norwegian letters is allowed
 * @param data
 * @param username
 * @param password
 * @param email
 * @param first_name
 * @param last_name
 * @param phone
 * @param res sends result to service
 * @returns {boolean}
 */

function validateUsername(data: Object, username: string, password: string, email: string, first_name: string, last_name: string, phone: string, res: Response) {
    let regex =/^[A-Za-z0-9-æøåÆØÅ]{4,30}$/;
    if(username.match(regex)) {
        if (data.artist_name) {
            userDao.checkAndVerifyArtistUsername(username, (err, rows) => {
                console.log(TAG, rows);
                console.log(TAG, rows[0][0].username_in);
                data.username = rows[0][0].username_in;
                return validatePassword(data, password, email, first_name, last_name, phone, res);
            });
        } else {
            userDao.checkUsername(username, (err, rows) => {
                console.log(TAG, rows[0][0].count);
                if (rows[0][0].count === 0) {
                    return validatePassword(data, password, email, first_name, last_name, phone, res);
                } else {
                    console.log(TAG, "Invalid username");
                    res.json({error: "Invalid username"});
                    return false;
                }
            });
        }
    } else {
        console.log(TAG, "Invalid username");
        res.json({ error: "Invalid username" });
        return false;
    }
}

/**
 * Validate the user password, if it is, it sends you to emailvalidation
 * @param data
 * @param password
 * @param email
 * @param first_name
 * @param last_name
 * @param phone
 * @param res
 * @returns {void|boolean|undefined}
 */

function validatePassword(data: Object, password: string, email: string, first_name: string, last_name: string, phone: string, res: Response) {
    let regex =/^[A-Za-z0-9-æøåÆØÅ]{5,256}$/;
    if(password.match(regex)){
        return validateEmail(data, email, first_name, last_name, phone, res);
    } else {
        console.log(TAG, "Invalid");
        res.json({ error: "Invalid password. Has to contain at least 8 to 256 characters" });
        return false;
    }
}

/**
 * Validate the users email, with different requirements. Sends you to validate first name if suqsess.
 * @param data
 * @param email
 * @param first_name
 * @param last_name
 * @param phone
 * @param res
 * @returns {void|boolean}
 */

function validateEmail(data: Object, email: string, first_name: string, last_name: string, phone: string, res: Response) {
    if(email.length < 50) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(String(email).toLowerCase())) {
            return validateFirstName(data, first_name, last_name, phone, res);
        }
    } else {
        console.log(TAG, "Invalid");
        res.json({ error: "Invalid email" });
        return false;
    }
}

/**
 * Validate first name.  can be between 3 to 40 characters.
 * norwegian characters are allowed
 * if true send to validate last
 * @param data reacive all the user information
 * @param first_name
 * @param last_name
 * @param phone
 * @param res
 * @returns {void|boolean}
 */

function validateFirstName(data: Object, first_name: string, last_name: string, phone: string, res: Response) {
    let regex =/^[A-Za-z-æøåÆØÅ]{3,40}$/;
    if(first_name.match(regex)) {
        return validateLastName(data, last_name, phone, res);
    } else {
        console.log(TAG, "Invalid first name, cannot contain non english-norwegian letters");
        res.json({ error: "Invalid first name, cannot contain non english-norwegian letters" });
        return false;
    }
}

/**validate last name. Cant be between 3 to 40 characters
 * Norwegian chars are allowed
 * if succsessd returns validate phone
 *
 * @param data all user data
 * @param last_name
 * @param phone
 * @param res response to server
 * @returns {void|boolean}
 */

function validateLastName(data: Object, last_name: string, phone: string, res: Response) {
    let regex =/^[A-Za-z-æøåÆØÅ]{3,40}$/;
    if(last_name.match(regex)) {
        return validatePhone(data, phone, res);
    } else {
        console.log(TAG, "Invalid last name");
        res.json({ error: "Invalid last name" });
        return false;
    }
}

/**
 * validate phone.
 * must be digeds and have a sertain lenght 8 or 12
 * if true return all data to register methode
 * @param data
 * @param phone
 * @param res response to server
 * @returns {boolean|void}
 */

function validatePhone(data: Object, phone: string, res: Response) {
    if(!phone.match(/\D/)) {
        if(phone.length === 8) {
            return register(data, res);
        } else if(phone.length === 12 && phone.substring(0, 3) === "0047") {
            return register(data, res);
        } else {
            console.log(TAG, "Invalid count phone");
            res.json({ error: "Invalid phone" });
            return false;
        }
    } else {
        console.log(TAG, "Invalid input phone");
        res.json({ error: "Invalid phone" });
        return false;
    }
}

/**
 * register user check. incrupte user password and registrer user if valid.
 * @param data all user data
 * @param res
 */

function register(data: Object, res: Response) {
    // Store original password to send by mail
    const originalPassword = data.password;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
            data.password = hash;
            if (data.artist_name) {
                userDao.postUser(data, data.contact_id, (err, userData) => {
                    res.json(userData);
                    // Send email to user with login information
                    email.artistUserNotification(data.email, data.artist_name, data.username, originalPassword, data.organizer);
                })
            } else {
                userDao.postContact(data, (err, contactData) => {
                    if (contactData.insertId != null || contactData.insertId === false || contactData.insertId === 0) {
                        userDao.postUser(data, contactData.insertId, (err, userData) => {
                            if (userData.insertId != null || userData.insertId === false || userData.insertId === 0) {
                                login(true, data.username, res);
                            } else {
                                res.json({error: "Invalid something"});
                            }
                        })
                    } else {
                        console.log(TAG, "Invalid7");
                        res.json({error: "Invalid something"});
                    }
                })
            }
        })
    });
}

/**
 * Håndterer login og sender JWT-token tilbake som JSON
 * om bruker har et savedhash methode return to user log in.
 */


exports.loginUser = (req, res, next) => {

    userDao.getPassword(req.body.username, (err, rows) => {
        let savedHash = null;
        if(rows[0]) {
            if(rows[0][0]) {
                savedHash = rows[0][0].password;
            }
        }
        if(savedHash != null) {
            bcrypt.compare(req.body.password, savedHash, function(err, response) {
                login(response, req.body.username, res);
            })
        } else {
            console.log(TAG, "Brukernavn IKKE ok");
            res.json({ error: "Not authorized" });
        }
    });
};

/**
 * returnes artist that is linked to an user(host)
 */

exports.getUserByArtist = (req, res, next) => {


    userDao.getUserByArtist(req.params.artistId, (err, rows) => {

        res.send(rows);
    });
};

/**
 * this calls the chain of validation and if all passes it successfully registres the user. if not it returnes an error of what went bad
 */

exports.registerUser = (req, res, next) => {
    let data = {
        "username": req.body.username,
        "password": req.body.password,
        "email": req.body.email,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "phone": req.body.phone,
        "contact_id": req.body.contact_id,
        "artist_name": req.body.artist_name,
        "organizer": req.body.organizer
    };
    if(validateUsername(data, req.body.username, req.body.password, req.body.email, req.body.first_name, req.body.last_name, req.body.phone, res)) {

    }
};

/**
 * gets an user token
 */

exports.getToken = (req, res, next) => {
    console.log(TAG, "Skal returnere en ny token");
    userDao.getUsername(Number.parseInt(req.body.user_id), (err, rows) => {
        let token = jwt.sign({username: req.body.username}, privateKey, signOptions);
        res.json({token: token});
    });
};


/**
 * Updates an user.
 * gets in user data, and makes it possible to change.
 * @param req
 * @param res
 * @param next func to run
 */
exports.updateUser = (req, res, next) => {
    console.log(TAG, "Skal oppdatere bruker");
    console.log(TAG, req.body);
    let id: number = Number.parseInt(req.params.userId);
    let data: Object = req.body;
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(data.email).toLowerCase())) {
        let regexName =/^[A-Za-z-æøåÆØÅ]{3,40}$/;
        if(data.first_name.match(regexName) && 2 < data.first_name.length < 50) {
            if(data.last_name.match(regexName) && 2 < data.last_name.length < 50) {
                if(data.phone.length === 8 || (data.phone.length === 12 && data.phone.substring(0, 3) === "0047")) {
                    userDao.getContact(id, (err, rows) => {
                        if(rows[0][0].contact_id) {
                            let contactId = rows[0][0].contact_id;
                            userDao.updateContact(contactId, data, (err, rows) => {
                                console.log(TAG, "Bruker oppdatert");
                                res.json(rows);
                            });
                        } else {
                            console.log(TAG, "Finner ikke kontakt");
                            res.json({ error: "Not authorized" });
                        }
                    });
                } else {
                    console.log(TAG, "phone IKKE ok");
                    res.json({ error: "Not accepted phone" });
                }
            } else {
                console.log(TAG, "last_name IKKE ok");
                res.json({ error: "Not accepted last_name" });
            }
        } else {
            console.log(TAG, "first_name IKKE ok");
            res.json({ error: "Not accepted first_name" });
        }
    } else {
        console.log(TAG, "email IKKE ok");
        res.json({ error: "Not accepted email" });
    }

};


/**
 * returne an user with its data on user id
 * @param req requst to service
 * @param res responce to service
 * @param next nexct func
 */
exports.getUser = (req, res, next) => {
    console.log(TAG, "id:" + req.params.userId);
    userDao.getUserById(req.params.userId, (err, user) => {
        console.log(TAG, user);
        console.log(TAG, req.params.userId + user[0][0].user_id + user[0][0].username);
        artistDao.getArtistByContact(user[0][0].contact_id, (err, artist) => {
            console.log(TAG, artist);
            if(artist[0][0]) {
                if(artist[0][0].artist_id) {
                    res.json({
                        user: {
                            "user_id": user[0][0].user_id,
                            "username": user[0][0].username,
                            "contact_id": user[0][0].contact_id,
                            "image": user[0][0].image,
                            "first_name": user[0][0].first_name,
                            "last_name": user[0][0].last_name,
                            "email": user[0][0].email,
                            "phone": user[0][0].phone
                        },
                        artist: {
                            "artist_id": artist[0][0].artist_id,
                            "artist_name": artist[0][0].artist_name
                        }
                    });
                } else {
                    res.json({
                        user: {
                            "user_id": user[0][0].user_id,
                            "username": user[0][0].username,
                            "contact_id": user[0][0].contact_id,
                            "image": user[0][0].image,
                            "first_name": user[0][0].first_name,
                            "last_name": user[0][0].last_name,
                            "email": user[0][0].email,
                            "phone": user[0][0].phone
                        },
                        artist: {
                            "artist_id": null,
                            "artist_name": null
                        }
                    });
                }
            } else {
                res.json({
                    user: {
                        "user_id": user[0][0].user_id,
                        "username": user[0][0].username,
                        "contact_id": user[0][0].contact_id,
                        "image": user[0][0].image,
                        "first_name": user[0][0].first_name,
                        "last_name": user[0][0].last_name,
                        "email": user[0][0].email,
                        "phone": user[0][0].phone
                    },
                    artist: {
                        "artist_id": null,
                        "artist_name": null
                    }
                });
            }
        });
    });
};

/**
 * updates the users password.
 */

exports.updateUserPassword = (req, res, next) => {
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let id = req.params.userId;
    let regex =/^[A-Za-z0-9-æøåÆØÅ]{5,256}$/;
    if(newPassword.match(regex)){
        userDao.getPassword(req.body.username, (err, rows) => {
            if(rows[0][0]) {
                if(rows[0][0].password) {
                    let savedHash = rows[0][0].password;
                    bcrypt.compare(password, savedHash, function(err, response) {
                        if(response) {
                            bcrypt.genSalt(10, function(err, salt) {
                                bcrypt.hash(newPassword, salt, function(err, hash) {
                                    console.log(TAG, "Passord OK");
                                    userDao.updatePassword(id, hash, (err, rows) => {
                                        console.log(TAG, "Passord oppdatert");
                                        res.json(rows);
                                    })
                                })
                            });
                        } else {
                            console.log(TAG, "Passord IKKE ok1");
                            res.json({ error: "Wrong password" });
                        }
                    });
                } else {
                    console.log(TAG, "Passord IKKE ok2");
                    res.json({ error: "Not authorized" });
                }
            } else {
                console.log(TAG, "Passord IKKE ok3");
                res.json({ error: "Not authorized" });
            }
        });
    } else {
        console.log(TAG, "Passord IKKE ok4");
        res.json({ error: "Password not accepted" });
    }
};
exports.getOrganizerUsername = (req, res, next) => {
    console.log(TAG, "GET-request: ");
    userDao.getOrganizerUsername(req.params.contactId, (err, rows) => {
        res.json(rows);
    })
};
//lag tester for dao, mangler noen metoder (minst 1)