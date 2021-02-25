module.exports = app => {
  const tournamentPlayer = require("../controllers/tournament-player.controller.js");

  var router = require("express").Router();

  router.post("/", tournamentPlayer.create);

  router.post("/bulk", tournamentPlayer.bulkCreate);

  router.get("/bytournament/:id", tournamentPlayer.findByTournament);

  router.get("/byplayer/:id", tournamentPlayer.findByPlayer);

  router.get("/playersfortournament/:id", tournamentPlayer.getPlayersForTournament);

  router.get("/:tournamentId/:playerId", tournamentPlayer.findOne);

  router.delete("/bytournament/:id", tournamentPlayer.deleteForTournament);

  router.delete("/:tournamentId/:playerId", tournamentPlayer.delete);

  app.use('/api/tournamentplayers', router);
};
