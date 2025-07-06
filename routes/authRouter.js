const express = require('express');
const passport = require('passport');
const {
  registerUser,
  renderLogin,
  renderRegister,
} = require('../controllers/authController');

require('../config/passport')(passport);

const router = express.Router();

router
  .get("/login", renderLogin)
  .get("/register", renderRegister)

router
  .post("/register", registerUser)
  .post("/login", passport.authenticate('local', {
    successRedirect: '/api/',
    failureRedirect: '/api/auth/login',
    failureFlash: true,
  }));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

router.get("/google/callback",passport.authenticate("google", {
    failureRedirect: "/api/auth/login",
  }),
  (req, res) => {
    res.render("index");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success_msg", "You have logged out successfully");
    res.redirect("/api/auth/login");
  });
});


module.exports = router;
