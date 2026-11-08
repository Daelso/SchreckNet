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

// Limits routes that send email (register, forgot password, resend activation).
const emailLimiter = rateLimit({
  windowMs: 900000, //15 min
  max: 10,
  message: "Too many requests, please wait 15 minutes and try again!",
});

const setAccessCookie = (res, user) => {
  const token = jwt.sign(
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
};

// Returns the logged-in user, or null. Never sends a response, so routes that
// allow anonymous traffic can call it safely. Falls back to the refresh cookie
// and reissues the access cookie when needed.
const getCurrentUser = (req, res) => {
  const { access, refresh } = req.cookies || {};

  if (access) {
    try {
      return jwt.verify(access, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      // Expired or invalid: try the refresh token below.
    }
  }

  if (!refresh) return null;

  try {
    const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
    setAccessCookie(res, user);
    return user;
  } catch (err) {
    return null;
  }
};

const ALLOWED_IMAGE_HOSTS = ["i.imgur.com", "imgur.com"];

// Character portraits: https imgur image links only, anything else is dropped.
const sanitizeImageLink = (urlString) => {
  try {
    const url = new URL(urlString);
    const isImageFile = /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);
    if (
      url.protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.includes(url.hostname) &&
      isImageFile
    ) {
      return url.toString();
    }
    return null;
  } catch (err) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  getCurrentUser,
  sanitizeImageLink,
  limiter,
  postLimiter,
  getLimiter,
  emailLimiter,
};
