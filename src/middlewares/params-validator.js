// Importing the necessary module for handling request errors
const httpError = require("http-errors");

// middleware function for validating the required params 
const createParamsValidator =
(params = [], paramskey) =>
  (req, res, next) => {
    // getting the params from the req object based on the provided key
    const reqParams = Reflect.get(req, paramskey);

    // Filtering out the missing parameters
    const missingParams = params.filter((param) => {
      // Specific condition for 'asset' and 'price' params
      if (param === "asset" || param === "price") {
        // Checking if the type is 'buy' or 'sell', then validate the presence of the params
        if (
          req[paramskey]["type"] === "buy" ||
          req[paramskey]["type"] === "sell"
        ) {
          return !Reflect.has(reqParams, param);
        }
      } else {
        // For other parameters, validate the presence of the params.
        return !Reflect.has(reqParams, param);
      }
    });
    
    // If missing params, throw a bad request error
    if (missingParams.length > 0) {
      throw new httpError.BadRequest(
        `Required fields '${missingParams.join(
          ","
        )}' are missing from '${paramskey}'`
      );
    }

    // calling the next middleware, if all the required params are present
    next();
  };

// param keys for the request object  
const PARAM_KEY = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
};

// exporting the functions to be used by other modules
module.exports = { createParamsValidator, PARAM_KEY };
