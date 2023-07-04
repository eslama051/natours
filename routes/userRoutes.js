const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require("../controllers/userController");

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/update-password", protect, updatePassword);
router.post("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.route(`/`).get(getAllUsers).post(createUser);
router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
