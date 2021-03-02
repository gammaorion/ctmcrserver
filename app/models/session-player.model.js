module.exports = (sequelize, Sequelize) => {
  const SessionPlayer = sequelize.define("sessionPlayer", {
    tournamentPoints: {
      type: Sequelize.FLOAT
    },
    gamePoints: {
      type: Sequelize.INTEGER
    },
    handsTaken: {
      type: Sequelize.INTEGER
    },
    wind: {  // see wind.dictionary
      type: Sequelize.STRING(6)
    }
  });

  // bindings to session and player are defined in index.js

  return SessionPlayer;
};
