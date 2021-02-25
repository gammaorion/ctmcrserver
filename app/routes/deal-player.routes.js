module.exports = app => {
  const dealPlayer = require("../controllers/deal-player.controller.js");

  var router = require("express").Router();

  router.post("/", dealPlayer.create);

  router.get("/bydeal/:id", dealPlayer.findByDeal);

  router.get("/:dealId/:playerId", dealPlayer.findOne);

  router.put("/:dealId/:playerId", dealPlayer.update);

  router.delete("/:dealId/:playerId", dealPlayer.delete);

  app.use('/api/dealplayers', router);
};
