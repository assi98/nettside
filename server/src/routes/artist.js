//@flow

const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist');

// ROUTE: auth/id/:userId/artist
router.post("/", artistController.insertArtist);

router.delete("/:artistId", artistController.deleteArtist);
router.get("/", artistController.getAllArtists);
router.get("/:artistId", artistController.getArtistById);
router.get("/user/:userId", artistController.getArtistByUser);
router.post("/contract/:eventId", artistController.addArtistWithNewContract);

module.exports = router;