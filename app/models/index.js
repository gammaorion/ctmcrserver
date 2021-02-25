const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tournaments = require("./tournament.model.js")(sequelize, Sequelize);
db.players = require("./player.model.js")(sequelize, Sequelize);
db.tournamentPlayers = require("./tournament-player.model.js")(sequelize, Sequelize);
db.sessions = require("./session.model.js")(sequelize, Sequelize);
db.sessionPlayers = require("./session-player.model.js")(sequelize, Sequelize);
db.deals = require("./deal.model.js")(sequelize, Sequelize);
db.dealPlayers = require("./deal-player.model.js")(sequelize, Sequelize);

db.tournaments.belongsToMany(db.players, { through: db.tournamentPlayers });
db.players.belongsToMany(db.tournaments, { through: db.tournamentPlayers });
db.tournamentPlayers.belongsTo(db.tournaments);
db.tournamentPlayers.belongsTo(db.players);

db.sessions.belongsTo(db.tournaments);

db.sessions.belongsToMany(db.players, { through: db.sessionPlayers });
db.players.belongsToMany(db.sessions, { through: db.sessionPlayers });
db.sessionPlayers.belongsTo(db.sessions);
db.sessionPlayers.belongsTo(db.players);

db.deals.belongsTo(db.sessions);
db.deals.hasOne(db.tournamentPlayers, { as: 'maxHandDeal' });

db.deals.belongsToMany(db.players, { through: db.dealPlayers });
db.players.belongsToMany(db.deals, { through: db.dealPlayers });
db.dealPlayers.belongsTo(db.deals);
db.dealPlayers.belongsTo(db.players);

module.exports = db;
