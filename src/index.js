// Importing the necessary modules and configurations.
const express = require("express");
const config = require("./config");

const database = require("./service-files/database_service");

//Importing all the different routers.
const authRouter = require("./auth/auth.router.api");
const portfolioRouter = require("./portfolio/portfolio.router.api");
const transactionRouter = require("./transactions/transaction.router.api");

//Importing the middleware for error handling and other non-specified routes. 
const errorHandler = require("./api-utils/error-handler");
const notFoundHandler = require("./api-utils/not-found-handler");

async function start() {
  console.log("connecting to database...");
  
  //Initializing the database.
  await database.initialize();

  console.log("database connected..");
  console.log("starting server..");

  //creating an instance of express.
  const server = express();

  //Middleware for parsing json requests.
  server.use(express.json());

  //router related to authentication.
  server.use("/auth", authRouter);

  // router related to portfolio.
  server.use("/portfolio", portfolioRouter);
  
  //router related to transaction.
  server.use("/transaction", transactionRouter);

  //middleware to handle the non-specified routes.
  server.use(notFoundHandler);

  //middleware to handle all the errors.
  server.use(errorHandler);  

  //start the server and listen on the port.
  server.listen(config.PORT_NUMBER, () => {
    console.log(`server is connected to port ${config.PORT_NUMBER}`);
  });
}

start();
