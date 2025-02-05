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
  // the password that the user typed in
  const { username, password } = req.body;

  // the hashed password
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      res.status(500).send({ message: "This user already exists" });
      return;
    }

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

app.post("/login", async (req, res, next) => {
  // get the username, password
  // try to find unique for username
  const { password, username } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    res.status(401).send({
      message: "No user found. Create account instead.",
    });
  } else {
    // check if their password was correct
    // takes in two args
    // 1. the unhashed password (the password that user typed in in the UI)
    // 2. the hashed password (the password stored in the database)
    // it tells you whether they typed in the correct password or not
    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    // if it is, cool! send the user token
    if (isCorrectPassword) {
      const token = jwt.sign(user, "LUNA");

      res.send(token);
    } else {
      // if it's not correct, send an error saying wrong password
      // 401 means 'unauthorized'
      res.status(401).send({ message: "Incorrect password" });
    }
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

  if (user) {
    // 3. send the user data
    res.send(user);
  } else {
    res.sendStatus(401);
  }
});

app.listen(3000);
