const router = require("express").Router();

const { User } = require("../models");
const { Blog } = require("../models");

const sequelize = require("sequelize");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    group: "author",
    order: [["likes", "DESC"]],
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("id")), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"]
    ]
  })

  res.json(blogs)
});

module.exports = router;
