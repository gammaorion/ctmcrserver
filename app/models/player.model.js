module.exports = (sequelize, Sequelize) => {
  const Player = sequelize.define("player", {
    surname: {
      type: Sequelize.STRING
    },
    firstname: {
      type: Sequelize.STRING
    },
    patronymic: {
      type: Sequelize.STRING
    },
    living: {
      type: Sequelize.STRING
    },
    comment: {
      type: Sequelize.STRING
    },
    isReplacer: {
      type: Sequelize.BOOLEAN
    }
  });

  return Player;
};
