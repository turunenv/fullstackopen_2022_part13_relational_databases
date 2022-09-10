const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    }
  })

  const passwordCorrect = await bcrypt.compare(body.password, user.hashedPassword);
  if (!(user && passwordCorrect)) {
    //either user with given username was not found, or password was incorrect
    return res.status(401).send("username or password was incorrect");
  }
  //we are here so login was successful, send jsonwebtoken to the client
  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET);

  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
})

module.exports = router;