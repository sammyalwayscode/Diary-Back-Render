const express = require("express");
const router = express.Router();
const { image } = require("../config/multer");
const {
  createDiary,
  getDiary,
  getSingleDiary,
  updateDiary,
  deleteDiary,
  searchDiary,
  paginate,
} = require("../controller/diaryController");

router.route("/diary/:id").post(image, createDiary);
router.route("/diary/:id").get(getDiary);
router.route("/search").get(searchDiary);
router.route("/page").get(paginate);
router
  .route("/diary/:id/:diary")
  .get(getSingleDiary)
  .patch(updateDiary)
  .delete(deleteDiary);

module.exports = router;
