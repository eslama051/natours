const { protect, restrictTo } = require("../controllers/authController");
const {
  getAllReviews,
  createReview,
  getReview,
  deleteReview,
  updateReview,
  setReviewsIDs,
} = require("../controllers/reviewController");

const router = require("express").Router({ mergeParams: true });

router.use(protect);
router.route("/").get(getAllReviews).post(setReviewsIDs, createReview);
router
  .route("/:id")
  .get(getReview)
  .patch(restrictTo("user", "admin"), setReviewsIDs, updateReview)
  .delete(restrictTo("user", "admin"), deleteReview);

module.exports = router;
