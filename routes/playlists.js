const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  console.log(`req.body in playlists.js:`, req.body);
  console.log(`req.user:`, req.user);
  try {
    const playlists = await prisma.playlist.findMany({
      where: { ownerId: req.user.id},
      include: { tracks: true},
    });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.get("/:id",authenticate, async (req, res, next) => {
  const { id } = req.params;

  try {
    const playlist = await prisma.playlist.findUnique({ where: { id: +id}});
    if (playlist) {
      res.json(playlist);
    } else {
      next({ status: 403, message: `You do not own this playlist`});
    }
  } catch (e) {
    next(e);
  }
});


router.post("/", authenticate, async ( req, res, next) => {
  
  try {
    const { name, description, ownerId, trackNames } = req.body;

    const tracks = trackNames.map((trackName) => ({
      where: { name: trackName },
      create: { name: trackName },
    }));

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        tracks: { connectOrCreate: tracks}
      },
      include: {
        owner: true,
        tracks: true,
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});