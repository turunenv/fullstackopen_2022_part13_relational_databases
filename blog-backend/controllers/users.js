const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User } = require("../models");
const { Blog } = require("../models");

//create a UserException object to be passed to
//the error handler when we run into problems
function UserException(message) {
  (this.message = message), (this.name = "UserException");
}

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: Blog,
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  //object to store the possible read-filter
  let where = {};

  if (req.query.read) {
    if (["true", "false"].includes(req.query.read)) {
      where.read = req.query.read === "true" ? true : false;
    }
  }
  console.log(where);

  const user = await User.findByPk(id, {
    include: [
      {
        model: Blog,
        as: "marked_blogs",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: { attributes: ["id", "read"], where},
  
      },
    ],
    attributes: { exclude: ["id", "hashedPassword", "createdAt", "updatedAt"] },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
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
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });

  if (!user) {
    throw new UserException("user does not exist");
  }
  if (!req.body.username) {
    throw new UserException("new username was not included");
  }

  user.username = req.body.username;
  await user.save();

  res.json(user);
});

module.exports = router;
