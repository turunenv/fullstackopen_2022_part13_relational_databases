const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({ error:"make sure to include all required fields" });
  } else if (error.name == "SequelizeDatabaseError") {
    return res.status(400).send({ error: "attributes were not of the right type" });
  } else if (error.message === "missing like field") {
    return res.status(400).send({ error: error.message })
  } else if (error.name == "UserException") {
    return res.status(400).send({ error: error.message })
  } else if (error.name === "SequelizeUniqueConstraintError")  {
    return res.status(400).send({ error: "field must be unique" })
  }

  

  
};

module.exports = {
  errorHandler,
};
