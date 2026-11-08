const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Users = require("./models/Users");

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

// Blocks the route unless the caller is logged in.
const authenticateToken = async (req, res, next) => {
  const user = await getCurrentUser(req, res);
  if (!user) {
    return res.sendStatus(401);
  }
  req.currentUser = user;
  return next();
};

// Use after authenticateToken. Reads the DB rather than the token, because a
// token issued before activation still says activated: 0.
const requireActivated = async (req, res, next) => {
  try {
    const row = await Users.findByPk(req.currentUser.id, {
      attributes: ["activated"],
    });
    if (!row || row.activated !== 1) {
      return res
        .status(403)
        .send(
          "Activate your account to post or update game listings. Use the link we emailed you, or re-send it from the homepage."
        );
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
};

// Limits routes that send email (register, forgot password, resend activation).
const emailLimiter = rateLimit({
  windowMs: 900000, //15 min
  max: 10,
  message: "Too many requests, please wait 15 minutes and try again!",
});

// Activation asks for the sign-up password; this caps guessing.
const activationLimiter = rateLimit({
  windowMs: 900000, //15 min
  max: 10,
  message: "Too many attempts, please wait 15 minutes and try again!",
});

// Same options on set and clear, or browsers keep the old cookie.
const COOKIE_OPTIONS = { secure: true, httpOnly: true, sameSite: "None" };

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
  res.cookie("access", token, { ...COOKIE_OPTIONS, maxAge: 300000 });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access", COOKIE_OPTIONS);
  res.clearCookie("refresh", COOKIE_OPTIONS);
};

// A refresh token stays valid only while its tv matches the user's
// token_version. Tokens issued before token_version existed count as 0.
const refreshTokenIsCurrent = async (payload) => {
  const row = await Users.findByPk(payload.id, {
    attributes: ["token_version"],
  });
  return Boolean(row) && row.token_version === (payload.tv ?? 0);
};

// Returns the logged-in user, or null. Never sends a response, so routes that
// allow anonymous traffic can call it safely. Falls back to the refresh cookie
// and reissues the access cookie when needed.
const getCurrentUser = async (req, res) => {
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
    if (!(await refreshTokenIsCurrent(user))) {
      clearAuthCookies(res);
      return null;
    }
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
  requireActivated,
  getCurrentUser,
  sanitizeImageLink,
  limiter,
  postLimiter,
  getLimiter,
  emailLimiter,
  activationLimiter,
  COOKIE_OPTIONS,
  setAccessCookie,
  clearAuthCookies,
};
