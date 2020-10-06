"use strict";

const validator = require("validator");
const Article = require("../models/article");
const fs = require("fs");
const path = require("path");

var articleController = {
  datos: (req, res) => {
    return res.status(200).send({
      nombre: "Master en framework JS",
      alumno: "alexnaderg",
    });
  },

  test: (req, res) => {
    return res.status(200).send({
      message: "Hola mundo al test",
    });
  },

  save: (req, res) => {
    // obtener los datos
    var params = req.body;

    // validar los datos
    try {
      var validator_title = !validator.isEmpty(params.title);
      var validator_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "hay un error con los datos",
      });
    }

    if (validator_title && validator_content) {
      // crear los objetos
      var article = new Article();

      // asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      // guardar el articulo
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "error",
            message: "hubo un error al momento de guardar los datos",
          });
        }

        // devolver una respuesta
        return res.status(200).send({
          status: "success",
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        status: "error",
        message: "la validacion es incorrecta",
      });
    }
  },

  getArticles: (req, res) => {
    var query = Article.find({});
    // ultimos articulos
    var last = req.params.last;

    if (last || last != undefined) {
      query.limit(5);
    }
    // sacar todos los articulos por url
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "error al obtener los articulos",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "no hay articulos articulos",
        });
      }

      return res.status(200).send({
        status: "success",
        articles,
      });
    });
  },
  getArticle: (req, res) => {
    // recoger el id
    var articleId = req.params.id;
    // comprobar que el id exista
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "no existe el articulo",
      });
    }

    Article.findById(articleId, (error, article) => {
      if (error || !article) {
        return res.status(404).send({
          status: "error",
          message: "no se encuenta ese articulo",
        });
      }

      // devolver el articulo (json)
      return res.status(200).send({
        status: "success",
        article,
      });
    });
  },
  update: (req, res) => {
    // recoger el id
    var articleId = req.params.id;
    // recoger los datos que llegan por put
    var params = req.body;
    // validar los datos
    try {
      var validator_title = !validator.isEmpty(params.title);
      var validator_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "los datos son incorrectos",
      });
    }

    if (validator_title && validator_content) {
      // find and update
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (err, articleUpdate) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "error al actualizar",
            });
          }
          if (!articleUpdate) {
            return res.status(404).send({
              status: "error",
              message: "el articulo no existe",
            });
          }
          return res.status(200).send({
            status: "success",
            article: articleUpdate,
          });
        }
      );
    } else {
      return res.status(500).send({
        status: "error",
        message: "validacion incorrecta",
      });
    }
  },
  delete: (req, res) => {
    // recoger el id
    var articleId = req.params.id;

    // eliminar el objeto
    Article.findOneAndDelete({ _id: articleId }, (err, articleDelete) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "error al intentar borrar",
        });
      }
      if (!articleDelete) {
        return res.status(404).send({
          status: "error",
          message: "el ariculo que intentas eliminar no existe",
        });
      }
      return res.status(200).send({
        status: "success",
        article: articleDelete,
      });
    });
  },
  upload: (req, res) => {
    // Configurar el modulo connect multiparty router/article.js (hecho)

    // Recoger el fichero de la petición
    var file_name = "Imagen no subida...";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    // Conseguir nombre y la extensión del archivo linux & mac
    var file_path = req.files.file0.path;
    var file_split = file_path.split("/");

    // * ADVERTENCIA * EN wind32
    // var file_split = file_path.split("\\");

    // Nombre del archivo
    var file_name = file_split[2];

    // Extensión del fichero
    var extension_split = file_name.split(".");
    var file_ext = extension_split[1];

    // Comprobar la extension, solo imagenes, si es valida borrar el fichero
    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      fs.unlink(file_path, (error) => {
        return res.status(500).send({
          status: "error",
          message: "la extension de la imagen no es valida!",
        });
      });
    } else {
      // si es valido para el id del articulo

      var articleId = req.params.id;

      // buescar el articulo, asignarle el nombre de la imagen
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true },
        (error, articleUpdated) => {
          if (error || !articleUpdated) {
            return res.status(500).send({
              status: "error",
              message: "error al guardar la imagen",
            });
          }

          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        }
      );
    }
  },

  getImage: (req, res) => {
    // capturo la imagen de la url
    var file = req.params.image;
    // coloco toda la ruta de la image
    var path_file = "./uploads/article/" + file;

    fs.exists(path_file, (exists) => {
      if (exists) {
        // devolver la imagen en crudo atraves de la libreria de express y la direccion de 'path'
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(404).send({
          status: "error",
          message: "la imagen no existe",
        });
      }
    });
  },
  search: (req, res) => {
    // sacar el string de la url
    var searchString = req.params.search;
    // condicion Find "or"
    Article.find({
      $or: [
        // cuando el searchString este 'incluido: i' en el titulo
        // 'o: $or' entonces muestrame el articulo con la fecha de primero y en order desc
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((error, articles) => {
        if (error) {
          return res.status(500).send({
            status: "error",
            message: "hubo un error en la peticion",
          });
        }

        if (!articles || articles.length <= 0) {
          return res.status(404).send({
            status: "error",
            message: "al parecer no existe tales articulos",
          });
        }

        return res.status(200).send({
          status: "success",
          articles,
        });
      });
  },
}; //end controller

module.exports = articleController;
