const db = require('../models');
const Session = db.sessions;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.tournamentId ||
      !req.body.tableNumber ||
      !req.body.tourNumber) {
      res.status(400).send({
        message: "Tournament id, table number and tour number must be filled!"
      });
      return;
  }

  Session.findAll({ where: req.body })
    .then(data => {
      if (data.length > 0) {
        res.send(data[0]);
      } else {
        const session = {
          tournamentId: req.body.tournamentId,
          tourNumber: req.body.tourNumber,
          tableNumber: req.body.tableNumber,
          dealsPlayed: req.body.dealsPlayed || 0,
          isComplete: req.body.isComplete || false
        };

        Session.create(session)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating a session"
            });
          });
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions"
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

  Session.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions"
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session Id must not be empty!"
    });
    return;
  }

  Session.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving session with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).send({
      message: "Session ID must not be empty!"
    });
    return;
  }

  Session.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Session was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update session with id=${id}. Maybe session was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating session with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session ID must not be empty!"
    });
    return;
  }

  Session.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Session was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete session with id=${id}. Maybe session was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete session with id=" + id
      });
    });
};

exports.closeSession = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session ID must not be empty!"
    });
    return;
  }

};

exports.reopenSession = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session ID must not be empty!"
    });
    return;
  }

};
