const router = require("express").Router();

const{ UserBlogs } = require("../models");

router.post("/", async (req, res) => {
  const userBlog = req.body;

  const newUserBlog = await UserBlogs.create(userBlog);
  res.json(newUserBlog);
});

module.exports = router;
