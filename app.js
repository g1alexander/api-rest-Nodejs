"use strict";

// cargar modulos de node para crear el express
const express = require("express");
const bodyParser = require("body-parser");

// ejecutar express
var app = express();
// cargar ficheros - rutas
var articlesRutas = require("./routes/articles.routes");

// middlewares (trozos de codigo que se ejecutan antes e independientes)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// CORS ?
// Configurar cabeceras y cors, esto es para permitir llamadas https del frontend a la api
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
// Anadir prefijos a rutas / cargar rutas
app.use("/api", articlesRutas);

// exportar modulo (app a server)
module.exports = app;
