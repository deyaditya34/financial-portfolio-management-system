const buildApiHandler = require("../api-utils/build-api-handler"); // utility module to handle the api handlers of the api
const authService = require("./auth.service"); // service module to handle the authentication related operations
const paramsValidator = require("../middlewares/params-validator"); // middleware function to validate the required params in the request

// Main function of the api to handle the HTTP request for login
async function controller(req, res) {
  const { username, password } = req.body;

  // This function validates the token and if validated returns a token
  const token = await authService.loginUser(username, password);

  res.json({
    success: true,
    data: {
      username,
      token,
    },
  });
}

// This middleware function validates the required request params in the required req component
const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

// Exporting the api handler to be used by the authentication router
module.exports = buildApiHandler([missingParamsValidator, controller]);
