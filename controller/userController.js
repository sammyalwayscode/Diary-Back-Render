const usersModel = require("../model/userModel");
const cloudinary = require("../config/cloudinery");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const oldUser = await usersModel.findOne({ email });

    if (oldUser) {
      res.status(404).json({
        status: "User Already Exist",
      });
    } else {
      const cloudImage = await cloudinary.uploader.upload(req.file.path);

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = await usersModel.create({
        userName,
        email,
        password: hashed,
        avatar: cloudImage.secure_url,
        avatarID: cloudImage.public_id,
      });

      res.status(201).json({
        message: "User Created",
        data: user,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "Failed to Create User",
      data: error.message,
    });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
          expiresIn: process.env.EXPIRES,
        });
        const { password, ...info } = user._doc;
        // const data1 = user._doc

        res.status(201).json({
          status: "Signed In Sucessfully",
          data: { token, ...info },
        });
      } else {
        res.status(404).json({
          status: "Password Not Correct",
        });
      }
    } else {
      res.status(404).json({
        status: "User not Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "Failed to Sign In User",
      data: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const user = await usersModel.find();
    res.status(201).json({
      status: "Data Gotten Sucessfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed to Get Users",
      data: error.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const oneUser = await usersModel.findById(req.params.id);
    res.status(201).json({
      status: "User Goten!!!",
      data: oneUser,
    });
  } catch (error) {
    res.status(404).json({
      status: `Failed to get user with ID: ${req.params.id}`,
      data: error.message,
    });
  }
};

const updateSingleUser = async (req, res) => {
  try {
    const { userName } = req.body;
    const userUpdate = await usersModel.findByIdAndUpdate(
      req.params.id,
      { userName },
      { new: true }
    );

    res.status(201).json({
      status: "User Updated!!!",
      data: userUpdate,
    });
  } catch (error) {
    res.status(404).json({
      status: "Couldn't Perform Update",
      data: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDel = await usersModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "Deleted...",
      data: userDel,
    });
  } catch (error) {
    res.status.json({
      status: "Couldn't Delete...",
      data: error.message,
    });
  }
};

module.exports = {
  signUpUser,
  signInUser,
  getUsers,
  getSingleUser,
  updateSingleUser,
  deleteUser,
};
