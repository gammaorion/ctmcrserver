const db = require('../models');
const TournamentPlayer = db.tournamentPlayers;
const Player = db.players;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.tournamentId || !req.body.playerId || !req.body.playerNumber) {
    res.status(400).send({
      message: "Required fields must be filled!"
    });
    return;
  }

  const tournamentPlayer = {
    tournamentId: req.body.tournamentId,
    playerId: req.body.playerId,
    playerNumber: req.body.playerNumber
  };

  TournamentPlayer.create(tournamentPlayer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a link tournament - player"
      });
    });
};

exports.bulkCreate = (req, res) => {
  const recordsToAdd = req.body;
  const filteredRecs = [];

  if (!recordsToAdd || !recordsToAdd.length) {
    res.status(400).send({
      message: "No records detected in post request"
    });
    return;
  }

  for (let i = 0; i < recordsToAdd.length; ++i) {
    if (!recordsToAdd[i].tournamentId ||
      !recordsToAdd[i].playerId ||
      !recordsToAdd[i].playerNumber) {
        res.status(400).send({
          message: `Record ${i} must be filled!`
        });
        return;
    }

    filteredRecs.push({
      tournamentId: recordsToAdd[i].tournamentId,
      playerId: recordsToAdd[i].playerId,
      playerNumber: recordsToAdd[i].playerNumber
    });
  }

  TournamentPlayer.bulkCreate(filteredRecs)
    .then(() => {
      res.send({
        message: "All records were bulk created successfully"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while bulk creating"
      });
    });

};

exports.findByTournament = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Tournament ID must not be empty!"
    });
    return;
  }

  const condition = { tournamentId : id };

  TournamentPlayer.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving links"
      });
    });
};

exports.findByPlayer = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Player ID must not be empty!"
    });
    return;
  }

  const condition = { playerId : id };

  TournamentPlayer.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving links"
      });
    });
};

exports.findOne = (req, res) => {
  const tournamentId = req.params.tournamentId;
  const playerId = req.params.playerId;

  if (!tournamentId || !playerId) {
    res.status(400).send({
      message: "All IDs must be filled!"
    });
    return;
  }

  const condition = {
    tournamentId: tournamentId,
    playerId: playerId
  }

  TournamentPlayer.findOne({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving link rec"
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.tournamentId || !req.params.playerId) {
    res.status(400).send({
      message: "Player ID and Tournament ID must not be empty!"
    });
    return;
  }

  let condition = {
    playerId : req.params.playerId,
    tournamentId : req.params.tournamentId
  };

  TournamentPlayer.destroy({ where : condition })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tournament - player link was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete tournament-player link. Maybe link was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete link"
      });
    });
};

exports.deleteForTournament = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Tournament ID must not be empty!"
    });
    return;
  }

  let condition = {
    tournamentId : req.params.id
  };

  TournamentPlayer.destroy({ where : condition })
    .then(num => {
      if (num >= 1) {
        res.send({
          message: "Tournament-player links were deleted successfully!"
        });
      } else {
        res.send({
          message: "Cannot delete tournament-player links. Maybe links were not found!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete link"
      });
    });
};

exports.getPlayersForTournament = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Tournament ID must not be empty!"
    });
    return;
  }

  // console.log("tournament in req is " + req.params.id);

  Player.findAll({
    include : [{
      model: db.tournaments,
      attributes: ['title'],
      through: {
        attributes: ['playerNumber']
      },
      where: {
        id: req.params.id
      }
    }]
  }).then(data => {
    res.send(data)
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving players list"
    });
  });
};

/* exports.getTournamentsForPlayer = (req, res) => {

}; */
