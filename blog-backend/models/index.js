const Blog = require("./blog");
const User = require("./user");


//add the one-to-many relationship between the database tables 'users' and 'blogs'
User.hasMany(Blog);
Blog.belongsTo(User);

module.exports = {
  Blog,
  User,
};
