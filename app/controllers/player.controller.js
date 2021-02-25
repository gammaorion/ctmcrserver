const db = require("../models");
const Player = db.players;
const Op = db.Sequelize.Op;

// Create and Save a new tournament
exports.create = (req, res) => {
  // Validate request
  if (!req.body.firstname || !req.body.surname) {
    res.status(400).send({
      message: "First name and surname must be filled!"
    });
    return;
  }

  const player = {
    firstname: req.body.firstname,
    surname: req.body.surname,
    patronymic: req.body.patronymic,
    living: req.body.living,
    comment: req.body.comment,
    isReplacer: req.body.isReplacer || false
  };

  Player.create(player)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a player"
      });
    });
};

// Retrieve all Tournaments from the database.
exports.findAll = (req, res) => {
  const surname = req.query.surname;
  var condition = surname ? { surname: { [Op.like]: `%${surname}%` } } : null;

  Player.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players"
      });
    });
};

  // Find a single Tournament with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Player.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving player with id=" + id
      });
    });
};

// Update a Tournament by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Player.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update player with id=${id}. Maybe player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating player with id=" + id
      });
    });
};

// Delete a Tournament with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // TODO: check whether there are records bound to this tournament
  Player.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete player with id=${id}. Maybe player was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete player with id=" + id
      });
    });
};
