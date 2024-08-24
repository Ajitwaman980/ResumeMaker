const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usermodel = require("./model/user");
const Resume = require("./model/resumedatabase");
const flash = require("connect-flash");
const verifyToken = require("./middleware/verifyuser");
const orignianlUrl = require("./middleware/originlurl");

// home route
router.get("/", function (req, res) {
  res.render("home.ejs");
});

router.get("/signUp", function (req, res) {
  res.render("index.ejs");
});
// sign up account
router.post("/signup/account", async function (req, res) {
  const { username, password, email, age } = req.body;
  try {
    if(await usermodel.findOne({email: email})){
      console.log("email id alredy eexit")
     req.flash('error',"user already exists login with your credentials"); 
     res.redirect("/login")

    }
    const user = new usermodel({ username, password, email, age });
    await user.save();
    const token = jwt.sign({ email }, "ajitwamanscret");
    console.log(token);
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.redirect(`/profile/${user._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up.");
  }
});

router.get("/login", function (req, res) {
  res.render("login.ejs", { error: req.flash("error") });
});
// login using jwt
router.post("/login/user", async function (req, res) {
  try {
    const user = await usermodel.findOne({ email: req.body.email });
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      req.flash("error", "Incorrect password");
      return res.redirect("/login");
    }

    const token = jwt.sign({ email: user.email }, "ajitwamanscret", {
      expiresIn: "1h",
    });
    console.log(token);
    res.cookie("token", token, {
      maxAge: 1 * 60 * 60 * 1000, //1 days
      secure: true,
    });
    req.flash(
      "success",
      `Welcome  ${user.username} You have successfully logged in`
    );
    res.redirect(`/profile/${user._id}`);
  } catch (err) {
    console.log("Error occurred: ", err);
    req.flash("error", "An error occurred during login");
    return res.redirect("/login");
  }
});
// profile
router.get("/profile/:id", verifyToken, async function (req, res) {
  try {
    const user = await usermodel.findById(req.params.id);
    // console.log(user);
    res.render("profile.ejs", { user, success: req.flash("success") });
  } catch (error) {
    console.log(error);
  }
});

// give the data to the client
router.post("/profile/:id/resume/submit", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);



  try {
    const newResume = new Resume({
      ...req.body,
      owner: userId, 
    });

    await newResume.save();
    console.log("Data stored successfully");
    res.redirect(`/profile/${userId}/resume/view`);
  } catch (err) {
    res.redirect(`/profile/${user._id}`);
    // console.log("Error storing data");
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// display resume
router.get("/profile/:id/resume/view", verifyToken, async (req, res) => {
  let id = req.params.id;
  // console.log("owner id ", id);
  try { //sorting using timestamp  -1 
    const resume = await Resume.findOne({ owner: req.params.id }).sort({createdAt: -1});
    // res.send(resume);
    console.log("resume id ", resume._id);
    res.render("resumetemplate", { resume: resume });
  } catch (err) {
    res.redirect(`/profile/${user._id}`);
    console.log(err);
  }
});
// edit the resume
router.get(
  "/profile/:id/resume/:resumeId/edit",
  verifyToken,
  async function (req, res) {
    console.log("this is id of your resume ", req.params.resumeId);
    let resumeId = req.params.resumeId;
    let id = req.params.id;
    console.log("user is", id);

    try {
      let resume = await Resume.findById(resumeId);
      // console.log("user id ", resume.owner.id);
      // console.log(resume.id);
      res.render("edit", { resume });
    } catch (err) {
      console.log("error editing", err);
      res.status(500).send("Error editing resume");
    }
  }
);
router.put("/profile/:id/resume/:resumeId/edit", async (req, res) => {
  const updatedData = req.body;
  console.log(updatedData);
  const id = req.params.id;
  const resumeId = req.params.resumeId;

  try {
    console.log("problem");
    const update_editid_Data = await Resume.findByIdAndUpdate(
      resumeId,
      updatedData
    );
    await update_editid_Data.save(true);
    res.redirect(`/profile/${id}/resume/view`);
  } catch (err) {
    console.log(err);
    res.render("error");
    console.log("error in updating the data");
  }
});
router.get("/profile/:id/resume/:resumeId/delete", async (req, res) => {
  try {
    const deletedData = await Resume.findOneAndDelete(req.params.resumeId);
    if (deletedData) {
      res.redirect(`/profile/${req.params.id}`);
    } else {
      res.status(404).send("Resume not found");
    }
  } catch (err) {
    res.render("error");
    console.log("something went wrong");
  }
});
// logout route
router.get("/logout", verifyToken, function (req, res) {
  console.log("user logout ");
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
