const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");
const {
  signUpUser,
  signInUser,
  getUsers,
  getSingleUser,
  updateSingleUser,
  deleteUser,
} = require("../controller/userController");

router.route("/user/signup").post(upload, signUpUser);
router.route("/user/signin").post(signInUser);
router.route("/users").get(getUsers);
router
  .route("/user/:id")
  .get(getSingleUser)
  .patch(upload, updateSingleUser)
  .delete(deleteUser);

module.exports = router;
