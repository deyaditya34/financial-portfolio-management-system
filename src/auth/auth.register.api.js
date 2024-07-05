const buildApiHandler = require("../api-utils/build-api-handler");

const authService = require("./auth.service");
const { validateUsername } = require("./auth.utils");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { username, password } = req.body;

  await authService.registerUser(username, password);

  res.json({
    success: true,
    data: username,
  });
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  missingParamsValidator,
  validateUsername,
  controller,
]);
