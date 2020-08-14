const Model = require("../database");

const userSchema = {
  username: "string",
  password: "string",
  contacts: "array",
};

module.exports = new Model("users", userSchema);
