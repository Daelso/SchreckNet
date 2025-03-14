const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback"),
  port = process.env.PORT || 5000;
const compression = require("compression");
const helmet = require("helmet");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(compression());
app.use(helmet());

app.use(history());
app.use(serveStatic(__dirname + "/dist/spa"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
const lib = require("./server/lib"); //This is all custom functions
//for dev use only, very insecure in a prod env, this is just to prevent CORS errors. Origin is your vue clients port

const allowedOriginsDev = [
  "http://localhost:8080",
  "https://pagead2.googlesyndication.com",
];
const allowedOriginsProd = [
  "https://schrecknet-live.herokuapp.com",
  "https://daelso.github.io",
  "https://pagead2.googlesyndication.com",
];

app.use(lib.getLimiter);

if (process.env.ENV !== "prod") {
  app.use(
    cors({
      origin: allowedOriginsDev,
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
} else {
  app.use(
    cors({
      origin: allowedOriginsProd,
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
}

//Above is library imports, below begin route imports

const userRoutes = require("./server/api/user");
app.use("/user", userRoutes);
const vampireRoutes = require("./server/api/vampires");
app.use("/vampires", vampireRoutes);
const hunterRoutes = require("./server/api/hunters");
app.use("/hunters", hunterRoutes);
const favoriteRoutes = require("./server/api/favorites");
app.use("/favorites", favoriteRoutes);
const searchRoutes = require("./server/api/search");
app.use("/search", searchRoutes);
const garouRoutes = require("./server/api/garou");
app.use("/garou", garouRoutes);
// const ladRoutes = require("./server/api/showlads");
// app.use("/showlads", ladRoutes); /////dead and gonneeee, dead and goneeee
const gameFinderRoutes = require("./server/api/game_finder");
app.use("/game_finder", gameFinderRoutes);
const gameRoutes = require("./server/api/games");
app.use("/games", lib.authenticateToken, gameRoutes);
//Uses userRoutes file to handle all user related endpoints

//Below are various controller links

app.listen(process.env.PORT || 5000, function () {
  console.log(`Server started on port ${port}`);
});
