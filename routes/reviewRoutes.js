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

router.route("/").get(getAllReviews).post(protect, setReviewsIDs, createReview);
router
  .route("/:id")
  .get(getReview)
  .patch(protect, setReviewsIDs, updateReview)
  .delete(protect, restrictTo("admin"), deleteReview);

module.exports = router;
