var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose
  .connect("mongodb://127.0.0.1/jwtauth", {})
  .then(function () {
    console.log("Connected to the database connected");
  })
  .catch((error) => console.error("Could not connect to MongoDB", error));

//   userschema
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },

  age: Number,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    console.log("password modifed repeat");
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

let user = mongoose.model("User", userSchema);
module.exports = user;
