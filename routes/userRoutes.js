const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { signup } = require("../controllers/authController");
const { login } = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);

router.route(`/`).get(getAllUsers).post(createUser);

router.route(`/:id`).get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
