const router = require("express").Router();


const { Blog } = require("../models");
const { User } = require("../models");

const { Op } = require("sequelize");

const { tokenExtractor } = require("../util/middleware");

const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next()
}

router.get("/", async (req, res) => {
  //get the url search-parameter
  const search = req.query.search;
  console.log(`search is ${search}`);

  //a variable to be included in the Blog.findAll function call below
  let where = {};

  if (search) {
    //query included a search param for the title or author, include this in the where-object
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${search}%`
          }
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"]
    },
    //order by likes in descending order
    order: [
      ["likes", "DESC"]
    ],
    where,
  });
  res.json(blogs);
});

router.get("/:id", blogFinder, async(req, res) => {
  if (req.blog) {
    return res.json(req.blog);
  } 
  res.json(404).end();
})

router.post("/", tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  //does the blog being deleted exist?
  if (req.blog) {
    try {
      //is this user logged in, aka is the jsonwebtoken in the request?
      const user = await User.findByPk(req.decodedToken.id);
      //is the user the creator of the blog?
      if (user.id === req.blog.userId) {
        //deletion authorized
        await req.blog.destroy();
      } else {
        return res.status(401).send({ error: "unauthorized" });
      } 
    } catch (error) {
      res.status(401).send({ error })
    }
    return res.status(204).end();
  }
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
