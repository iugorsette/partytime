const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

//middleware
const verifyToken = require("../helpers/check-token");

//helpers
const getUserByToken = require("../helpers/get-user-by-token");

router.get("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({ _id: id }, { password: 0 });
    res.json({ error: null, user });
  } catch (error) {
    return res.status(400).json({ error: "Usuário não existe" });
  }
});

router.put("/", verifyToken, async (req, res) => {
  const token = req.header("auth-token");
  const user = await getUserByToken(token);
  const userReqId = req.body.id;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  const userId = user._id.toString();

  if (userId != userReqId) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };

  //check if password matches
  if (password != confirmpassword) {
    return res.status(401).json({ error: "As senhas não conferem" });
  } else if (password == confirmpassword && password != null) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    updateData.password = passwordHash;
  }
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    );
    return res.json({
      error: null,
      msg: "Usuário atualizado com sucesso!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
