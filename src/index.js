const express = require("express");
const config = require("./config");

const database = require("./service-files/database_service");

const authRouter = require("./auth/auth.router.api");
const transactionRouter = require("./transactions/transaction.router.api");

const errorHandler = require("./api-utils/error-handler");
const notFoundHandler = require("./api-utils/not-found-handler");

async function start() {
  console.log("connecting to database...");

  await database.initialize();

  console.log("database connected..");
  console.log("starting server..");

  const server = express();

  server.use(express.json());

  server.use("/auth", authRouter);  
  server.use("/transaction", transactionRouter);

  server.use(notFoundHandler);
  server.use(errorHandler);  

  server.listen(config.PORT_NUMBER, () => {
    console.log(`server is connected to port ${config.PORT_NUMBER}`);
  });
}

start();
