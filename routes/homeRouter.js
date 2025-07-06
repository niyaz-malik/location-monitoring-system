const express = require('express');
const { showHomepage, showProfile } = require('../controllers/homeController');
const ensureAuthenticated = require('../middlewares/authenticate');
const router = express.Router();

router
.use(ensureAuthenticated);

router
.get("/", showHomepage)
.get("/profile", showProfile)


module.exports = router;