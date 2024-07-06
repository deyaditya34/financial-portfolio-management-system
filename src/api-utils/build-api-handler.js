// This function wraps the api handler functions with error handling and creates an array of wrapped handlers
function buildApiHandler(handlers = []) {
  return handlers.map((handlerFn) => wrapErrorHandling(handlerFn));
}

/**  This functions makes the api handlers asynchronous, wraps each of the handlers 
 with error handling and in case if error occurs pass it to the next middleware function(error handler) 
 */
const wrapErrorHandling = (apiHandler) => async (req, res, next) => {
  try {
    await apiHandler(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Exporting the function to be used in other part of the application
module.exports = buildApiHandler;
