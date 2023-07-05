const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require("../controllers/userController");

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

// protect all routes that comes after this middelware
router.use(protect);

router.patch("/update-password", updatePassword);
router.get("/Me", getMe, getUser);
router.post("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

// only admins can access these routes
router.use(restrictTo("amdin"));

router.route(`/`).get(getAllUsers).post(createUser);

router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
