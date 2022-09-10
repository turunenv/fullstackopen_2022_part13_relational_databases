const express = require("express");
require("express-async-errors");
const { errorHandler } = require("./middleware/middleware")

const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
