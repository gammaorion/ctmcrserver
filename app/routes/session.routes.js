module.exports = app => {
  const session = require("../controllers/session.controller.js");

  var router = require("express").Router();

  router.post("/", session.create);

  router.get("/bytournament/:id", session.findByTournament);

  router.get("/close/:id", session.closeSession);

  router.get("/reopen/:id", session.reopenSession);

  router.get("/:id", session.findOne);

  router.put("/:id", session.update);

  router.delete("/:id", session.delete);

  app.use('/api/sessions', router);
};
