module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define('session', {
    tourNumber: {
      type: Sequelize.INTEGER
    },
    tableNumber: {
      type: Sequelize.INTEGER
    },
    dealsPlayed: {
      type: Sequelize.INTEGER
    },
    sessionComment: {
      type: Sequelize.STRING
    },
    isComplete: {
      type: Sequelize.BOOLEAN
    }
  });

  return Session;
}
