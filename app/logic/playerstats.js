/**
 * Collecting player statistics from tournaments
 * Assuming that data are already in the DB and they are correct
 * It is just selecting figures, not saving them into DB
 *
 * This class is for usage from protocol.controller and from player's stats show
 */

const articles = require("../share/article.dictionary");

class PlayerStats {
  constructor(dbConnect, tourArr) {
    this.dbConnect = dbConnect;
    this.tourArray = tourArr;
    this.sessionArray = [];
    this.dealArray = [];
  }

  async init() {
    const allSessions = await this.dbConnect.sessions.findAll({
      where: { tournamentId: { [this.dbConnect.Sequelize.Op.in]: this.tourArray } },
      attributes: ['id']
    });

    this.sessionArray = this.makePlainArray(allSessions, 'id');

    const allDeals = await this.dbConnect.deals.findAll({
      where: { sessionId: { [this.dbConnect.Sequelize.Op.in]: this.sessionArray } },
      attributes: ['id']
    });

    this.dealArray = this.makePlainArray(allDeals, 'id');
  }

  async getMainStats(playerId) {
    const mainStats = await this.dbConnect.sessionPlayers.findOne({
      where: { sessionId: { [this.dbConnect.Sequelize.Op.in]: this.sessionArray }, playerId: playerId },
      attributes: [
        'playerId',
        [this.dbConnect.Sequelize.fn('sum', this.dbConnect.Sequelize.col('gamePoints')), 'gamePoints'],
        [this.dbConnect.Sequelize.fn('sum', this.dbConnect.Sequelize.col('tournamentPoints')), 'tournamentPoints'],
        [this.dbConnect.Sequelize.fn('sum', this.dbConnect.Sequelize.col('handsTaken')), 'totalHandsTaken']
      ],
      raw: true
    });

    mainStats.gamePoints = parseInt(mainStats.gamePoints, 10);
    mainStats.tournamentPoints = parseInt(mainStats.tournamentPoints, 10);
    mainStats.totalHandsTaken = parseInt(mainStats.totalHandsTaken, 10);

    return mainStats;
  }

  async getSelvesTaken(playerId) {
    return this._getCountForCode(playerId, articles.SELFWIN);
  }

  async getPassiveLosses(playerId) {
    return this._getCountForCode(playerId, articles.PASSIVELOSS);
  }

  async getFeeds(playerId) {
    return this._getCountForCode(playerId, articles.DISCARDFEED);
  }

  async getDraws(playerId) {
    return this._getCountForCode(playerId, articles.DRAW);
  }

  async getOtherSelvesLosses(playerId) {
    return this._getCountForCode(playerId, articles.SELFLOSS);
  }

  async getAveragePointsTaken(playerId) {
    return this._getAverageForCode(playerId, [articles.SELFWIN, articles.DISCARDWIN]);
  }

  async getAverageFeeds(playerId) {
    return this._getAverageForCode(playerId, [articles.DISCARDFEED]);
  }

  async getAverageOSLosses(playerId) {
    return this._getAverageForCode(playerId, [articles.SELFLOSS]);
  }

  async getMaxFeed(playerId) {
    return this._getMaxForCode(playerId, articles.DISCARDFEED);
  }

  async getMaxOSLoss(playerId) {
    return this._getMaxForCode(playerId, articles.SELFLOSS);
  }

  async getSecondaryStats(playerId) {
    const handDeals = await this.dbConnect.dealPlayers.findAll({
      where: {
        dealId: { [this.dbConnect.Sequelize.Op.in]: this.dealArray },
        playerId: playerId,
        article: { [this.dbConnect.Sequelize.Op.in]: [articles.DISCARDWIN, articles.SELFWIN] }
      },
      attributes: [
        'dealId'
      ]
    });

    const winDeals = this.makePlainArray(handDeals, 'dealId');

    const maxHandRow = await this.dbConnect.deals.findOne({
      where: { id: { [this.dbConnect.Sequelize.Op.in]: winDeals } },
      attributes: [
        'id', 'handPoints'
      ],
      order: [ ['handPoints', 'DESC'] ]
    });

    const averHand = await this.dbConnect.deals.findOne({
      where: { id: { [this.dbConnect.Sequelize.Op.in]: winDeals } },
      attributes: [
        [this.dbConnect.Sequelize.fn('avg', this.dbConnect.Sequelize.col('handPoints')), 'aver']
      ],
      raw: true
    });

    maxHandRow.averHand = parseFloat(averHand.aver);

    // calculating max in a row
    const dealNumbers = await this.dbConnect.deals.findAll({
      where: { id: { [this.dbConnect.Sequelize.Op.in]: winDeals } },
      attributes: [
        'dealNumber', 'sessionId'
      ],
      order: [ ['sessionId', 'ASC'], ['dealNumber', 'ASC'] ]
    });

    let currentMax = 1;
    let currentCount = 1;

    for (let i = 1; i < dealNumbers.length; ++i) {
      if (dealNumbers[i].sessionId != dealNumbers[i-1].sessionId ||
        (dealNumbers[i].dealNumber - dealNumbers[i-1].dealNumber > 1)) {
        if (currentMax < currentCount) {
          currentMax = currentCount;
        }

        currentCount = 1;
      } else {
        currentCount += 1;
      }
    }

    if (currentMax < currentCount) {
      currentMax = currentCount;
    }

    maxHandRow.maxWinRow = currentMax;

    return maxHandRow;
  }

  async _getCountForCode(playerId, articleCode) {
    let result = await this.dbConnect.dealPlayers.findOne({
      where: { dealId: { [this.dbConnect.Sequelize.Op.in]: this.dealArray }, playerId: playerId, article: articleCode },
      attributes: [
        [this.dbConnect.Sequelize.fn('count', this.dbConnect.Sequelize.col('id')), 'cnt']
      ],
      raw: true
    });

    return parseInt(result['cnt'], 10);
  }

  async _getAverageForCode(playerId, codesArr) {
    let result = await this.dbConnect.dealPlayers.findOne({
      where: { dealId: { [this.dbConnect.Sequelize.Op.in]: this.dealArray }, playerId: playerId, article: { [this.dbConnect.Sequelize.Op.in]: codesArr } },
      attributes: [
        [this.dbConnect.Sequelize.fn('avg', this.dbConnect.Sequelize.col('gamePoints')), 'aver']
      ],
      raw: true
    });

    return parseFloat(result['aver']);
  }

  async _getMaxForCode(playerId, code) {
    let sortOrder = 'DESC';
    let negativeCodes = [ articles.DISCARDFEED, articles.SELFLOSS, articles.PASSIVELOSS ];

    if (negativeCodes.indexOf(code) !== -1) {
      sortOrder = 'ASC';
    }

    let result = await this.dbConnect.dealPlayers.findOne({
      where: { dealId: { [this.dbConnect.Sequelize.Op.in]: this.dealArray }, playerId: playerId, article: code },
      attributes: [
        'gamePoints'
      ],
      order: [ ['gamePoints', sortOrder] ]
    });

    return result.gamePoints;
  }

  makePlainArray(arr, prop) {
    let result = [];

    for (let i = 0; i < arr.length; ++i) {
      result.push(arr[i][prop]);
    }

    return result;
  }
}

module.exports = PlayerStats;
