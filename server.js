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
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
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
          "https://fundingchoicesmessages.google.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
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
          "https://ep1.adtrafficquality.google",
          "https://lh3.googleusercontent.com",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.googleapis.com",
          "https://fonts.gstatic.com",
        ],
        connectSrc: [
          "'self'",
          "https://googleads.g.doubleclick.net",
          "https://tpc.googlesyndication.com",
          "https://pagead2.googlesyndication.com",
          "https://ep1.adtrafficquality.google",
          "https://fundingchoicesmessages.google.com",
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

// Per-character <head> for shared links; must run before the SPA fallback.
app.use(require("./server/sharePreview"));

app.use(history());
// Built files with a content hash in the name (app.1068dbee.js) never change,
// so browsers and Cloudflare can keep them for a year. index.html must be
// rechecked on every load so a deploy is picked up right away.
const HASHED_ASSET =
  /[\\/](js|css|fonts|img)[\\/][^\\/]+\.[0-9a-f]{8}\.[a-z0-9]+$/;
app.use(
  serveStatic(__dirname + "/dist/spa", {
    setHeaders(res, filePath) {
      if (HASHED_ASSET.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);
app.use(express.json());

const lib = require("./server/lib"); //This is all custom functions
//for dev use only, very insecure in a prod env, this is just to prevent CORS errors. Origin is your vue clients port

const allowedOriginsDev = ["http://localhost:8080"];
const allowedOriginsProd = ["https://schrecknet-live.herokuapp.com"];

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

app.use(
  lib.rejectCrossSiteWrites(
    process.env.ENV !== "prod" ? allowedOriginsDev : allowedOriginsProd
  )
);

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
const gameFinderRoutes = require("./server/api/game_finder");
app.use("/game_finder", gameFinderRoutes);
const gameRoutes = require("./server/api/games");
app.use("/games", lib.authenticateToken, gameRoutes);
const charFolders = require("./server/api/char_folders");
app.use("/char_folders", lib.authenticateToken, charFolders);
//Uses userRoutes file to handle all user related endpoints

//Below are various controller links

// Express 4 doesn't catch errors thrown in async route handlers, and Node
// exits on an unhandled rejection by default. Log it instead of going down.
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

app.listen(process.env.PORT || 5000, function () {
  console.log(`Server started on port ${port}`);
});
