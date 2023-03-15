const { generateToken } = require("../config/jsonWebToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { mongoValidateId } = require("../utils/validateMongoDB");
const { genarateeRfreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

//regester new user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exist");
  }
});

//login user function
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });

  if (findUser && (await findUser.isPasswordmatched(password))) {
    const refreshToken = await genarateeRfreshToken(findUser?.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      {
        naw: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      id: findUser?.id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?.id),
    });
  } else {
    throw new Error("Invalid credential");
  }
});

//reftsh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken)
    throw new Error("No refresh Token Found Or Not Matched In cookie");

  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({
    refreshToken,
  });
  if (!user) throw new Error("No Refersh In DB");
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Can't Refresh User Token");
    }
    const accesToken = genarateeRfreshToken(user?.id);
    res.json({ accesToken });
  });
});

//logout User
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error("No refresh Token Found Or Not Matched In cookie");
  const refreshToken = cookie.refreshToken;

  const user = await User.findOne({
    refreshToken,
  });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

// Update a User
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  mongoValidateId(id);
  try {
    const UpdateUserInfo = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(UpdateUserInfo);
  } catch (error) {
    throw new Error(error);
  }
});

//get ALL User
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find();
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
});

//get single id
const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const getUserById = await User.findById(id);
    res.json({
      getUserById,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const deleteUserById = await User.findByIdAndDelete(id);
    res.json({
      deleteUserById,
    });
  } catch (error) {
    throw new Error(error);
  }
});
//block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        naw: true,
      }
    );
    res.json(blockUser);
  } catch (error) {
    throw new Error(error);
  }
});
//unblock user
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  mongoValidateId(id);
  try {
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        naw: true,
      }
    );
    res.json(unBlockUser);
  } catch (error) {
    throw new Error(error);
  }
});

//update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  mongoValidateId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Not found with this email");
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `Hi , Please follow this link to reset your password. the link is valid 10 minute till now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click here</a>`;

    //create data object for email
    const data = {
      to: email,
      subject: "Forget Password Link",
      text: "Hey User",
      html: resetUrl,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPasswordToken = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, Please Try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  user.save();
  res.json(user);
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgetPasswordToken,
  resetPasswordToken,
};
