const db = require('../models');
const Deal = db.deals;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.sessionId || !req.body.dealNumber) {
      res.status(400).send({
        message: "Session ID and deal number must be filled!"
      });
      return;
  }

  const deal = {
    sessionId: req.body.sessionId,
    dealNumber: req.body.dealNumber,
    result: req.body.result,
    handPoints: req.body.handPoints,
    dealComment: req.body.dealComment
  };

  Deal.create(deal)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating a deal"
      });
    });
};

exports.findBySession = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session id must not be empty!"
    });
    return;
  }

  const condition = { sessionId : id };

  Deal.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deals for session " + id
      });
    });
};

exports.getFullBySession = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Session id must not be empty!"
    });
    return;
  }

  const condition = { sessionId : id };

  Deal.findAll({
    include: [
      {
        model: db.players,
        attributes: ['id', 'isReplacer'],
        through: {
          attributes: ['gamePoints', 'article', 'comment']
        }
      }
    ],
    where: condition
   }).then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deals for session " + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Deal.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Deal was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update deal with id=${id}. Maybe deal was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating deal with id=" + id
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Deal id must not be empty!"
    });
    return;
  }

  const condition = { id : id };

  Deal.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving deal " + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({
      message: "Deal id must not be empty!"
    });
    return;
  }

  const condition = { id : id };

  Deal.destroy({ where: condition })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Deal was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete deal with id=${id}. Maybe deal was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete deal with id=" + id
      });
    });
};

// TODO: add some selectors for players: winners, losers,
//   passive losses etc.
