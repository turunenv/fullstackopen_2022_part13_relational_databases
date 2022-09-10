const Blog = require("./blog");
const User = require("./user");

Blog.sync();
User.sync();

//add the one-to-many relationship between the database tables 'users' and 'blogs'
User.hasMany(Blog);
Blog.belongsTo(User);
Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = {
  Blog,
  User,
};
