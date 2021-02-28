const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// initialize connection to DB
const db = require("./app/models");
db.sequelize.sync();

if (process.argv.length > 2) {
  if (process.argv[2] === 'testdata') {
    require("./testdataloader")(db);
  }
}
// for cleaning databases
/*
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});
*/

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to fctmserver application." });
});

require("./app/routes/tournament.routes")(app);
require("./app/routes/player.routes")(app);
require("./app/routes/tournament-player.routes")(app);
require("./app/routes/session.routes")(app);
require("./app/routes/protocol.routes")(app);
require("./app/routes/deal.routes")(app);
require("./app/routes/session-player.routes")(app);
require("./app/routes/deal-player.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8092;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
