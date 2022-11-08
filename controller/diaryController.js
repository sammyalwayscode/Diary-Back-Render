const diaryModel = require("../model/diaryModel");
const cloudinery = require("../config/cloudinery");
const usersModel = require("../model/userModel");
const mongoose = require("mongoose");

const createDiary = async (req, res) => {
  try {
    const { title, message } = req.body;
    const cloudImg = await cloudinery.uploader.upload(req.file.path);

    const getUser = await usersModel.findById(req.params.id);
    const getDiary = await new diaryModel({
      title,
      message,
      image: cloudImg.secure_url,
      imageID: cloudImg.public_id,
    });

    getDiary.user = getUser;
    getDiary.save();

    getUser.diary.push(mongoose.Types.ObjectId(getDiary._id));
    getUser.save();

    res.status(201).json({
      status: "Diary Created!!!",
      data: getDiary,
    });
  } catch (error) {
    res.status(404).json({
      // status: "Failed to create Diary",
      data: error.message,
    });
  }
};

const getDiary = async (req, res) => {
  try {
    const getUser = await usersModel.findById(req.params.id).populate("diary");
    res.status(201).json({
      status: "Your Diaries...",
      data: getUser,
    });
  } catch (error) {
    res.status(404).json({
      status: "Couldn't get Diary",
      data: error.message,
    });
  }
};

const getSingleDiary = async (req, res) => {
  try {
    const diaryData = await diaryModel.findById(req.params.diary);
    res.status(201).json({
      status: "Diary Found",
      data: diaryData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed to get Diary",
      data: error.message,
    });
  }
};

const updateDiary = async (req, res) => {
  try {
    const { title, message } = req.body;
    const updateData = await diaryModel.findByIdAndUpdate(
      req.params.diary,
      { title, message },
      { new: true }
    );

    res.status(201).json({
      status: "Updated!!!",
      data: updateData,
    });
  } catch (error) {
    res.status(404).json({
      status: "Couldn't Perform update",
      data: error.message,
    });
  }
};

const deleteDiary = async (req, res) => {
  try {
    const getUser = await usersModel.findById(req.params.id);
    const removeDiary = await diaryModel.findByIdAndRemove(req.params.diary);

    getUser.diary.pull(removeDiary);
    getUser.save();

    res.status(201).json({
      status: "Diary Deleted",
      data: getUser,
    });
  } catch (error) {
    res.status(404).json({
      status: "Couldn't Perform delete Operation",
      data: error.message,
    });
  }
};

const searchDiary = async (req, res) => {
  try {
    const makeSearch = req.query.search
      ? {
          title: { $regex: req.query.search, $options: "i" },
        }
      : {};

    const allItems = await diaryModel.find(makeSearch);

    res.status(201).json({
      message: "Search Sucessful",
      data: allItems,
    });
  } catch (error) {
    res.status(404).json({
      message: "Couldn't Perform Search",
      data: error.message,
    });
  }
};

const paginate = async (req, res) => {
  try {
    const { pages, limit } = req.query;

    const allItem = await diaryModel
      .find()
      .limit(limit)
      .skip((pages - 1) * limit);

    res.status(200).json({
      message: "Stack Success",
      total: allItem.length,
      data: allItem,
    });
  } catch (error) {
    res.status(404).json({
      message: "Stack Failed",
      data: error.message,
    });
  }
};

module.exports = {
  createDiary,
  getDiary,
  getSingleDiary,
  updateDiary,
  deleteDiary,
  searchDiary,
  paginate,
};
