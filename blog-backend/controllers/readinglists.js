const router = require("express").Router();

const { UserBlogs } = require("../models");
const { Blog } = require("../models");

const tokenExtractor = require("../util/middleware");

router.post("/", async (req, res) => {
  const userBlog = req.body;

  const newUserBlog = await UserBlogs.create(userBlog);
  res.json(newUserBlog);
});

router.put("/:id", async (req, res) => {
  const user = await User
})

module.exports = router;
