const router = require("express").Router();

const { UserBlogs } = require("../models");

const { tokenExtractor } = require("../util/middleware");

router.post("/", async (req, res) => {
  const userBlog = req.body;

  const newUserBlog = await UserBlogs.create(userBlog);
  res.json(newUserBlog);
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  const userId = req.decodedToken.id;
 
  const userBlog = await UserBlogs.findByPk(req.params.id);
  if (!userBlog) {
    return res
      .status(404)
      .json({ error: "entry on readinglist does not exist" });
  }

  const allowedAction = userId === userBlog.userId;

  // console.log(`userId: ${userId} - ${typeof userId}`)
  // console.log(`userBlog.userId: ${userBlog.userId} - ${typeof userBlog.userId}`)

  if (!allowedAction) {
    return res.status(403).json({ error: "unauthorized" });
  }
  
  if (!(req.body.read === true)) {
    return res.status(400).json({ error: "include read:true in the request body"});
  }
  userBlog.update({ read: req.body.read });
  await userBlog.save();
   

  res.status(200).json(userBlog);
});

module.exports = router;
