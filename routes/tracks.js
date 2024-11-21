const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const track = await prisma.track.findUnique({
      where: { id: +id }
    });
    if (track) {
      res.json(track);
    } else {
      next({
        status: 404,
        message: `Track with id ${id} does not exist`
      })
    }
  } catch (e) {
    next(e);
  }
});


router.get('/all/tracks', authenticate, async(req, res, next)=> {
  const { id } = req.user;

  try{
    const tracks = await prisma.playlist.findMany({
      where: { ownerId: +id},
      select: {
        tracks: true,
      },
    })
    res.status(201).send({message: 'tracks found!', tracks});

  }catch(err){
    console.error('couldnt get all tracks', err);
  }


})

router.get("/all/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  console.log('THE USER: ',req.user);

  try {
    const track = await prisma.track.findUnique({ where: { id: +id}});
    console.log(`track from track.js:`, track);
    if (track) {
      res.json(track);
    } else {
      next({ status: 403, message: `You do not own this track`});
    }
  } catch (e) {
    next(e);
  }
});