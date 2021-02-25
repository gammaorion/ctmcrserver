module.exports = (sequelize, Sequelize) => {
  const DealPlayer = sequelize.define("dealPlayer", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gamePoints: {
      type: Sequelize.INTEGER
    },
    article: {   // a code really - see article.dictionary
      type: Sequelize.INTEGER
    },
    comment: {
      type: Sequelize.STRING
    }
  });

  // bindings to deal and player are defined in index.js

  return DealPlayer;
};
