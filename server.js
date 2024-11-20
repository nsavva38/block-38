const express = require("express");
const app = express();
const PORT = 3000;
require("dotenv").config();

app.use(require("morgan")("dev"));
app.use(express.json());

app.use("/auth", require("./routes/auth").router);
app.use("/users", require("./routes/users"));
app.use("/playlists", require("./routes/playlists"));
app.use("/tracks", require("./routes/tracks"));



app.use((req, res, next) => {
  next({
    status: 404,
    message: "Endpoint not found"
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong");
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})