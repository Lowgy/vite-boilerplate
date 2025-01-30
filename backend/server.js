const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3000);
