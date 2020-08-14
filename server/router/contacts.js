const express = require("express");
const router = new express.Router();

const User = require("../models/User");
const Contact = require("../models/Contact");
const { authenticate } = require("../middlewares/authenticate");

router.use(authenticate);

router.get("/", (req, res) => {
  const user = User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(400);

  const contacts = Contact.find({ owner: user.username });
  return res.json(contacts);
});

router.post("/", (req, res) => {
  const user = User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(400);

  const newContact = Contact.create({ ...req.body, owner: user.username });
  const userDoc = User.findById(user.id);
  User.findByIdAndUpdate(userDoc.id, {
    contacts: [...userDoc.contacts, newContact.id],
  });

  return res.status(200).json(newContact);
});

router.put("/:id", (req, res) => {
  const user = User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(400);

  const id = req.params.id;
  const userDoc = User.findById(user.id);
  if (!userDoc.contacts.includes(id)) return res.sendStatus(403);

  const contactDoc = Contact.findByIdAndUpdate(id, req.body);
  return res.status(200).json(contactDoc);
});

router.delete("/:id", (req, res) => {
  const user = User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(400);

  const id = Number(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ message: "Invalid id: " + req.params.id });

  const userDoc = User.findById(user.id);
  if (!userDoc.contacts.map((e) => String(e)).includes(String(id)))
    return res.sendStatus(403);

  Contact.findByIdAndDelete(id);
  User.findByIdAndUpdate(userDoc.id, {
    contacts: userDoc.contacts.filter((contactId) => contactId !== id),
  });

  return res.sendStatus(200);
});

router.get("/search", (req, res) => {
  const user = User.findOne({ username: req.user.username });
  if (!user) return res.sendStatus(400);

  const contacts = Contact.find({ ...req.query, owner: user.username });
  return res.json(contacts);
});

module.exports = router;
