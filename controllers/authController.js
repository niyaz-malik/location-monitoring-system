const expressAsyncHandler = require("express-async-handler");
const User = require('../models/user-model');

const registerUser = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.redirect('/api/auth/login');
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    req.login(newUser, (err) => {
        if (err) return next(err);
        res.redirect("/api/");
    });

});

const renderLogin = (req, res) => {
    res.render("login");
};

const renderRegister = (req, res) => {
    res.render("register");
};


module.exports = {
    registerUser,
    renderLogin,
    renderRegister,
}