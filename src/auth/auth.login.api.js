const buildApiHandler = require("../api-utils/build-api-handler");
const authService = require("./auth.service");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { username, password } = req.body;

  const token = await authService.loginUser(username, password);

  res.json({
    success: true,
    data: {
      username,
      token,
    },
  });
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([missingParamsValidator, controller]);
