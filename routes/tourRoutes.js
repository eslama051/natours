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

router.route(`/`).get(protect, getAllTours).post(createTour);
router
  .route(`/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide", "user"), deleteTour);

// creata a review

module.exports = router;
