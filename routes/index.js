var express = require("express");
var router = express.Router();
const userModel = require("./users");
const localStrategy = require("passport-local");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const upload = require("./multer");
const todoModel = require("./todo");

passport.authenticate(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", isuserLoggedin, function (req, res, next) {
  const reg = req.flash("regUserError") || "";
  const success = req.flash("success") || "";

  res.render("index", {
    reg: reg,
    error: req.flash("error"),
    success: success,
  });
});
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel
    .findOne({ username: req.session.passport.user })
    .populate("todo");
  res.render("profile", {
    username: req.user.username,
    user: user,
  });
});
router.post(
  "/upload",

  upload.single("file"),
  function (req, res, next) {
    if (!req.file) {
      res.status(404).send("No file uploaded");
    }
    res.send("Profile Updated");
  }
);
router.post("/addtask", isLoggedIn, async function (req, res, next) {
  try {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    const todoData = await todoModel.create({
      task: req.body.task,
      user: user._id,
    });

    user.todo.push(todoData._id);
    await user.save();

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    // Handle the error appropriately, e.g., send an error response to the client
    res.status(500).send("Internal Server Error");
  }
});
router.post("/deletetask", isLoggedIn, async function (req, res, next) {
  try {
    const wantDltTask = req.body.dltTask;

    // Delete from todoModel
    await todoModel.deleteOne({ _id: wantDltTask });
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    await userModel.updateOne(
      { _id: user._id },
      { $pull: { todo: wantDltTask } }
    );
    console.log(wantDltTask);

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/checktask", isLoggedIn, async function (req, res, next) {
  try {
    const wantCheckTask = req.body.checkTask;
    const wantUpdTaskStatus = req.body.updTaskStatus;
    const todoData = await todoModel.findOne({ _id: wantCheckTask });
    if (todoData.taskCompleted == true) {
      // Update todoModel
      await todoModel.updateOne(
        { _id: wantCheckTask },
        { taskCompleted: false } // Set taskCompleted to false
      );
    } else {
      // Update todoModel
      await todoModel.updateOne(
        { _id: wantCheckTask },
        { taskCompleted: true } // Set taskCompleted to true
      );
    }
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const existingUser = await userModel.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      // User with this username already exists
      req.flash("regUserError", "Username already exists.");
      return res.redirect("/");
    }

    // Continue with the registration process if the username is available

    const user = new userModel({
      username: req.body.username,
      email: req.body.email,
      // You might want to hash the password before storing it in the database
      // For example, using bcrypt: https://www.npmjs.com/package/bcrypt
      password: req.body.password,
    });

    await userModel.register(user, req.body.password);

    // Redirect to the profile page without additional authentication
    req.flash("success", "Registration successful! You can now log in.");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    req.flash(
      "error",
      "An error occurred during registration. Please try again."
    );
    res.redirect("/"); // Redirect to the homepage with an error flash message
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/",
    failureFlash: true,
  })
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
function isuserLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
  res.redirect("/");
}
function capitalizeFirstLetter(username) {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

module.exports = router;
