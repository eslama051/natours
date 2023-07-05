const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");
const router = require("express").Router();

const reviewRouter = require("./reviewRoutes");

// nested routes
// const {
//   createReview,
//   getAllTourReviews,
// } = require("../controllers/reviewController");
// router
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview)
//   .get(getAllTourReviews);

router.use("/:tourId/reviews", reviewRouter);

router
  .route(`/`)
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route(`/:id`)
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// creata a review

module.exports = router;
