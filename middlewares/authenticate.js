function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect("/api/auth/login");
  }
}

module.exports = ensureAuthenticated;
