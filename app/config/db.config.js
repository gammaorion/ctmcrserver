module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "stormyDwarf",
  DB: "thdctm03",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
