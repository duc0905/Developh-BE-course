function errorHandler(err, req, res, next) {
  // log error if found
  console.error("___error-handler____");
  console.error(err);

  let message = err.message || "Something went wrong!";
  let name = err.name || "Server error!";
  let stack = err.stack || null;
  let code = err.statusCode || 500;

  res.status(code).json({
    name,
    message,
    stack,
  });
}

module.exports = errorHandler;
