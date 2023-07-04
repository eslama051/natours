const { protect, restrictTo } = require("../controllers/authController");
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = require("express").Router({ mergeParams: true });

router.route("/").get(getAllReviews).post(protect, createReview);
router
  .route("/:id")
  .get(getReview)
  .delete(protect, restrictTo("admin"), deleteReview);

module.exports = router;
