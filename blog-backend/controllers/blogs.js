const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { Blog } = require("../models");
const { User } = require("../models");
const { SECRET } = require("../util/config");

//middleware for extracting the jwt-token from an incoming request
const tokenExtractor = (req, res, next) => {
  //token should be found from the authorization header
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    if (!req.decodedToken.id) {
      return res.status(401).json({ error: "token invalid" })
    }    
  } else {
    res.status(401).json({ error: "token missing" })
  }

  next();
}

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

router.post("/", tokenExtractor, async (req, res) => {
    try {
      const user = await User.findByPk(req.decodedToken.id);
    
      const blog = await Blog.create({ ...req.body, userId: user.id });
      return res.json(blog);
    } catch (error) {
      return res.status(400).json({ error: "we got rekt in the blogs post-handler" });
    }
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
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
