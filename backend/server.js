//modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//routes
const authRouter = require("./routes/authRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const partyRouter = require("./routes/partyRoutes.js");
// middleware

//config
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// atrelar rotas do express
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/party", partyRouter);

//conexao mongodb
mongoose.connect(
  `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBHOST}`,
  {
    dbName: process.env.DBNAME,
  }
);

app.get("/", (req, res) => {
  res.json({ message: "Rota teste" });
});

app.listen(port, () => {
  console.log(`O backend esta rodando na porta ${port}`);
});
