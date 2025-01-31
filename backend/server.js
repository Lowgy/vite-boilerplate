const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(newUser, "LUNA");

    res.send(token);
  } catch (error) {
    next(error);
  }
});

// if you make a get request to /account
// with the `token`, that means you can get my user data
app.get("/account", async (req, res, next) => {
  // 1. take in the token
  const token = req.headers.authorization;

  // 2. decode the token to figure out who this token belongs to (who is the logged in user)
  // what is a token?
  // a string that is "encrypted". and it can be "decrypted" to get the user
  const user = jwt.decode(token, "LUNA");

  // 3. send the user data
  res.send(user);
});

app.listen(3000);
