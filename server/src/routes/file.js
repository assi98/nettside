// @flow

const express = require("express");

const fileInfoController = require("../controllers/fileInfo");

const router = express.Router();

// ROUTE: auth/id/:userId/file
router.get("/download/:file", fileInfoController.downloadFile);
router.get("/download/contract/:artistId", fileInfoController.downloadContract);
router.get("/edit/:file", fileInfoController.getFileContent);
router.delete("/delete/:file", fileInfoController.deleteFileInfo);

//router.post("/upload/:eventId", fileController.upload.single('file'));


module.exports = router;
