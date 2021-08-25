// @flow

import {ArtistDAO} from "./dao/artistDao.js";
import {FileInfoDAO} from './dao/fileInfoDao.js';
import {UserDAO} from "./dao/userDao.js";
import {EventDAO} from "./dao/eventDao"

/**
 * Overhead server class. Here, server properties are declared, along with a few app uses
 * @type {createApplication}
 */

// Server properties

const express = require('express');                                     // Express server
const path = require('path');                                           // Path API
const mysql = require("mysql");                                         // Mysql API
const reload = require('reload');                                       // Reload API for automatically restart
const fs = require('fs');                                               // File service API
const PORT = process.env.port || 4000;                                  // Port to be used
const bodyParser = require("body-parser");                              // Body parsing for reading json
const public_path = path.join(__dirname, '/../../client/public');       // Public path to React application
const config = require("./controllers/configuration.js");               // Configuration handler
const multer = require('multer');                                       // Multer for I/O operations in fs

const TAG = '[Server]';

let jwt = require("jsonwebtoken");
let app = express();

// Let server use APIs
app.use(express.static(public_path));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// Create MySql connection pool
let database = config.getProductionDatabase();
const pool = mysql.createPool({
    connectionLimit: 2,
    host: database.host,
    user: database.user,
    password: database.password,
    database: database.database,
    debug: false,
    multipleStatements: true
});

// Instantiate DAOs to be used directly in this class
const artistDao = new ArtistDAO(pool);
const fileInfoDao = new FileInfoDAO(pool);
const userDao = new UserDAO(pool);
const eventDao = new EventDAO(pool);

module.exports = pool;

//CORS-error handling (server/client security blocking-thing)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Accept, Origin"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    next();
});

let publicKey = fs.readFileSync('./src/public.txt', 'utf8');

const verifyOptions = {
    expiresIn:  "30M",
    algorithm:  ["RS256"]
};

app.use("/auth/id/:id", (req, res, next) => {
    let paramsId = req.params.id;
    let token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, verifyOptions, (err, decoded) => {
        if (err) {
            console.log(TAG, "Token Error #1");
            res.json({ error: "Token" });
        } else {
            userDao.getUsername(paramsId, (err, rows) => {
                if(rows[0][0].username) {
                }
                if(rows[0][0].username.toString().toUpperCase() === decoded.username.toString().toUpperCase()) {
                    if(req.body.username) {
                        if(req.body.username.toUpperCase() === decoded.username.toUpperCase()) {
                            //console.log(TAG, "Token ok: " + decoded.username);
                            if(req.body.user_id) {
                                if(req.body.user_id === paramsId) {
                                    //console.log(TAG, "Token ok: " + decoded.username);
                                    next();
                                } else {
                                    console.log(TAG, "Token #4");
                                    res.json({ error: "Token" });
                                }
                            } else {
                                //console.log(TAG, "Token ok: " + decoded.username);
                                next();
                            }
                        } else {
                            console.log(TAG, "Token Error #2");
                            res.json({ error: "Token" });
                        }
                    } else {
                        //console.log(TAG, "Token ok: " + decoded.username);
                        if(req.body.user_id) {
                            if(req.body.user_id === paramsId) {
                                //console.log(TAG, "Token ok: " + decoded.username);
                                next();
                            } else {
                                console.log(TAG, "Token Error #5");
                                res.json({ error: "Token" });
                            }
                        } else {
                            //console.log(TAG, "Token ok: " + decoded.username);
                            next();
                        }
                    }
                } else {
                    console.log(TAG, "Token Error #3");
                    res.json({ error: "Token" });
                }
            });
        }
    });
});


app.use("/auth/id/:id", (req, res, next) => {
    if(req.body.event) {
        eventDao.getEventById(req.body.event, (err, data) => {
            userDao.getContact(req.params.id, (err2, data2) => {
                if(data[0][0].organizer === data2[0][0].contact_id) {
                    next();
                } else {
                    console.log("Eier ikke event");
                    res.json({ error: "Event" });
                }
            });
        });
    } else {
        next();
    }
});

/*
app.use("/ticket/:ticket", (req, res, next) => {
    console.log(TAG, "auth ticket 1");
    userDao.getContact(req.params.id, (err, rows) => {
        if(rows[0][0].contact_id) {
            let id = rows[0][0].contact_id;
            if(req.params.ticket) {
                ticketDao.getOne(req.params.ticket,(err, rows) => {
                    if(rows[0][0]) {
                        if(rows[0][0].event) {
                            eventDao.getEventById(rows[0][0].event, (err, rows2) => {
                                if(rows2[0][0].organizer) {
                                    if(rows2[0][0].organizer === id) {
                                        next();
                                    } else {
                                        console.log(TAG, "not authorized ticket id1");
                                        res.json({ error: "Not authorized" });
                                    }
                                } else {
                                    console.log(TAG, "not authorized ticket id2");
                                    res.json({ error: "Not authorized" });
                                }
                            });
                        } else {
                            console.log(TAG, "not authorized ticket id3");
                            res.json({ error: "Not authorized" });
                        }
                    } else {
                        console.log(TAG, "not authorized ticket id4");
                        res.json({ error: "Not authorized" });
                    }
                });
            } else {
                next();
            }
        } else {
            res.json({ error: "Not authorized" });
        }
    });
});
*/

//TODO: Is this a test?
/*app.use("/auth/id/:id/event/:eventId", (req, res, next) => {
    userDao.getContact(req.params.id, (err, rows) => {
        if (rows[0][0].contact_id) {
            let id = rows[0][0].contact_id;
            if (req.params.eventId) {
                eventDao.getEventById(req.params.eventId, (err, rows) => {
                    if (rows[0][0].organizer) {
                        if (rows[0][0].organizer === id) {
                            next();
                        } else {
                            artistDao.getArtistByEvent(req.params.eventId, (err, rows) => {
                                if (rows[0]) {
                                    if (rows[0].map(artist => artist.user_id).includes(id)) {
                                        next();
                                    } else {
                                        console.log(TAG, "not authorized event id1");
                                        res.json({error: "Not authorized"});
                                    }
                                } else {
                                    console.log(TAG, "not authorized event id2");
                                    res.json({error: "Not authorized"});
                                }
                            });
                        }
                    } else {
                        console.log(TAG, "not authorized event id3");
                        res.json({error: "Not authorized"});
                    }
                });
            } else {
                console.log(TAG, "not authorized event id4");
                res.json({error: "Not authorized"});
            }
        } else {
            res.json({error: "Not authorized"});
        }
    });
});*/


// Setup routes
const artistRoutes = require("./routes/artist");
const equipmentRoutes = require("./routes/equipment");
const eventRoutes = require("./routes/event");
const ticketRoutes = require("./routes/ticket");
const userRoutes = require("./routes/user");
const fileRoutes = require("./routes/file");
const roleRoutes = require("./routes/role");
const riderRoutes = require("./routes/riders");
const loginRoutes = require("./routes/login");
const apiRoutes = require("./routes/api");

app.use("/auth/id/:id/artist", artistRoutes);
app.use("/auth/id/:id/event", eventRoutes);
app.use("/auth/id/:id/equipment", equipmentRoutes);
app.use("/auth/id/:id/user", userRoutes);
app.use("/auth/id/:id/ticket", ticketRoutes);
app.use("/auth/id/:id/role", roleRoutes);
app.use("/auth/id/:id/rider", riderRoutes);
app.use("/auth/id/:id/file", fileRoutes);
app.use("/auth", loginRoutes);
app.use("/api", apiRoutes);


// Add an application header for allowing HTTPS-requests from same host
/*app.get('/*',function(req,res,next){
    res.header('Access-Control-Allow-Origin' , 'http://localhost:4000' );
    next();
});*/

// Set file storage directory
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

// File upload
const upload = multer({
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.txt' && ext !== '.doc' && ext !== '.pdf' && ext !== '.docx'&& ext !== '.odt') {
            req.fileValidationError = 'error';
            return callback(null, false, new Error('goes wrong on the mimetype'));
        }
        callback(null, true)
    },
    storage,
    limits: 1024 * 1024 * 5
});

const uploadImg = multer({
    fileFilter: function (req, file, callback) {
        let ext = path.extname(file.originalname);
        console.log(TAG, ext);
        console.log(TAG, ext === '.jpg');
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
            req.fileValidationError = 'error';
            return callback(null, false, new Error('goes wrong on the mimetype'));
        }
        callback(null, true)
    },
    storage,
    limits: 1024 * 1024 * 5
});

app.post('/api/single/:eventId', upload.single('file'), (req, res) => {
    console.log(TAG, 'Got request from client: GET /api/single/' + req.params.eventId);
    if(req.fileValidationError) {
        return res.end(req.fileValidationError);
    }
    let data = {
        "name": req.body.name,
        "eventId": req.params.eventId,
        "path": req.body.path
    };
    let result = res;
    console.log(TAG, req.file);
    fileInfoDao.postFileInfo(data, (err, res) => {
        try {
            result.send(req.file);
        }catch(err) {
            result.send(400);
        }
    });
});

app.post('/api/image/:eventId', uploadImg.single('file'), (req, res) => {
    console.log(TAG, 'Got request from client: GET /api/image/' + req.params.eventId);
    if(req.fileValidationError) {
        console.log(TAG, "FRICKK");
        return res.end(req.fileValidationError);
    }
    let data = {
        "eventId": req.params.eventId,
        "image": req.body.image
    };
    let result = res;
    console.log(TAG, req.file);
    console.log(TAG, data.image);
    eventDao.postImageToEvent(data, (err, res) => {
        try {
            result.send(req.file);
        }catch(err) {
            result.send(400);
        }
    });
});

app.post('/api/single/artist/:eventId', upload.single('file'), (req, res) => {
    console.log(TAG, 'Got request from client: GET /api/single/artist/' + req.params.eventId);
    let data = {
        "name": req.body.name,
        "eventId": req.params.eventId,
        "path": req.body.path,
        "artist_name": req.body.artist_name,
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "phone": req.body.phone
    };
    let result = res;
    console.log(TAG, req.file);
    artistDao.addArtistWithNewContract(data, (err, res) => {
        try {
            result.send(req.file);
        }catch(err) {
            result.send(400);
        }
    });
});

// Update file
app.post('/api/single/update', upload.single('file'), (req, res) => {
    console.log(TAG, 'Got request from client: GET /api/single/update');
    try {
        result.send(req.file);
    }catch(err) {
        result.send(400);
    }
});

app.post('/api/image/edit/update', uploadImg.single('file'), (req, res) => {
    console.log(TAG, 'Got request from client: GET /api/image/update');
    try {
        result.send(req.file);
    }catch(err) {
        result.send(400);
    }
});

// Add an application header for allowing HTTPS-requests from same host
/*app.get('/*',function(req,res,next){
    res.header('Access-Control-Allow-Origin' , 'http://localhost:4000' );
    next();
});*/

app.use((req, res, next) => {
    res.status(404).redirect('http://localhost:' + PORT + '/#/404');
});

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
    // Setup hot reload (refresh web page on client changes)
    reload(app).then(reloader => {
        app.listen(PORT, (error: ?Error) => {
            if (error) reject(error.message);
            console.log(TAG, 'Express server started');
            // Start hot reload (refresh web page on client changes)
            reloader.reload(); // Reload application on server restart
            fs.watch(public_path, () => reloader.reload());
            resolve();
        });
    });
});
