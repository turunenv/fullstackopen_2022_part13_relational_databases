const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next()
}

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.get("/:id", blogFinder, async(req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  } 
  res.json(404).end();
})

router.post("/", async (req, res) => {
    const blog = await Blog.create(req.body);
    return res.json(blog);
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  return res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    if (!req.body.likes) {
      throw new Error('missing like field')
    }
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
