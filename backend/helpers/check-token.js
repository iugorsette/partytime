const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({ error: "Acesso Negado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error:"O token é inválido" });
  }
};

module.exports = checkToken;