const Blog = require("./blog");
const User = require("./user");
const UserBlogs = require("./userblogs");


//add the one-to-many relationship between the database tables 'users' and 'blogs'
User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: UserBlogs, as: "marked_blogs" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_marked" })

module.exports = {
  Blog,
  User,
  UserBlogs,
};
