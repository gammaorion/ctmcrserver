module.exports = (sequelize, Sequelize) => {
  const Deal = sequelize.define("deal", {
    dealNumber: {
      type: Sequelize.INTEGER
    },
    result: {   // a code value - see dealresult.dictionary
      type: Sequelize.INTEGER
    },
    handPoints: {
      type: Sequelize.INTEGER
    },
    dealComment: {
      type: Sequelize.STRING
    }
  });

  return Deal;
};
