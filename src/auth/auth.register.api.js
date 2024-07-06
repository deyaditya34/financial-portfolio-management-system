const buildApiHandler = require("../api-utils/build-api-handler"); // utility module to handle the api handlers
const authService = require("./auth.service"); // service module for authentication related operations
const { validateUsername } = require("./auth.utils"); // middleware function to validate the username and password
const paramsValidator = require("../middlewares/params-validator"); // middle function to validate the required params for the api

// main function to handle the http request for registration
async function controller(req, res) {
  const { username, password } = req.body;

  await authService.registerUser(username, password);

  res.json({
    success: true,
    data: username,
  });
}

// This middleware function validates the required request params in the required req component 
const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

// Exporting the api handler to be used in the authorisation router
module.exports = buildApiHandler([
  missingParamsValidator,
  validateUsername,
  controller,
]);
