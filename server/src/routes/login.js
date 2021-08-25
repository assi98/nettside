// @flow

const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

// ROUTE: auth
router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);



module.exports = router;
