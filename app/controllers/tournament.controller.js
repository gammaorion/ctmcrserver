const db = require("../models");
const PlayerStats = require("../logic/playerstats");
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
        if (req.body.hasOwnProperty('isComplete') && req.body.isComplete) {
          recalculatePlayersStats(id, res);
        } else {
          res.send({
            message: "Tournament was updated successfully."
          });
        }
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

/**
 * Called from update method
 */
async function recalculatePlayersStats(id, res) {
  let fullUpdate;

  try {
    fullUpdate = await db.sequelize.transaction();

    const tourPlayersRaw = await db.tournamentPlayers.findAll({
      where: { tournamentId: id },
      attributes: ['playerId'],
      transaction: fullUpdate
    });

    const tourPlayers = makePlainArray(tourPlayersRaw, 'playerId');

    const statsSelector = new PlayerStats(db, [id]);

    await statsSelector.init();

    const playersInfo = [];

    for (let i = 0; i < tourPlayers.length; ++i) {
      let mainStats = await statsSelector.getMainStats(tourPlayers[i]);

      mainStats.place = 0;
      mainStats.competitionPoints = 0;
      mainStats.selvesTaken = await statsSelector.getSelvesTaken(tourPlayers[i]);
      mainStats.passiveLosses = await statsSelector.getPassiveLosses(tourPlayers[i]);
      mainStats.feeds = await statsSelector.getFeeds(tourPlayers[i]);
      mainStats.drawsAmt = await statsSelector.getDraws(tourPlayers[i]);
      mainStats.otherSelvesLosses = await statsSelector.getOtherSelvesLosses(tourPlayers[i]);
      mainStats.averagePointsTaken = await statsSelector.getAveragePointsTaken(tourPlayers[i]);
      mainStats.averageFeed = await statsSelector.getAverageFeeds(tourPlayers[i]);
      mainStats.averageOSLoss = await statsSelector.getAverageOSLosses(tourPlayers[i]);

      const maxHandAndRow = await statsSelector.getSecondaryStats(tourPlayers[i]);
      mainStats.maxHand = maxHandAndRow.handPoints;
      mainStats.maxHandDealId = maxHandAndRow.id;
      mainStats.averageHand = maxHandAndRow.averHand;
      mainStats.maxWinRow = maxHandAndRow.maxWinRow;

      mainStats.maxFeed = await statsSelector.getMaxFeed(tourPlayers[i]);
      mainStats.maxOSLoss = await statsSelector.getMaxOSLoss(tourPlayers[i]);

      playersInfo.push(mainStats);
    }

    playersInfo.sort((elem1, elem2) => {
      if (elem1.tournamentPoints > elem2.tournamentPoints) {
        return -1;
      } else if (elem1.tournamentPoints < elem2.tournamentPoints) {
        return 1;
      } else {
        if (elem1.gamePoints > elem2.gamePoints) {
          return -1;
        } else if (elem1.gamePoints < elem2.gamePoints) {
          return 1;
        } else {
          if (elem1.totalHandsTaken < elem2.totalHandsTaken) {
            return -1;
          } else if (elem1.totalHandsTaken > elem2.totalHandsTaken) {
            return 1;
          }
        }
      }

      return 0;
    });

    // todo: consider players with all equal stats
    for (let i = 0; i < playersInfo.length; ++i) {
      playersInfo[i].place = i + 1;
      playersInfo[i].competitionPoints = (playersInfo.length - i) * 1000.0 / playersInfo.length;

      await db.tournamentPlayers.update(playersInfo[i],
        {
          where: { playerId: playersInfo[i].playerId, tournamentId: id },
          transaction: fullUpdate
        });
    }

    await fullUpdate.commit();

    res.send({
      message: "Tournament updated, players statistics recalculated"
    });
  } catch (err) {
    await fullUpdate.rollback();
    console.log("Tournament update error: " + err.message);
    res.status(500).send({
      message: "Tournament update error: " + err.message
    });
  }
}

function makePlainArray(arr, prop) {
  let result = [];

  for (let i = 0; i < arr.length; ++i) {
    result.push(arr[i][prop]);
  }

  return result;
}

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
