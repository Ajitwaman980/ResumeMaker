const orignianlUrl = (req, res, next) => {
  res.locals.orignianlUrl = req.session.orignianlUrl;
};
module.exports = orignianlUrl;
