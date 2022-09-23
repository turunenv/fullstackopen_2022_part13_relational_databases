const Blog = require("./blog");
const User = require("./user");
const UserBlogs = require("./userblogs");
const Session = require("./session");

//add the one-to-many relationship between the database tables 'users' and 'blogs'
User.hasMany(Blog);
Blog.belongsTo(User);

//session has a foreign key user, one-to-one relationship
User.hasOne(Session);
Session.belongsTo(User);

User.belongsToMany(Blog, { through: UserBlogs, as: "marked_blogs" });
Blog.belongsToMany(User, { through: UserBlogs, as: "users_marked" });

module.exports = {
  Blog,
  User,
  UserBlogs,
  Session,
};
