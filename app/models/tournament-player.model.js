module.exports = (sequelize, Sequelize) => {
  const TournamentPlayer = sequelize.define('tournamentPlayer', {
    playerNumber: {
      type: Sequelize.INTEGER
    },
    place: {
      type: Sequelize.INTEGER
    },
    gamePoints: {
      type: Sequelize.INTEGER
    },
    tournamentPoints: {
      type: Sequelize.INTEGER
    },
    competitionPoints: {
      type: Sequelize.FLOAT
    },
    averageHand: {
      type: Sequelize.FLOAT
    },
    maxHand: {   // maxHandDealId is bound in index.js
      type: Sequelize.INTEGER
    },
    averagePointsTaken: {
      type: Sequelize.FLOAT
    },
    totalHandsTaken: {
      type: Sequelize.INTEGER
    },
    selvesTaken: {
      type: Sequelize.INTEGER
    },
    feeds: {
      type: Sequelize.INTEGER
    },
    passiveLosses: {
      type: Sequelize.INTEGER
    },
    otherSelvesLosses: {
      type: Sequelize.INTEGER
    },
    averageFeed: {
      type: Sequelize.FLOAT
    },
    maxFeed: {
      type: Sequelize.INTEGER
    },
    averageOSLoss: {
      type: Sequelize.FLOAT
    },
    maxOSLoss: {
      type: Sequelize.INTEGER
    },
    drawsAmt: {
      type: Sequelize.INTEGER
    },
    maxWinRow: {
      type: Sequelize.INTEGER
    }
  });

  return TournamentPlayer;
}
