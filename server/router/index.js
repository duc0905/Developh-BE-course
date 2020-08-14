const express = require("express");

const router = new express.Router();

// contact routes
const contactRouter = require("./contacts");
router.use("/api/contacts", contactRouter);

const authRoutes = require("./auth");
router.use("/api/auth", authRoutes);

module.exports = router;
