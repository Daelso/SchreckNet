const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = express();
let router = express.Router();
router.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Users = require("../models/Users");
const validator = require("validator");
const { sequelize } = require("../database");
const lib = require("../lib");
const mailer = require("../mailer");

// Compared against when the email is unknown; never matches a real login.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

//Route is base/user/

router.route("/currentUser").get(lib.authenticateToken, (req, res) => {
  return res.json(req.currentUser);
});

// Only these fields are safe to return from public endpoints.
const PUBLIC_USER_FIELDS = ["user_id", "username"];

router.route("/getUser/:id").get(async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      attributes: PUBLIC_USER_FIELDS,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/users").get(async (req, res) => {
  try {
    const users = await Users.findAll({ attributes: PUBLIC_USER_FIELDS });
    return res.status(200).send(users);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

//Below are various controller links
// Limits match the register / reset forms on the frontend.
const validateRegistration = ({ username, email, password }) => {
  if (typeof username !== "string" || typeof email !== "string") {
    return "Username and email are required";
  }
  const name = username.trim();
  if (name.length < 4 || name.length > 15) {
    return "Username must be 4 to 15 characters";
  }
  if (email.length > 64 || !validator.isEmail(email)) {
    return "Enter a valid email address";
  }
  return validatePassword(password);
};

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  // bcrypt ignores everything past 72 bytes.
  if (Buffer.byteLength(password, "utf8") > 72) {
    return "Password is too long";
  }
  return null;
};

router.route("/register").post(lib.emailLimiter, async (req, res) => {
  try {
    const problem = validateRegistration(req.body);
    if (problem) {
      return res.status(400).send(problem);
    }
    req.body.username = req.body.username.trim();

    // Hash first so every path below takes about the same time.
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Usernames are public, so saying one is taken leaks nothing.
    const nameTaken = await Users.findOne({
      where: { username: req.body.username },
      attributes: ["user_id"],
    });
    if (nameTaken) {
      return res.status(409).send("Username already taken");
    }

    // Emails are private: answer as if it worked and tell the owner instead.
    const emailOwner = await Users.findOne({
      where: { email: req.body.email },
      attributes: ["username", "email"],
    });
    if (emailOwner) {
      mailer.sendAccountExistsEmail(
        emailOwner.email,
        emailOwner.username,
        process.env.ENV === "DEV"
          ? "http://localhost:8080/passwordForgot"
          : "https://www.schrecknet.live/passwordForgot"
      );
      return res.status(200).send("User created successfully!");
    }

    const newUser = await Users.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      terms_accepted: req.body.acceptance,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const secret = process.env.ACTIVATION_TOKEN_SECRET + hashedPassword; //generates a new secret unique to a user.
    const payload = { username: req.body.username };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" }); //activation good for a week

    let activateLink = null;
    if (process.env.ENV === "DEV") {
      activateLink = `http://localhost:8080/activateAccount?token=${token}&username=${encodeURIComponent(
        req.body.username
      )}`;
    } else {
      activateLink = `https://www.schrecknet.live/activateAccount?token=${token}&username=${encodeURIComponent(
        req.body.username
      )}`;
    }

    mailer.sendActivationEmail(req.body.email, req.body.username, activateLink);

    return res.status(200).send("User created successfully!");
  } catch (err) {
    console.log(err);
    return res.status(403).send("Forbidden");
  }
});

router.route("/login").post(lib.limiter, async (req, res) => {
  try {
    if (
      typeof req.body.email !== "string" ||
      typeof req.body.password !== "string"
    ) {
      return res.status(401).send("Incorrect email or password!");
    }
    const user = await Users.findOne({ where: { email: req.body.email } });
    // Always run one bcrypt compare so unknown emails aren't faster to reject.
    const matches = await bcrypt.compare(
      req.body.password,
      user ? user.password : DUMMY_HASH
    );
    // Same answer for unknown email and wrong password.
    if (user && matches) {
      const userInfo = {
        id: user.user_id,
        username: user.username,
        email: user.email,
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
      return res.status(200).send("Logged in!");
    } else {
      return res.status(401).send("Incorrect email or password!");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
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
      if (err) return res.status(403).send("Invalid refresh token!");
      let newToken = jwt.sign(
        {
          username: user.username,
          email: user.email,
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
      return res.status(200).send(`Token refreshed`);
    }
  );
});

router.route("/logout").post((req, res) => {
  res.clearCookie("refresh");
  res.clearCookie("access");
  return res.sendStatus(204);
});

router.route("/passwordForgot").post(lib.emailLimiter, async (req, res) => {
  if (typeof req.body.email !== "string") {
    return res.sendStatus(400);
  }
  const resetUser = await Users.findOne({ where: { email: req.body.email } });
  // Always 200, so this can't be used to check which emails have accounts.
  if (resetUser === null) {
    return res.sendStatus(200);
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
    resetLink = `https://www.schrecknet.live/passwordReset/${resetUser.get(
      "user_id"
    )}?token=${token}`;
  }

  mailer.sendResetEmail(
    resetUser.get("email"),
    resetUser.get("username"),
    resetLink
  );
  return res.sendStatus(200);
});

router.route("/passwordReset/:user/:token").post(async (req, res) => {
  res.clearCookie("access");
  res.clearCookie("refresh");

  const resetUser = await Users.findByPk(req.params.user);
  if (resetUser === null) {
    return res.sendStatus(404);
  }

  const problem = validatePassword(req.body.password);
  if (problem) {
    return res.status(400).send(problem);
  }

  const secret = process.env.RESET_TOKEN_SECRET + resetUser.get("password");
  try {
    const payload = jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await resetUser.update({ password: hashedPassword });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send("Missing");
  }
  return res.sendStatus(200);
});

router.route("/activateAccount/:username/:token").post(async (req, res) => {
  const activationUser = await Users.findOne({
    where: { username: req.params.username },
  });
  if (activationUser === null) {
    return res.sendStatus(404);
  }
  const secret =
    process.env.ACTIVATION_TOKEN_SECRET + activationUser.get("password");
  try {
    const payload = jwt.verify(req.params.token, secret);

    await activationUser.update({ activated: 1 });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send("Missing");
  }
  res.clearCookie("access");
  res.clearCookie("refresh");
  return res.sendStatus(200);
});

router.route("/sendContactEmail").post(lib.limiter, async (req, res) => {
  try {
    mailer.sendContactForm(req.body);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failed to send contact");
  }
});

router
  .route("/resendActivation")
  .post(lib.emailLimiter, lib.authenticateToken, async (req, res) => {
    const activationUser = await Users.findOne({
      where: { username: req.currentUser.username },
    });
    const secret =
      process.env.ACTIVATION_TOKEN_SECRET + activationUser.password; //generates a new secret unique to a user.
    const payload = { username: req.currentUser.username };
    const token = jwt.sign(payload, secret, { expiresIn: "7d" }); //activation good for a week
    let activateLink = null;
    if (process.env.ENV === "DEV") {
      activateLink = `http://localhost:8080/activateAccount?token=${token}&username=${encodeURIComponent(
        req.currentUser.username
      )}`;
    } else {
      activateLink = `https://www.schrecknet.live/activateAccount?token=${token}&username=${encodeURIComponent(
        req.currentUser.username
      )}`;
    }
    try {
      mailer.sendActivationEmail(
        req.currentUser.email,
        req.currentUser.username,
        activateLink
      );
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Failed to send mail");
    }
  });

module.exports = router; //Exports our routes
