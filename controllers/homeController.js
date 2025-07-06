const showHomepage = function(req, res) {
    res.render("index");
}

const showProfile = function(req, res) {
    res.render("profile", {user: req.user});
}

module.exports = {
    showHomepage,
    showProfile,
}