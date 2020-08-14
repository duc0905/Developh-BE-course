const Model = require("../database");

const contactSchema = {
  name: "string",
  email: "string",
  phone: "string",
  location: "string",
  owner: "string",
};

module.exports = new Model("contacts", contactSchema);
