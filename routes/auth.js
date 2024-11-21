const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../prisma");

router.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (!token) return next();

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    req.user = user;
    console.log(`req.user in auth *****:`, req.user)
    next();
  } catch (e) {
    next(e);
  }
});


router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});


router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(`req.body in login:`, req.body);
  try {
    const user = await prisma.user.login(username, password);
    console.log(`user in /login:`, user);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});


function authenticate(req, res, next) {
  console.log(`req.user:`, req.user);
  console.log(`req.headers:`, !req.headers.authorization.endsWith("{{login.response.body.token}}"))
  if (!req.headers.authorization.endsWith("{{login.response.body.token}}")) {
    next();
  } else {
    next({ 
      status: 404,
      message: "You must be logged in.",
    })
  }
}


module.exports = {
  router,
  authenticate,
};