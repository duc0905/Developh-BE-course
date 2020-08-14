const Helper = require("../Helper");

module.exports.authenticate = (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.sendStatus(403);
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.sendStatus(403);
  }

  try {
    const decoded = Helper.verifyAccessToken(token);
    req.user = decoded.user;
    return next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
};
