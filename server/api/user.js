const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Users = require("../models/Users");
const { sequelize } = require("../database");
const lib = require("../lib");
const mailer = require("../mailer");

//Route is base/user/

router.route("/currentUser").get(lib.authenticateToken, (req, res) => {
  res.json(req.currentUser);
});

router.route("/users").get(async (req, res) => {
  Users.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => console.log(err));
});

//Below are various controller links
router.route("/register").post(async (req, res) => {
  try {
    //Encrypts the password.
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      terms_accepted: req.body.acceptance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const secret = process.env.ACTIVATION_TOKEN_SECRET + hashedPassword; //generates a new secret unique to a user.
    const payload = { username: req.body.username };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" }); //activation good for a week

    let activateLink = null;
    if (process.env.ENV === "DEV") {
      activateLink = `http://localhost:8080/activateAccount?token=${token}&username=${req.body.username}`;
    } else {
      activateLink = `https://wod-char-maker.herokuapp.com/activateAccount?token=${token}&username=${req.body.username}`;
    }

    mailer.sendActivationEmail(req.body.email, req.body.username, activateLink);

    res.status(200).send("User created successfully!");
  } catch (err) {
    res.status(403).send(err);
  }
});

router.route("/login").post(lib.limiter, async (req, res) => {
  //Authenticate users
  const user = await Users.findOne({ where: { email: req.body.email } });
  console.log(user.activated);
  if (user == null) {
    return res.status(400).send("Cannot find user!");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const userInfo = {
        id: user.user_id,
        username: user.username,
        email: user.email,
        age: user.age,
        activated: user.activated,
      };
      const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "5m",
      });

      const refreshToken = jwt.sign(
        userInfo,
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "90d",
        }
      );
      const accessCookie = await res.cookie("access", accessToken, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      const refreshCookie = await res.cookie("refresh", refreshToken, {
        maxAge: 7.884e9,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      res.status(200).send("Logged in!");
    } else {
      res.status(401).send("Incorrect email or password!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.route("/token").post(async (req, res) => {
  res.clearCookie("access");
  const refreshToken = req.cookies.refresh;

  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(403).send("Invalid refresh token!");
      let newToken = jwt.sign(
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

      const newCookie = await res.cookie("access", newToken, {
        maxAge: 300000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
      });
      res.status(200).send(`Token refreshed`);
    }
  );
});

router.route("/logout").post((req, res) => {
  res.clearCookie("refresh");
  res.clearCookie("access");
  console.log("cookies cleared");
  res.sendStatus(204);
});

router.route("/passwordForgot").post(async (req, res) => {
  const resetUser = await Users.findOne({ where: { email: req.body.email } });
  if (resetUser === null) {
    return res.sendStatus(404);
  }
  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password"); //generates a new secret unique to a user.
  const payload = { username: resetUser.get("user_id") };
  const token = jwt.sign(payload, secret, { expiresIn: "30m" }); //users get 30 mins to reset their account

  let resetLink = null;
  if (process.env.ENV === "DEV") {
    resetLink = `http://localhost:8080/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  } else {
    resetLink = `https://wod-char-maker.herokuapp.com/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  }

  mailer.sendResetEmail(req.body.email, resetUser.get("username"), resetLink);
  res.sendStatus(200);
});

router.route("/passwordReset/:user/:token").post(async (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");

  const resetUser = await Users.findByPk(req.params.user);
  if (resetUser === null) {
    return sendStatus(404);
  }

  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password");
  try {
    const payload = jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await resetUser.update({ password: hashedPassword });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
  res.sendStatus(200);
});

router.route("/passwordForgot").post(async (req, res) => {
  const resetUser = await Users.findOne({ where: { email: req.body.email } });
  if (resetUser === null) {
    return res.sendStatus(404);
  }
  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password"); //generates a new secret unique to a user.
  const payload = { username: resetUser.get("user_id") };
  const token = jwt.sign(payload, secret, { expiresIn: "30m" }); //users get 30 mins to reset their account

  let resetLink = null;
  if (process.env.ENV === "DEV") {
    resetLink = `http://localhost:8080/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  } else {
    resetLink = `https://wod-char-maker.herokuapp.com/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  }

  mailer.sendResetEmail(req.body.email, resetUser.get("username"), resetLink);
  res.sendStatus(200);
});

router.route("/activateAccount/:username/:token").post(async (req, res) => {
  const activationUser = await Users.findOne({
    where: { username: req.params.username },
  });
  if (activationUser === null) {
    return sendStatus(404);
  }
  const secret =
    process.env.ACTIVATION_TOKEN_SECRET + activationUser.get("password");
  try {
    const payload = jwt.verify(req.params.token, secret);

    await activationUser.update({ activated: 1 });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message);
  }
  res.clearCookie("access");
  res.clearCookie("refresh");
  res.sendStatus(200);
});

router.route("/sendContactEmail").post(lib.limiter, async (req, res) => {
  try {
    mailer.sendContactForm(req.body);
    res.sendStatus(200);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

router
  .route("/resendActivation")
  .post(lib.authenticateToken, async (req, res) => {
    const activationUser = await Users.findOne({
      where: { username: req.currentUser.username },
    });
    const secret =
      process.env.ACTIVATION_TOKEN_SECRET + activationUser.password; //generates a new secret unique to a user.
    const payload = { username: req.currentUser.username };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" }); //activation good for a week
    let activateLink = null;
    if (process.env.ENV === "DEV") {
      activateLink = `http://localhost:8080/activateAccount?token=${token}&username=${req.currentUser.username}`;
    } else {
      activateLink = `https://wod-char-maker.herokuapp.com/activateAccount?token=${token}&username=${req.currentUser.username}`;
    }
    try {
      mailer.sendActivationEmail(
        req.currentUser.email,
        req.currentUser.username,
        activateLink
      );
    } catch (err) {
      return res.status(400).send(err.message);
    }
  });

module.exports = router; //Exports our routes
