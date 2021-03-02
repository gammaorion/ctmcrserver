// this is a specific method that involves many tables
//  (unlike all other calls)

const db = require("../models");
const Session = db.sessions;
const SessionPlayer = db.sessionPlayers;
const Deal = db.deals;
const DealPlayer = db.dealPlayers;
const Op = db.Sequelize.Op;

exports.saveProtocol = async (req, res) => {
  // req.body structure:
  //  - sessionPlayers: Array
  //  -- playerId
  //  -- sessionId
  //  -- wind
  //  -- gamePoints
  //  -- tourPoints
  //  -- handsTaken
  //  - dealActions: Array
  //  -- handPoints
  //  -- result (code)
  //  -- dealNumber
  //  -- sessionId
  //  -- players: Array (needs also dealId)
  //  --- article (code)
  //  --- gamePoints
  //  --- playerId
  //  --- comment

  const sessionId = req.params.sessionId;
  const sessionPlayers = req.body.sessionPlayers;
  const dealActions = req.body.dealActions;

  let wholeUpdate;

  try {
    wholeUpdate = await db.sequelize.transaction();

    let removePrevPlayers = await SessionPlayer.destroy({ where: { sessionId: sessionId }, transaction: wholeUpdate });

    console.log("Removed previous records for session players: " + removePrevPlayers);

    for (let i = 0; i < sessionPlayers.length; ++i) {
      await SessionPlayer.create(sessionPlayers[i], { transaction: wholeUpdate });
    }

    const prevDeals = await Deal.findAll({ where: { sessionId: sessionId }, order: [[ 'dealNumber', 'ASC' ]], transaction: wholeUpdate });

    if (prevDeals.length > dealActions.length) {
      // if new deals array is shorter, remove all excessive records
      console.log("removing excessive deals: " + (prevDeals.length - dealActions.length));
      let removePrevDealPlayers = 0;
      for (let j = dealActions.length; j < prevDeals.length; ++j) {
        console.log("obsolete deal id: " + prevDeals[j].id);
        removePrevDealPlayers += await DealPlayer.destroy({ where: { dealId: prevDeals[j].id }, transaction: wholeUpdate });
      }
      let removePrevDeals = await Deal.destroy({ where: { sessionId: sessionId, dealNumber: { [Op.gt]: dealActions.length} }, transaction: wholeUpdate });
      console.log("Removed previous records for deal players: " + removePrevDealPlayers);
      console.log("Removed previous records for deals: " + removePrevDeals);
    }

    for (let i = 0; i < dealActions.length; ++i) {
      let currentDeal;
      let dealsFound = await Deal.findAll({
        where: { sessionId: sessionId, dealNumber: dealActions[i].dealNumber },
        transaction: wholeUpdate
      });

      if (dealsFound.length > 1) {
        throw "Too many deals for number " + dealActions[i].dealNumber;
      } else if (dealsFound.length === 1) {
        currentDeal = dealsFound[0];
        await Deal.update({
          handPoints: dealActions[i].handPoints,
          result: dealActions[i].result,
          dealComment: dealActions[i].dealComment || ''
        }, {
          where: { id: currentDeal.id },
          transaction: wholeUpdate
        })
      } else {
        currentDeal = await Deal.create({
          sessionId: sessionId,
          dealNumber: dealActions[i].dealNumber,
          handPoints: dealActions[i].handPoints,
          result: dealActions[i].result,
          dealComment: dealActions[i].dealComment || ''
        }, { transaction: wholeUpdate });
      }

      let updatedDealPlayers = [];

      for (let j = 0; j < dealActions[i].players.length; ++j) {
        let currentDealPlayer;
        let dpsFound = await DealPlayer.findAll({
          where: { dealId: currentDeal.id, playerId: dealActions[i].players[j].playerId },
          transaction: wholeUpdate
        });

        if (dpsFound.length > 1) {
          // todo: consider records about penalties
          throw "Too many deal players for number " + dealActions[i].dealNumber + " and player id " + dealActions[i].players[j].playerId;
        } else if (dpsFound.length === 1) {
          currentDealPlayer = dpsFound[0];
          await DealPlayer.update({
            gamePoints: dealActions[i].players[j].gamePoints,
            article: dealActions[i].players[j].article,
            comment: dealActions[i].players[j].comment || ''
          }, {
            where: { id: currentDealPlayer.id },
            transaction: wholeUpdate
          })
        } else {
          currentDealPlayer = await DealPlayer.create({
            dealId: currentDeal.id,
            playerId: dealActions[i].players[j].playerId,
            gamePoints: dealActions[i].players[j].gamePoints,
            article: dealActions[i].players[j].article,
            comment: dealActions[i].players[j].comment || ''
          }, { transaction: wholeUpdate });
        }

        updatedDealPlayers.push(currentDealPlayer.id);
      }

      let removeObsolete = await DealPlayer.destroy({
        where: { dealId: currentDeal.id, id: { [Op.notIn]: updatedDealPlayers } },
        transaction: wholeUpdate
      });

      console.log("Removed obsolete deal players: " + removeObsolete);
    }

    await Session.update({
      dealsPlayed: dealActions.length
    }, {
      where: { id: sessionId },
      transaction: wholeUpdate
    });

    await wholeUpdate.commit();

    res.send({
      message: "Protocol saved successfully"
    });
  } catch (err) {
    await wholeUpdate.rollback();
    res.status(500).send({
      message: err.message || ("Could not save protocol with id=" + sessionId)
    });
  }
};
