module.exports = app => {
  const protocols = require("../controllers/protocol.controller.js");

  var router = require("express").Router();

  router.put("/save/:sessionId", protocols.saveProtocol);

  app.use("/api/protocols", router);
};
