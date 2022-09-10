const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User } = require("../models");

//create a UserException object to be passed to
//the error handler when we run into problems
function UserException(message) {
  (this.message = message), (this.name = "UserException");
}

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    throw new UserException(
      "include name, username and password to create a new user"
    );
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ name, username, hashedPassword });
  res.json(user);
});

router.put("/:username", async (req, res) => {
  console.log("USERNAME URL PARAM IS", req.params.username)
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  console.log("** user is", user)

  if (!user) {
    throw new UserException("user does not exist");
  }
  if (!req.body.username) {
    throw new UserException("new username was not included")
  }

  user.username = req.body.username;
  await user.save();

  res.json(user);
});

module.exports = router;
