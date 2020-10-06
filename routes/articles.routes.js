"use strict";

var express = require("express");
var articleController = require("../controllers/article.controller");
var router = express.Router();
var multer = require("multer");
var multiparty = require("connect-multiparty");

const md_upload = multiparty({
  uploadDir: "./uploads/article",
});

// rutas de prueba
router.post("/datos-cursos", articleController.datos);
router.get("/test", articleController.test);

// rutas utiles
router.post("/save", articleController.save);
router.get("/articles/:last?", articleController.getArticles);
router.get("/article/:id", articleController.getArticle);
router.put("/article/:id", articleController.update);
router.delete("/article/:id", articleController.delete);
router.post("/upload-image/:id", md_upload, articleController.upload);
router.get("/get-image/:image", articleController.getImage);
router.get("/search/:search", articleController.search);

module.exports = router;
