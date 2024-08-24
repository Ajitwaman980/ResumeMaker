const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    // console.log("A token is required for authentication");
    req.flash("error", "user not logged in");
    res.redirect("/login");
  }
  try {
    // decode the token to verify the user
    const decode = jwt.verify(token, "ajitwamanscret");
    // req.user = decode;
    res.locals.currentUser = decode;
  } catch (err) {
    // console.error("JWT verification failed:", err);
    req.flash("error", err.message);
    return res.redirect("/login");
  }
  next();
}
module.exports = verifyToken;
