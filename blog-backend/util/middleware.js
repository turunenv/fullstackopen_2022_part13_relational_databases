const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

const { Session, User } = require("../models");

const errorHandler = (error, req, res, next) => {
  console.log("trying to handle an error");
  console.log("name of the error:", error.name);
  console.log("message:", error.message);
  console.log(error);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(403).json({ error: "invalid token" });
  } else if (error.name == "SequelizeDatabaseError") {
    return res
      .status(400)
      .json({ error: "attributes were not of the right type" });
  } else if (
    error.message ===
    "Cannot read properties of null (reading 'hashedPassword')"
  ) {
    return res.status(404).json({ error: "user not found" });
  } else if (error.message === "missing like field") {
    return res.status(400).json({ error: error.message });
  } else if (error.name == "UserException") {
    return res.status(400).json({ error: error.message });
  } else if (error.message === "invalid token") {
    return res.status(403).json({ error: error.message });
  } else if (error.message === "token missing") {
    return res.status(403).json({ error: error.message });
  } else if (
    error.message === "your account has been disabled, please contact an admin."
  ) {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ error: "field must be unique" });
  } else {
    return res.status(400).json({ error: "invalid request" });
  }
};

//middleware for extracting the jwt-token from an incoming request
const tokenExtractor = (req, res, next) => {
  //token should be found from the authorization header
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    throw Error("token missing");
  }

  next();
};

const checkSessionValidity = async (req, res, next) => {
  const userId = req.decodedToken.id;

  //can we find an entry from the sessions table for this user?
  const session = await Session.findOne({ where: { userId } });
  const user = await User.findOne({ where: { id: userId }});

  disabled = user.isDisabled;
  
  if (!session) {
    throw Error("please login to continue");
  } else if (disabled) {
      throw Error("your account has been disabled, please contact an admin.");
  }

  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
  checkSessionValidity,
};
