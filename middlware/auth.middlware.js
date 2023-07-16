const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports =  authMiddlware = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log(token);
    if (!token) res.status(401).json({ msg: "not authorized" });
    else {
      const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET);
      console.log(verifyToken);
      req.personID = verifyToken.id;
      next();
    }
  } catch (error) {
    res.status(500).json({ msg: "something went wrong", error: error.message });
  }
};
  