module.exports = (sequelize, Sequelize) => {
  const Tournament = sequelize.define("tournament", {
    title: {
      type: Sequelize.STRING
    },
    eventdate: {
      type: Sequelize.DATEONLY
    },
    place: {
      type: Sequelize.STRING
    },
    toursAmt: {
      type: Sequelize.INTEGER
    },
    tablesAmt: {
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.STRING
    },
    isComplete: {
      type: Sequelize.BOOLEAN
    }
  });

  return Tournament;
};
