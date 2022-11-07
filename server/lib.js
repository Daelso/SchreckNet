const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

//Other imports above

const limiter = rateLimit({
  windowMs: 900000, //15 min
  max: 5, //login attempts
  message: "Rate limit exceeded, please wait 15 minutes and try again!",
});

const authenticateToken = (req, res, next) => {
  let token = req.cookies.access;
  if (token == null) {
    const refreshToken = req.cookies.refresh;
    if (refreshToken == null) {
      return res.sendStatus(401);
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) return res.sendStatus(403).send("Invalid refresh token!");
          token = jwt.sign(
            {
              username: user.username,
              email: user.email,
              age: user.age,
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

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.send(err);
    req.currentUser = user;
    next();
  });
};

module.exports = { authenticateToken, limiter };
