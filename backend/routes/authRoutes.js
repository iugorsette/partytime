const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()

const User = require("../models/user.js");

router.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  if (
    name == null ||
    email == null ||
    password == null ||
    confirmpassword == null
  ) {
    return res
      .status(400)
      .json({ error: `Por favor preencha todos os campos` });
  }

  //check if password matches confirmation
  if (password != confirmpassword) {
    return res.status(400).json({ error: `As senhas não conferem` });
  }

  //check if email is already taken
  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    return res.status(400).json({ error: `E-mail já cadastrado` });
  }

  //hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    //save user
    await newUser.save();
    //create token
    const token = jwt.sign(
      {
        name: newUser.name,
        id: newUser._id,
      },
      process.env.JWT_SECRET
    );

    res.json({ rerro: null, msg: `Cadastro realizado com sucesso` , token: token , user: newUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    //check if password matches
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    //create token
    const token = jwt.sign(
      {
        name: user.name,
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.json({
      name: user.name,
      id: user._id,
      token: token,
    });
});

module.exports = router;
