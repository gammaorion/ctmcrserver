const db = require('../models');
const SessionPlayer = db.sessionPlayers;
// const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.sessionId || !req.body.playerId || !req.body.wind) {
    res.status(400).send({
      message: "Required fields must be filled!"
    });
    return;
  }

  const sessionPlayer = {
    sessionId: req.body.sessionId,
    playerId: req.body.playerId,
    wind: req.body.wind
  };

  SessionPlayer.create(sessionPlayer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a session player"
      });
    });
};

exports.findBySession = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Session ID must not be empty!"
    });
    return;
  }

  const condition = { sessionId : req.params.id };

  SessionPlayer.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving session players"
      });
    });
};

exports.findOne = (req, res) => {
  const sessionId = req.params.sessionId;
  const playerId = req.params.playerId;

  if (!sessionId || !playerId) {
    res.status(400).send({
      message: "All IDs must be filled!"
    });
    return;
  }

  const condition = {
    sessionId: sessionId,
    playerId: playerId
  }

  SessionPlayer.findOne({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving session player"
      });
    });
};

exports.update = (req, res) => {
  const sessionId = req.params.sessionId;
  const playerId = req.params.playerId;

  SessionPlayer.update(req.body, {
    where: {
      sessionId: sessionId,
      playerId: playerId
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Session player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update session player with session id=${sessionId} and player id=${playerId}. Maybe session player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating session player with session id=${sessionId} and player id=${playerId}`
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.sessionId || !req.params.playerId) {
    res.status(400).send({
      message: "Player ID and session ID must not be empty!"
    });
    return;
  }

  let condition = {
    playerId : req.params.playerId,
    sessionId : req.params.sessionId
  };

  SessionPlayer.destroy({ where : condition })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Session player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete session player. Maybe link was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete session player"
      });
    });
};
