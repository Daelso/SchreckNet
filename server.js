const express = require("express"),
  serveStatic = require("serve-static"),
  history = require("connect-history-api-fallback"),
  port = process.env.PORT || 5000;
const compression = require("compression");
const helmet = require("helmet");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
app.use(compression());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // disable COEP
    crossOriginOpenerPolicy: false, // disable COOP
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://pagead2.googlesyndication.com",
          "https://www.googletagservices.com",
          "https://static.cloudflareinsights.com", // ✅ Cloudflare script
          "https://ep2.adtrafficquality.google", // ✅ Google Ad Sodar script
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://i.imgur.com",
          "https://media.discordapp.net",
          "https://cdn.discordapp.com",
          "https://tenor.com",
          "https://media.tenor.com",
          "https://unsplash.com",
          "https://images.unsplash.com",
          "https://*.googlesyndication.com",
          "https://*.doubleclick.net",
        ],
        fontSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "https://googleads.g.doubleclick.net",
          "https://tpc.googlesyndication.com",
          "https://pagead2.googlesyndication.com",
          "https://ep1.adtrafficquality.google",
        ],
        frameSrc: [
          "'self'",
          "https://googleads.g.doubleclick.net",
          "https://tpc.googlesyndication.com",
          "https://www.google.com", // for reCAPTCHA iframe
          "https://ep2.adtrafficquality.google", // for Sodar iframe
          "https://www.google.com/recaptcha/api2/aframe", // for recaptcha iframe
          "https://ep2.adtrafficquality.google/sodar/sodar2",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cookieParser());

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
app.set("trust proxy", 1);

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
