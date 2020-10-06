'use strict';

const mongoose = require('mongoose');
const app = require('./app'); //server express
const port = 5000;
// desactivar funciones obsoletas o viejas
mongoose.set("useFindAndModify", false);
// trabajar con promesas para hacer mas amena la exp :)
mongoose.Promise = global.Promise; 
// conexion a la base de datos de mongo
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("la conexion con mongo se ha realizado con exito :)");

    // servidor de express
    app.listen(port, () => {
      console.log('server on port Localhost:'+port);
    });

  });