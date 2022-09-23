const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session");

const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.hashedPassword
  );
  if (!(user && passwordCorrect)) {
    //either user with given username was not found, or password was incorrect
    return res.status(401).send("username or password was incorrect");
  }
  //we are here so login was successful, send jsonwebtoken to the client
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  //login was successful, store entry into the sessions table, if it doesnt exist already
  await Session.findOrCreate({
    where: { userId: user.id },
    defaults: { userId: user.id },
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

//delete-request to /api/login handles logout
router.delete("/", tokenExtractor, async (req, res) => {
  const userId = req.decodedToken.id;

  await Session.destroy({ where: { userId } });

  res.status(200).send();
});

module.exports = router;
