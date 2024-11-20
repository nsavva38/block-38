const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(201).send({
      message: "Found all users", users
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +id
      }
    });
    if(user) {
      res.json(user);
    } else {
      next({
        status: 404,
        message: `User with id ${id} does not exist`
      });
    }
  } catch (e) {
    next(e);
  }
});