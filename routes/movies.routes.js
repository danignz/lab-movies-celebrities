// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.render("movies/movies", { movies });
  } catch (error) {
    next(error);
  }
});

router.get("/create", async (req, res, next) => {
  try {
    const celebrities = await Celebrity.find({});
    res.render("movies/new-movie", { celebrities });
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  try {
    await Movie.create({ title, genre, plot, cast });
    res.redirect("/movies");
  } catch (error) {
    next(error);
    res.redirect("/movies/create");
  }
});

router.post("/:movieId/delete", async (req, res, next) => {
  const { movieId } = req.params;
  try {
    await Movie.findByIdAndRemove(movieId);
    res.redirect("/movies");
  } catch (error) {
    next(error);
  }
});

router.get("/:movieId/edit", async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    const celebrities = await Celebrity.find({}).lean();

    celebrities.forEach((celebrity) => {
      movie.cast.forEach((cel) => {
        if (cel.toString() === celebrity._id.toString()) {
          celebrity.worksInMovie = true;
        }
      });
    });

    res.render("movies/edit-movie", { movie, celebrities });
  } catch (error) {
    next(error);
  }
});

router.post("/:movieId", async (req, res, next) => {
  const { movieId } = req.params;
  const { title, genre, plot, cast } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      { title, genre, plot, cast },
      { new: true }
    );
    console.log("Just updated:", updatedMovie);
    res.redirect(`/movies/${movieId}`);
  } catch (error) {
    next(error);
  }
});

router.get("/:movieId", async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId).populate("cast");
    res.render("movies/movie-details", movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
