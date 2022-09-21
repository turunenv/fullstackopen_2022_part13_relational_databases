const errorHandler = (error, req, res, next) => {
  console.log('trying to handle an error');
  console.log(error.message)

  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "invalid token" });
  } else if (error.name == "SequelizeDatabaseError") {
      return res
        .status(400)
        .json({ error: "attributes were not of the right type" });
  } else if (error.message === "missing like field") {
      return res.status(400).json({ error: error.message });
  } else if (error.name == "UserException") {
      return res.status(400).json({ error: error.message });
  } else if (error.message === "invalid token") {
      return res.status(403).json({ error: error.message });
  } else if (error.message === "token missing") {
      return res.status(403).json({ error: error.message });
  } else if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "field must be unique" });
  }
  next(error);
};

module.exports = {
  errorHandler,
};
