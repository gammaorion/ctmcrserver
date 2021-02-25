const db = require("../models");
const Tournament = db.tournaments;
const Op = db.Sequelize.Op;

// Create and Save a new tournament
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.eventdate || !req.body.place ||
      !req.body.toursAmt ||!req.body.tablesAmt) {
    res.status(400).send({
      message: "Title, date and place must be filled!"
    });
    return;
  }

  // Create a Tournament
  const tournament = {
    title: req.body.title,
    eventdate: req.body.eventdate,
    place: req.body.place,
    toursAmt: req.body.toursAmt,
    tablesAmt: req.body.tablesAmt,
    comment: req.body.comment || '',
    isComplete: req.body.isComplete || false
  };

  // Save Tutorial in the database
  Tournament.create(tournament)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a tournament"
      });
    });
};

// Retrieve all Tournaments from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Tournament.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tournaments"
      });
    });
};

// Find a single Tournament with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tournament.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving tournament with id=" + id
      });
    });
};

// Update a Tournament by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Tournament.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tournament was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update tournament with id=${id}. Maybe tournament was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating tournament with id=" + id
      });
    });
};

// Delete a Tournament with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // TODO: check whether there are records bound to this tournament
  Tournament.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tournament was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete tournament with id=${id}. Maybe tournament was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete tournament with id=" + id
      });
    });
};

// Delete all tournaments from the database.
/* exports.deleteAll = (req, res) => {
  Tournament.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} tournaments were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tournaments."
      });
    });
}; */
