module.exports = app => {
  const sessionPlayer = require("../controllers/session-player.controller.js");

  var router = require("express").Router();

  router.post("/", sessionPlayer.create);

  router.get("/bysession/:id", sessionPlayer.findBySession);

  router.get("/:sessionId/:playerId", sessionPlayer.findOne);

  router.put("/:sessionId/:playerId", sessionPlayer.update);

  router.delete("/:sessionId/:playerId", sessionPlayer.delete);

  app.use('/api/sessionplayers', router);
};
