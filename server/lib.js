const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

//Other imports above

const limiter = rateLimit({
  windowMs: 900000, //15 min
  max: 5, //login attempts
  message: "Rate limit exceeded, please wait 15 minutes and try again!",
});

const postLimiter = rateLimit({
  windowMs: 300000, //15 min
  max: 20, //login attempts
  message: "Rate limit exceeded, please wait 15 minutes and try again!",
});

const getLimiter = rateLimit({
  windowMs: 300000, //5 min
  max: 450, //attempts
  message: "Rate limit exceeded, please wait 5 minutes and try again!",
});

const authenticateToken = async (req, res, next) => {
  let token = req.cookies.access;

  if (!token) {
    const refreshToken = req.cookies.refresh;
    if (!refreshToken) {
      return res.sendStatus(401); // Unauthorized, no refresh token
    }

    try {
      const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      token = jwt.sign(
        {
          username: user.username,
          email: user.email,
          id: user.id,
          activated: user.activated,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      res.cookie("access", token, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });

      req.currentUser = user;
      return next(); // Stop execution and move to the next middleware
    } catch (err) {
      return res.status(403).send("Invalid refresh token!");
    }
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403); // Forbidden, invalid token
    }
    req.currentUser = user;
    next();
  });
};

const getCurrentUser = (req, res) => {
  let token = req.cookies.access;

  if (token == null) {
    const refreshToken = req.cookies.refresh;
    if (refreshToken == null) {
      return null;
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            req.currentUser = null;
          }
          token = jwt.sign(
            {
              username: user.username,
              email: user.email,
              id: user.id,
              activated: user.activated,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
          );

          const newCookie = await res.cookie("access", token, {
            maxAge: 300000,
            secure: true,
            httpOnly: true,
            sameSite: "None",
          });
          req.currentUser = user;
        }
      );
    }
  }

  let currentUser = "";
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    currentUser = user;
  });
  return currentUser;
};

module.exports = {
  authenticateToken,
  getCurrentUser,
  limiter,
  postLimiter,
  getLimiter,
};
