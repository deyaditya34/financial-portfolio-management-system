const httpError = require("http-errors");

const createParamsValidator =
  (params = [], paramskey) =>
  (req, res, next) => {
    const reqParams = Reflect.get(req, paramskey);

    const missingParams = params.filter(
      (param) => !Reflect.has(reqParams, param)
    );

    if (missingParams.length > 0) {
      throw new httpError.BadRequest(
        `Required fields '${missingParams.join(
          ","
        )}' are missing from '${paramskey}'`
      );
    }

    next();
  };

const PARAM_KEY = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
};

module.exports = { createParamsValidator, PARAM_KEY };
