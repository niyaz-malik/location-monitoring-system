require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const errorHandler = require('./middlewares/errorHandler');
const homeRouter = require('./routes/homeRouter');
const authRouter = require('./routes/authRouter');
const connectDB = require('./config/db-connection');
require('./config/passport')(passport);

const app = express();
connectDB();

const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api", homeRouter);

app.use(errorHandler);

io.on('connection', (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", {id: socket.id, ...data});
    })
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
