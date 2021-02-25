module.exports = app => {
  const deal = require("../controllers/deal.controller.js");

  var router = require("express").Router();

  router.post("/", deal.create);

  router.get("/bysession/:id", deal.findBySession);

  router.get("/fullbysession/:id", deal.getFullBySession);

  router.get("/:id", deal.findOne);

  router.put("/:id", deal.update);

  router.delete("/:id", deal.delete);

  app.use('/api/deals', router);
};
