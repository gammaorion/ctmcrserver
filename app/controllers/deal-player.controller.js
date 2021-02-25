const db = require('../models');
const DealPlayer = db.dealPlayers;
// const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.dealId || !req.body.playerId || !req.body.article) {
    res.status(400).send({
      message: "Required fields must be filled!"
    });
    return;
  }

  const dealPlayer = {
    dealId: req.body.dealId,
    playerId: req.body.playerId,
    gamePoints: req.body.gamePoints || 0,
    article: req.body.article
  };

  DealPlayer.create(dealPlayer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a deal player"
      });
    });
};

exports.findByDeal = (req, res) => {
  if (!req.params.id) {
    res.status(400).send({
      message: "Deal ID must not be empty!"
    });
    return;
  }

  const condition = { dealId : req.params.id };

  DealPlayer.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deal players"
      });
    });
};

exports.findOne = (req, res) => {
  const dealId = req.params.dealId;
  const playerId = req.params.playerId;

  if (!dealId || !playerId) {
    res.status(400).send({
      message: "All IDs must be filled!"
    });
    return;
  }

  const condition = {
    dealId: dealId,
    playerId: playerId
  }

  DealPlayer.findOne({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deal player"
      });
    });
};

exports.update = (req, res) => {
  const dealId = req.params.dealId;
  const playerId = req.params.playerId;

  DealPlayer.update(req.body, {
    where: {
      dealId: dealId,
      playerId: playerId
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Deal player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update deal player with deal id=${dealId} and player id=${playerId}. Maybe deal player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating deal player with deal id=${dealId} and player id=${playerId}`
      });
    });
};

exports.delete = (req, res) => {
  if (!req.params.dealId || !req.params.playerId) {
    res.status(400).send({
      message: "Player ID and deal ID must not be empty!"
    });
    return;
  }

  let condition = {
    playerId : req.params.playerId,
    dealId : req.params.dealId
  };

  DealPlayer.destroy({ where : condition })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Deal player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete deal player. Maybe link was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete deal player"
      });
    });
};
