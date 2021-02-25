module.exports = app => {
  const players = require("../controllers/player.controller.js");

  var router = require("express").Router();

  router.post("/", players.create);

  router.get("/", players.findAll);

  router.get("/:id", players.findOne);

  router.put("/:id", players.update);

  router.delete("/:id", players.delete);

  app.use('/api/players', router);
};
