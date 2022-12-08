const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

export default isLoggedIn;
