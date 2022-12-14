const express = require("express");
require("express-async-errors");
const { errorHandler } = require("./util/middleware");

const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readinglistRouter = require("./controllers/readinglists");

app.use(express.json());

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readinglistRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

start();
