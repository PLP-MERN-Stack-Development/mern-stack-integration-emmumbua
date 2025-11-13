const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
  });

const sendTokenResponse = (user, res, statusCode = 200) => {
  const token = generateToken(user);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      data: {
        token,
        user,
      },
    });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const totalUsers = await User.countDocuments();
  const role = totalUsers === 0 ? 'admin' : 'customer';

  const user = await User.create({ name, email, password, role });
  const safeUser = user.toObject();
  delete safeUser.password;
  sendTokenResponse(safeUser, res, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const safeUser = user.toObject();
  delete safeUser.password;
  sendTokenResponse(safeUser, res, 200);
});

exports.logout = asyncHandler(async (req, res) => {
  res
    .cookie('token', null, {
      expires: new Date(0),
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
});

exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name || req.user.name,
    email: req.body.email || req.user.email,
  };

  if (req.body.password) {
    updates.password = req.body.password;
  }

  if (req.body.avatar) {
    updates.avatar = req.body.avatar;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.json({ success: true, data: updatedUser });
});

